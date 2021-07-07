/**
 * Category-specific fields: Properties, Electronics & Appliances, Mobiles.
 */
const currentYear = new Date().getFullYear();

export const propertyElectronicsFields = {
  Properties: [
    { key: 'listingType', label: 'Listing type *', type: 'select', options: ['For Sale', 'For Rent'], required: true },
    { key: 'propertyType', label: 'Property type *', type: 'select', options: ['Apartments', 'Builder Floors', 'Farm Houses', 'Houses & Villas', 'Lands & Plots', 'Shops & Offices', 'PG & Guest Houses'], required: true },
    { key: 'bedrooms', label: 'Bedrooms *', type: 'select', options: ['1', '2', '3', '4', '4+'], required: true },
    { key: 'bathrooms', label: 'Bathrooms *', type: 'select', options: ['1', '2', '3', '4', '4+'], required: true },
    { key: 'furnishing', label: 'Furnishing *', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'], required: true },
    { key: 'constructionStatus', label: 'Construction status', type: 'select', options: ['New Launch', 'Ready to Move', 'Under Construction'] },
    { key: 'listedBy', label: 'Listed by *', type: 'select', options: ['Owner', 'Builder', 'Dealer'], required: true },
    { key: 'superBuiltupArea', label: 'Super built-up area (sq ft)', type: 'number', min: 0, placeholder: 'Super built-up area' },
    { key: 'carpetArea', label: 'Carpet area (sq ft)', type: 'number', min: 0, placeholder: 'Carpet area' },
    { key: 'maintenance', label: 'Maintenance (monthly ₹)', type: 'number', min: 0, placeholder: 'Monthly maintenance' },
    { key: 'totalFloors', label: 'Total floors', type: 'number', min: 0, max: 100 },
    { key: 'floorNo', label: 'Floor no.', type: 'text', placeholder: 'e.g. Ground, 3, Penthouse' },
    { key: 'carParking', label: 'Car parking', type: 'select', options: ['0', '1', '2', '3', '3+'] },
    { key: 'facing', label: 'Facing', type: 'select', options: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'] },
    { key: 'projectName', label: 'Project name', type: 'text', placeholder: 'e.g. DLF Garden City' },
    { key: 'bachelorsAllowed', label: 'Bachelors allowed', type: 'select', options: ['Yes', 'No'] },
  ],
  'Electronics & Appliances': [
    { key: 'type', label: 'Type *', type: 'select', options: ['TV', 'Fridge', 'Washing Machine', 'AC', 'Computer', 'Laptop', 'Camera', 'Kitchen Appliance', 'Audio System', 'Gaming Console', 'Other'], required: true },
    { key: 'brand', label: 'Brand *', type: 'text', placeholder: 'e.g. Samsung, LG, Sony', required: true },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'Model name or number' },
    { key: 'purchaseYear', label: 'Year of purchase', type: 'number', min: 2000, max: currentYear },
    { key: 'warranty', label: 'Warranty status', type: 'select', options: ['Under warranty', 'Warranty expired', 'No warranty'] },
    { key: 'billAvailable', label: 'Bill available', type: 'select', options: ['Yes', 'No'] },
  ],
  Mobiles: [
    { key: 'brand', label: 'Brand *', type: 'text', placeholder: 'e.g. Apple, Samsung, OnePlus', required: true },
    { key: 'model', label: 'Model *', type: 'text', placeholder: 'e.g. iPhone 15, Galaxy S24', required: true },
    { key: 'ram', label: 'RAM (GB)', type: 'select', options: ['2', '3', '4', '6', '8', '12', '16'] },
    { key: 'storage', label: 'Internal storage (GB)', type: 'select', options: ['16', '32', '64', '128', '256', '512', '1 TB'] },
    { key: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Black, Blue, Gold' },
    { key: 'purchaseYear', label: 'Year of purchase', type: 'number', min: 2010, max: currentYear },
    { key: 'chargerIncluded', label: 'Charger included', type: 'select', options: ['Yes', 'No'] },
    { key: 'boxIncluded', label: 'Original box included', type: 'select', options: ['Yes', 'No'] },
    { key: 'billAvailable', label: 'Bill available', type: 'select', options: ['Yes', 'No'] },
    { key: 'warrantyRemaining', label: 'Warranty remaining', type: 'select', options: ['Yes', 'No', 'Not sure'] },
  ],
};
