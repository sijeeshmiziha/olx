/**
 * Display formatters
 */

export function formatPrice(price) {
  if (price === undefined || price === null) return '—';
  const n = Number(price);
  if (isNaN(n)) return String(price);
  return '₹ ' + n.toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Relative date for cards: "Today", "Yesterday", "Jan 15"
 */
export function formatRelativeDate(dateInput) {
  if (!dateInput) return '';
  const d =
    dateInput && typeof dateInput.toDate === 'function'
      ? dateInput.toDate()
      : new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dateOnly.getTime() === today.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatPhone(phone) {
  if (!phone) return '';
  const s = String(phone).replace(/\D/g, '');
  if (s.length >= 10) return s.slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2');
  return String(phone);
}

export function maskPhone(phone) {
  if (!phone) return '';
  const s = String(phone).replace(/\D/g, '');
  if (s.length >= 10) {
    const last10 = s.slice(-10);
    return last10.slice(0, 6) + ' ****';
  }
  if (s.length > 4) return s.slice(0, -4) + ' ****';
  return '****';
}

/** One day in ms */
const MS_PER_DAY = 86400000;

/**
 * Chat/conversation timestamp: "3:45 PM", "Yesterday", or "Jan 15"
 * @param {object|Date} ts - Firestore timestamp { seconds } or Date
 */
export function formatChatDate(ts) {
  if (!ts) return '';
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < MS_PER_DAY) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < MS_PER_DAY * 2) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Short "time ago" for lists: "Today", "Yesterday", or "Jan 15"
 * @param {object|Date} dateInput - Firestore timestamp or Date
 */
export function formatTimeAgo(dateInput) {
  return formatRelativeDate(dateInput);
}
