/**
 * Category-specific fields: Cars, Bikes, Commercial Vehicles & Spares.
 */
const currentYear = new Date().getFullYear();

export const vehicleFields = {
  Cars: [
    { key: 'brand', label: 'Brand *', type: 'text', placeholder: 'e.g. Maruti, Hyundai, Tata', required: true },
    { key: 'model', label: 'Model *', type: 'text', placeholder: 'e.g. Swift, i20, Nexon', required: true },
    { key: 'variant', label: 'Variant', type: 'text', placeholder: 'e.g. VXi, Asta, XZ+' },
    { key: 'year', label: 'Year *', type: 'number', min: 1990, max: currentYear + 1, required: true },
    { key: 'kmDriven', label: 'KM driven *', type: 'number', min: 0, placeholder: 'Odometer reading', required: true },
    { key: 'fuelType', label: 'Fuel type *', type: 'select', options: ['Petrol', 'Diesel', 'CNG & Hybrids', 'LPG', 'Electric'], required: true },
    { key: 'transmission', label: 'Transmission *', type: 'select', options: ['Manual', 'Automatic'], required: true },
    { key: 'owners', label: 'No. of owners *', type: 'select', options: ['1st', '2nd', '3rd', '4th', '4+'], required: true },
    { key: 'bodyType', label: 'Body type', type: 'select', options: ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Minivan', 'Pickup Truck', 'Wagon'] },
    { key: 'color', label: 'Color', type: 'select', options: ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Brown', 'Gold', 'Green', 'Orange', 'Maroon', 'Beige', 'Yellow', 'Other'] },
    { key: 'insuranceValidity', label: 'Insurance validity', type: 'select', options: ['Comprehensive', 'Third Party', 'Zero Dep', 'Expired', 'Not Available'] },
    { key: 'registrationState', label: 'Registration state (RTO)', type: 'text', placeholder: 'e.g. KA, MH, DL' },
  ],
  Bikes: [
    { key: 'brand', label: 'Brand *', type: 'text', placeholder: 'e.g. Honda, Hero, Royal Enfield', required: true },
    { key: 'model', label: 'Model *', type: 'text', placeholder: 'e.g. Activa, Splendor, Classic 350', required: true },
    { key: 'year', label: 'Year *', type: 'number', min: 1990, max: currentYear + 1, required: true },
    { key: 'kmDriven', label: 'KM driven *', type: 'number', min: 0, placeholder: 'Odometer reading', required: true },
    { key: 'fuelType', label: 'Fuel type', type: 'select', options: ['Petrol', 'Electric'] },
    { key: 'owners', label: 'No. of owners', type: 'select', options: ['1st', '2nd', '3rd', '4th', '4+'] },
    { key: 'color', label: 'Color', type: 'select', options: ['Black', 'White', 'Red', 'Blue', 'Grey', 'Silver', 'Green', 'Orange', 'Yellow', 'Brown', 'Other'] },
  ],
  'Commercial Vehicles & Spares': [
    { key: 'vehicleType', label: 'Vehicle type *', type: 'select', options: ['Bus', 'Truck', 'Tempo / Tata Ace', 'Auto Rickshaw', 'Tractor', 'Crane', 'Earthmover', 'Construction Vehicle', 'Spare Parts', 'Other'], required: true },
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Tata, Ashok Leyland, Mahindra' },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'Model name' },
    { key: 'year', label: 'Year', type: 'number', min: 1980, max: currentYear + 1 },
    { key: 'kmDriven', label: 'KM driven', type: 'number', min: 0, placeholder: 'Odometer reading' },
    { key: 'fuelType', label: 'Fuel type', type: 'select', options: ['Diesel', 'Petrol', 'CNG', 'Electric'] },
    { key: 'owners', label: 'No. of owners', type: 'select', options: ['1st', '2nd', '3rd', '4+'] },
    { key: 'loadCapacity', label: 'Load capacity (tons)', type: 'text', placeholder: 'e.g. 5, 10, 16' },
  ],
};
