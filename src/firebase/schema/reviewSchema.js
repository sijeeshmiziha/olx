/**
 * Review Firestore schemas.
 * @module firebase/schema/reviewSchema
 */

/**
 * @typedef {Object} ReviewRatings
 * @property {number} communication
 * @property {number} accuracy
 * @property {number} punctuality
 * @property {number} fairness
 */

/**
 * @typedef {Object} ReviewSellerResponse
 * @property {string} text
 * @property {FirebaseFirestore.Timestamp|null} respondedAt
 */

/**
 * @typedef {Object} ReviewDoc
 * @property {string} sellerId
 * @property {string} reviewerId
 * @property {string} reviewerName
 * @property {string} reviewerAvatar
 * @property {string} productId
 * @property {string} transactionId
 * @property {number} rating
 * @property {ReviewRatings} ratings
 * @property {string} comment
 * @property {string[]} images
 * @property {ReviewSellerResponse} sellerResponse
 * @property {number} helpfulCount
 * @property {number} reportCount
 * @property {boolean} verified
 * @property {'active'|'hidden'|'reported'} status
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */
