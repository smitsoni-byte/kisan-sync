import React, { useState, useEffect, useMemo } from 'react';
import { CropListing, Bid, MarketplaceOrder, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getReviewUIStrings } from '../data/reviewTranslations';
import { 
  recordMarketplaceOrderToFirestore, 
  subscribeToMarketplaceOrders, 
  firebaseConfig 
} from '../services/firebase';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  Award, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2, 
  PlusCircle, 
  Sparkles,
  TrendingUp,
  History,
  X,
  UserCheck,
  Zap,
  Info,
  AlertCircle,
  ArrowUpDown,
  Layers,
  Scale,
  ShieldCheck,
  Camera,
  Star,
  MessageSquareQuote,
  Database,
  Receipt,
  FileText,
  Truck,
  CreditCard,
  Printer,
  ExternalLink,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface MarketplaceProps {
  listings: CropListing[];
  currentUser?: UserProfile | null;
  onPlaceBid: (cropId: string, amount: number, buyerName: string) => void;
  onSaveOrder?: (order: MarketplaceOrder) => Promise<void> | void;
  onOpenListModal: () => void;
  onOpenReviews?: () => void;
  onOpenAddReview?: () => void;
  onOpenCreditModal?: () => void;
}


// Fallback images if an external URL fails
const DEFAULT_FALLBACK_IMAGES: { [key: string]: string } = {
  Grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  Vegetables: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  Fruits: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80',
  Pulses: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
  Commercial: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
};

// Live Countdown Timer Component
const CountdownTimer: React.FC<{ endTimeStr: string }> = ({ endTimeStr }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isEnded: boolean } | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const end = new Date(endTimeStr).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isEnded: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTimeStr]);

  if (!timeLeft) return null;

  if (timeLeft.isEnded) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900/90 text-slate-400 border border-slate-700">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>Auction Ended</span>
      </div>
    );
  }

  const isEndingSoon = timeLeft.hours < 1;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
      isEndingSoon 
        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
        : 'bg-slate-950/85 text-amber-300 border border-slate-800'
    }`}>
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      <span>
        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
};

export const Marketplace: React.FC<MarketplaceProps> = ({
  listings,
  currentUser,
  onPlaceBid,
  onSaveOrder,
  onOpenListModal,
  onOpenReviews,
  onOpenAddReview,
  onOpenCreditModal
}) => {

  const { currentLanguage, t } = useLanguage();
  const isGu = currentLanguage.code === 'gu';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minQualityScore, setMinQualityScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'endingSoon' | 'highestBid' | 'aiScore' | 'quantity' | 'newest'>('endingSoon');
  const [bidInputs, setBidInputs] = useState<{ [cropId: string]: string }>({});
  
  // Bug fix: use ID instead of stale snapshot so audit log is 100% synchronized with live state
  const [activeHistoryCropId, setActiveHistoryCropId] = useState<string | null>(null);
  
  const [bidSuccessMessage, setBidSuccessMessage] = useState<string | null>(null);
  const [bidErrorMessage, setBidErrorMessage] = useState<string | null>(null);
  const [recentlyBidCropId, setRecentlyBidCropId] = useState<string | null>(null);

  // Direct Mandi Buy & Order States (Saved to Firebase Firestore)
  const [activeOrderCrop, setActiveOrderCrop] = useState<CropListing | null>(null);
  const [orderBuyerName, setOrderBuyerName] = useState<string>('');
  const [orderBuyerAddress, setOrderBuyerAddress] = useState<string>('');
  const [orderBuyerPhone, setOrderBuyerPhone] = useState<string>('');
  const [orderQuantitySold, setOrderQuantitySold] = useState<number>(10);
  const [orderPricePerQuintal, setOrderPricePerQuintal] = useState<number>(0);
  const [orderPaymentMode, setOrderPaymentMode] = useState<string>('e-NAM Escrow UPI');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedReceiptOrder, setConfirmedReceiptOrder] = useState<MarketplaceOrder | null>(null);

  // Firebase Orders DB View Modal
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);
  const [firebaseOrders, setFirebaseOrders] = useState<MarketplaceOrder[]>([]);
  const [searchOrdersQuery, setSearchOrdersQuery] = useState<string>('');

  // Subscribe to real-time Marketplace Orders from Firebase Firestore
  useEffect(() => {
    const unsub = subscribeToMarketplaceOrders((orders) => {
      if (orders && orders.length > 0) {
        setFirebaseOrders(orders);
      }
    });
    return () => unsub();
  }, []);

  const handleOpenOrderModal = (crop: CropListing) => {
    setActiveOrderCrop(crop);
    setOrderBuyerName(currentUser?.name || 'Ramesh Patel');
    setOrderBuyerAddress(currentUser?.location || 'Central Mandi Complex, APMC Yard, Anand, Gujarat - 388001');
    setOrderBuyerPhone(currentUser?.phone || '+91 98765 43210');
    setOrderQuantitySold(crop.quantityQuintals);
    setOrderPricePerQuintal(crop.currentHighestBid || crop.startingPricePerQuintal);
    setOrderPaymentMode('e-NAM Escrow UPI');
    setOrderError(null);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderCrop) return;

    if (!orderBuyerName.trim()) {
      setOrderError(isGu ? 'ખરીદનારનું નામ જરૂરી છે.' : 'Buyer name is required.');
      return;
    }
    if (!orderBuyerAddress.trim()) {
      setOrderError(isGu ? 'ડિલિવરી સરનામું જરૂરી છે.' : 'Delivery address is required.');
      return;
    }
    if (orderQuantitySold <= 0 || orderQuantitySold > activeOrderCrop.quantityQuintals) {
      setOrderError(
        isGu
          ? `જથ્થો ૧ અને ${activeOrderCrop.quantityQuintals} ક્વિન્ટલ વચ્ચે હોવો જોઈએ.`
          : `Quantity must be between 1 and ${activeOrderCrop.quantityQuintals} Quintals.`
      );
      return;
    }
    if (orderPricePerQuintal <= 0) {
      setOrderError(isGu ? 'અમાન્ય ભાવ પ્રતિ ક્વિન્ટલ.' : 'Invalid price per quintal.');
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError(null);
    try {
      const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: MarketplaceOrder = {
        orderId: orderId,
        listingId: activeOrderCrop.id,
        cropName: activeOrderCrop.cropName,
        variety: activeOrderCrop.variety,
        farmerSellerName: activeOrderCrop.farmerName,
        farmerSellerAddress: activeOrderCrop.farmerLocation,
        buyerName: orderBuyerName.trim(),
        buyerAddress: orderBuyerAddress.trim(),
        buyerPhone: orderBuyerPhone.trim(),
        pricePerQuintal: orderPricePerQuintal,
        quantitySoldQuintals: orderQuantitySold,
        totalPrice: orderPricePerQuintal * orderQuantitySold,
        status: 'Confirmed',
        paymentMode: orderPaymentMode,
        timestamp: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // 1. Direct Save to Firebase Firestore database
      await recordMarketplaceOrderToFirestore(newOrder);

      // 2. Propagate to App parent state
      if (onSaveOrder) {
        await onSaveOrder(newOrder);
      }

      setFirebaseOrders((prev) => [newOrder, ...prev.filter((o) => o.orderId !== newOrder.orderId)]);
      setIsSubmittingOrder(false);
      setActiveOrderCrop(null);
      setConfirmedReceiptOrder(newOrder);
    } catch (err: any) {
      setIsSubmittingOrder(false);
      setOrderError(err?.message || 'Failed to save trade order to Firebase Firestore.');
    }
  };

  const categories = ['All', 'Grains', 'Vegetables', 'Commercial', 'Fruits', 'Pulses'];

  // Current active history crop looked up dynamically
  const activeHistoryCrop = useMemo(() => {
    if (!activeHistoryCropId) return null;
    return listings.find((l) => l.id === activeHistoryCropId) || null;
  }, [activeHistoryCropId, listings]);

  // Market Summary Statistics
  const marketStats = useMemo(() => {
    const totalLots = listings.length;
    const totalVolume = listings.reduce((sum, item) => sum + item.quantityQuintals, 0);
    const highestBid = listings.reduce((max, item) => Math.max(max, item.currentHighestBid), 0);
    const avgScore = totalLots > 0 
      ? Math.round(listings.reduce((sum, item) => sum + item.aiQualityScore, 0) / totalLots) 
      : 90;

    return { totalLots, totalVolume, highestBid, avgScore };
  }, [listings]);

  const handleBidInputChange = (cropId: string, val: string) => {
    // Only allow numeric input
    const cleanVal = val.replace(/[^0-9]/g, '');
    setBidInputs((prev) => ({ ...prev, [cropId]: cleanVal }));
  };

  const handleQuickAdd = (cropId: string, currentBid: number, increment: number) => {
    const currentInputVal = parseInt(bidInputs[cropId] || '', 10);
    const base = (!isNaN(currentInputVal) && currentInputVal > currentBid) ? currentInputVal : currentBid;
    const newVal = base + increment;
    setBidInputs((prev) => ({ ...prev, [cropId]: String(newVal) }));
  };

  const submitBid = (crop: CropListing) => {
    const inputVal = parseInt(bidInputs[crop.id] || '', 10);
    
    if (!inputVal || isNaN(inputVal)) {
      setBidErrorMessage(
        isGu 
          ? `કૃપા કરીને લઘુત્તમ ₹${(crop.currentHighestBid + 50).toLocaleString('en-IN')} કરતાં વધારે રકમ દાખલ કરો.` 
          : `Please enter a valid bid amount higher than ₹${crop.currentHighestBid.toLocaleString('en-IN')}`
      );
      setTimeout(() => setBidErrorMessage(null), 4000);
      return;
    }

    if (inputVal <= crop.currentHighestBid) {
      setBidErrorMessage(
        isGu
          ? `તમારી બોલી (₹${inputVal.toLocaleString('en-IN')}) વર્તમાન ટોપ બોલી (₹${crop.currentHighestBid.toLocaleString('en-IN')}) કરતાં વધુ હોવી જોઈએ.`
          : `Your bid (₹${inputVal.toLocaleString('en-IN')}) must be higher than current highest bid (₹${crop.currentHighestBid.toLocaleString('en-IN')})`
      );
      setTimeout(() => setBidErrorMessage(null), 4000);
      return;
    }

    onPlaceBid(crop.id, inputVal, 'GlobalAgro Trader');
    setBidErrorMessage(null);
    setRecentlyBidCropId(crop.id);
    setTimeout(() => setRecentlyBidCropId(null), 2500);

    setBidSuccessMessage(
      isGu
        ? `🎉 અભિનંદન! ${crop.cropName} પર ₹${inputVal.toLocaleString('en-IN')}/ક્વિન્ટલ ની ટોચની બોલી સફળતાપૂર્વક લાગી ગઈ છે!`
        : `🎉 Success! Your top bid of ₹${inputVal.toLocaleString('en-IN')}/qtl placed on ${crop.cropName}!`
    );
    setTimeout(() => setBidSuccessMessage(null), 4000);

    // Reset input
    setBidInputs((prev) => ({ ...prev, [crop.id]: '' }));
  };

  // Filter & Sort listings
  const filteredAndSortedListings = useMemo(() => {
    return listings
      .filter((item) => {
        const matchesSearch = 
          item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesQuality = item.aiQualityScore >= minQualityScore;

        return matchesSearch && matchesCategory && matchesQuality;
      })
      .sort((a, b) => {
        if (sortBy === 'endingSoon') {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        }
        if (sortBy === 'highestBid') {
          return b.currentHighestBid - a.currentHighestBid;
        }
        if (sortBy === 'aiScore') {
          return b.aiQualityScore - a.aiQualityScore;
        }
        if (sortBy === 'quantity') {
          return b.quantityQuintals - a.quantityQuintals;
        }
        if (sortBy === 'newest') {
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        }
        return 0;
      });
  }, [listings, searchTerm, selectedCategory, minQualityScore, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans-body bg-[#0a0a0a] text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#212327]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#141517] border border-[#212327] text-[#ff7a17] text-xs font-mono uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#ff7a17]" />
            <span>{isGu ? 'ડાયરેક્ટ બિડિંગ • ખેડૂત હરાજી બજાર' : `${t('directBidding')} • ${t('tradingMarket')}`}</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-normal text-white">
            {isGu ? 'લાઈવ કૃષિ હરાજી બજાર' : t('heroTitle')}
          </h1>
          <p className="text-[#dadbdf] text-sm mt-1">
            {isGu 
              ? 'ઝીરો વચેટીયા કમિશન • AI સર્ટિફાઇડ પાક ગુણવત્તા • ખેડૂતો પોતાના ફોટા સાથે પાક લિસ્ટ કરી શકે છે' 
              : 'Zero Middleman Deductions • AI Verified Harvest Quality • Direct Producer-to-Buyer Auctions'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onOpenCreditModal && (
            <button
              onClick={onOpenCreditModal}
              className="bg-[#ff7a17]/15 hover:bg-[#ff7a17]/25 active:bg-[#ff7a17]/35 border border-[#ff7a17]/40 text-white font-mono text-xs sm:text-sm px-4.5 py-3 min-h-[48px] rounded-full flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 group"
            >
              <Award className="w-4 h-4 text-[#ff7a17] group-hover:scale-110 transition-transform" />
              <span>{isGu ? 'કિસાન ક્રેડિટ સ્કોર: ૭૮૫' : 'Kisan Credit: 785'}</span>
              <span className="text-[10px] bg-[#ff7a17] text-black font-bold px-1.5 py-0.2 rounded">TOP 4%</span>
            </button>
          )}

          {/* Firebase Real-Time Orders DB Button */}
          <button
            type="button"
            onClick={() => setIsOrdersModalOpen(true)}
            className="bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-emerald-500/40 text-emerald-400 font-semibold text-xs sm:text-sm px-4.5 py-3 min-h-[48px] rounded-full flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 font-mono cursor-pointer"
            title="View All Trades Saved to Firebase Firestore Database"
          >
            <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{isGu ? 'હરાજી ઓર્ડર ડેટાબેઝ' : 'Firebase Orders DB'}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full font-mono">
              {firebaseOrders.length}
            </span>
          </button>

          {onOpenReviews && (
            <button
              onClick={onOpenReviews}
              className="bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] text-white font-semibold text-xs sm:text-sm px-5 py-3 min-h-[48px] rounded-full flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 font-mono"
            >
              <Star className="w-4 h-4 text-[#ff7a17] fill-[#ff7a17]" />
              <span>{getReviewUIStrings(currentLanguage.code).modalTitle}</span>
            </button>
          )}

          <button
            onClick={onOpenListModal}
            className="bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-sm px-6 py-3.5 min-h-[48px] rounded-full flex items-center justify-center gap-2 shrink-0 transition-all duration-150 shadow-sm active:scale-[0.97]"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>{isGu ? '+ નવો પાક લિસ્ટ કરો (Upload Crop)' : t('listProduce')}</span>
          </button>
        </div>
      </div>

      {/* Market Overview Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff7a17]/10 flex items-center justify-center text-[#ff7a17] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#7d8187] font-mono uppercase tracking-wider truncate">{isGu ? 'લાઈવ લોટ્સ' : 'Active Lots'}</p>
            <p className="font-serif-display text-lg sm:text-xl text-white font-bold truncate">{marketStats.totalLots} Lots</p>
          </div>
        </div>

        <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#7d8187] font-mono uppercase tracking-wider truncate">{isGu ? 'કુલ જથ્થો' : 'Total Volume'}</p>
            <p className="font-serif-display text-lg sm:text-xl text-emerald-400 font-bold truncate">{marketStats.totalVolume.toLocaleString('en-IN')} Qtl</p>
          </div>
        </div>

        <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#7d8187] font-mono uppercase tracking-wider truncate">{isGu ? 'ટોચની બોલી' : 'Top Bid Today'}</p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="font-serif-display text-lg sm:text-xl text-[#ff7a17] font-bold">
                ₹{marketStats.highestBid.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono text-[#7d8187] font-normal">/qtl</span>
            </div>
          </div>
        </div>

        <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#7d8187] font-mono uppercase tracking-wider truncate">{isGu ? 'સરેરાશ AI સ્કોર' : 'Avg AI Grade'}</p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="font-serif-display text-lg sm:text-xl text-blue-300 font-bold">
                {marketStats.avgScore}/100
              </span>
              <span className="text-xs font-mono text-blue-400/80 font-normal">(A+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Bid Success Toast */}
      {bidSuccessMessage && (
        <div className="p-4 bg-[#141517] border border-[#ff7a17]/50 text-[#ff7a17] rounded-2xl flex items-center justify-between shadow-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#ff7a17] shrink-0" />
            <span className="font-bold text-sm">{bidSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setBidSuccessMessage(null)}
            className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center text-[#7d8187] hover:text-white hover:bg-[#212327] active:scale-90 transition-all duration-150"
            aria-label="Dismiss toast"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Global Bid Error Toast */}
      {bidErrorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-300 rounded-2xl flex items-center justify-between shadow-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-bold text-sm">{bidErrorMessage}</span>
          </div>
          <button 
            onClick={() => setBidErrorMessage(null)}
            className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center text-[#dadbdf] hover:text-white hover:bg-red-900/30 active:scale-90 transition-all duration-150"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filter, Sort & Search Toolbar */}
      <div className="bg-[#191919] border border-[#212327] rounded-2xl p-4 sm:p-5 space-y-4">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#7d8187] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={isGu ? 'પાકનું નામ (દા.ત. ઘઉં, કપાસ, ટામેટા), જાત અથવા ખેડૂત શોધો...' : 'Search by crop name (e.g. Wheat, Cotton), variety, or farmer location...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-[#7d8187] focus:outline-none focus:border-[#ff7a17] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#141517] border border-[#212327] px-3.5 py-2 rounded-full text-xs font-mono min-h-[48px] flex-1 sm:flex-initial">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
              <span className="text-[#7d8187] uppercase text-[11px] whitespace-nowrap">{isGu ? 'ક્રમ:' : 'Sort:'}</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#0a0a0a] text-white font-semibold focus:outline-none rounded-full px-2.5 py-1.5 min-h-[34px] border border-[#212327] cursor-pointer"
              >
                <option value="endingSoon">{isGu ? '⏳ વહેલી પૂરી થતી હરાજી' : 'Ending Soonest'}</option>
                <option value="highestBid">{isGu ? '💰 સૌથી ઊંચી બોલી' : 'Highest Top Bid'}</option>
                <option value="aiScore">{isGu ? '🏆 સર્વોચ્ચ AI સ્કોર' : 'AI Quality Score (High)'}</option>
                <option value="quantity">{isGu ? '⚖️ મોટો જથ્થો (Quintals)' : 'Largest Lot Size'}</option>
                <option value="newest">{isGu ? '🆕 તાજેતરમાં લિસ્ટ થયેલ' : 'Recently Listed'}</option>
              </select>
            </div>

            {/* AI Quality Filter Toggle */}
            <div className="flex items-center gap-2 bg-[#141517] border border-[#212327] px-3.5 py-2 rounded-full text-xs font-mono min-h-[48px] flex-1 sm:flex-initial">
              <Award className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
              <span className="text-[#7d8187] uppercase text-[11px] whitespace-nowrap">{isGu ? 'લઘુત્તમ સ્કોર:' : 'Min AI:'}</span>
              <select
                value={minQualityScore}
                onChange={(e) => setMinQualityScore(Number(e.target.value))}
                className="bg-[#0a0a0a] text-white font-semibold focus:outline-none rounded-full px-2.5 py-1.5 min-h-[34px] border border-[#212327] cursor-pointer"
              >
                <option value={0}>{isGu ? 'તમામ ગ્રેડ' : 'All Quality Grades'}</option>
                <option value={85}>{isGu ? '85+ (ગ્રેડ A / A+)' : '85+ (Grade A / A+)'}</option>
                <option value={90}>{isGu ? '90+ (પ્રીમિયમ A+)' : '90+ (Grade A+ Premium)'}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono pt-1">
          <span className="text-xs text-[#7d8187] uppercase tracking-wider mr-1 shrink-0">
            {isGu ? 'કેટેગરી:' : 'Categories:'}
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 min-h-[38px] rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap active:scale-[0.95] flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-[#ff7a17] text-black shadow-md font-bold'
                  : 'bg-[#141517] text-white hover:bg-[#212327] active:bg-[#2d3036] border border-[#212327]'
              }`}
            >
              {cat === 'All' ? (isGu ? 'બધા (All)' : 'All') :
               cat === 'Grains' ? (isGu ? 'ધાન્ય (Grains)' : 'Grains') :
               cat === 'Vegetables' ? (isGu ? 'શાકભાજી (Vegetables)' : 'Vegetables') :
               cat === 'Commercial' ? (isGu ? 'રોકડિયા (Commercial)' : 'Commercial') :
               cat === 'Fruits' ? (isGu ? 'ફળફળાદી (Fruits)' : 'Fruits') :
               cat === 'Pulses' ? (isGu ? 'કઠોળ (Pulses)' : 'Pulses') : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Crop Cards */}
      {filteredAndSortedListings.length === 0 ? (
        <div className="bg-[#191919] border border-[#212327] rounded-3xl p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#7d8187] mx-auto" />
          <h3 className="font-serif-display text-2xl text-white">
            {isGu ? 'કોઈ પાક લિસ્ટિંગ મળ્યું નથી' : 'No crop lots match your filter'}
          </h3>
          <p className="text-xs text-[#7d8187]">
            {isGu ? 'સર્ચ અથવા ફિલ્ટર રીસેટ કરીને ફરી તપાસો.' : 'Try resetting search parameters or selecting another category.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setMinQualityScore(0);
              setSortBy('endingSoon');
            }}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-[#141517] hover:bg-[#212327] border border-[#212327] text-xs font-mono text-[#ff7a17] uppercase active:scale-[0.97] transition-all duration-150"
          >
            {isGu ? 'ફિલ્ટર રીસેટ કરો' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedListings.map((crop) => {
            const isHighlighted = recentlyBidCropId === crop.id;

            return (
              <div
                key={crop.id}
                className={`bg-[#191919] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted 
                    ? 'border-[#ff7a17] ring-2 ring-[#ff7a17]/50 shadow-xl' 
                    : 'border-[#212327] hover:border-white/30'
                }`}
              >
                
                <div>
                  {/* Image & Top Badges Header */}
                  <div className="relative h-52 overflow-hidden group bg-[#141517]">
                    <img
                      src={crop.imageUrl || DEFAULT_FALLBACK_IMAGES[crop.category] || DEFAULT_FALLBACK_IMAGES['Grains']}
                      alt={crop.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGES[crop.category] || DEFAULT_FALLBACK_IMAGES['Grains'];
                      }}
                    />
                    
                    {/* AI Quality Score Badge */}
                    <div className="absolute top-3 left-3 bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-[#212327] flex items-center gap-1.5 shadow-md">
                      <Award className="w-3.5 h-3.5 text-[#ff7a17]" />
                      <span>{t('qualityScore')}: {crop.aiQualityScore}/100</span>
                      <span className="text-[10px] bg-[#ff7a17] text-black px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                        {crop.qualityGrade}
                      </span>
                    </div>

                    {/* Organic Badge */}
                    {crop.organicCertified && (
                      <span className="absolute top-3 right-3 bg-[#0a0a0a]/90 text-[#ff7a17] border border-[#212327] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-md">
                        {isGu ? '૧૦૦% ઓર્ગેનિક' : t('organicCertified')}
                      </span>
                    )}

                    {/* Timer Badge */}
                    <div className="absolute bottom-3 left-3">
                      <CountdownTimer endTimeStr={crop.endTime} />
                    </div>

                    {/* Farmer Direct Badge */}
                    <div className="absolute bottom-3 right-3 bg-[#0a0a0a]/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-mono text-[#dadbdf] border border-[#212327] flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#ff7a17]" />
                      <span>{isGu ? 'ખેડૂત લિસ્ટિંગ' : 'Farmer Photo'}</span>
                    </div>
                  </div>

                  {/* Card Main Info Body */}
                  <div className="p-5 space-y-4">
                    
                    {/* Title & Farmer */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#7d8187] mb-1 font-mono">
                        <span className="uppercase tracking-wider text-[#ff7a17] font-bold">{crop.category}</span>
                        <span>{t('harvestDate')}: {crop.harvestDate}</span>
                      </div>

                      <h3 className="font-serif-display text-2xl text-white leading-tight">
                        {crop.cropName}
                      </h3>
                      <p className="text-xs text-[#7d8187] mt-0.5">{t('variety')}: {crop.variety}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-[#212327] text-xs text-[#dadbdf]">
                        <div className="flex items-center gap-2">
                          <img 
                            src={crop.farmerAvatar} 
                            alt={crop.farmerName} 
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-[#ff7a17]" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                          <span className="font-semibold text-white truncate">{crop.farmerName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 font-mono text-xs text-[#dadbdf]">
                            <MapPin className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                            {crop.farmerLocation.split(',')[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {onOpenCreditModal && (
                            <button
                              type="button"
                              onClick={onOpenCreditModal}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900/90 px-2 py-0.5 rounded-full border border-emerald-500/40 transition-colors"
                              title="Verified Kisan Credit Score"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>785 Credit</span>
                            </button>
                          )}

                          {onOpenReviews && (
                            <button
                              type="button"
                              onClick={onOpenReviews}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#ff7a17] bg-[#141517] hover:bg-[#212327] px-2 py-0.5 rounded-full border border-[#212327] transition-colors"
                              title="View Farmer Reviews"
                            >
                              <Star className="w-3 h-3 fill-[#ff7a17] text-[#ff7a17]" />
                              <span>{crop.farmerRating || 4.9}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Quantity & Moisture details */}
                    <div className="grid grid-cols-2 gap-2 bg-[#141517] p-3 rounded-xl border border-[#212327] text-xs font-mono">
                      <div>
                        <span className="text-[#7d8187] block text-[10px] uppercase">{t('quantityQuintals')}</span>
                        <strong className="text-white text-sm">{crop.quantityQuintals} Qtl</strong>
                      </div>
                      <div>
                        <span className="text-[#7d8187] block text-[10px] uppercase">{t('moistureLevel')}</span>
                        <strong className="text-white text-sm">{crop.moisturePercentage}%</strong>
                      </div>
                    </div>

                    {/* Pricing & Highest Bid Display */}
                    <div className="p-3.5 bg-[#141517] rounded-xl border border-[#212327] space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#7d8187] font-mono">
                        <span>{t('startingPrice')}:</span>
                        <span>₹{crop.startingPricePerQuintal.toLocaleString('en-IN')}/qtl</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#212327]">
                        <span className="text-xs font-mono text-[#ff7a17] flex items-center gap-1 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{isGu ? 'હાલની ઊંચી બોલી:' : t('currentHighestBid')}:</span>
                        </span>
                        <span className="font-serif-display text-2xl text-[#ff7a17] font-bold">
                          ₹{crop.currentHighestBid.toLocaleString('en-IN')} <span className="text-xs font-sans text-[#7d8187]">/qtl</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#7d8187] pt-1 font-mono">
                        <span>{t('activeBids')}: <strong className="text-white">{crop.bidCount}</strong></span>
                        <button
                          type="button"
                          onClick={() => setActiveHistoryCropId(crop.id)}
                          className="text-[#ff7a17] hover:underline flex items-center gap-1 uppercase min-h-[38px] px-2 py-1 rounded-lg active:bg-[#ff7a17]/10 transition-colors font-bold text-xs"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>{isGu ? 'ઓડિટ લોગ' : t('viewAuditLog')}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Card Bidding Action Area */}
                <div className="p-5 pt-0 space-y-3">
                  
                  {/* Quick Add Increment Pills */}
                  <div className="flex items-center justify-between gap-1 text-xs text-[#7d8187] font-mono">
                    <span className="text-[11px]">{isGu ? 'ઝડપી ઉમેરો:' : 'Quick +:'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(crop.id, crop.currentHighestBid, 50)}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-full bg-[#141517] border border-[#212327] hover:bg-[#212327] active:bg-[#ff7a17] active:text-black text-[#ff7a17] text-xs font-mono font-semibold transition-all duration-150 active:scale-[0.93] flex items-center justify-center"
                      >
                        +₹50
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(crop.id, crop.currentHighestBid, 100)}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-full bg-[#141517] border border-[#212327] hover:bg-[#212327] active:bg-[#ff7a17] active:text-black text-[#ff7a17] text-xs font-mono font-semibold transition-all duration-150 active:scale-[0.93] flex items-center justify-center"
                      >
                        +₹100
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(crop.id, crop.currentHighestBid, 250)}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-full bg-[#141517] border border-[#212327] hover:bg-[#212327] active:bg-[#ff7a17] active:text-black text-[#ff7a17] text-xs font-mono font-semibold transition-all duration-150 active:scale-[0.93] flex items-center justify-center"
                      >
                        +₹250
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(crop.id, crop.currentHighestBid, 500)}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-full bg-[#141517] border border-[#212327] hover:bg-[#212327] active:bg-[#ff7a17] active:text-black text-[#ff7a17] text-xs font-mono font-semibold transition-all duration-150 active:scale-[0.93] flex items-center justify-center"
                      >
                        +₹500
                      </button>
                    </div>
                  </div>

                  {/* Input Field + Place Bid Button */}
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-[#7d8187] pointer-events-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder={`> ₹${crop.currentHighestBid.toLocaleString('en-IN')}`}
                          value={bidInputs[crop.id] || ''}
                          onChange={(e) => handleBidInputChange(crop.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitBid(crop);
                          }}
                          className="w-full min-h-[46px] bg-[#141517] border border-[#212327] focus:border-[#ff7a17] rounded-full pl-8 pr-4 py-2.5 text-sm text-white placeholder-[#7d8187] focus:outline-none font-mono transition-all"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => submitBid(crop)}
                        className="w-full sm:w-auto min-h-[46px] bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-150 shrink-0 flex items-center justify-center gap-1.5 active:scale-[0.96] shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-black" />
                        <span>{isGu ? 'બોલી લગાવો' : t('placeBid')}</span>
                      </button>
                    </div>

                    {/* Dynamic Real-time Lot Valuation preview */}
                    {bidInputs[crop.id] && Number(bidInputs[crop.id].replace(/[^0-9]/g, '')) > 0 && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30 animate-in fade-in-50">
                        <span>{isGu ? 'કુલ લોટ કિંમત:' : 'Estimated Total Lot Value:'}</span>
                        <span className="font-bold">
                          ₹{(Number(bidInputs[crop.id].replace(/[^0-9]/g, '')) * crop.quantityQuintals).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    {/* Direct Buy & Finalize Mandi Order Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenOrderModal(crop)}
                      className="w-full min-h-[42px] bg-emerald-500/15 hover:bg-emerald-500/25 active:bg-emerald-500/35 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold font-mono py-2.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{isGu ? 'સીધો પાક ખરીદો & બિલ બનાવો (Firebase Save)' : 'Buy Stock Now & Generate Mandi Bill'}</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bid History Drawer / Modal (Fully Synced with Live State) */}
      {activeHistoryCrop && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#191919] border border-[#212327] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#212327]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#ff7a17]" />
                <h3 className="font-serif-display text-xl text-white">
                  {isGu ? 'હરાજી બોલી ઓડિટ લોગ' : 'Live Bid Audit Log'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveHistoryCropId(null)}
                className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-full text-white hover:bg-[#212327] active:bg-[#2d3036] bg-[#141517] flex items-center justify-center active:scale-90 transition-all duration-150"
                aria-label="Close Audit Log"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#141517] p-3.5 rounded-2xl border border-[#212327] flex items-center justify-between">
              <div>
                <p className="font-serif-display text-lg text-white font-bold">{activeHistoryCrop.cropName}</p>
                <p className="text-xs text-[#7d8187] font-mono">{activeHistoryCrop.farmerName} • {activeHistoryCrop.farmerLocation}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-[#7d8187] block uppercase">{isGu ? 'ટોપ બોલી' : 'Leading'}</span>
                <span className="text-lg text-[#ff7a17] font-bold">₹{activeHistoryCrop.currentHighestBid.toLocaleString('en-IN')}/qtl</span>
              </div>
            </div>

            {/* Bids List */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {activeHistoryCrop.bidsHistory.length === 0 ? (
                <div className="text-center p-8 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-[#7d8187] mx-auto" />
                  <p className="text-xs text-[#7d8187] italic font-mono">
                    {isGu ? 'હજુ સુધી કોઈ બોલી નોંધાઈ નથી. પ્રથમ બોલી લગાવો!' : 'No bids placed yet. Be the first bidder!'}
                  </p>
                </div>
              ) : (
                activeHistoryCrop.bidsHistory.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      b.isHighest
                        ? 'bg-[#141517] border-[#ff7a17] text-white shadow-sm'
                        : 'bg-[#141517] border-[#212327] text-[#dadbdf]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-bold text-white text-sm">{b.buyerName}</strong>
                        {b.isHighest && (
                          <span className="text-[10px] bg-[#ff7a17] text-black font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                            {isGu ? 'ટોપ બોલી' : 'TOP BID'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7d8187] font-mono mt-0.5">{b.buyerLocation} • {b.timestamp}</p>
                    </div>

                    <p className="font-serif-display text-lg text-[#ff7a17] font-bold">
                      ₹{b.amount.toLocaleString('en-IN')}/qtl
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#212327] flex justify-end">
              <button
                onClick={() => setActiveHistoryCropId(null)}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#141517] hover:bg-[#212327] active:bg-[#2d3036] text-white font-mono text-xs border border-[#212327] active:scale-[0.97] transition-all duration-150"
              >
                {isGu ? 'બંધ કરો' : 'Close Audit Log'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 1. MODAL: FINALISE TRADE & BUY STOCK (Saves to Firebase Firestore) */}
      {activeOrderCrop && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans-body">
          <div className="bg-[#191919] border border-[#212327] rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-white max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#212327]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl sm:text-2xl text-white font-bold">
                    {isGu ? 'સીધો પાક વેપાર & મંડી ઓર્ડર' : 'Finalize Mandi Trade & Order'}
                  </h3>
                  <p className="text-xs text-[#a0a4ab] font-mono">
                    Firebase Cloud Database Collection: <span className="text-emerald-400">marketplace_orders</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderCrop(null)}
                className="w-9 h-9 rounded-full bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] flex items-center justify-center text-[#a0a4ab] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Crop Summary */}
            <div className="p-4 bg-[#141517] rounded-2xl border border-[#212327] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ff7a17]/20 text-[#ff7a17] text-[11px] font-mono font-bold uppercase">
                    {activeOrderCrop.category}
                  </span>
                  <span className="font-serif-display text-lg font-bold text-white">
                    {activeOrderCrop.cropName} ({activeOrderCrop.variety})
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  AI Grade: {activeOrderCrop.qualityGrade} ({activeOrderCrop.aiQualityScore}/100)
                </span>
              </div>

              {/* Farmer Seller Info Card */}
              <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-start justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#7d8187] block">
                    {isGu ? 'ખેડૂત / વિક્રેતા (Farmer Seller):' : 'Farmer / Seller Profile:'}
                  </span>
                  <strong className="text-white text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#ff7a17]" />
                    {activeOrderCrop.farmerName}
                  </strong>
                  <p className="text-[#a0a4ab] font-mono text-[11px] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ff7a17]" />
                    {activeOrderCrop.farmerLocation}
                  </p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-[#7d8187] block uppercase text-[10px]">Available Stock</span>
                  <strong className="text-white text-sm">{activeOrderCrop.quantityQuintals} Qtl</strong>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              {orderError && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              {/* Buyer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#dadbdf] block mb-1">
                    {isGu ? 'ખરીદનારનું નામ (Buyer Name) *' : "Buyer's Full Legal Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={orderBuyerName}
                    onChange={(e) => setOrderBuyerName(e.target.value)}
                    placeholder="e.g. Anand Trading Corp / Ramesh Patel"
                    className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#555] outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#dadbdf] block mb-1">
                    {isGu ? 'સંપર્ક નંબર (Buyer Mobile) *' : "Buyer's Contact Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderBuyerPhone}
                    onChange={(e) => setOrderBuyerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#555] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Buyer Delivery Address */}
              <div>
                <label className="text-xs font-semibold text-[#dadbdf] block mb-1">
                  {isGu ? 'ખરીદનારનું ડિલિવરી સરનામું (Buyer Delivery Address) *' : "Buyer Delivery Mandi / Warehouse Address *"}
                </label>
                <textarea
                  rows={2}
                  required
                  value={orderBuyerAddress}
                  onChange={(e) => setOrderBuyerAddress(e.target.value)}
                  placeholder="Shop No. 42, Main APMC Market Yard, Anand, Gujarat - 388001"
                  className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-[#555] outline-none resize-none font-sans"
                />
              </div>

              {/* Amount of Stock Sold & Price per Quintal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#dadbdf]">
                      {isGu ? 'વેચાણ થયેલ સ્ટોક (Stock Sold) *' : 'Amount of Stock Sold *'}
                    </label>
                    <span className="text-[10px] font-mono text-[#ff7a17]">
                      Max: {activeOrderCrop.quantityQuintals} Qtl
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={activeOrderCrop.quantityQuintals}
                      value={orderQuantitySold}
                      onChange={(e) => setOrderQuantitySold(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none font-mono pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#7d8187]">
                      Quintals
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#dadbdf]">
                      {isGu ? 'ભાવ પ્રતિ ક્વિન્ટલ (Price / Qtl) *' : 'Agreed Price per Quintal *'}
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Live Top Bid: ₹{activeOrderCrop.currentHighestBid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#7d8187]">₹</span>
                    <input
                      type="number"
                      required
                      min={100}
                      value={orderPricePerQuintal}
                      onChange={(e) => setOrderPricePerQuintal(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-emerald-500 rounded-xl pl-7 pr-12 py-2.5 text-xs sm:text-sm text-white outline-none font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#7d8187]">
                      /Qtl
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Settlement Mode */}
              <div>
                <label className="text-xs font-semibold text-[#dadbdf] block mb-1">
                  {isGu ? 'ચુકવણી પદ્ધતિ (Settlement Method)' : 'Mandi Escrow / Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {['e-NAM Escrow UPI', 'APMC Bank RTGS', 'Gate Delivery COD'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setOrderPaymentMode(method)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        orderPaymentMode === method
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#0a0a0a] border-[#212327] text-[#a0a4ab] hover:border-[#383b42]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-[#141517] to-emerald-950/20 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#a0a4ab] block">
                    {isGu ? 'કુલ ચૂકવવાપાત્ર રકમ (Grand Total):' : 'Total Deal Value (Saved to Firestore):'}
                  </span>
                  <div className="text-xs font-mono text-[#7d8187] mt-0.5">
                    {orderQuantitySold} Qtl × ₹{orderPricePerQuintal.toLocaleString('en-IN')}/Qtl
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif-display text-2xl sm:text-3xl font-bold text-emerald-400">
                    ₹{(orderQuantitySold * orderPricePerQuintal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveOrderCrop(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#141517] hover:bg-[#212327] text-[#a0a4ab] hover:text-white text-xs font-mono transition-colors"
                >
                  {isGu ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isGu ? 'Firebase માં સાચવી રહ્યું છે...' : 'Saving to Firebase...'}</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>{isGu ? 'વેપાર પૂર્ણ કરો & Firebase માં સાચવો' : 'Confirm & Save to Firebase DB'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 2. MODAL: MANDI BILL / APMC OFFICIAL INVOICE RECEIPT */}
      {confirmedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans-body">
          <div className="bg-[#141517] border border-emerald-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-white max-h-[92vh] overflow-y-auto print:bg-white print:text-black">
            
            {/* Header / Seal */}
            <div className="flex items-start justify-between pb-4 border-b border-[#212327]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Firebase Synced • APMC SIH 2026</span>
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-white">
                  {isGu ? 'કિસાનસિંક સત્તાવાર મંડી બિલ' : 'Official APMC Mandi Trade Receipt'}
                </h3>
                <p className="text-xs text-[#a0a4ab] font-mono">
                  Order ID: <strong className="text-white">{confirmedReceiptOrder.orderId}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmedReceiptOrder(null)}
                className="w-9 h-9 rounded-full bg-[#1e2023] hover:bg-[#282b30] flex items-center justify-center text-[#a0a4ab] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#0a0a0a] p-4 rounded-2xl border border-[#212327]">
              <div>
                <span className="text-[#7d8187] uppercase text-[10px] block">Buyer (ખરીદનાર)</span>
                <strong className="text-white text-sm block mt-0.5">{confirmedReceiptOrder.buyerName}</strong>
                <p className="text-[#a0a4ab] text-[11px] mt-0.5">{confirmedReceiptOrder.buyerAddress}</p>
                {confirmedReceiptOrder.buyerPhone && (
                  <p className="text-emerald-400 text-[11px] mt-0.5">{confirmedReceiptOrder.buyerPhone}</p>
                )}
              </div>
              <div>
                <span className="text-[#7d8187] uppercase text-[10px] block">Farmer Seller (ખેડૂત વિક્રેતા)</span>
                <strong className="text-white text-sm block mt-0.5">{confirmedReceiptOrder.farmerSellerName}</strong>
                <p className="text-[#a0a4ab] text-[11px] mt-0.5">{confirmedReceiptOrder.farmerSellerAddress}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#212327] text-[#7d8187] text-[10px] uppercase">
                    <th className="pb-2">Commodity / Crop</th>
                    <th className="pb-2">Sold Stock</th>
                    <th className="pb-2">Price / Qtl</th>
                    <th className="pb-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#212327]">
                  <tr>
                    <td className="py-3">
                      <strong className="text-white text-sm font-sans block">{confirmedReceiptOrder.cropName}</strong>
                      <span className="text-[#7d8187] text-[11px]">{confirmedReceiptOrder.variety}</span>
                    </td>
                    <td className="py-3 font-bold text-white">
                      {confirmedReceiptOrder.quantitySoldQuintals} Qtl
                    </td>
                    <td className="py-3 text-white">
                      ₹{confirmedReceiptOrder.pricePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400 text-sm">
                      ₹{confirmedReceiptOrder.totalPrice.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#212327] flex items-center justify-between font-mono">
              <div>
                <span className="text-xs text-[#a0a4ab]">Status & Payment Mode:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {confirmedReceiptOrder.status}
                  </span>
                  <span className="text-xs text-[#dadbdf]">{confirmedReceiptOrder.paymentMode}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#7d8187] uppercase block">Grand Total Paid</span>
                <span className="font-serif-display text-2xl font-bold text-emerald-400">
                  ₹{confirmedReceiptOrder.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Firebase Database Live Sync Verification */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Saved in Firebase Firestore: <span className="text-white">marketplace_orders</span></span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">
                {confirmedReceiptOrder.timestamp}
              </span>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#212327] hover:bg-[#2d3036] text-white text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isGu ? 'બિલ પ્રિન્ટ કરો' : 'Print / Save Bill'}</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmedReceiptOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs font-mono transition-colors cursor-pointer"
              >
                {isGu ? 'થઈ ગયું (Done)' : 'Done'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. MODAL: FIREBASE ALL ORDERS DATABASE VIEWER */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans-body">
          <div className="bg-[#141517] border border-[#212327] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-white max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#212327]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white">
                    {isGu ? 'હરાજી ઓર્ડર ડેટાબેઝ (Firebase Firestore)' : 'Marketplace Orders Database (Firebase)'}
                  </h3>
                  <p className="text-xs text-[#a0a4ab] font-mono">
                    Project: <span className="text-emerald-400">{firebaseConfig.projectId}</span> • Collection:{' '}
                    <span className="text-[#ff7a17]">marketplace_orders</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOrdersModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#1e2023] hover:bg-[#282b30] flex items-center justify-center text-[#a0a4ab] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8187]" />
              <input
                type="text"
                placeholder={isGu ? 'ખરીદનાર, ખેડૂત, પાક અથવા સરનામું શોધો...' : 'Search by buyer, farmer seller, crop, address or order ID...'}
                value={searchOrdersQuery}
                onChange={(e) => setSearchOrdersQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#555] outline-none font-mono"
              />
            </div>

            {/* Orders List / Table */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {firebaseOrders.length === 0 ? (
                <div className="py-12 text-center text-[#7d8187] font-mono text-sm border border-dashed border-[#212327] rounded-2xl p-6">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-[#444]" />
                  <p>{isGu ? 'હજી કોઈ હરાજી ઓર્ડર નથી. સીધી ખરીદી કરીને પ્રથમ ઓર્ડર બનાવો!' : 'No marketplace orders saved yet. Click "Buy Stock Now" to create your first order!'}</p>
                </div>
              ) : (
                firebaseOrders
                  .filter((ord) => {
                    if (!searchOrdersQuery.trim()) return true;
                    const q = searchOrdersQuery.toLowerCase();
                    return (
                      ord.buyerName.toLowerCase().includes(q) ||
                      ord.farmerSellerName.toLowerCase().includes(q) ||
                      ord.cropName.toLowerCase().includes(q) ||
                      ord.buyerAddress.toLowerCase().includes(q) ||
                      ord.farmerSellerAddress.toLowerCase().includes(q) ||
                      ord.orderId.toLowerCase().includes(q)
                    );
                  })
                  .map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#212327] hover:border-emerald-500/40 transition-colors space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                            {ord.orderId}
                          </span>
                          <span className="font-serif-display text-base font-bold text-white">
                            {ord.cropName} ({ord.variety})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-[#7d8187]">{ord.timestamp}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono p-3 bg-[#141517] rounded-xl border border-[#212327]">
                        <div>
                          <span className="text-[#7d8187] uppercase text-[10px] block">Buyer (ખરીદનાર)</span>
                          <strong className="text-white text-sm">{ord.buyerName}</strong>
                          <p className="text-[#a0a4ab] text-[11px] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#ff7a17] shrink-0" />
                            {ord.buyerAddress}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#7d8187] uppercase text-[10px] block">Farmer Seller (ખેડૂત)</span>
                          <strong className="text-white text-sm">{ord.farmerSellerName}</strong>
                          <p className="text-[#a0a4ab] text-[11px] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            {ord.farmerSellerAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
                        <div className="flex items-center gap-4 text-[#dadbdf]">
                          <span>
                            Stock Sold: <strong className="text-white">{ord.quantitySoldQuintals} Qtl</strong>
                          </span>
                          <span>
                            Price: <strong className="text-white">₹{ord.pricePerQuintal.toLocaleString('en-IN')}/Qtl</strong>
                          </span>
                          {ord.paymentMode && (
                            <span className="text-[#7d8187]">Mode: {ord.paymentMode}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[#7d8187] text-[10px] block">Total Deal</span>
                          <span className="font-serif-display text-lg font-bold text-emerald-400">
                            ₹{ord.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#212327] flex items-center justify-between">
              <span className="text-xs font-mono text-[#a0a4ab]">
                Total Orders Saved: <strong className="text-emerald-400">{firebaseOrders.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOrdersModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#212327] hover:bg-[#2d3036] text-white text-xs font-mono transition-colors"
              >
                {isGu ? 'બંધ કરો' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
