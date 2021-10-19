/**
 * Misc Firestore schemas and DEFAULT_SAVED_SEARCH_FILTERS.
 * @module firebase/schema/miscSchema
 */

/**
 * @typedef {Object} SavedSearchFilters
 * @property {string} query
 * @property {string} category
 * @property {string} subcategory
 * @property {number|null} minPrice
 * @property {number|null} maxPrice
 * @property {string} state
 * @property {string} city
 * @property {string} condition
 * @property {string} datePosted
 * @property {string} adType
 * @property {string} sortBy
 * @property {string} brand
 * @property {string} model
 * @property {number|null} year
 */

/**
 * @typedef {Object} SavedSearchDoc
 * @property {string} userId
 * @property {string} name
 * @property {SavedSearchFilters} filters
 * @property {boolean} notifyOnNew
 * @property {'instant'|'daily'|'weekly'} frequency
 * @property {boolean} isActive
 * @property {number} resultCount
 * @property {number} matchCount
 * @property {FirebaseFirestore.Timestamp|null} lastNotified
 * @property {FirebaseFirestore.Timestamp|null} lastCheckedAt
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} BlockedUserDoc
 * @property {string} blockerId
 * @property {string} blockedId
 * @property {string} reason
 * @property {string} reportId
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} PriceHistoryDoc
 * @property {string} productId
 * @property {number} price
 * @property {number} previousPrice
 * @property {string} changedBy
 * @property {string} changeReason
 * @property {FirebaseFirestore.Timestamp|null} changedAt
 */

/**
 * @typedef {Object} AdPromotionDoc
 * @property {string} productId
 * @property {string} userId
 * @property {'featured'|'urgent'|'top'} plan
 * @property {string} planName
 * @property {number} price
 * @property {string} paymentId
 * @property {number} impressions
 * @property {number} clicks
 * @property {string} position
 * @property {boolean} autoRenew
 * @property {FirebaseFirestore.Timestamp|null} cancelledAt
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} status
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} UserPreferencesDoc
 * @property {string} userId
 * @property {Object} notificationSettings
 * @property {string} emailDigest
 * @property {number} searchRadius
 * @property {Object} defaultLocation
 * @property {boolean} autoPlayVideos
 * @property {boolean} chatSound
 * @property {boolean} pushNotifications
 * @property {boolean} emailNotifications
 * @property {boolean} smsNotifications
 * @property {boolean} marketingEmails
 * @property {Object} categoryPreferences
 * @property {boolean} safeMode
 * @property {Object} accessibility
 */

/**
 * @typedef {Object} TrendingSearchDoc
 * @property {string} query
 * @property {string} category
 * @property {string} location
 * @property {string} period
 * @property {number} searchCount
 * @property {number} trendScore
 * @property {boolean} isActive
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} TransactionDoc
 * @property {string} productId
 * @property {string} productName
 * @property {string} productImage
 * @property {string} buyerId
 * @property {string} buyerName
 * @property {string} sellerId
 * @property {string} sellerName
 * @property {string} offerId
 * @property {number} amount
 * @property {number} originalPrice
 * @property {string} paymentMethod
 * @property {string} paymentStatus
 * @property {string} paymentReference
 * @property {string} deliveryMethod
 * @property {string} deliveryStatus
 * @property {Object} deliveryAddress
 * @property {string} trackingId
 * @property {Object} meetingLocation
 * @property {FirebaseFirestore.Timestamp|null} meetingTime
 * @property {'initiated'|'in_progress'|'completed'|'cancelled'|'disputed'} status
 * @property {FirebaseFirestore.Timestamp|null} completedAt
 * @property {FirebaseFirestore.Timestamp|null} cancelledAt
 * @property {string} cancelReason
 * @property {boolean} buyerConfirmed
 * @property {boolean} sellerConfirmed
 * @property {string} reviewId
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} updatedAt
 */

/**
 * @typedef {Object} FollowerDoc
 * @property {string} followerId
 * @property {string} followingId
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} AddressDoc
 * @property {string} userId
 * @property {string} label
 * @property {string} fullAddress
 * @property {string} area
 * @property {string} city
 * @property {string} state
 * @property {string} pincode
 * @property {string} landmark
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {boolean} isDefault
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} BannerDoc
 * @property {string} title
 * @property {string} subtitle
 * @property {string} imageUrl
 * @property {string} linkUrl
 * @property {string} linkType
 * @property {string} position
 * @property {number} priority
 * @property {boolean} isActive
 * @property {string} startDate
 * @property {string} endDate
 * @property {Object} targetAudience
 * @property {number} clickCount
 * @property {number} impressionCount
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} FeedbackDoc
 * @property {string} userId
 * @property {string} type
 * @property {string} subject
 * @property {string} message
 * @property {string[]} screenshots
 * @property {number} rating
 * @property {string} appVersion
 * @property {string} deviceInfo
 * @property {string} status
 * @property {string} adminResponse
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} resolvedAt
 */

export const DEFAULT_SAVED_SEARCH_FILTERS = () => ({
  query: '',
  category: '',
  subcategory: '',
  minPrice: null,
  maxPrice: null,
  state: '',
  city: '',
  condition: '',
  datePosted: '',
  adType: '',
  sortBy: '',
  brand: '',
  model: '',
  year: null,
});
