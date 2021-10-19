/**
 * Firebase Performance Monitoring - measure load times and custom operations.
 * Data appears in Firebase Console > Performance.
 */

import { getPerformance, trace } from 'firebase/performance';
import { Firebase } from './config';

let perf = null;

function getPerfInstance() {
  if (!perf) {
    try {
      perf = getPerformance(Firebase);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Performance init failed:', e.message);
      }
    }
  }
  return perf;
}

export function initPerformance() {
  return getPerfInstance();
}

/**
 * Run an async operation and record its duration as a custom trace.
 * @param {string} traceName - Name shown in Firebase Console (use underscores, e.g. 'firestore_fetch_products')
 * @param {() => Promise<T>} fn - Async function to measure
 * @returns {Promise<T>} - Result of fn()
 */
export async function measureTrace(traceName, fn) {
  const p = getPerfInstance();
  if (!p || !traceName || typeof fn !== 'function') return fn();
  const t = trace(p, traceName);
  t.start();
  try {
    const result = await fn();
    t.stop();
    return result;
  } catch (err) {
    t.stop();
    throw err;
  }
}

/**
 * Start a custom trace manually (call stop() when done).
 * @param {string} traceName
 * @returns {{ stop: () => void } | null}
 */
export function startTrace(traceName) {
  const p = getPerfInstance();
  if (!p || !traceName) return null;
  const t = trace(p, traceName);
  t.start();
  return {
    stop: () => t.stop(),
  };
}
