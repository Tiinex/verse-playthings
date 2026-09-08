import React,{useEffect,useMemo,useState} from 'react';
import {createAppVerseModel,sampleAppVerse} from '../app/index.mjs';
import {inspectPng} from '../runtime/companions/png.inspect.mjs';
export const appContract='tiinex.playthings.app.v1';
const h=React.createElement;
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
export function PlaythingsVerse({applicationData,getPlaythingsStoryRecords,resolveCompanions,host}) {
 const model=useMemo(()=>{try{return {value:createAppVerseModel({applicationData,getPlaythingsStoryRecords})};}catch(error){return {error:error.message};}},[applicationData,getPlaythingsStoryRecords]);
 const [cursor,setCursor]=useState(null),[fullscreenError,setFullscreenError]=useState('');
 const value=model.value;
 const index=value?.times.length ? (cursor===null?value.times.length-1:Math.min(cursor,value.times.length-1)) : 0;
 const sampled=value?sampleAppVerse(value,index):null;
 const controls=h('nav',{'aria-label':'Playthings controls',style:{display:'flex',gap:12,flexWrap:'wrap'}},
  h('button',{type:'button',onClick:()=>host?.exitVerse?.()},'Back to Viewer'),
  h('button',{type:'button',onClick:async()=>{try{const result=await host?.requestFullscreen?.();if(!result)setFullscreenError('Fullscreen is unavailable in this host.');else setFullscreenError('');}catch{setFullscreenError('Fullscreen was not granted. You can continue in this view.');}}},'Fullscreen'));
 if(model.error)return h('main',{'data-playthings-state':'blocked',style:{padding:24}},controls,h('h1',null,'Playthings'),h('p',{role:'alert'},'The App data contract is not available. Return to Viewer and reload the Workspace.'),h('details',null,h('summary',null,'Details'),model.error));
 const snapshot=sampled.snapshot;
 return h('main',{'data-playthings-state':sampled.state,style:{padding:24,minHeight:'85vh',background:'var(--bg, #14151d)',color:'var(--text, #eeeeef)'}},
  controls,h('h1',null,'Playthings'),h('p',null,'Artifact history · experimental read-only view'),
  fullscreenError&&h('p',{role:'status'},fullscreenError),
  sampled.state==='empty'?h('p',null,'Load a Workspace in Viewer to explore its history here.'):h(React.Fragment,null,
   h('label',null,'History position ',h('input',{type:'range',min:0,max:value.times.length-1,value:index,onChange:e=>setCursor(Number(e.target.value)),'aria-label':'History position'})),
   h('p',null,`${index+1} / ${value.times.length} declared historical moments · ${snapshot.visibleEventIds.length} artifacts`),
   h('ul',{style:{listStyle:'none',padding:0,display:'grid',gap:12,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}},...snapshot.frontiers.map(frontier=>{
    const record=value.metadata[frontier.artifactId];
    return h('li',{key:frontier.artifactId,style:{padding:16,border:'1px solid currentColor',borderRadius:8}},
     h(Portrait,{record,resolveCompanions,host}),h('h2',{style:{fontSize:'1rem'}},record?.title||frontier.artifactId),
     h('p',null,record?.schemaId||'Unresolved schema'),h('p',null,frontier.actors.map(a=>`${a.identityId} (${a.mode})`).join(', ')||'No declared participants'),
     h('small',null,record?.createdAt||''));
   }))),
  value.omittedRecords>0&&h('p',{role:'status'},`${value.omittedRecords} records have no usable historical position and are not depicted.`),
  value.story.findings.length>0&&h('details',null,h('summary',null,`${value.story.findings.length} unresolved history observations`),h('ul',null,...value.story.findings.map((f,i)=>h('li',{key:i},`${f.id}: ${f.code}`)))),
  h('small',null,'Depiction is not proof of work occurrence, responsibility transfer or Handoff acceptance.'));
}
export default PlaythingsVerse;
