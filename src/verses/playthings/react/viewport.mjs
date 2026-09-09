import React,{useEffect,useRef,useState} from 'react';
import {cardinalMask} from '../runtime/world/layout.mjs';
import {AtlasCrop,CompanionSprite,useAtlas,useVisualResources} from './companions.mjs';
import {panelStyle,buttonStyle} from './controls.mjs';
const h=React.createElement,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const inside=(p,r)=>p&&r&&p.surfaceId===r.surfaceId&&p.x>=r.x&&p.y>=r.y&&p.x<r.x+r.width&&p.y<r.y+r.height;
const exactActive=(model,id,channel)=>model.spatialCandidate?.capabilities?.receipts?.find(item=>item.id===id)?.channels[channel]?.active===true;
function regionCells(surface,bounds) {
  const list=[];
  for(let y=Math.max(0,Math.floor(bounds.top));y<Math.min(surface.height,Math.ceil(bounds.top+bounds.height));y++)
    for(let x=Math.max(0,Math.floor(bounds.left));x<Math.min(surface.width,Math.ceil(bounds.left+bounds.width));x++)list.push({x,y});
  return list;
}
function SurfaceTiles({context,record,surface,bounds}) {
  const selection=useVisualResources(context,record,'tiles');const atlas=useAtlas(context.store,selection.resources?.length===1?selection.resources[0]:null,'tiles');
  if(atlas.status!=='ready')return null;
  const blocked=new Set(surface.blocked.map(p=>`${p.x},${p.y}`));
  const occupied=(x,y)=>x>=0&&y>=0&&x<surface.width&&y<surface.height&&!blocked.has(`${x},${y}`);
  return h('g',{'data-presentation-layer':'tiles'},...regionCells(surface,bounds).filter(p=>occupied(p.x,p.y)).map(p=>h(AtlasCrop,{key:`${p.x},${p.y}`,atlas,channel:'tiles',x:p.x*32,y:p.y*32,width:32,height:32,frameOptions:{mask:cardinalMask(p.x,p.y,occupied)}})));
}
function StructureArtwork({context,record,geometry,bounds,cutaway}) {
  const selection=useVisualResources(context,record,'structure');const atlas=useAtlas(context.store,selection.resources?.length===1?selection.resources[0]:null,'structure');
  if(atlas.status!=='ready'||!geometry.outerRect)return null;
  const r=geometry.outerRect,cells=[];
  for(let y=Math.max(r.y,Math.floor(bounds.top));y<Math.min(r.y+r.height,Math.ceil(bounds.top+bounds.height));y++)for(let x=Math.max(r.x,Math.floor(bounds.left));x<Math.min(r.x+r.width,Math.ceil(bounds.left+bounds.width));x++)cells.push({x,y});
  const occupied=(x,y)=>x>=r.x&&y>=r.y&&x<r.x+r.width&&y<r.y+r.height;
  const wall=(x,y)=>occupied(x,y)&&(x===r.x||y===r.y||x===r.x+r.width-1||y===r.y+r.height-1);
  const threshold=geometry.entry?.threshold,direction=geometry.entry?.side;
  return h('g',{'data-presentation-layer':'structure','data-cutaway':cutaway?'open':'closed'},
    ...cells.map(p=>h(AtlasCrop,{key:`roof:${p.x},${p.y}`,atlas,channel:'structure',x:p.x*32,y:p.y*32,width:32,height:32,opacity:cutaway ? .15 : .8,frameOptions:{part:'roof',mask:cardinalMask(p.x,p.y,occupied)}})),
    ...cells.filter(p=>wall(p.x,p.y)&&!(threshold?.x===p.x&&threshold?.y===p.y)).map(p=>h(AtlasCrop,{key:`wall:${p.x},${p.y}`,atlas,channel:'structure',x:p.x*32,y:p.y*32,width:32,height:32,opacity:.85,frameOptions:{part:'wall',mask:cardinalMask(p.x,p.y,wall)}})),
    threshold&&['north','east','south','west'].includes(direction)&&h(AtlasCrop,{atlas,channel:'structure',x:threshold.x*32,y:threshold.y*32,width:32,height:32,frameOptions:{part:'doorway',direction}}));
}
function PropAtlas({context,resource,point,index}) {
  const atlas=useAtlas(context.store,resource,'props');if(atlas.status!=='ready')return null;
  return h('g',{'data-presentation-layer':'props'},...Array.from({length:Math.min(3,atlas.layout.collectionCount)},(_,item)=>h(AtlasCrop,{key:item,atlas,channel:'props',x:point.x*32+index*12+item*10,y:point.y*32+17,width:18,height:18,frameOptions:{item,slot:0}})));
}
function Props({context,record,point}) {
  const selection=useVisualResources(context,record,'props');
  return h('g',null,...(selection.resources??[]).slice(0,3).map((resource,index)=>h(PropAtlas,{key:`${resource.providerId}:${resource.id}`,context,resource,point,index})));
}
function StairArtwork({context,model,link,point,index}) {
  const owner=model.presentationWorld.topologyOwnership?.links[link.id]?.[0];
  const selection=useVisualResources(context,owner?model.metadata[owner]:null,'structure');
  const atlas=useAtlas(context.store,selection.resources?.length===1?selection.resources[0]:null,'structure');
  // Up/down is the assembler's presentation order, never semantic floor numbering.
  return h(AtlasCrop,{atlas,channel:'structure',x:point.x*32,y:point.y*32,width:32,height:32,
    frameOptions:{part:index===0?'stairs-up':'stairs-down',direction:'south'}});
}
function Actor({actor,context,model,surfaceId,time,reducedMotion}) {
  const t=actor.transition;const endpoint=t?(t.progress<.5?t.from:t.to):actor.position;
  if(endpoint?.surfaceId!==surfaceId)return null;
  const ghost=actor.mode==='ghost';
  const identity=model.visibility.introductions.find(item=>item.kind==='identity'&&item.state==='qualified'&&item.subjectId===actor.identityId&&item.historicalTimeMs<=context.historicalTimeMs);
  const record=identity?model.metadata[identity.artifactId]:null;
  // Identity appearance is provided by qualified introduction bindings. No
  // author display-name search or later Party portrait lookup occurs here.
  const skin=actor.appearance==='identity'&&Boolean(record);
  const x=(endpoint.x+.5)*32,y=(endpoint.y+.5)*32;
  return h('g',{'data-actor-mode':actor.mode,'data-actor-phase':actor.phase,'data-actor-transition':t?'surface':'none'},
    h('circle',{cx:x,cy:y,r:ghost?8:6,fill:ghost?'none':'#cceff4',stroke:ghost?'#afbdcf':'#edfaff',strokeWidth:ghost?2:1,strokeDasharray:ghost||t?'4 3':undefined,opacity:actor.emphasis==='sharp'?1:.5}),
    skin&&h(CompanionSprite,{context,record,channel:'character',x:x-16,y:y-42,width:32,height:48,frameOptions:{mode:actor.mode,phase:actor.phase,direction:actor.direction,elapsedMs:time,reducedMotion}}),
    h('title',null,`${actor.identityId} · ${actor.mode} · ${actor.phase}`));
}
export function SceneViewport({model,snapshot,context,selected,onSelect,reducedMotion}) {
  const ref=useRef(null),drag=useRef(null);const [size,setSize]=useState({width:960,height:540});
  const [manual,setManual]=useState(null),[zoom,setZoom]=useState(1),[roofs,setRoofs]=useState(true);
  useEffect(()=>{const element=ref.current;if(!element||typeof ResizeObserver==='undefined')return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(element);return()=>observer.disconnect();},[]);
  const presentation=snapshot.presentationWorld,world=presentation.world;
  const transition=snapshot.cameraTransition;
  const directed=snapshot.camera??(transition?(transition.progress<.5?transition.from:transition.to):null);
  const selectedPoint=selected?presentation.locations[selected]:null;
  useEffect(()=>{if(selectedPoint)setManual(selectedPoint);},[selected,selectedPoint?.surfaceId,selectedPoint?.x,selectedPoint?.y]);
  useEffect(()=>{if(manual&&!world.surfaces.some(s=>s.id===manual.surfaceId))setManual(null);},[world,manual]);
  const requested=manual??(reducedMotion?(selectedPoint??(snapshot.observationPhase?.eventId?presentation.locations[snapshot.observationPhase.eventId]:null)):directed);
  const surface=world.surfaces.find(item=>item.id===requested?.surfaceId)??world.surfaces[0];
  if(!surface)return null;
  const camera=requested?.surfaceId===surface.id?requested:{surfaceId:surface.id,x:(surface.width-1)/2,y:(surface.height-1)/2};
  const width=Math.min(surface.width,clamp(size.width/(32*zoom),4,40)),height=Math.min(surface.height,clamp(size.height/(32*zoom),3,28));
  const bounds={left:clamp(camera.x+.5-width/2,0,Math.max(0,surface.width-width)),top:clamp(camera.y+.5-height/2,0,Math.max(0,surface.height-height)),width,height};
  const inView=p=>p?.surfaceId===surface.id&&p.x>=bounds.left-1&&p.y>=bounds.top-1&&p.x<=bounds.left+width+1&&p.y<=bounds.top+height+1;
  const geometry=presentation.geometry.filter(item=>item.outerRect?.surfaceId===surface.id&&item.outerRect.x<bounds.left+width&&item.outerRect.y<bounds.top+height&&item.outerRect.x+item.outerRect.width>bounds.left&&item.outerRect.y+item.outerRect.height>bounds.top).slice(0,64);
  const markers=Object.entries(presentation.locations).filter(([,point])=>inView(point)).slice(0,128);
  const owner=presentation.geometry.find(item=>item.ownSurfaceId===surface.id)?.nodeId;
  const isRoot=!owner;
  const label=isRoot?'Root':model.metadata[owner]?.title||owner;
  const phase=snapshot.observationPhase,active=phase?.eventId,activeEvent=active?model.story.log.find(event=>event.id===active):null;
  const parent=selected?model.story.records.find(record=>record.id===selected)?.parentId:null;
  const source=parent?presentation.locations[parent]:null,target=selected?presentation.locations[selected]:null;
  const cell=32,light=reducedMotion?1:.55+.45*snapshot.lighting.light;
  const button={...buttonStyle,padding:'7px 10px',minHeight:44};
  return h('section',{ref,'aria-label':'Playthings world',style:{position:'relative',minHeight:0,overflow:'hidden',height:'100%'}},
    h('svg',{'aria-label':'Playthings world presentation',role:'img','data-playthings-world':presentation.mode,'data-playthings-surface':surface.id,'data-camera-transition':transition?'active':'none',
      viewBox:`${bounds.left*cell} ${bounds.top*cell} ${width*cell} ${height*cell}`,
      onPointerDown:event=>{if(event.button!==0||event.target.closest?.('[data-artifact-id]'))return;drag.current={x:event.clientX,y:event.clientY,camera};event.currentTarget.setPointerCapture(event.pointerId);},
      onPointerMove:event=>{if(!drag.current)return;const d=drag.current;setManual({surfaceId:surface.id,x:clamp(d.camera.x-(event.clientX-d.x)*width/Math.max(size.width,1),0,surface.width-1),y:clamp(d.camera.y-(event.clientY-d.y)*height/Math.max(size.height,1),0,surface.height-1)});},
      onPointerUp:()=>{drag.current=null;},onPointerCancel:()=>{drag.current=null;},onLostPointerCapture:()=>{drag.current=null;},
      style:{display:'block',width:'100%',height:'100%',touchAction:'none',background:'radial-gradient(ellipse at center,#203445 0%,#101b29 55%,#080e17 100%)',filter:`brightness(${light})`}},
      owner&&exactActive(model,owner,'tiles')&&h(SurfaceTiles,{context,record:model.metadata[owner],surface,bounds}),
      ...regionCells(surface,bounds).map(p=>h('rect',{key:`grid:${p.x}:${p.y}`,x:p.x*32,y:p.y*32,width:32,height:32,fill:'none',stroke:'#b5d3df',strokeWidth:.3,opacity:.1})),
      ...surface.blocked.filter(p=>inView({...p,surfaceId:surface.id})).map(p=>h('rect',{key:`b:${p.x}:${p.y}`,x:p.x*cell,y:p.y*cell,width:cell,height:cell,fill:'#07121d',opacity:.7})),
      ...geometry.map(g=>h('g',{key:g.nodeId,'data-geometry-kind':g.baseType,'data-geometry-owner':g.nodeId},
        h('rect',{x:g.outerRect.x*32,y:g.outerRect.y*32,width:g.outerRect.width*32,height:g.outerRect.height*32,fill:'#35516a',fillOpacity:.17,stroke:'#81b9c8',strokeWidth:2,strokeOpacity:.65}),
        h('title',null,`${model.metadata[g.nodeId]?.title||g.nodeId} · presentation enclosure`))),
      ...world.barriers.filter(b=>inView(b.from)||inView(b.to)).map((b,i)=>{const vertical=b.from.x!==b.to.x;const x=Math.max(b.from.x,b.to.x)*32,y=Math.max(b.from.y,b.to.y)*32;return h('line',{key:`wall${i}`,x1:x,y1:y,x2:x+(vertical?0:32),y2:y+(vertical?32:0),stroke:'#99c4cf',strokeWidth:3,opacity:.8});}),
      source&&target&&inView(source)&&inView(target)&&h('g',{'data-presentation-layer':'declared-parent'},h('line',{x1:(source.x+.5)*32,y1:(source.y+.5)*32,x2:(target.x+.5)*32,y2:(target.y+.5)*32,stroke:'#eed2a3',strokeWidth:2,strokeDasharray:'3 6'}),h('title',null,'Declared Parent reference — not a walking path')),
      ...markers.map(([id,p])=>h('g',{key:id,'data-artifact-id':id,onClick:()=>onSelect(id),style:{cursor:'pointer'}},
        h('circle',{cx:(p.x+.5)*32,cy:(p.y+.5)*32,r:id===selected?16:12,fill:id===selected?'#91cddc':'#6c98ad',fillOpacity:id===selected?.45:.17,stroke:id===selected?'#ddf4ff':'#82b2c0',strokeOpacity:.6}),
        h('path',{d:`M ${(p.x+.5)*32} ${p.y*32+6} l 10 10 -10 10 -10 -10 z`,fill:'#d6e7eb',opacity:.55}),
        id===active&&activeEvent?.transition==='formal-handoff-declaration'&&h('text',{x:p.x*32+26,y:p.y*32+6,fontSize:15,fill:'#ffdda3'},'⇄'),
        id===selected&&h(CompanionSprite,{context,record:model.metadata[id],channel:'portrait',x:p.x*32-4,y:p.y*32-18,width:40,height:40}),
        id===active&&phase?.kind==='dwell'&&h(CompanionSprite,{context,record:model.metadata[id],channel:'blueprint',x:p.x*32-8,y:p.y*32-16,width:48,height:48,frameOptions:{progress:phase.progress,reducedMotion}}),
        id===active&&activeEvent?.depiction==='qualified-occurrence'&&phase?.kind==='presentation-work'&&h(CompanionSprite,{context,record:model.metadata[id],channel:'verb',x:p.x*32-8,y:p.y*32-20,width:48,height:48,frameOptions:{actionStatus:'occurred',elapsedMs:snapshot.clock.presentationTimeMs,reducedMotion}}),
        id===selected&&exactActive(model,id,'props')&&h(Props,{context,record:model.metadata[id],point:p}),
        h('title',null,model.metadata[id]?.title||id))),
      ...snapshot.actors.filter(actor=>inView(actor.position)||inView(actor.transition?.from)||inView(actor.transition?.to)).slice(0,128).map(actor=>h(Actor,{key:actor.renderId,actor,context,model,surfaceId:surface.id,time:snapshot.clock.presentationTimeMs,reducedMotion})),
      ...geometry.filter(g=>exactActive(model,g.nodeId,'structure')).map(g=>h(StructureArtwork,{key:`art:${g.nodeId}`,context,record:model.metadata[g.nodeId],geometry:g,bounds,cutaway:!roofs||inside(selectedPoint,g.outerRect)||snapshot.actors.some(a=>inside(a.position,g.outerRect))})),
      ...world.links.flatMap(link=>[link.from,link.to].map((point,index)=>({point,index})).filter(({point})=>inView(point)).map(({point,index:i})=>h('g',{key:`link:${link.id}:${i}`,'data-link-kind':link.kind,onClick:()=>{if(link.enabled)setManual(point===link.from?link.to:link.from);},style:{cursor:link.enabled?'pointer':'not-allowed'}},
        h('rect',{x:point.x*32+7,y:point.y*32+7,width:18,height:18,rx:4,fill:'#132532',stroke:'#ddbd8c',strokeWidth:2,strokeDasharray:link.enabled?undefined:'3 2'}),h('text',{x:point.x*32+16,y:point.y*32+21,textAnchor:'middle',fontSize:15,fill:'#ffe2b3'},link.kind==='stairs'?'↕':'·'),link.kind==='stairs'&&h(StairArtwork,{context,model,link,point,index:i}),h('title',null,`${link.kind} — inspect connected presentation surface`))))),
    h('div',{style:{position:'absolute',top:12,right:12,padding:'8px 12px',borderRadius:12,maxWidth:'45%',...panelStyle,fontSize:13,pointerEvents:'none'}},h('strong',null,label),h('small',{style:{display:'block',opacity:.7}},manual?'Inspecting presentation':reducedMotion?'Reduced motion':'Following lineage')),
    h('nav',{'aria-label':'Presentation camera',style:{position:'absolute',right:12,bottom:12,display:'flex',gap:5,flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'calc(100% - 24px)'}},
      h('button',{type:'button',style:button,'aria-label':'Zoom out',onClick:()=>setZoom(v=>clamp(v-.25,.5,3))},'−'),
      h('button',{type:'button',style:button,'aria-label':'Zoom in',onClick:()=>setZoom(v=>clamp(v+.25,.5,3))},'+'),
      h('button',{type:'button',style:button,onClick:()=>{setManual(null);setZoom(1);}},'Follow'),
      h('button',{type:'button',style:button,'aria-pressed':!roofs,onClick:()=>setRoofs(v=>!v)},'Cutaway'),
      world.surfaces.length>1&&h('select',{'aria-label':'Presentation surface',value:surface.id,onChange:event=>{const s=world.surfaces.find(s=>s.id===event.target.value);if(s)setManual({surfaceId:s.id,x:s.width/2,y:s.height/2});},style:{...button,maxWidth:160}},...world.surfaces.map(s=>h('option',{key:s.id,value:s.id},model.metadata[s.id]?.title||'Root')))));
}
