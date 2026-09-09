import test from 'node:test';import assert from 'node:assert/strict';
import {createVisibilityLedger,sampleVisibilityLedger,resourceDisclosureState} from '../../../../../src/verses/playthings/runtime/story/visibility.mjs';
import {createAppVerseModel,sampleAppScene,advanceExperienceCursor,rebaseExperienceCursor,cursorAtHistoricalTime} from '../../../../../src/verses/playthings/app/index.mjs';
const records=[{id:'artifact',parentId:null,historicalTimeMs:0,authors:['A']},{id:'schema-artifact',parentId:'artifact',historicalTimeMs:100,authors:['A']}];
const metadata=records.map(r=>({id:r.id,path:r.id,workspaceId:'w',schemaId:'external.task',title:r.id}));
const introductions=[{state:'qualified',kind:'schema',subjectId:'external.task',artifactId:'schema-artifact'}];
const create=(rs=records,extra={})=>createAppVerseModel({applicationData:{schema:'tiinex.core.application-data.v1',records:rs.map(r=>({id:r.id,path:r.id,workspaceId:'w',schemaId:'external.task',title:r.id}))},getPlaythingsStoryRecords:()=>rs,...extra});
test('runtime schema references do not create story knowledge',()=>{const ledger=createVisibilityLedger({records,metadata});assert.deepEqual(sampleVisibilityLedger(ledger,200).schemaIds,[]);});
test('explicit Workspace definition binding gates duplicate embedded/story schema both forward and backward',()=>{
 const ledger=createVisibilityLedger({records,metadata,introductions});
 for(const [time,expected] of [[0,[]],[99,[]],[100,['external.task']],[200,['external.task']],[0,[]]])assert.deepEqual(sampleVisibilityLedger(ledger,time).schemaIds,expected);
 assert.equal(resourceDisclosureState({owner:{kind:'schema',schemaId:'external.task'}},ledger,99),'future');
});
test('unqualified / unavailable / conflicting introductions fail closed',()=>{
 for(const input of [[{...introductions[0],state:'declared'}],[{...introductions[0],artifactId:'not-in-story'}],[...introductions,{...introductions[0],artifactId:'artifact'}]]){
  const ledger=createVisibilityLedger({records,metadata,introductions:input});assert.deepEqual(sampleVisibilityLedger(ledger,200).schemaIds,[]);assert.ok(ledger.findings.length);
 }
});
test('a loaded schema without historical position is not disclosed by its name or filename',()=>{
 const ledger=createVisibilityLedger({records:[records[0]],metadata,introductions});assert.deepEqual(sampleVisibilityLedger(ledger,1000).schemaIds,[]);
});
test('prototype-looking identities are ordinary ledger keys',()=>{
 const rs=['__proto__','constructor','toString'].map((id,i)=>({id,parentId:null,historicalTimeMs:i}));
 const ledger=createVisibilityLedger({records:rs,metadata:rs.map(r=>({id:r.id,workspaceId:'w',path:r.id}))});assert.equal(sampleVisibilityLedger(ledger,3).artifactIds.length,3);
});
test('metadata duplicates fail closed before last-writer-wins map conversion',()=>{
 assert.throws(()=>createAppVerseModel({applicationData:{schema:'tiinex.core.application-data.v1',records:[metadata[0],metadata[0]]},getPlaythingsStoryRecords:()=>[records[0]]}),/duplicate-metadata/);
});
test('visibility and model never freeze mutable host input records',()=>{const rs=structuredClone(records);const md=structuredClone(metadata);createAppVerseModel({applicationData:{schema:'tiinex.core.application-data.v1',records:md},getPlaythingsStoryRecords:()=>rs});assert.equal(Object.isFrozen(md[0]),false);assert.equal(Object.isFrozen(rs[0]),false);});
const spatialRecords=[{id:'house',parentId:null,historicalTimeMs:0,authors:['A']},{id:'floor-a',parentId:'house',historicalTimeMs:100,authors:['A']},{id:'floor-b',parentId:'house',historicalTimeMs:200,authors:['A']}];
const resolver=query=>{const p=query.owner.artifactPath;if((p==='house'&&query.slot==='structure')||(p.startsWith('floor-')&&query.slot==='tiles'))return {status:'resolved',resources:[{namespace:'playthings',slot:query.slot,id:`${p}:${query.slot}`,path:`${p}.png`,providerId:'w',owner:{kind:'artifact',workspaceId:'w',artifactPath:p}}]};return {status:'missing',resources:[]};};
test('future geometry, surfaces, stairs and blocked cells are filtered before display',()=>{
 const model=create(spatialRecords,{resolveCompanions:resolver});
 const early=sampleAppScene(model,0).snapshot;
 assert.deepEqual(early.semantic.visibleEventIds,['house']);
 assert.equal(early.presentationWorld.world.surfaces.length,1);
 assert.ok(early.presentationWorld.geometry.every(g=>g.nodeId==='house'));
 assert.ok(early.presentationWorld.world.links.every(link=>link.kind==='door'));
 const end=sampleAppScene(model,model.presentationDurationMs).snapshot;assert.equal(end.presentationWorld.world.surfaces.length,3);
 const rewind=sampleAppScene(model,0).snapshot;assert.equal(rewind.presentationWorld.world.surfaces.length,1);
});
test('earlier routes cannot travel through future floors',()=>{const model=create(spatialRecords,{resolveCompanions:resolver});const route=model.scene.routes['floor-a'];for(const track of route.tracks)for(const leg of track.legs)for(const step of leg.route?.steps??[])assert.notEqual(step.to?.surfaceId,'floor-b');});
test('guarded UI advancement stops at an observation boundary and drops suspended-tab backlog',()=>{
 const model=create();const boundary=model.scene.observation.phases[0].endMs;
 assert.equal(advanceExperienceCursor(model,boundary-1,999999),boundary);
 assert.equal(advanceExperienceCursor(model,10,999999,{hidden:true}),10);
});
test('snapshot replacement preserves historical playhead rather than jumping to latest',()=>{
 const before=create();const phase=before.scene.observation.phases.find(p=>p.eventId==='artifact'&&p.kind==='dwell');const cursor=(phase.startMs+phase.endMs)/2;
 const after=create([...records,{id:'later',parentId:'schema-artifact',historicalTimeMs:300,authors:['A']}],{previousModel:before});
 const rebased=rebaseExperienceCursor(before,after,cursor);assert.equal(sampleAppScene(after,rebased).snapshot.clock.historicalTimeMs,0);assert.notEqual(rebased,after.presentationDurationMs);
 assert.deepEqual(after.presentationWorld.locations.artifact,before.presentationWorld.locations.artifact);
});
test('source removal does not retain stale world as apparent continuity',()=>{const before=create();const after=create([records[0]],{previousModel:before});assert.equal(after.continuity.status,'reset-source-changed');assert.equal(Object.hasOwn(after.presentationWorld.locations,'schema-artifact'),false);});
test('growth conflict is held with explicit pending depiction, not an implicit world jump',()=>{
 const before=create(spatialRecords.slice(0,2),{resolveCompanions:resolver});
 const after=create(spatialRecords,{resolveCompanions:resolver,previousModel:before});
 assert.ok(['preserved','held-growth-conflict'].includes(after.continuity.status));
 assert.deepEqual(after.presentationWorld.locations.house,before.presentationWorld.locations.house);
 if(after.continuity.status==='held-growth-conflict')assert.ok(after.continuity.pendingIds.includes('floor-b'));
});
test('withdrawn exact companions cannot keep a previously spatial world alive',()=>{const before=create(spatialRecords,{resolveCompanions:resolver});const after=create(spatialRecords,{previousModel:before,resolveCompanions:()=>({status:'missing',resources:[]})});assert.equal(after.continuity.status,'reset-companions-changed');assert.equal(after.presentationWorld.mode,'root-scaffold');});
test('large record sets skip expensive spatial compilation explicitly, without removing story',()=>{
 const rs=Array.from({length:1000},(_,i)=>({id:`n${i}`,parentId:null,historicalTimeMs:i,authors:[]}));let calls=0;
 const model=create(rs,{resolveCompanions:()=>{calls++;return {status:'missing',resources:[]};}});
 assert.equal(calls,0);assert.equal(model.story.records.length,1000);assert.equal(model.spatialCandidate.findings[0].code,'spatial-capability.record-budget');
 assert.equal(sampleAppScene(model,model.presentationDurationMs).snapshot.semantic.visibleEventIds.length,1000);
});

test('Root refresh admits new records without prototype-key hazards or inherited capacity lock',()=>{
 const before=create([records[0]]);
 const after=create([records[0],{id:'__proto__',parentId:'artifact',historicalTimeMs:200}],{previousModel:before});
 assert.equal(after.continuity.status,'preserved');assert.equal(Object.hasOwn(after.presentationWorld.locations,'__proto__'),true);
 assert.equal(after.continuity.pendingIds.length,0);assert.deepEqual(after.presentationWorld.locations.artifact,before.presentationWorld.locations.artifact);
});
test('an already completed observation stays completed after appended history',()=>{
 const before=create();const after=create([...records,{id:'later',parentId:'schema-artifact',historicalTimeMs:300}],{previousModel:before});
 const position=rebaseExperienceCursor(before,after,before.presentationDurationMs);
 const oldLast=before.scene.observation.phases.at(-1);
 const phase=after.scene.observation.phases.find(p=>p.eventId===oldLast.eventId&&p.kind===oldLast.kind);
 assert.equal(position,phase.endMs);assert.ok(position<after.presentationDurationMs);
});
test('companion byte revision invalidates old qualified geometry continuity receipts',()=>{
 const withDigest=digest=>q=>{const value=resolver(q);return {...value,resources:value.resources.map(r=>({...r,sha256:digest}))};};
 const before=create(spatialRecords,{resolveCompanions:withDigest('a'.repeat(64))});
 const after=create(spatialRecords,{previousModel:before,resolveCompanions:withDigest('b'.repeat(64))});
 assert.equal(after.continuity.status,'reset-companions-changed');
});
test('future spatial ancestors cannot expose early child surfaces',()=>{
 const rs=[{id:'house',parentId:null,historicalTimeMs:100},{id:'floor-a',parentId:'house',historicalTimeMs:0}];
 const model=create(rs,{resolveCompanions:resolver}),early=sampleAppScene(model,0).snapshot;
 assert.equal(early.presentationWorld.world.surfaces.length,1);assert.equal(early.presentationWorld.geometry.length,0);
 assert.equal(Object.hasOwn(early.presentationWorld.locations,'floor-a'),false);
 assert.ok(early.blockedDepictionIds.includes('floor-a'));
});
test('a future explicitly bound schema cannot disclose its spatial shape via embedded companions',()=>{
 const rs=[{id:'house',parentId:null,historicalTimeMs:0},{id:'schema-artifact',parentId:'house',historicalTimeMs:100}];
 const resolve=q=>q.slot==='structure'&&q.owner.artifactPath==='house'?{status:'resolved',resources:[{namespace:'playthings',slot:'structure',id:'schema-structure',path:'schema.png',providerId:'embedded',owner:{kind:'schema',schemaId:'external.task'}}]}:{status:'missing',resources:[]};
 const model=create(rs,{resolveCompanions:resolve,introductions});
 assert.equal(sampleAppScene(model,0).snapshot.presentationWorld.geometry.length,0);
 assert.equal(sampleAppScene(model,model.presentationDurationMs).snapshot.presentationWorld.geometry.length,1);
 assert.deepEqual(sampleAppScene(model,0).snapshot.knowledge.schemaIds,[]);
});
test('unplaced authorless records remain semantic history and explicitly blocked depiction',()=>{
 const model=create(Array.from({length:260},(_,i)=>({id:`record-${i}`,parentId:null,historicalTimeMs:i})));
 const snapshot=sampleAppScene(model,model.presentationDurationMs).snapshot;
 assert.equal(snapshot.semantic.visibleEventIds.length,260);assert.equal(snapshot.blockedDepictionIds.length,4);
});
test('shared obstacle ownership does not let a future owner erase an earlier wall',async()=>{
 const {createNavigationWorld}=await import('../../../../../src/verses/playthings/runtime/world/navigation.mjs');
 const {createWorldVisibilitySampler,edgeIdentity}=await import('../../../../../src/verses/playthings/runtime/world/visibility.mjs');
 const wall={from:{surfaceId:'root',x:0,y:0},to:{surfaceId:'root',x:1,y:0}};
 const world=createNavigationWorld({surfaces:[{id:'root',width:3,height:3}],barriers:[wall]});
 const sampler=createWorldVisibilitySampler({mode:'qualified-spatial',world,geometry:[],locations:{},topologyOwnership:{surfaces:{root:[]},links:{},blocked:{},barriers:{[edgeIdentity(wall.from,wall.to)]:['a','b']}}},[{id:'a',historicalTimeMs:0},{id:'b',historicalTimeMs:100}]);
 assert.equal(sampler(0).world.barriers.length,1);assert.equal(sampler(100).world.barriers.length,1);assert.equal(sampler(0).world.barriers.length,1);
});
