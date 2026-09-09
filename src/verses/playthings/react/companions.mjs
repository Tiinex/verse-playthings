import React,{useEffect,useMemo,useState} from 'react';
import {createCompanionResourceStore,resolveVisualCompanions,sampleCompanionFrame} from '../runtime/companions/index.mjs';
const h=React.createElement;

export function useCompanionStore(applicationData,readCompanion) {
  const [value,setValue]=useState(null);
  useEffect(()=>{
    if(typeof readCompanion!=='function'){setValue(null);return;}
    const store=createCompanionResourceStore({readCompanion,
      decodeImage:typeof globalThis.createImageBitmap==='function'?async(blob,{signal})=>{signal.throwIfAborted();const bitmap=await createImageBitmap(blob);bitmap.close();signal.throwIfAborted();}:undefined});
    setValue({applicationData,readCompanion,store});return()=>store.dispose();
  },[applicationData,readCompanion]);
  return value?.applicationData===applicationData&&value?.readCompanion===readCompanion?value.store:null;
}
export function useAtlas(store,resource,channel) {
  const key=resource?JSON.stringify([resource.id,resource.path,resource.url,resource.sha256,resource.providerId,resource.owner]):'';
  const [state,setState]=useState(null);
  useEffect(()=>{
    if(!store||!resource){setState(null);return;}
    let active=true,lease;
    try{lease=store.acquire(resource,channel);lease.promise.then(result=>{if(active)setState({store,key,result});});}
    catch(error){setState({store,key,result:{status:'unavailable',reason:String(error?.message||error)}});}
    return()=>{active=false;lease?.release();};
  },[store,key,channel]);
  // A previous effect's image must not flash while the new effect is pending.
  return state?.store===store&&state.key===key?state.result:{status:resource?'loading':'missing'};
}
export function AtlasCell({store,resource,channel,...props}) {
  const atlas=useAtlas(store,resource,channel);return h('g',{'data-companion-status':atlas.status},h(AtlasCrop,{atlas,channel,...props}),atlas.status==='unavailable'&&h('title',null,'Companion artwork unavailable; source history is unchanged.'));
}
export function AtlasCrop({atlas,channel,frameOptions={},x=0,y=0,width=32,height=32,opacity=1}) {
  let frame=null;
  if(atlas.status==='ready')try{frame=sampleCompanionFrame(atlas.layout,frameOptions);}catch{}
  if(!frame||frame.status!=='ready')return null;
  return h('svg',{x,y,width,height,viewBox:`${frame.x} ${frame.y} ${frame.width} ${frame.height}`,preserveAspectRatio:'xMidYMid meet',overflow:'hidden',opacity,
    'data-companion-channel':channel,'data-companion-status':'ready','data-atlas-slot':frame.slot,'aria-hidden':true,style:{imageRendering:'pixelated',pointerEvents:'none'}},
    h('image',{href:atlas.url,x:0,y:0,width:atlas.layout.width,height:atlas.layout.height}));
}
export function useVisualResources(context,record,channel) {
  const {resolveCompanions,ledger,historicalTimeMs,epoch}=context;
  return useMemo(()=>resolveVisualCompanions({record,channel,resolveCompanions,ledger,historicalTimeMs}),[record,channel,resolveCompanions,ledger,epoch]);
}
export function CompanionSprite({context,record,channel,frameOptions={},width=48,height=48,x=0,y=0,fallback=null}) {
  const selection=useVisualResources(context,record,channel);
  if(selection.status!=='resolved'||selection.resources.length!==1)return h('g',{'data-companion-resolution':selection.status,'data-companion-status':selection.resources?.length>1?'unsupported-collection':selection.status},fallback);
  return h('g',{'data-companion-resolution':selection.status},...selection.resources.slice(0,1).map(resource=>h(AtlasCell,{key:resource.id,store:context.store,resource,channel,frameOptions,width,height,x,y})));
}
export function Portrait({context,record,size=48,mode='active'}) {
  const selection=useVisualResources(context,record,'portrait');
  return h('svg',{width:size,height:size,viewBox:`0 0 ${size} ${size}`,role:'img','aria-label':selection.status==='ambiguous'?'Conflicting portrait resources':'Artifact presentation portrait',
    'data-companion-resolution':selection.status,style:{flexShrink:0,borderRadius:10,background:'rgba(255,255,255,.05)'}},
    h('text',{x:size/2,y:size/2+6,textAnchor:'middle',fontSize:22,fill:'currentColor',opacity:.4},'◇'),
    selection.status==='resolved'&&selection.resources.length===1&&h(AtlasCell,{store:context.store,resource:selection.resources[0],channel:'portrait',frameOptions:{mode},width:size,height:size}));
}
