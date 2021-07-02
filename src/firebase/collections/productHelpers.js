/**
 * Product collection helpers.
 */
import {
  DEFAULT_PRODUCT_LOCATION,
  DEFAULT_PRODUCT_DELIVERY,
  DEFAULT_PRODUCT_WARRANTY,
  DEFAULT_PRODUCT_STATS,
} from '../schema';
import { productsRef } from './refs';
import { serverTimestamp } from './fieldValues';

export const getProductRef = (id) => productsRef().doc(id);

export const getProductsQuery = (opts = {}) => {
  let q = productsRef();
  if (opts.status) q = q.where('status', '==', opts.status);
  if (opts.category) q = q.where('category', '==', opts.category);
  if (opts.userId) q = q.where('userId', '==', opts.userId);
  if (opts.adType) q = q.where('adType', '==', opts.adType);
  if (opts.moderationStatus) q = q.where('moderationStatus', '==', opts.moderationStatus);
  if (opts.orderBy) {
    q = q.orderBy(opts.orderBy.field, opts.orderBy.direction || 'desc');
  } else {
    q = q.orderBy('createdAt', 'desc');
  }
  if (opts.limit) q = q.limit(opts.limit);
  if (opts.startAfter) q = q.startAfter(opts.startAfter);
  return q;
};

export function slugFromTitle(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function buildSearchKeywords(name, description = '', tags = []) {
  const text = [name, description, ...tags].filter(Boolean).join(' ').toLowerCase();
  const tokens = text
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
  return [...new Set(tokens)].slice(0, 50);
}

export function createProductDoc(data, seller = {}) {
  const name = (data.name || '').trim();
  const slug = slugFromTitle(name);
  const searchKeywords = buildSearchKeywords(
    name,
    data.description || '',
    data.tags || []
  );
  const now = serverTimestamp();
  return {
    name,
    slug: slug || `ad-${Date.now()}`,
    description: (data.description || '').trim(),
    category: data.category || '',
    subcategory: data.subcategory || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    price: typeof data.price === 'number' ? data.price : 0,
    originalPrice: data.originalPrice ?? null,
    discountPercentage: data.discountPercentage ?? null,
    priceCurrency: data.priceCurrency || 'INR',
    priceType: data.priceType || 'fixed',
    negotiable: Boolean(data.negotiable),
    adType: data.adType || 'for_sale',
    condition: data.condition || '',
    listedBy: data.listedBy || '',
    images: Array.isArray(data.images) ? data.images : [],
    thumbnailUrl: data.thumbnailUrl || (data.images && data.images[0]) || '',
    videoUrl: data.videoUrl || '',
    url: data.url || (data.images && data.images[0]) || '',
    userId: data.userId || '',
    sellerName: seller.name || '',
    sellerAvatar: seller.avatar || '',
    sellerVerified: Boolean(seller.verified),
    sellerBadgeLevel: seller.badgeLevel || 'new',
    contactPreference: data.contactPreference || 'both',
    location: data.location && typeof data.location === 'object'
      ? { ...DEFAULT_PRODUCT_LOCATION(), ...data.location }
      : DEFAULT_PRODUCT_LOCATION(),
    delivery: data.delivery && typeof data.delivery === 'object'
      ? { ...DEFAULT_PRODUCT_DELIVERY(), ...data.delivery }
      : DEFAULT_PRODUCT_DELIVERY(),
    warranty: data.warranty && typeof data.warranty === 'object'
      ? { ...DEFAULT_PRODUCT_WARRANTY(), ...data.warranty }
      : DEFAULT_PRODUCT_WARRANTY(),
    returnPolicy: data.returnPolicy || 'no_returns',
    paymentMethods: Array.isArray(data.paymentMethods) ? data.paymentMethods : [],
    extra: data.extra && typeof data.extra === 'object' ? data.extra : {},
    isFeatured: false,
    isUrgent: false,
    isPromoted: false,
    promotionPlan: 'none',
    promotionExpiry: null,
    featuredUntil: null,
    featuredRequestStatus: 'none',
    featuredRequestedAt: null,
    marketingScore: 0,
    bumpedAt: null,
    status: data.status || 'active',
    moderationStatus: data.moderationStatus || 'pending',
    moderationNote: '',
    rejectionReason: '',
    reportCount: 0,
    flaggedAt: null,
    stats: DEFAULT_PRODUCT_STATS(),
    watchers: {},
    seoTitle: data.seoTitle || name,
    seoDescription: data.seoDescription || (data.description || '').slice(0, 160),
    searchKeywords,
    availableFrom: data.availableFrom ?? null,
    expiresAt: data.expiresAt ?? null,
    autoRenew: Boolean(data.autoRenew),
    renewalCount: 0,
    lastRenewedAt: null,
    publishedAt: data.status === 'active' ? now : null,
    soldAt: null,
    soldTo: '',
    soldPrice: null,
    draftSavedAt: data.status === 'draft' ? now : null,
    createdAt: now,
    updatedAt: now,
  };
}
