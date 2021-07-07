/**
 * Category-specific ad form fields. Aggregates vehicle, property/electronics, and general fields.
 */
import { vehicleFields } from './vehicleFields';
import { propertyElectronicsFields } from './propertyElectronicsFields';
import { generalFields } from './generalFields';

export const CATEGORY_FIELDS = {
  ...vehicleFields,
  ...propertyElectronicsFields,
  ...generalFields,
};

/**
 * Get extra form fields for a category (by name).
 */
export function getCategoryFields(categoryName) {
  if (!categoryName) return [];
  return CATEGORY_FIELDS[categoryName] || [];
}

/**
 * Default values for category-specific fields (so they're included in form state).
 */
export function getDefaultCategoryFields(categoryName) {
  const fields = getCategoryFields(categoryName);
  const defaults = {};
  fields.forEach((f) => {
    if (f.type === 'checkbox') defaults[f.key] = false;
    else defaults[f.key] = '';
  });
  return defaults;
}
