/**
 * Form validation helpers
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Enter a valid email address';
  return null;
}

export function validatePassword(password, options = {}) {
  const { minLength = 8, requireLength = true, requireStrength = true } = options;
  if (!password || typeof password !== 'string') return 'Password is required';
  if (requireLength && password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  if (requireStrength) {
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
    if (!/\d/.test(password)) return 'Password must include at least one number';
  }
  return null;
}

export function validateRequired(value, fieldName = 'This field') {
  if (value === undefined || value === null) return `${fieldName} is required`;
  if (typeof value === 'string' && !value.trim())
    return `${fieldName} is required`;
  return null;
}

export function validatePhone(phone) {
  if (!phone && phone !== 0) return null;
  const s = String(phone).replace(/\D/g, '');
  if (s.length < 10) return 'Enter a valid 10-digit phone number';
  return null;
}

export function validateAdTitle(title) {
  if (!title || typeof title !== 'string') return 'Title is required';
  const t = title.trim();
  if (t.length < 3) return 'Title must be at least 3 characters';
  if (t.length > 70) return 'Title must be 70 characters or less';
  return null;
}

export function validateAdDescription(description) {
  if (!description || typeof description !== 'string')
    return 'Description is required';
  const d = description.trim();
  if (d.length < 10) return 'Description must be at least 10 characters';
  if (d.length > 4000) return 'Description must be 4000 characters or less';
  return null;
}

export function validatePrice(price) {
  if (price === undefined || price === null || price === '')
    return 'Price is required';
  const n = Number(price);
  if (isNaN(n)) return 'Enter a valid number';
  if (n < 0) return 'Price cannot be negative';
  return null;
}
