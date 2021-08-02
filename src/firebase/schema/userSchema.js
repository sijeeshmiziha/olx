/**
 * User-related Firestore schemas and default factories.
 * @module firebase/schema/userSchema
 */

/**
 * @typedef {Object} UserLocation
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
 * @typedef {Object} UserBusinessInfo
 * @property {'individual'|'dealer'|'business'} type
 * @property {string} companyName
 * @property {string} gstNumber
 * @property {string} panNumber
 * @property {string} shopAddress
 * @property {string} businessHours
 * @property {number|null} establishedYear
 */

/**
 * @typedef {Object} UserSocialLinks
 * @property {string} facebook
 * @property {string} instagram
 * @property {string} twitter
 * @property {string} linkedin
 * @property {string} youtube
 */

/**
 * @typedef {Object} UserPrivacySettings
 * @property {boolean} showPhone
 * @property {boolean} showEmail
 * @property {boolean} showLocation
 * @property {boolean} showOnlineStatus
 * @property {boolean} showLastSeen
 * @property {'everyone'|'verified_only'|'nobody'} allowMessages
 */

/**
 * @typedef {Object} UserWatchlistEntry
 * @property {string} productId
 * @property {number} alertPrice
 * @property {number} addedAt
 */

/**
 * @typedef {Object} UserDoc
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} alternatePhone
 * @property {FirebaseFirestore.Timestamp|null} dateOfBirth
 * @property {string} gender
 * @property {string} avatar
 * @property {string} coverPhoto
 * @property {string} about
 * @property {string} languages
 * @property {string} website
 * @property {UserLocation} location
 * @property {UserBusinessInfo} businessInfo
 * @property {UserSocialLinks} socialLinks
 * @property {boolean} verified
 * @property {boolean} emailVerified
 * @property {boolean} phoneVerified
 * @property {boolean} idVerified
 * @property {boolean} addressVerified
 * @property {'not_started'|'pending'|'verified'|'rejected'} kycStatus
 * @property {number} trustScore
 * @property {'new'|'bronze'|'silver'|'gold'|'platinum'} badgeLevel
 * @property {number} ratingSum
 * @property {number} ratingCount
 * @property {number} responseRate
 * @property {string} responseTime
 * @property {number} totalAdsPosted
 * @property {number} totalAdsSold
 * @property {number} totalActiveAds
 * @property {number} followersCount
 * @property {number} followingCount
 * @property {'active'|'suspended'|'banned'|'deactivated'} accountStatus
 * @property {'user'|'admin'|'moderator'} role
 * @property {boolean} isOnline
 * @property {FirebaseFirestore.Timestamp|null} lastSeen
 * @property {boolean} premiumMember
 * @property {FirebaseFirestore.Timestamp|null} premiumExpiry
 * @property {string} referralCode
 * @property {string} referredBy
 * @property {string} preferredLanguage
 * @property {string} currency
 * @property {UserPrivacySettings} privacySettings
 * @property {string[]} savedAds
 * @property {UserWatchlistEntry[]} watchlist
 * @property {FirebaseFirestore.Timestamp|null} memberSince
 * @property {FirebaseFirestore.Timestamp|null} updatedAt
 */

export const DEFAULT_USER_LOCATION = () => ({
  state: '',
  city: '',
  area: '',
  pincode: '',
  landmark: '',
  address: '',
  latitude: null,
  longitude: null,
});

export const DEFAULT_USER_BUSINESS_INFO = () => ({
  type: 'individual',
  companyName: '',
  gstNumber: '',
  panNumber: '',
  shopAddress: '',
  businessHours: '',
  establishedYear: null,
});

export const DEFAULT_USER_SOCIAL_LINKS = () => ({
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
});

export const DEFAULT_USER_PRIVACY_SETTINGS = () => ({
  showPhone: true,
  showEmail: false,
  showLocation: true,
  showOnlineStatus: true,
  showLastSeen: true,
  allowMessages: 'everyone',
});
