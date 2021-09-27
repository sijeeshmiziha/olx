/**
 * Admin/moderation Firestore schemas: Notification, Report, Category, Verification, ActivityLog.
 * @module firebase/schema/adminSchema
 */

/**
 * @typedef {Object} NotificationDoc
 * @property {string} userId
 * @property {string} type
 * @property {string} title
 * @property {string} body
 * @property {string} imageUrl
 * @property {string} actionUrl
 * @property {Object} data
 * @property {'low'|'normal'|'high'} priority
 * @property {string} groupId
 * @property {'in_app'|'push'|'email'|'sms'} channel
 * @property {string[]} sentVia
 * @property {boolean} read
 * @property {FirebaseFirestore.Timestamp|null} readAt
 * @property {FirebaseFirestore.Timestamp|null} clickedAt
 * @property {FirebaseFirestore.Timestamp|null} expiresAt
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */

/**
 * @typedef {Object} ReportDoc
 * @property {'ad'|'user'|'message'|'review'|'bug'} reportType
 * @property {string} targetId
 * @property {string} targetType
 * @property {string} reportedUserId
 * @property {string} reporterId
 * @property {string} reason
 * @property {string} description
 * @property {string[]} evidence
 * @property {'low'|'medium'|'high'|'critical'} priority
 * @property {'pending'|'in_review'|'resolved'|'dismissed'} status
 * @property {string} assignedTo
 * @property {string} resolution
 * @property {string} resolutionNote
 * @property {FirebaseFirestore.Timestamp|null} resolvedAt
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} updatedAt
 */

/**
 * @typedef {Object} CategoryDoc
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 * @property {string} image
 * @property {string} description
 * @property {string|null} parentId
 * @property {number} level
 * @property {string[]} children
 * @property {string[]} requiredFields
 * @property {number} order
 * @property {boolean} isActive
 * @property {boolean} isFeatured
 * @property {number} adCount
 * @property {string} seoTitle
 * @property {string} seoDescription
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} updatedAt
 */

/**
 * @typedef {Object} VerificationDoc
 * @property {string} userId
 * @property {string} userName
 * @property {string} userEmail
 * @property {string} reason
 * @property {string} idDocumentUrl
 * @property {'pending'|'approved'|'rejected'} status
 * @property {string} adminNote
 * @property {string} verificationType
 * @property {string} documentType
 * @property {string} documentNumber
 * @property {string} selfieUrl
 * @property {string[]} additionalDocuments
 * @property {FirebaseFirestore.Timestamp|null} verifiedAt
 * @property {FirebaseFirestore.Timestamp|null} expiresAt
 * @property {string} rejectionReason
 * @property {number} attempts
 * @property {FirebaseFirestore.Timestamp|null} lastAttemptAt
 * @property {string} reviewedBy
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 * @property {FirebaseFirestore.Timestamp|null} resolvedAt
 */

/**
 * @typedef {Object} ActivityLogDoc
 * @property {string} userId
 * @property {string} action
 * @property {string} targetType
 * @property {string} targetId
 * @property {Object} metadata
 * @property {string} ipAddress
 * @property {string} userAgent
 * @property {string} sessionId
 * @property {FirebaseFirestore.Timestamp|null} createdAt
 */
