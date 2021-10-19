/**
 * Report, Address, Banner, Feedback helpers.
 */
import {
  reportsRef,
  addressesRef,
  bannersRef,
  feedbackRef,
} from './refs';

export const getReportRef = (id) => reportsRef().doc(id);

export const getAddressesForUser = (userId) =>
  addressesRef()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');
export const getAddressRef = (id) => addressesRef().doc(id);

export const getActiveBanners = (limit = 10) =>
  bannersRef()
    .where('isActive', '==', true)
    .orderBy('position', 'asc')
    .orderBy('priority', 'desc')
    .limit(limit);
export const getBannerRef = (id) => bannersRef().doc(id);

export const getFeedbackRef = (id) => feedbackRef().doc(id);
export const getFeedbackForUser = (userId, limit = 50) =>
  feedbackRef()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit);
