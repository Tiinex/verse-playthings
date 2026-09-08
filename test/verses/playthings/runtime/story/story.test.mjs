import test from 'node:test';
import assert from 'node:assert/strict';
import { createStoryPlan, sampleStoryPlan, describeNewHistory, actorsFor, normalizeStoryRecords } from '../../../../../src/verses/playthings/runtime/story/index.mjs';
const e = (id, parentId, time, authors = ['A'], extra = {}) => ({ id, parentId, historicalTimeMs: time, authors, ...extra });
const knownA = { identities: [{ id: 'A', discoveredAtMs: 0 }] };
const op = (plan, id) => plan.log.find(o => o.id === id);
const mode = (sample, id, actor = 'A') => sample.frontiers.find(f => f.artifactId === id)?.actors.find(a => a.identityId === actor)?.mode;

function forkRecords() {
  // Labels resemble filenames for readability only; all ancestry is explicit.
  return [e('1', null, 0), e('1-1', '1', 1), e('1-1-1', '1-1', 2), e('1-1-1-1', '1-1-1', 3),
    e('1-1-1-1-1', '1-1-1-1', 4), e('1-1-1-1-1-1', '1-1-1-1-1', 5),
    e('1-1-2', '1-1', 6), e('1-1-2-1', '1-1-2', 7), e('1-1-2-1-1', '1-1-2-1', 8), e('1-1-2-1-1-1', '1-1-2-1-1', 9)];
}

test('serial contribution reuses a frontier rather than spawning more leaves', () => {
  const plan = createStoryPlan([e('root', null, 0), e('next', 'root', 1)], knownA);
  assert.equal(op(plan, 'root').effects[0].kind, 'root-entry');
  assert.equal(op(plan, 'next').effects[0].kind, 'advance');
  assert.deepEqual(sampleStoryPlan(plan, 1).frontiers.map(f => f.artifactId), ['next']);
});
test('approved fork leaves old-leaf ghost and backtracks to the actual common ancestor', () => {
  const plan = createStoryPlan(forkRecords(), knownA), fork = op(plan, '1-1-2').effects[0];
  assert.equal(fork.kind, 'backtrack-fork');
  assert.equal(fork.leaveGhostAt, '1-1-1-1-1-1');
  assert.equal(fork.commonAncestorId, '1-1');
  assert.deepEqual(fork.backtrack, ['1-1-1-1-1-1', '1-1-1-1-1', '1-1-1-1', '1-1-1', '1-1']);
  assert.deepEqual(fork.forward, ['1-1', '1-1-2']);
  assert.equal(mode(sampleStoryPlan(plan, 9), '1-1-1-1-1-1'), 'ghost');
  assert.equal(mode(sampleStoryPlan(plan, 9), '1-1-2-1-1-1'), 'active');
});
test('a later continuation wakes the old frontier without fabricating a Root spawn', () => {
  const plan = createStoryPlan([...forkRecords(), e('old-return', '1-1-1-1-1-1', 10)]);
  assert.equal(op(plan, 'old-return').effects[0].kind, 'reactivate');
  assert.equal(mode(sampleStoryPlan(plan, 10), 'old-return'), 'active');
});
test('selecting a ghost changes emphasis only', () => {
  const plan = createStoryPlan(forkRecords());
  const selected = sampleStoryPlan(plan, 9, { selectedFrontierId: '1-1-1-1-1-1' });
  assert.equal(mode(selected, '1-1-1-1-1-1'), 'ghost');
  assert.equal(selected.frontiers.find(f => f.selected).actors[0].emphasis, 'sharp');
  assert.equal(sampleStoryPlan(plan, 9).frontiers.find(f => f.artifactId === '1-1-1-1-1-1').actors[0].emphasis, 'toned');
});
test('no future artifact or ghost leaks through the historical knowledge gate', () => {
  const plan = createStoryPlan(forkRecords());
  assert.deepEqual(sampleStoryPlan(plan, 5).frontiers.map(f => f.artifactId), ['1-1-1-1-1-1']);
  assert.equal(mode(sampleStoryPlan(plan, 5), '1-1-1-1-1-1'), 'active');
});
test('identity discovery changes graphics only at its declared historical point', () => {
  const plan = createStoryPlan([e('root', null, 0)], { identities: [{ id: 'A', discoveredAtMs: 5 }] });
  assert.equal(sampleStoryPlan(plan, 4).frontiers[0].actors[0].appearance, 'default');
  assert.equal(sampleStoryPlan(plan, 5).frontiers[0].actors[0].appearance, 'identity');
  assert.equal(sampleStoryPlan(plan, 4).frontiers[0].actors[0].appearance, 'default');
});
test('explicit participants beat Authors; writer does not become the RPG subject', () => {
  const plan = createStoryPlan([e('tavern', null, 0, ['Sigma'], { participants: ['Alice', 'Bob'] })]);
  assert.deepEqual(plan.log[0].actors, { basis: 'participants', ids: ['Alice', 'Bob'] });
});
test('explicitly empty participants do not fall through to Authors', () => {
  const [record] = normalizeStoryRecords([e('r', null, 0, ['Sigma'], { participants: [] })]);
  assert.deepEqual(actorsFor(record), { basis: 'participants', ids: [] });
});
test('A to A+B to B reports contributor changes, not responsibility or ownership', () => {
  const plan = createStoryPlan([e('r', null, 0), e('ab', 'r', 1, ['B', 'A']), e('b', 'ab', 2, ['B'])]);
  assert.deepEqual(op(plan, 'ab').contribution.joined, ['B']);
  assert.deepEqual(op(plan, 'b').contribution.left, ['A']);
  assert.equal(op(plan, 'b').contribution.impliesResponsibilityTransfer, false);
});
test('informal succession never invents a handoff or a participant meeting', () => {
  const plan = createStoryPlan([e('r', null, 0), e('b', 'r', 1, ['B'])]);
  assert.equal(op(plan, 'b').transition, 'contribution-continuation');
  assert.equal(op(plan, 'b').effects[0].kind, 'arrive-context');
  assert.deepEqual(op(plan, 'b').actors.ids, ['B']);
});
test('formal Handoff From/To is depicted as a declaration, not acceptance', () => {
  const plan = createStoryPlan([e('r', null, 0, ['Writer'], { handoff: { from: ['Anchor'], to: ['Pilot'] } })]);
  assert.equal(plan.log[0].transition, 'formal-handoff-declaration');
  assert.deepEqual(plan.log[0].actors.ids, ['Anchor', 'Pilot']);
  assert.equal(plan.log[0].impliesAcceptance, false);
});
for (const status of ['unknown', 'planned', 'cancelled', 'occurred']) test(`event status ${status} has bounded depiction`, () => {
  const plan = createStoryPlan([e('r', null, -6_000_000_000_000, [], { actionStatus: status })]);
  assert.equal(plan.log[0].depiction, status === 'occurred' ? 'qualified-occurrence' : 'artifact-introduction');
});
test('an explicitly parentless new tree does not borrow an unrelated same-author frontier', () => {
  const plan = createStoryPlan([e('one', null, 0), e('two', null, 1)]);
  assert.equal(op(plan, 'two').effects[0].kind, 'root-entry');
  assert.equal(mode(sampleStoryPlan(plan, 1), 'one'), 'active');
});
for (const [name, records] of [
  ['unknown-parent', [e('a', undefined, 1)]], ['missing-parent', [e('a', 'absent', 1)]],
  ['future-parent', [e('a', 'p', 1), e('p', null, 2)]], ['cycle', [e('a', 'b', 1), e('b', 'a', 1)]],
]) test(`${name} is quarantined, not silently interpreted as Root`, () => {
  const plan = createStoryPlan(records);
  assert.equal(op(plan, 'a').originStatus, name);
  assert.equal(op(plan, 'a').effects[0].kind, 'deferred-origin');
  assert.ok(plan.findings.some(f => f.code === `origin.${name}`));
});
test('same-time siblings are both visible and sharp; tie-break is not concurrency proof', () => {
  const plan = createStoryPlan([e('r', null, 0), e('b', 'r', 1), e('a', 'r', 1)]);
  const state = sampleStoryPlan(plan, 1);
  assert.equal(mode(state, 'a'), 'active'); assert.equal(mode(state, 'b'), 'active');
  assert.equal(op(plan, 'b').impliesRealWorldConcurrency, false);
  assert.equal(plan.groups[1].presentationOrderIsHistoricalOrder, false);
});
test('equal-time Parent order follows edges even when lexical names suggest the reverse', () => {
  const plan = createStoryPlan([e('a', 'z', 1), e('z', null, 1)]);
  assert.deepEqual(plan.log.map(e => e.id), ['z', 'a']);
  assert.deepEqual(sampleStoryPlan(plan, 1).frontiers.map(f => f.artifactId), ['a']);
});
test('permuting provider order or changing real/synthetic paths does not change the plan', () => {
  const records = forkRecords();
  const before = JSON.stringify(records);
  const a = createStoryPlan(records.map(r => ({ ...r, path: 'one/' + r.id, fileMtime: 8 })), knownA);
  const b = createStoryPlan([...records].reverse().map(r => ({ ...r, path: 'synthetic/' + r.id, fileMtime: 900 })), knownA);
  assert.deepEqual(a, b); assert.equal(JSON.stringify(records), before);
});
test('duplicate IDs and invalid timestamps fail closed', () => {
  assert.throws(() => createStoryPlan([e('a', null, 1), e('a', null, 1)]), /Duplicate/);
  for (const t of [NaN, Infinity, null, '1000']) assert.throws(() => createStoryPlan([e('a', null, t)]));
});
test('late discovery retains history time instead of restamping to receipt time', () => {
  const results = describeNewHistory(['known'], [e('known', null, 0), e('old', null, -1000)], 5000);
  assert.deepEqual(results, [{ id: 'old', historicalTimeMs: -1000, discoveredAtMs: 5000, kind: 'newly-discovered-history' }]);
});
test('unknown identities are not aliased through JavaScript object prototypes', () => {
  const plan = createStoryPlan([e('r', null, 0, ['Other']), e('n', 'r', 1, ['toString'])]);
  assert.equal(op(plan, 'n').effects[0].kind, 'arrive-context');
});
test('frozen plan and sampled states cannot be mutated by a consumer', () => {
  const plan = createStoryPlan(forkRecords());
  assert.throws(() => { plan.log[0].effects.push({}); }, TypeError);
  assert.throws(() => { sampleStoryPlan(plan, 9).frontiers[0].actors[0].mode = 'active'; }, TypeError);
});
test('reactivating an old ghost tones the prior sequential same-identity frontier', () => {
  const plan=createStoryPlan([...forkRecords(),e('returned','1-1-1-1-1-1',10)]);
  assert.equal(mode(sampleStoryPlan(plan,10),'returned'),'active');
  assert.equal(mode(sampleStoryPlan(plan,10),'1-1-2-1-1-1'),'ghost');
});
