function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep01(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

// Long idle gaps should feel like acceleration through time with a visibly late brake.
// The curve is presentation-only and is not semantic ordering authority.
function fastForwardProgress(value) {
  const t = clamp(value, 0, 1);
  if (t <= 0.22) {
    return 0.16 * smoothstep01(t / 0.22);
  }
  if (t <= 0.82) {
    return 0.16 + ((t - 0.22) / 0.60) * 0.72;
  }
  return 0.88 + 0.12 * smoothstep01((t - 0.82) / 0.18);
}

function historicalProgress(segment, presentationTimeMs) {
  if (segment.durationMs <= 0 || segment.historicalStartMs === segment.historicalEndMs) return 0;
  const linear = clamp((presentationTimeMs - segment.presentationStartMs) / segment.durationMs, 0, 1);
  return segment.kind === 'fast-forward' ? fastForwardProgress(linear) : linear;
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

  const segment = plan.segments.find((entry) =>
    localTime >= entry.presentationStartMs && localTime < entry.presentationEndMs
  ) ?? plan.segments[0];

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
    progress,
    atPresentFrontier: false,
    target: segment.target ?? null,
  });
}

export function advancePlaybackState(state, presentationDeltaMs, plan) {
  const current = state && typeof state === 'object' ? state : {};
  const paused = Boolean(current.paused);
  const delta = Number(presentationDeltaMs);
  if (!Number.isFinite(delta) || delta < 0) throw new TypeError('presentationDeltaMs must be a non-negative finite number');

  const presentationTimeMs = Math.max(0, Number(current.presentationTimeMs ?? 0)) + (paused ? 0 : delta);
  return Object.freeze({
    paused,
    presentationTimeMs,
    sample: samplePlaybackPlan(plan, presentationTimeMs),
  });
}
