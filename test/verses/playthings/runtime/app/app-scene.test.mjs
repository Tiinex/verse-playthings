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

test('App model keeps semantic story and Root-only presentation scaffold distinct',()=>{
 const model=createAppVerseModel({applicationData,getPlaythingsStoryRecords:()=>storyRecords});
 assert.equal(model.rootWorld.kind,'playthings-root-world-scaffold');
 assert.equal(model.spatialCandidate,null);
 assert.equal(model.rootWorld.spatialCapabilitiesApplied,false);
 assert.equal(model.scene.kind,'playthings-scene-plan');
 assert.equal(model.scene.rendererQualified,false);
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
