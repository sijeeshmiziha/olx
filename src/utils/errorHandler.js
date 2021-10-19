/**
 * Centralized error logging. Replace silent .catch(() => {}) with
 * .catch(silentCatch('ComponentName:action')) for visibility in development.
 * In production, wire reportError to your error tracking service (e.g. Sentry).
 */

export function logError(context, error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${context}]`, error?.message || error);
  }
  if (process.env.NODE_ENV === 'production') {
    reportError(context, error);
  }
}

/**
 * Send error to tracking service. Replace this with Sentry.captureException etc.
 * @param {string} context
 * @param {Error|*} error
 */
export function reportError(context, error) {
  if (typeof window !== 'undefined' && window.__reportError) {
    window.__reportError(context, error);
  }
}

/**
 * Returns a function suitable for .catch() that logs instead of swallowing.
 * @param {string} context - e.g. 'View:incrementViewCount'
 */
export function silentCatch(context) {
  return (error) => logError(context, error);
}
