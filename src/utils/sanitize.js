/**
 * Sanitize user-controlled strings for safe use in JSON-LD, meta tags, and other
 * script/markup contexts to prevent script injection or tag breakout.
 */

/**
 * Breaks up </script> so it cannot close a script tag when embedded in HTML.
 * Trims length to reduce risk and trims control characters.
 * @param {string} str - Raw user input
 * @param {number} maxLength - Max length (default 500)
 * @returns {string}
 */
export function sanitizeForJsonLd(str, maxLength = 500) {
  if (str == null) return '';
  let s = String(str)
    .replace(/<\/script/gi, ' ')
    .replace(/\r\n|\r|\n/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim();
  if (maxLength > 0 && s.length > maxLength) s = s.slice(0, maxLength);
  return s;
}
