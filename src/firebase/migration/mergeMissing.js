/**
 * Deep-merge defaults for missing keys only. Does not overwrite existing values.
 * @param {Object} target - Existing object
 * @param {Object} defaults - Default key-value pairs
 * @returns {Object} New object with missing keys filled from defaults
 */
export function mergeMissing(target, defaults) {
  if (target == null || typeof target !== 'object') return { ...defaults };
  const out = { ...target };
  for (const key of Object.keys(defaults)) {
    if (out[key] === undefined || out[key] === null) {
      out[key] = defaults[key];
    } else if (
      typeof defaults[key] === 'object' &&
      defaults[key] !== null &&
      !Array.isArray(defaults[key]) &&
      typeof out[key] === 'object' &&
      out[key] !== null
    ) {
      out[key] = mergeMissing(out[key], defaults[key]);
    }
  }
  return out;
}
