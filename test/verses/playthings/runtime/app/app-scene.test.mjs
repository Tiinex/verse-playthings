import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppVerseModel,sampleAppScene,sampleAppVerse} from '../../../../../src/verses/playthings/app/index.mjs';

const storyRecords=[
 {id:'w::a.trace.md',parentId:null,historicalTimeMs:0,authors:['A']},
 {id:'w::b.trace.md',parentId:'w::a.trace.md',historicalTimeMs:1000,authors:['A']},
];
const applicationData={schema:'tiinex.core.application-data.v1',records:storyRecords.map((record,index)=>({
 id:record.id,workspaceId:'w',path:record.id.slice(3),title:`Record ${index+1}`,schemaId:'tiinex.task.v1',createdAt:`1970-01-01 00:00:0${index}`
}))};

test('App model keeps semantic story and Root fallback distinct when no spatial resolver exists',()=>{
 const model=createAppVerseModel({applicationData,getPlaythingsStoryRecords:()=>storyRecords});
 assert.equal(model.rootWorld.kind,'playthings-root-world-scaffold');
 assert.equal(model.spatialCandidate,null);
 assert.equal(model.rootWorld.spatialCapabilitiesApplied,false);
 assert.equal(model.presentationWorld.mode,'root-scaffold');
 assert.equal(model.scene.kind,'playthings-scene-plan');
 assert.equal(model.scene.rendererQualified,false);
 assert.equal(model.scene.rendererMode,'root-scaffold');
 const latest=sampleAppScene(model,model.presentationDurationMs).snapshot;
 assert.deepEqual(latest.semantic.visibleEventIds,['w::a.trace.md','w::b.trace.md']);
 assert.ok(latest.actors.every(actor=>actor.position?.surfaceId===model.rootWorld.surfaceId));
 assert.match(model.boundary,/no execution.*new semantic authority/i);
});

test('historical index sampling remains available beside presentation sampling',()=>{
 const model=createAppVerseModel({applicationData,getPlaythingsStoryRecords:()=>storyRecords});
 assert.deepEqual(sampleAppVerse(model,0).snapshot.visibleEventIds,['w::a.trace.md']);
 assert.throws(()=>sampleAppScene(model,-1),/presentation-time/);
 assert.throws(()=>sampleAppScene(model,model.presentationDurationMs+1),/presentation-time/);
});

test('Root renderer budget is explicit and does not remove semantic records',()=>{
 const more=Array.from({length:5},(_,i)=>({id:`w::${i}.trace.md`,parentId:i?`w::${i-1}.trace.md`:null,historicalTimeMs:i,authors:['A']}));
 const data={schema:'tiinex.core.application-data.v1',records:more.map(r=>({id:r.id,workspaceId:'w',path:r.id.slice(3)}))};
 const model=createAppVerseModel({applicationData:data,getPlaythingsStoryRecords:()=>more,maxRootRecords:3});
 assert.equal(model.story.records.length,5);assert.equal(Object.keys(model.rootWorld.locations).length,3);
 assert.ok(model.rootWorld.findings.some(f=>f.code==='root-scaffold.record-budget'&&f.omitted===2));
 const latest=sampleAppScene(model,model.presentationDurationMs).snapshot;
 assert.equal(latest.semantic.visibleEventIds.length,5);assert.ok(latest.blockedDepictionIds.length>=2);
});


const spatialRecords=[
 {id:'w::house',parentId:null,historicalTimeMs:0,authors:['A']},
 {id:'w::floor-a',parentId:'w::house',historicalTimeMs:1000,authors:['A']},
 {id:'w::floor-b',parentId:'w::house',historicalTimeMs:2000,authors:['A']},
];
const spatialData={schema:'tiinex.core.application-data.v1',records:spatialRecords.map((record,index)=>({
 id:record.id,workspaceId:'w',path:record.id.slice(3),title:`Spatial ${index+1}`,schemaId:'tiinex.task.v1',createdAt:`1970-01-01 00:00:0${index}`
}))};
const exactResource=(slot,path)=>({namespace:'playthings',slot,id:`resource:${slot}:${path}`,path:`${path}.playthings.${slot}.png`,providerId:'fixture',
 owner:{kind:'artifact',workspaceId:'w',artifactPath:path}});
function spatialResolver(query){
 if(query.owner.artifactPath==='house'&&query.slot==='structure')return {status:'resolved',resources:[exactResource('structure','house')]};
 if(query.owner.artifactPath.startsWith('floor-')&&query.slot==='tiles')return {status:'resolved',resources:[exactResource('tiles',query.owner.artifactPath)]};
 return {status:'missing',resources:[]};
}

test('complete exact-companion geometry cuts over to qualified multi-surface scene',()=>{
 const model=createAppVerseModel({applicationData:spatialData,getPlaythingsStoryRecords:()=>spatialRecords,resolveCompanions:spatialResolver});
 assert.equal(model.spatialCandidate.status,'ready');
 assert.equal(model.spatialCandidate.spatialWorld.geometryQualified,true);
 assert.equal(model.presentationWorld.mode,'qualified-spatial');
 assert.equal(model.presentationWorld.geometryQualified,true);
 assert.equal(model.scene.rendererQualified,true);
 assert.equal(model.scene.rendererMode,'qualified-spatial');
 assert.ok(model.presentationWorld.world.surfaces.length>=3);
 const phase=model.scene.observation.phases.find(item=>item.kind==='surface-transition');
 assert.ok(phase,'expected a real cross-surface camera phase');
 const during=sampleAppScene(model,(phase.startMs+phase.endMs)/2).snapshot;
 assert.equal(during.camera,null);
 assert.equal(during.cameraTransition.from.surfaceId,phase.from.surfaceId);
 assert.equal(during.cameraTransition.to.surfaceId,phase.to.surfaceId);
});

test('resolver availability alone does not replace Root fallback without spatial activation',()=>{
 const model=createAppVerseModel({applicationData,getPlaythingsStoryRecords:()=>storyRecords,
  resolveCompanions:()=>({status:'missing',resources:[]})});
 assert.equal(model.spatialCandidate.status,'ready');
 assert.equal(model.presentationWorld.mode,'root-scaffold');
 assert.equal(model.scene.rendererQualified,false);
});


test('Props-only exact capability remains a modifier and cannot trigger spatial renderer cutover',()=>{
 const model=createAppVerseModel({applicationData,getPlaythingsStoryRecords:()=>storyRecords,
  resolveCompanions:query=>query.owner.artifactPath==='a.trace.md'&&query.slot==='props'
   ?{status:'resolved',resources:[{namespace:'playthings',slot:'props',id:'props:a',path:'a.playthings.props.png',providerId:'fixture',
     owner:{kind:'artifact',workspaceId:'w',artifactPath:'a.trace.md'}}]}
   :{status:'missing',resources:[]}});
 assert.equal(model.spatialCandidate.status,'ready');
 assert.equal(model.spatialCandidate.capabilities.records.find(record=>record.id==='w::a.trace.md').capabilities.props,true);
 assert.equal(model.presentationWorld.mode,'root-scaffold');
 assert.equal(model.scene.rendererQualified,false);
});
