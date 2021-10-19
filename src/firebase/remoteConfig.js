/**
 * Firebase Remote Config - feature flags and dynamic config without redeploy.
 * Configure defaults in Firebase Console > Remote Config.
 */

import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { Firebase } from './config';

const REMOTE_CONFIG_DEFAULTS = {
  maintenance_mode: false,
  max_images_per_ad: 8,
  ad_expiry_days: 30,
  enable_video_upload: false,
  promo_banner_text: '',
  min_app_version: '0.0.0',
  featured_categories: '', // comma-separated category IDs for home
};

let remoteConfig = null;

function getRCInstance() {
  if (!remoteConfig) {
    try {
      remoteConfig = getRemoteConfig(Firebase);
      remoteConfig.settings = {
        minimumFetchIntervalMillis: process.env.NODE_ENV === 'development' ? 0 : 3600000, // 1 hour in prod
      };
      remoteConfig.defaultConfig = REMOTE_CONFIG_DEFAULTS;
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Remote Config init failed:', e.message);
      }
    }
  }
  return remoteConfig;
}

/**
 * Fetch and activate the latest config from the server.
 * Call once at app init (e.g. in App.js after Firebase init).
 */
export async function fetchRemoteConfig() {
  const rc = getRCInstance();
  if (!rc) return false;
  try {
    await fetchAndActivate(rc);
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Remote Config fetch failed:', e.message);
    }
    return false;
  }
}

/**
 * Get a boolean value.
 * @param {string} key - e.g. 'maintenance_mode', 'enable_video_upload'
 */
export function getRemoteBoolean(key) {
  const rc = getRCInstance();
  if (!rc) return REMOTE_CONFIG_DEFAULTS[key] ?? false;
  try {
    return getValue(rc, key).asBoolean();
  } catch (_) {
    return REMOTE_CONFIG_DEFAULTS[key] ?? false;
  }
}

/**
 * Get a string value.
 * @param {string} key - e.g. 'promo_banner_text', 'min_app_version'
 */
export function getRemoteString(key) {
  const rc = getRCInstance();
  if (!rc) return REMOTE_CONFIG_DEFAULTS[key] ?? '';
  try {
    return getValue(rc, key).asString();
  } catch (_) {
    return REMOTE_CONFIG_DEFAULTS[key] ?? '';
  }
}

/**
 * Get a number value.
 * @param {string} key - e.g. 'max_images_per_ad', 'ad_expiry_days'
 */
export function getRemoteNumber(key) {
  const rc = getRCInstance();
  const def = REMOTE_CONFIG_DEFAULTS[key];
  if (!rc) return typeof def === 'number' ? def : 0;
  try {
    return getValue(rc, key).asNumber();
  } catch (_) {
    return typeof def === 'number' ? def : 0;
  }
}

/**
 * Get multiple values at once.
 * @param {string[]} keys
 * @returns {Record<string, string|number|boolean>}
 */
export function getRemoteValues(keys) {
  const result = {};
  keys.forEach((key) => {
    const def = REMOTE_CONFIG_DEFAULTS[key];
    if (typeof def === 'boolean') result[key] = getRemoteBoolean(key);
    else if (typeof def === 'number') result[key] = getRemoteNumber(key);
    else result[key] = getRemoteString(key);
  });
  return result;
}

export { REMOTE_CONFIG_DEFAULTS };
