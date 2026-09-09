import {compareIds,freeze,requireId,requireInteger} from '../shared/values.mjs';
import {placeFootprintsWithin,variation} from './layout.mjs';
import {createNavigationWorld} from './navigation.mjs';
import {cellIdentity,edgeIdentity} from './visibility.mjs';

const cellKey=c=>JSON.stringify([c.surfaceId,c.x,c.y]);
const inside=(cell,rect)=>cell.surfaceId===rect.surfaceId&&cell.x>=rect.x&&cell.y>=rect.y&&cell.x<rect.x+rect.width&&cell.y<rect.y+rect.height;
const samePair=(a,b,c,d)=>(cellKey(a)===cellKey(c)&&cellKey(b)===cellKey(d))||(cellKey(a)===cellKey(d)&&cellKey(b)===cellKey(c));
const copyRect=(rect,surfaceId)=>freeze({id:rect.id,surfaceId,x:rect.x,y:rect.y,width:rect.width,height:rect.height});
const navCell=(surfaceId,x,y)=>freeze({surfaceId,x,y});

function entryForRect(rect,region,surface,otherRects,seed,id) {
  const candidates=[];
  const add=(side,approach,threshold)=>{
    if(approach.x<0||approach.y<0||approach.x>=surface.width||approach.y>=surface.height)return;
    if(!inside(approach,region)||otherRects.some(other=>inside(approach,other)))return;
    candidates.push({side,approach,threshold});
  };
  for(let x=rect.x;x<rect.x+rect.width;x++){
    add('north',navCell(rect.surfaceId,x,rect.y-1),navCell(rect.surfaceId,x,rect.y));
    add('south',navCell(rect.surfaceId,x,rect.y+rect.height),navCell(rect.surfaceId,x,rect.y+rect.height-1));
  }
  for(let y=rect.y;y<rect.y+rect.height;y++){
    add('west',navCell(rect.surfaceId,rect.x-1,y),navCell(rect.surfaceId,rect.x,y));
    add('east',navCell(rect.surfaceId,rect.x+rect.width,y),navCell(rect.surfaceId,rect.x+rect.width-1,y));
  }
  if(candidates.length){
    candidates.sort((a,b)=>{
      const ak=`${a.side}:${a.threshold.x}:${a.threshold.y}`,bk=`${b.side}:${b.threshold.x}:${b.threshold.y}`;
      return variation(seed,`${id}:${ak}`,'entry-candidate')-variation(seed,`${id}:${bk}`,'entry-candidate')||compareIds(ak,bk);
    });
    return freeze(candidates[0]);
  }
  throw new RangeError(`No enclosure entry fits: ${id}`);
}
function barriersForRect(rect,door,surface) {
  const result=[];
  const add=(a,b)=>{if(a.x<0||a.y<0||b.x<0||b.y<0||a.x>=surface.width||b.x>=surface.width||a.y>=surface.height||b.y>=surface.height)return;if(!samePair(a,b,door.approach,door.threshold))result.push({from:a,to:b});};
  for(let x=rect.x;x<rect.x+rect.width;x++){
    add(navCell(rect.surfaceId,x,rect.y-1),navCell(rect.surfaceId,x,rect.y));
    add(navCell(rect.surfaceId,x,rect.y+rect.height-1),navCell(rect.surfaceId,x,rect.y+rect.height));
  }
  for(let y=rect.y;y<rect.y+rect.height;y++){
    add(navCell(rect.surfaceId,rect.x-1,y),navCell(rect.surfaceId,rect.x,y));
    add(navCell(rect.surfaceId,rect.x+rect.width-1,y),navCell(rect.surfaceId,rect.x+rect.width,y));
  }
  return result;
}
function rootGeometry(demand,margin,minSize) {
  const reservations=demand.rootReservations;
  if(!reservations.length)return {surface:{id:demand.rootId,width:minSize,height:minSize,blocked:[]},rects:new Map(),shift:{x:0,y:0}};
  const minX=Math.min(...reservations.map(r=>r.x)),minY=Math.min(...reservations.map(r=>r.y));
  const maxX=Math.max(...reservations.map(r=>r.x+r.width)),maxY=Math.max(...reservations.map(r=>r.y+r.height));
  const shift={x:margin-minX,y:margin-minY},width=Math.max(minSize,maxX-minX+margin*2),height=Math.max(minSize,maxY-minY+margin*2);
  const rects=new Map(reservations.map(r=>[r.id,copyRect({...r,x:r.x+shift.x,y:r.y+shift.y},demand.rootId)]));
  return {surface:{id:demand.rootId,width,height,blocked:[]},rects,shift};
}

/**
 * Compile a ready spatial-demand plan into deterministic rectangular geometry,
 * wall/door/stair topology and artifact locations. Structure pixels are styling
 * inputs only; topology comes from qualified capability switches + explicit
 * presentation layout, never from generated sprite slot order.
 */
export function assembleSpatialWorld(demand,options={}) {
  if(demand?.kind!=='playthings-spatial-demand')throw new TypeError('Use planSpatialDemand first');
  const seed=requireId(options.seed??'playthings-world','seed');
  const rootMargin=requireInteger(options.rootMargin??2,'rootMargin',1),rootMinSize=requireInteger(options.rootMinSize??17,'rootMinSize',3);
  const maxSurfaceCells=requireInteger(options.maxSurfaceCells??250_000,'maxSurfaceCells',1);
  if(demand.status!=='ready')return freeze({kind:'playthings-spatial-world',status:'blocked',demand,world:null,locations:Object.freeze({}),geometry:Object.freeze([]),findings:[...demand.findings],
    spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:false,geometryQualified:false,semanticPixelsQualified:false,
    boundary:'Spatial demand must be ready before geometry/topology can be compiled.'});
  const findings=[],byId=new Map(demand.nodes.map(n=>[n.id,n])),root=byId.get(demand.rootId);
  if(!root)throw new TypeError('Spatial demand lacks Root node');
  if(root.children.length!==demand.rootReservations.length)return freeze({kind:'playthings-spatial-world',status:'blocked',demand,world:null,locations:Object.freeze({}),geometry:Object.freeze([]),findings:[{severity:'warning',code:'assembly.root-reservation-incomplete'}],
    spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:false,geometryQualified:false,semanticPixelsQualified:false,boundary:'Every Root spatial child requires a reservation.'});

  const rootBuilt=rootGeometry(demand,rootMargin,rootMinSize),surfaceSpecs=new Map([[demand.rootId,rootBuilt.surface]]),outerRects=new Map(rootBuilt.rects);
  const homeRegions=new Map([[demand.rootId,{surfaceId:demand.rootId,x:0,y:0,width:rootBuilt.surface.width,height:rootBuilt.surface.height,excludedRects:[]}]]),homeEntries=new Map([[demand.rootId,navCell(demand.rootId,0,0)]]);
  const ownership={surfaces:Object.create(null),links:Object.create(null),barriers:Object.create(null),blocked:Object.create(null)};
  ownership.surfaces[demand.rootId]=[];
  const geometry=new Map(),barriers=[],links=[],blockedBySurface=new Map([[demand.rootId,new Set()]]);
  let surfaceCells=rootBuilt.surface.width*rootBuilt.surface.height;
  for(const node of demand.nodes)if(node.id!==demand.rootId&&node.capabilities.surface) {
    const width=node.footprint.width,height=node.footprint.height;surfaceCells+=width*height;
    if(!Number.isSafeInteger(surfaceCells)||surfaceCells>maxSurfaceCells)findings.push({severity:'warning',code:'assembly.surface-cell-budget',id:node.id});
    ownership.surfaces[node.id]=[node.id];
    surfaceSpecs.set(node.id,{id:node.id,width,height,blocked:[]});blockedBySurface.set(node.id,new Set());
    homeRegions.set(node.id,{surfaceId:node.id,x:0,y:0,width,height,excludedRects:[]});homeEntries.set(node.id,navCell(node.id,0,0));
  }
  if(findings.length)return freeze({kind:'playthings-spatial-world',status:'blocked',demand,world:null,locations:Object.freeze({}),geometry:Object.freeze([]),findings,
    spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:false,geometryQualified:false,semanticPixelsQualified:false,boundary:'Surface budget exceeded before topology allocation.'});

  // Root reservations are explicit outer placements. Internal horizontal children
  // are packed inside their resolved spatial home's common region.
  for(const id of root.children){const rect=outerRects.get(id);homeRegions.get(demand.rootId).excludedRects.push(rect);}
  const visit=(parent)=>{
    const region=homeRegions.get(parent.id);if(!region)throw new TypeError(`Spatial home region unavailable: ${parent.id}`);
    const levelSet=new Set(parent.capabilities.structure?(parent.internalSurfaceOrder??[]):[]);
    const horizontal=parent.children.filter(id=>!levelSet.has(id));
    if(parent.id!==demand.rootId&&horizontal.length) {
      const requests=horizontal.map(id=>{const child=byId.get(id);return {id,width:child.footprint.width,height:child.footprint.height,order:child.historicalTimeMs};});
      let packed,growth=0;
      for(;;){
        packed=placeFootprintsWithin(requests,{seed:`${seed}:${parent.id}`,x:region.x,y:region.y,width:region.width,height:region.height,margin:0,gap:1,
          maxCandidates:options.maxCandidates??100_000,maxTotalCandidates:options.maxTotalCandidates??200_000});
        if(packed.placements.length===requests.length||!parent.capabilities.surface||growth>=(options.maxSurfaceGrowth??64))break;
        const spec=surfaceSpecs.get(parent.id),oldCells=spec.width*spec.height;
        if(spec.width<=spec.height){spec.width+=1;region.width+=1;}else{spec.height+=1;region.height+=1;}
        const newCells=spec.width*spec.height;surfaceCells+=newCells-oldCells;growth+=1;
        if(surfaceCells>maxSurfaceCells){packed={placements:packed.placements,findings:[...packed.findings,{id:parent.id,code:'assembly.surface-cell-budget',severity:'warning'}]};break;}
      }
      if(growth)findings.push({severity:'info',code:'assembly.surface-expanded',id:parent.id,width:region.width,height:region.height,growth});
      findings.push(...packed.findings.map(f=>({...f,id:f.id,parentId:parent.id})));
      for(const placed of packed.placements) {
        const rect=copyRect(placed,region.surfaceId);outerRects.set(placed.id,rect);region.excludedRects.push(rect);
      }
    }
    for(const childId of parent.children) {
      const child=byId.get(childId),isLevel=levelSet.has(childId),rect=outerRects.get(childId);
      if(!isLevel&&!rect){findings.push({severity:'warning',code:'assembly.child-unplaced',id:childId,parentId:parent.id});continue;}
      if(child.capabilities.baseType==='structure') {
        homeRegions.set(childId,{surfaceId:rect.surfaceId,x:rect.x,y:rect.y,width:rect.width,height:rect.height,excludedRects:[]});
      }
      geometry.set(childId,{nodeId:childId,parentSpatialId:parent.id,baseType:child.capabilities.baseType,
        outerRect:rect??null,ownSurfaceId:child.capabilities.surface?child.id:null,isInternalSurface:isLevel,levelNumberingIsSemantic:false});
      visit(child);
    }
  };
  visit(root);
  if(findings.some(f=>f.severity==='warning'))return freeze({kind:'playthings-spatial-world',status:'blocked',demand,world:null,locations:Object.freeze({}),geometry:freeze([...geometry.values()].sort((a,b)=>compareIds(a.nodeId,b.nodeId))),findings,
    spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:false,geometryQualified:false,semanticPixelsQualified:false,boundary:'Contained geometry could not be completed within explicit budgets.'});

  // Compile physical enclosure topology after all rectangles are known.
  for(const node of demand.nodes)if(node.id!==demand.rootId) {
    const g=geometry.get(node.id),rect=g.outerRect;
    if(node.capabilities.baseType==='structure'||node.capabilities.baseType==='container') {
      const parentRegion=homeRegions.get(node.parentSpatialId),surface=surfaceSpecs.get(rect.surfaceId),otherRects=parentRegion.excludedRects.filter(other=>other.id!==node.id);
      let door;try{door=entryForRect(rect,parentRegion,surface,otherRects,seed,node.id);}catch(error){findings.push({severity:'warning',code:'assembly.entry-unavailable',id:node.id,message:String(error?.message||error)});continue;}
      g.entry=door;homeEntries.set(node.id,node.capabilities.baseType==='structure'?door.threshold:homeEntries.get(node.id));
      links.push({id:`door:${node.id}`,kind:'door',from:door.approach,to:door.threshold,enabled:true});
      ownership.links[`door:${node.id}`]=[node.id];
      if(node.capabilities.baseType==='structure'){const walls=barriersForRect(rect,door,surface);barriers.push(...walls);for(const wall of walls){const key=edgeIdentity(wall.from,wall.to);ownership.barriers[key]=[...new Set([...(ownership.barriers[key]??[]),node.id])];}}
      else {
        const blocked=blockedBySurface.get(rect.surfaceId),spec=surfaceSpecs.get(rect.surfaceId);
        for(let y=rect.y;y<rect.y+rect.height;y++)for(let x=rect.x;x<rect.x+rect.width;x++)if(x!==door.threshold.x||y!==door.threshold.y){blocked.add(`${x},${y}`);const key=cellIdentity(navCell(rect.surfaceId,x,y));ownership.blocked[key]=[...new Set([...(ownership.blocked[key]??[]),node.id])];}
        ownership.links[`passage:${node.id}`]=[node.id];
        links.push({id:`passage:${node.id}`,kind:'passage',from:door.threshold,to:homeEntries.get(node.id)});
        spec.blocked=[...blocked].map(value=>{const [x,y]=value.split(',').map(Number);return {x,y};});
      }
    } else if(node.capabilities.baseType==='surface'&&!g.isInternalSurface) {
      const anchor=navCell(rect.surfaceId,rect.x+Math.floor(rect.width/2),rect.y+Math.floor(rect.height/2));
      g.entry=freeze({side:'portal',approach:anchor,threshold:homeEntries.get(node.id)});
      ownership.links[`passage:${node.id}`]=[node.id];
        links.push({id:`passage:${node.id}`,kind:'passage',from:anchor,to:homeEntries.get(node.id)});
    }
  }

  if(findings.some(f=>f.severity==='warning'))return freeze({kind:'playthings-spatial-world',status:'blocked',demand,world:null,locations:Object.freeze({}),geometry:freeze([...geometry.values()].sort((a,b)=>compareIds(a.nodeId,b.nodeId))),findings,
    spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:false,geometryQualified:false,semanticPixelsQualified:false,boundary:'Topology entry points could not be compiled without crossing another enclosure.'});

  // Internal surfaces are presentation-ordered vertical topology. No floor number
  // is asserted; order only determines the deterministic stair chain.
  for(const node of demand.nodes)if(node.capabilities.structure&&Array.isArray(node.internalSurfaceOrder)&&node.internalSurfaceOrder.length) {
    let from=homeEntries.get(node.id);
    for(const surfaceId of node.internalSurfaceOrder) {
      const to=homeEntries.get(surfaceId);ownership.links[`stairs:${node.id}:${surfaceId}`]=[node.id,surfaceId,...(ownership.surfaces[from.surfaceId]??[])];links.push({id:`stairs:${node.id}:${surfaceId}`,kind:'stairs',from,to,cost:2});from=to;
    }
  }

  // Convert blocked sets after nested containers may have added cells.
  for(const [surfaceId,set] of blockedBySurface){surfaceSpecs.get(surfaceId).blocked=[...set].map(value=>{const [x,y]=value.split(',').map(Number);return {x,y};});}
  const barrierMap=new Map();for(const barrier of barriers){const a=cellKey(barrier.from),b=cellKey(barrier.to),key=a<b?`${a}|${b}`:`${b}|${a}`;barrierMap.set(key,barrier);}
  let world;
  try{world=createNavigationWorld({surfaces:[...surfaceSpecs.values()],barriers:[...barrierMap.values()],links});}
  catch(error){findings.push({severity:'warning',code:'assembly.navigation-invalid',message:String(error?.message||error)});return freeze({kind:'playthings-spatial-world',status:'blocked',demand,world:null,locations:Object.freeze({}),geometry:freeze([...geometry.values()].sort((a,b)=>compareIds(a.nodeId,b.nodeId))),findings,
    spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:false,geometryQualified:false,semanticPixelsQualified:false,boundary:'Generated geometry failed navigation validation.'});}

  const blockedKeys=new Map(world.surfaces.map(s=>[s.id,new Set(s.blocked.map(c=>`${c.x},${c.y}`))]));
  const pick=(homeId,artifactId)=>{
    const region=homeRegions.get(homeId);if(!region)return null;
    const area=region.width*region.height,start=Math.floor(variation(seed,artifactId,'artifact-location')*area),blocked=blockedKeys.get(region.surfaceId)??new Set();
    for(let i=0;i<area;i++){
      const index=(start+i)%area,x=region.x+(index%region.width),y=region.y+Math.floor(index/region.width),cell=navCell(region.surfaceId,x,y);
      if(blocked.has(`${x},${y}`)||region.excludedRects.some(rect=>inside(cell,rect)))continue;
      return cell;
    }
    return null;
  };
  const locations=Object.create(null);
  for(const assignment of demand.assignments)if(assignment.status==='resolved') {
    const cell=pick(assignment.spatialHomeId,assignment.artifactId);
    if(cell)locations[assignment.artifactId]=cell;else findings.push({severity:'warning',code:'assembly.common-zone-exhausted',id:assignment.artifactId,spatialHomeId:assignment.spatialHomeId});
  }
  const ready=!findings.some(f=>f.severity==='warning'||f.severity==='error');
  return freeze({kind:'playthings-spatial-world',status:ready?'ready':'partial',demand,world,locations,geometry:[...geometry.values()].sort((a,b)=>compareIds(a.nodeId,b.nodeId)),findings,
    topologyOwnership:ownership,artifactHomes:Object.fromEntries(demand.assignments.filter(a=>a.status==='resolved').map(a=>[a.artifactId,a.spatialHomeId])),root:{surfaceId:demand.rootId,shift:rootBuilt.shift},spatialCapabilitiesApplied:options.capabilitiesQualified===true,navigationCompiled:true,
    geometryQualified:ready&&options.capabilitiesQualified===true,semanticPixelsQualified:false,
    boundary:'Deterministic rectangular presentation geometry from qualified spatial capability switches and explicit presentation order. Placement/topology do not create Tiinex semantic authority or certify companion pixels.'});
}
