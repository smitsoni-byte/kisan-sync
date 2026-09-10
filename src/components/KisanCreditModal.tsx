import React, { useState } from 'react';
import { KisanCreditProfile, TradeLedgerItem, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  exportTradeLedgerPDF, 
  exportInvoicePDF, 
  exportCreditPassportPDF 
} from '../utils/pdfExport';
import { 
  X, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Landmark, 
  Receipt, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  FileText, 
  CreditCard, 
  Check, 
  Share2, 
  Sliders, 
  Search, 
  Filter, 
  Calendar, 
  Coins, 
  ExternalLink,
  ChevronRight,
  Printer,
  QrCode,
  Percent,
  CheckCheck,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

interface KisanCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  creditProfile: KisanCreditProfile;
  tradeLedger: TradeLedgerItem[];
  onOpenScan?: () => void;
}

export const KisanCreditModal: React.FC<KisanCreditModalProps> = ({
  isOpen,
  onClose,
  user,
  creditProfile,
  tradeLedger,
  onOpenScan
}) => {
  const { currentLanguage } = useLanguage();
  const toast = useToast();
  const isGu = currentLanguage.code === 'gu';

  const [activeTab, setActiveTab] = useState<'score' | 'credit' | 'ledger' | 'booster'>('score');
  
  // Trade Ledger filtering & search
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<TradeLedgerItem | null>(null);

  // PDF Export States
  const [isExportingLedger, setIsExportingLedger] = useState<boolean>(false);
  const [isExportingInvoice, setIsExportingInvoice] = useState<boolean>(false);

  // Loan Calculator state
  const [loanAmount, setLoanAmount] = useState<number>(350000);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(12);
  const [isApplyingLoan, setIsApplyingLoan] = useState<boolean>(false);
  const [hasAppliedLoan, setHasAppliedLoan] = useState<boolean>(false);

  // Score booster simulated state
  const [completedBoosters, setCompletedBoosters] = useState<Record<string, boolean>>({
    b1: true,
    b2: false,
    b3: false
  });

  if (!isOpen) return null;

  // Filter trade ledger
  const filteredLedger = tradeLedger.filter((item) => {
    const matchesSeason = selectedSeason === 'all' || item.season.toLowerCase().includes(selectedSeason.toLowerCase());
    const matchesQuery = 
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeason && matchesQuery;
  });

  // Calculate dynamic boosted score
  const bonusPoints = Object.entries(completedBoosters).reduce((acc, [id, completed]) => {
    if (completed && id !== 'b1') {
      const b = creditProfile.scoreBoostActions.find(a => a.id === id);
      return acc + (b ? b.points : 0);
    }
    return acc;
  }, 0);

  const displayScore = Math.min(900, creditProfile.overallScore + bonusPoints);

  // Calculation for loan calculator
  const effectiveAnnualRate = creditProfile.subsidizedInterestRate; // 4%
  const standardAnnualRate = creditProfile.standardInterestRate; // 7%
  const subsidizedInterest = Math.round((loanAmount * effectiveAnnualRate * (loanTenureMonths / 12)) / 100);
  const standardInterest = Math.round((loanAmount * standardAnnualRate * (loanTenureMonths / 12)) / 100);
  const totalSubventionSavings = standardInterest - subsidizedInterest;

  // Cumulative Trade Stats
  const totalTurnover = tradeLedger.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalExtraGain = tradeLedger.reduce((acc, i) => acc + i.gainOverMandi, 0);
  const totalQuantitySold = tradeLedger.reduce((acc, i) => acc + i.quantityQuintals, 0);

  const handleToggleBooster = (id: string) => {
    const nextState = !completedBoosters[id];
    setCompletedBoosters(prev => ({ ...prev, [id]: nextState }));
    
    const booster = creditProfile.scoreBoostActions.find(a => a.id === id);
    if (nextState && booster) {
      toast.success(
        isGu ? 'ક્રેડિટ પોઇન્ટ્સ ઉમેરાયા!' : 'Credit Boost Earned!',
        isGu ? `+${booster.points} પોઇન્ટ્સ કિસાન ક્રેડિટ સ્કોરમાં ઉમેરાયા છે.` : `+${booster.points} points added to your Kisan Credit Score.`
      );
    }
  };

  const handleApplyLoan = () => {
    setIsApplyingLoan(true);
    setTimeout(() => {
      setIsApplyingLoan(false);
      setHasAppliedLoan(true);
      toast.success(
        isGu ? 'કેસીસી લોન અરજી મંજૂર થઈ!' : 'KCC Loan Application Dispatched!',
        isGu 
          ? `₹${loanAmount.toLocaleString('en-IN')} ની પ્રી-એપ્રૂવ્ડ મર્યાદા SBI એગ્રી બ્રાન્ચ સાથે પ્રોસેસ થઈ રહી છે.`
          : `Pre-approved limit of ₹${loanAmount.toLocaleString('en-IN')} is forwarded to your linked SBI Agri branch.`
      );
    }, 800);
  };

  // Export Full Trade Ledger to PDF
  const handleExportTradeLedger = (scope: 'all' | 'filtered' = 'all') => {
    setIsExportingLedger(true);
    const targetList = scope === 'filtered' ? filteredLedger : tradeLedger;
    const seasonLabel = scope === 'filtered' ? (selectedSeason === 'all' ? 'All Seasons' : selectedSeason) : 'All Seasons';

    setTimeout(() => {
      try {
        const filename = exportTradeLedgerPDF(user, creditProfile, targetList, seasonLabel);
        setIsExportingLedger(false);
        toast.success(
          isGu ? 'વેપાર ખાતાવહી PDF રિપોર્ટ ડાઉનલોડ થયો!' : 'Trade Ledger PDF Report Downloaded!',
          isGu 
            ? `${targetList.length} સોદાનો સંપૂર્ણ પ્રમાણિત રિપોર્ટ (${filename}) સેવ થયો છે.`
            : `Verified statement of ${targetList.length} lots (₹${targetList.reduce((s, i) => s + i.totalAmount, 0).toLocaleString('en-IN')}) saved as PDF.`
        );
      } catch (err) {
        setIsExportingLedger(false);
        console.error('PDF Export error:', err);
        toast.error('Export Failed', 'Could not generate Trade Ledger PDF report. Please retry.');
      }
    }, 350);
  };

  // Export Single Lot Tax Invoice to PDF
  const handleExportSingleInvoice = (trade: TradeLedgerItem) => {
    setIsExportingInvoice(true);
    setTimeout(() => {
      try {
        const filename = exportInvoicePDF(trade, user);
        setIsExportingInvoice(false);
        toast.success(
          isGu ? 'ટેક્સ ઇન્વૉઇસ PDF ડાઉનલોડ થયું!' : 'Tax Invoice PDF Downloaded!',
          isGu 
            ? `${trade.taxInvoiceNo} (${trade.cropName}) નું અધિકૃત ઇન્વૉઇસ ડાઉનલોડ થઈ ગયું.`
            : `Official invoice ${trade.taxInvoiceNo} for ${trade.cropName} saved as PDF.`
        );
      } catch (err) {
        setIsExportingInvoice(false);
        console.error('Invoice PDF Export error:', err);
        toast.error('Export Failed', 'Could not generate Tax Invoice PDF. Please retry.');
      }
    }, 300);
  };

  // Download Kisan Credit Passport PDF
  const handleDownloadPassport = () => {
    try {
      const filename = exportCreditPassportPDF(user, creditProfile);
      toast.success(
        isGu ? 'ડિજિટલ ક્રેડિટ પાસપોર્ટ ડાઉનલોડ થયો!' : 'Kisan Credit Passport Downloaded!',
        isGu ? `તમારું અધિકૃત નાબાર્ડ/એસબીઆઈ માન્ય પ્રમાણપત્ર (${filename}) તૈયાર છે.` : `Your official verified KisanSync Credit Certificate (${filename}) is saved.`
      );
    } catch (err) {
      console.error('Passport PDF Export error:', err);
      toast.error('Export Failed', 'Could not generate Credit Passport PDF.');
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-[#141517] border border-[#212327] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-[#0a0a0a] border-b border-[#212327] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff7a17] text-black flex items-center justify-center font-bold shadow-md shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-xl sm:text-2xl text-white font-bold tracking-tight">
                  {isGu ? 'કિસાન ક્રેડિટ & વેપાર ઇતિહાસ સ્કોર' : 'Kisan Credit & Trade History Score'}
                </h2>
                <span className="bg-[#ff7a17]/20 text-[#ff7a17] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#ff7a17]/40 uppercase shrink-0">
                  NABARD • CIBIL Verified
                </span>
              </div>
              <p className="text-xs text-[#7d8187] font-mono mt-0.5">
                Farmer: <strong className="text-white">{user.name}</strong> • Account: {user.id} • {user.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#191919] hover:bg-[#212327] text-[#dadbdf] hover:text-white border border-[#212327] transition-all shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 bg-[#0f1012] border-b border-[#212327] overflow-x-auto no-scrollbar">
          {[
            { id: 'score', label: isGu ? 'ક્રેડિટ સ્કોર & વિશ્લેષણ' : 'Credit Score & Factors', icon: Award },
            { id: 'credit', label: isGu ? 'કેસીસી લોન & ધિરાણ' : 'Pre-Approved KCC Loan', icon: Landmark, badge: '₹6.5L' },
            { id: 'ledger', label: isGu ? 'વેપાર ખાતાવહી & ઇન્વૉઇસ' : 'Trade Ledger & Invoices', icon: Receipt, badge: `${tradeLedger.length} Lots` },
            { id: 'booster', label: isGu ? 'સ્કોર બૂસ્ટર & સિમ્યુલેટર' : 'Score Booster & Tips', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'border-[#ff7a17] text-white bg-[#191919]/60 font-semibold rounded-t-xl'
                    : 'border-transparent text-[#7d8187] hover:text-white hover:bg-[#141517]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff7a17]' : 'text-[#7d8187]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#ff7a17] text-black' : 'bg-[#212327] text-[#ff7a17]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0a0a0a]">
          
          {/* TAB 1: Credit Score & Factor Breakdown */}
          {activeTab === 'score' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Main Score Hero Card */}
              <div className="bg-[#141517] border border-[#212327] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Radial Gauge / Big Score Presentation */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-4 bg-[#0a0a0a] border border-[#212327] rounded-2xl relative">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#ff7a17] font-semibold mb-2">
                      {isGu ? 'કિસાન ક્રેડિટ સ્કોર (CIBIL-Agri)' : 'Agri Credit Trust Rating'}
                    </span>

                    <div className="relative flex items-center justify-center my-2">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-8 border-[#212327] border-t-[#ff7a17] border-r-emerald-500 border-b-emerald-400 flex flex-col items-center justify-center shadow-2xl bg-[#141517]">
                        <span className="font-serif-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                          {displayScore}
                        </span>
                        <span className="text-xs text-[#7d8187] font-mono">/ 900</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isGu ? creditProfile.ratingLabelGu : creditProfile.ratingLabel}</span>
                      </span>
                      <p className="text-[11px] text-[#7d8187] font-mono mt-1">
                        {isGu ? 'ગુજરાતના ટોચના ૪% સૌથી વિશ્વસનીય ખેડૂતોમાં સ્થાન' : 'Top 4% of Certified Trusted Farmers in Gujarat'}
                      </p>
                    </div>
                  </div>

                  {/* Highlights and Linked Badges */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <h3 className="font-serif-display text-2xl text-white font-bold">
                        {isGu ? 'સંસ્થાકીય ધિરાણ અને વેપાર વિશ્વસનીયતા' : 'Institutional Credit & Trade Trustworthiness'}
                      </h3>
                      <p className="text-sm text-[#dadbdf] mt-1 leading-relaxed">
                        {isGu 
                          ? 'તમારો સ્કોર પાક ગુણવત્તા, સમયસર એસ્ક્રો ડિલિવરી, બેંક કેસીસી ચુકવણી અને જમીન આરોગ્ય પ્રમાણપત્ર પરથી ગણાય છે.'
                          : 'Your dynamic Kisan Credit Score is evaluated from verified AI crop health diagnostics, on-time mandi deliveries, KCC loan subvention eligibility, and PMFBY risk resilience.'}
                      </p>
                    </div>

                    {/* Quick Metric Pills Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-[#191919] p-3 rounded-xl border border-[#212327]">
                        <p className="text-[10px] text-[#7d8187] font-mono uppercase">{isGu ? 'ઓન-ટાઇમ ડિલિવરી' : 'On-Time Delivery'}</p>
                        <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{creditProfile.onTimeFulfillmentRate}%</p>
                        <span className="text-[10px] text-[#7d8187]">{creditProfile.tradeCount} Lots Dispatched</span>
                      </div>

                      <div className="bg-[#191919] p-3 rounded-xl border border-[#212327]">
                        <p className="text-[10px] text-[#7d8187] font-mono uppercase">{isGu ? 'સરેરાશ એઆઈ ગુણવત્તા' : 'Avg AI Quality'}</p>
                        <p className="text-lg font-bold text-[#ff7a17] font-mono mt-0.5">{creditProfile.averageAiQualityScore}/100</p>
                        <span className="text-[10px] text-[#7d8187]">Grade A+ Standard</span>
                      </div>

                      <div className="bg-[#191919] p-3 rounded-xl border border-[#212327] col-span-2 sm:col-span-1">
                        <p className="text-[10px] text-[#7d8187] font-mono uppercase">{isGu ? 'કુલ વેપાર ટર્નઓવર' : 'Trade Volume'}</p>
                        <p className="text-lg font-bold text-white font-mono mt-0.5">₹{(creditProfile.totalTradeVolume / 100000).toFixed(2)}L</p>
                        <span className="text-[10px] text-emerald-400">100% Escrow Settled</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('credit')}
                        className="bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-2"
                      >
                        <Landmark className="w-4 h-4 text-black" />
                        <span>{isGu ? 'કેસીસી લોન મર્યાદા જુઓ (₹૬.૫૦ લાખ)' : 'View Pre-Approved Loan (₹6.50L)'}</span>
                      </button>

                      <button
                        onClick={handleDownloadPassport}
                        className="bg-[#191919] hover:bg-[#212327] text-white border border-[#212327] font-mono text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-[#ff7a17]" />
                        <span>{isGu ? 'ક્રેડિટ પાસપોર્ટ ડાઉનલોડ' : 'Credit Passport PDF'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Core Pillars Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-display text-lg text-white font-bold flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#ff7a17]" />
                    <span>{isGu ? 'સ્કોર નક્કી કરતાં ૫ મુખ્ય પરિબળો (5 Credit Pillars)' : '5 Scoring Pillars & Weightage Breakdown'}</span>
                  </h3>
                  <span className="text-xs font-mono text-[#7d8187]">Total Weight: 100%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creditProfile.factors.map((factor) => (
                    <div key={factor.id} className="bg-[#141517] border border-[#212327] rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white">
                            {isGu ? factor.nameGu : factor.name}
                          </p>
                          <span className="text-[11px] font-mono text-[#ff7a17] font-semibold">
                            Weight: {factor.weight}%
                          </span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-base font-bold text-emerald-400">
                            {factor.score}/100
                          </span>
                          <span className="block text-[10px] text-emerald-300 font-semibold uppercase">
                            {factor.status}
                          </span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="w-full h-2 bg-[#212327] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#ff7a17] to-emerald-400 rounded-full"
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>

                      <p className="text-xs text-[#dadbdf] leading-relaxed">
                        {isGu ? factor.detailsGu : factor.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Pre-Approved KCC Loan & Credit Card */}
          {activeTab === 'credit' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Pre-Approved Card Banner */}
              <div className="bg-gradient-to-br from-[#1b1c20] via-[#141517] to-[#0d0e10] border border-[#ff7a17]/40 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#ff7a17] text-black text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>PRE-APPROVED INSTITUTIONAL CREDIT</span>
                      </span>
                      <span className="text-xs font-mono text-[#dadbdf]">SBI & NABARD Linked</span>
                    </div>

                    <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-white">
                      ₹{(creditProfile.preApprovedLoanLimit / 100000).toFixed(2)} Lakhs <span className="text-[#ff7a17] text-xl sm:text-2xl font-normal">@ 4.0% Subsidized</span>
                    </h3>

                    <p className="text-sm text-[#dadbdf] leading-relaxed">
                      {isGu
                        ? 'તમારા ૭૮૫ કિસાન ક્રેડિટ સ્કોરના આધારે, તમે ૩% વ્યાજ સબવેન્શન સાથે ઇન્સ્ટન્ટ કેસીસી ક્રેડિટ લિમિટ મેળવવા માટે પાત્ર છો.'
                        : 'Based on your 785 Kisan Credit Score, you qualify for instant KCC working capital limit under the Central Interest Subvention Scheme (4% effective annual interest).'}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-[#dadbdf] pt-2">
                      <div>
                        <span className="text-[#7d8187] block">Standard Rate:</span>
                        <span className="line-through text-red-400">7.0% p.a.</span>
                      </div>
                      <div>
                        <span className="text-[#7d8187] block">Govt Subvention:</span>
                        <span className="text-emerald-400 font-bold">-3.0% Rebate</span>
                      </div>
                      <div>
                        <span className="text-[#7d8187] block">Your Rate:</span>
                        <span className="text-[#ff7a17] font-bold text-sm">4.0% p.a.</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital KCC Card Simulation */}
                  <div className="lg:col-span-5">
                    <div className="bg-gradient-to-br from-[#1f2125] to-[#121316] p-6 rounded-2xl border border-white/20 shadow-2xl relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-5 h-5 text-[#ff7a17]" />
                          <span className="font-bold font-serif-display text-sm tracking-wider">KISANSYNC AGRI-CARD</span>
                        </div>
                        <span className="text-[10px] font-mono bg-[#ff7a17] text-black font-bold px-2 py-0.5 rounded">
                          PLATINUM
                        </span>
                      </div>

                      <div className="py-2">
                        <p className="text-xs font-mono text-[#7d8187]">CARD HOLDER</p>
                        <p className="text-base font-bold text-white tracking-wide">{user.name}</p>
                        <p className="text-xs font-mono text-[#dadbdf] mt-1">KCC No: 4820 •••• •••• 9104</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#212327] pt-3 text-xs font-mono">
                        <div>
                          <p className="text-[10px] text-[#7d8187]">APPROVED LIMIT</p>
                          <p className="text-sm font-bold text-emerald-400">₹6,50,000</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#7d8187]">BANK BRANCH</p>
                          <p className="text-white font-semibold">SBI Agri Anand</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Interactive KCC Loan Calculator & Instant Drawdown */}
              <div className="bg-[#141517] border border-[#212327] rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#212327] pb-4">
                  <div>
                    <h4 className="font-serif-display text-xl text-white font-bold flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#ff7a17]" />
                      <span>{isGu ? 'કેસીસી ધિરાણ કેલ્ક્યુલેટર & ઉપાડ (Instant Loan Simulator)' : 'KCC Loan Calculator & Instant Disbursement'}</span>
                    </h4>
                    <p className="text-xs text-[#7d8187] font-mono mt-1">
                      {isGu ? 'બિયારણ, ખાતર અને કૃષિ ઇનપુટ માટે જરૂરી રકમ પસંદ કરો' : 'Simulate seasonal credit for seeds, fertilizers, and drip irrigation'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Slider controls */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-mono text-[#dadbdf] uppercase font-bold">
                          {isGu ? 'જરૂરી ધિરાણ રકમ (Loan Amount):' : 'Required Working Capital:'}
                        </label>
                        <span className="font-mono text-lg font-bold text-[#ff7a17]">
                          ₹{loanAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="50000"
                        max="650000"
                        step="25000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full accent-[#ff7a17] cursor-pointer h-2 bg-[#212327] rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-[#7d8187] mt-1">
                        <span>₹50,000 (Min)</span>
                        <span>₹3,50,000</span>
                        <span>₹6,50,000 (Max Limit)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-mono text-[#dadbdf] uppercase font-bold">
                          {isGu ? 'મુદ્દત (Tenure Months / Seasonal):' : 'Tenure (Repayment at Harvest):'}
                        </label>
                        <span className="font-mono text-base font-bold text-white">
                          {loanTenureMonths} Months ({loanTenureMonths <= 6 ? '1 Season (Kharif)' : '2 Seasons (Annual)'})
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[6, 12, 24].map((m) => (
                          <button
                            key={m}
                            onClick={() => setLoanTenureMonths(m)}
                            className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-all ${
                              loanTenureMonths === m 
                                ? 'bg-[#ff7a17] text-black border-[#ff7a17]' 
                                : 'bg-[#191919] text-[#dadbdf] border-[#212327] hover:border-white/20'
                            }`}
                          >
                            {m} Months
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary Breakdown Box */}
                  <div className="lg:col-span-5 bg-[#0a0a0a] p-5 rounded-2xl border border-[#212327] space-y-4">
                    <p className="text-xs font-mono uppercase text-[#7d8187] tracking-wider">
                      {isGu ? 'ચુકવણી અને વ્યાજ વિગત' : 'Repayment & Subsidy Summary'}
                    </p>

                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#dadbdf]">{isGu ? 'મૂળ રકમ:' : 'Principal Amount:'}</span>
                        <span className="text-white font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#dadbdf]">{isGu ? 'સબસીડાઇઝ્ડ વ્યાજ (૪%):' : 'Interest @ 4% p.a.:'}</span>
                        <span className="text-emerald-400 font-bold">₹{subsidizedInterest.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>{isGu ? 'સરકારી વ્યાજ રાહત બચત:' : 'Govt 3% Rebate Saved:'}</span>
                        <span className="font-bold">+₹{totalSubventionSavings.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-[#212327] pt-2.5 flex justify-between text-sm">
                        <span className="text-white font-bold">{isGu ? 'કુલ પરત ચુકવણી:' : 'Total at Harvest:'}</span>
                        <span className="text-[#ff7a17] font-bold">₹{(loanAmount + subsidizedInterest).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleApplyLoan}
                      disabled={isApplyingLoan || hasAppliedLoan}
                      className={`w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                        hasAppliedLoan
                          ? 'bg-emerald-500 text-black cursor-default'
                          : isApplyingLoan
                          ? 'bg-[#212327] text-[#7d8187]'
                          : 'bg-[#ff7a17] hover:bg-[#e06912] text-black active:scale-[0.98]'
                      }`}
                    >
                      {hasAppliedLoan ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isGu ? 'અરજી મંજૂર થઈ ગઈ (Dispatched)' : 'Disbursed to Bank Account!'}</span>
                        </>
                      ) : isApplyingLoan ? (
                        <span>Processing with SBI...</span>
                      ) : (
                        <>
                          <Landmark className="w-4 h-4" />
                          <span>{isGu ? `₹${loanAmount.toLocaleString('en-IN')} માટે ક્લેઇમ કરો` : `Claim ₹${loanAmount.toLocaleString('en-IN')} Now`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Trade History Ledger & Invoices */}
          {activeTab === 'ledger' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Turnover Stats & PDF Export Banner */}
              <div className="bg-[#141517] border border-[#212327] rounded-3xl p-6 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#ff7a17] text-black text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>{isGu ? 'પ્રમાણિત વેપાર ખાતાવહી' : 'OFFICIAL TRADE LEDGER'}</span>
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        {tradeLedger.length} {isGu ? 'સંપૂર્ણ સોદા (Fulfilled)' : 'Settled Lots'}
                      </span>
                    </div>
                    <h3 className="font-serif-display text-2xl text-white font-bold">
                      {isGu ? 'વેપાર ઇતિહાસ અને આવક પ્રમાણપત્ર' : 'Sales Statement & Income Proof Report'}
                    </h3>
                    <p className="text-xs text-[#dadbdf] max-w-2xl leading-relaxed">
                      {isGu
                        ? 'બેંક કેસીસી લોન, પાક વીમા ક્લેઇમ અને ઇન્કમ ટેક્સ ફાઇલિંગ માટે માન્ય સંપૂર્ણ એપીએમસી અને એસ્ક્રો પ્રમાણિત વેપાર ખાતાવહી PDF ડાઉનલોડ કરો.'
                        : 'Download verified digital statements formatted for banking KCC reviews, PMFBY crop insurance verification, and NABARD compliance.'}
                    </p>
                  </div>

                  {/* Primary PDF Export Action */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleExportTradeLedger('all')}
                      disabled={isExportingLedger}
                      className="w-full sm:w-auto bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-mono font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-50"
                    >
                      {isExportingLedger ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>{isGu ? 'પીડીએફ બની રહી છે...' : 'Generating PDF Report...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-black" />
                          <span>{isGu ? 'સંપૂર્ણ ખાતાવહી PDF ડાઉનલોડ' : 'Download Trade Ledger PDF'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3 Turnover Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#212327]">
                  <div className="bg-[#0a0a0a] border border-[#212327] rounded-2xl p-4">
                    <span className="text-[11px] font-mono text-[#7d8187] uppercase tracking-wider">{isGu ? 'કુલ વેપાર ટર્નઓવર' : 'Total Traded Revenue'}</span>
                    <p className="font-serif-display text-2xl sm:text-3xl text-white font-bold mt-1">₹{totalTurnover.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-[#ff7a17] font-mono mt-1">{totalQuantitySold} Quintals Fulfilled</p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#212327] rounded-2xl p-4">
                    <span className="text-[11px] font-mono text-[#7d8187] uppercase tracking-wider">{isGu ? 'મંડી કરતાં વધારાનો નફો' : 'Extra Gains vs APMC Mandi'}</span>
                    <p className="font-serif-display text-2xl sm:text-3xl text-emerald-400 font-bold mt-1">+₹{totalExtraGain.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-emerald-400 font-mono mt-1">+14.2% Premium Realization</p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#212327] rounded-2xl p-4">
                    <span className="text-[11px] font-mono text-[#7d8187] uppercase tracking-wider">{isGu ? 'સરેરાશ વેપારી રેટિંગ' : 'Buyer Satisfaction'}</span>
                    <p className="font-serif-display text-2xl sm:text-3xl text-white font-bold mt-1">4.94 ★</p>
                    <p className="text-xs text-[#7d8187] font-mono mt-1">0 Disputes • 100% Escrow Cleared</p>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar with Export Current View */}
              <div className="bg-[#141517] p-4 rounded-2xl border border-[#212327] flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isGu ? 'પાક, ખરીદદાર કે લૉટ શોધો...' : 'Search crop, buyer, or lot ID...'}
                    className="w-full bg-[#0a0a0a] border border-[#212327] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <Filter className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                    {['all', 'Kharif', 'Rabi', 'Zaid'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSeason(s)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
                          selectedSeason === s 
                            ? 'bg-[#ff7a17] text-black font-bold' 
                            : 'bg-[#191919] text-[#dadbdf] hover:text-white border border-[#212327]'
                        }`}
                      >
                        {s === 'all' ? (isGu ? 'બધી ઋતુઓ' : 'All Seasons') : s}
                      </button>
                    ))}
                  </div>

                  {(selectedSeason !== 'all' || searchQuery.trim() !== '') && (
                    <button
                      onClick={() => handleExportTradeLedger('filtered')}
                      disabled={isExportingLedger || filteredLedger.length === 0}
                      className="px-3.5 py-1.5 rounded-lg bg-[#212327] hover:bg-[#282b30] text-white text-xs font-mono font-semibold flex items-center gap-1.5 border border-white/10 transition-all ml-auto"
                    >
                      <Download className="w-3.5 h-3.5 text-[#ff7a17]" />
                      <span>{isGu ? `ફિલ્ટર રિપોર્ટ (${filteredLedger.length})` : `Export View (${filteredLedger.length})`}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Trade History Item Cards */}
              <div className="space-y-3">
                {filteredLedger.length === 0 ? (
                  <div className="text-center py-10 bg-[#141517] rounded-2xl border border-[#212327]">
                    <p className="text-sm text-[#7d8187]">{isGu ? 'કોઈ સોદો મળ્યો નથી.' : 'No trade entries match your filter.'}</p>
                  </div>
                ) : (
                  filteredLedger.map((trade) => (
                    <div 
                      key={trade.id}
                      className="bg-[#141517] border border-[#212327] hover:border-white/20 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#212327] pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#ff7a17] bg-[#ff7a17]/10 border border-[#ff7a17]/30 px-2 py-0.5 rounded">
                            {trade.id}
                          </span>
                          <span className="font-mono text-xs text-[#7d8187]">{trade.date} • {trade.season}</span>
                          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                            Grade {trade.qualityGrade} ({trade.aiQualityScore}/100)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleExportSingleInvoice(trade)}
                            disabled={isExportingInvoice}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#ff7a17] hover:text-white bg-[#ff7a17]/10 hover:bg-[#ff7a17]/20 border border-[#ff7a17]/30 px-3 py-1 rounded-full transition-all"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-3 h-3 text-[#ff7a17]" />
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => setSelectedInvoice(trade)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#dadbdf] hover:text-white bg-[#191919] hover:bg-[#212327] border border-[#212327] px-3 py-1 rounded-full transition-all"
                          >
                            <FileText className="w-3 h-3 text-[#ff7a17]" />
                            <span>{isGu ? 'ઇન્વૉઇસ જુઓ' : 'Tax Invoice'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-5">
                          <h4 className="font-bold text-white text-base">{trade.cropName}</h4>
                          <p className="text-xs text-[#dadbdf]">{trade.cropVariety}</p>
                          <p className="text-xs text-[#7d8187] mt-1">
                            Buyer: <strong className="text-white">{trade.buyerName}</strong> ({trade.buyerLocation})
                          </p>
                        </div>

                        <div className="sm:col-span-3 font-mono text-xs space-y-0.5">
                          <p className="text-[#7d8187]">Quantity: <span className="text-white font-bold">{trade.quantityQuintals} Quintals</span></p>
                          <p className="text-[#7d8187]">Sale Rate: <span className="text-white font-bold">₹{trade.pricePerQuintal.toLocaleString('en-IN')}/qtl</span></p>
                          <p className="text-emerald-400 font-bold">
                            +₹{trade.gainOverMandi.toLocaleString('en-IN')} above APMC
                          </p>
                        </div>

                        <div className="sm:col-span-4 text-left sm:text-right font-mono">
                          <span className="text-xs text-[#7d8187] block uppercase">{isGu ? 'ચુકવાયેલી રકમ (Settled)' : 'Total Settlement'}</span>
                          <span className="text-xl font-serif-display font-bold text-white">
                            ₹{trade.totalAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-emerald-400 block font-semibold">
                            ✓ {trade.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: Score Booster & Simulator */}
          {activeTab === 'booster' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Booster Header */}
              <div className="bg-[#141517] border border-[#212327] rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#ff7a17]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-serif-display text-xl text-white font-bold">
                    {isGu ? 'ક્રેડિટ સ્કોર સુધારણા & સિમ્યુલેટર (Boost to 850+)' : 'Actionable Credit Boosters & Simulator'}
                  </h3>
                </div>
                <p className="text-sm text-[#dadbdf] leading-relaxed">
                  {isGu
                    ? 'નીચેની ચકાસણીઓ પૂર્ણ કરીને તમારો સ્કોર ૮૫૦+ સુધી વધારો અને ₹૧૦ લાખ સુધીની બેંક ક્રેડિટ મર્યાદા અનલૉક કરો.'
                    : 'Complete these high-impact agricultural and trade milestones to push your rating past 850 (Tier 1 Super Prime) and unlock up to ₹10 Lakhs in instant bank credit.'}
                </p>
              </div>

              {/* Actionable Booster Checklist */}
              <div className="space-y-3">
                {creditProfile.scoreBoostActions.map((action) => {
                  const isDone = completedBoosters[action.id];
                  return (
                    <div 
                      key={action.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-white' 
                          : 'bg-[#141517] border-[#212327]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            isDone ? 'bg-emerald-500 text-black' : 'bg-[#ff7a17] text-black'
                          }`}>
                            +{action.points} PTS
                          </span>
                          <h4 className="font-bold text-white text-sm sm:text-base">
                            {isGu ? action.titleGu : action.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#dadbdf] max-w-xl">
                          {isGu ? action.descriptionGu : action.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleBooster(action.id)}
                          className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-[#ff7a17] hover:bg-[#e06912] text-black active:scale-95'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isGu ? 'સિદ્ધ થયેલ (Completed)' : 'Completed (+Points Added)'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isGu ? action.actionLabelGu : action.actionLabel}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* What-If Simulator Card */}
              <div className="bg-[#141517] border border-[#212327] rounded-3xl p-6 space-y-4">
                <h4 className="font-serif-display text-lg text-white font-bold flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#ff7a17]" />
                  <span>{isGu ? 'હાઇપોથેટિકલ સિમ્યુલેશન (What-If Credit Analysis)' : 'What-If Simulation Engine'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#212327] space-y-2">
                    <p className="text-xs font-bold text-white">Scenario A: Sell 50 Qtl Organic Jeera (A+ Grade)</p>
                    <p className="text-xs text-[#dadbdf]">Impact: +18 Credit Points & increases pre-approved loan limit to ₹7,75,000.</p>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">Estimated Score: 803 / 900</span>
                  </div>

                  <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#212327] space-y-2">
                    <p className="text-xs font-bold text-white">Scenario B: Early KCC Repayment at Kharif Harvest</p>
                    <p className="text-xs text-[#dadbdf]">Impact: Locks 100% prompt subvention bonus, granting automatic 0.5% extra interest rebate.</p>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">Estimated Score: 815 / 900</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Printable Tax Invoice Modal Popup */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white text-black rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#ff7a17]" />
                  <h3 className="font-serif-display text-2xl font-bold tracking-tight text-neutral-900">
                    Kisan<span className="text-[#ff7a17]">Sync</span> TAX INVOICE
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 font-mono mt-0.5">
                  e-Mandi Direct Settlement Certificate • APMC Recognized
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div>
                <p className="text-neutral-500">INVOICE NUMBER</p>
                <p className="font-bold text-neutral-900">{selectedInvoice.taxInvoiceNo}</p>
                <p className="text-neutral-500 mt-2">SETTLEMENT DATE</p>
                <p className="font-bold text-neutral-900">{selectedInvoice.date}</p>
              </div>

              <div className="text-right">
                <p className="text-neutral-500">BUYER ENTITY</p>
                <p className="font-bold text-neutral-900">{selectedInvoice.buyerName}</p>
                <p className="text-neutral-500 mt-2">SELLER (FARMER)</p>
                <p className="font-bold text-neutral-900">{user.name} ({user.location})</p>
              </div>
            </div>

            {/* Produce Line Items */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-neutral-100 p-3 font-mono font-bold text-neutral-800 grid grid-cols-12 gap-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate/Qtl</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              <div className="p-3 grid grid-cols-12 gap-2 border-t border-neutral-200 font-mono">
                <div className="col-span-6">
                  <strong className="text-neutral-900">{selectedInvoice.cropName}</strong>
                  <p className="text-neutral-500 text-[11px]">{selectedInvoice.cropVariety} • AI Grade {selectedInvoice.qualityGrade} ({selectedInvoice.aiQualityScore}/100)</p>
                </div>
                <div className="col-span-2 text-right font-semibold">{selectedInvoice.quantityQuintals} Qtl</div>
                <div className="col-span-2 text-right">₹{selectedInvoice.pricePerQuintal.toLocaleString('en-IN')}</div>
                <div className="col-span-2 text-right font-bold text-neutral-900">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Bottom Total & QR Code Stamp */}
            <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-[11px] font-mono text-neutral-600">
                  <p className="font-bold text-neutral-900">VERIFIED ESCROW SETTLEMENT</p>
                  <p>UPI Ref: 482910481 • 0% Middleman Deduction</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-neutral-500 font-mono">TOTAL NET AMOUNT</p>
                <p className="font-serif-display text-2xl font-bold text-neutral-900">
                  ₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleExportSingleInvoice(selectedInvoice)}
                disabled={isExportingInvoice}
                className="px-4 py-2 rounded-full bg-[#ff7a17] hover:bg-[#e06912] font-mono text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isExportingInvoice ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-black" />
                    <span>Download PDF Invoice</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  toast.success('Invoice Printed Successfully!', 'Physical settlement receipt is queued to printer.');
                }}
                className="px-4 py-2 rounded-full border border-neutral-300 font-mono text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4 text-neutral-700" />
                <span>Print</span>
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 font-mono text-xs font-semibold text-white transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
