/**
 * Product-related Firestore schemas and default factories.
 * @module firebase/schema/productSchema
 */

/**
 * @typedef {Object} ProductLocation
 * @property {string} state
 * @property {string} city
 * @property {string} area
 * @property {string} pincode
 * @property {string} landmark
 * @property {string} address
 * @property {number|null} latitude
 * @property {number|null} longitude
 */

/**
 * @typedef {Object} ProductDelivery
 * @property {boolean} available
 * @property {'pickup'|'delivery'|'both'} type
 * @property {number} shippingCost
 * @property {number|null} freeDeliveryAbove
 * @property {string} estimatedDays
 */

/**
 * @typedef {Object} ProductWarranty
 * @property {boolean} available
 * @property {string} type
 * @property {FirebaseFirestore.Timestamp|null} expiresAt
 * @property {string} description
 */

/**
 * @typedef {Object} ProductStats
 * @property {number} views
 * @property {number} impressions
 * @property {number} clicks
 * @property {number} favorites
 * @property {number} shares
 * @property {number} inquiries
 * @property {number} callClicks
 * @property {number} watchlistCount
 */

/**
 * @typedef {Object} ProductDoc
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} category
 * @property {string} subcategory
 * @property {string[]} tags
 * @property {number} price
 * @property {number|null} originalPrice
 * @property {number|null} discountPercentage
 * @property {string} priceCurrency
 * @property {'fixed'|'negotiable'|'free'|'contact'|'auction'} priceType
 * @property {boolean} negotiable
 * @property {'for_sale'|'for_rent'|'wanted'|'exchange'|'free'} adType
 * @property {string} condition
 * @property {string} listedBy
 * @property {string[]} images
 * @property {string} thumbnailUrl
 * @property {string} videoUrl
 * @property {string} url
 * @property {string} userId
 * @property {string} sellerName
 * @property {string} sellerAvatar
 * @property {boolean} sellerVerified
 * @property {string} sellerBadgeLevel
 * @property {'chat'|'phone'|'both'} contactPreference
 * @property {ProductLocation} location
 * @property {ProductDelivery} delivery
 * @property {ProductWarranty} warranty
 * @property {'no_returns'|'7_days'|'15_days'|'30_days'} returnPolicy
 * @property {string[]} paymentMethods
 * @property {Object} extra
 * @property {boolean} isFeatured
 * @property {boolean} isUrgent
 * @property {boolean} isPromoted
 * @property {'none'|'featured'|'urgent'|'top'|'spotlight'} promotionPlan
 * @property {FirebaseFirestore.Timestamp|null} promotionExpiry
 * @property {FirebaseFirestore.Timestamp|null} featuredUntil
 * @property {number} marketingScore
 * @property {FirebaseFirestore.Timestamp|null} bumpedAt
 * @property {'active'|'draft'|'sold'|'expired'|'removed'} status
 * @property {'pending'|'approved'|'rejected'|'flagged'} moderationStatus
 * @property {string} moderationNote
 * @property {string} rejectionReason
 * @property {number} reportCount
 * @property {FirebaseFirestore.Timestamp|null} flaggedAt
 * @property {ProductStats} stats
 * @property {Object.<string, number>} watchers
 * @property {string} seoTitle
 * @property {string} seoDescription
 * @property {string[]} searchKeywords
 * @property {FirebaseFirestore.Timestamp|null} availableFrom
 * @property {FirebaseFirestore.Timestamp|null} expiresAt
 * @property {boolean} autoRenew
 * @property {number} renewalCount
 * @property {FirebaseFirestore.Timestamp|null} lastRenewedAt
 * @property {FirebaseFirestore.Timestamp|null} publishedAt
 * @property {FirebaseFirestore.Timestamp|null} soldAt
 * @property {string} soldTo
 * @property {number|null} soldPrice
 * @property {FirebaseFirestore.Timestamp|null} draftSavedAt
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} updatedAt
 */

export const DEFAULT_PRODUCT_LOCATION = () => ({
  state: '',
  city: '',
  area: '',
  pincode: '',
  landmark: '',
  address: '',
  latitude: null,
  longitude: null,
});

export const DEFAULT_PRODUCT_DELIVERY = () => ({
  available: false,
  type: 'pickup',
  shippingCost: 0,
  freeDeliveryAbove: null,
  estimatedDays: '',
});

export const DEFAULT_PRODUCT_WARRANTY = () => ({
  available: false,
  type: '',
  expiresAt: null,
  description: '',
});

export const DEFAULT_PRODUCT_STATS = () => ({
  views: 0,
  impressions: 0,
  clicks: 0,
  favorites: 0,
  shares: 0,
  inquiries: 0,
  callClicks: 0,
  watchlistCount: 0,
});
