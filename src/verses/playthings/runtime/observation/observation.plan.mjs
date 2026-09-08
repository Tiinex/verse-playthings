import { freeze, requireFinite, requireId } from '../shared/values.mjs';
import { createPlaybackPlan, groupHistoricalEvents, resolvePlaybackPolicy, samplePlaybackPlan } from '../time/index.mjs';

function position(value) {
  if (value == null) return null;
  return { surfaceId: requireId(value.surfaceId, 'camera surface'), x: requireFinite(value.x, 'camera x'), y: requireFinite(value.y, 'camera y') };
}
const smoothstep = t => t * t * (3 - 2 * t);

/**
 * Camera and observation budgets around existing historical anchors.
 * A camera visit is NOT an artifact occurrence and cannot grant story knowledge.
 * presentationWorkMs can reserve an externally planned path/fork/action sequence.
 * No React, clocks, fullscreen calls, asset lookups or Core schema parsing.
 */
export function createObservationPlan(events, options = {}) {
  const policy = resolvePlaybackPolicy(options);
  const cameraUnitsPerSecond = requireFinite(options.cameraUnitsPerSecond ?? 8, 'cameraUnitsPerSecond', Number.EPSILON);
  const surfaceTransitionMs = requireFinite(options.surfaceTransitionMs ?? 650, 'surfaceTransitionMs', 0);
  const minDwell = requireFinite(options.minDwellMs ?? policy.observationBaseMs, 'minDwellMs', Number.EPSILON);
  const scenes = options.scenes ?? {};
  const getScene = id => scenes instanceof Map ? scenes.get(id) : Object.hasOwn(scenes, id) ? scenes[id] : undefined;
  const groups = groupHistoricalEvents(events), visits = [];
  const observationMsByGroup = {};
  let camera = position(options.cameraStart);
  for (const group of groups) {
    let cursor = 0;
    for (const event of group.events) {
      const scene = getScene(event.id) ?? {};
      const target = position(scene.location);
      const presentationWorkMs = requireFinite(scene.presentationWorkMs ?? 0, 'presentationWorkMs', 0);
      const surfaceChange = camera && target && camera.surfaceId !== target.surfaceId;
      const travelMs = camera && target ? surfaceChange ? surfaceTransitionMs
        : Math.hypot(target.x - camera.x, target.y - camera.y) / cameraUnitsPerSecond * 1000 : 0;
      if (travelMs > 0) {
        visits.push({ groupId: group.id, eventId: event.id, kind: surfaceChange ? 'surface-transition' : 'camera-travel',
          localStartMs: cursor, localEndMs: cursor + travelMs, from: camera, to: target }); cursor += travelMs;
      }
      if (presentationWorkMs > 0) {
        visits.push({ groupId: group.id, eventId: event.id, kind: 'presentation-work',
          localStartMs: cursor, localEndMs: cursor + presentationWorkMs, from: target ?? camera, to: target ?? camera }); cursor += presentationWorkMs;
      }
      visits.push({ groupId: group.id, eventId: event.id, kind: 'dwell', localStartMs: cursor, localEndMs: cursor + minDwell,
        from: target ?? camera, to: target ?? camera }); cursor += minDwell;
      camera = target ?? camera;
    }
    observationMsByGroup[group.id] = cursor;
  }
  const playback = createPlaybackPlan(events, { ...options, observationMsByGroup });
  const segments = new Map(playback.segments.filter(s => s.kind === 'observe').map(s => [s.observationGroupId, s]));
  const phases = visits.filter(v => segments.has(v.groupId)).map((v, i) => {
    const offset = segments.get(v.groupId).presentationStartMs;
    return { ...v, id: `visit:${i}:${v.eventId}:${v.kind}`, startMs: offset + v.localStartMs, endMs: offset + v.localEndMs };
  });
  return freeze({ kind: 'playthings-observation-plan', playback, phases, initialCamera: position(options.cameraStart),
    // Available-at-anchor and finished-observing are separate queries.
    semanticOrderingFromCamera: false });
}

export function sampleObservationPlan(plan, presentationTimeMs) {
  const clock = samplePlaybackPlan(plan.playback, presentationTimeMs);
  const time = clock.presentationTimeMs;
  const phase = plan.phases.find(p => p.startMs <= time && time < p.endMs);
  const completedVisits = plan.phases.filter(p => p.kind === 'dwell' && p.endMs <= time).map(p => p.eventId);
  let camera = plan.initialCamera;
  if (phase) {
    const t = (time - phase.startMs) / (phase.endMs - phase.startMs), eased = smoothstep(t);
    if (phase.from && phase.to && phase.from.surfaceId === phase.to.surfaceId) {
      camera = { surfaceId: phase.from.surfaceId, x: phase.from.x + (phase.to.x - phase.from.x) * eased,
        y: phase.from.y + (phase.to.y - phase.from.y) * eased };
    } else camera = phase.kind === 'surface-transition' ? null : phase.to;
  } else {
    for (const p of plan.phases) if (p.endMs <= time) camera = p.to;
  }
  return freeze({ clock, phase: phase ?? null, camera, completedVisits,
    availableEventIds: plan.playback.groups.filter(g => g.historicalTimeMs <= clock.historicalTimeMs).flatMap(g => g.events.map(e => e.id)) });
}

/**
 * Normal play has a bounded per-render delta and cannot cross an unseen visit
 * boundary in one tick. Excess wall time is deliberately discarded, not replayed
 * as a backlog after a suspended tab. Explicit seek is a different operation.
 */
export function advanceObservationState(plan, state = {}, elapsedMs) {
  requireFinite(elapsedMs, 'elapsedMs', 0);
  const old = requireFinite(state.presentationTimeMs ?? 0, 'presentationTimeMs', 0);
  const maxFrameDeltaMs = requireFinite(state.maxFrameDeltaMs ?? 100, 'maxFrameDeltaMs', Number.EPSILON);
  const delta = state.paused ? 0 : Math.min(elapsedMs, maxFrameDeltaMs);
  const barriers = plan.phases.flatMap(p => [p.startMs, p.endMs]).filter(t => t > old).sort((a, b) => a - b);
  const next = Math.min(old + delta, barriers[0] ?? Infinity);
  return freeze({ paused: Boolean(state.paused), maxFrameDeltaMs, presentationTimeMs: next,
    discardedWallTimeMs: elapsedMs - (next - old), sample: sampleObservationPlan(plan, next) });
}
