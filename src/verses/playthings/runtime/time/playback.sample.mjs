function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Integral of 3x² - 2x³; the derivative is continuous at ramp boundaries.
function integratedSmoothstep(t) { return t * t * t - 0.5 * t * t * t * t; }

export function fastForwardProgress(value, segment) {
  const t = clamp(value, 0, 1);
  const a = segment.accelerationFraction;
  const b = segment.brakingFraction;
  const base = segment.baseHistoricalMsPerPresentationMs;
  const peak = segment.maxHistoricalMsPerPresentationMs;
  let area;
  if (t <= a) area = a * integratedSmoothstep(t / a);
  else if (t <= 1 - b) area = a / 2 + t - a;
  else {
    const u = (t - (1 - b)) / b;
    area = a / 2 + (1 - b - a) + b * (u - integratedSmoothstep(u));
  }
  return (base * t + (peak - base) * area) / (base + (peak - base) * (1 - (a + b) / 2));
}

function historicalProgress(segment, presentationTimeMs) {
  if (segment.durationMs <= 0 || segment.historicalStartMs === segment.historicalEndMs) return 0;
  const linear = clamp((presentationTimeMs - segment.presentationStartMs) / segment.durationMs, 0, 1);
  return segment.kind === 'fast-forward' ? fastForwardProgress(linear, segment) : linear;
}

export function samplePlaybackPlan(plan, presentationTimeMs) {
  if (!plan || typeof plan !== 'object') throw new TypeError('Playback plan is required');
  const presentation = Number(presentationTimeMs);
  if (!Number.isFinite(presentation)) throw new TypeError('presentationTimeMs must be finite');

  if (plan.kind === 'live-empty') {
    const elapsed = Math.max(0, presentation);
    return Object.freeze({
      phase: 'live',
      segmentIndex: -1,
      presentationTimeMs: elapsed,
      historicalTimeMs: plan.startHistoricalMs + elapsed,
      observationGroupId: null,
      eventIds: Object.freeze([]),
      progress: 1,
      atPresentFrontier: true,
    });
  }

  const localTime = Math.max(0, presentation);
  const finiteEnd = plan.finitePresentationDurationMs;

  if (localTime >= finiteEnd) {
    const liveElapsed = plan.followsLiveTime ? localTime - finiteEnd : 0;
    return Object.freeze({
      phase: plan.followsLiveTime ? 'live' : 'complete',
      segmentIndex: plan.segments.length,
      presentationTimeMs: localTime,
      historicalTimeMs: plan.endHistoricalMs + liveElapsed,
      observationGroupId: null,
      eventIds: Object.freeze([]),
      progress: 1,
      atPresentFrontier: true,
    });
  }

  // Binary search also makes random-access scrubbing independent of replay duration.
  let lo = 0, hi = plan.segments.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (plan.segments[mid].presentationEndMs <= localTime) lo = mid + 1; else hi = mid;
  }
  const segment = plan.segments[lo];
  if (!segment) throw new RangeError('No segment for presentation time');

  const progress = historicalProgress(segment, localTime);
  const historicalTimeMs = segment.historicalStartMs +
    (segment.historicalEndMs - segment.historicalStartMs) * progress;

  return Object.freeze({
    phase: segment.kind,
    segmentIndex: segment.index,
    presentationTimeMs: localTime,
    historicalTimeMs,
    observationGroupId: segment.observationGroupId ?? null,
    eventIds: segment.eventIds ?? Object.freeze([]),
    progress: clamp((localTime - segment.presentationStartMs) / segment.durationMs, 0, 1),
    historicalProgress: progress,
    atPresentFrontier: false,
    target: segment.target ?? null,
  });
}

export function advancePlaybackState(state, presentationDeltaMs, plan) {
  const current = state && typeof state === 'object' ? state : {};
  const paused = Boolean(current.paused);
  const delta = Number(presentationDeltaMs);
  if (!Number.isFinite(delta) || delta < 0) throw new TypeError('presentationDeltaMs must be a non-negative finite number');

  const previous = Number(current.presentationTimeMs ?? 0);
  if (!Number.isFinite(previous) || previous < 0) throw new TypeError('state presentationTimeMs must be non-negative and finite');
  const presentationTimeMs = previous + (paused ? 0 : delta);
  return Object.freeze({
    paused,
    presentationTimeMs,
    sample: samplePlaybackPlan(plan, presentationTimeMs),
  });
}
