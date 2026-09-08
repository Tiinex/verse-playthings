import React,{useEffect,useMemo,useState} from 'react';
import {createAppVerseModel,sampleAppScene} from '../app/index.mjs';
import {inspectPng} from '../runtime/companions/png.inspect.mjs';
export const appContract='tiinex.playthings.app.v1';
const h=React.createElement;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function Portrait({record,resolveCompanions,host}) {
 const [view,setView]=useState({state:'missing',url:''});
 useEffect(()=>{
  let active=true,url='';const controller=new AbortController();setView({state:'missing',url:''});
  Promise.resolve().then(async()=>{
   if(!record||typeof resolveCompanions!=='function'||typeof host?.readCompanion!=='function')return;
   const selected=resolveCompanions({namespace:'playthings',slot:'portrait',owner:{kind:'artifact',workspaceId:record.workspaceId,artifactPath:record.path}});
   if(selected.status!=='resolved'){if(active)setView({state:selected.status,url:''});return;}
   const result=await host.readCompanion(selected.resources[0],{signal:controller.signal});
   if(result.mediaType!=='image/png')throw Error('playthings.app.portrait-not-png');
   inspectPng(result.bytes); // actual Playthings PNG contract; not a source-specific image parser
   if(!active)return;
   url=URL.createObjectURL(new Blob([result.bytes],{type:'image/png'}));setView({state:'ready',url});
  }).catch(()=>{if(active)setView({state:'unavailable',url:''});});
  return()=>{active=false;controller.abort();if(url)URL.revokeObjectURL(url);};
 },[record,resolveCompanions,host]);
 if(view.url)return h('img',{src:view.url,alt:'',width:64,height:64,style:{imageRendering:'pixelated',objectFit:'contain'}});
 return h('span',{'aria-label':view.state==='ambiguous'?'Conflicting portrait resources':'No portrait',title:view.state},'◇');
}
function actorOffset(renderId) {
 let hash=0;for(const ch of String(renderId))hash=(Math.imul(hash,33)+ch.codePointAt(0))>>>0;
 return {x:(hash%3-1)*3,y:(Math.floor(hash/3)%3-1)*3};
}
function SceneViewport({value,snapshot}) {
 const surface=value.rootWorld?.world?.surfaces?.[0];
 if(!surface)return null;
 const cell=32,worldWidth=surface.width*cell,worldHeight=surface.height*cell;
 const viewportWidth=Math.min(surface.width,16)*cell,viewportHeight=Math.min(surface.height,10)*cell;
 const camera=snapshot.camera?.surfaceId===surface.id?snapshot.camera:{surfaceId:surface.id,x:(surface.width-1)/2,y:(surface.height-1)/2};
 const centerX=(camera.x+.5)*cell,centerY=(camera.y+.5)*cell;
 const left=clamp(centerX-viewportWidth/2,0,Math.max(0,worldWidth-viewportWidth));
 const top=clamp(centerY-viewportHeight/2,0,Math.max(0,worldHeight-viewportHeight));
 const visible=new Set(snapshot.semantic.visibleEventIds);
 const lines=[];
 for(let x=0;x<=surface.width;x++)lines.push(h('line',{key:`gx${x}`,x1:x*cell,y1:0,x2:x*cell,y2:worldHeight,opacity:.08}));
 for(let y=0;y<=surface.height;y++)lines.push(h('line',{key:`gy${y}`,x1:0,y1:y*cell,x2:worldWidth,y2:y*cell,opacity:.08}));
 const markers=value.rootWorld.admittedRecordIds.filter(id=>visible.has(id)).map(id=>{
  const point=value.rootWorld.locations[id],record=value.metadata[id];if(!point)return null;
  const cx=(point.x+.5)*cell,cy=(point.y+.5)*cell;
  return h('g',{key:`artifact:${id}`,'data-artifact-id':id},
   h('rect',{x:cx-6,y:cy-6,width:12,height:12,transform:`rotate(45 ${cx} ${cy})`,fill:'none',stroke:'currentColor',strokeWidth:1.5,opacity:.5}),
   h('title',null,record?.title||id));
 });
 const actors=snapshot.actors.flatMap(actor=>{
  const point=actor.position;if(!point||point.surfaceId!==surface.id)return [];
  const offset=actorOffset(actor.renderId),cx=(point.x+.5)*cell+offset.x,cy=(point.y+.5)*cell+offset.y;
  const ghost=actor.mode==='ghost';
  return [h('g',{key:`actor:${actor.renderId}`,'data-actor-mode':actor.mode,'data-actor-phase':actor.phase},
   h('circle',{cx,cy,r:6,fill:ghost?'none':'currentColor',stroke:'currentColor',strokeWidth:ghost?2:1,strokeDasharray:ghost?'4 3':undefined,opacity:actor.emphasis==='sharp'?1:.55}),
   h('title',null,`${actor.identityId} · ${actor.mode} · ${actor.phase}`))];
 });
 const light=.55+.45*(snapshot.lighting?.light??1);
 return h('section',{'aria-label':'Playthings Root world',style:{display:'grid',gap:8}},
  h('div',{style:{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}},
   h('strong',null,'Root world'),h('small',null,'Deterministic presentation scaffold · spatial companions not compiled yet')),
  h('svg',{role:'img','aria-label':'Playthings Root world presentation','data-playthings-world':'root-scaffold',viewBox:`${left} ${top} ${viewportWidth} ${viewportHeight}`,
   style:{width:'100%',maxHeight:'520px',border:'1px solid currentColor',borderRadius:10,background:'rgba(127,127,127,.08)',filter:`brightness(${light})`}},
   h('rect',{x:0,y:0,width:worldWidth,height:worldHeight,fill:'none',stroke:'currentColor',opacity:.25}),
   h('g',{stroke:'currentColor',strokeWidth:.5},...lines),...markers,...actors),
  h('small',null,`${snapshot.pendingDepictionIds.length} pending depiction · ${snapshot.blockedDepictionIds.length} blocked depiction · camera ${camera.x.toFixed(1)}, ${camera.y.toFixed(1)}`));
}
export function PlaythingsVerse({applicationData,getPlaythingsStoryRecords,resolveCompanions,host}) {
 const model=useMemo(()=>{try{return {value:createAppVerseModel({applicationData,getPlaythingsStoryRecords,resolveCompanions})};}catch(error){return {error:error.message};}},[applicationData,getPlaythingsStoryRecords,resolveCompanions]);
 const [cursor,setCursor]=useState(null),[fullscreenError,setFullscreenError]=useState('');
 const value=model.value,duration=value?.presentationDurationMs??0,current=value?clamp(cursor===null?duration:cursor,0,duration):0;
 useEffect(()=>setCursor(null),[value]);
 const sampled=value?sampleAppScene(value,current):null;
 const controls=h('nav',{'aria-label':'Playthings controls',style:{display:'flex',gap:12,flexWrap:'wrap'}},
  h('button',{type:'button',onClick:()=>host?.exitVerse?.()},'Back to Viewer'),
  h('button',{type:'button',onClick:async()=>{try{const result=await host?.requestFullscreen?.();if(!result)setFullscreenError('Fullscreen is unavailable in this host.');else setFullscreenError('');}catch{setFullscreenError('Fullscreen was not granted. You can continue in this view.');}}},'Fullscreen'),
  value?.scene&&h('button',{type:'button',onClick:()=>setCursor(0)},'Replay start'),
  value?.scene&&h('button',{type:'button',onClick:()=>setCursor(duration)},'Latest'));
 if(model.error)return h('main',{'data-playthings-state':'blocked',style:{padding:24}},controls,h('h1',null,'Playthings'),h('p',{role:'alert'},'The App data contract is not available. Return to Viewer and reload the Workspace.'),h('details',null,h('summary',null,'Details'),model.error));
 if(sampled.state==='empty')return h('main',{'data-playthings-state':'empty',style:{padding:24,minHeight:'85vh'}},controls,h('h1',null,'Playthings'),h('p',null,'Load a Workspace in Viewer to explore its history here.'));
 const scene=sampled.snapshot,snapshot=scene.semantic;
 return h('main',{'data-playthings-state':'ready',style:{padding:24,minHeight:'85vh',background:'var(--bg, #14151d)',color:'var(--text, #eeeeef)',display:'grid',gap:16}},
  controls,h('h1',null,'Playthings'),h('p',null,'Artifact history · experimental Root-world renderer'),
  fullscreenError&&h('p',{role:'status'},fullscreenError),
  h(SceneViewport,{value,snapshot:scene}),
  h('label',null,'Presentation position ',h('input',{type:'range',min:0,max:duration,value:current,step:Math.max(1,Math.round(duration/1000)||1),onChange:e=>setCursor(Number(e.target.value)),'aria-label':'Presentation position',style:{width:'min(100%,640px)'}})),
  h('p',null,`${snapshot.visibleEventIds.length} artifacts available at ${new Date(scene.clock.historicalTimeMs).toISOString()} · ${value.times.length} declared historical moments`),
  scene.observationPhase&&h('small',null,`Observation: ${scene.observationPhase.kind}${scene.observationPhase.eventId?` · ${value.metadata[scene.observationPhase.eventId]?.title||scene.observationPhase.eventId}`:''}`),
  h('ul',{style:{listStyle:'none',padding:0,display:'grid',gap:12,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}},...snapshot.frontiers.map(frontier=>{
   const record=value.metadata[frontier.artifactId];
   return h('li',{key:frontier.artifactId,style:{padding:16,border:'1px solid currentColor',borderRadius:8}},
    h(Portrait,{record,resolveCompanions,host}),h('h2',{style:{fontSize:'1rem'}},record?.title||frontier.artifactId),
    h('p',null,record?.schemaId||'Unresolved schema'),h('p',null,frontier.actors.map(a=>`${a.identityId} (${a.mode})`).join(', ')||'No declared participants'),
    h('small',null,record?.createdAt||''));
  })),
  value.omittedRecords>0&&h('p',{role:'status'},`${value.omittedRecords} records have no usable historical position and are not depicted.`),
  scene.blockedDepictionIds.length>0&&h('p',{role:'status'},`${scene.blockedDepictionIds.length} historically available records cannot be physically depicted by the bounded Root scaffold.`),
  value.rootWorld.findings.length>0&&h('details',null,h('summary',null,`${value.rootWorld.findings.length} Root-world presentation observations`),h('ul',null,...value.rootWorld.findings.map((f,i)=>h('li',{key:i},`${f.code}${f.omitted?`: ${f.omitted} omitted`:''}`)))),
  value.story.findings.length>0&&h('details',null,h('summary',null,`${value.story.findings.length} unresolved history observations`),h('ul',null,...value.story.findings.map((f,i)=>h('li',{key:i},`${f.id}: ${f.code}`)))),
  h('small',null,'Placement, camera and depiction are presentation only. They are not proof of work occurrence, responsibility transfer, spatial source truth or Handoff acceptance.'));
}
export default PlaythingsVerse;
