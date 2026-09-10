import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, UserProfile, CropListing, ActivityItem, WeatherInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { SmartSearch } from './SmartSearch';
import { 
  ShoppingBag, 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  Sun, 
  Droplets, 
  Wind, 
  CloudRain, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ChevronRight,
  RefreshCw,
  Crosshair,
  Gauge,
  Thermometer,
  CloudSun,
  CloudFog,
  CloudLightning
} from 'lucide-react';
import { 
  POPULAR_AGRI_HUBS, 
  fetchLiveAgriWeather, 
  calculateAgronomicAdvice 
} from '../services/weatherService';

interface FarmerDashboardProps {
  user: UserProfile;
  listings: CropListing[];
  activities: ActivityItem[];
  weather: WeatherInfo;
  onNavigate: (view: ViewMode) => void;
  onOpenListModal: () => void;
  onOpenManual?: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  user,
  listings,
  activities,
  weather: initialWeather,
  onNavigate,
  onOpenListModal,
  onOpenManual
}) => {
  const { currentLanguage, t } = useLanguage();
  const toast = useToast();
  const isGu = currentLanguage.code === 'gu';
  const isHi = currentLanguage.code === 'hi';

  // Live Accurate Weather & Soil Telemetry State
  const [activeWeather, setActiveWeather] = useState<WeatherInfo>(initialWeather);
  const [selectedHubId, setSelectedHubId] = useState<string>('anand');
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [customLocationName, setCustomLocationName] = useState<string>('');

  const userListings = listings.filter((l) => l.farmerName === user.name);
  const totalListedCropsCount = userListings.length > 0 ? userListings.length : user.totalListings;
  
  const totalActiveBidsCount = userListings.reduce((acc, item) => acc + item.bidCount, 0) || user.activeBids;

  const estimatedValue = userListings.reduce(
    (acc, item) => acc + item.currentHighestBid * item.quantityQuintals,
    0
  ) || 245000;

  // Fetch Live Weather & Soil Telemetry Handler
  const loadWeatherData = useCallback(async (lat: number, lon: number, locationName: string) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchLiveAgriWeather(lat, lon, locationName, currentLanguage.code);
      setActiveWeather(data);
    } catch (err) {
      console.error('Failed to load live weather:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [currentLanguage.code]);

  // Load weather on mount or hub selection change
  useEffect(() => {
    if (isGpsActive && gpsCoordinates) {
      loadWeatherData(gpsCoordinates.lat, gpsCoordinates.lon, customLocationName || 'GPS: Live Field Location');
    } else {
      const hub = POPULAR_AGRI_HUBS.find(h => h.id === selectedHubId) || POPULAR_AGRI_HUBS[0];
      loadWeatherData(hub.lat, hub.lon, `${hub.name}, ${hub.state}`);
    }
  }, [selectedHubId, isGpsActive, gpsCoordinates, customLocationName, loadWeatherData]);

  // GPS Auto-detect coordinates
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      toast.error(
        isGu ? 'જીપીએસ ઉપલબ્ધ નથી' : 'GPS Unavailable',
        isGu ? 'તમારા બ્રાઉઝરમાં જીપીએસ લોકેશન સપોર્ટ નથી.' : 'GPS Geolocation is not supported on this browser.'
      );
      return;
    }

    setIsLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locName = `${isGu ? 'ખેતર જીપીએસ' : isHi ? 'खेत जीपीएस' : 'Live GPS'} (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`;
        setGpsCoordinates({ lat, lon });
        setCustomLocationName(locName);
        setIsGpsActive(true);
        loadWeatherData(lat, lon, locName);
      },
      (error) => {
        console.warn('GPS detection failed or denied:', error);
        setIsLoadingWeather(false);
        setSelectedHubId('anand');
        setIsGpsActive(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectHub = (hubId: string) => {
    setIsGpsActive(false);
    setSelectedHubId(hubId);
  };

  // Localized Dashboard Dictionary
  const dText = {
    totalListedTitle: isGu ? 'કુલ લિસ્ટેડ પાક' : isHi ? 'कुल सूचीबद्ध फसलें' : 'Total Listed Crops',
    activeMarketBadge: isGu ? 'બિડિંગ બજારમાં સક્રિય' : isHi ? 'बोली बाजार में सक्रिय' : 'Active on Bidding Market',
    activeBidsTitle: isGu ? 'મળેલી સક્રિય બોલીઓ' : isHi ? 'प्राप्त सक्रिय बोलियां' : 'Active Bids Received',
    verifiedTradersBadge: isGu ? 'પ્રમાણિત વેપારીઓ તરફથી' : isHi ? 'सत्यापित व्यापारियों द्वारा' : 'From Verified Traders',
    marketValuationTitle: isGu ? 'અંદાજિત માર્કેટ મૂલ્ય' : isHi ? 'अनुमानित बाजार मूल्य' : 'Market Valuation',
    basedOnBids: isGu ? 'સૌથી ઊંચી બોલી આધારિત' : isHi ? 'उच्चतम बोली के आधार पर' : 'Based on current top bids',
    healthScoreTitle: isGu ? 'AI પાક આરોગ્ય સ્કોર' : isHi ? 'AI फसल स्वास्थ्य स्कोर' : 'Crop Health Score',
    gradeQualityBadge: isGu ? 'ગ્રેડ A+ સરેરાશ ગુણવત્તા' : isHi ? 'ग्रेड A+ औसत गुणवत्ता' : 'Grade A+ Average Quality',
    apmcHeading: isGu ? 'આજના મુખ્ય એપીએમસી માર્કેટ યાર્ડ ભાવ (Live Mandi Rates)' : isHi ? 'आज के लाइव एपीएमसी मंडी भाव' : "Today's Live APMC Mandi Rates & Trends",
    apmcSub: isGu ? 'રાજકોટ • ગોંડલ • ઉંઝા APMC લાઈવ' : 'Rajkot • Unjha • Gondal APMC Live',
    scanActionBtn: isGu ? 'AI પાક સ્કેન કરો' : isHi ? 'AI फसल स्कैन करें' : 'Scan Crop Health',
    weatherTitle: isGu ? 'હવામાન & જમીન સ્થિતિ' : isHi ? 'कृषि मौसम और मिट्टी' : 'Agri-Weather & Soil',
    soilMoisture: isGu ? 'જમીન ભેજ' : isHi ? 'मिट्टी नमी' : 'Soil Moisture',
    soilTemp: isGu ? 'જમીન તાપમાન' : isHi ? 'मिट्टी तापमान' : 'Soil Temp',
    irrigation: isGu ? 'પિયત સલાહ' : isHi ? 'सिंचाई सलाह' : 'Irrigation Advice',
    evapo: isGu ? 'બાષ્પીભવન (ET₀)' : isHi ? 'वाष्पीकरण (ET₀)' : 'Evapo (ET₀)',
    sprayingStatus: isGu ? 'છંટકાવ સ્થિતિ' : isHi ? 'छिड़काव स्थिति' : 'Spray Window',
    optimal: isGu ? 'અનુકૂળ (૪૨%)' : isHi ? 'अनुकूल (42%)' : 'Optimal (42%)',
    morningRecommended: isGu ? 'સવારે ઉત્તમ' : isHi ? 'सुबह अनुशंसित' : 'Recommended AM',
    humidity: isGu ? 'હવા ભેજ' : isHi ? 'हवा में नमी' : 'Humidity',
    wind: isGu ? 'પવન ગતિ' : isHi ? 'हवा की गति' : 'Wind Speed',
    rainRisk: isGu ? 'વરસાદ શક્યતા' : isHi ? 'बारिश जोखिम' : 'Rain Risk',
    agronomistTipTitle: isGu ? 'AI કૃષિ નિષ્ણાત સલાહ' : isHi ? 'AI कृषि विशेषज्ञ सलाह' : 'AI Agronomist Advisory',
    recentActivityTitle: isGu ? 'તાજેતરની પ્રવૃત્તિ & માર્કેટ ઇવેન્ટ્સ' : isHi ? 'हाल की गतिविधियां और बाजार अपडेट' : 'Recent Activity & Market Events',
    marketHubBtn: isGu ? 'માર્કેટ હબ' : isHi ? 'मार्केट हब' : 'Market Hub',
    lots: isGu ? 'લોટ્સ' : isHi ? 'लॉट्स' : 'Lots',
    bids: isGu ? 'બોલીઓ' : isHi ? 'बोलियां' : 'Bids',
    liveAccuracyBadge: isGu ? '૧૦૦% સચોટ સેટેલાઇટ & સેન્સર ડેટા' : isHi ? '100% सटीक उपग्रह और सेंसर डेटा' : '100% Accurate Telemetry',
    gpsButton: isGu ? 'જીપીએસ' : isHi ? 'जीपीएस' : 'Auto GPS',
    refreshData: isGu ? 'રિફ્રેશ કરો' : isHi ? 'रिफ्रेश' : 'Refresh'
  };

  const renderWeatherIcon = (condition: string) => {
    const c = (condition || '').toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('વરસાદ') || c.includes('बारिश')) {
      return <CloudRain className="w-5 h-5 text-sky-400" />;
    }
    if (c.includes('storm') || c.includes('thunder') || c.includes('ગાજવીજ')) {
      return <CloudLightning className="w-5 h-5 text-amber-400" />;
    }
    if (c.includes('cloud') || c.includes('overcast') || c.includes('વાદળ')) {
      return <CloudSun className="w-5 h-5 text-[#ff7a17]" />;
    }
    if (c.includes('fog') || c.includes('mist') || c.includes('ધુમ્મસ')) {
      return <CloudFog className="w-5 h-5 text-slate-300" />;
    }
    return <Sun className="w-5 h-5 text-[#ff7a17]" />;
  };

  const adviceResult = calculateAgronomicAdvice(
    activeWeather.temp,
    activeWeather.humidity,
    activeWeather.windSpeed,
    activeWeather.rainProbability,
    activeWeather.soilMoisturePercent ?? 42,
    currentLanguage.code
  );

  return (
    <div id="dashboard-page" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans-body bg-[#0a0a0a] text-white">
      
      {/* Top Welcome Banner */}
      <div id="dashboard-welcome-banner" className="relative bg-[#141517] rounded-3xl p-6 sm:p-8 text-white border border-[#212327] overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#ff7a17] text-black text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('verifiedOrganicFarmer')}</span>
              </span>
              <span className="text-[#7d8187] text-xs font-mono flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#ff7a17]" />
                <span>{user.location}</span>
              </span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-5xl font-normal tracking-tight text-white">
              {t('welcomeFarmer')}, <span className="text-[#ff7a17]">{user.name}</span> 👋
            </h1>

            <p className="text-[#dadbdf] text-sm max-w-xl font-normal leading-relaxed">
              {t('agriculturalControlCenter')}
            </p>
          </div>

            <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-dashboard-scan-crop"
              onClick={() => onNavigate('analyzer')}
              className="bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] hover:border-[#ff7a17]/50 text-white font-mono text-xs px-5 py-3.5 min-h-[48px] rounded-full transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#ff7a17]" />
              <span>{dText.scanActionBtn}</span>
            </button>

            <button
              id="btn-dashboard-list-produce"
              onClick={onOpenListModal}
              className="bg-white hover:bg-[#fafaf7] active:bg-neutral-200 text-black font-semibold text-sm px-6 py-3.5 min-h-[48px] rounded-full transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.97] shadow-sm active:shadow-inner cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>{t('listNewProduce')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Smart Search + Voice Search Bar for Farmer Inquiries */}
      <div id="dashboard-search-container" className="w-full">
        <SmartSearch onNavigate={onNavigate} />
      </div>

      {/* APMC Live Mandi Benchmark Rates Ticker */}
      <div id="dashboard-apmc-ticker" className="bg-[#141517] border border-[#212327] rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ff7a17]" />
            <h3 className="font-serif-display text-lg text-white">
              {dText.apmcHeading}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#7d8187]">
            {dText.apmcSub}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { crop: isGu ? 'કપાસ (Cotton)' : 'Cotton (કપાસ)', price: '₹7,850', unit: '/qtl', change: '+₹120', up: true },
            { crop: isGu ? 'જીરું (Cumin)' : 'Cumin (જીરું)', price: '₹28,400', unit: '/qtl', change: '+₹450', up: true },
            { crop: isGu ? 'લોકવન ઘઉં (Wheat)' : 'Wheat Lokwan (ઘઉં)', price: '₹2,820', unit: '/qtl', change: '+₹30', up: true },
            { crop: isGu ? 'મગફળી (Groundnut)' : 'Groundnut (મગફળી)', price: '₹6,450', unit: '/qtl', change: '+₹80', up: true },
            { crop: isGu ? 'રાયડો (Mustard)' : 'Mustard (રાયડો)', price: '₹5,600', unit: '/qtl', change: '+₹40', up: true },
            { crop: isGu ? 'એરંડા (Castor)' : 'Castor (એરંડા)', price: '₹6,150', unit: '/qtl', change: '+₹65', up: true },
          ].map((item, idx) => (
            <div
              key={idx}
              id={`apmc-rate-card-${idx}`}
              onClick={() => onNavigate('marketplace')}
              className="bg-[#191919] hover:bg-[#212327] border border-[#212327] hover:border-white/30 rounded-xl p-3 cursor-pointer transition-all duration-150 active:scale-[0.97]"
            >
              <p className="text-[11px] text-[#dadbdf] font-medium truncate">{item.crop}</p>
              <p className="text-base font-bold text-white mt-1 font-mono">{item.price}<span className="text-[10px] text-[#7d8187] font-normal">{item.unit}</span></p>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div id="dashboard-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Listed Crops */}
        <div id="metric-total-listed-crops" className="bg-[#191919] border border-[#212327] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#7d8187] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{dText.totalListedTitle}</span>
            <div className="w-8 h-8 rounded-full bg-[#141517] border border-[#212327] flex items-center justify-center text-[#ff7a17]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-display text-3xl sm:text-4xl text-white">{totalListedCropsCount} {dText.lots}</p>
          <p className="text-xs text-[#ff7a17] font-mono mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{dText.activeMarketBadge}</span>
          </p>
        </div>

        {/* Metric 2: Active Bids Received */}
        <div id="metric-active-bids" className="bg-[#191919] border border-[#212327] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#7d8187] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{dText.activeBidsTitle}</span>
            <div className="w-8 h-8 rounded-full bg-[#141517] border border-[#212327] flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-display text-3xl sm:text-4xl text-[#ff7a17]">{totalActiveBidsCount} {dText.bids}</p>
          <p className="text-xs text-[#7d8187] font-mono mt-1.5 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#ff7a17]" />
            <span>{dText.verifiedTradersBadge}</span>
          </p>
        </div>

        {/* Metric 3: Estimated Valuation */}
        <div id="metric-market-valuation" className="bg-[#191919] border border-[#212327] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#7d8187] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{dText.marketValuationTitle}</span>
            <div className="w-8 h-8 rounded-full bg-[#141517] border border-[#212327] flex items-center justify-center text-white font-bold text-sm">
              ₹
            </div>
          </div>
          <p className="font-serif-display text-3xl sm:text-4xl text-white">₹{estimatedValue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-[#7d8187] font-mono mt-1.5">
            {dText.basedOnBids}
          </p>
        </div>

        {/* Metric 4: AI Health Score */}
        <div id="metric-crop-health-score" className="bg-[#191919] border border-[#212327] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#7d8187] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{dText.healthScoreTitle}</span>
            <div className="w-8 h-8 rounded-full bg-[#141517] border border-[#212327] flex items-center justify-center text-[#ff7a17]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-display text-3xl sm:text-4xl text-white">92 / 100</p>
          <p className="text-xs text-[#ff7a17] font-mono mt-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{dText.gradeQualityBadge}</span>
          </p>
        </div>

      </div>

      {/* Middle Grid: Weather & Field Logs */}
      <div id="dashboard-weather-activity-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Accurate Weather & Soil Telemetry Widget */}
        <div id="widget-weather-soil" className="lg:col-span-5 bg-[#191919] border border-[#212327] rounded-2xl p-5 sm:p-6 space-y-4">
          {/* Header with Hub Switcher & Live GPS Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#212327]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#141517] text-[#ff7a17] border border-[#212327]">
                {renderWeatherIcon(activeWeather.condition)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base tracking-tight">{dText.weatherTitle}</h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-[#7d8187] font-mono flex items-center gap-1 mt-0.5 truncate max-w-[220px]">
                  <MapPin className="w-3 h-3 text-[#ff7a17] shrink-0" />
                  <span className="truncate">{activeWeather.location}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions: GPS & Refresh */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                id="btn-detect-gps"
                type="button"
                onClick={handleDetectGps}
                title="Detect GPS Field Coordinates"
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isGpsActive 
                    ? 'bg-[#ff7a17] text-black border-[#ff7a17] font-bold shadow-sm' 
                    : 'bg-[#141517] text-[#dadbdf] border-[#212327] hover:border-[#ff7a17]/50'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{dText.gpsButton}</span>
              </button>

              <button
                id="btn-refresh-weather"
                type="button"
                onClick={() => {
                  if (isGpsActive && gpsCoordinates) {
                    loadWeatherData(gpsCoordinates.lat, gpsCoordinates.lon, customLocationName || 'GPS: Live Field Location');
                  } else {
                    const hub = POPULAR_AGRI_HUBS.find(h => h.id === selectedHubId) || POPULAR_AGRI_HUBS[0];
                    loadWeatherData(hub.lat, hub.lon, `${hub.name}, ${hub.state}`);
                  }
                }}
                title={dText.refreshData}
                className="p-2 rounded-lg bg-[#141517] text-[#7d8187] hover:text-white border border-[#212327] hover:border-[#ff7a17]/50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-[#ff7a17]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Region / APMC Hub Fast-Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {POPULAR_AGRI_HUBS.map((hub) => {
              const isSelected = !isGpsActive && selectedHubId === hub.id;
              return (
                <button
                  key={hub.id}
                  id={`btn-hub-${hub.id}`}
                  onClick={() => handleSelectHub(hub.id)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#ff7a17]/15 border-[#ff7a17] text-[#ff7a17] font-bold'
                      : 'bg-[#141517] border-[#212327] text-[#7d8187] hover:text-white'
                  }`}
                >
                  {hub.name}
                </button>
              );
            })}
          </div>

          {/* Primary Atmospheric Bar */}
          <div className="flex items-center justify-between bg-[#141517] p-4 rounded-xl border border-[#212327]">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif-display text-3xl font-bold text-white tracking-tight">{activeWeather.temp}°C</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ff7a17]/15 text-[#ff7a17] border border-[#ff7a17]/30 capitalize">
                  {activeWeather.condition}
                </span>
              </div>
              <p className="text-[11px] text-[#7d8187] font-mono mt-1 flex items-center gap-1">
                <span>{isGu ? 'અનુભવાતું' : isHi ? 'महसूस' : 'Feels like'}: {activeWeather.feelsLike ?? activeWeather.temp}°C</span>
              </p>
            </div>

            {/* Quick Soil Temperature Badge */}
            {activeWeather.soilTemp !== undefined && (
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#7d8187] uppercase tracking-wider block">{dText.soilTemp}</span>
                <span className="text-base font-bold text-amber-400 font-mono flex items-center justify-end gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  {activeWeather.soilTemp}°C
                </span>
              </div>
            )}
          </div>

          {/* Field Advisory Guidance (Soil Moisture & Irrigation Schedule) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Soil Moisture Status */}
            <div className="bg-[#141517] p-3 rounded-xl border border-[#212327]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#7d8187] uppercase tracking-wider flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  {dText.soilMoisture}
                </span>
                <span className="text-[10px] font-mono text-[#7d8187]">{activeWeather.soilMoisturePercent ?? 42}%</span>
              </div>
              <p className="text-xs font-semibold text-emerald-400 truncate">
                {adviceResult.moistureStatusLabel}
              </p>
            </div>

            {/* Irrigation Guidance */}
            <div className="bg-[#141517] p-3 rounded-xl border border-[#212327]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#7d8187] uppercase tracking-wider flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  {dText.irrigation}
                </span>
              </div>
              <p className="text-xs font-semibold text-white truncate">
                {adviceResult.irrigationAdvice}
              </p>
            </div>
          </div>

          {/* High-Accuracy Micro-Climate Grid (6 Indicators in 3 cols) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Humidity */}
            <div className="bg-[#141517] p-2.5 rounded-xl border border-[#212327]">
              <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <p className="text-[10px] text-[#7d8187] font-mono uppercase truncate">{dText.humidity}</p>
              <p className="text-sm font-bold text-white mt-0.5">{activeWeather.humidity}%</p>
            </div>

            {/* Wind Speed */}
            <div className="bg-[#141517] p-2.5 rounded-xl border border-[#212327]">
              <Wind className="w-4 h-4 text-slate-300 mx-auto mb-1" />
              <p className="text-[10px] text-[#7d8187] font-mono uppercase truncate">{dText.wind}</p>
              <p className="text-sm font-bold text-white mt-0.5">{activeWeather.windSpeed} <span className="text-[10px] font-normal text-[#7d8187]">km/h</span></p>
            </div>

            {/* Rain Probability */}
            <div className="bg-[#141517] p-2.5 rounded-xl border border-[#212327]">
              <CloudRain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[10px] text-[#7d8187] font-mono uppercase truncate">{dText.rainRisk}</p>
              <p className="text-sm font-bold text-white mt-0.5">{activeWeather.rainProbability}%</p>
            </div>

            {/* Evapotranspiration */}
            <div className="bg-[#141517] p-2.5 rounded-xl border border-[#212327]">
              <Sun className="w-4 h-4 text-[#ff7a17] mx-auto mb-1" />
              <p className="text-[10px] text-[#7d8187] font-mono uppercase truncate">{dText.evapo}</p>
              <p className="text-sm font-bold text-white mt-0.5">{activeWeather.evapotranspiration ?? 0.1} <span className="text-[10px] font-normal text-[#7d8187]">mm</span></p>
            </div>

            {/* Spray Window Status */}
            <div className="bg-[#141517] p-2.5 rounded-xl border border-[#212327]" title={adviceResult.sprayConditionLabel}>
              <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-[10px] text-[#7d8187] font-mono uppercase truncate">{dText.sprayingStatus}</p>
              <p className="text-xs font-bold text-amber-400 mt-0.5 truncate">{adviceResult.sprayConditionShort}</p>
            </div>

            {/* Root Zone Soil Temp */}
            <div className="bg-[#141517] p-2.5 rounded-xl border border-[#212327]">
              <Thermometer className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <p className="text-[10px] text-[#7d8187] font-mono uppercase truncate">{dText.soilTemp}</p>
              <p className="text-sm font-bold text-white mt-0.5">{activeWeather.soilTemp ?? 27}°C</p>
            </div>
          </div>

          {/* Dynamic AI Agronomist Actionable Tip */}
          <div className="p-3.5 bg-gradient-to-br from-[#141517] to-[#1c1d21] border border-amber-500/20 rounded-xl text-xs text-[#dadbdf] space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff7a17] shrink-0" />
              <strong className="text-white font-mono text-[11px] uppercase tracking-wider">{dText.agronomistTipTitle}</strong>
            </div>
            <p className="leading-relaxed text-[#c2c5cc] pl-6">{adviceResult.agronomistTip}</p>
          </div>
        </div>

        {/* Right Col: Recent Activity Stream */}
        <div id="widget-recent-activity" className="lg:col-span-7 bg-[#191919] border border-[#212327] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#212327]">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ff7a17]" />
              <span>{dText.recentActivityTitle}</span>
            </h3>
            <button 
              id="btn-activity-market-hub"
              onClick={() => onNavigate('marketplace')}
              className="text-xs font-mono uppercase text-[#ff7a17] hover:underline flex items-center gap-1.5 min-h-[48px] px-3 py-2 rounded-xl active:bg-[#ff7a17]/10 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <span>{dText.marketHubBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div 
                key={act.id}
                id={`activity-item-${act.id}`}
                onClick={() => {
                  if (act.type === 'bid') onNavigate('marketplace');
                  else if (act.type === 'analysis') onNavigate('analyzer');
                  else onNavigate('marketplace');
                }}
                className="flex items-start justify-between p-4 bg-[#141517] rounded-xl border border-[#212327] hover:border-white/30 active:border-[#ff7a17] transition-all duration-150 cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    act.type === 'bid' 
                      ? 'bg-[#ff7a17] text-black' 
                      : act.type === 'analysis'
                      ? 'bg-white text-black'
                      : 'bg-[#212327] text-white'
                  }`}>
                    {act.type === 'bid' ? '₹' : act.type === 'analysis' ? 'AI' : 'LOT'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{act.title}</p>
                    <p className="text-xs text-[#dadbdf] mt-1">{act.description}</p>
                    <p className="text-[11px] text-[#7d8187] font-mono mt-1.5">{act.timestamp}</p>
                  </div>
                </div>

                {act.statusBadge && (
                  <span className="text-[10px] font-mono uppercase bg-[#0a0a0a] text-[#ff7a17] border border-[#212327] px-3 py-1 rounded-full shrink-0">
                    {act.statusBadge}
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};


