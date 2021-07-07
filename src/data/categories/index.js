/**
 * Categories matching OLX India. Main + legacy for backward compatibility.
 */
import { mainCategories } from './mainCategories';
import { legacyCategories, CONDITIONS } from './legacyCategories';

export const CATEGORIES = [...mainCategories, ...legacyCategories];

export { CONDITIONS };

export const getCategoriesSorted = () =>
  [...CATEGORIES].sort((a, b) => a.order - b.order);

export const getCategoriesForHome = () =>
  getCategoriesSorted().filter((c) => c.order >= 1 && c.order <= 15);

export const getAllCategoryNames = () => CATEGORIES.map((c) => c.name);

export const getSubcategories = (categoryName) => {
  const cat = CATEGORIES.find(
    (c) => c.name.toLowerCase() === (categoryName || '').toLowerCase()
  );
  return cat?.subcategories ?? [];
};
