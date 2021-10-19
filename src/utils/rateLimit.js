/**
 * Client-side rate limiting to reduce spam and abuse.
 * Server-side rate limiting (e.g. Cloud Functions) should also be used in production.
 */

const lastCall = {};

/**
 * Returns true if the action is allowed (enough time since last call for this key).
 * @param {string} key - Unique key for the action (e.g. 'adCreate', 'chatSend:convId', 'report')
 * @param {number} intervalMs - Minimum milliseconds between allowed calls
 * @returns {boolean}
 */
export function canProceed(key, intervalMs) {
  const now = Date.now();
  const last = lastCall[key];
  if (last == null || now - last >= intervalMs) {
    lastCall[key] = now;
    return true;
  }
  return false;
}

/**
 * Get remaining cooldown in ms (0 if can proceed).
 * @param {string} key
 * @param {number} intervalMs
 * @returns {number}
 */
export function getCooldownMs(key, intervalMs) {
  const last = lastCall[key];
  if (last == null) return 0;
  const elapsed = Date.now() - last;
  return elapsed >= intervalMs ? 0 : intervalMs - elapsed;
}

export const RATE_LIMITS = {
  AD_CREATE_MS: 60 * 1000,
  CHAT_MESSAGE_MS: 2000,
  REPORT_MS: 15 * 1000,
  FAVORITE_TOGGLE_MS: 2000,
  FOLLOW_TOGGLE_MS: 2000,
};
