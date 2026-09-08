import { compareIds, freeze, requireFinite, requireId } from '../shared/values.mjs';
import { actorsFor, contributorDelta, normalizeStoryRecords } from './story.input.mjs';

function knownChain(id, records, time) {
  const path = [], seen = new Set();
  while (id !== null) {
    if (id === undefined) return { path, status: 'unknown-parent' };
    if (seen.has(id)) return { path, status: 'cycle' };
    seen.add(id);
    const record = records.get(id);
    if (!record) return { path, status: 'missing-parent' };
    if (record.historicalTimeMs > time) return { path, status: 'future-parent' };
    path.push(id); id = record.parentId;
  }
  return { path, status: 'rooted' };
}

function branchRoute(from, to, records, time) {
  const left = knownChain(from, records, time), right = knownChain(to, records, time);
  if (left.status !== 'rooted' || right.status !== 'rooted') return null;
  const targets = new Map(right.path.map((id, i) => [id, i]));
  const i = left.path.findIndex(id => targets.has(id));
  if (i === -1) return null;
  const commonAncestorId = left.path[i];
  return { commonAncestorId, backtrack: left.path.slice(0, i + 1),
    forward: right.path.slice(0, targets.get(commonAncestorId) + 1).reverse() };
}

function equalTimeOrder(group) {
  // Only explicit Parent edges impose dependency order. Independent siblings use
  // a code-point tie-break for presentation, NEVER as historical/causal evidence.
  const pending = new Map(group.map(e => [e.id, e]));
  const ordered = [];
  while (pending.size) {
    const ready = [...pending.values()].filter(e => !pending.has(e.parentId)).sort((a, b) => compareIds(a.id, b.id));
    if (!ready.length) { ordered.push(...[...pending.values()].sort((a, b) => compareIds(a.id, b.id))); break; }
    for (const e of ready) { ordered.push(e); pending.delete(e.id); }
  }
  return ordered;
}

/** Builds a presentation operation log. Does not parse artifacts or edit source. */
export function createStoryPlan(input, options = {}) {
  const records = normalizeStoryRecords(input);
  const byId = new Map(records.map(e => [e.id, e]));
  const identities = (options.identities ?? []).map(identity => ({
    id: requireId(identity.id, 'identity.id'), discoveredAtMs: requireFinite(identity.discoveredAtMs, 'identity.discoveredAtMs'),
  })).sort((a, b) => compareIds(a.id, b.id));
  if (new Set(identities.map(i => i.id)).size !== identities.length) throw new TypeError('Duplicate identity id');
  const groups = [], findings = [], log = [], frontiers = new Map();
  for (const e of records) {
    const last = groups.at(-1);
    if (last?.historicalTimeMs === e.historicalTimeMs) last.records.push(e);
    else groups.push({ historicalTimeMs: e.historicalTimeMs, records: [e] });
  }
  for (const group of groups) {
    for (const record of equalTimeOrder(group.records)) {
      const origin = knownChain(record.id, byId, group.historicalTimeMs);
      const actors = actorsFor(record);
      const parent = byId.get(record.parentId);
      const parentActors = parent && parent.historicalTimeMs <= record.historicalTimeMs ? actorsFor(parent).ids : [];
      const previous = frontiers.get(record.parentId);
      const effects = [];
      const entry = {
        id: record.id, historicalTimeMs: record.historicalTimeMs, parentId: record.parentId,
        originStatus: origin.status, actors, contribution: contributorDelta(parentActors, actors.ids),
        transition: record.handoff ? 'formal-handoff-declaration' : 'contribution-continuation',
        depiction: record.actionStatus === 'occurred' ? 'qualified-occurrence' : 'artifact-introduction',
        // A Handoff's existence never asserts acceptance or execution.
        impliesAcceptance: false, impliesRealWorldConcurrency: false,
        retireFrontierId: origin.status === 'rooted' && previous ? previous.artifactId : null,
        effects, ghostChanges: [],
      };
      if (origin.status !== 'rooted') {
        findings.push({ id: record.id, code: `origin.${origin.status}`, severity: 'warning' });
        entry.transition = 'unresolved-origin';
        for (const actorId of actors.ids) effects.push({ actorId, kind: 'deferred-origin' });
      } else {
        for (const actorId of actors.ids) {
          if (previous && Object.hasOwn(previous.actorModes, actorId)) {
            if (previous.actorModes[actorId] === 'ghost') {
              for (const other of frontiers.values()) {
                if (other.artifactId !== previous.artifactId && other.actorModes[actorId] === 'active' &&
                    other.historicalTimeMs < record.historicalTimeMs && branchRoute(other.artifactId, record.id, byId, record.historicalTimeMs)) {
                  other.actorModes[actorId] = 'ghost';
                  entry.ghostChanges.push({ artifactId: other.artifactId, actorId });
                }
              }
            }
            effects.push({ actorId, kind: previous.actorModes[actorId] === 'ghost' ? 'reactivate' : 'advance',
              from: previous.artifactId, to: record.id, forward: [previous.artifactId, record.id] });
            continue;
          }
          const candidates = [...frontiers.values()].filter(f => Object.hasOwn(f.actorModes, actorId) && f.artifactId !== record.parentId)
            .map(frontier => ({ frontier, route: branchRoute(frontier.artifactId, record.id, byId, record.historicalTimeMs) }))
            .filter(c => c.route)
            .sort((a, b) => Number(a.frontier.actorModes[actorId] === 'ghost') - Number(b.frontier.actorModes[actorId] === 'ghost') ||
              b.frontier.historicalTimeMs - a.frontier.historicalTimeMs || compareIds(a.frontier.artifactId, b.frontier.artifactId));
          if (candidates.length) {
            const { frontier, route } = candidates[0];
            if (candidates.length > 1) findings.push({ id: record.id, actorId,
              code: 'presentation.multiple-frontier-candidates', severity: 'info' });
            // Equal-time siblings remain jointly relevant. Do not turn the
            // presentation tie-break into a claim one actor stopped working.
            const keepSharp = frontier.historicalTimeMs === record.historicalTimeMs;
            if (!keepSharp) {
              frontier.actorModes[actorId] = 'ghost';
              entry.ghostChanges.push({ artifactId: frontier.artifactId, actorId });
            }
            effects.push({ actorId, kind: 'backtrack-fork', from: frontier.artifactId, to: record.id,
              leaveGhostAt: keepSharp ? null : frontier.artifactId, keepConcurrentFrontierSharp: keepSharp, ...route });
          } else {
            effects.push({ actorId, kind: record.parentId === null ? 'root-entry' : 'arrive-context',
              from: record.parentId, to: record.id });
          }
        }
      }
      if (entry.retireFrontierId) frontiers.delete(entry.retireFrontierId);
      const actorModes = Object.fromEntries(actors.ids.map(id => [id, origin.status === 'rooted' ? 'active' : 'unresolved']));
      frontiers.set(record.id, { artifactId: record.id, historicalTimeMs: record.historicalTimeMs, actorModes });
      log.push(entry);
    }
  }
  // Copy values: the mutable compiler frontiers never escape into the plan.
  return freeze({ kind: 'playthings-story-plan', records, identities, log, findings,
    groups: groups.map(g => ({ id: `historical-group:${g.historicalTimeMs}`, historicalTimeMs: g.historicalTimeMs,
      eventIds: g.records.map(e => e.id).sort(compareIds), presentationOrderIsHistoricalOrder: false })) });
}

/** Replays only the visible history; optional selection affects focus, not facts. */
export function sampleStoryPlan(plan, historicalTimeMs, options = {}) {
  requireFinite(historicalTimeMs, 'historicalTimeMs');
  const frontiers = new Map(), visibleEventIds = [];
  const discovery = new Map(plan.identities.map(i => [i.id, i.discoveredAtMs]));
  for (const event of plan.log) {
    if (event.historicalTimeMs > historicalTimeMs) continue;
    visibleEventIds.push(event.id);
    for (const change of event.ghostChanges) {
      const f = frontiers.get(change.artifactId);
      if (f) f.actorModes[change.actorId] = 'ghost';
    }
    if (event.retireFrontierId) frontiers.delete(event.retireFrontierId);
    frontiers.set(event.id, { artifactId: event.id, actorModes: Object.fromEntries(event.actors.ids.map(id =>
      [id, event.originStatus === 'rooted' ? 'active' : 'unresolved'])) });
  }
  return freeze({ historicalTimeMs, visibleEventIds: visibleEventIds.sort(compareIds),
    frontiers: [...frontiers.values()].sort((a, b) => compareIds(a.artifactId, b.artifactId)).map(f => ({
      artifactId: f.artifactId, selected: options.selectedFrontierId === f.artifactId,
      actors: Object.entries(f.actorModes).map(([identityId, mode]) => ({ identityId, mode,
        appearance: discovery.has(identityId) && discovery.get(identityId) <= historicalTimeMs ? 'identity' : 'default',
        emphasis: mode === 'ghost' && options.selectedFrontierId !== f.artifactId ? 'toned' : 'sharp',
      })),
    })) });
}

/** Called only when the host explicitly reports a newly received snapshot. */
export function describeNewHistory(previousIds, records, discoveredAtMs) {
  requireFinite(discoveredAtMs, 'discoveredAtMs');
  const before = new Set(previousIds);
  return freeze(normalizeStoryRecords(records).filter(r => !before.has(r.id)).map(r => ({
    id: r.id, historicalTimeMs: r.historicalTimeMs, discoveredAtMs,
    kind: r.historicalTimeMs < discoveredAtMs ? 'newly-discovered-history' : 'newly-visible-material',
  })));
}
