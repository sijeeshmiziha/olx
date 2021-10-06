/**
 * Firebase Analytics - event tracking for user behavior.
 * Events appear in Firebase Console > Analytics.
 */

import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { Firebase } from './config';

let analytics = null;

function getAnalyticsInstance() {
  if (!analytics) {
    try {
      analytics = getAnalytics(Firebase);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics init failed:', e.message);
      }
    }
  }
  return analytics;
}

export function initAnalytics() {
  return getAnalyticsInstance();
}

export function setAnalyticsEnabled(enabled) {
  const a = getAnalyticsInstance();
  if (a) setAnalyticsCollectionEnabled(a, enabled);
}

function safeLog(eventName, params) {
  try {
    const a = getAnalyticsInstance();
    if (a) logEvent(a, eventName, params);
  } catch (_) {}
}

// ─── Ad events ─────────────────────────────────────────────────────────────
export function logAdView(adId, category, price) {
  safeLog('ad_view', { ad_id: adId, category, value: price });
}

export function logAdCreate(adId, category) {
  safeLog('ad_create', { ad_id: adId, category });
}

export function logAdEdit(adId, category) {
  safeLog('ad_edit', { ad_id: adId, category });
}

export function logAdDelete(adId) {
  safeLog('ad_delete', { ad_id: adId });
}

export function logAdShare(adId, method) {
  safeLog('ad_share', { ad_id: adId, method: method || 'share' });
}

// ─── Search & browse ───────────────────────────────────────────────────────
export function logSearchQuery(searchTerm, filters) {
  safeLog('search_query', {
    search_term: searchTerm,
    ...(filters && { filters: JSON.stringify(filters) }),
  });
}

export function logFilterApply(filters) {
  safeLog('filter_apply', { filters: JSON.stringify(filters) });
}

export function logCategoryBrowse(categoryId, categoryName) {
  safeLog('category_browse', { category_id: categoryId, category_name: categoryName });
}

// ─── Offers ───────────────────────────────────────────────────────────────
export function logOfferSent(offerId, productId) {
  safeLog('offer_sent', { offer_id: offerId, product_id: productId });
}

export function logOfferAccepted(offerId, productId) {
  safeLog('offer_accepted', { offer_id: offerId, product_id: productId });
}

export function logOfferRejected(offerId, productId) {
  safeLog('offer_rejected', { offer_id: offerId, product_id: productId });
}

// ─── Chat ─────────────────────────────────────────────────────────────────
export function logChatStarted(conversationId, productId) {
  safeLog('chat_started', { conversation_id: conversationId, product_id: productId });
}

export function logMessageSent(conversationId) {
  safeLog('message_sent', { conversation_id: conversationId });
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export function logLogin(method) {
  safeLog('login', { method: method || 'email' });
}

export function logSignUp(method) {
  safeLog('sign_up', { method: method || 'email' });
}

export function logLogout() {
  safeLog('logout');
}

// ─── Favorites ────────────────────────────────────────────────────────────
export function logFavoriteAdd(adId) {
  safeLog('favorite_add', { ad_id: adId });
}

export function logFavoriteRemove(adId) {
  safeLog('favorite_remove', { ad_id: adId });
}

// ─── Profile ───────────────────────────────────────────────────────────────
export function logProfileView(userId) {
  safeLog('profile_view', { user_id: userId });
}

export function logProfileEdit() {
  safeLog('profile_edit');
}

// ─── Generic ──────────────────────────────────────────────────────────────
export function logCustomEvent(name, params) {
  if (name && typeof name === 'string') safeLog(name, params || {});
}
