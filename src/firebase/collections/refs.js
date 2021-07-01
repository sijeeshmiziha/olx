/**
 * Firestore collection references and db (for transactions).
 */
import { Firebase } from '../config';

export const db = Firebase.firestore();

export const productsRef = () => db.collection('products');
export const usersRef = () => db.collection('users');
export const conversationsRef = () => db.collection('conversations');
export const reportsRef = () => db.collection('reports');
export const categoriesRef = () => db.collection('categories');
export const notificationsRef = () => db.collection('notifications');
export const offersRef = () => db.collection('offers');
export const reviewsRef = () => db.collection('reviews');
export const savedSearchesRef = () => db.collection('savedSearches');
export const blockedUsersRef = () => db.collection('blockedUsers');
export const priceHistoryRef = () => db.collection('priceHistory');
export const adPromotionsRef = () => db.collection('adPromotions');
export const verificationsRef = () => db.collection('verifications');
export const userPreferencesRef = () => db.collection('userPreferences');
export const trendingSearchesRef = () => db.collection('trendingSearches');
export const activityLogRef = () => db.collection('activityLog');
export const transactionsRef = () => db.collection('transactions');
export const followersRef = () => db.collection('followers');
export const addressesRef = () => db.collection('addresses');
export const bannersRef = () => db.collection('banners');
export const feedbackRef = () => db.collection('feedback');
