import test from 'node:test';
import assert from 'node:assert/strict';
import { createObservationPlan, sampleObservationPlan, advanceObservationState } from '../../../../../src/verses/playthings/runtime/observation/index.mjs';
const e = (id, historicalTimeMs) => ({ id, historicalTimeMs });
const pos = (x,y=0,surfaceId='ground') => ({ x,y,surfaceId });
const options = { endHistoricalMs: 1000, cameraStart: pos(0), scenes: { a: { location:pos(0) }, b: { location:pos(40), presentationWorkMs:2000 } } };

test('same-time events are available together while camera observes them sequentially', () => {
  const plan = createObservationPlan([e('b',1000), e('a',1000)], options);
  const first = sampleObservationPlan(plan, 0);
  assert.deepEqual(first.availableEventIds, ['a','b']); assert.deepEqual(first.completedVisits, []);
  const b = plan.phases.find(p=>p.eventId==='b'&&p.kind==='dwell');
  assert.equal(sampleObservationPlan(plan,b.startMs).clock.historicalTimeMs, 1000);
  assert.deepEqual(sampleObservationPlan(plan,b.startMs).completedVisits, ['a']);
});
test('camera travel is continuous and never changes historical time during observation', () => {
  const plan = createObservationPlan([e('a',1000),e('b',1000)],options);
  const travel = plan.phases.find(p=>p.kind==='camera-travel');
  const mid = sampleObservationPlan(plan,(travel.startMs+travel.endMs)/2);
  assert.equal(mid.camera.x,20); assert.equal(mid.clock.historicalTimeMs,1000);
  assert.ok(sampleObservationPlan(plan,travel.startMs+.01).camera.x < .001);
});
test('pace changes observation dwell but never the declared movement work budget', () => {
  const get = paceLevel => createObservationPlan([e('a',1000), e('b',1000)],{...options,paceLevel});
  const a=get(1),b=get(4);
  const duration=(p,k)=>p.phases.filter(v=>v.kind===k).map(v=>v.endMs-v.startMs);
  assert.deepEqual(duration(a,'presentation-work'),duration(b,'presentation-work'));
  assert.deepEqual(duration(a,'camera-travel'),duration(b,'camera-travel'));
  assert.ok(duration(a,'dwell')[0] > duration(b,'dwell')[0]);
});
test('large wall-clock ticks cannot skip a camera/dwell boundary', () => {
  const plan = createObservationPlan([e('a',1000),e('b',1000)],options);
  let state={},last=0;
  const observed = new Set();
  for(let i=0;i<500;i++) {
    state=advanceObservationState(plan,state,50_000);
    assert.ok(state.presentationTimeMs-last<=100.00001);last=state.presentationTimeMs;
    if(state.sample.phase) observed.add(state.sample.phase.id);
    if(state.sample.completedVisits.length===2) break;
  }
  assert.equal(observed.size,plan.phases.length);
  assert.deepEqual(state.sample.completedVisits,['a','b']);
});
test('pause freezes camera, observation and history; explicit sample remains usable for seek', () => {
  const plan = createObservationPlan([e('a',1000),e('b',1000)],options);
  const state=advanceObservationState(plan,{paused:true,presentationTimeMs:300},5000);
  assert.equal(state.presentationTimeMs,300);assert.deepEqual(state.sample,sampleObservationPlan(plan,300));
});
test('cross-floor camera transition is explicit, not a diagonal through unrelated planes', () => {
  const plan=createObservationPlan([e('a',1000)],{endHistoricalMs:1000,cameraStart:pos(0),scenes:{a:{location:pos(3,2,'upper')}}});
  const phase=plan.phases[0];assert.equal(phase.kind,'surface-transition');
  const mid=sampleObservationPlan(plan,(phase.startMs+phase.endMs)/2);
  assert.equal(mid.camera,null);assert.equal(mid.phase.to.surfaceId,'upper');
});
test('unlocated events still receive a dwell without fabricated world coordinates', () => {
  const plan=createObservationPlan([e('a',1000)],{endHistoricalMs:1000});
  assert.equal(plan.phases.length,1);assert.equal(plan.phases[0].kind,'dwell');
  assert.equal(sampleObservationPlan(plan,100).camera,null);
});
test('prepared path budgets extend the hold and do not expose future event results', () => {
  const plan=createObservationPlan([e('a',1000)],{startHistoricalMs:0,endHistoricalMs:1000,scenes:{a:{presentationWorkMs:10_000}}});
  const first=plan.phases[0];
  assert.deepEqual(sampleObservationPlan(plan,first.startMs-.01).availableEventIds,[]);
  assert.deepEqual(sampleObservationPlan(plan,first.startMs).availableEventIds,['a']);
  assert.ok(first.endMs-first.startMs>=10_000);
});
test('reordered event input gives identical observation schedule', () => {
  assert.deepEqual(createObservationPlan([e('a',1000),e('b',1000)],options),createObservationPlan([e('b',1000),e('a',1000)],options));
});
