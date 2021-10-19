/**
 * Cross-cutting constants. Component-specific constants stay in their module.
 */

/** Verification request cooldown in days (e.g. EditProfile) */
export const COOLDOWN_DAYS = 30;

/** Milliseconds per day */
export const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Max avatar upload size in bytes (5MB) */
export const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Avatar crop output size in px */
export const AVATAR_CROP_SIZE = 400;

/** Typing indicator debounce in ms (ChatInput) */
export const TYPING_DEBOUNCE_MS = 500;

/** Number of quick menu categories on home */
export const QUICK_MENU_COUNT = 8;
