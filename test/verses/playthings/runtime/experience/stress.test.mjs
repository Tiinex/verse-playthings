import test from 'node:test';import assert from 'node:assert/strict';
import {createAppVerseModel,sampleAppScene} from '../../../../../src/verses/playthings/app/index.mjs';
import {projectHostVerseChoices} from '../../../../../src/verses/playthings/app/host-controls.mjs';
const model=records=>createAppVerseModel({applicationData:{schema:'tiinex.core.application-data.v1',records:records.map(r=>({id:r.id,workspaceId:'w',path:r.id,title:r.id,schemaId:'external'}))},getPlaythingsStoryRecords:()=>records});
test('5000 authorless artifacts preserve full history with bounded physical admission',()=>{
 const input=Array.from({length:5000},(_,i)=>({id:`r${i.toString().padStart(5,'0')}`,parentId:null,historicalTimeMs:i}));
 const value=model(input),end=sampleAppScene(value,value.presentationDurationMs).snapshot;
 assert.equal(end.semantic.visibleEventIds.length,5000);assert.equal(Object.keys(end.presentationWorld.locations).length,256);
 assert.equal(end.blockedDepictionIds.length,5000-256);assert.equal(sampleAppScene(value,0).snapshot.semantic.visibleEventIds.length,1);
});
test('same-time branch visits remain deterministic when host file/import order reverses',()=>{
 const input=[{id:'root',parentId:null,historicalTimeMs:0,authors:['A']},...Array.from({length:48},(_,i)=>({id:`branch-${i}`,parentId:'root',historicalTimeMs:100,authors:['A']}))];
 const a=model(input),b=model([...input].reverse());
 assert.deepEqual(a.story,b.story);assert.deepEqual(a.scene.observation,b.scene.observation);
 const final=sampleAppScene(a,a.presentationDurationMs).snapshot;assert.equal(final.semantic.visibleEventIds.length,49);
 assert.equal(final.semantic.frontiers.filter(f=>f.actors.some(actor=>actor.mode==='ghost')).length,0); // Same-time concurrency is not abandonment.
 const later=model([...input,{id:'later-branch',parentId:'root',historicalTimeMs:200,authors:['A']}]);
 assert.ok(sampleAppScene(later,later.presentationDurationMs).snapshot.semantic.frontiers.some(f=>f.actors.some(actor=>actor.mode==='ghost')));
});
test('Handoff endpoints, explicit empty Participants and occurrence states stay distinct',()=>{
 const input=[{id:'a',parentId:null,historicalTimeMs:0,authors:['Writer']},{id:'h',parentId:'a',historicalTimeMs:1,authors:['Writer'],handoff:{from:['A'],to:['B']}},{id:'empty',parentId:'h',historicalTimeMs:2,authors:['Writer'],participants:[],actionStatus:'planned'},{id:'done',parentId:'empty',historicalTimeMs:3,authors:['Writer'],actionStatus:'occurred'}];
 const value=model(input),[a,h,empty,done]=value.story.log;
 assert.equal(a.actors.basis,'authors-contribution');assert.equal(h.transition,'formal-handoff-declaration');assert.deepEqual(h.actors.ids,['A','B']);
 assert.deepEqual(empty.actors.ids,[]);assert.equal(empty.depiction,'artifact-introduction');assert.equal(done.depiction,'qualified-occurrence');
});
test('Root Gate inventory is host-owned, duplicate/invalid entries never become guessed choices',()=>{
 assert.equal(projectHostVerseChoices(undefined,'playthings').choices.length,0);
 const valid=projectHostVerseChoices([{id:'viewer',label:'Viewer'},{id:'playthings',label:'Playthings'},{id:'another',label:'Other'}],'playthings');
 assert.deepEqual(valid.choices.map(c=>c.id),['another']);
 assert.equal(projectHostVerseChoices([{id:'same',label:'A'},{id:'same',label:'B'}],'playthings').choices.length,0);
});
