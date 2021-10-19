import { getRemoteNumber } from '../firebase/remoteConfig';

const DEFAULT_EXPIRY_DAYS = 30;

/**
 * Number of days after which an active ad is considered expired (from Remote Config or default).
 */
export function getAdExpiryDays() {
  const n = getRemoteNumber('ad_expiry_days');
  return n > 0 ? n : DEFAULT_EXPIRY_DAYS;
}

/**
 * Check if an ad should be treated as expired (active but past expiry date).
 * @param {object} product - Product doc with status and createdAt
 * @returns {boolean}
 */
export function isAdExpired(product) {
  if (!product) return false;
  if (product.status === 'expired') return true;
  if (product.status !== 'active' && product.status !== undefined) return false;
  const created = product.createdAt;
  if (!created) return false;
  const createdDate =
    created && typeof created.toDate === 'function'
      ? created.toDate()
      : new Date(created);
  const now = new Date();
  const days = (now - createdDate) / (1000 * 60 * 60 * 24);
  return days >= getAdExpiryDays();
}
