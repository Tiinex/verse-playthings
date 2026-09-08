import { resolvePlaybackPolicy } from './playback.policy.mjs';

function finiteTime(value, label) {
  const time = Number(value);
  if (!Number.isFinite(time)) throw new TypeError(`${label} must be a finite millisecond timestamp`);
  return time;
}

export function groupHistoricalEvents(events = []) {
  const normalized = [...events].map((event, inputIndex) => {
    if (!event || typeof event !== 'object') throw new TypeError('Playback event must be an object');
    const id = String(event.id ?? '').trim();
    if (!id) throw new TypeError(`Playback event at input index ${inputIndex} is missing id`);
    return Object.freeze({
      ...event,
      id,
      historicalTimeMs: finiteTime(event.historicalTimeMs, `event ${id} historicalTimeMs`),
      inputIndex,
    });
  });

  normalized.sort((a, b) =>
    a.historicalTimeMs - b.historicalTimeMs ||
    a.id.localeCompare(b.id) ||
    a.inputIndex - b.inputIndex
  );

  const groups = [];
  for (const event of normalized) {
    const previous = groups.at(-1);
    if (previous && previous.historicalTimeMs === event.historicalTimeMs) {
      previous.events.push(event);
    } else {
      groups.push({ historicalTimeMs: event.historicalTimeMs, events: [event] });
    }
  }

  return Object.freeze(groups.map((group, groupIndex) => Object.freeze({
    id: `historical-group:${group.historicalTimeMs}:${groupIndex}`,
    historicalTimeMs: group.historicalTimeMs,
    events: Object.freeze(group.events),
  })));
}

function segment(kind, presentationStartMs, durationMs, historicalStartMs, historicalEndMs, extras = {}) {
  return Object.freeze({
    index: -1,
    kind,
    presentationStartMs,
    presentationEndMs: presentationStartMs + durationMs,
    durationMs,
    historicalStartMs,
    historicalEndMs,
    ...extras,
  });
}

function appendGapSegments(segments, cursor, historicalStartMs, historicalEndMs, policy, target = null) {
  const gap = historicalEndMs - historicalStartMs;
  if (gap <= 0) return { cursor, historicalTimeMs: historicalStartMs };

  const rate = policy.historicalMsPerPresentationMs;
  const desiredDuration = gap / rate;
  const minApproach = policy.minApproachMs;

  // Dense history: slow the historical clock rather than speeding up actors/camera.
  if (desiredDuration <= minApproach) {
    segments.push(segment(
      'slow-approach',
      cursor,
      minApproach,
      historicalStartMs,
      historicalEndMs,
      { target, effectiveHistoricalMsPerPresentationMs: gap / minApproach }
    ));
    return { cursor: cursor + minApproach, historicalTimeMs: historicalEndMs };
  }

  const desiredCruiseHistory = rate * policy.idleDwellMs;
  const desiredApproachHistory = rate * minApproach;
  const canFastForward = gap > desiredCruiseHistory + desiredApproachHistory * 2;

  if (!canFastForward) {
    segments.push(segment(
      'cruise',
      cursor,
      desiredDuration,
      historicalStartMs,
      historicalEndMs,
      { target, effectiveHistoricalMsPerPresentationMs: rate }
    ));
    return { cursor: cursor + desiredDuration, historicalTimeMs: historicalEndMs };
  }

  const cruiseEndHistory = historicalStartMs + desiredCruiseHistory;
  if (policy.idleDwellMs > 0) {
    segments.push(segment(
      'cruise',
      cursor,
      policy.idleDwellMs,
      historicalStartMs,
      cruiseEndHistory,
      { target, effectiveHistoricalMsPerPresentationMs: rate }
    ));
    cursor += policy.idleDwellMs;
  }

  const approachHistory = Math.max(desiredApproachHistory, 1);
  const fastEndHistory = Math.max(cruiseEndHistory, historicalEndMs - approachHistory);
  const fastGap = fastEndHistory - cruiseEndHistory;

  if (fastGap > 0) {
    const fastRate = rate * policy.fastForwardMultiplier;
    const fastDuration = Math.max(1, fastGap / fastRate);
    segments.push(segment(
      'fast-forward',
      cursor,
      fastDuration,
      cruiseEndHistory,
      fastEndHistory,
      {
        target,
        baseHistoricalMsPerPresentationMs: rate,
        maxHistoricalMsPerPresentationMs: fastRate,
        curve: 'accelerate-then-late-brake-v1',
      }
    ));
    cursor += fastDuration;
  }

  const remaining = historicalEndMs - fastEndHistory;
  if (remaining > 0) {
    const approachDuration = Math.max(minApproach, remaining / rate);
    segments.push(segment(
      'brake-approach',
      cursor,
      approachDuration,
      fastEndHistory,
      historicalEndMs,
      { target, effectiveHistoricalMsPerPresentationMs: remaining / approachDuration }
    ));
    cursor += approachDuration;
  }

  return { cursor, historicalTimeMs: historicalEndMs };
}

function observationDuration(group, policy) {
  return policy.observationBaseMs + Math.max(0, group.events.length - 1) * policy.observationExtraMs;
}

export function createPlaybackPlan(events = [], options = {}) {
  const policy = resolvePlaybackPolicy(options);
  const groups = groupHistoricalEvents(events);
  const nowHistoricalMs = finiteTime(options.nowHistoricalMs ?? Date.now(), 'nowHistoricalMs');

  if (groups.length === 0) {
    return Object.freeze({
      kind: 'live-empty',
      policy,
      groups,
      segments: Object.freeze([]),
      startHistoricalMs: nowHistoricalMs,
      endHistoricalMs: nowHistoricalMs,
      finitePresentationDurationMs: 0,
      followsLiveTime: true,
    });
  }

  const startHistoricalMs = finiteTime(options.startHistoricalMs ?? groups[0].historicalTimeMs, 'startHistoricalMs');
  const latestEventMs = groups.at(-1).historicalTimeMs;
  const endHistoricalMs = Math.max(latestEventMs, finiteTime(options.endHistoricalMs ?? nowHistoricalMs, 'endHistoricalMs'));
  const segments = [];
  let cursor = 0;
  let historical = startHistoricalMs;

  for (const group of groups) {
    if (group.historicalTimeMs < startHistoricalMs) continue;

    const gapResult = appendGapSegments(
      segments,
      cursor,
      historical,
      group.historicalTimeMs,
      policy,
      Object.freeze({ type: 'event-group', id: group.id })
    );
    cursor = gapResult.cursor;
    historical = group.historicalTimeMs;

    const holdMs = observationDuration(group, policy);
    if (holdMs > 0) {
      segments.push(segment(
        'observe',
        cursor,
        holdMs,
        historical,
        historical,
        {
          observationGroupId: group.id,
          eventIds: Object.freeze(group.events.map((event) => event.id)),
          presentationOrderIsHistoricalOrder: false,
        }
      ));
      cursor += holdMs;
    }
  }

  if (historical < endHistoricalMs) {
    const tail = appendGapSegments(
      segments,
      cursor,
      historical,
      endHistoricalMs,
      policy,
      Object.freeze({ type: 'present' })
    );
    cursor = tail.cursor;
    historical = endHistoricalMs;
  }

  const indexed = Object.freeze(segments.map((entry, index) => Object.freeze({ ...entry, index })));

  return Object.freeze({
    kind: 'historical-playback',
    policy,
    groups,
    segments: indexed,
    startHistoricalMs,
    endHistoricalMs,
    finitePresentationDurationMs: cursor,
    followsLiveTime: options.followsLiveTime !== false,
  });
}
