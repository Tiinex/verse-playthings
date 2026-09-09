import React,{useEffect,useMemo,useState} from 'react';
import {createAppVerseModel,sampleAppScene} from '../app/index.mjs';
import {inspectPng} from '../runtime/companions/png.inspect.mjs';
export const appContract='tiinex.playthings.app.v1';
const h=React.createElement;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const shellStyle=Object.freeze({position:'fixed',inset:0,zIndex:2147483000,width:'100vw',height:'100dvh',overflow:'hidden',background:'#0b0d12',color:'#f1f3f5',fontFamily:'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'});
const panelStyle=Object.freeze({background:'rgba(10,12,18,.88)',border:'1px solid rgba(255,255,255,.18)',boxShadow:'0 12px 40px rgba(0,0,0,.36)',backdropFilter:'blur(10px)'});

function Portrait({record,resolveCompanions,host,size=56}) {
 const [view,setView]=useState({state:'missing',url:''});
 useEffect(()=>{
  let active=true,url='';const controller=new AbortController();setView({state:'missing',url:''});
  Promise.resolve().then(async()=>{
   if(!record||typeof resolveCompanions!=='function'||typeof host?.readCompanion!=='function')return;
   const selected=resolveCompanions({namespace:'playthings',slot:'portrait',owner:{kind:'artifact',workspaceId:record.workspaceId,artifactPath:record.path}});
   if(selected.status!=='resolved'){if(active)setView({state:selected.status,url:''});return;}
   const result=await host.readCompanion(selected.resources[0],{signal:controller.signal});
   if(result.mediaType!=='image/png')throw Error('playthings.app.portrait-not-png');
   inspectPng(result.bytes); // bounded Playthings PNG contract; resolver precedence stays host/Core-owned
   if(!active)return;
   url=URL.createObjectURL(new Blob([result.bytes],{type:'image/png'}));setView({state:'ready',url});
  }).catch(()=>{if(active)setView({state:'unavailable',url:''});});
  return()=>{active=false;controller.abort();if(url)URL.revokeObjectURL(url);};
 },[record,resolveCompanions,host]);
 if(view.url)return h('span',{style:{display:'block',width:size,height:size,overflow:'hidden',borderRadius:10,background:'rgba(255,255,255,.05)'}},
  h('img',{src:view.url,alt:'',width:size,height:size,style:{display:'block',width:'100%',height:'100%',imageRendering:'pixelated',objectFit:'cover',objectPosition:'left center'}}));
 return h('span',{'aria-label':view.state==='ambiguous'?'Conflicting portrait resources':'No portrait',title:view.state,style:{display:'grid',placeItems:'center',width:size,height:size,borderRadius:10,border:'1px solid rgba(255,255,255,.18)',opacity:.65}},'◇');
}
function actorOffset(renderId) {
 let hash=0;for(const ch of String(renderId))hash=(Math.imul(hash,33)+ch.codePointAt(0))>>>0;
 return {x:(hash%3-1)*3,y:(Math.floor(hash/3)%3-1)*3};
}
function actorPoint(actor,surfaceId) {
 const point=actor.position;
 if(point?.surfaceId===surfaceId)return {point,transition:false};
 const transition=actor.transition;
 if(!transition)return null;
 const endpoint=transition.progress<.5?transition.from:transition.to;
 return endpoint?.surfaceId===surfaceId?{point:endpoint,transition:true}:null;
}
function barrierLine(barrier,cell) {
 const {from,to}=barrier;
 if(from.x===to.x){const y=Math.max(from.y,to.y)*cell;return {x1:from.x*cell,y1:y,x2:(from.x+1)*cell,y2:y};}
 const x=Math.max(from.x,to.x)*cell;return {x1:x,y1:from.y*cell,x2:x,y2:(from.y+1)*cell};
}
function SceneViewport({value,snapshot}) {
 const presentation=value.presentationWorld;
 const world=presentation?.world;
 if(!world?.surfaces?.length)return null;
 const transition=snapshot.cameraTransition;
 const transitionCamera=transition?(transition.progress<.5?transition.from:transition.to):null;
 const requestedCamera=snapshot.camera??transitionCamera;
 const surface=world.surfaces.find(item=>item.id===requestedCamera?.surfaceId)??world.surfaces[0];
 const camera=requestedCamera?.surfaceId===surface.id?requestedCamera:{surfaceId:surface.id,x:(surface.width-1)/2,y:(surface.height-1)/2};
 const cell=32,worldWidth=surface.width*cell,worldHeight=surface.height*cell;
 const viewportWidth=Math.min(surface.width,16)*cell,viewportHeight=Math.min(surface.height,10)*cell;
 const centerX=(camera.x+.5)*cell,centerY=(camera.y+.5)*cell;
 const left=clamp(centerX-viewportWidth/2,0,Math.max(0,worldWidth-viewportWidth));
 const top=clamp(centerY-viewportHeight/2,0,Math.max(0,worldHeight-viewportHeight));
 const visible=new Set(snapshot.semantic.visibleEventIds),spatial=presentation.mode==='qualified-spatial';
 const lines=[];
 for(let x=0;x<=surface.width;x++)lines.push(h('line',{key:`gx${x}`,x1:x*cell,y1:0,x2:x*cell,y2:worldHeight,opacity:.07}));
 for(let y=0;y<=surface.height;y++)lines.push(h('line',{key:`gy${y}`,x1:0,y1:y*cell,x2:worldWidth,y2:y*cell,opacity:.07}));
 const blocked=(surface.blocked??[]).map(({x,y})=>h('rect',{key:`blocked:${x}:${y}`,x:x*cell,y:y*cell,width:cell,height:cell,opacity:.14}));
 const geometry=spatial?(presentation.geometry??[]).filter(item=>item.outerRect?.surfaceId===surface.id).map(item=>{
  const rect=item.outerRect;
  return h('g',{key:`geometry:${item.nodeId}`,'data-geometry-kind':item.baseType},
   h('rect',{x:rect.x*cell,y:rect.y*cell,width:rect.width*cell,height:rect.height*cell,fill:'none',stroke:'currentColor',strokeWidth:2,opacity:.32}),
   h('title',null,`${item.baseType}: ${value.metadata[item.nodeId]?.title||item.nodeId}`));
 }):[];
 const barriers=spatial?(world.barriers??[]).filter(item=>item.from.surfaceId===surface.id).map((item,index)=>{
  const line=barrierLine(item,cell);return h('line',{key:`barrier:${index}`,...line,stroke:'currentColor',strokeWidth:3,opacity:.72});
 }):[];
 const links=spatial?(world.links??[]).flatMap(link=>{
  const endpoints=[link.from,link.to].filter((point,index,array)=>point.surfaceId===surface.id&&array.findIndex(other=>other.surfaceId===point.surfaceId&&other.x===point.x&&other.y===point.y)===index);
  return endpoints.map((point,index)=>h('g',{key:`link:${link.id}:${index}`,'data-link-kind':link.kind,'data-link-enabled':link.enabled!==false},
   h('circle',{cx:(point.x+.5)*cell,cy:(point.y+.5)*cell,r:link.kind==='stairs'?7:5,fill:'rgba(11,13,18,.82)',stroke:'currentColor',strokeWidth:link.kind==='stairs'?2:1.5,strokeDasharray:link.enabled===false?'3 2':undefined,opacity:.85}),
   link.kind==='stairs'&&h('text',{x:(point.x+.5)*cell,y:(point.y+.5)*cell+4,textAnchor:'middle',fontSize:11,fill:'currentColor'},'↕'),
   h('title',null,`${link.kind}: ${link.id}`)));
 }):[];
 const markers=Object.entries(presentation.locations??{}).filter(([id,point])=>visible.has(id)&&point?.surfaceId===surface.id).map(([id,point])=>{
  const cx=(point.x+.5)*cell,cy=(point.y+.5)*cell,record=value.metadata[id];
  return h('g',{key:`artifact:${id}`,'data-artifact-id':id},
   h('rect',{x:cx-6,y:cy-6,width:12,height:12,transform:`rotate(45 ${cx} ${cy})`,fill:'rgba(255,255,255,.06)',stroke:'currentColor',strokeWidth:1.5,opacity:.58}),
   h('title',null,record?.title||id));
 });
 const actors=snapshot.actors.flatMap(actor=>{
  const resolved=actorPoint(actor,surface.id);if(!resolved)return [];
  const point=resolved.point,offset=actorOffset(actor.renderId),cx=(point.x+.5)*cell+offset.x,cy=(point.y+.5)*cell+offset.y;
  const ghost=actor.mode==='ghost';
  return [h('g',{key:`actor:${actor.renderId}`,'data-actor-mode':actor.mode,'data-actor-phase':actor.phase,'data-actor-transition':resolved.transition?'surface':'none'},
   h('circle',{cx,cy,r:6,fill:ghost?'none':'currentColor',stroke:'currentColor',strokeWidth:ghost?2:1,strokeDasharray:ghost||resolved.transition?'4 3':undefined,opacity:actor.emphasis==='sharp'?1:.5}),
   h('title',null,`${actor.identityId} · ${actor.mode} · ${actor.phase}`))];
 });
 const light=.55+.45*(snapshot.lighting?.light??1);
 const surfaceName=surface.id.startsWith('@playthings:')?'Root':value.metadata[surface.id]?.title||surface.id;
 const cameraText=transition?`surface transition ${Math.round(transition.progress*100)}%`:`camera ${camera.x.toFixed(1)}, ${camera.y.toFixed(1)}`;
 return h('section',{'aria-label':'Playthings world',style:{position:'relative',width:'100%',height:'100%',minHeight:0,overflow:'hidden'}},
  h('svg',{role:'img','aria-label':'Playthings world presentation','data-playthings-world':presentation.mode,'data-playthings-surface':surface.id,'data-camera-transition':transition?'active':'none',viewBox:`${left} ${top} ${viewportWidth} ${viewportHeight}`,
   style:{display:'block',width:'100%',height:'100%',background:'radial-gradient(circle at 50% 45%, rgba(255,255,255,.045), rgba(0,0,0,.22))',filter:`brightness(${light})`}},
   h('rect',{x:0,y:0,width:worldWidth,height:worldHeight,fill:'none',stroke:'currentColor',opacity:.2}),
   ...blocked,h('g',{stroke:'currentColor',strokeWidth:.5},...lines),...geometry,...barriers,...links,...markers,...actors),
  h('div',{style:{position:'absolute',top:16,right:16,padding:'8px 10px',borderRadius:10,...panelStyle,textAlign:'right',pointerEvents:'none'}},
   h('strong',{style:{display:'block',fontSize:13}},surfaceName),
   h('small',{style:{display:'block',opacity:.72}},spatial?`${world.surfaces.length} presentation surfaces`:'Root fallback'),
   h('small',{style:{display:'block',opacity:.55}},cameraText)));
}
function FrontierShelf({snapshot,value,resolveCompanions,host}) {
 return h('section',{'aria-label':'Current lineage frontiers',style:{display:'flex',gap:10,overflowX:'auto',padding:'10px 12px 12px',scrollbarWidth:'thin'}},...snapshot.frontiers.map(frontier=>{
  const record=value.metadata[frontier.artifactId];
  const actors=frontier.actors.map(a=>`${a.identityId}${a.mode==='ghost'?' · ghost':''}`).join(', ')||'No declared participants';
  return h('article',{key:frontier.artifactId,'data-frontier-mode':frontier.actors.some(a=>a.mode==='ghost')?'ghost':'active',style:{display:'grid',gridTemplateColumns:'56px minmax(140px,220px)',gap:10,flex:'0 0 auto',padding:10,borderRadius:12,...panelStyle,opacity:frontier.actors.every(a=>a.mode==='ghost')?.62:1}},
   h(Portrait,{record,resolveCompanions,host}),
   h('div',{style:{minWidth:0}},h('strong',{style:{display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},record?.title||frontier.artifactId),
    h('small',{style:{display:'block',opacity:.65,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},actors),
    h('small',{style:{display:'block',opacity:.45,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},record?.createdAt||'')));
 }));
}
function RootGate({host,duration,current,setCursor,playing,setPlaying,fullscreenError,setFullscreenError}) {
 const [open,setOpen]=useState(false);
 const fullscreen=async()=>{try{const result=await host?.requestFullscreen?.();if(!result)setFullscreenError('Browser fullscreen is unavailable in this host.');else setFullscreenError('');}catch{setFullscreenError('Browser fullscreen was not granted. Immersive Playthings remains active.');}};
 const pill={padding:'9px 12px',borderRadius:999,border:'1px solid rgba(255,255,255,.28)',background:'rgba(10,12,18,.82)',color:'inherit',fontWeight:700,boxShadow:'0 8px 30px rgba(0,0,0,.28)',backdropFilter:'blur(10px)'};
 return h('aside',{'aria-label':'Root Gate',style:{position:'absolute',top:16,left:16,zIndex:10}},
  h('div',{style:{display:'flex',gap:7,alignItems:'center'}},
   h('button',{type:'button','aria-label':'Back to Viewer',title:'Exit Playthings to Viewer / Verse switcher',onClick:()=>host?.exitVerse?.(),style:pill},'◈ Root Gate'),
   h('button',{type:'button','aria-label':'Root Gate menu','aria-expanded':open,title:'Presentation controls',onClick:()=>setOpen(v=>!v),style:{...pill,padding:'9px 11px'}},'⋯'),
   typeof host?.requestFullscreen==='function'&&h('button',{type:'button','aria-label':'Fullscreen',title:'Browser fullscreen (optional)',onClick:fullscreen,style:{...pill,padding:'9px 11px'}},'⛶')),
  open&&h('div',{style:{marginTop:8,width:'min(300px,calc(100vw - 32px))',padding:12,borderRadius:14,...panelStyle}},
   h('strong',{style:{display:'block',marginBottom:8}},'Presentation'),
   h('div',{style:{display:'grid',gap:7}},
    duration>0&&h('button',{type:'button',onClick:()=>{setCursor(0);setPlaying(true);setOpen(false);}},'Replay history'),
    duration>0&&h('button',{type:'button',onClick:()=>setPlaying(v=>!v)},playing?'Pause presentation':'Continue presentation'),
    duration>0&&h('button',{type:'button',onClick:()=>{setPlaying(false);setCursor(duration);}},'Latest')),
   h('small',{style:{display:'block',marginTop:9,opacity:.55}},`Presentation ${Math.round(current)} / ${Math.round(duration)} ms`),
   fullscreenError&&h('small',{role:'status',style:{display:'block',marginTop:6,opacity:.78}},fullscreenError)));
}
function CenterState({title,children}) {
 return h('section',{style:{height:'100%',display:'grid',placeItems:'center',padding:32,textAlign:'center'}},h('div',null,h('h1',{style:{margin:'0 0 10px',fontSize:'clamp(28px,6vw,56px)'}},title),children));
}
export function PlaythingsVerse({applicationData,getPlaythingsStoryRecords,resolveCompanions,host,verse}) {
 const model=useMemo(()=>{try{return {value:createAppVerseModel({applicationData,getPlaythingsStoryRecords,resolveCompanions})};}catch(error){return {error:error.message};}},[applicationData,getPlaythingsStoryRecords,resolveCompanions]);
 const [cursor,setCursor]=useState(null),[playing,setPlaying]=useState(false),[fullscreenError,setFullscreenError]=useState('');
 const value=model.value,duration=value?.presentationDurationMs??0,current=value?clamp(cursor===null?duration:cursor,0,duration):0;
 useEffect(()=>{host?.setImmersive?.(true);return()=>host?.setImmersive?.(false);},[host]);
 useEffect(()=>{setCursor(null);setPlaying(false);},[value]);
 useEffect(()=>{
  if(!playing||duration<=0)return;
  const request=globalThis.requestAnimationFrame??(callback=>setTimeout(()=>callback(Date.now()),16));
  const cancel=globalThis.cancelAnimationFrame??clearTimeout;
  let frame=0,last=null,position=current;
  const tick=(now)=>{if(last===null)last=now;const delta=Math.max(0,Math.min(100,now-last));last=now;position=Math.min(duration,position+delta);setCursor(position);if(position>=duration){setPlaying(false);return;}frame=request(tick);};
  frame=request(tick);return()=>cancel(frame);
 },[playing,duration]);
 const sampled=value?sampleAppScene(value,current):null;
 const gate=h(RootGate,{host,duration,current,setCursor,playing,setPlaying,fullscreenError,setFullscreenError});
 if(model.error)return h('main',{'data-playthings-state':'blocked','data-playthings-immersive':'true',style:shellStyle},gate,h(CenterState,{title:'Playthings'},h('p',{role:'alert'},'The App data contract is unavailable. Exit to Viewer and reload the Workspace.'),h('details',null,h('summary',null,'Details'),model.error)));
 if(sampled.state==='empty')return h('main',{'data-playthings-state':'empty','data-playthings-immersive':'true',style:shellStyle},gate,h(CenterState,{title:'Playthings'},h('p',null,'Load a Workspace in Viewer, then return here to experience its lineage.')));
 const scene=sampled.snapshot,snapshot=scene.semantic;
 return h('main',{'data-playthings-state':'ready','data-playthings-immersive':'true','data-verse-id':verse?.id||'playthings',style:shellStyle},
  gate,
  h('div',{style:{height:'100%',display:'grid',gridTemplateRows:'minmax(0,1fr) auto',minHeight:0}},
   h(SceneViewport,{value,snapshot:scene}),
   h('section',{'aria-label':'Playthings lineage timeline',style:{...panelStyle,borderLeft:0,borderRight:0,borderBottom:0,boxShadow:'0 -12px 40px rgba(0,0,0,.28)'}},
    h('div',{style:{display:'grid',gridTemplateColumns:'auto minmax(120px,1fr) auto',alignItems:'center',gap:10,padding:'10px 12px 0'}},
     h('button',{type:'button',onClick:()=>setPlaying(v=>!v),style:{minWidth:74}},playing?'Pause':'Play'),
     h('input',{type:'range',min:0,max:Math.max(0,duration),value:current,step:Math.max(1,Math.round(duration/1000)||1),onChange:e=>{setPlaying(false);setCursor(Number(e.target.value));},'aria-label':'History position',style:{width:'100%'}}),
     h('small',{style:{whiteSpace:'nowrap',opacity:.7}},new Date(scene.clock.historicalTimeMs).toISOString())),
    h('div',{style:{display:'flex',justifyContent:'space-between',gap:12,padding:'7px 12px 0',fontSize:12,opacity:.58}},
     h('span',null,`${snapshot.visibleEventIds.length} visible artifacts · ${snapshot.frontiers.length} lineage frontiers`),
     h('span',null,`${value.times.filter(time=>time<=scene.clock.historicalTimeMs).length} / ${value.times.length} declared historical moments · ${scene.observationPhase?`Observation: ${scene.observationPhase.kind}`:(value.presentationWorld.mode==='qualified-spatial'?'qualified presentation world':'Root fallback')}`)),
    h(FrontierShelf,{snapshot,value,resolveCompanions,host}))),
  (value.omittedRecords>0||scene.blockedDepictionIds.length>0)&&h('div',{role:'status',style:{position:'absolute',right:16,bottom:142,zIndex:5,padding:'7px 9px',borderRadius:9,...panelStyle,fontSize:12,opacity:.8}},
   `${value.omittedRecords>0?`${value.omittedRecords} without historical position`:''}${value.omittedRecords>0&&scene.blockedDepictionIds.length>0?' · ':''}${scene.blockedDepictionIds.length>0?`${scene.blockedDepictionIds.length} not physically depicted`:''}`),
  h('span',{style:{position:'absolute',width:1,height:1,padding:0,margin:-1,overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:0}},'Placement, camera and depiction are Playthings presentation only. Runtime schema knowledge and companion availability do not create Tiinex semantic authority or story discovery.'));
}
export default PlaythingsVerse;
