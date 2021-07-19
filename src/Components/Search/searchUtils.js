/**
 * Parse a date value that can be a Firestore Timestamp, Date object, string, or number.
 * Returns epoch ms or null.
 */
export function parseDate(val) {
  if (!val) return null;
  // Firestore Timestamp (has .toDate())
  if (typeof val.toDate === 'function') {
    return val.toDate().getTime();
  }
  // Firestore Timestamp with .seconds (Timestamp-like plain object)
  if (typeof val.seconds === 'number') {
    return val.seconds * 1000;
  }
  // Already a Date
  if (val instanceof Date) {
    return Number.isNaN(val.getTime()) ? null : val.getTime();
  }
  // Number (epoch ms)
  if (typeof val === 'number') {
    return val;
  }
  // String
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export function filterAndSortProducts(products, filters, sort) {
  if (!products || !Array.isArray(products)) return [];

  let list = products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.subcategory && p.subcategory !== filters.subcategory) return false;
    const price = Number(p.price);
    if (!Number.isNaN(price)) {
      if (filters.minPrice !== null && filters.minPrice !== undefined && filters.minPrice !== '' && price < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== null && filters.maxPrice !== undefined && filters.maxPrice !== '' && price > Number(filters.maxPrice)) return false;
    }
    if (filters.state && (p.location?.state || '') !== filters.state) return false;
    if (filters.city && (p.location?.city || '') !== filters.city) return false;
    if (filters.condition && (p.condition || '') !== filters.condition) return false;
    if (filters.adType && (p.adType || 'for_sale') !== filters.adType) return false;
    if (filters.deliveryAvailable && p.delivery?.available !== true) return false;
    if (filters.warrantyAvailable && p.warranty?.available !== true) return false;
    if (filters.verifiedSeller && p.sellerVerified !== true) return false;
    if (filters.datePosted) {
      const created = parseDate(p.createdAt);
      if (!created) return true;
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      if (filters.datePosted === 'today' && now - created > day) return false;
      if (filters.datePosted === '7' && now - created > 7 * day) return false;
      if (filters.datePosted === '30' && now - created > 30 * day) return false;
    }
    return true;
  });

  const sortBy = sort || 'newest';
  if (sortBy === 'relevance') return list;
  list = [...list].sort((a, b) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);
    const dateA = parseDate(a.createdAt) || 0;
    const dateB = parseDate(b.createdAt) || 0;
    switch (sortBy) {
      case 'oldest': return dateA - dateB;
      case 'price_asc': return (Number.isNaN(priceA) ? 0 : priceA) - (Number.isNaN(priceB) ? 0 : priceB);
      case 'price_desc': return (Number.isNaN(priceB) ? 0 : priceB) - (Number.isNaN(priceA) ? 0 : priceA);
      default: return dateB - dateA;
    }
  });
  return list;
}
