export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'دولار أمريكي' },
  { code: 'SAR', symbol: 'ر.س', label: 'ريال سعودي' },
  { code: 'AED', symbol: 'د.إ', label: 'درهم إماراتي' }
];

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
  coverImage: '',
  wa: '',
  email: '',
  web: '',
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
