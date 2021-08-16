/**
 * Conversation, Message, and Offer Firestore schemas.
 * @module firebase/schema/messagingSchema
 */

/**
 * @typedef {Object} ConversationDoc
 * @property {string[]} participants
 * @property {string} buyerId
 * @property {string} sellerId
 * @property {string} productId
 * @property {string} productName
 * @property {string} productImage
 * @property {number} productPrice
 * @property {string} productStatus
 * @property {'active'|'archived'|'blocked'|'deleted'} status
 * @property {string} lastMessage
 * @property {string} lastMessageSender
 * @property {'text'|'image'|'offer'|'system'} lastMessageType
 * @property {FirebaseFirestore.Timestamp|null} lastMessageAt
 * @property {Object.<string, boolean>} typing
 * @property {Object.<string, number>} unreadCount
 * @property {string[]} pinnedBy
 * @property {string[]} mutedBy
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} archivedAt
 */

/**
 * @typedef {Object} MessageLocation
 * @property {number|null} lat
 * @property {number|null} lng
 * @property {string} address
 */

/**
 * @typedef {Object} MessageReplyTo
 * @property {string} messageId
 * @property {string} text
 * @property {string} senderId
 */

/**
 * @typedef {Object} MessageDoc
 * @property {string} senderId
 * @property {'text'|'image'|'location'|'offer'|'system'|'quickReply'} type
 * @property {string} text
 * @property {string} imageUrl
 * @property {MessageLocation} location
 * @property {{ amount: number, status: string }} offerData
 * @property {MessageReplyTo} replyTo
 * @property {boolean} read
 * @property {FirebaseFirestore.Timestamp|null} readAt
 * @property {FirebaseFirestore.Timestamp|null} deliveredAt
 * @property {FirebaseFirestore.Timestamp|null} editedAt
 * @property {boolean} deleted
 * @property {FirebaseFirestore.Timestamp|null} deletedAt
 * @property {Object.<string, string[]>} reactions
 * @property {FirebaseFirestore.Timestamp|null} timestamp
 */

/**
 * @typedef {Object} OfferMeetingLocation
 * @property {number|null} lat
 * @property {number|null} lng
 * @property {string} address
 */

/**
 * @typedef {Object} OfferNegotiationEntry
 * @property {number} amount
 * @property {string} by
 * @property {FirebaseFirestore.Timestamp} timestamp
 * @property {string} message
 */

/**
 * @typedef {Object} OfferDoc
 * @property {string} productId
 * @property {string} productName
 * @property {string} productImage
 * @property {string} buyerId
 * @property {string} buyerName
 * @property {string} sellerId
 * @property {string} sellerName
 * @property {number} offerAmount
 * @property {number} originalPrice
 * @property {number|null} counterAmount
 * @property {number|null} finalPrice
 * @property {'pending'|'accepted'|'rejected'|'countered'|'expired'|'cancelled'} status
 * @property {string} message
 * @property {OfferNegotiationEntry[]} negotiationHistory
 * @property {string} paymentMethod
 * @property {string} deliveryPreference
 * @property {OfferMeetingLocation} meetingLocation
 * @property {FirebaseFirestore.Timestamp|null} meetingTime
 * @property {boolean} readByBuyer
 * @property {boolean} readBySeller
 * @property {boolean} autoExpired
 * @property {FirebaseFirestore.Timestamp|null} acceptedAt
 * @property {FirebaseFirestore.Timestamp|null} rejectedAt
 * @property {FirebaseFirestore.Timestamp|null} cancelledAt
 * @property {string} cancelReason
 * @property {FirebaseFirestore.Timestamp|null} expiresAt
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} updatedAt
 */
