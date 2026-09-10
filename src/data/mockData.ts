import { CropListing, CropAnalysisResult, WeatherInfo, ActivityItem, UserProfile, UserReview, KisanCreditProfile, TradeLedgerItem } from '../types';

export const mockUser: UserProfile = {
  id: 'usr_001',
  name: 'Ramesh Patel',
  role: 'Farmer',
  location: 'Anand, Gujarat',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  phone: '+91 98765 43210',
  rating: 4.9,
  totalListings: 4,
  activeBids: 18,
};

export const sampleAnalysisCases = [
  {
    id: 'sample-1',
    name: 'Tomato Leaf (Early Blight)',
    cropType: 'Tomato',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Warning: Early Blight Detected',
    diseaseDetected: 'Early Blight (Alternaria solani)',
    confidenceScore: 94,
    aiQualityScore: 82,
    qualityGrade: 'B+' as const,
    summaryAdvice: 'Apply organic copper-based fungicide within 48 hours to halt leaf spot expansion and preserve fruit yield.',
    detailedAdvice: {
      organicTreatment: [
        'Apply Neem Oil spray (5ml/L of water) every 5-7 days.',
        'Prune and safely destroy infected lower leaves.'
      ],
      chemicalTreatment: [
        'Spray Chlorothalonil 75% WP or Mancozeb at 2g/L.',
        'Ensure proper spacing for air circulation.'
      ],
      preventativeMeasures: [
        'Avoid overhead drip irrigation on leaf canopy.',
        'Rotate with non-solanaceous crops next season.'
      ],
      severity: 'Moderate' as const,
      estimatedYieldImpact: '5% - 10% reduction if untreated'
    },
    marketEligibility: 'Market Grade B+: Eligible for local distribution and processing bidding.'
  },
  {
    id: 'sample-2',
    name: 'Wheat Leaf (Rust Disease)',
    cropType: 'Wheat',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Severe: Yellow Leaf Rust Detected',
    diseaseDetected: 'Puccinia striiformis (Yellow Rust)',
    confidenceScore: 91,
    aiQualityScore: 71,
    qualityGrade: 'B' as const,
    summaryAdvice: 'Apply systemic Triazole fungicide immediately. Quarantine affected sector to safeguard adjacent acreage.',
    detailedAdvice: {
      organicTreatment: [
        'Apply Bio-fungicide containing Trichoderma viride.',
        'Dust sulfur powder during morning dew.'
      ],
      chemicalTreatment: [
        'Foliar spray with Propiconazole 25% EC at 1ml/L.',
        'Re-inspect in 7 days for new pustule outbreaks.'
      ],
      preventativeMeasures: [
        'Sow resistant wheat varieties (e.g., HD 2967, DBW 187).',
        'Maintain balanced nitrogen fertilization.'
      ],
      severity: 'High' as const,
      estimatedYieldImpact: '15% - 25% potential reduction'
    },
    marketEligibility: 'Market Grade B: Suitable for millers with sorting pre-treatment.'
  },
  {
    id: 'sample-3',
    name: 'Rice Paddy (Healthy & Premium)',
    cropType: 'Basmati Rice',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Optimal Health: No Disease Detected',
    diseaseDetected: null,
    confidenceScore: 98,
    aiQualityScore: 96,
    qualityGrade: 'A+' as const,
    summaryAdvice: 'Crop canopy is vigorous and disease-free. Maintain current soil moisture and prepare for grain filling phase.',
    detailedAdvice: {
      organicTreatment: [
        'Maintain organic vermicompost top-dressing.',
        'Sustained Bio-pesticide neem spray preventive cycle.'
      ],
      chemicalTreatment: [
        'No chemical interventions required at this stage.'
      ],
      preventativeMeasures: [
        'Maintain 2-3 cm standing water during panicle initiation.',
        'Monitor field edges for stem borer moths.'
      ],
      severity: 'Low' as const,
      estimatedYieldImpact: 'Zero impact - Peak yield projected'
    },
    marketEligibility: 'Market Grade A+: Prime Export Quality. Eligible for top-tier marketplace premium pricing!'
  },
  {
    id: 'sample-4',
    name: 'Cotton Plant (Leaf Curl Virus)',
    cropType: 'Cotton',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Warning: Cotton Leaf Curl Virus',
    diseaseDetected: 'CLCuV (Whitefly Vector Transmission)',
    confidenceScore: 89,
    aiQualityScore: 78,
    qualityGrade: 'B+' as const,
    summaryAdvice: 'Control whitefly population using yellow sticky traps and systemic insecticide to prevent viral spread.',
    detailedAdvice: {
      organicTreatment: [
        'Deploy 10 yellow sticky cards per acre.',
        'Spray Beauveria bassiana biocontrol formulation.'
      ],
      chemicalTreatment: [
        'Apply Diafenthiuron 50% WP at 1.2g/L water.',
        'Alternate with Imidacloprid to prevent resistance.'
      ],
      preventativeMeasures: [
        'Remove weed hosts from field margins.',
        'Avoid planting near alternative virus host crops.'
      ],
      severity: 'Moderate' as const,
      estimatedYieldImpact: '8% - 12% yield loss risk'
    },
    marketEligibility: 'Market Grade B+: High fiber density remains intact for textile bidding.'
  }
];

export const initialListings: CropListing[] = [
  {
    id: 'crop-101',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Anand, Gujarat',
    farmerRating: 4.9,
    farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    cropName: 'Golden Sharbati Wheat',
    variety: 'Sharbati Premium',
    category: 'Grains',
    quantityQuintals: 120,
    aiQualityScore: 94,
    qualityGrade: 'A+',
    startingPricePerQuintal: 2800,
    currentHighestBid: 3250,
    bidCount: 8,
    bidsHistory: [
      { id: 'b-1', cropId: 'crop-101', buyerName: 'AgroCorp Mills', buyerLocation: 'Ahmedabad', amount: 3250, timestamp: '10 mins ago', isHighest: true },
      { id: 'b-2', cropId: 'crop-101', buyerName: 'Gujarat Grain Traders', buyerLocation: 'Vadodara', amount: 3100, timestamp: '25 mins ago' },
      { id: 'b-3', cropId: 'crop-101', buyerName: 'Sunrise Food Products', buyerLocation: 'Surat', amount: 2950, timestamp: '1 hour ago' }
    ],
    endTime: new Date(Date.now() + 4 * 3600 * 1000 + 18 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    harvestDate: '2026-08-05',
    organicCertified: true,
    moisturePercentage: 11.2,
    description: 'Freshly harvested Sharbati wheat, AI verified 94/100 quality grade. Sun-dried with low moisture and uniform golden grain texture.'
  },
  {
    id: 'crop-102',
    farmerName: 'Savita Devi',
    farmerLocation: 'Nashik, Maharashtra',
    farmerRating: 4.8,
    farmerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    cropName: 'Red Organic Tomatoes',
    variety: 'Roma Vine Fresh',
    category: 'Vegetables',
    quantityQuintals: 45,
    aiQualityScore: 88,
    qualityGrade: 'A',
    startingPricePerQuintal: 1800,
    currentHighestBid: 2150,
    bidCount: 5,
    bidsHistory: [
      { id: 'b-4', cropId: 'crop-102', buyerName: 'FreshBazaar Retail', buyerLocation: 'Mumbai', amount: 2150, timestamp: '5 mins ago', isHighest: true },
      { id: 'b-5', cropId: 'crop-102', buyerName: 'Sahyadri Farmers Co', buyerLocation: 'Pune', amount: 2000, timestamp: '40 mins ago' }
    ],
    endTime: new Date(Date.now() + 2 * 3600 * 1000 + 45 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    harvestDate: '2026-08-10',
    organicCertified: true,
    moisturePercentage: 88.5,
    description: 'Grade A firm, bright red organic tomatoes. AI scanned for early disease absence and firm pulp texture. Perfect for retail or saucing.'
  },
  {
    id: 'crop-103',
    farmerName: 'Gurpreet Singh',
    farmerLocation: 'Karnal, Haryana',
    farmerRating: 4.95,
    farmerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    cropName: 'Traditional 1121 Basmati Rice',
    variety: '1121 Extra Long',
    category: 'Grains',
    quantityQuintals: 200,
    aiQualityScore: 97,
    qualityGrade: 'A+',
    startingPricePerQuintal: 4200,
    currentHighestBid: 4850,
    bidCount: 12,
    bidsHistory: [
      { id: 'b-6', cropId: 'crop-103', buyerName: 'Global Rice Exports', buyerLocation: 'New Delhi', amount: 4850, timestamp: '2 mins ago', isHighest: true },
      { id: 'b-7', cropId: 'crop-103', buyerName: 'Kohinoor Grain Traders', buyerLocation: 'Amritsar', amount: 4700, timestamp: '15 mins ago' }
    ],
    endTime: new Date(Date.now() + 8 * 3600 * 1000 + 10 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    harvestDate: '2026-08-02',
    organicCertified: false,
    moisturePercentage: 12.0,
    description: 'Export grade 1121 Basmati paddy with exceptional kernel length and fragrance. AI scanned for zero discolored grain mixture.'
  },
  {
    id: 'crop-104',
    farmerName: 'Chandra Reddy',
    farmerLocation: 'Guntur, Andhra Pradesh',
    farmerRating: 4.7,
    farmerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    cropName: 'Aged Red Chilli (S334)',
    variety: 'Guntur Teja S334',
    category: 'Commercial',
    quantityQuintals: 60,
    aiQualityScore: 91,
    qualityGrade: 'A',
    startingPricePerQuintal: 14000,
    currentHighestBid: 16200,
    bidCount: 7,
    bidsHistory: [
      { id: 'b-8', cropId: 'crop-104', buyerName: 'Spices Of India Corp', buyerLocation: 'Chennai', amount: 16200, timestamp: '18 mins ago', isHighest: true }
    ],
    endTime: new Date(Date.now() + 5 * 3600 * 1000 + 30 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    harvestDate: '2026-07-28',
    organicCertified: false,
    moisturePercentage: 9.8,
    description: 'Pungent deep red Guntur chillies, sun-cured. High capsaicin content verified by AI thermal spectral scanning.'
  },
  {
    id: 'crop-105',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Anand, Gujarat',
    farmerRating: 4.9,
    farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    cropName: 'Organic Yellow Maize (Corn)',
    variety: 'Hybrid Sweet Corn',
    category: 'Grains',
    quantityQuintals: 85,
    aiQualityScore: 89,
    qualityGrade: 'A',
    startingPricePerQuintal: 2100,
    currentHighestBid: 2420,
    bidCount: 4,
    bidsHistory: [
      { id: 'b-9', cropId: 'crop-105', buyerName: 'Amul Cattle Feeds', buyerLocation: 'Anand', amount: 2420, timestamp: '30 mins ago', isHighest: true }
    ],
    endTime: new Date(Date.now() + 6 * 3600 * 1000 + 0 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    harvestDate: '2026-08-08',
    organicCertified: true,
    moisturePercentage: 13.5,
    description: 'High energy sweet yellow corn kernels. AI quality rated 89/100 with zero fungal aflatoxin trace.'
  }
];

export const mockWeather: WeatherInfo = {
  temp: 29,
  condition: 'Partly Cloudy',
  humidity: 68,
  windSpeed: 14,
  rainProbability: 20,
  location: 'Anand Agriculture Hub, Gujarat'
};

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'bid',
    title: 'New Bid Received! ₹3,250/qtl',
    description: 'AgroCorp Mills placed top bid on your Sharbati Wheat lot (#crop-101)',
    timestamp: '10 minutes ago',
    amount: 3250,
    statusBadge: 'Active High Bid'
  },
  {
    id: 'act-2',
    type: 'analysis',
    title: 'AI Crop Diagnostic Completed',
    description: 'Tomato Leaf scanned: Early Blight (82/100 Quality). Treatment plan generated.',
    timestamp: '2 hours ago',
    statusBadge: 'AI Scanned'
  },
  {
    id: 'act-3',
    type: 'listing',
    title: 'Crop Listed on Trading Market',
    description: '85 Quintals of Organic Yellow Maize published with AI Quality Grade A.',
    timestamp: 'Yesterday',
    statusBadge: 'Live Lot'
  },
  {
    id: 'act-4',
    type: 'payout',
    title: 'Direct Escrow Payout Settled',
    description: 'Received ₹1,85,000 for Cotton Lot #crop-098 via UPI Instant Settlement.',
    timestamp: '2 days ago',
    amount: 185000,
    statusBadge: 'Verified Settlement'
  }
];

export const initialReviews: UserReview[] = [
  {
    id: 'rev-1',
    name: 'Balwinder Singh',
    role: 'Farmer',
    location: 'Ludhiana, Punjab',
    rating: 5,
    title: 'Saved my paddy crop and got ₹400/qtl higher price!',
    comment: 'KisanSync changed my farming income completely. The AI camera caught leaf rust 5 days before it spread, saving my entire paddy. Then I sold my 180 quintals harvest at ₹400/quintal above local Mandi rates through transparent live bidding!',
    cropOrTrade: 'Basmati Paddy (Grade A+)',
    verifiedBadge: 'Verified Farmer • 180 Qtl Sold',
    helpfulCount: 42,
    date: '2026-08-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-2',
    name: 'Priya Deshmukh',
    role: 'Farmer',
    location: 'Nashik, Maharashtra',
    rating: 5,
    title: 'Grade A+ AI certificate builds instant trust with buyers',
    comment: 'Buyers used to doubt my organic claim. Now, KisanSync AI Quality Score gives my tomatoes an A+ verification badge. Bidders compete nationwide right from my mobile phone with zero middleman cuts!',
    cropOrTrade: 'Organic Tomatoes (Grade A+)',
    verifiedBadge: 'Verified Farmer • 45 Qtl Sold',
    helpfulCount: 38,
    date: '2026-08-12',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-3',
    name: 'Vikramaditya Rao',
    role: 'Buyer',
    location: 'Hyderabad, Telangana',
    rating: 5,
    title: 'Zero quality risk for bulk mill procurement',
    comment: 'As a bulk buyer, quality risk is our biggest bottleneck. KisanSync AI crop health ratings allow us to place confident high bids on verified batches with zero middleman markups and guaranteed delivery.',
    cropOrTrade: 'Grains & Pulses Trader',
    verifiedBadge: 'Verified Buyer • 1,200 Qtl Bought',
    helpfulCount: 29,
    date: '2026-08-08',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-4',
    name: 'Dr. Arvind Joshi',
    role: 'Agronomist',
    location: 'Anand Agriculture University, Gujarat',
    rating: 5,
    title: 'Outstanding botanical accuracy and dosage precision',
    comment: 'The cellular pathology diagnostics and organic bio-control prescriptions align rigorously with ICAR agronomic standards. The 6-point diagnosis provides immediate clarity to farmers in their native languages.',
    cropOrTrade: 'Field Pathology Advisory',
    verifiedBadge: 'Certified Agronomist',
    helpfulCount: 51,
    date: '2026-08-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-5',
    name: 'Harpreet Kaur',
    role: 'Trader',
    location: 'Bathinda, Punjab',
    rating: 4,
    title: 'Fast bidding settlements and transparent escrow',
    comment: 'Trading wheat and mustard on KisanSync is remarkably fast. The live ledger prevents any underhand bidding and the UPI escrow settlement takes less than 2 hours once the harvest lot arrives.',
    cropOrTrade: 'Wheat & Mustard Wholesale',
    verifiedBadge: 'Wholesale Partner • 650 Qtl Traded',
    helpfulCount: 23,
    date: '2026-07-29',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  }
];

export const mockCreditProfile: KisanCreditProfile = {

  overallScore: 785,
  maxScore: 900,
  ratingTier: 'Platinum Elite',
  ratingLabel: 'Excellent Agri Credit Standing',
  ratingLabelGu: 'ઉત્કૃષ્ટ કિસાન ક્રેડિટ સ્કોર (પ્લેટિનમ એલીટ)',
  preApprovedLoanLimit: 650000,
  subsidizedInterestRate: 4.0,
  standardInterestRate: 7.0,
  totalTradeVolume: 1845000,
  tradeCount: 34,
  onTimeFulfillmentRate: 99.4,
  disputeFreePercent: 100,
  averageAiQualityScore: 93,
  kccBankLinked: 'State Bank of India (Agri Commercial Branch, Anand)',
  soilHealthCardLinked: true,
  pmfbyInsuranceActive: true,
  factors: [
    {
      id: 'f1',
      name: 'Harvest Quality & AI Diagnostic Log',
      nameGu: 'પાક ગુણવત્તા અને એઆઈ નિદાન ટ્રેકિંગ',
      category: 'harvest_quality',
      weight: 30,
      score: 96,
      status: 'Optimal',
      details: 'Average 93/100 AI health score across 18 consecutive field scans with zero severe blight neglect.',
      detailsGu: '૧૮ પાક સ્કેનમાં સરેરાશ ૯૩/૧૦૦ એઆઈ ગુણવત્તા સ્કોર અને સમયસર રોગ નિયંત્રણ.'
    },
    {
      id: 'f2',
      name: 'Mandi Trade Fulfillment & Escrow Record',
      nameGu: 'હરાજી વેપાર પરિપૂર્ણતા અને એસ્ક્રો ડિલિવરી',
      category: 'trade_fulfillment',
      weight: 25,
      score: 98,
      status: 'Optimal',
      details: '34 successful trade deliveries with 99.4% on-time dispatch and zero lot rejections.',
      detailsGu: '૩૪ સફળ વેપાર સોદા, ૯૯.૪% સમયસર ડિલિવરી અને શૂન્ય માલ રદ્દીકરણ.'
    },
    {
      id: 'f3',
      name: 'KCC Institutional Loan Repayment',
      nameGu: 'કિસાન ક્રેડિટ કાર્ડ (KCC) અને ધિરાણ ચુકવણી',
      category: 'loan_repayment',
      weight: 20,
      score: 92,
      status: 'Optimal',
      details: 'Zero defaults on SBI KCC limit. 100% prompt seasonal loan clearance securing 3% Govt Interest Subvention.',
      detailsGu: 'એસબીઆઈ કેસીસી ધિરાણ પર શૂન્ય બાકી, ૩% સરકારી સબવેન્શન લાભ સાથે નિયમિત પરત ચુકવણી.'
    },
    {
      id: 'f4',
      name: 'PMFBY Crop Insurance & Soil Card',
      nameGu: 'પીએમ ફસલ બીમા યોજના અને જમીન આરોગ્ય પત્રિકા',
      category: 'crop_insurance',
      weight: 15,
      score: 90,
      status: 'Good',
      details: 'Active PMFBY coverage on 8.5 acres with certified digital Soil Health Card (SHC-2026).',
      detailsGu: '૮.૫ એકર પર પીએમએફબીવાય વીમો સક્રિય અને ડિજિટલ સોઇલ હેલ્થ કાર્ડ જોડાયેલું છે.'
    },
    {
      id: 'f5',
      name: 'Buyer & Trader Community Rating',
      nameGu: 'ખરીદદાર અને વેપારી સમુદાય રેટિંગ',
      category: 'buyer_rating',
      weight: 10,
      score: 98,
      status: 'Optimal',
      details: '4.9★ rating from 48 verified buyers across Gujarat, Maharashtra & Punjab wholesale mandis.',
      detailsGu: '૪૮ પ્રમાણિત વેપારીઓ તરફથી ૪.૯★ રેટિંગ અને ઉત્કૃષ્ટ વેપાર પ્રામાણિકતા.'
    }
  ],
  scoreBoostActions: [
    {
      id: 'b1',
      title: 'Maintain Weekly AI Crop Diagnostics',
      titleGu: 'દર અઠવાડિયે એઆઈ પાક સ્કેન ચાલુ રાખો',
      points: 10,
      description: 'Regular leaf diagnostics demonstrate proactive pest management to credit assessors.',
      descriptionGu: 'નિયમિત પાક તપાસથી બેંક અને ધિરાણ સંસ્થાઓમાં રોગ જોખમ ઘટે છે.',
      actionLabel: 'Scan Crop Now',
      actionLabelGu: 'પાક સ્કેન કરો',
      isCompleted: true
    },
    {
      id: 'b2',
      title: 'Complete Escrow Delivery for Active Cotton Lot',
      titleGu: 'કપાસ લૉટની એસ્ક્રો ડિલિવરી પૂર્ણ કરો',
      points: 15,
      description: 'Dispatch the upcoming 85 quintal cotton lot to earn an instant trade completion booster.',
      descriptionGu: 'હાલના ૮૫ ક્વિન્ટલ કપાસ સોદાની ડિલિવરીથી વેપાર સ્કોરમાં ૧૫ પોઇન્ટ્સ વધશે.',
      actionLabel: 'View Active Trade',
      actionLabelGu: 'સોદો જુઓ',
      isCompleted: false
    },
    {
      id: 'b3',
      title: 'Renew NABL Soil Health Lab Certificate',
      titleGu: 'જમીન પ્રયોગશાળા પ્રમાણપત્ર અપડેટ કરો',
      points: 12,
      description: 'Upload renewed micro-nutrient test report to enhance institutional credit pre-approval limit.',
      descriptionGu: 'નવા જમીન રિપોર્ટથી બેંક લોન મર્યાદા ₹૫૦,૦૦૦ સુધી વધી શકે છે.',
      actionLabel: 'Upload Soil Report',
      actionLabelGu: 'રિપોર્ટ અપલોડ કરો',
      isCompleted: false
    }
  ]
};

export const mockTradeLedger: TradeLedgerItem[] = [
  {
    id: 'TRD-2026-891',
    date: '18 Aug 2026',
    cropName: 'Cotton Shankar-6',
    cropVariety: 'Shankar-6 High Ginning',
    season: 'Kharif 2026',
    quantityQuintals: 85,
    pricePerQuintal: 7850,
    totalAmount: 667250,
    mandiBenchmark: 7100,
    gainOverMandi: 63750,
    aiQualityScore: 94,
    qualityGrade: 'A+',
    buyerName: 'Vardhman Textiles & Yarn Ltd.',
    buyerLocation: 'Ahmedabad APMC Hub',
    buyerType: 'Direct Spinning Mill',
    escrowStatus: 'Settled & Paid',
    paymentMethod: 'UPI Kisan Escrow Direct',
    taxInvoiceNo: 'INV-KSS-2026-8812',
    ratingReceived: 5.0
  },
  {
    id: 'TRD-2026-842',
    date: '02 Aug 2026',
    cropName: 'Organic Lokwan Wheat',
    cropVariety: 'Lokwan Golden Grain',
    season: 'Rabi 2025-26',
    quantityQuintals: 120,
    pricePerQuintal: 2840,
    totalAmount: 340800,
    mandiBenchmark: 2475,
    gainOverMandi: 43800,
    aiQualityScore: 96,
    qualityGrade: 'A+',
    buyerName: 'Gujarat Agro Flour Mills',
    buyerLocation: 'Rajkot APMC',
    buyerType: 'Commercial Flour Processor',
    escrowStatus: 'Settled & Paid',
    paymentMethod: 'Direct NEFT RTGS',
    taxInvoiceNo: 'INV-KSS-2026-7934',
    ratingReceived: 4.9
  },
  {
    id: 'TRD-2026-780',
    date: '14 Jul 2026',
    cropName: 'Basmati Paddy 1121',
    cropVariety: 'Pusa Basmati 1121 Extra Long',
    season: 'Kharif 2025',
    quantityQuintals: 95,
    pricePerQuintal: 4250,
    totalAmount: 403750,
    mandiBenchmark: 3750,
    gainOverMandi: 47500,
    aiQualityScore: 92,
    qualityGrade: 'A',
    buyerName: 'Kohinoor Export Grain Traders',
    buyerLocation: 'Gandhidham Port Exporters',
    buyerType: 'Rice Export House',
    escrowStatus: 'Settled & Paid',
    paymentMethod: 'Direct NEFT RTGS',
    taxInvoiceNo: 'INV-KSS-2026-6519',
    ratingReceived: 5.0
  },
  {
    id: 'TRD-2026-695',
    date: '28 Jun 2026',
    cropName: 'Unjha Cumin (Jeera)',
    cropVariety: 'Gujarat Cumin-4 Special Bold',
    season: 'Zaid 2025',
    quantityQuintals: 15,
    pricePerQuintal: 28600,
    totalAmount: 429000,
    mandiBenchmark: 25400,
    gainOverMandi: 48000,
    aiQualityScore: 95,
    qualityGrade: 'A+',
    buyerName: 'Shree Ram Spices & Export Corp',
    buyerLocation: 'Unjha APMC Yard',
    buyerType: 'Spices Exporter',
    escrowStatus: 'Settled & Paid',
    paymentMethod: 'UPI Kisan Escrow Direct',
    taxInvoiceNo: 'INV-KSS-2026-5402',
    ratingReceived: 5.0
  },
  {
    id: 'TRD-2026-512',
    date: '10 May 2026',
    cropName: 'Organic Groundnut G-20',
    cropVariety: 'Gujarat Groundnut Bold 20',
    season: 'Kharif 2025',
    quantityQuintals: 40,
    pricePerQuintal: 6600,
    totalAmount: 264000,
    mandiBenchmark: 5950,
    gainOverMandi: 26000,
    aiQualityScore: 93,
    qualityGrade: 'A+',
    buyerName: 'Saurashtra Oil Mills Association',
    buyerLocation: 'Gondal APMC',
    buyerType: 'Cold Press Oil Extraction',
    escrowStatus: 'Settled & Paid',
    paymentMethod: 'Direct NEFT RTGS',
    taxInvoiceNo: 'INV-KSS-2026-4109',
    ratingReceived: 4.8
  }
];

export const initialAccounts: UserProfile[] = [
  {
    id: 'usr_farmer_ramesh',
    name: 'Ramesh Patel',
    role: 'Farmer',
    location: 'Anand, Gujarat',
    phone: '+91 98765 43210',
    email: 'ramesh.kisan@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    totalListings: 4,
    activeBids: 18,
    status: 'Active',
    isBlocked: false,
    joinedAt: '12 Jan 2026',
    kccOrLicense: 'KCC-GJ-884219',
    aadhaarLast4: '8492',
    verified: true,
    notes: 'Registered certified organic cultivator. Consistent top-grade wheat and cotton producer.'
  },
  {
    id: 'usr_trader_vikram',
    name: 'Vikram Sharma',
    role: 'Trader',
    location: 'APMC Unjha, Gujarat',
    phone: '+91 98234 56789',
    email: 'vikram.spices@unjhamandi.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    totalListings: 0,
    activeBids: 24,
    status: 'Active',
    isBlocked: false,
    joinedAt: '03 Feb 2026',
    kccOrLicense: 'APMC-LIC-UNJ-4412',
    verified: true,
    notes: 'Grade-1 licensed mandi commission agent with zero dispute history.'
  },
  {
    id: 'usr_buyer_priya',
    name: 'Priya Mehta',
    role: 'Buyer',
    location: 'Ahmedabad, Gujarat',
    phone: '+91 97123 45678',
    email: 'priya.m@ahmedabadagroexports.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 5.0,
    totalListings: 0,
    activeBids: 32,
    status: 'Active',
    isBlocked: false,
    joinedAt: '18 Feb 2026',
    kccOrLicense: 'IEC-EXPORT-77291',
    verified: true,
    notes: 'Corporate procurement director for Ahmedabad Agro Exports Ltd.'
  },
  {
    id: 'usr_farmer_harpreet',
    name: 'Sardar Harpreet Singh',
    role: 'Farmer',
    location: 'Ludhiana, Punjab',
    phone: '+91 98112 34567',
    email: 'harpreet.punjab@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 4.95,
    totalListings: 6,
    activeBids: 14,
    status: 'Active',
    isBlocked: false,
    joinedAt: '25 Jan 2026',
    kccOrLicense: 'KCC-PB-331902',
    aadhaarLast4: '4190',
    verified: true,
    notes: 'Specializes in high-protein Sharbati Wheat and basmati rice.'
  },
  {
    id: 'usr_farmer_dinesh',
    name: 'Dineshbhai Vankar',
    role: 'Farmer',
    location: 'Amreli, Gujarat',
    phone: '+91 99042 11223',
    email: 'dinesh.cotton@yahoo.in',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    rating: 4.7,
    totalListings: 2,
    activeBids: 8,
    status: 'Active',
    isBlocked: false,
    joinedAt: '10 Feb 2026',
    kccOrLicense: 'KCC-GJ-551209',
    aadhaarLast4: '6621',
    verified: true,
    notes: 'Bt Cotton smallholder farmer in Saurashtra region.'
  },
  {
    id: 'usr_trader_rajesh',
    name: 'Rajesh Agrawal',
    role: 'Trader',
    location: 'Indore Mandi, Madhya Pradesh',
    phone: '+91 94250 88990',
    email: 'rajesh.agrawal@indoregrain.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    rating: 3.2,
    totalListings: 0,
    activeBids: 5,
    status: 'Blocked',
    isBlocked: true,
    blockReason: 'Non-settlement of auction lot #crop-102 payment within statutory 48hr window (APMC Rule §14.2)',
    blockedAt: '04 Mar 2026',
    joinedAt: '15 Jan 2026',
    kccOrLicense: 'APMC-MP-IND-0912',
    verified: false,
    notes: 'Flagged for fraudulent delayed bids and payment default.'
  },
  {
    id: 'usr_buyer_ananya',
    name: 'Ananya Deshmukh',
    role: 'Buyer',
    location: 'Nashik, Maharashtra',
    phone: '+91 98220 33445',
    email: 'ananya@nashikorganics.org',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    totalListings: 0,
    activeBids: 19,
    status: 'Active',
    isBlocked: false,
    joinedAt: '28 Feb 2026',
    kccOrLicense: 'FSSAI-MH-228910',
    verified: true,
    notes: 'Direct farm-to-fork chain representative.'
  },
  {
    id: 'admin_sih_2026',
    name: 'System Administrator (SIH)',
    role: 'Admin',
    location: 'Gandhinagar State APMC HQ, Gujarat',
    phone: '+91 79 2325 0000',
    email: 'admin@kisansync.gov.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    totalListings: 18,
    activeBids: 84,
    status: 'Active',
    isBlocked: false,
    joinedAt: '01 Jan 2026',
    kccOrLicense: 'GOV-APMC-SUPERADMIN-001',
    verified: true,
    notes: 'Root system administrator with regulatory oversight and governance rights.'
  }
];


