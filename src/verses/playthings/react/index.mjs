import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createAppVerseModel,sampleAppScene,advanceExperienceCursor,rebaseExperienceCursor,stepExperienceMoment} from '../app/index.mjs';
import {useCompanionStore,Portrait} from './companions.mjs';
import {RootGate,Dialog,panelStyle,buttonStyle} from './controls.mjs';
import {SceneViewport} from './viewport.mjs';
export const appContract='tiinex.playthings.app.v1';
const h=React.createElement;
const shellStyle=Object.freeze({position:'fixed',inset:0,zIndex:2147483000,width:'100%',height:'100dvh',overflow:'hidden',background:'#0b0d12',color:'#f1f3f5',fontFamily:'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'});
const date=value=>{const d=new Date(value);return Number.isFinite(d.getTime())?d.toISOString().replace('T',' ').replace('.000Z',' UTC'):'Declared time outside display range';};
function useReducedMotion() {
  const [system,setSystem]=useState(false),[override,setOverride]=useState(null);
  useEffect(()=>{const media=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');if(!media)return;const update=()=>setSystem(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  return [override??system,setOverride];
}
function ArtifactInspector({model,snapshot,id,onClose,host}) {
  const [error,setError]=useState('');
  if(!snapshot.semantic.visibleEventIds.includes(id))return null;
  const record=model.metadata[id],event=model.story.log.find(item=>item.id===id);
  if(!record||!event)return null;
  const parent=event.parentId&&snapshot.semantic.visibleEventIds.includes(event.parentId)?model.metadata[event.parentId]:null;
  return h(Dialog,{label:'Artifact inspector',onClose},
    h('h3',{style:{overflowWrap:'anywhere'}},record.title||id),
    h('dl',{style:{display:'grid',gap:5,overflowWrap:'anywhere'}},
      h('dt',null,'Workspace'),h('dd',{style:{margin:'0 0 8px'}},record.workspaceId||'Unresolved'),
      h('dt',null,'Artifact'),h('dd',{style:{margin:'0 0 8px'}},record.path||id),
      h('dt',null,'Declared time'),h('dd',{style:{margin:'0 0 8px'}},date(event.historicalTimeMs)),
      h('dt',null,'Schema reference — not a discovery claim'),h('dd',{style:{margin:'0 0 8px'}},record.schemaId||'Unresolved'),
      h('dt',null,'Parent'),h('dd',{style:{margin:'0 0 8px'}},parent?.title||parent?.id||(event.parentId===null?'Declared parentless':'Unresolved at this time')),
      h('dt',null,'Depicted parties'),h('dd',{style:{margin:'0 0 8px'}},`${event.actors.ids.join(', ')||'None declared'} · ${event.actors.basis}`)),
    h('p',null,event.transition==='formal-handoff-declaration'?'Handoff declaration. This does not prove acceptance or execution.':event.depiction==='qualified-occurrence'?'Occurrence supplied by the host projection.':'Artifact introduction. No completed work is inferred.'),
    typeof host?.openArtifact==='function'&&h('button',{type:'button',style:buttonStyle,onClick:async()=>{try{await host.openArtifact(record.id);}catch(cause){setError(String(cause?.message||cause));}}},'Open in host'),
    error&&h('p',{role:'alert'},error),
    h('small',null,'Read-only presentation. Layout, movement and artwork do not add Tiinex meaning.'));
}
function ArtifactShelf({model,snapshot,context,onSelect,onInspect,selected}) {
  const [all,setAll]=useState(false),[query,setQuery]=useState(''),[page,setPage]=useState(0);
  const frontiers=new Map(snapshot.semantic.frontiers.map(frontier=>[frontier.artifactId,frontier]));
  const ids=all?snapshot.semantic.visibleEventIds:[...frontiers.keys()];
  const normalized=query.trim().toLocaleLowerCase('en');
  const filtered=ids.filter(id=>!normalized||`${model.metadata[id]?.title||''} ${id}`.toLocaleLowerCase('en').includes(normalized));
  const currentPage=Math.min(page,Math.max(0,Math.ceil(filtered.length/24)-1));
  const rows=filtered.slice(currentPage*24,(currentPage+1)*24);
  return h('section',{'aria-label':'Current lineage frontiers'},
    h('div',{className:'pt-shelf-controls',style:{display:'flex',gap:8,padding:'8px 12px 0',alignItems:'center',flexWrap:'wrap'}},
      h('button',{type:'button',style:buttonStyle,'aria-pressed':all,onClick:()=>{setAll(v=>!v);setPage(0);}},all?'All visible artifacts':'Lineage frontiers'),
      h('input',{type:'search',value:query,'aria-label':'Find visible artifact',placeholder:'Find visible artifact',onChange:e=>{setQuery(e.target.value);setPage(0);},style:{...buttonStyle,minWidth:120,width:180}}),
      filtered.length>24&&h(React.Fragment,null,h('button',{type:'button',style:buttonStyle,disabled:currentPage===0,'aria-label':'Previous artifact page',onClick:()=>setPage(currentPage-1)},'←'),h('small',null,`${currentPage+1} / ${Math.ceil(filtered.length/24)}`),h('button',{type:'button',style:buttonStyle,disabled:(currentPage+1)*24>=filtered.length,'aria-label':'Next artifact page',onClick:()=>setPage(currentPage+1)},'→'))),
    h('div',{style:{display:'flex',gap:8,overflowX:'auto',padding:10,scrollbarWidth:'thin',minHeight:76}},
      ...rows.map(id=>{const record=model.metadata[id],frontier=frontiers.get(id),ghost=frontier?.actors.length>0&&frontier.actors.every(actor=>actor.mode==='ghost');return h('article',{key:id,'data-frontier-id':id,'data-frontier-mode':ghost?'ghost':'active',style:{...panelStyle,display:'flex',alignItems:'center',gap:8,padding:8,borderRadius:12,flex:'0 0 245px',opacity:ghost?.66:1,borderColor:id===selected?'#b4e2ef':undefined}},
        h(Portrait,{context,record,size:44,mode:ghost?'ghost':'active'}),
        h('div',{style:{minWidth:0,flex:1}},h('button',{type:'button',onClick:()=>onSelect(id),style:{background:'none',border:0,padding:'2px 0',color:'inherit',font:'inherit',textAlign:'left',cursor:'pointer',maxWidth:'100%',minHeight:44},title:record?.title||id},h('strong',{style:{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},record?.title||id)),
          h('small',{style:{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',opacity:.7}},frontier?.actors.map(actor=>actor.identityId).join(', ')||'Artifact history')),
        h('button',{type:'button',style:{...buttonStyle,padding:'6px'},'aria-label':`Inspect ${record?.title||id}`,onClick:()=>onInspect(id)},'ⓘ'));}),
      !rows.length&&h('p',{role:'status'},'No matching artifacts at this time.')));
}
function CenterState({children}) {return h('section',{style:{height:'100%',display:'grid',placeItems:'center',padding:32,textAlign:'center'}},h('div',null,h('h1',null,'Playthings'),children));}
export function PlaythingsVerse({applicationData,getPlaythingsStoryRecords,resolveCompanions,host,verse}) {
  const previous=useRef({model:null,epoch:0});
  const [epoch,setEpoch]=useState(0),[session,setSession]=useState({model:null,cursor:0,playing:false,selected:null,inspecting:false});
  const [menuOpen,setMenuOpen]=useState(false),[reducedMotion,setReducedMotion]=useReducedMotion();
  // Intentionally no schema/identity introduction guessing from App metadata.
  // The headless binding API is ready for a future qualified host adapter.
  const result=useMemo(()=>{try{return {model:createAppVerseModel({applicationData,getPlaythingsStoryRecords,resolveCompanions,previousModel:previous.current.epoch===epoch?previous.current.model:null})};}catch(error){return {error:String(error?.message||error)};}},[applicationData,getPlaythingsStoryRecords,resolveCompanions,epoch]);
  const value=result.model,duration=value?.presentationDurationMs??0;
  const effective=session.model===value?session:{...session,model:value,cursor:rebaseExperienceCursor(session.model,value,session.cursor),playing:false,inspecting:false};
  const current=Math.max(0,Math.min(duration,effective.cursor));
  const store=useCompanionStore(applicationData,host?.readCompanion);
  useEffect(()=>{previous.current={model:value,epoch};if(session.model!==value)setSession(effective);},[value,epoch]);
  useEffect(()=>{host?.setImmersive?.(true);return()=>host?.setImmersive?.(false);},[host?.setImmersive]);
  const pause=()=>setSession(s=>({...s,playing:false}));
  const seek=position=>setSession(s=>({...s,model:value,cursor:Math.max(0,Math.min(duration,position)),playing:false,inspecting:false}));
  const replay=()=>setSession(s=>({...s,model:value,cursor:0,playing:duration>0,inspecting:false}));
  const toggle=()=>setSession(s=>({...s,model:value,cursor:s.cursor>=duration?0:s.cursor,playing:!s.playing&&duration>0}));
  useEffect(()=>{
    const hidden=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',hidden);return()=>document.removeEventListener('visibilitychange',hidden);
  },[]);
  useEffect(()=>{
    if(!effective.playing||!value?.scene||menuOpen)return;
    let frame=0,last=null;
    const tick=now=>{const elapsed=last===null?0:Math.max(0,now-last);last=now;
      setSession(s=>{if(s.model!==value||!s.playing)return s;const next=advanceExperienceCursor(value,s.cursor,elapsed,{hidden:document.hidden});return {...s,cursor:next,playing:next<duration&&!document.hidden};});frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[effective.playing,value,menuOpen,duration]);
  useEffect(()=>{
    const key=event=>{if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.target.closest?.('input,textarea,select,button,[contenteditable="true"],dialog'))return;
      if(event.key==='Escape'){event.preventDefault();pause();setMenuOpen(true);}
      else if(event.key===' '){event.preventDefault();toggle();}
      else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();seek(stepExperienceMoment(value,current,event.key==='ArrowLeft'?-1:1));}};
    document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
  },[value,current,duration]);
  const sampled=value?sampleAppScene(value,current,{selectedFrontierId:effective.selected}):null;
  const snapshot=sampled?.snapshot;
  const selected=effective.selected&&snapshot?.semantic.visibleEventIds.includes(effective.selected)?effective.selected:null;
  const context={store,resolveCompanions,ledger:value?.visibility,historicalTimeMs:snapshot?.clock.historicalTimeMs??0,epoch:snapshot?.semantic.visibleEventIds.length??0};
  const select=(id,inspecting=false)=>setSession(s=>({...s,selected:id,inspecting,playing:false}));
  const diagnostics=`${value?.continuity.status||'No scene'} · ${snapshot?.blockedDepictionIds.length??0} visible records without physical depiction · ${store?JSON.stringify(store.stats()):'No companion reader'} · Host/footer and Turn-2 integration require browser qualification.`;
  const gate=h(RootGate,{host,verseId:verse?.id||'playthings',open:menuOpen,setOpen:setMenuOpen,actions:{pause,replay,latest:()=>seek(duration),rebuild:()=>{pause();setEpoch(e=>e+1);}},reducedMotion,setReducedMotion,diagnostics});
  const css='[data-playthings-immersive] button:focus-visible,[data-playthings-immersive] input:focus-visible,[data-playthings-immersive] select:focus-visible{outline:3px solid #e8d89e;outline-offset:3px}[data-playthings-immersive] dialog::backdrop{background:rgba(0,0,0,.65)}[data-playthings-immersive] dd{overflow-wrap:anywhere}[data-playthings-immersive] button:disabled{opacity:.4;cursor:not-allowed}@media(max-width:600px){[data-playthings-immersive] .pt-date{font-size:11px;grid-column:1/-1;text-align:right}[data-playthings-immersive] .pt-shelf-controls{padding-top:4px!important}[data-playthings-immersive] [aria-label="Playthings world"]>div{top:66px!important}}';
  let content;
  if(result.error)content=h(CenterState,null,h('p',{role:'alert'},'The App data contract is unavailable. Return to Viewer and reload the Workspace.'),h('details',null,h('summary',null,'Details'),result.error));
  else if(sampled.state==='empty')content=h(CenterState,null,h('p',null,'Load a Workspace in Viewer, then return here to experience its lineage.'));
  else content=h(React.Fragment,null,
    h('div',{style:{height:'100%',display:'grid',gridTemplateRows:'minmax(0,1fr) auto',minHeight:0}},
      h(SceneViewport,{model:value,snapshot,context,selected,onSelect:id=>select(id),reducedMotion}),
      h('section',{'aria-label':'Playthings lineage timeline',style:{...panelStyle,borderLeft:0,borderRight:0,borderBottom:0,paddingBottom:'env(safe-area-inset-bottom)'}},
        h('div',{style:{display:'grid',gridTemplateColumns:'auto minmax(80px,1fr) auto',alignItems:'center',gap:10,padding:'10px 12px 0'}},
          h('button',{type:'button',style:buttonStyle,onClick:toggle},effective.playing?'Pause':'Play'),
          h('input',{type:'range',min:0,max:duration,value:current,step:Math.max(1,Math.round(duration/2000)),onChange:e=>seek(Number(e.target.value)),'aria-label':'History position','aria-valuetext':date(snapshot.clock.historicalTimeMs),style:{width:'100%',minHeight:44}}),
          h('small',{className:'pt-date'},date(snapshot.clock.historicalTimeMs))),
        h('div',{'data-visible-artifact-count':snapshot.semantic.visibleEventIds.length,'data-visible-moment-count':value.times.filter(t=>t<=snapshot.clock.historicalTimeMs).length,style:{padding:'6px 12px 0',fontSize:12,opacity:.7}},`${snapshot.semantic.visibleEventIds.length} visible artifacts · ${value.times.filter(t=>t<=snapshot.clock.historicalTimeMs).length} declared historical moments shown`,
          snapshot.blockedDepictionIds.length>0?` · ${snapshot.blockedDepictionIds.length} not physically depicted`:''),
        h(ArtifactShelf,{model:value,snapshot,context,selected,onSelect:id=>select(id),onInspect:id=>select(id,true)}))),
    value.continuity.status==='held-growth-conflict'&&h('p',{role:'status',style:{position:'absolute',left:12,top:70,maxWidth:'min(440px,calc(100% - 24px))',padding:10,borderRadius:10,...panelStyle,fontSize:13}},'Layout retained after refresh. New history is available in the timeline; some geometry needs an explicit rebuild from Root Gate.'),
    selected&&effective.inspecting&&h(ArtifactInspector,{key:selected,model:value,snapshot,id:selected,host,onClose:()=>setSession(s=>({...s,inspecting:false}))}));
  return h('main',{'data-playthings-state':result.error?'blocked':sampled?.state==='empty'?'empty':'ready','data-playthings-immersive':'true','data-verse-id':verse?.id||'playthings',style:shellStyle,tabIndex:-1},h('style',null,css),gate,content);
}
export default PlaythingsVerse;
