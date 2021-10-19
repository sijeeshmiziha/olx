/**
 * User document migration helpers.
 */
import {
  DEFAULT_USER_LOCATION,
  DEFAULT_USER_BUSINESS_INFO,
  DEFAULT_USER_SOCIAL_LINKS,
  DEFAULT_USER_PRIVACY_SETTINGS,
} from '../schema';
import { mergeMissing } from './mergeMissing';
import { USER_DEFAULTS } from './defaults';

/**
 * Merge a user document with default values for any missing fields.
 * Use the returned object in the UI; does not write to Firestore.
 */
export function migrateUserDoc(doc) {
  const id = doc.id;
  const data = typeof doc.data === 'function' ? doc.data() : doc.data || {};
  const merged = mergeMissing(data, USER_DEFAULTS);
  if (merged.location && typeof merged.location === 'object') {
    merged.location = { ...DEFAULT_USER_LOCATION(), ...merged.location };
  }
  if (merged.businessInfo && typeof merged.businessInfo === 'object') {
    merged.businessInfo = { ...DEFAULT_USER_BUSINESS_INFO(), ...merged.businessInfo };
  }
  if (merged.socialLinks && typeof merged.socialLinks === 'object') {
    merged.socialLinks = { ...DEFAULT_USER_SOCIAL_LINKS(), ...merged.socialLinks };
  }
  if (merged.privacySettings && typeof merged.privacySettings === 'object') {
    merged.privacySettings = { ...DEFAULT_USER_PRIVACY_SETTINGS(), ...merged.privacySettings };
  }
  return { id, ...merged };
}

