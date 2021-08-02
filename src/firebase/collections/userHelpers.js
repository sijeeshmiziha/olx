/**
 * User collection helpers.
 */
import {
  DEFAULT_USER_LOCATION,
  DEFAULT_USER_BUSINESS_INFO,
  DEFAULT_USER_SOCIAL_LINKS,
  DEFAULT_USER_PRIVACY_SETTINGS,
} from '../schema';
import { usersRef } from './refs';
import { serverTimestamp } from './fieldValues';

export const getUserRef = (userId) => usersRef().doc(userId);
export const getUserByAuthId = (authId) =>
  usersRef().where('id', '==', authId).limit(1);

/**
 * @param {{ premiumMember?: boolean, premiumExpiry?: FirebaseFirestore.Timestamp | null }} data - User doc or snapshot data
 * @returns {boolean} True if user has an active paid plan
 */
export function isPremiumUser(data) {
  if (!data?.premiumMember) return false;
  const expiry = data.premiumExpiry;
  if (expiry == null) return true;
  const expiryDate = typeof expiry.toDate === 'function' ? expiry.toDate() : new Date(expiry);
  return expiryDate > new Date();
}

export async function ensureUserDoc(authUser, extras = {}) {
  const ref = getUserRef(authUser.uid);
  const doc = await ref.get();
  if (doc.exists) return;
  const now = serverTimestamp();
  await ref.set({
    id: authUser.uid,
    name:
      extras.name != null
        ? String(extras.name).trim()
        : authUser.displayName || authUser.email?.split('@')[0] || 'User',
    phone: extras.phone != null ? String(extras.phone).trim() : '',
    email: authUser.email || extras.email || '',
    alternatePhone: '',
    dateOfBirth: null,
    gender: '',
    avatar: authUser.photoURL || extras.avatar || '',
    coverPhoto: '',
    about: '',
    languages: '',
    website: '',
    location: DEFAULT_USER_LOCATION(),
    businessInfo: DEFAULT_USER_BUSINESS_INFO(),
    socialLinks: DEFAULT_USER_SOCIAL_LINKS(),
    verified: false,
    emailVerified: authUser.emailVerified || false,
    phoneVerified: false,
    idVerified: false,
    addressVerified: false,
    kycStatus: 'not_started',
    trustScore: 0,
    badgeLevel: 'new',
    ratingSum: 0,
    ratingCount: 0,
    responseRate: 0,
    responseTime: '',
    totalAdsPosted: 0,
    totalAdsSold: 0,
    totalActiveAds: 0,
    followersCount: 0,
    followingCount: 0,
    accountStatus: 'active',
    role: 'user',
    isOnline: false,
    lastSeen: null,
    premiumMember: false,
    premiumExpiry: null,
    referralCode: '',
    referredBy: '',
    preferredLanguage: 'en',
    currency: 'INR',
    privacySettings: DEFAULT_USER_PRIVACY_SETTINGS(),
    savedAds: [],
    watchlist: [],
    memberSince: now,
    updatedAt: now,
  });
}
