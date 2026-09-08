import { compareIds, freeze, ids, requireFinite, requireId } from '../shared/values.mjs';

/**
 * Internal fixture/adapter input, NOT a schema, wire format or Core contract.
 * The future Core adapter must qualify identities/relations before supplying them.
 * Omitted parentId means unknown; explicit null means genuinely parentless.
 * File paths, titles, filesystem times and display-name matching are never read.
 */
export function normalizeStoryRecords(records) {
  if (!Array.isArray(records)) throw new TypeError('records must be an array');
  const seen = new Set();
  return freeze(records.map(record => {
    if (!record || typeof record !== 'object') throw new TypeError('record must be an object');
    const id = requireId(record.id);
    if (seen.has(id)) throw new TypeError(`Duplicate story id: ${id}`);
    seen.add(id);
    const parentId = record.parentId;
    if (parentId !== undefined && parentId !== null) requireId(parentId, 'parentId');
    const authors = ids(record.authors ?? [], 'authors');
    let participants;
    if (record.participants !== undefined) participants = ids(record.participants, 'participants');
    let handoff;
    if (record.handoff !== undefined) {
      if (!record.handoff || typeof record.handoff !== 'object') throw new TypeError('handoff must be an object');
      handoff = { from: ids(record.handoff.from ?? [], 'handoff.from'), to: ids(record.handoff.to ?? [], 'handoff.to') };
    }
    const actionStatus = record.actionStatus ?? 'unknown';
    if (!['unknown', 'planned', 'occurred', 'cancelled'].includes(actionStatus)) throw new TypeError('Unsupported actionStatus');
    return { id, parentId, historicalTimeMs: requireFinite(record.historicalTimeMs, 'historicalTimeMs'),
      authors, participants, handoff, actionStatus };
  }).sort((a, b) => a.historicalTimeMs - b.historicalTimeMs || compareIds(a.id, b.id)));
}

export function actorsFor(record) {
  // Explicitly empty participant lists intentionally suppress authorship fallback.
  if (record.handoff) return freeze({ basis: 'handoff-endpoints', ids: ids([...record.handoff.from, ...record.handoff.to], 'endpoints') });
  if (record.participants !== undefined) return freeze({ basis: 'participants', ids: [...record.participants] });
  return freeze({ basis: record.authors.length ? 'authors-contribution' : 'none', ids: [...record.authors] });
}

export function contributorDelta(before, after) {
  const a = new Set(before), b = new Set(after);
  return freeze({ retained: [...b].filter(x => a.has(x)).sort(compareIds),
    joined: [...b].filter(x => !a.has(x)).sort(compareIds), left: [...a].filter(x => !b.has(x)).sort(compareIds),
    impliesResponsibilityTransfer: false });
}
