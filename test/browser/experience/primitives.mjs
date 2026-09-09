import {createCompanionResourceStore,sampleCompanionFrame} from '../../../src/verses/playthings/runtime/companions/index.mjs';
import {createAppVerseModel,sampleAppScene,advanceExperienceCursor} from '../../../src/verses/playthings/app/index.mjs';
const results=[];
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
async function check(name,run){try{await run();results.push({name,status:'pass'});}catch(error){results.push({name,status:'fail',error:String(error?.message||error)});}}
const color=slot=>[(slot*29+17)%256,(slot*43+47)%256,(slot*61+89)%256,255];
const resource=(channel,id=channel)=>({namespace:'playthings',slot:channel,id,providerId:'diagnostic-fixture',path:`${id}.png`,owner:{kind:'root'}});
const store=createCompanionResourceStore({readCompanion:async(r,{signal})=>{const response=await fetch(window.__playthingsFixtureUrls?.[r.id]??`/fixtures/${r.id}.png`,{signal});if(!response.ok)throw Error('fixture HTTP failure');return {bytes:new Uint8Array(await response.arrayBuffer()),mediaType:'image/png'};},
 decodeImage:async(blob,{signal})=>{signal.throwIfAborted();const image=await createImageBitmap(blob);image.close();signal.throwIfAborted();}});
for(const channel of ['character','verb','blueprint','portrait','tiles','structure','props'])await check(`${channel}: native PNG decode and exact cell crop`,async()=>{
 const lease=store.acquire(resource(channel),channel),value=await lease.promise;
 assert(value.status==='ready',value.reason||'not ready');assert(value.pixelsDecoded===true,'must actually decode');
 const options={actionStatus:'occurred',elapsedMs:560,phase:'walk',direction:'right',mode:channel==='portrait'?'ghost':'active',progress:.6,mask:5,part:'roof',slot:2};
 const frame=sampleCompanionFrame(value.layout,options);
 const image=await createImageBitmap(await(await fetch(value.url)).blob());
 const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const context=canvas.getContext('2d',{willReadFrequently:true});context.imageSmoothingEnabled=false;
 context.drawImage(image,frame.x,frame.y,frame.width,frame.height,0,0,64,64);image.close();
 const pixel=[...context.getImageData(32,32,1,1).data];assert(JSON.stringify(pixel)===JSON.stringify(color(frame.slot)),`wrong crop ${frame.slot}: ${pixel}`);
 const card=document.createElement('section');card.className='sample';const title=document.createElement('strong');title.textContent=channel;card.append(title,canvas,document.createTextNode(`slot ${frame.slot}`));document.querySelector('#samples').append(card);lease.release();
});
await check('PNG container valid but undecodable pixels never become a ready resource',async()=>{
 const lease=store.acquire(resource('portrait','invalid-pixels'),'portrait'),value=await lease.promise;assert(value.status==='unavailable','invalid IDAT was accepted');lease.release();
});
await check('real browser module model keeps runtime schemas outside historical knowledge',()=>{
 const records=[{id:'earlier',parentId:null,historicalTimeMs:0,authors:['A']},{id:'definition',parentId:'earlier',historicalTimeMs:100,authors:['A']}];
 const model=createAppVerseModel({applicationData:{schema:'tiinex.core.application-data.v1',schemas:[{id:'external.schema'}],records:records.map(r=>({id:r.id,workspaceId:'w',path:r.id,schemaId:'external.schema'}))},getPlaythingsStoryRecords:()=>records,introductions:[{kind:'schema',state:'qualified',subjectId:'external.schema',artifactId:'definition'}]});
 assert(sampleAppScene(model,0).snapshot.knowledge.schemaIds.length===0,'early schema leaked');assert(sampleAppScene(model,model.presentationDurationMs).snapshot.knowledge.schemaIds.length===1,'schema never appeared');assert(sampleAppScene(model,0).snapshot.knowledge.schemaIds.length===0,'rewind leaked');
 assert(advanceExperienceCursor(model,0,999999,{hidden:true})===0,'hidden tab advanced');
});
await check('dispose revokes every retained object URL',async()=>{
 const lease=store.acquire(resource('portrait'),'portrait'),value=await lease.promise;const url=value.url;store.dispose();
 assert(store.stats().entries===0&&store.stats().retainedBytes===0,'store leaked memory');let failed=false;try{await fetch(url);}catch{failed=true;}assert(failed,'disposed URL was not revoked');lease.release();
});
const gate=document.querySelector('#gate'),opener=document.querySelector('#open-gate');
opener.addEventListener('click',()=>gate.showModal());document.querySelector('#close-gate').addEventListener('click',()=>gate.close());
gate.addEventListener('close',()=>opener.focus());
window.__playthingsPrimitiveResult={scope:'native-browser-primitives-only',reactMounted:false,appHostMounted:false,sigmaAcceptance:false,results};
document.querySelector('#result').textContent=results.map(r=>`${r.status==='pass'?'PASS':'FAIL'}  ${r.name}${r.error?' — '+r.error:''}`).join('\n');
