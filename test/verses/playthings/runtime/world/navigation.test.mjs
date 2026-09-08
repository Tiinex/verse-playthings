import test from 'node:test';
import assert from 'node:assert/strict';
import { createNavigationWorld, findPath, samplePath, withLinkState } from '../../../../../src/verses/playthings/runtime/world/index.mjs';
const c = (x, y, surfaceId = 'ground') => ({ x, y, surfaceId });
const floor = (id, width, height, blocked = []) => ({ id, width, height, blocked });

export function tavernWorld(doorOpen = true) {
  const blocked = []; for (let y = 0; y < 5; y++) if (y !== 2) blocked.push({ x: 3, y });
  return createNavigationWorld({ surfaces: [floor('ground', 7, 5, blocked), floor('upper', 5, 5)], links: [
    { id: 'door', kind: 'door', from: c(2, 2), to: c(3, 2), enabled: doorOpen },
    { id: 'stairs', kind: 'stairs', from: c(6, 2), to: c(0, 2, 'upper'), cost: 2 },
  ] });
}

test('pathfinding crosses door and stairs into another floor', () => {
  const path = findPath(tavernWorld(), c(0, 2), c(4, 2, 'upper'));
  assert.equal(path.status, 'found'); assert.equal(path.totalCost, 12);
  assert.ok(path.steps.some(s => s.kind === 'door')); assert.ok(path.steps.some(s => s.kind === 'stairs'));
});
test('closed door removes the actual passage, not merely its image', () => {
  assert.equal(findPath(tavernWorld(false), c(0, 2), c(4, 2, 'upper')).status, 'unreachable');
});
test('reopening creates a new immutable world; old routes do not magically update', () => {
  const original = tavernWorld(false), updated = withLinkState(original, 'door', true);
  assert.equal(findPath(original, c(0, 2), c(4, 2, 'upper')).status, 'unreachable');
  assert.equal(findPath(updated, c(0, 2), c(4, 2, 'upper')).status, 'found');
  assert.equal(original.links.find(l => l.id === 'door').enabled, false);
});
test('closed stairs produce unreachable rather than a teleport fallback', () => {
  const world = withLinkState(tavernWorld(), 'stairs', false);
  const path = findPath(world, c(6, 2), c(4, 2, 'upper'));
  assert.equal(path.status, 'unreachable'); assert.equal(samplePath(path, 200).position, null);
});
test('one-way links are respected in both directions', () => {
  const world = createNavigationWorld({ surfaces: [floor('a', 1, 1), floor('b', 1, 1)], links: [
    { id: 'step', from: c(0, 0, 'a'), to: c(0, 0, 'b'), kind: 'stairs', bidirectional: false },
  ] });
  assert.equal(findPath(world, c(0, 0, 'a'), c(0, 0, 'b')).status, 'found');
  assert.equal(findPath(world, c(0, 0, 'b'), c(0, 0, 'a')).status, 'unreachable');
});
test('weighted portal shortcut beats an apparently shorter same-floor route', () => {
  const world = createNavigationWorld({ surfaces: [floor('ground', 20, 1), floor('lift', 1, 1)], links: [
    { id: 'up', from: c(0, 0), to: c(0, 0, 'lift'), cost: 1 },
    { id: 'down', from: c(0, 0, 'lift'), to: c(19, 0), cost: 1 },
  ] });
  assert.equal(findPath(world, c(0, 0), c(19, 0)).totalCost, 2);
});
test('path cost, endpoints and order are stable when surface/link input order changes', () => {
  const world = tavernWorld();
  const shuffled = createNavigationWorld({ surfaces: [...world.surfaces].reverse(), links: [...world.links].reverse() });
  assert.deepEqual(findPath(world, c(0, 2), c(4, 2, 'upper')), findPath(shuffled, c(0, 2), c(4, 2, 'upper')));
});
test('same-cell query is a zero-length path', () => {
  const path = findPath(tavernWorld(), c(1, 1), c(1, 1));
  assert.equal(path.totalCost, 0); assert.equal(path.nodes.length, 1); assert.equal(samplePath(path, 0).phase, 'arrived');
});
test('invalid graph endpoints, duplicate portals and invalid costs are rejected', () => {
  assert.throws(() => createNavigationWorld({ surfaces: [floor('x', 0, 1)] }));
  const badLink = { id: 'x', from: c(0, 0), to: c(1, 0), kind: 'door', cost: 0 };
  assert.throws(() => createNavigationWorld({ surfaces: [floor('ground', 2, 1)], links: [badLink] }));
  const l = { ...badLink, cost: 1 };
  assert.throws(() => createNavigationWorld({ surfaces: [floor('ground', 2, 1)], links: [l, { ...l, id: 'y' }] }), /Conflicting/);
  assert.throws(() => withLinkState(tavernWorld(), 'absent', false), /Unknown/);
});
test('blocked/out-of-range destinations are explicit failures', () => {
  assert.equal(findPath(tavernWorld(), c(0, 2), c(3, 0)).status, 'blocked-endpoint');
  assert.equal(findPath(tavernWorld(), c(0, 2), c(100, 0)).status, 'blocked-endpoint');
});
test('search budget failure is not reported as absence of a path', () => {
  assert.equal(findPath(tavernWorld(), c(0, 2), c(4, 2, 'upper'), { maxVisited: 1 }).status, 'budget-exceeded');
});
test('movement sampler runs at presentation speed and does not interpolate through floors', () => {
  const path = findPath(tavernWorld(), c(0, 2), c(4, 2, 'upper'));
  assert.equal(samplePath(path, 250, { unitsPerSecond: 2 }).position.x, 0.5);
  const atStairs = samplePath(path, 3500, { unitsPerSecond: 2 });
  assert.equal(atStairs.phase, 'stairs'); assert.equal(atStairs.position, null);
  assert.notEqual(atStairs.from.surfaceId, atStairs.to.surfaceId);
});
test('80 seeded obstacle fixtures agree with an independent breadth-first cost oracle', () => {
  let seed = 983;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2**32; };
  for (let run = 0; run < 80; run++) {
    const blocked = [], set = new Set();
    for (let y = 0; y < 8; y++) for (let x = 0; x < 9; x++) if (random() < 0.22 && !(x === 0 && y === 0) && !(x === 8 && y === 7)) {
      blocked.push({ x, y }); set.add(`${x},${y}`);
    }
    const queue = [[0, 0, 0]], visited = new Set(['0,0']); let expected = null;
    for (let i = 0; i < queue.length; i++) {
      const [x, y, cost] = queue[i];
      if (x === 8 && y === 7) { expected = cost; break; }
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = x+dx, ny = y+dy, k = `${nx},${ny}`;
        if (nx < 0 || nx >= 9 || ny < 0 || ny >= 8 || set.has(k) || visited.has(k)) continue;
        visited.add(k); queue.push([nx,ny,cost+1]);
      }
    }
    const path = findPath(createNavigationWorld({ surfaces: [floor('ground', 9, 8, blocked)] }), c(0,0), c(8,7));
    assert.equal(path.totalCost, expected, `fixture ${run}`);
    assert.equal(path.status, expected === null ? 'unreachable' : 'found');
  }
});
