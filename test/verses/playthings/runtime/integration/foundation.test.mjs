import test from 'node:test';
import assert from 'node:assert/strict';
import { createStoryPlan, sampleStoryPlan, planFrontierRoutes, sampleFrontierRoutes } from '../../../../../src/verses/playthings/runtime/story/index.mjs';
import { createNavigationWorld, withLinkState } from '../../../../../src/verses/playthings/runtime/world/index.mjs';
import { createObservationPlan, sampleObservationPlan, advanceObservationState } from '../../../../../src/verses/playthings/runtime/observation/index.mjs';

const point = (x,y,surfaceId='floor-1') => ({x,y,surfaceId});
function fixture() {
  const records = [
    {id:'origin',parentId:null,historicalTimeMs:0,authors:['Anchor']},
    {id:'previous-leaf',parentId:'origin',historicalTimeMs:1,authors:['Anchor']},
    {id:'new-branch',parentId:'origin',historicalTimeMs:2,authors:['Anchor']},
  ];
  const story=createStoryPlan(records, {identities:[{id:'Anchor',discoveredAtMs:0}]});
  const world=createNavigationWorld({surfaces:[{id:'floor-1',width:8,height:1},{id:'floor-2',width:8,height:1}],links:[
    {id:'door',kind:'door',from:point(2,0),to:point(3,0)},
    {id:'stairs',kind:'stairs',from:point(6,0),to:point(0,0,'floor-2'),cost:2},
  ]});
  const locations={'origin':point(4,0),'previous-leaf':point(0,0),'new-branch':point(4,0,'floor-2')};
  return {records,story,world,locations,event:story.log.at(-1)};
}

test('headless fork: ghost stays put; active actor walks to ancestor, forks, then climbs stairs',()=>{
  const {story,world,locations,event}=fixture();
  const route=planFrontierRoutes(event,locations,world,{unitsPerSecond:2,forkDwellMs:500});
  assert.equal(route.ready,true); assert.equal(route.tracks[0].leaveGhostAt,'previous-leaf');
  assert.deepEqual(sampleFrontierRoutes(route,0)[0].ghostPosition,locations['previous-leaf']);
  const marker=route.tracks[0].legs.find(l=>l.kind==='fork');
  assert.deepEqual(sampleFrontierRoutes(route,marker.startMs+250)[0].position,locations.origin);
  assert.equal(sampleFrontierRoutes(route,marker.startMs+250)[0].phase,'fork');
  assert.deepEqual(sampleFrontierRoutes(route,route.durationMs)[0].position,locations['new-branch']);
  assert.equal(sampleStoryPlan(story,2).frontiers.find(f=>f.artifactId==='previous-leaf').actors[0].mode,'ghost');
});
test('a physically blocked backtrack cannot complete by following a Parent line through the wall',()=>{
  const {event,locations,world}=fixture();
  const route=planFrontierRoutes(event,locations,withLinkState(world,'door',false));
  assert.equal(route.ready,false);assert.equal(route.tracks[0].status,'unreachable');
  assert.equal(sampleFrontierRoutes(route,1_000_000)[0].phase,'blocked');
});
test('missing locations and unresolved ancestry have distinct deferred outcomes',()=>{
  const {event,locations,world}=fixture();
  assert.equal(planFrontierRoutes(event,{},world).tracks[0].status,'missing-location');
  const unknown=createStoryPlan([{id:'x',historicalTimeMs:0,authors:['A']}]).log[0];
  assert.equal(planFrontierRoutes(unknown,locations,world).tracks[0].status,'unresolved-origin');
});
test('observation reservation accommodates physical backtrack without rewinding history',()=>{
  const {event,records,locations,world}=fixture();
  const route=planFrontierRoutes(event,locations,world);
  const scenes=Object.fromEntries(Object.entries(locations).map(([id,location])=>[id,{location,presentationWorkMs:id==='new-branch'?route.durationMs:0}]));
  const director=createObservationPlan(records,{endHistoricalMs:2,paceLevel:4,scenes});
  const phase=director.phases.find(p=>p.eventId==='new-branch'&&p.kind==='presentation-work');
  assert.equal(phase.endMs-phase.startMs,route.durationMs);
  for(const fraction of [0,.25,.5,.75,.999]) {
    const sample=sampleObservationPlan(director,phase.startMs+(phase.endMs-phase.startMs)*fraction);
    assert.equal(sample.clock.historicalTimeMs,2);
    assert.ok(sample.availableEventIds.includes('new-branch'));
  }
});
test('all three scenes remain observable even under huge incoming frame deltas',()=>{
  const {records,locations}=fixture();
  const director=createObservationPlan(records,{endHistoricalMs:2,paceLevel:4,
    scenes:Object.fromEntries(Object.entries(locations).map(([id,location])=>[id,{location}]))});
  let state={}; const seen=new Set();
  for(let i=0;i<500;i++) {
    state=advanceObservationState(director,state,100_000);
    if(state.sample.phase?.kind==='dwell') seen.add(state.sample.phase.eventId);
    if(state.sample.completedVisits.length===records.length) break;
  }
  assert.deepEqual([...seen].sort(),records.map(r=>r.id).sort());
});
test('two authors retain independent route tracks; no cross-identity aliasing',()=>{
  const {world,locations}=fixture();
  const story=createStoryPlan([{id:'origin',parentId:null,historicalTimeMs:0,authors:['A','B']},
    {id:'previous-leaf',parentId:'origin',historicalTimeMs:1,authors:['A','B']},
    {id:'new-branch',parentId:'origin',historicalTimeMs:2,authors:['A','B']}]);
  const route=planFrontierRoutes(story.log.at(-1),locations,world);
  assert.deepEqual(route.tracks.map(t=>t.actorId),['A','B']);
  assert.equal(route.ready,true);
});
