export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'دولار أمريكي' },
  { code: 'SAR', symbol: 'ر.س', label: 'ريال سعودي' },
  { code: 'AED', symbol: 'د.إ', label: 'درهم إماراتي' }
];

// Internal package tiers for hotel classification, ordered from base to top
export const HOTEL_TIERS = [
  { value: 'silver', label: 'VIP سيلفر', order: 1 },
  { value: 'gold', label: 'VIP جولد', order: 2 },
  { value: 'platinum', label: 'VIP بلاتينيوم', order: 3 },
  { value: 'royal', label: 'VIP رويال', order: 4 }
];

export function getTierLabel(value) {
  return HOTEL_TIERS.find(t => t.value === value)?.label || value;
}

export const DAY_NAMES = [
  'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
  'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
  'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر'
];

export const INITIAL_TRIP_STATE = {
  badge: '✓ تأكيد فوري',
  country: '',
  cities: '',
  days: 5,
  nights: 4,
  currency: 'SAR',
  price: '',
  priceBefore: '',
  clientName: '',
  clientTitle: 'السيد',
  theme: 'light',
  offerDate: new Date().toISOString().split('T')[0],
  tripStartDate: '',
  tripEndDate: '',
  clientPhone: '',
  paxAdults: 2,
  paxChildren: 0,
  isHoneymoon: false,
  coverImage: '',
  wa: '+966 55 330 4883',
  email: 'info@weekendgo.com.sa',
  web: 'https://weekendgo.com.sa/',
  countryInfo: {
    description: '',
    capital: '',
    area: '',
    population: '',
    language: '',
    currencyName: '',
    government: '',
    climate: ''
  },
  includes: [
    { text: 'الاستقبال والتوديع في المطار', included: true },
    { text: 'الإقامة في فنادق 4 و 5 نجوم', included: true },
    { text: 'وجبة الإفطار يومياً', included: true },
    { text: 'الجولات السياحية بسيارة خاصة', included: true },
    { text: 'تذاكر الطيران الدولي', included: false }
  ],
  daysList: [],
  hotels: [],
  tiers: [],
  distances: [],
  flights: [],
  landmarks: [],
  restaurants: [],
  optionalTours: [],
  notes: {
    cancellation: [],
    hotels: [],
    tours: [],
    travelGulf: [],
    travelNonGulf: [],
    banking: []
  }
};
