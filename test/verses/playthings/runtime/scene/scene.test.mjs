import test from 'node:test';
import assert from 'node:assert/strict';
import {createStoryPlan} from '../../../../../src/verses/playthings/runtime/story/index.mjs';
import {createNavigationWorld,withLinkState} from '../../../../../src/verses/playthings/runtime/world/index.mjs';
import {createScenePlan,sampleScenePlan,daylightAt,createSceneStore} from '../../../../../src/verses/playthings/runtime/scene/index.mjs';
const point=(x,surfaceId='first')=>({x,y:0,surfaceId});
function fixture(closed=false) {
 const records=[{id:'p',parentId:null,historicalTimeMs:0,authors:['A']},{id:'old',parentId:'p',historicalTimeMs:1,authors:['A']},{id:'new',parentId:'p',historicalTimeMs:2,authors:['A']}];
 const world=createNavigationWorld({surfaces:[{id:'first',width:8,height:1},{id:'second',width:8,height:1}],links:[
  {id:'door',kind:'door',from:point(2),to:point(3),enabled:!closed},{id:'stair',kind:'stairs',from:point(6),to:point(0,'second'),cost:2}]});
 const story=createStoryPlan(records,{identities:[{id:'A',discoveredAtMs:2}]});
 return createScenePlan(story,{world,locations:{p:point(4),old:point(0),new:point(4,'second')},playback:{endHistoricalMs:2,paceLevel:4,minDwellMs:200},movement:{unitsPerSecond:2,forkDwellMs:500}});
}
const phase=(p,id,kind)=>p.observation.phases.find(x=>x.eventId===id&&x.kind===kind);
test('scene stages actors separately from semantic knowledge; no destination teleport at anchor',()=>{
 const p=fixture(),w=phase(p,'new','presentation-work'),s=sampleScenePlan(p,w.startMs);
 assert.ok(s.semantic.visibleEventIds.includes('new'));assert.equal(s.clock.historicalTimeMs,2);
 const active=s.actors.find(a=>a.artifactId==='new'),ghost=s.actors.find(a=>a.artifactId==='old');
 assert.deepEqual(active.position,point(0));assert.deepEqual(ghost.position,point(0));assert.equal(ghost.mode,'ghost');assert.equal(ghost.emphasis,'toned');
 assert.equal(active.appearance,'identity');assert.notDeepEqual(active.position,point(4,'second'));
});
test('fork, stairs and arrived phases retain one history anchor and explicit layer transitions',()=>{
 const p=fixture(),w=phase(p,'new','presentation-work'),track=p.routes.new.tracks[0];
 const marker=track.legs.find(l=>l.kind==='fork'),s=sampleScenePlan(p,w.startMs+marker.startMs+100);
 assert.equal(s.actors.find(a=>a.artifactId==='new').phase,'fork');assert.equal(s.clock.historicalTimeMs,2);
 let seenStair=false;for(let t=w.startMs;t<w.endMs;t+=125){const a=sampleScenePlan(p,t).actors.find(a=>a.artifactId==='new');if(a?.phase==='stairs'){seenStair=true;assert.equal(a.position,null);assert.equal(a.transition.from.surfaceId,'first');assert.equal(a.transition.to.surfaceId,'second');}}
 assert.ok(seenStair);
 const arrived=sampleScenePlan(p,w.endMs);assert.deepEqual(arrived.actors.find(a=>a.artifactId==='new').position,point(4,'second'));
});
test('selecting an echo changes emphasis, not source truth or physical location',()=>{
 const p=fixture(),t=p.observation.playback.finitePresentationDurationMs;
 const plain=sampleScenePlan(p,t),selected=sampleScenePlan(p,t,{selectedFrontierId:'old'});
 assert.deepEqual(plain.semantic.visibleEventIds,selected.semantic.visibleEventIds);
 assert.equal(selected.actors.find(a=>a.artifactId==='old').mode,'ghost');assert.equal(selected.actors.find(a=>a.artifactId==='old').emphasis,'sharp');
 assert.deepEqual(plain.actors.map(a=>a.position),selected.actors.map(a=>a.position));
});
test('later identity does not leak into early presentation',()=>{
 const p=fixture(),s=sampleScenePlan(p,phase(p,'p','dwell').startMs);
 assert.ok(s.actors.every(a=>a.appearance==='default'));assert.ok(!s.semantic.visibleEventIds.includes('new'));
});
test('blocked route stays unresolved and later dependent travel cannot restart from invisible frontier',()=>{
 const p=fixture(true),s=sampleScenePlan(p,p.observation.playback.finitePresentationDurationMs);
 assert.ok(s.semantic.visibleEventIds.includes('new'));assert.ok(s.blockedDepictionIds.includes('old'));assert.ok(s.blockedDepictionIds.includes('new'));
 assert.equal(s.actors.length,1);assert.deepEqual(s.actors[0].position,point(4));
});
test('even a zero-length root arrival cannot stand on a blocked tile',()=>{
 const world=createNavigationWorld({surfaces:[{id:'s',width:2,height:1,blocked:[{x:1,y:0}]}]});
 const story=createStoryPlan([{id:'p',parentId:null,historicalTimeMs:0,authors:['A']}]);
 const p=createScenePlan(story,{world,locations:{p:point(1,'s')},playback:{endHistoricalMs:0}});
 assert.equal(p.routes.p.ready,false);assert.ok(sampleScenePlan(p,0).blockedDepictionIds.includes('p'));
});
test('equal-time visits follow explicit Parent order; facts are available together despite camera travel',()=>{
 const world=createNavigationWorld({surfaces:[{id:'s',width:10,height:1}]}),records=[{id:'z-parent',parentId:null,historicalTimeMs:0,authors:['A']},{id:'a-child',parentId:'z-parent',historicalTimeMs:0,authors:['A']}];
 const p=createScenePlan(createStoryPlan(records),{world,locations:{'z-parent':point(1,'s'),'a-child':point(8,'s')},playback:{endHistoricalMs:0}});
 assert.equal(p.observation.phases.find(x=>x.kind==='dwell').eventId,'z-parent');
 const s=sampleScenePlan(p,0);assert.deepEqual(s.semantic.visibleEventIds,['a-child','z-parent']);
 assert.equal(s.depictionIsHistory,false);assert.ok(s.pendingDepictionIds.includes('a-child'));
});
test('two authors get stable distinct render ids and input plans are not mutated',()=>{
 const records=[{id:'x',parentId:null,historicalTimeMs:0,authors:['A','B']}],world=createNavigationWorld({surfaces:[{id:'s',width:2,height:1}]});
 const story=createStoryPlan(records),before=JSON.stringify(story),p=createScenePlan(story,{world,locations:{x:point(0,'s')},playback:{endHistoricalMs:0}});
 const s=sampleScenePlan(p,p.observation.playback.finitePresentationDurationMs);assert.equal(new Set(s.actors.map(a=>a.renderId)).size,2);assert.equal(JSON.stringify(story),before);
 assert.ok(Object.isFrozen(s.actors[0].position));assert.deepEqual(s,sampleScenePlan(p,p.observation.playback.finitePresentationDurationMs));
});
test('daylight follows history during bullet time, supports dates before epoch and explicit offset',()=>{
 assert.equal(daylightAt(0).light,.3);assert.equal(daylightAt(43_200_000).light,1);
 assert.deepEqual(daylightAt(-43_200_000),daylightAt(43_200_000));assert.equal(daylightAt(0,{utcOffsetMinutes:720}).light,1);
 const p=fixture(),w=phase(p,'new','presentation-work');assert.deepEqual(sampleScenePlan(p,w.startMs).lighting,sampleScenePlan(p,w.endMs-1).lighting);
 assert.throws(()=>daylightAt(0,{minimumLight:2}));assert.throws(()=>sampleScenePlan(p,-1));
});
test('missing locations are findings, not spawn-at-origin fallback',()=>{
 const world=createNavigationWorld({surfaces:[{id:'s',width:2,height:1}]});
 const p=createScenePlan(createStoryPlan([{id:'x',parentId:null,historicalTimeMs:0,authors:['A']}]),{world,playback:{endHistoricalMs:0}});
 const s=sampleScenePlan(p,10000);assert.equal(s.actors.length,0);assert.deepEqual(s.blockedDepictionIds,['x']);
});
test('external store snapshot identity is stable between changes and pause suppresses clock updates',()=>{
 const store=createSceneStore(fixture());let count=0;const off=store.subscribe(()=>count++),first=store.getSnapshot();
 assert.equal(store.getSnapshot(),first);store.tick(0);assert.equal(count,0);
 store.setPaused(true);const paused=store.getSnapshot();store.tick(10000);assert.equal(store.getSnapshot(),paused);
 assert.equal(count,1);store.setPaused(false);store.tick(100);assert.ok(count>1);off();const old=count;store.tick(100);assert.equal(count,old);
 assert.equal(store.getServerSnapshot(),first);
});
test('guarded ticks keep every dwell observable even with huge deltas; seek is explicitly separate',()=>{
 const p=fixture(),store=createSceneStore(p),seen=new Set();
 for(let i=0;i<1000;i++){const s=store.tick(100000);if(s.observationPhase?.kind==='dwell')seen.add(s.observationPhase.eventId);if(s.clock.phase==='complete')break;}
 assert.deepEqual([...seen].sort(),['new','old','p']);
 const result=store.seek(0);assert.equal(result.clock.historicalTimeMs,0);assert.equal(result.completedVisitIds.length,0);
});
test('subscription errors cannot prevent other listeners; reentrant mutation fails, state is committed',()=>{
 const store=createSceneStore(fixture());let called=0;
 store.subscribe(()=>{throw new Error('observer failure');});store.subscribe(()=>called++);
 assert.throws(()=>store.tick(1),AggregateError);assert.equal(called,1);assert.equal(store.getSnapshot().clock.presentationTimeMs,1);
 const b=createSceneStore(fixture());b.subscribe(()=>b.seek(0));assert.throws(()=>b.tick(1),AggregateError);
});
test('independent subscriptions, disposal, unknown selection and future selection are handled',()=>{
 const store=createSceneStore(fixture());let calls=0;const fn=()=>calls++,a=store.subscribe(fn),b=store.subscribe(fn);
 a();store.tick(1);assert.equal(calls,1);b();assert.throws(()=>store.select('missing'));assert.throws(()=>store.select('new'));
 assert.throws(()=>store.setPaused('yes'));assert.throws(()=>store.seek(NaN));assert.throws(()=>store.tick(-1));
 store.dispose();assert.throws(()=>store.tick(1));assert.throws(()=>store.subscribe(fn));assert.ok(store.getSnapshot());
});
test('prototype-looking artifact identities stay ordinary data keys',()=>{
 const story=createStoryPlan([{id:'__proto__',parentId:null,historicalTimeMs:0,authors:['constructor']}]);
 const world=createNavigationWorld({surfaces:[{id:'s',width:2,height:1}]});
 const locations=Object.fromEntries([['__proto__',point(0,'s')]]);
 const p=createScenePlan(story,{world,locations,playback:{endHistoricalMs:0}}),s=sampleScenePlan(p,0);
 assert.equal(s.actors[0].artifactId,'__proto__');assert.equal(Object.getPrototypeOf(p.routes),null);
});
test('starting playback after existing history initializes its frontier without replaying all visits',()=>{
 const story=createStoryPlan([{id:'a',parentId:null,historicalTimeMs:0,authors:['A']},{id:'b',parentId:'a',historicalTimeMs:10,authors:['A']}]);
 const world=createNavigationWorld({surfaces:[{id:'s',width:8,height:1}]});
 const p=createScenePlan(story,{world,locations:{a:point(0,'s'),b:point(7,'s')},playback:{startHistoricalMs:5,endHistoricalMs:10}});
 assert.equal(sampleScenePlan(p,0).actors[0].artifactId,'a');
});
test('external store copies retained lighting options',()=>{
 const settings={utcOffsetMinutes:0},p=fixture(),a=createSceneStore(p,{lighting:settings}),b=createSceneStore(p,{lighting:{utcOffsetMinutes:0}});
 settings.utcOffsetMinutes=720;a.tick(1);b.tick(1);assert.deepEqual(a.getSnapshot().lighting,b.getSnapshot().lighting);
});
