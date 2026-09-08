import { compareIds, freeze, requireFinite, requireId, requireInteger } from '../shared/values.mjs';

/** Stateless presentation variation. Not cryptographic and never semantic identity. */
export function variation(seed, identity, channel = 'decoration') {
  const text = JSON.stringify([requireId(seed, 'seed'), requireId(identity), requireId(channel, 'channel')]);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Explicit capacity inputs; no schema names, participant status or future nodes. */
export function measureFootprint(options = {}) {
  const minWidth = requireInteger(options.minWidth ?? 4, 'minWidth', 1);
  const minHeight = requireInteger(options.minHeight ?? 4, 'minHeight', 1);
  const contentArea = requireInteger(options.contentArea ?? 0, 'contentArea');
  const childArea = requireInteger(options.childArea ?? 0, 'childArea');
  const circulation = requireFinite(options.circulationFraction ?? 0.35, 'circulationFraction', 0);
  const aspect = requireFinite(options.aspectRatio ?? 1.25, 'aspectRatio', Number.EPSILON);
  const area = Math.max(minWidth * minHeight, Math.ceil((contentArea + childArea) * (1 + circulation)));
  requireInteger(area, 'requested area', 1);
  const width = Math.max(minWidth, Math.ceil(Math.sqrt(area * aspect)));
  requireInteger(width, 'computed width', 1);
  return freeze({ width, height: Math.max(minHeight, Math.ceil(area / width)), requestedArea: area });
}
const overlaps = (a, b, gap) => a.x < b.x + b.width + gap && a.x + a.width + gap > b.x && a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;
function rect(r) { return { id: requireId(r.id), x: requireInteger(r.x, 'x', -Number.MAX_SAFE_INTEGER),
  y: requireInteger(r.y, 'y', -Number.MAX_SAFE_INTEGER), width: requireInteger(r.width, 'width', 1), height: requireInteger(r.height, 'height', 1) }; }

/**
 * Incremental packing primitive. Existing placements are immutable reservations.
 * Replay determinism requires the same insertion batches + prior reservation state;
 * it does NOT claim order-independent packing across different histories.
 * Existing growth is reported, never silently resized over neighbours.
 */
export function placeFootprints(requests, options = {}) {
  const seed = requireId(options.seed ?? 'playthings-fixture', 'seed');
  const gap = requireInteger(options.gap ?? 1, 'gap');
  const maxRadius = requireInteger(options.maxRadius ?? 256, 'maxRadius');
  const maxCandidates = requireInteger(options.maxCandidates ?? 100_000, 'maxCandidates', 1);
  const previous = (options.previous ?? []).map(rect).sort((a, b) => compareIds(a.id, b.id));
  if (new Set(previous.map(r => r.id)).size !== previous.length) throw new TypeError('Duplicate previous placement');
  for (let i = 0; i < previous.length; i++) for (let j = i + 1; j < previous.length; j++) {
    if (overlaps(previous[i], previous[j], gap)) throw new RangeError('Previous reservations overlap');
  }
  const seen = new Set(), findings = [], placements = [...previous];
  const existing = new Map(previous.map(r => [r.id, r]));
  for (const request of [...requests].sort((a, b) => compareIds(a.id, b.id))) {
    const id = requireId(request.id);
    if (seen.has(id)) throw new TypeError('Duplicate footprint request'); seen.add(id);
    const width = requireInteger(request.width, 'width', 1), height = requireInteger(request.height, 'height', 1);
    if (existing.has(id)) {
      const old = existing.get(id);
      if (width > old.width || height > old.height) findings.push({ id, code: 'growth-needs-repacking', severity: 'warning' });
      continue;
    }
    // One quarter-turn choice changes search order without moving old neighbours.
    const turn = Math.floor(variation(seed, id, 'placement') * 4);
    const rotate = ([x, y]) => turn === 0 ? [x, y] : turn === 1 ? [-y, x] : turn === 2 ? [-x, -y] : [y, -x];
    let found = null, checked = 0;
    search: for (let r = 0; r <= maxRadius; r++) {
      const candidates = r === 0 ? [[0, 0]] : [];
      if (r > 0) {
        for (let x = -r; x <= r; x++) candidates.push([x, -r], [x, r]);
        for (let y = -r + 1; y < r; y++) candidates.push([-r, y], [r, y]);
      }
      for (const candidate of candidates) {
        if (++checked > maxCandidates) break search;
        const [x, y] = rotate(candidate), current = { id, x, y, width, height };
        if (!placements.some(p => overlaps(current, p, gap))) { found = current; break search; }
      }
    }
    if (found) placements.push(found);
    else findings.push({ id, code: 'placement-budget-exceeded', severity: 'warning' });
  }
  return freeze({ placements: placements.sort((a, b) => compareIds(a.id, b.id)), findings });
}

/** Produces a mask from topology, never guesses it from an authored sprite. */
export function cardinalMask(x, y, isOccupied) {
  requireInteger(x, 'x', -Number.MAX_SAFE_INTEGER); requireInteger(y, 'y', -Number.MAX_SAFE_INTEGER);
  if (typeof isOccupied !== 'function') throw new TypeError('isOccupied must be a function');
  return (isOccupied(x, y - 1) ? 1 : 0) | (isOccupied(x + 1, y) ? 2 : 0) |
    (isOccupied(x, y + 1) ? 4 : 0) | (isOccupied(x - 1, y) ? 8 : 0);
}
