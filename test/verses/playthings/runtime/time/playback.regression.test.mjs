import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlaybackPlan, groupHistoricalEvents, samplePlaybackPlan, advancePlaybackState } from '../../../../../src/verses/playthings/runtime/time/index.mjs';
const e = (id, historicalTimeMs) => ({ id, historicalTimeMs });
const DAY = 86_400_000;

test('shuffled input produces byte-equivalent groups and stable group IDs after earlier insertion', () => {
  const input = [e('b', 20), e('a', 20)];
  assert.deepEqual(groupHistoricalEvents(input), groupHistoricalEvents([...input].reverse()));
  assert.equal(groupHistoricalEvents([e('earlier', 0), ...input])[1].id, groupHistoricalEvents(input)[0].id);
});
test('duplicate IDs, coercible-null times and nonfinite state do not enter a playback plan', () => {
  assert.throws(() => createPlaybackPlan([e('a', 0), e('a', 1)]), /Duplicate/);
  assert.throws(() => createPlaybackPlan([e('a', null)]), /numeric/);
  assert.throws(() => advancePlaybackState({ presentationTimeMs: NaN }, 1, createPlaybackPlan([])));
});
test('history ending before its explicit start is rejected', () => {
  assert.throws(() => createPlaybackPlan([e('a', 0)], { startHistoricalMs: 100, endHistoricalMs: 50 }), /precedes/);
});
test('observation progress advances even though historicalProgress is zero', () => {
  const plan = createPlaybackPlan([e('a', 10)], { endHistoricalMs: 10, observationBaseMs: 1000 });
  const s = samplePlaybackPlan(plan, 500);
  assert.equal(s.progress, 0.5); assert.equal(s.historicalProgress, 0);
});
test('first event preparation is held at its timestamp without inventing an earlier history', () => {
  const plan = createPlaybackPlan([e('a', 10)], { endHistoricalMs: 10, preparationMsByGroup: { 'historical-group:10': 3000 } });
  assert.equal(plan.segments[0].kind, 'prepare-first');
  assert.equal(samplePlaybackPlan(plan, 1500).historicalTimeMs, 10);
});
test('long travel budget stretches an approach without changing actor speed or event anchor', () => {
  const plan = createPlaybackPlan([e('a', 10)], { startHistoricalMs: 0, endHistoricalMs: 10, paceLevel: 4,
    preparationMsByGroup: { 'historical-group:10': 15_000 } });
  assert.equal(plan.segments[0].durationMs, 15_000);
  assert.equal(plan.segments[0].historicalEndMs, 10);
});
test('invalid budgets fail at plan construction', () => {
  for (const v of [-1, Infinity, NaN, '300']) assert.throws(() => createPlaybackPlan([e('a', 0)], { preparationMsByGroup: { x: v } }));
});
for (const paceLevel of [1,2,3,4]) test(`pace ${paceLevel}: fast-forward rate is continuous, bounded and brakes late`, () => {
  const plan = createPlaybackPlan([e('a', 0), e('b', 30*DAY)], { endHistoricalMs: 30*DAY, paceLevel });
  const fast = plan.segments.find(s => s.kind === 'fast-forward');
  const sample = u => samplePlaybackPlan(plan, fast.presentationStartMs + u * fast.durationMs).historicalTimeMs;
  const rate = u => (sample(u+1e-6) - sample(u-1e-6)) / (2e-6*fast.durationMs);
  assert.ok(rate(.02) < rate(.20)); assert.ok(rate(.20) < rate(.60));
  assert.ok(rate(.95) < rate(.89));
  for (const u of [.01,.20,.649,.65,.651,.75,.899,.9,.901,.98]) {
    assert.ok(rate(u) > 0); assert.ok(rate(u) <= fast.maxHistoricalMsPerPresentationMs * 1.00001);
  }
  for (const boundary of [.65,.9]) assert.ok(Math.abs(rate(boundary-1e-5)-rate(boundary+1e-5)) < fast.maxHistoricalMsPerPresentationMs*.001);
  assert.ok(Math.abs(sample(1) - fast.historicalEndMs) < .01);
});
test('many sampled phases never rewind historical time or exceed the requested finite end', () => {
  const plan = createPlaybackPlan([e('a', -200*365*DAY), e('b', 0), e('c', 0), e('d', 5)], { endHistoricalMs: 5, followsLiveTime: false });
  let previous = -Infinity;
  for (let i = 0; i <= 10000; i++) {
    const s = samplePlaybackPlan(plan, plan.finitePresentationDurationMs*i/10000);
    assert.ok(s.historicalTimeMs >= previous); assert.ok(s.historicalTimeMs <= 5); previous = s.historicalTimeMs;
  }
});
test('caller mutation cannot change a prepared event payload', () => {
  const event={id:'a',historicalTimeMs:0,payload:{value:'original'}};
  const plan=createPlaybackPlan([event],{endHistoricalMs:0});
  event.payload.value='changed';
  assert.equal(plan.groups[0].events[0].payload.value,'original');
});
test('qualified event identities are not trimmed or coerced into aliases', () => {
  assert.throws(()=>groupHistoricalEvents([{id:42,historicalTimeMs:0}]), /missing id/);
  assert.equal(groupHistoricalEvents([e('a',0),e(' a',0)])[0].events.length,2);
});
