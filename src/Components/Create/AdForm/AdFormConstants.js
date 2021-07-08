export const LISTED_BY_OPTIONS = ['Individual', 'Dealer', 'Business / Company'];

export const AD_TYPE_OPTIONS = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
  { value: 'wanted', label: 'Wanted' },
  { value: 'exchange', label: 'Exchange' },
  { value: 'free', label: 'Free' },
];

export const PRICE_TYPE_OPTIONS = [
  { value: 'fixed', label: 'Fixed price' },
  { value: 'negotiable', label: 'Negotiable' },
  { value: 'free', label: 'Free' },
  { value: 'contact', label: 'Contact for price' },
];

export const RETURN_POLICY_OPTIONS = [
  { value: 'no_returns', label: 'No returns' },
  { value: '7_days', label: '7 days return' },
  { value: '15_days', label: '15 days return' },
  { value: '30_days', label: '30 days return' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '₹' },
  { value: 'upi', label: 'UPI', icon: null },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: null },
  { value: 'emi', label: 'EMI', icon: null },
];

export const CONTACT_PREFERENCE_OPTIONS = [
  { value: 'chat', label: 'Chat only' },
  { value: 'phone', label: 'Phone only' },
  { value: 'both', label: 'Chat & Phone' },
];
