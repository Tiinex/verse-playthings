/** Playthings-owned value helpers; no parsing or Core semantic authority. */
export function compareIds(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
export function requireId(value, label = 'id') {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${label} must be a nonempty string`);
  return value;
}
export function requireFinite(value, label, minimum = -Infinity) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum) throw new TypeError(`${label} must be finite and >= ${minimum}`);
  return value;
}
export function requireInteger(value, label, minimum = 0) {
  requireFinite(value, label, minimum);
  if (!Number.isSafeInteger(value)) throw new TypeError(`${label} must be a safe integer`);
  return value;
}
export function ids(values, label) {
  if (!Array.isArray(values)) throw new TypeError(`${label} must be an array`);
  return [...new Set(values.map(value => requireId(value, label)))].sort(compareIds);
}
export function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
