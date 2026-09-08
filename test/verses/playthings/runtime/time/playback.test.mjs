import test from 'node:test';
import assert from 'node:assert/strict';

import {
  advancePlaybackState,
  createPlaybackPlan,
  groupHistoricalEvents,
  samplePlaybackPlan,
} from '../../../../../src/verses/playthings/runtime/time/index.mjs';

const SECOND = 1000;
const DAY = 24 * 60 * 60 * SECOND;

function event(id, historicalTimeMs) {
  return { id, historicalTimeMs };
}

test('no artifacts follows present time instead of inventing a historical start', () => {
  const plan = createPlaybackPlan([], { nowHistoricalMs: 1_000_000 });
  assert.equal(plan.kind, 'live-empty');
  assert.equal(samplePlaybackPlan(plan, 5000).historicalTimeMs, 1_005_000);
});

test('equal timestamps form one observation set with deterministic presentation order only', () => {
  const groups = groupHistoricalEvents([
    event('z-second-input', 5000),
    event('a-first-presentation', 5000),
  ]);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].events.map((item) => item.id), ['a-first-presentation', 'z-second-input']);

  const plan = createPlaybackPlan(groups[0].events, {
    nowHistoricalMs: 5000,
    paceLevel: 4,
  });
  const observe = plan.segments.find((segment) => segment.kind === 'observe');
  assert.deepEqual(observe.eventIds, ['a-first-presentation', 'z-second-input']);
  assert.equal(observe.presentationOrderIsHistoricalOrder, false);
  assert.equal(observe.historicalStartMs, observe.historicalEndMs);
});

test('dense history slows the historical clock instead of skipping the next event', () => {
  const plan = createPlaybackPlan([
    event('first', 0),
    event('second', 2 * SECOND),
  ], {
    startHistoricalMs: 0,
    endHistoricalMs: 2 * SECOND,
    paceLevel: 4,
    observationBaseMs: 0,
    observationExtraMs: 0,
    minApproachMs: 1000,
  });

  const segment = plan.segments.find((entry) => entry.kind === 'slow-approach');
  assert.ok(segment, 'expected bullet-time slow approach');
  assert.equal(segment.durationMs, 1000);

  const halfway = samplePlaybackPlan(plan, segment.presentationStartMs + 500);
  assert.equal(Math.round(halfway.historicalTimeMs), 1000);
  assert.equal(halfway.phase, 'slow-approach');
});

test('observation freezes historical time while presentation continues', () => {
  const anchor = 123456;
  const plan = createPlaybackPlan([event('artifact', anchor)], {
    nowHistoricalMs: anchor,
    paceLevel: 1,
    observationBaseMs: 1200,
    observationExtraMs: 0,
  });
  const observe = plan.segments.find((entry) => entry.kind === 'observe');
  assert.ok(observe);

  const early = samplePlaybackPlan(plan, observe.presentationStartMs + 100);
  const late = samplePlaybackPlan(plan, observe.presentationEndMs - 100);
  assert.equal(early.historicalTimeMs, anchor);
  assert.equal(late.historicalTimeMs, anchor);
  assert.ok(late.presentationTimeMs > early.presentationTimeMs);
});

test('long idle history enters explicit fast-forward and brakes before the next anchor', () => {
  const plan = createPlaybackPlan([
    event('first', 0),
    event('month-later', 30 * DAY),
  ], {
    startHistoricalMs: 0,
    endHistoricalMs: 30 * DAY,
    paceLevel: 1,
    observationBaseMs: 0,
    observationExtraMs: 0,
  });

  const kinds = plan.segments.map((entry) => entry.kind);
  assert.ok(kinds.includes('fast-forward'));
  assert.ok(kinds.includes('brake-approach'));
  assert.ok(kinds.indexOf('fast-forward') < kinds.indexOf('brake-approach'));

  const brake = plan.segments.find((entry) => entry.kind === 'brake-approach');
  const beforeAnchor = samplePlaybackPlan(plan, brake.presentationEndMs - 1);
  assert.ok(beforeAnchor.historicalTimeMs < 30 * DAY);
});

test('events are never completed before their historical anchor', () => {
  const anchor = 10_000;
  const plan = createPlaybackPlan([event('future', anchor)], {
    startHistoricalMs: 0,
    endHistoricalMs: anchor,
    paceLevel: 4,
    minApproachMs: 1000,
  });
  const observe = plan.segments.find((entry) => entry.kind === 'observe');
  assert.ok(observe);

  const justBefore = samplePlaybackPlan(plan, observe.presentationStartMs - 0.001);
  assert.ok(justBefore.historicalTimeMs < anchor);
  assert.notEqual(justBefore.phase, 'observe');

  const atAnchor = samplePlaybackPlan(plan, observe.presentationStartMs);
  assert.equal(atAnchor.historicalTimeMs, anchor);
  assert.equal(atAnchor.phase, 'observe');
});

test('pause stops presentation and therefore historical progression', () => {
  const plan = createPlaybackPlan([event('later', 10_000)], {
    startHistoricalMs: 0,
    endHistoricalMs: 10_000,
    observationBaseMs: 0,
    paceLevel: 1,
  });
  const state = advancePlaybackState({ paused: true, presentationTimeMs: 200 }, 500, plan);
  assert.equal(state.presentationTimeMs, 200);
  assert.equal(state.sample.presentationTimeMs, 200);
});

test('sampling the same plan at the same presentation phase is deterministic', () => {
  const plan = createPlaybackPlan([
    event('a', 0),
    event('b', 10 * DAY),
    event('c', 10 * DAY),
  ], {
    startHistoricalMs: 0,
    endHistoricalMs: 10 * DAY,
    paceLevel: 2,
  });

  const t = plan.finitePresentationDurationMs / 2;
  assert.deepEqual(samplePlaybackPlan(plan, t), samplePlaybackPlan(plan, t));
});
