import {compareIds,freeze,requireId,requireFinite,requireInteger} from '../shared/values.mjs';
import {variation,measureFootprint,placeFootprints} from './layout.mjs';

/** Exact activation flags supplied by an adapter, NOT resolved fallback graphics. */
export function classifySpatial(capabilities={}) {
  for(const name of ['tiles','structure','props']) if(capabilities[name]!==undefined && typeof capabilities[name]!=='boolean') throw new TypeError(`${name} capability must be boolean`);
  const surface=capabilities.tiles===true,structure=capabilities.structure===true;
  return freeze({baseType:surface?(structure?'container':'surface'):(structure?'structure':'non-spatial'),
    surface,structure,props:capabilities.props===true});
}

/** Recursive capacity planner, not a complete building assembler.
 * Input has already-qualified identity/Parent/time/capability projections. No Core API
 * shape is asserted. displayArea is an explicit presentation budget, not artifact truth.
 * Surface order is optional presentation policy; multiple internal surfaces without
 * it return an unresolved gate instead of inventing semantic floor numbers.
 */
export function planSpatialDemand(input,options={}) {
  if(!Array.isArray(input)) throw new TypeError('Spatial input must be an array');
  const maxNodes=requireInteger(options.maxNodes??4096,'maxNodes',1);
  const maxDepth=requireInteger(options.maxDepth??128,'maxDepth',1);
  if(input.length>maxNodes) throw new RangeError('Spatial node budget exceeded');
  const time=requireFinite(options.historicalTimeMs,'historicalTimeMs');
  const seed=requireId(options.seed??'playthings-world','seed'),rootId=requireId(options.rootId??'@playthings:world','rootId');
  const all=new Map();
  for(const record of input) {
    const id=requireId(record.id);if(id===rootId||all.has(id)) throw new TypeError('Duplicate/reserved spatial id');
    if(record.parentId!==undefined&&record.parentId!==null) requireId(record.parentId,'parentId');
    all.set(id,{id,parentId:record.parentId,historicalTimeMs:requireFinite(record.historicalTimeMs,'historicalTimeMs'),
      displayArea:requireInteger(record.displayArea??0,'displayArea'),capabilities:classifySpatial(record.capabilities)});
  }
  const visible=[...all.values()].filter(n=>n.historicalTimeMs<=time).sort((a,b)=>compareIds(a.id,b.id));
  const findings=[],chains=new Map();
  for(const n of visible) {
    const seen=new Set(),chain=[];let id=n.id,reason=null;
    while(id!==null) {
      if(id===undefined){reason='unknown-parent';break;}
      if(seen.has(id)){reason='cycle';break;}
      if(chain.length>=maxDepth){reason='depth-budget';break;}
      seen.add(id);const node=all.get(id);
      if(!node){reason='missing-parent';break;}
      if(node.historicalTimeMs>time){reason='future-parent';break;}
      chain.push(id);id=node.parentId;
    }
    if(reason)findings.push({id:n.id,code:`spatial.${reason}`,severity:'warning'});
    else chains.set(n.id,chain);
  }
  const root={id:rootId,parentSpatialId:null,capabilities:classifySpatial({tiles:true}),directArtifactIds:[],commonDemandArea:0,children:[]};
  const spatial=new Map([[rootId,root]]),assignments=[];
  for(const n of visible) if(chains.has(n.id)&&n.capabilities.baseType!=='non-spatial') {
    const ancestor=chains.get(n.id).slice(1).find(id=>all.get(id).capabilities.baseType!=='non-spatial')??rootId;
    spatial.set(n.id,{id:n.id,parentSpatialId:ancestor,historicalTimeMs:n.historicalTimeMs,capabilities:n.capabilities,directArtifactIds:[],commonDemandArea:n.displayArea,children:[]});
  }
  for(const n of visible) {
    if(!chains.has(n.id)) {assignments.push({artifactId:n.id,spatialHomeId:null,status:'unresolved'});continue;}
    const home=n.capabilities.baseType!=='non-spatial'?n.id:chains.get(n.id).slice(1).find(id=>spatial.has(id))??rootId;
    assignments.push({artifactId:n.id,spatialHomeId:home,status:'resolved'});
    if(home!==n.id) {spatial.get(home).directArtifactIds.push(n.id);spatial.get(home).commonDemandArea+=n.displayArea;}
  }
  for(const node of spatial.values()) if(node.parentSpatialId!==null) spatial.get(node.parentSpatialId).children.push(node.id);
  for(const node of spatial.values()) node.children.sort(compareIds);
  const surfaceOrders=options.surfaceOrder??{};
  if(surfaceOrders===null || typeof surfaceOrders!=='object' || Array.isArray(surfaceOrders)) throw new TypeError('surfaceOrder must be a map of presentation orders');
  const getOrder=id=>surfaceOrders instanceof Map?surfaceOrders.get(id):Object.hasOwn(surfaceOrders,id)?surfaceOrders[id]:undefined;
  const orderKeys=surfaceOrders instanceof Map?[...surfaceOrders.keys()]:Object.keys(surfaceOrders);
  for(const id of orderKeys) if(!spatial.has(id)) throw new TypeError('Surface order refers to an unavailable spatial node');
  function measure(node) {
    const children=node.children.map(id=>measure(spatial.get(id)));
    const levels=node.capabilities.structure?children.filter(c=>c.capabilities.baseType==='surface'):[];
    const order=getOrder(node.id);
    if(order!==undefined && (!Array.isArray(order)||order.length!==levels.length||new Set(order).size!==levels.length||order.some(id=>!levels.some(c=>c.id===id)))) throw new TypeError(`Surface order must name every direct internal Surface exactly once: ${node.id}`);
    const levelOrder=order??(levels.length<=1?levels.map(c=>c.id):null);
    if(levelOrder===null)findings.push({id:node.id,code:'spatial.surface-order-required',severity:'warning'});
    const horizontal=children.filter(c=>!levels.includes(c));
    const levelArea=Math.max(0,...levels.map(c=>c.footprint.width*c.footprint.height));
    const childArea=horizontal.reduce((sum,c)=>sum+c.footprint.width*c.footprint.height,0)+levelArea;
    const minWidth=Math.max(4,...children.map(c=>c.footprint.width+2));
    const minHeight=Math.max(4,...children.map(c=>c.footprint.height+2));
    const commonArea=Math.max(requireInteger(options.minimumCommonArea??4,'minimumCommonArea',1),node.commonDemandArea);
    const footprint=measureFootprint({contentArea:commonArea,childArea,minWidth,minHeight,
      circulationFraction:options.circulationFraction??.35,aspectRatio:1+variation(seed,node.id,'demand-aspect')*.35});
    node.footprint=footprint;node.minimumCommonArea=commonArea;node.internalSurfaceOrder=levelOrder;
    node.levelNumberingIsSemantic=false;
    return node;
  }
  measure(root);
  const requests=root.children.map(id=>({id,width:spatial.get(id).footprint.width,height:spatial.get(id).footprint.height,order:spatial.get(id).historicalTimeMs}));
  if(options.previousRootPlacements?.length) {
    const priorTime=requireFinite(options.previousHistoricalTimeMs,'previousHistoricalTimeMs');
    if(priorTime>time)throw new RangeError('Future reservations cannot be reused in historical playback');
  }
  const packing=placeFootprints(requests,{...options.placement,seed,previous:options.previousRootPlacements??[]});
  findings.push(...packing.findings);
  return freeze({kind:'playthings-spatial-demand',historicalTimeMs:time,rootId,assignments,nodes:[...spatial.values()].sort((a,b)=>compareIds(a.id,b.id)),
    rootReservations:packing.placements,findings,status:findings.some(f=>f.severity==='warning')?'partial':'ready',
    navigationCompiled:false,geometryQualified:false});
}
