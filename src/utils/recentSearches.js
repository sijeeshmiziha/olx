const STORAGE_PREFIX = 'olx_recent_searches';
const MAX_RECENT = 10;

function storageKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
}

export function getRecentSearches(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX_RECENT) : [];
  } catch (_) {
    return [];
  }
}

export function addRecentSearch(query, userId) {
  const trimmed = typeof query === 'string' ? query.trim() : '';
  if (!trimmed) return;
  const key = storageKey(userId);
  const recent = getRecentSearches(userId).filter((q) => q !== trimmed);
  recent.unshift(trimmed);
  try {
    localStorage.setItem(key, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch (_) {}
}

export function clearRecentSearches(userId) {
  try {
    localStorage.removeItem(storageKey(userId));
  } catch (_) {}
}
