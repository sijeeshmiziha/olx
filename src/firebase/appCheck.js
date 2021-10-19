/**
 * Firebase App Check - protect Firestore, Storage, and Auth from abuse.
 * Uses reCAPTCHA v3 (invisible). Enable enforcement in Firebase Console after testing.
 *
 * Setup: Firebase Console > App Check > Register app > reCAPTCHA v3, add site key.
 * Add REACT_APP_FIREBASE_APP_CHECK_RECAPTCHA_SITE_KEY to .env for the reCAPTCHA v3 site key.
 */

import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { Firebase } from './config';

let appCheckInitialized = false;

/**
 * Initialize App Check. Call once after Firebase app init (e.g. in config or App.js).
 * If no site key is set, App Check is skipped (e.g. in dev without .env).
 */
export function initAppCheck() {
  if (appCheckInitialized) return true;
  const siteKey = process.env.REACT_APP_FIREBASE_APP_CHECK_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      console.info('App Check skipped: REACT_APP_FIREBASE_APP_CHECK_RECAPTCHA_SITE_KEY not set');
    }
    return false;
  }
  try {
    initializeAppCheck(Firebase, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckInitialized = true;
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('App Check init failed:', e.message);
    }
    return false;
  }
}
