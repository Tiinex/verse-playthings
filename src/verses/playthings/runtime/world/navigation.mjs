import { compareIds, freeze, requireFinite, requireId, requireInteger } from '../shared/values.mjs';

const key = cell => JSON.stringify([cell.surfaceId, cell.x, cell.y]);
const pairKey = (a, b) => JSON.stringify([key(a), key(b)]);
const barrierKey = (a, b) => {
  const ak = key(a), bk = key(b);
  return ak < bk ? JSON.stringify([ak, bk]) : JSON.stringify([bk, ak]);
};
const cardinal = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const indexes = new WeakMap();
function copyCell(c) {
  if (!c || typeof c !== 'object') throw new TypeError('cell must be an object');
  return { surfaceId: requireId(c.surfaceId, 'surfaceId'), x: requireInteger(c.x, 'cell.x'), y: requireInteger(c.y, 'cell.y') };
}
function index(world) {
  if (!indexes.has(world)) throw new TypeError('Use a navigation world created by createNavigationWorld');
  return indexes.get(world);
}
function walkable(idx, cell) {
  const s = idx.surfaces.get(cell.surfaceId);
  return Boolean(s && cell.x >= 0 && cell.y >= 0 && cell.x < s.width && cell.y < s.height && !idx.blocked.has(key(cell)));
}

/** Explicit walkability/portal graph only. No pixel interpretation or floor-order inference. */
export function createNavigationWorld(input) {
  if (!input || !Array.isArray(input.surfaces) || !input.surfaces.length) throw new TypeError('surfaces must be nonempty');
  const surfaces = input.surfaces.map(s => ({ id: requireId(s.id, 'surface.id'),
    width: requireInteger(s.width, 'width', 1), height: requireInteger(s.height, 'height', 1),
    blocked: (s.blocked ?? []).map(c => ({ x: requireInteger(c.x, 'blocked.x'), y: requireInteger(c.y, 'blocked.y') })) }))
    .sort((a, b) => compareIds(a.id, b.id));
  if (new Set(surfaces.map(s => s.id)).size !== surfaces.length) throw new TypeError('Duplicate surface id');
  const idx = { surfaces: new Map(surfaces.map(s => [s.id, s])), blocked: new Set(), barriers: new Set(), outgoing: new Map(), overrides: new Map() };
  for (const s of surfaces) {
    s.blocked.sort((a, b) => a.y - b.y || a.x - b.x);
    for (const b of s.blocked) {
      if (b.x >= s.width || b.y >= s.height) throw new RangeError('Blocked cell outside surface');
      const k = key({ ...b, surfaceId: s.id });
      if (idx.blocked.has(k)) throw new TypeError('Duplicate blocked cell');
      idx.blocked.add(k);
    }
  }
  const barriers = (input.barriers ?? []).map((barrier) => {
    const from = copyCell(barrier.from), to = copyCell(barrier.to);
    if (from.surfaceId !== to.surfaceId || Math.abs(from.x - to.x) + Math.abs(from.y - to.y) !== 1) {
      throw new RangeError('Navigation barriers must separate adjacent cardinal cells on one surface');
    }
    if (!walkable(idx, from) || !walkable(idx, to)) throw new RangeError('Barrier endpoint is not walkable');
    return { from, to };
  }).sort((a, b) => compareIds(barrierKey(a.from, a.to), barrierKey(b.from, b.to)));
  for (const barrier of barriers) {
    const bk = barrierKey(barrier.from, barrier.to);
    if (idx.barriers.has(bk)) throw new TypeError('Duplicate navigation barrier');
    idx.barriers.add(bk);
  }
  const links = (input.links ?? []).map(link => {
    const from = copyCell(link.from), to = copyCell(link.to);
    const kind = link.kind ?? 'stairs';
    if (!['door', 'stairs', 'passage'].includes(kind)) throw new TypeError('Unknown navigation link kind');
    if (key(from) === key(to)) throw new TypeError('Self links are not supported');
    if (!walkable(idx, from) || !walkable(idx, to)) throw new RangeError('Link endpoint is not walkable');
    if (kind === 'door' && (from.surfaceId !== to.surfaceId || Math.abs(from.x - to.x) + Math.abs(from.y - to.y) !== 1)) {
      throw new RangeError('A door replaces an adjacent cardinal edge on one surface');
    }
    if (from.surfaceId === to.surfaceId && Math.abs(from.x - to.x) + Math.abs(from.y - to.y) !== 1) throw new RangeError('Same-surface links must join adjacent cells');
    if (kind === 'stairs' && from.surfaceId === to.surfaceId) throw new RangeError('Stairs must join distinct surfaces');
    for (const field of ['enabled', 'bidirectional']) if (link[field] !== undefined && typeof link[field] !== 'boolean') throw new TypeError(`${field} must be boolean`);
    const cost = requireFinite(link.cost ?? 1, 'link.cost', Number.EPSILON);
    return { id: requireId(link.id, 'link.id'), kind, from, to, cost, enabled: link.enabled !== false, bidirectional: link.bidirectional !== false };
  }).sort((a, b) => compareIds(a.id, b.id));
  if (new Set(links.map(l => l.id)).size !== links.length) throw new TypeError('Duplicate link id');
  for (const l of links) {
    if (idx.barriers.has(barrierKey(l.from, l.to))) throw new TypeError('Navigation link conflicts with a barrier');
    for (const [from, to, allowed] of [[l.from, l.to, true], [l.to, l.from, l.bidirectional]]) {
      const pk = pairKey(from, to);
      if (idx.overrides.has(pk)) throw new TypeError('Conflicting navigation links for one directed edge');
      idx.overrides.set(pk, { link: l, allowed });
      if (allowed && l.enabled) {
        const list = idx.outgoing.get(key(from)) ?? [];
        list.push({ from, to, cost: l.cost, kind: l.kind, linkId: l.id });
        idx.outgoing.set(key(from), list);
      }
    }
  }
  const world = freeze({ kind: 'playthings-navigation-world', surfaces, barriers, links });
  indexes.set(world, idx);
  return world;
}

export function withLinkState(world, linkId, enabled) {
  index(world);
  if (typeof enabled !== 'boolean') throw new TypeError('enabled must be boolean');
  if (!world.links.some(l => l.id === linkId)) throw new RangeError('Unknown link');
  return createNavigationWorld({ surfaces: world.surfaces, barriers: world.barriers, links: world.links.map(l => l.id === linkId ? { ...l, enabled } : l) });
}
function neighbours(idx, cell) {
  const result = [...(idx.outgoing.get(key(cell)) ?? [])];
  for (const [dx, dy] of cardinal) {
    const to = { ...cell, x: cell.x + dx, y: cell.y + dy };
    if (!walkable(idx, to) || idx.barriers.has(barrierKey(cell, to)) || idx.overrides.has(pairKey(cell, to))) continue;
    result.push({ from: cell, to, cost: 1, kind: 'walk', linkId: null });
  }
  return result.sort((a, b) => compareIds(key(a.to), key(b.to)) || compareIds(a.linkId ?? '', b.linkId ?? ''));
}
class MinHeap {
  data = [];
  less(a, b) { return a.cost < b.cost || (a.cost === b.cost && compareIds(a.id, b.id) < 0); }
  push(item) {
    const a = this.data; let i = a.push(item) - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (!this.less(a[i], a[p])) break; [a[i], a[p]] = [a[p], a[i]]; i = p; }
  }
  pop() {
    const a = this.data, first = a[0], tail = a.pop();
    if (a.length) { a[0] = tail; let i = 0;
      for (;;) { let smallest = i; const l = 2 * i + 1, r = l + 1;
        if (l < a.length && this.less(a[l], a[smallest])) smallest = l;
        if (r < a.length && this.less(a[r], a[smallest])) smallest = r;
        if (smallest === i) break; [a[i], a[smallest]] = [a[smallest], a[i]]; i = smallest;
      }
    }
    return first;
  }
}

/** Dijkstra: unlike Manhattan A*, remains admissible with arbitrary cross-floor links. */
export function findPath(world, startValue, goalValue, options = {}) {
  const idx = index(world), start = copyCell(startValue), goal = copyCell(goalValue);
  const maxVisited = requireInteger(options.maxVisited ?? 100_000, 'maxVisited', 1);
  const failed = (status, visited = 0) => freeze({ status, nodes: [], steps: [], totalCost: null, visited });
  if (!walkable(idx, start) || !walkable(idx, goal)) return failed('blocked-endpoint');
  const startId = key(start), goalId = key(goal), queue = new MinHeap();
  const distances = new Map([[startId, 0]]), previous = new Map(), visited = new Set();
  queue.push({ id: startId, cell: start, cost: 0 });
  while (queue.data.length) {
    const current = queue.pop();
    if (visited.has(current.id) || current.cost !== distances.get(current.id)) continue;
    if (visited.size >= maxVisited) return failed('budget-exceeded', visited.size);
    visited.add(current.id);
    if (current.id === goalId) {
      const steps = []; let id = goalId;
      while (id !== startId) { const step = previous.get(id); steps.push(step); id = key(step.from); }
      steps.reverse();
      return freeze({ status: 'found', nodes: [start, ...steps.map(s => s.to)], steps, totalCost: current.cost, visited: visited.size });
    }
    for (const edge of neighbours(idx, current.cell)) {
      const next = key(edge.to), cost = current.cost + edge.cost;
      if (!Number.isFinite(cost)) throw new RangeError('Navigation cost overflow');
      if (cost < (distances.get(next) ?? Infinity)) {
        distances.set(next, cost); previous.set(next, edge); queue.push({ id: next, cell: edge.to, cost });
      }
    }
  }
  return failed('unreachable', visited.size);
}

/** Graph cost is the declared traversal-distance proxy, not inferred meters. */
export function samplePath(path, elapsedMs, options = {}) {
  requireFinite(elapsedMs, 'elapsedMs', 0);
  const unitsPerSecond = requireFinite(options.unitsPerSecond ?? 2, 'unitsPerSecond', Number.EPSILON);
  if (path.status !== 'found') return freeze({ status: path.status, phase: 'blocked', position: null });
  const distance = elapsedMs / 1000 * unitsPerSecond;
  let travelled = 0;
  for (const step of path.steps) {
    if (distance < travelled + step.cost) {
      const progress = (distance - travelled) / step.cost;
      // Never draw a fictitious diagonal between different surfaces.
      const sameSurface = step.from.surfaceId === step.to.surfaceId;
      const position = sameSurface ? { surfaceId: step.from.surfaceId,
        x: step.from.x + (step.to.x - step.from.x) * progress, y: step.from.y + (step.to.y - step.from.y) * progress } : null;
      return freeze({ status: 'found', phase: step.kind, from: step.from, to: step.to, progress, position });
    }
    travelled += step.cost;
  }
  return freeze({ status: 'found', phase: 'arrived', position: path.nodes.at(-1), progress: 1 });
}
