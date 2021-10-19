/**
 * Mulberry32: fast 32-bit seeded PRNG.
 * Returns a function that yields values in [0, 1).
 */
function mulberry32(seed) {
  return function () {
    seed = Math.trunc(seed);
    seed = Math.trunc(seed + 0x6d2b79f5);
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle using a seeded PRNG.
 * Returns a new array; does not mutate the input.
 * @param {Array} array - Input array
 * @param {number} seed - Seed for reproducible shuffle
 * @returns {Array} Shuffled copy
 */
export function seededShuffle(array, seed) {
  const arr = [...array];
  const rng = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
