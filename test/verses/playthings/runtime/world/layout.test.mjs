import test from 'node:test';
import assert from 'node:assert/strict';
import { cardinalMask, measureFootprint, placeFootprints, variation } from '../../../../../src/verses/playthings/runtime/world/index.mjs';

test('all sixteen NESW masks come from topology in the agreed order', () => {
  const neighbours = [[0,-1],[1,0],[0,1],[-1,0]];
  for (let mask = 0; mask < 16; mask++) {
    const cells = new Set(neighbours.filter((_, i) => mask & (1 << i)).map(c => c.join(',')));
    assert.equal(cardinalMask(0, 0, (x, y) => cells.has(`${x},${y}`)), mask);
  }
});
test('variation is stateless and different channels do not consume shared RNG state', () => {
  const a = variation('world', 'room-a', 'deco');
  variation('world', 'room-other', 'deco');
  assert.equal(a, variation('world', 'room-a', 'deco'));
  assert.notEqual(a, variation('world', 'room-a', 'placement'));
  assert.ok(a >= 0 && a < 1);
});
test('capacity calculation includes directly owned content and circulation', () => {
  const r = measureFootprint({ childArea: 60, contentArea: 20 });
  assert.ok(r.width * r.height >= 108);
});
test('same batch plus seed yields the same nonoverlapping placements independent of input enumeration', () => {
  const requests = Array.from({ length: 30 }, (_, i) => ({ id: `r-${i}`, width: 2+i%4, height: 3+i%2 }));
  const a = placeFootprints(requests, { seed: 'tavern' });
  const b = placeFootprints([...requests].reverse(), { seed: 'tavern' });
  assert.deepEqual(a, b); assert.equal(a.findings.length, 0);
  for (const x of a.placements) for (const y of a.placements) if (x.id !== y.id) {
    assert.ok(x.x+x.width+1<=y.x || y.x+y.width+1<=x.x || x.y+x.height+1<=y.y || y.y+y.height+1<=x.y);
  }
});
test('new material cannot reshuffle existing settled footprints', () => {
  const a = placeFootprints([{ id: 'b', width: 8, height: 8 }]);
  const b = placeFootprints([{ id: 'a', width: 12, height: 10 }], { previous: a.placements });
  assert.deepEqual(b.placements.find(r => r.id === 'b'), a.placements[0]);
});
test('growth conflicts and search exhaustion are surfaced instead of silently relocating', () => {
  const a = placeFootprints([{ id: 'a', width: 8, height: 8 }]);
  const result = placeFootprints([{ id: 'a', width: 9, height: 8 }, { id: 'b', width: 8, height: 8 }], { previous: a.placements, maxRadius: 0 });
  assert.deepEqual(result.findings.map(f => f.code), ['growth-needs-repacking', 'placement-budget-exceeded']);
  assert.deepEqual(result.placements, a.placements);
});
test('invalid capacity and overlapping reservations fail instead of corrupting layout', () => {
  assert.throws(() => measureFootprint({ aspectRatio: 0 }));
  assert.throws(() => placeFootprints([], { previous: [{ id:'a',x:0,y:0,width:2,height:2 },{ id:'b',x:0,y:0,width:2,height:2 }] }));
});
test('capacity overflow and explicit packing work budget fail safely', () => {
  assert.throws(()=>measureFootprint({contentArea:Number.MAX_SAFE_INTEGER}));
  const a=placeFootprints([{id:'a',width:100,height:100}]);
  const b=placeFootprints([{id:'b',width:100,height:100}],{previous:a.placements,maxRadius:1000000,maxCandidates:10});
  assert.equal(b.findings[0].code,'placement-budget-exceeded');
});

test('contained packing stays inside explicit bounds and preserves earlier insertion-time placements', async()=>{
  const {placeFootprintsWithin}=await import('../../../../../src/verses/playthings/runtime/world/index.mjs');
  const early=placeFootprintsWithin([{id:'z-old',width:3,height:3,order:0}],{x:10,y:20,width:12,height:10,seed:'fixture'});
  const later=placeFootprintsWithin([{id:'z-old',width:3,height:3,order:0},{id:'a-later',width:2,height:2,order:1}],{x:10,y:20,width:12,height:10,seed:'fixture'});
  assert.deepEqual(later.placements.find(r=>r.id==='z-old'),early.placements[0]);
  assert.ok(later.placements.every(r=>r.x>=11&&r.y>=21&&r.x+r.width<=21&&r.y+r.height<=29));
});

test('contained packing keeps settled coordinates when only the containing bounds grow', async()=>{
  const {placeFootprintsWithin}=await import('../../../../../src/verses/playthings/runtime/world/index.mjs');
  const early=placeFootprintsWithin([{id:'old',width:3,height:3,order:0}],{width:8,height:8,margin:0,seed:'growth'});
  const grown=placeFootprintsWithin([{id:'old',width:3,height:3,order:0},{id:'later',width:3,height:3,order:1}],{width:12,height:12,margin:0,seed:'growth'});
  assert.deepEqual(grown.placements.find(r=>r.id==='old'),early.placements[0]);
});

test('contained packing reports impossible/budgeted placements instead of leaking outside', async()=>{
  const {placeFootprintsWithin}=await import('../../../../../src/verses/playthings/runtime/world/index.mjs');
  const tooLarge=placeFootprintsWithin([{id:'x',width:9,height:9}],{width:8,height:8,margin:1});
  assert.equal(tooLarge.placements.length,0);assert.equal(tooLarge.findings[0].code,'contained-placement-too-large');
  const budget=placeFootprintsWithin([{id:'a',width:2,height:2},{id:'b',width:2,height:2}],{width:8,height:8,maxTotalCandidates:1});
  assert.ok(budget.findings.some(f=>f.code==='contained-placement-budget-exceeded'));
});
