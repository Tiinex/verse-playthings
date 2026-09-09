import {createStoryPlan,sampleStoryPlan,createVisibilityLedger,sampleVisibilityLedger} from '../runtime/story/index.mjs';
import {createCompanionSpatialWorld,createRootWorldScaffold} from '../runtime/world/index.mjs';
import {selectPresentationWorld} from '../runtime/world/presentation.mjs';
import {createScenePlan,sampleScenePlan} from '../runtime/scene/index.mjs';
import {createWorldVisibilitySampler} from '../runtime/world/visibility.mjs';
import {reconcilePresentationWorld} from './continuity.mjs';
import {freeze} from '../runtime/shared/values.mjs';
const worldSamplers=new WeakMap();
/** This adapter consumes App's projection; it never parses Tiinex source, invents
 * missing ancestry, maps labels to identities, or mutates loaded Workspaces. */
export const APP_DATA_CONTRACT = 'tiinex.core.application-data.v1';
export const PLAYTHINGS_APP_CONTRACT = 'tiinex.playthings.app.v1';
export function createAppVerseModel({applicationData,getPlaythingsStoryRecords,resolveCompanions,maxRecords=10000,maxRootRecords=256,maxSpatialRecords=512,previousModel=null,introductions=[]}={}) {
 if(applicationData?.schema!==APP_DATA_CONTRACT||typeof getPlaythingsStoryRecords!=='function')throw Error('playthings.app.contract-unavailable');
 if(!Number.isInteger(maxRecords)||maxRecords<1)throw Error('playthings.app.invalid-limit');
 if(!Number.isInteger(maxRootRecords)||maxRootRecords<1||maxRootRecords>maxRecords)throw Error('playthings.app.invalid-root-limit');
 const records=getPlaythingsStoryRecords();
 if(!Array.isArray(records)||records.length>maxRecords)throw Error('playthings.app.record-budget');
 if(!Array.isArray(applicationData.records)||applicationData.records.length>maxRecords)throw Error('playthings.app.metadata-budget');
 if(!Number.isSafeInteger(maxSpatialRecords)||maxSpatialRecords<1)throw Error('playthings.app.invalid-spatial-limit');
 const metadata=Object.create(null);
 for(const r of applicationData.records){if(!r||typeof r.id!=='string'||!r.id.trim()||Object.hasOwn(metadata,r.id))throw Error('playthings.app.duplicate-metadata');
  for(const key of ['workspaceId','path','title','schemaId','createdAt'])if(Object.hasOwn(r,key)&&typeof r[key]!=='string')throw Error('playthings.app.invalid-metadata');
  metadata[r.id]=Object.freeze(Object.fromEntries(['id','workspaceId','path','title','schemaId','createdAt','historicalTimeMs'].filter(key=>Object.hasOwn(r,key)).map(key=>[key,r[key]])));}

 if(records.some(r=>!Object.hasOwn(metadata,r.id)))throw Error('playthings.app.snapshot-mismatch');
 const visibility=createVisibilityLedger({records,metadata:Object.values(metadata),introductions});
 const identities=visibility.introductions.filter(item=>item.kind==='identity'&&item.state==='qualified').map(item=>({id:item.subjectId,discoveredAtMs:item.historicalTimeMs}));
 const story=createStoryPlan(records,{identities});
 const times=Object.freeze([...new Set(story.records.map(r=>r.historicalTimeMs))]);
 const spatialCandidate=story.records.length>maxSpatialRecords?freeze({status:'blocked',capabilities:null,spatialWorld:null,findings:[{code:'spatial-capability.record-budget',severity:'warning'}]}):story.records.length&&typeof resolveCompanions==='function'?createCompanionSpatialWorld({records:story.records,metadata,resolveCompanions},{historicalTimeMs:times.at(-1),seed:'playthings-world'}):null;
 const rootWorld=story.records.length?createRootWorldScaffold(story,{maxRecords:Math.min(maxRootRecords,story.records.length)}):null;
 const candidateWorld=rootWorld?selectPresentationWorld({spatialCandidate,rootWorld}):null;
 const continuity=candidateWorld?reconcilePresentationWorld(previousModel,candidateWorld,story,metadata,spatialCandidate?.capabilities):{presentation:null,status:'empty',pendingIds:[]};
 const presentationWorld=continuity.presentation;
 const worldAt=presentationWorld?createWorldVisibilitySampler(presentationWorld,story.records,{ledger:visibility,capabilities:spatialCandidate?.capabilities}):null;
 const scene=presentationWorld?createScenePlan(story,{world:presentationWorld.world,locations:presentationWorld.locations,
  worldForEvent:event=>presentationWorld.mode==='root-scaffold'?presentationWorld.world:worldAt(event.historicalTimeMs).world,
  locationsForEvent:event=>presentationWorld.mode==='root-scaffold'?presentationWorld.locations:worldAt(event.historicalTimeMs).locations,
  rendererQualified:presentationWorld.geometryQualified,rendererMode:presentationWorld.mode,
  playback:{endHistoricalMs:times.at(-1),followsLiveTime:false}}):null;
 const model=Object.freeze({contract:PLAYTHINGS_APP_CONTRACT,story,metadata:Object.freeze(metadata),times,visibility,
  continuity:freeze({status:continuity.status,pendingIds:continuity.pendingIds}),
  spatialCandidate,rootWorld,presentationWorld,scene,presentationDurationMs:scene?.observation?.playback?.finitePresentationDurationMs??0,
  omittedRecords:(applicationData.records||[]).length-records.length,
  boundary:'Read-only history depiction. Complete exact-companion spatial geometry may drive the multi-surface renderer; otherwise the bounded Root scaffold stays active; no execution, Handoff acceptance or new semantic authority.'});
 if(worldAt)worldSamplers.set(model,worldAt);return model;
}
export function sampleAppVerse(model,index) {
 if(model?.contract!==PLAYTHINGS_APP_CONTRACT)throw Error('playthings.app.model-required');
 if(!model.times.length)return Object.freeze({state:'empty',snapshot:null});
 if(!Number.isInteger(index)||index<0||index>=model.times.length)throw Error('playthings.app.time-index');
 return Object.freeze({state:'ready',snapshot:sampleStoryPlan(model.story,model.times[index])});
}
export function sampleAppScene(model,presentationTimeMs,options={}) {
 if(model?.contract!==PLAYTHINGS_APP_CONTRACT)throw Error('playthings.app.model-required');
 if(!model.scene)return Object.freeze({state:'empty',snapshot:null});
 if(typeof presentationTimeMs!=='number'||!Number.isFinite(presentationTimeMs)||presentationTimeMs<0||presentationTimeMs>model.presentationDurationMs)throw Error('playthings.app.presentation-time');
 const scene=sampleScenePlan(model.scene,presentationTimeMs,options);
 return Object.freeze({state:'ready',snapshot:freeze({...scene,presentationWorld:worldSamplers.get(model)(scene.clock.historicalTimeMs),
  knowledge:sampleVisibilityLedger(model.visibility,scene.clock.historicalTimeMs)})});
}
/** Package-owned definition stays dependency-free; React is loaded only on selection. */
export function createPlaythingsVerse(options={}) {
 return Object.freeze({id:'playthings',label:options.label||'Playthings',fullscreen:true,
  load:()=>import('../react/index.mjs'),capabilities:Object.freeze(['read-application-data','read-companions','immersive-presentation']),
  boundary:'Playthings is an immersive presentation Verse over App-owned Tiinex projections and companion resolution. Host fullscreen/immersive controls do not create semantic authority.'});
}

export {advanceExperienceCursor,rebaseExperienceCursor,cursorAtHistoricalTime,stepExperienceMoment} from './playback.mjs';
