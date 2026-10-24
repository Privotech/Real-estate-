export interface Property {
  id: string;
  title: string;
  category: 'for-sale' | 'for-rent' | 'short-let' | 'joint-venture';
  propertyType:
    | 'Detached Duplex'
    | 'Semi-Detached Duplex'
    | 'Terraced Duplex'
    | 'Flat / Apartment'
    | 'Luxury Penthouse'
    | 'Residential Land'
    | 'Commercial Land'
    | 'Office Space';
  priceNaira: number; // in NGN
  rentalPeriod?: 'per year' | 'per day' | 'per month';
  serviceChargeNaira?: number;
  state: 'Lagos' | 'Abuja (FCT)' | 'Rivers' | 'Oyo' | 'Ogun' | 'Delta';
  area: string; // e.g. "Lekki Phase 1", "Ikoyi", "Banana Island", "Maitama", "Wuse 2"
  address: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  parkingSpaces: number;
  landSizeSqm?: number;
  titleDocument:
    | 'Certificate of Occupancy (C of O)'
    | "Governor's Consent"
    | 'Government Gazette'
    | 'Deed of Assignment & Registered Survey'
    | 'Right of Occupancy (R of O)'
    | 'Federal C of O';
  isVerified: boolean;
  featured: boolean;
  description: string;
  images: string[];
  amenities: string[];
  agent: {
    name: string;
    agency: string;
    phone: string;
    whatsapp: string;
    verifiedAgent: boolean;
    rating: number;
    listingsCount: number;
  };
  postedDate: string;
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'npc-lekki-001',
    title: 'Luxury Contemporary 5 Bedroom Fully Detached Duplex with Swimming Pool & Cinema',
    category: 'for-sale',
    propertyType: 'Detached Duplex',
    priceNaira: 380000000,
    state: 'Lagos',
    area: 'Lekki Phase 1',
    address: 'Admiralty Way axis, Lekki Phase 1, Lagos',
    bedrooms: 5,
    bathrooms: 6,
    toilets: 6,
    parkingSpaces: 4,
    landSizeSqm: 600,
    titleDocument: "Governor's Consent",
    isVerified: true,
    featured: true,
    description:
      'Impeccably finished 5-bedroom contemporary duplex situated in a secure, serene gated close in Lekki Phase 1. Features high architectural ceilings, automated lighting, a private swimming pool, 7-seater private cinema room, fully fitted Italian kitchen with island, and 2-room staff quarters (BQ). 24/7 armed security patrol and industrial water treatment plant installed.',
    images: [
      '/images/hero_lekki_mansion_1792681047972.jpg',
      '/images/banana_island_terrace_1792681049395.jpg',
      '/images/ikoyi_waterfront_penthouse_1792681048808.jpg',
    ],
    amenities: [
      'Private Swimming Pool',
      '24/7 Electricity / Dual Generators',
      'Fitted Kitchen with Heat Extractor & Oven',
      'Private Cinema Room',
      '2-Room Boys Quarter (BQ)',
      'Smart Home Automation',
      'CCTV & Video Door Bell',
      'Industrial Water Treatment Plant',
      'Access Controlled Gated Estate',
    ],
    agent: {
      name: 'Adewale Babatunde',
      agency: 'Prestige Lekki Realty Partners',
      phone: '+234 803 456 7890',
      whatsapp: '2348034567890',
      verifiedAgent: true,
      rating: 4.9,
      listingsCount: 42,
    },
    postedDate: '2 days ago',
  },
  {
    id: 'npc-ikoyi-002',
    title: 'Ultra-Luxury 3 Bedroom Waterfront Penthouse overlooking Lagos Lagoon',
    category: 'for-sale',
    propertyType: 'Luxury Penthouse',
    priceNaira: 750000000,
    state: 'Lagos',
    area: 'Ikoyi',
    address: 'Bour Bourdillon Road / Waterfront, Old Ikoyi, Lagos',
    bedrooms: 3,
    bathrooms: 4,
    toilets: 4,
    parkingSpaces: 3,
    landSizeSqm: 420,
    titleDocument: 'Certificate of Occupancy (C of O)',
    isVerified: true,
    featured: true,
    description:
      'A masterpiece in high-rise waterfront living in prestigious Ikoyi. Boasts floor-to-ceiling double-glazed curtain walls offering panoramic sunsets across the lagoon. Features travertine marble flooring, private elevator access directly into the apartment, Poggenpohl kitchen with Miele appliances, Olympic-length shared pool, gym, concierge, and high-capacity central cooling.',
    images: [
      '/images/ikoyi_waterfront_penthouse_1792681048808.jpg',
      '/images/hero_lekki_mansion_1792681047972.jpg',
      '/images/banana_island_terrace_1792681049395.jpg',
    ],
    amenities: [
      'Lagoon Water View Terrace',
      'Private Keycard Elevator',
      '24/7 Uninterrupted Grid & Generator Power',
      'Fully Equipped Residents Gym',
      'Olympic Swimming Pool',
      'Concierge & Uniformed Security',
      'Miele Fitted Kitchen',
      '1-Room En-suite BQ',
      'Underground Car Parking',
    ],
    agent: {
      name: 'Chidinma Okonkwo',
      agency: 'Signature Prime Properties Ikoyi',
      phone: '+234 802 345 6789',
      whatsapp: '2348023456789',
      verifiedAgent: true,
      rating: 5.0,
      listingsCount: 38,
    },
    postedDate: 'Yesterday',
  },
  {
    id: 'npc-abuja-003',
    title: 'Palatial 5 Bedroom Ambassadorial Villa with Plunge Pool & Green Lawns',
    category: 'for-sale',
    propertyType: 'Detached Duplex',
    priceNaira: 550000000,
    state: 'Abuja (FCT)',
    area: 'Maitama',
    address: 'Off Gana Street, Maitama District, Abuja',
    bedrooms: 5,
    bathrooms: 6,
    toilets: 7,
    parkingSpaces: 6,
    landSizeSqm: 950,
    titleDocument: 'Federal C of O',
    isVerified: true,
    featured: true,
    description:
      'Distinguished ambassadorial style villa located on a calm boulevard in Maitama, Abuja. Architectural perfection with imported Turkish natural stone cladding, sprawling manicured green garden, private swimming pool, detached security lodge, expansive ante-room, double-volume living area, and independent borehole with backup filtration.',
    images: [
      '/images/abuja_maitama_villa_1792681049601.jpg',
      '/images/hero_lekki_mansion_1792681047972.jpg',
      '/images/banana_island_terrace_1792681049395.jpg',
    ],
    amenities: [
      'Private Swimming Pool & Gazebo',
      'Manicured Garden with Sprinklers',
      'Dedicated 60kVA Soundproof Generator',
      'Fully Fitted Gourmet Kitchen',
      '2 En-suite Maid Rooms',
      'Gate House & Security Post',
      'Automated Sliding Gate',
      'High Perimeter Wall with Electric Fence',
    ],
    agent: {
      name: 'Usman Danjuma',
      agency: 'Federal Capital Homes & Estates',
      phone: '+234 809 123 4567',
      whatsapp: '2348091234567',
      verifiedAgent: true,
      rating: 4.8,
      listingsCount: 51,
    },
    postedDate: '3 days ago',
  },
  {
    id: 'npc-banana-004',
    title: 'Exquisite 4 Bedroom Contemporary Terrace House with Private Elevator',
    category: 'for-sale',
    propertyType: 'Terraced Duplex',
    priceNaira: 420000000,
    state: 'Lagos',
    area: 'Banana Island',
    address: 'Zone G, Banana Island, Ikoyi, Lagos',
    bedrooms: 4,
    bathrooms: 5,
    toilets: 5,
    parkingSpaces: 3,
    landSizeSqm: 380,
    titleDocument: 'Federal C of O',
    isVerified: true,
    featured: true,
    description:
      'Situated in Nigeria’s most elite neighborhood, Banana Island. This 4-bedroom terrace offers top-level finishing, private Otis glass elevator, rooftop relaxation lounge with skyline views, custom chef kitchen, 1-room BQ, and dedicated 24/7 facility management with dual backup Caterpillar generators.',
    images: [
      '/images/banana_island_terrace_1792681049395.jpg',
      '/images/ikoyi_waterfront_penthouse_1792681048808.jpg',
      '/images/hero_lekki_mansion_1792681047972.jpg',
    ],
    amenities: [
      'In-House Private Glass Elevator',
      'Rooftop Terrace Lounge',
      '24/7 Banana Island Central Power',
      'Clubhouse & Tennis Court Access',
      'Fitted Wet & Dry Kitchens',
      '1-Room En-suite Maid Quarter',
      'Zero Flood Risk Paved Roads',
      'Armed Military & Police Island Gate Pass',
    ],
    agent: {
      name: 'Olumide Fashola',
      agency: 'Lagos Island Premier Estates',
      phone: '+234 814 789 0123',
      whatsapp: '2348147890123',
      verifiedAgent: true,
      rating: 4.9,
      listingsCount: 29,
    },
    postedDate: 'Just now',
  },
  {
    id: 'npc-lekki-rent-005',
    title: 'Fully Serviced 3 Bedroom Luxury Apartment with Gym & Swimming Pool',
    category: 'for-rent',
    propertyType: 'Flat / Apartment',
    priceNaira: 14000000,
    rentalPeriod: 'per year',
    serviceChargeNaira: 2500000,
    state: 'Lagos',
    area: 'Lekki Phase 1',
    address: 'Off Freedom Way, Lekki Phase 1, Lagos',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    parkingSpaces: 2,
    titleDocument: "Governor's Consent",
    isVerified: true,
    featured: false,
    description:
      'Tastefully finished 3-bedroom serviced flat in a well-managed residential block off Freedom Way. Comes with fitted AC units in all rooms, modern fitted kitchen with gas cooker and microwave, communal swimming pool, gymnasium, 24/7 steady generator backup electricity, and clean drinkable borehole water.',
    images: [
      '/images/ikoyi_waterfront_penthouse_1792681048808.jpg',
      '/images/banana_island_terrace_1792681049395.jpg',
    ],
    amenities: [
      '24-Hour Generator Light',
      'Fully Equipped Gym',
      'Swimming Pool',
      'Pre-installed Inverter & AC Units',
      'Fitted Kitchen',
      'Uniformed 24/7 Security Guards',
      'Dedicated Prepaid Meter',
    ],
    agent: {
      name: 'Blessing Effiong',
      agency: 'Havencrest Property Managers',
      phone: '+234 805 678 1234',
      whatsapp: '2348056781234',
      verifiedAgent: true,
      rating: 4.7,
      listingsCount: 19,
    },
    postedDate: '4 days ago',
  },
  {
    id: 'npc-shortlet-006',
    title: 'Exquisite 2 Bedroom Waterfront Short Let Apartment with Snooker & Netflix',
    category: 'short-let',
    propertyType: 'Flat / Apartment',
    priceNaira: 120000,
    rentalPeriod: 'per day',
    state: 'Lagos',
    area: 'Victoria Island (VI)',
    address: 'Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 3,
    parkingSpaces: 2,
    titleDocument: 'Certificate of Occupancy (C of O)',
    isVerified: true,
    featured: false,
    description:
      'Premium holiday or business short-stay apartment with five-star hospitality amenities. Features high-speed fiber optic WiFi, 65-inch 4K Smart TVs with active Netflix & DStv Premium, PS5 gaming console, pool snooker table, daily housekeeping, and 24/7 uninterrupted electricity.',
    images: [
      '/images/ikoyi_waterfront_penthouse_1792681048808.jpg',
      '/images/hero_lekki_mansion_1792681047972.jpg',
    ],
    amenities: [
      '24/7 Guaranteed Electricity',
      'Daily Professional Housekeeping',
      'Fiber Optic High-Speed WiFi',
      'PlayStation 5 & Snooker Board',
      'DStv Premium & Netflix',
      'Supermarket & Cafe downstairs',
      'Airport Pickup Available on Request',
    ],
    agent: {
      name: 'Tunde Adeleke',
      agency: 'Lagos Staycations & Shortlets',
      phone: '+234 818 901 2345',
      whatsapp: '2348189012345',
      verifiedAgent: true,
      rating: 4.9,
      listingsCount: 15,
    },
    postedDate: '5 days ago',
  },
  {
    id: 'npc-wuse-007',
    title: 'Brand New 4 Bedroom Semi-Detached Duplex with BQ in Secure Mini Estate',
    category: 'for-sale',
    propertyType: 'Semi-Detached Duplex',
    priceNaira: 280000000,
    state: 'Abuja (FCT)',
    area: 'Wuse 2',
    address: 'Adetokunbo Ademola Crescent axis, Wuse 2, Abuja',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    parkingSpaces: 3,
    landSizeSqm: 450,
    titleDocument: 'Certificate of Occupancy (C of O)',
    isVerified: true,
    featured: false,
    description:
      'Newly completed 4-bedroom semi-detached residence in a secure gated cul-de-sac in Wuse 2. Offers spacious family lounge, pop ceilings with recessed spotlights, walk-in closets, granite countertops, standby solar inverter, and en-suite domestic staff quarter.',
    images: [
      '/images/abuja_maitama_villa_1792681049601.jpg',
      '/images/banana_island_terrace_1792681049395.jpg',
    ],
    amenities: [
      '24/7 Solar Inverter Setup',
      'Fitted Kitchen Cabinets & Microwave',
      '1 Room Staff Quarters (BQ)',
      'Water Heaters in all Bathrooms',
      'Interlocked Compound',
      'Estate Security Gatehouse',
    ],
    agent: {
      name: 'Zainab Bello',
      agency: 'Apex Capital Realty Abuja',
      phone: '+234 803 789 4561',
      whatsapp: '2348037894561',
      verifiedAgent: true,
      rating: 4.8,
      listingsCount: 24,
    },
    postedDate: '1 week ago',
  },
  {
    id: 'npc-ph-008',
    title: 'Commercial / Residential Plot of Land (1,200 SQM) with Instant C of O',
    category: 'for-sale',
    propertyType: 'Residential Land',
    priceNaira: 160000000,
    state: 'Rivers',
    area: 'Old GRA',
    address: 'Tombia Street corridor, Old GRA, Port Harcourt',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    parkingSpaces: 0,
    landSizeSqm: 1200,
    titleDocument: 'Certificate of Occupancy (C of O)',
    isVerified: true,
    featured: false,
    description:
      'Prime dry solid table land measuring 1,200 sqm in the heart of Old GRA, Port Harcourt. Fully fenced and gated, with registered Certificate of Occupancy from Rivers State Ministry of Lands. Excellent for luxury residential apartments, boutique hotel, or corporate regional headquarters.',
    images: [
      '/images/hero_lekki_mansion_1792681047972.jpg',
      '/images/abuja_maitama_villa_1792681049601.jpg',
    ],
    amenities: [
      '100% Dry Table Land (No Sandfilling Required)',
      'Perimeter Concrete Wall & Gate',
      'Wide Tarred Access Road with Drainage',
      'Direct Title from Original Owner',
      'Immediate Physical Allocation',
    ],
    agent: {
      name: 'Ibifuro Briggs',
      agency: 'Garden City Realties Port Harcourt',
      phone: '+234 806 543 2109',
      whatsapp: '2348065432109',
      verifiedAgent: true,
      rating: 4.9,
      listingsCount: 31,
    },
    postedDate: '3 days ago',
  },
];

export const NIGERIAN_STATES = [
  'All States',
  'Lagos',
  'Abuja (FCT)',
  'Rivers',
  'Oyo',
  'Ogun',
  'Delta',
] as const;

export const POPULAR_LOCATIONS_BY_STATE: Record<string, string[]> = {
  Lagos: [
    'All Lagos',
    'Lekki Phase 1',
    'Ikoyi',
    'Victoria Island (VI)',
    'Banana Island',
    'Ikeja GRA',
    'Ajah',
    'Chevron Drive',
    'Magodo Phase 2',
    'Surulere',
  ],
  'Abuja (FCT)': [
    'All Abuja',
    'Maitama',
    'Asokoro',
    'Wuse 2',
    'Gwarinpa',
    'Jabi',
    'Guzape',
    'Katampe Extension',
  ],
  Rivers: ['All Rivers', 'Old GRA', 'Peter Odili Road', 'Trans-Amadi', 'Ada George'],
  Oyo: ['All Oyo', 'Bodija', 'Oluyole Estate', 'Jericho GRA', 'Alalubosa GRA'],
  Ogun: ['All Ogun', 'Arepo', 'Magboro', 'Mowe', 'Abeokuta GRA'],
  Delta: ['All Delta', 'Asaba GRA', 'Warri GRA', 'Effurun'],
};

export const PROPERTY_TYPES = [
  'All Types',
  'Detached Duplex',
  'Semi-Detached Duplex',
  'Terraced Duplex',
  'Flat / Apartment',
  'Luxury Penthouse',
  'Residential Land',
  'Commercial Land',
  'Office Space',
] as const;

export const TITLE_DOCUMENTS = [
  'All Titles',
  'Certificate of Occupancy (C of O)',
  "Governor's Consent",
  'Federal C of O',
  'Government Gazette',
  'Deed of Assignment & Registered Survey',
  'Right of Occupancy (R of O)',
] as const;

// Currency Formatter Helpers
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amountInNaira: number, exchangeRate = 1450): string {
  const usd = amountInNaira / exchangeRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd);
}

// Property Seeker Requests
export interface PropertyRequest {
  id: string;
  seekerName: string;
  purpose: 'Buy' | 'Rent' | 'Short Let' | 'Land';
  propertyType: string;
  preferredState: string;
  preferredArea: string;
  budgetNaira: number;
  bedrooms: number;
  requirements: string;
  postedDate: string;
  seekerPhone: string;
  seekerWhatsapp: string;
  status: 'Active' | 'Matched';
}

export const INITIAL_REQUESTS: PropertyRequest[] = [
  {
    id: 'req-001',
    seekerName: 'Dr. Funmi Williams',
    purpose: 'Rent',
    propertyType: 'Flat / Apartment',
    preferredState: 'Lagos',
    preferredArea: 'Lekki Phase 1',
    budgetNaira: 12000000,
    bedrooms: 3,
    requirements:
      'Looking for a fully serviced 3-bedroom flat off Admiralty or Freedom Way. Must have 24/7 generator electricity, lift, gym, and tight security.',
    postedDate: '1 hour ago',
    seekerPhone: '+234 802 333 4455',
    seekerWhatsapp: '2348023334455',
    status: 'Active',
  },
  {
    id: 'req-002',
    seekerName: 'Engr. Emeka Nwosu (UK Diaspora)',
    purpose: 'Buy',
    propertyType: 'Detached Duplex',
    preferredState: 'Lagos',
    preferredArea: 'Ikoyi / Banana Island',
    budgetNaira: 450000000,
    bedrooms: 4,
    requirements:
      'Buying for family relocation. Must possess Governor&apos;s Consent or Federal C of O. Dedicated swimming pool and 2-room BQ required.',
    postedDate: '3 hours ago',
    seekerPhone: '+234 813 999 8877',
    seekerWhatsapp: '2348139998877',
    status: 'Active',
  },
  {
    id: 'req-003',
    seekerName: 'Halima Al-Hassan',
    purpose: 'Buy',
    propertyType: 'Detached Duplex',
    preferredState: 'Abuja (FCT)',
    preferredArea: 'Maitama / Asokoro',
    budgetNaira: 600000000,
    bedrooms: 5,
    requirements:
      'Ambassadorial standard residence in Maitama with large compound space for at least 6 cars, private swimming pool, and standby solar/inverter.',
    postedDate: 'Yesterday',
    seekerPhone: '+234 809 444 1122',
    seekerWhatsapp: '2348094441122',
    status: 'Active',
  },
  {
    id: 'req-004',
    seekerName: 'Kelechi Opara',
    purpose: 'Land',
    propertyType: 'Commercial Land',
    preferredState: 'Rivers',
    preferredArea: 'Old GRA / Trans-Amadi',
    budgetNaira: 200000000,
    bedrooms: 0,
    requirements:
      'Commercial plot minimum 1,500 SQM for logistics hub or boutique office complex. Direct and verifiable Rivers State C of O mandatory.',
    postedDate: '2 days ago',
    seekerPhone: '+234 805 777 6655',
    seekerWhatsapp: '2348057776655',
    status: 'Active',
  },
];

// Neighborhood Price Trends
export interface NeighborhoodTrend {
  area: string;
  state: string;
  avgSalePriceNaira: number;
  avgRentAnnualNaira: number;
  rentalYieldPercent: number;
  priceGrowthYoY: number;
  avgLandPricePerSqm: number;
  demandLevel: 'Very High' | 'High' | 'Moderate';
  highlights: string;
}

export const NEIGHBORHOOD_TRENDS: NeighborhoodTrend[] = [
  {
    area: 'Lekki Phase 1',
    state: 'Lagos',
    avgSalePriceNaira: 360000000,
    avgRentAnnualNaira: 13500000,
    rentalYieldPercent: 7.8,
    priceGrowthYoY: 22.4,
    avgLandPricePerSqm: 480000,
    demandLevel: 'Very High',
    highlights: 'High rental demand from corporate executives and tech founders; vibrant commercial hub.',
  },
  {
    area: 'Ikoyi',
    state: 'Lagos',
    avgSalePriceNaira: 780000000,
    avgRentAnnualNaira: 28000000,
    rentalYieldPercent: 6.4,
    priceGrowthYoY: 18.2,
    avgLandPricePerSqm: 850000,
    demandLevel: 'High',
    highlights: 'Premier diplomatic and luxury high-net-worth enclave; high capital appreciation and stability.',
  },
  {
    area: 'Banana Island',
    state: 'Lagos',
    avgSalePriceNaira: 950000000,
    avgRentAnnualNaira: 35000000,
    rentalYieldPercent: 5.9,
    priceGrowthYoY: 19.5,
    avgLandPricePerSqm: 1100000,
    demandLevel: 'High',
    highlights: 'Nigeria&apos;s most exclusive gated island with world-class infrastructure and strict private security.',
  },
  {
    area: 'Victoria Island (VI)',
    state: 'Lagos',
    avgSalePriceNaira: 420000000,
    avgRentAnnualNaira: 16000000,
    rentalYieldPercent: 8.2,
    priceGrowthYoY: 20.1,
    avgLandPricePerSqm: 620000,
    demandLevel: 'Very High',
    highlights: 'Primary financial district with exceptional yields for short lets, executive suites, and penthouses.',
  },
  {
    area: 'Maitama',
    state: 'Abuja (FCT)',
    avgSalePriceNaira: 580000000,
    avgRentAnnualNaira: 22000000,
    rentalYieldPercent: 6.9,
    priceGrowthYoY: 24.3,
    avgLandPricePerSqm: 550000,
    demandLevel: 'Very High',
    highlights: 'Heart of the Federal Capital; houses embassies, federal ministries, and foreign missions.',
  },
  {
    area: 'Wuse 2',
    state: 'Abuja (FCT)',
    avgSalePriceNaira: 310000000,
    avgRentAnnualNaira: 14000000,
    rentalYieldPercent: 7.6,
    priceGrowthYoY: 21.0,
    avgLandPricePerSqm: 380000,
    demandLevel: 'High',
    highlights: 'Vibrant commercial and upscale residential neighborhood in Abuja with consistent tenant demand.',
  },
  {
    area: 'Old GRA',
    state: 'Rivers',
    avgSalePriceNaira: 240000000,
    avgRentAnnualNaira: 9500000,
    rentalYieldPercent: 7.3,
    priceGrowthYoY: 16.8,
    avgLandPricePerSqm: 220000,
    demandLevel: 'Moderate',
    highlights: 'Established elite quarter in Port Harcourt popular with multinational oil and gas executives.',
  },
];

// Verified Real Estate Agents Directory
export interface AgentProfile {
  id: string;
  name: string;
  agency: string;
  state: string;
  areasCovered: string[];
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  activeListingsCount: number;
  verified: boolean;
  specialization: string;
  experienceYears: number;
}

export const VERIFIED_AGENTS: AgentProfile[] = [
  {
    id: 'agent-01',
    name: 'Adewale Babatunde',
    agency: 'Prestige Lekki Realty Partners',
    state: 'Lagos',
    areasCovered: ['Lekki Phase 1', 'Chevron', 'Ikate', 'Osapa London'],
    phone: '+234 803 456 7890',
    whatsapp: '2348034567890',
    rating: 4.9,
    reviewsCount: 68,
    activeListingsCount: 42,
    verified: true,
    specialization: 'Luxury Duplexes & Off-Plan Developments',
    experienceYears: 12,
  },
  {
    id: 'agent-02',
    name: 'Chidinma Okonkwo',
    agency: 'Signature Prime Properties Ikoyi',
    state: 'Lagos',
    areasCovered: ['Ikoyi', 'Banana Island', 'Victoria Island'],
    phone: '+234 802 345 6789',
    whatsapp: '2348023456789',
    rating: 5.0,
    reviewsCount: 84,
    activeListingsCount: 38,
    verified: true,
    specialization: 'Waterfront Penthouses & Prime Investment Portfolios',
    experienceYears: 15,
  },
  {
    id: 'agent-03',
    name: 'Usman Danjuma',
    agency: 'Federal Capital Homes & Estates',
    state: 'Abuja (FCT)',
    areasCovered: ['Maitama', 'Asokoro', 'Wuse 2', 'Guzape', 'Jabi'],
    phone: '+234 809 123 4567',
    whatsapp: '2348091234567',
    rating: 4.8,
    reviewsCount: 52,
    activeListingsCount: 51,
    verified: true,
    specialization: 'Ambassadorial Mansions & AGIS Verified Lands',
    experienceYears: 14,
  },
  {
    id: 'agent-04',
    name: 'Ibifuro Briggs',
    agency: 'Garden City Realties Port Harcourt',
    state: 'Rivers',
    areasCovered: ['Old GRA', 'Peter Odili', 'Trans-Amadi'],
    phone: '+234 806 543 2109',
    whatsapp: '2348065432109',
    rating: 4.9,
    reviewsCount: 41,
    activeListingsCount: 31,
    verified: true,
    specialization: 'Commercial Land, Oil & Gas Executive Housing',
    experienceYears: 11,
  },
];

