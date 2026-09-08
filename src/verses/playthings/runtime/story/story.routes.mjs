import { freeze, requireFinite } from '../shared/values.mjs';
import { findPath, samplePath } from '../world/navigation.mjs';

/**
 * Bridges story waypoints to a supplied navigation graph. Parent links do not
 * become roads: each leg uses real walkability. Missing routes never teleport.
 * Multiple actors are sampled independently; collision avoidance is not yet owned here.
 */
export function planFrontierRoutes(event, locations, world, options = {}) {
  const unitsPerSecond = requireFinite(options.unitsPerSecond ?? 2, 'unitsPerSecond', Number.EPSILON);
  const forkDwellMs = requireFinite(options.forkDwellMs ?? 350, 'forkDwellMs', 0);
  const get = id => locations instanceof Map ? locations.get(id) : Object.hasOwn(locations, id) ? locations[id] : undefined;
  const tracks = event.effects.map(effect => {
    if (effect.kind === 'deferred-origin') return { actorId: effect.actorId, status: 'unresolved-origin', durationMs: 0, legs: [] };
    let waypoints;
    if (effect.kind === 'backtrack-fork') waypoints = [...effect.backtrack, ...effect.forward.slice(1)];
    else waypoints = effect.from == null ? [effect.to] : [effect.from, effect.to];
    const coordinates = waypoints.map(get);
    if (effect.kind === 'root-entry' && options.rootSpawn) { waypoints.unshift(null); coordinates.unshift(options.rootSpawn); }
    if (coordinates.some(c => !c)) return { actorId: effect.actorId, status: 'missing-location', durationMs: 0, legs: [] };
    const legs = []; let cursor = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const route = findPath(world, coordinates[i - 1], coordinates[i], options);
      if (route.status !== 'found') return { actorId: effect.actorId, status: route.status, durationMs: 0, legs: [], blockedAt: waypoints[i] };
      const durationMs = route.totalCost / unitsPerSecond * 1000;
      legs.push({ kind: 'travel', startMs: cursor, endMs: cursor + durationMs, route }); cursor += durationMs;
      if (effect.kind === 'backtrack-fork' && waypoints[i] === effect.commonAncestorId) {
        legs.push({ kind: 'fork', startMs: cursor, endMs: cursor + forkDwellMs, position: coordinates[i] }); cursor += forkDwellMs;
      }
    }
    return { actorId: effect.actorId, status: 'ready', kind: effect.kind, leaveGhostAt: effect.leaveGhostAt ?? null,
      ghostPosition: effect.leaveGhostAt ? get(effect.leaveGhostAt) : null,
      durationMs: cursor, unitsPerSecond, legs, endPosition: coordinates.at(-1) };
  });
  return freeze({ eventId: event.id, tracks, durationMs: Math.max(0, ...tracks.map(t => t.durationMs)),
    ready: tracks.every(t => t.status === 'ready') });
}

export function sampleFrontierRoutes(plan, elapsedMs) {
  requireFinite(elapsedMs, 'elapsedMs', 0);
  return freeze(plan.tracks.map(track => {
    if (track.status !== 'ready') return { actorId: track.actorId, phase: 'blocked', reason: track.status, position: null };
    const leg = track.legs.find(l => l.endMs > elapsedMs);
    const sample = !leg ? { phase: 'arrived', position: track.endPosition } : leg.kind === 'fork'
      ? { phase: 'fork', position: leg.position, progress: (elapsedMs - leg.startMs) / (leg.endMs - leg.startMs) }
      : samplePath(leg.route, Math.max(0, elapsedMs - leg.startMs), { unitsPerSecond: track.unitsPerSecond });
    return { actorId: track.actorId, ghostPosition: track.ghostPosition, ...sample };
  }));
}
