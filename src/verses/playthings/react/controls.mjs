import React,{useEffect,useRef,useState} from 'react';
import {projectHostVerseChoices} from '../app/host-controls.mjs';
const h=React.createElement;
export const panelStyle=Object.freeze({background:'rgba(13,18,27,.96)',border:'1px solid rgba(255,255,255,.19)',boxShadow:'0 12px 40px rgba(0,0,0,.36)',color:'#f1f3f5'});
export const buttonStyle=Object.freeze({minHeight:44,minWidth:44,padding:'9px 13px',borderRadius:12,border:'1px solid rgba(255,255,255,.3)',background:'#192431',color:'#f1f3f5',font:'inherit',cursor:'pointer'});
export function Dialog({label,onClose,children}) {
  const ref=useRef(null),close=useRef(onClose);close.current=onClose;
  useEffect(()=>{
    const dialog=ref.current,returnFocus=document.activeElement;
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    return()=>{dialog.close?.();if(returnFocus?.isConnected)returnFocus.focus?.();};
  },[]);
  return h('dialog',{ref,'aria-label':label,onCancel:event=>{event.preventDefault();close.current();},style:{...panelStyle,maxWidth:500,width:'calc(100vw - 40px)',maxHeight:'calc(100dvh - 40px)',padding:20,borderRadius:18,overflow:'auto'}},
    h('div',{style:{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',marginBottom:16}},h('h2',{style:{margin:0,fontSize:20}},label),h('button',{type:'button',style:buttonStyle,'aria-label':`Close ${label}`,onClick:onClose},'×')),children);
}
export function RootGate({host,verseId,open,setOpen,actions,reducedMotion,setReducedMotion,diagnostics}) {
  const [error,setError]=useState('');
  const choices=projectHostVerseChoices(host?.availableVerses,verseId);
  const invoke=async(fn)=>{try{if(typeof fn!=='function')throw new Error('This host does not provide that control.');const result=await fn();if(result===false)throw new Error('The host did not grant this request.');setError('');}catch(cause){setError(String(cause?.message||cause));}};
  const exit=()=>void invoke(host?.exitVerse);
  const openMenu=()=>{actions.pause();setOpen(true);};
  return h(React.Fragment,null,
    h('nav',{'aria-label':'Root Gate',style:{position:'absolute',top:'max(12px,env(safe-area-inset-top))',left:'max(12px,env(safe-area-inset-left))',zIndex:10,display:'flex',gap:7}},
      h('button',{type:'button',style:buttonStyle,'aria-label':'Root Gate menu','aria-haspopup':'dialog','aria-expanded':open,onClick:openMenu},'◈ Root Gate'),
      h('button',{type:'button',style:buttonStyle,'aria-label':'Back to Viewer',title:'Return to Viewer and its Verse switcher',onClick:exit},'↩')),
    error&&!open&&h('p',{role:'status',style:{position:'absolute',top:66,left:12,zIndex:11,padding:12,...panelStyle}},error),
    open&&h(Dialog,{label:'Root Gate',onClose:()=>setOpen(false)},
      h('div',{style:{display:'grid',gap:10}},
        h('button',{type:'button',style:buttonStyle,onClick:exit},'Return to Viewer'),
        choices.choices.length>0&&typeof host?.switchVerse==='function'&&h('fieldset',{style:{border:'1px solid #596777',borderRadius:10}},h('legend',null,'Switch Verse'),...choices.choices.map(choice=>h('button',{key:choice.id,type:'button',style:{...buttonStyle,margin:4},onClick:()=>void invoke(()=>host.switchVerse(choice.id))},choice.label))),
        choices.status!=='ready'&&h('small',null,'Other Verses are available through Viewer. This host has not supplied a Verse list.'),
        h('button',{type:'button',style:buttonStyle,onClick:()=>{actions.replay();setOpen(false);}},'Replay history'),
        h('button',{type:'button',style:buttonStyle,onClick:()=>{actions.latest();setOpen(false);}},'Latest'),
        h('button',{type:'button',style:buttonStyle,onClick:()=>{actions.rebuild();setOpen(false);}},'Rebuild presentation layout'),
        h('small',null,'Rebuild may move presentation geometry. It never changes artifacts or their history.'),
        typeof host?.requestFullscreen==='function'&&h('button',{type:'button',style:buttonStyle,'aria-label':'Fullscreen',onClick:()=>void invoke(host.requestFullscreen)},'Browser fullscreen'),
        h('label',{style:{display:'flex',gap:10,minHeight:44,alignItems:'center'}},h('input',{type:'checkbox',checked:reducedMotion,onChange:event=>setReducedMotion(event.target.checked)}),'Reduce visual motion'),
        error&&h('p',{role:'alert'},error),
        h('details',null,h('summary',null,'Presentation status'),h('p',null,diagnostics),h('p',null,'Artwork is the current presentation skin, not evidence that these pixels existed at the historical playhead.')),
        h('small',null,'Space: pause/resume · ←/→: previous/next moment · Escape: menu/close. Source material is read-only.'))));
}
