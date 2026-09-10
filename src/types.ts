export type ViewMode = 'landing' | 'dashboard' | 'analyzer' | 'marketplace' | 'auth' | 'admin';
export type { Language } from './data/languages';

export interface UserProfile {
  id: string;
  name: string;
  role: 'Farmer' | 'Trader' | 'Buyer' | 'Admin';
  location: string;
  avatar: string;
  phone: string;
  rating: number;
  totalListings: number;
  activeBids: number;
  email?: string;
  status?: 'Active' | 'Blocked';
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: string;
  joinedAt?: string;
  kccOrLicense?: string;
  aadhaarLast4?: string;
  verified?: boolean;
  notes?: string;
}

export interface Bid {
  id: string;
  cropId: string;
  buyerName: string;
  buyerLocation: string;
  amount: number;
  timestamp: string;
  isHighest?: boolean;
}

export interface CropListing {
  id: string;
  farmerName: string;
  farmerLocation: string;
  farmerRating: number;
  farmerAvatar: string;
  cropName: string;
  variety: string;
  category: 'Grains' | 'Vegetables' | 'Fruits' | 'Pulses' | 'Commercial';
  quantityQuintals: number;
  aiQualityScore: number; // 0-100
  qualityGrade: 'A+' | 'A' | 'B+' | 'B';
  startingPricePerQuintal: number;
  currentHighestBid: number;
  bidCount: number;
  bidsHistory: Bid[];
  endTime: string; // ISO string
  imageUrl: string;
  harvestDate: string;
  organicCertified: boolean;
  moisturePercentage: number;
  description: string;
}

export interface DiseaseAdvice {
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventativeMeasures: string[];
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  estimatedYieldImpact: string;
}

export interface CropAnalysisResult {
  id: string;
  timestamp: string;
  cropType: string;
  subjectIdentification?: string;
  imageUrl: string;
  healthStatus: string;
  diseaseDetected: string | null;
  possibleDiagnoses?: string[];
  confidenceScore: number; // percentage
  uncertaintyWarning?: string | null;
  aiQualityScore: number; // 0-100
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'Reject';
  primarySymptomsObserved?: string[];
  summaryAdvice: string;
  detailedAdvice: DiseaseAdvice;
  marketEligibility: string;
  disclaimer?: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  location: string;
  soilMoisturePercent?: number;
  soilMoistureStatus?: 'Low (Dry)' | 'Optimal (Field Capacity)' | 'High (Saturated)' | 'Moderate';
  soilTemp?: number;
  irrigationAdvice?: string;
  sprayCondition?: 'Ideal / Safe' | 'Moderate / Caution' | 'Not Recommended (Wind/Rain)';
  evapotranspiration?: number; // mm/day
  uvIndex?: number;
  lastUpdated?: string;
  isLive?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface ActivityItem {
  id: string;
  type: 'bid' | 'analysis' | 'listing' | 'payout';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  statusBadge?: string;
}

export type SearchCategory =
  | 'crop_pathology'
  | 'fertilizer_soil'
  | 'government_schemes'
  | 'mandi_prices'
  | 'weather_irrigation'
  | 'general_farming';

export interface SmartSearchAnswer {
  id: string;
  query: string;
  language: string;
  topicCategory: string;
  categoryKey: SearchCategory;
  headline: string;
  simpleAnswer: string;
  recommendations: string[];
  relatedScheme?: {
    name: string;
    description: string;
    eligibilityOrBenefit?: string;
    applyLinkText?: string;
  } | null;
  mandiOrMarketContext?: {
    cropName?: string;
    avgPriceRange?: string;
    trend?: 'up' | 'down' | 'stable';
    note?: string;
  } | null;
  nextSteps?: string[];
  verificationNote: string;
  isRealAi?: boolean;
}

export interface UserReview {
  id: string;
  name: string;
  role: 'Farmer' | 'Trader' | 'Buyer' | 'Agronomist';
  location: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  cropOrTrade?: string;
  verifiedBadge?: string;
  helpfulCount: number;
  date: string;
  avatar?: string;
}

export interface CreditFactor {
  id: string;
  name: string;
  nameGu: string;
  category: 'harvest_quality' | 'trade_fulfillment' | 'loan_repayment' | 'crop_insurance' | 'buyer_rating';
  weight: number; // percentage (e.g. 30%)
  score: number; // 0-100
  status: 'Optimal' | 'Good' | 'Attention';
  details: string;
  detailsGu: string;
}

export interface ScoreBoostAction {
  id: string;
  title: string;
  titleGu: string;
  points: number; // e.g. +15 pts
  description: string;
  descriptionGu: string;
  actionLabel: string;
  actionLabelGu: string;
  isCompleted: boolean;
}

export interface TradeLedgerItem {
  id: string; // e.g. "TRD-2026-891"
  date: string;
  cropName: string;
  cropVariety: string;
  season: 'Kharif 2026' | 'Rabi 2025-26' | 'Zaid 2025' | 'Kharif 2025';
  quantityQuintals: number;
  pricePerQuintal: number;
  totalAmount: number;
  mandiBenchmark: number; // APMC standard benchmark price
  gainOverMandi: number; // Extra earnings via direct auction
  aiQualityScore: number;
  qualityGrade: 'A+' | 'A' | 'B+';
  buyerName: string;
  buyerLocation: string;
  buyerType: string;
  escrowStatus: 'Settled & Paid' | 'In Escrow' | 'Dispatched';
  paymentMethod: string;
  taxInvoiceNo: string;
  ratingReceived: number;
}

export interface KisanCreditProfile {
  overallScore: number; // 300 - 900 (e.g. 785)
  maxScore: number; // 900
  ratingTier: 'Platinum Elite' | 'Gold Tier' | 'Silver Tier' | 'Standard';
  ratingLabel: string;
  ratingLabelGu: string;
  preApprovedLoanLimit: number; // e.g. 650000 (₹6.50 Lakhs)
  subsidizedInterestRate: number; // 4.0%
  standardInterestRate: number; // 7.0%
  totalTradeVolume: number; // ₹18,45,000
  tradeCount: number;
  onTimeFulfillmentRate: number; // 99.4%
  disputeFreePercent: number; // 100%
  averageAiQualityScore: number; // 93
  kccBankLinked: string;
  soilHealthCardLinked: boolean;
  pmfbyInsuranceActive: boolean;
  factors: CreditFactor[];
  scoreBoostActions: ScoreBoostAction[];
}

export interface MarketplaceOrder {
  orderId: string;
  listingId: string;
  cropName: string;
  variety: string;
  farmerSellerName: string;
  farmerSellerAddress: string;
  farmerAddress?: string; // alias for farmerSellerAddress
  buyerName: string;
  buyerAddress: string;
  buyerPhone?: string;
  pricePerQuintal: number;
  quantitySoldQuintals: number;
  totalPrice: number;
  status: 'Confirmed' | 'Escrow Locked' | 'Dispatched' | 'Delivered';
  paymentStatus?: string; // alias for status
  paymentMode?: string;
  timestamp: string;
  orderDate?: string; // alias for timestamp
}

export interface UserLoginRecord {
  id: string;
  loginId?: string; // alias for id
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  role: string;
  location: string;
  loginMethod: string;
  method?: string; // alias for loginMethod
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface FarmerCropScanRecord {
  id: string;
  scanId?: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerPhone?: string;
  cropType: string;
  subjectIdentification?: string;
  healthStatus: 'Healthy' | 'Moderate Issue' | 'Critical Disease' | string;
  diseaseDetected?: string;
  confidenceScore: number;
  qualityGrade?: string;
  aiQualityScore?: number;
  primarySymptomsObserved?: string[];
  summaryAdvice: string;
  organicTreatment?: string[];
  chemicalTreatment?: string[];
  preventativeMeasures?: string[];
  severity?: string;
  estimatedYieldImpact?: string;
  marketEligibility?: string;
  imageUrl?: string;
  timestamp: string;
}


