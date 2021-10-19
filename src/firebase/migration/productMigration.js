/**
 * Product document migration helpers.
 */
import {
  DEFAULT_PRODUCT_LOCATION,
  DEFAULT_PRODUCT_DELIVERY,
  DEFAULT_PRODUCT_WARRANTY,
  DEFAULT_PRODUCT_STATS,
} from '../schema';
import { slugFromTitle, buildSearchKeywords } from '../collections';
import { mergeMissing } from './mergeMissing';
import { PRODUCT_DEFAULTS } from './defaults';

/**
 * Merge a product document with default values for any missing fields.
 * Ensures slug and searchKeywords exist (generated from name/description/tags if missing).
 */
export function migrateProductDoc(doc) {
  const id = doc.id;
  const data = typeof doc.data === 'function' ? doc.data() : doc.data || {};
  const merged = mergeMissing(data, PRODUCT_DEFAULTS);
  if (merged.location && typeof merged.location === 'object') {
    merged.location = { ...DEFAULT_PRODUCT_LOCATION(), ...merged.location };
  }
  if (merged.delivery && typeof merged.delivery === 'object') {
    merged.delivery = { ...DEFAULT_PRODUCT_DELIVERY(), ...merged.delivery };
  }
  if (merged.warranty && typeof merged.warranty === 'object') {
    merged.warranty = { ...DEFAULT_PRODUCT_WARRANTY(), ...merged.warranty };
  }
  if (merged.stats && typeof merged.stats === 'object') {
    merged.stats = { ...DEFAULT_PRODUCT_STATS(), ...merged.stats };
  }
  if (!merged.slug && merged.name) {
    merged.slug = slugFromTitle(merged.name) || `ad-${id}`;
  }
  if (!merged.searchKeywords || !Array.isArray(merged.searchKeywords) || merged.searchKeywords.length === 0) {
    merged.searchKeywords = buildSearchKeywords(
      merged.name || '',
      merged.description || '',
      merged.tags || []
    );
  }
  if (!merged.thumbnailUrl && merged.images && merged.images[0]) {
    merged.thumbnailUrl = merged.images[0];
  }
  return { id, ...merged };
}

