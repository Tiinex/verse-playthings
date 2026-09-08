import {createStoryPlan,sampleStoryPlan} from '../runtime/story/index.mjs';
/** This adapter consumes App's projection; it never parses Tiinex source, invents
 * missing ancestry, maps labels to identities, or mutates loaded Workspaces. */
export const APP_DATA_CONTRACT = 'tiinex.core.application-data.v1';
export const PLAYTHINGS_APP_CONTRACT = 'tiinex.playthings.app.v1';
export function createAppVerseModel({applicationData,getPlaythingsStoryRecords,maxRecords=10000}={}) {
 if(applicationData?.schema!==APP_DATA_CONTRACT||typeof getPlaythingsStoryRecords!=='function')throw Error('playthings.app.contract-unavailable');
 if(!Number.isInteger(maxRecords)||maxRecords<1)throw Error('playthings.app.invalid-limit');
 const records=getPlaythingsStoryRecords();
 if(!Array.isArray(records)||records.length>maxRecords)throw Error('playthings.app.record-budget');
 const metadata=Object.fromEntries((applicationData.records||[]).map(r=>[r.id,r]));
 if(records.some(r=>!Object.hasOwn(metadata,r.id)))throw Error('playthings.app.snapshot-mismatch');
 const story=createStoryPlan(records);
 return Object.freeze({contract:PLAYTHINGS_APP_CONTRACT,story,metadata:Object.freeze(metadata),
  times:Object.freeze([...new Set(story.records.map(r=>r.historicalTimeMs))]),
  omittedRecords:(applicationData.records||[]).length-records.length,
  boundary:'Read-only history depiction; no execution, Handoff acceptance or new semantic authority.'});
}
export function sampleAppVerse(model,index) {
 if(model?.contract!==PLAYTHINGS_APP_CONTRACT)throw Error('playthings.app.model-required');
 if(!model.times.length)return Object.freeze({state:'empty',snapshot:null});
 if(!Number.isInteger(index)||index<0||index>=model.times.length)throw Error('playthings.app.time-index');
 return Object.freeze({state:'ready',snapshot:sampleStoryPlan(model.story,model.times[index])});
}
/** Package-owned definition stays dependency-free; React is loaded only on selection. */
export function createPlaythingsVerse(options={}) {
 return Object.freeze({id:'playthings',label:options.label||'Playthings',fullscreen:false,
  load:()=>import('../react/index.mjs'),capabilities:Object.freeze(['read-application-data','read-companions']),
  boundary:'Experimental Playthings adapter over the App host; world renderer evolves separately.'});
}
