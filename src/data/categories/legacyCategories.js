/**
 * Legacy categories for backward compatibility with existing Firestore data (order 16–24).
 */
export const legacyCategories = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: 'car',
    subcategories: ['Cars', 'Motorcycles', 'Bicycles', 'Spare Parts'],
    order: 16,
  },
  {
    id: 'property',
    name: 'Property',
    icon: 'house',
    subcategories: ['Houses - For Sale', 'Apartments - For Sale', 'For Rent'],
    order: 17,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'electronics',
    subcategories: [
      'Computers',
      'Laptops',
      'TVs',
      'Cameras & Lenses',
      'Gaming',
    ],
    order: 18,
  },
  {
    id: 'mobile-phones',
    name: 'Mobile Phones',
    icon: 'mobile',
    subcategories: [],
    order: 19,
  },
  {
    id: 'motorcycles',
    name: 'Motorcycles',
    icon: 'motorcycle',
    subcategories: [],
    order: 20,
  },
  {
    id: 'tablets',
    name: 'Tablets',
    icon: 'mobile',
    subcategories: [],
    order: 21,
  },
  {
    id: 'cameras',
    name: 'Cameras & Lenses',
    icon: 'electronics',
    subcategories: [],
    order: 22,
  },
  {
    id: 'computers',
    name: 'Computers & Laptops',
    icon: 'electronics',
    subcategories: [],
    order: 23,
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icon: 'house',
    subcategories: ['Furniture', 'Appliances', 'Decor'],
    order: 24,
  },
];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
