export const DEFAULT_PACE_LEVELS = Object.freeze({
  1: Object.freeze({
    historicalMsPerPresentationMs: 60,
    idleDwellMs: 1500,
    minApproachMs: 1200,
    observationBaseMs: 1600,
    observationExtraMs: 500,
    fastForwardMultiplier: 64,
  }),
  2: Object.freeze({
    historicalMsPerPresentationMs: 600,
    idleDwellMs: 2500,
    minApproachMs: 900,
    observationBaseMs: 1200,
    observationExtraMs: 400,
    fastForwardMultiplier: 64,
  }),
  3: Object.freeze({
    historicalMsPerPresentationMs: 3600,
    idleDwellMs: 3500,
    minApproachMs: 700,
    observationBaseMs: 900,
    observationExtraMs: 300,
    fastForwardMultiplier: 64,
  }),
  4: Object.freeze({
    historicalMsPerPresentationMs: 21600,
    idleDwellMs: 5000,
    minApproachMs: 500,
    observationBaseMs: 650,
    observationExtraMs: 225,
    fastForwardMultiplier: 64,
  }),
});

export function resolvePlaybackPolicy(options = {}) {
  const level = Number(options.paceLevel ?? 2);
  const base = DEFAULT_PACE_LEVELS[level];
  if (!base) throw new RangeError(`Unsupported Playthings pace level: ${level}`);

  const policy = {
    ...base,
    ...options,
    paceLevel: level,
  };

  for (const key of [
    'historicalMsPerPresentationMs',
    'idleDwellMs',
    'minApproachMs',
    'observationBaseMs',
    'observationExtraMs',
    'fastForwardMultiplier',
  ]) {
    const value = Number(policy[key]);
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`Invalid Playthings playback policy ${key}: ${policy[key]}`);
    }
    policy[key] = value;
  }

  if (policy.historicalMsPerPresentationMs === 0) {
    throw new RangeError('historicalMsPerPresentationMs must be greater than zero');
  }
  if (policy.fastForwardMultiplier < 1) {
    throw new RangeError('fastForwardMultiplier must be at least one');
  }

  for (const key of ['preparationMsByGroup', 'observationMsByGroup']) {
    const values = options[key] ?? {};
    if (!values || Array.isArray(values) || typeof values !== 'object') throw new TypeError(`${key} must be a record`);
    policy[key] = Object.freeze(Object.fromEntries(Object.entries(values).map(([id, value]) => {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new TypeError(`Invalid ${key}.${id}`);
      return [id, value];
    })));
  }
  return Object.freeze(policy);
}
