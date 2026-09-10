import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  CropListing, 
  ActivityItem, 
  ViewMode,
  MarketplaceOrder,
  UserLoginRecord,
  FarmerCropScanRecord
} from '../types';
import { 
  subscribeToMarketplaceOrders, 
  subscribeToUserLogins,
  subscribeToFarmerLogins,
  subscribeToBuyerLogins,
  subscribeToCropScans,
  firebaseConfig 
} from '../services/firebase';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Scan, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Radio, 
  Send, 
  FileText, 
  Download, 
  DollarSign, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  MapPin,
  Clock,
  Award,
  Trash2,
  Ban,
  Lock,
  Unlock,
  UserPlus,
  Eye,
  Phone,
  Mail,
  UserX,
  UserCheck,
  Star,
  RefreshCw,
  Database,
  Receipt,
  Key,
  Laptop
} from 'lucide-react';

interface AdminDashboardProps {
  user: UserProfile;
  listings: CropListing[];
  activities: ActivityItem[];
  onNavigate: (view: ViewMode) => void;
  onLogout: () => void;
  accounts: UserProfile[];
  onBlockAccount: (accountId: string, reason?: string) => void;
  onUnblockAccount: (accountId: string) => void;
  onDeleteAccount: (accountId: string) => void;
  onCreateAccount?: (account: UserProfile) => void;
}

interface PendingKyc {
  id: string;
  farmerName: string;
  village: string;
  district: string;
  surveyNo: string;
  acres: number;
  cropType: string;
  aadhaarLast4: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

interface AiAuditLog {
  id: string;
  farmerName: string;
  location: string;
  crop: string;
  disease: string;
  confidence: number;
  qualityScore: number;
  timestamp: string;
  status: 'Verified' | 'Needs Review' | 'Flagged';
}

const INITIAL_PENDING_KYC: PendingKyc[] = [
  {
    id: 'kyc-01',
    farmerName: 'Bharatbhai Patel',
    village: 'Borsad',
    district: 'Anand',
    surveyNo: '142/2-A',
    acres: 4.5,
    cropType: 'Sharbati Wheat',
    aadhaarLast4: '8492',
    status: 'Pending',
    submittedAt: '20 mins ago'
  },
  {
    id: 'kyc-02',
    farmerName: 'Kanubhai Rabari',
    village: 'Visnagar',
    district: 'Mehsana',
    surveyNo: '88/1',
    acres: 8.2,
    cropType: 'Export Cumin (Jeera)',
    aadhaarLast4: '3129',
    status: 'Pending',
    submittedAt: '1 hour ago'
  },
  {
    id: 'kyc-03',
    farmerName: 'Savjibhai Dholakiya',
    village: 'Jasdan',
    district: 'Rajkot',
    surveyNo: '304/B',
    acres: 6.0,
    cropType: 'Organic Bt Cotton',
    aadhaarLast4: '5561',
    status: 'Approved',
    submittedAt: '3 hours ago'
  }
];

const INITIAL_AI_LOGS: AiAuditLog[] = [
  {
    id: 'ai-log-1',
    farmerName: 'Ramesh Patel',
    location: 'Anand, Gujarat',
    crop: 'Wheat (Triticum aestivum)',
    disease: 'Yellow Rust (Puccinia striiformis)',
    confidence: 96,
    qualityScore: 88,
    timestamp: '12 mins ago',
    status: 'Verified'
  },
  {
    id: 'ai-log-2',
    farmerName: 'Dineshbhai Vankar',
    location: 'Amreli, Gujarat',
    crop: 'Cotton (Gossypium)',
    disease: 'Cotton Leaf Curl Virus (CLCuV)',
    confidence: 94,
    qualityScore: 72,
    timestamp: '45 mins ago',
    status: 'Needs Review'
  },
  {
    id: 'ai-log-3',
    farmerName: 'Manish Suthar',
    location: 'Unjha, Gujarat',
    crop: 'Cumin (Cuminum cyminum)',
    disease: 'Fusarium Wilt & Blight',
    confidence: 98,
    qualityScore: 92,
    timestamp: '2 hours ago',
    status: 'Verified'
  }
];

const STANDARD_BLOCK_REASONS = [
  'Non-settlement of APMC lot payment within statutory 48hr window',
  'Fraudulent, collusive, or predatory auction bidding manipulation',
  'Forged or invalid 7/12 Land Revenue certificate submitted',
  'Repeated substandard crop quality delivery failing APMC Grade-A standards',
  'Suspicious merchant activity / Unauthorized trade brokerage',
  'Violation of e-NAM trading terms and APMC bylaws'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  listings,
  activities,
  onNavigate,
  onLogout,
  accounts,
  onBlockAccount,
  onUnblockAccount,
  onDeleteAccount,
  onCreateAccount
}) => {
  const { currentLanguage } = useLanguage();
  const toast = useToast();
  const isGu = currentLanguage.code === 'gu';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'accounts' | 'mandi' | 'ai-audit' | 'kyc' | 'broadcast' | 'firebase-orders' | 'firebase-logins' | 'firebase-scans'
  >('overview');
  const [kycList, setKycList] = useState<PendingKyc[]>(INITIAL_PENDING_KYC);
  const [aiLogs, setAiLogs] = useState<AiAuditLog[]>(INITIAL_AI_LOGS);
  const [searchMandi, setSearchMandi] = useState('');

  // Firebase Real-Time Firestore Synced Data
  const [firebaseOrders, setFirebaseOrders] = useState<MarketplaceOrder[]>([]);
  const [firebaseLogins, setFirebaseLogins] = useState<UserLoginRecord[]>([]);
  const [firebaseFarmerLogins, setFirebaseFarmerLogins] = useState<UserLoginRecord[]>([]);
  const [firebaseBuyerLogins, setFirebaseBuyerLogins] = useState<UserLoginRecord[]>([]);
  const [firebaseCropScans, setFirebaseCropScans] = useState<FarmerCropScanRecord[]>([]);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [loginsSearch, setLoginsSearch] = useState('');
  const [loginsRoleFilter, setLoginsRoleFilter] = useState<'all' | 'farmer' | 'buyer'>('all');
  const [scansSearch, setScansSearch] = useState('');

  useEffect(() => {
    const unsubOrders = subscribeToMarketplaceOrders((orders) => {
      if (orders) setFirebaseOrders(orders);
    });
    const unsubLogins = subscribeToUserLogins((logins) => {
      if (logins) setFirebaseLogins(logins);
    });
    const unsubFarmerLogins = subscribeToFarmerLogins((fLogins) => {
      if (fLogins) setFirebaseFarmerLogins(fLogins);
    });
    const unsubBuyerLogins = subscribeToBuyerLogins((bLogins) => {
      if (bLogins) setFirebaseBuyerLogins(bLogins);
    });
    const unsubCropScans = subscribeToCropScans((scans) => {
      if (scans) setFirebaseCropScans(scans);
    });
    return () => {
      unsubOrders();
      unsubLogins();
      unsubFarmerLogins();
      unsubBuyerLogins();
      unsubCropScans();
    };
  }, []);

  // Accounts Management State
  const [searchAccountQuery, setSearchAccountQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Farmer' | 'Trader' | 'Buyer' | 'Admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'name' | 'activity'>('newest');

  // Modals for Account Actions
  const [blockTargetUser, setBlockTargetUser] = useState<UserProfile | null>(null);
  const [selectedBlockReason, setSelectedBlockReason] = useState<string>(STANDARD_BLOCK_REASONS[0]);
  const [customBlockReason, setCustomBlockReason] = useState<string>('');

  const [deleteTargetUser, setDeleteTargetUser] = useState<UserProfile | null>(null);
  const [inspectTargetUser, setInspectTargetUser] = useState<UserProfile | null>(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // New Account Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Farmer' | 'Trader' | 'Buyer'>('Farmer');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('Anand, Gujarat');
  const [newUserKcc, setNewUserKcc] = useState('');
  const [newUserNotes, setNewUserNotes] = useState('');

  // Account counts
  const totalAccountsCount = accounts.length;
  const activeAccountsCount = accounts.filter((a) => !a.isBlocked && a.status !== 'Blocked').length;
  const blockedAccountsCount = accounts.filter((a) => a.isBlocked || a.status === 'Blocked').length;
  const farmerAccountsCount = accounts.filter((a) => a.role === 'Farmer').length;
  const traderAccountsCount = accounts.filter((a) => a.role === 'Trader').length;
  const buyerAccountsCount = accounts.filter((a) => a.role === 'Buyer').length;

  // Filtered & Sorted accounts
  const filteredAccounts = accounts.filter((acc) => {
    if (roleFilter !== 'all' && acc.role !== roleFilter) return false;
    const isAccBlocked = acc.isBlocked || acc.status === 'Blocked';
    if (statusFilter === 'active' && isAccBlocked) return false;
    if (statusFilter === 'blocked' && !isAccBlocked) return false;

    if (searchAccountQuery.trim()) {
      const q = searchAccountQuery.toLowerCase().trim();
      const matchName = acc.name.toLowerCase().includes(q);
      const matchPhone = acc.phone.toLowerCase().includes(q);
      const matchEmail = acc.email ? acc.email.toLowerCase().includes(q) : false;
      const matchLoc = acc.location.toLowerCase().includes(q);
      const matchId = acc.id.toLowerCase().includes(q);
      const matchKcc = acc.kccOrLicense ? acc.kccOrLicense.toLowerCase().includes(q) : false;
      return matchName || matchPhone || matchEmail || matchLoc || matchId || matchKcc;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'activity') return ((b.totalListings || 0) + (b.activeBids || 0)) - ((a.totalListings || 0) + (a.activeBids || 0));
    return 0;
  });

  const handleConfirmBlock = () => {
    if (!blockTargetUser) return;
    const finalReason = customBlockReason.trim() ? customBlockReason.trim() : selectedBlockReason;
    onBlockAccount(blockTargetUser.id, finalReason);
    setBlockTargetUser(null);
    setCustomBlockReason('');
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetUser) return;
    onDeleteAccount(deleteTargetUser.id);
    setDeleteTargetUser(null);
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim()) {
      toast.error('Required Fields Missing', 'Please provide a full name and contact mobile number.');
      return;
    }
    const cleanPhone = newUserPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Invalid Mobile', 'Please provide a valid 10-digit mobile number.');
      return;
    }

    const createdProfile: UserProfile = {
      id: `usr_${newUserRole.toLowerCase()}_${Date.now().toString().slice(-6)}`,
      name: newUserName.trim(),
      role: newUserRole,
      phone: newUserPhone.startsWith('+91') ? newUserPhone : `+91 ${cleanPhone}`,
      email: newUserEmail.trim() || undefined,
      location: newUserLocation.trim() || 'Gujarat, India',
      rating: 5.0,
      totalListings: 0,
      activeBids: 0,
      kccOrLicense: newUserKcc.trim() || undefined,
      status: 'Active',
      isBlocked: false,
      joinedAt: 'Today',
      verified: true,
      notes: newUserNotes.trim() || undefined,
      avatar:
        newUserRole === 'Farmer'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
          : newUserRole === 'Trader'
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    };

    if (onCreateAccount) {
      onCreateAccount(createdProfile);
    }
    setIsAddAccountModalOpen(false);
    setNewUserName('');
    setNewUserPhone('');
    setNewUserEmail('');
    setNewUserKcc('');
    setNewUserNotes('');
  };

  // Emergency Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'farmers' | 'traders'>('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // KYC Actions
  const handleApproveKyc = (id: string, name: string) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'Approved' } : k));
    toast.success('KYC Approved', `Verified 7/12 land record for ${name}. Farmer granted Verified Kisan badge.`);
  };

  const handleRejectKyc = (id: string, name: string) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'Rejected' } : k));
    toast.error('KYC Rejected', `7/12 record flagged for ${name}. Resubmission requested.`);
  };

  // AI Audit Actions
  const handleVerifyAiLog = (id: string) => {
    setAiLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'Verified' } : l));
    toast.ai('AI Diagnosis Verified', 'Pathological diagnosis marked as verified by APMC Agro-Expert.');
  };

  // Broadcast Handler
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      toast.error('Fields Required', 'Please enter a broadcast title and alert message.');
      return;
    }

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      toast.success(
        'Emergency Advisory Broadcasted',
        `Dispatched SMS & Push Alert to ${broadcastTarget === 'all' ? '14,820 Farmers & Traders' : broadcastTarget === 'farmers' ? '12,980 Farmers' : '1,840 APMC Traders'}.`
      );
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-[#141517] via-[#1a1714] to-[#141517] border-b border-[#ff7a17]/20 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ff7a17]/20 text-[#ff7a17] border border-[#ff7a17]/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                SIH 2026 REGULATORY CONTROL PORTAL
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE SYSTEM
              </span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
              {isGu ? 'કિસાનસિંક એડમિનિસ્ટ્રેટર કંટ્રોલ સેન્ટર' : 'KisanSync Central Agricultural & AI Administration Console'}
            </h1>
            <p className="text-xs sm:text-sm text-[#a0a4ab] mt-1 font-mono">
              Govt APMC Directorate • Ministry of Agriculture • Authenticated: <span className="text-[#ff7a17] font-semibold">{user.name}</span> ({user.location})
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('marketplace')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a1c20] hover:bg-[#25282e] text-white border border-[#212327] transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#ff7a17]" />
              <span>Mandi View</span>
            </button>
            <button
              onClick={() => onNavigate('analyzer')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a1c20] hover:bg-[#25282e] text-white border border-[#212327] transition-all"
            >
              <Scan className="w-3.5 h-3.5 text-[#ff7a17]" />
              <span>AI Scanner</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setActiveTab('accounts')}
            className={`border rounded-2xl p-4 relative overflow-hidden cursor-pointer transition-all ${
              activeTab === 'accounts'
                ? 'bg-[#1a1c20] border-[#ff7a17] shadow-lg ring-1 ring-[#ff7a17]/50'
                : 'bg-[#141517] border-[#212327] hover:border-[#ff7a17]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#a0a4ab] font-mono mb-2">
              <span>ALL REGISTERED ACCOUNTS</span>
              <Users className="w-4 h-4 text-[#ff7a17]" />
            </div>
            <p className="font-serif-display text-2xl sm:text-3xl font-bold text-white flex items-baseline gap-2">
              {totalAccountsCount}
              <span className="text-xs font-normal text-[#a0a4ab]">citizens</span>
            </p>
            <p className="text-[10px] font-mono mt-1 flex items-center justify-between">
              <span className="text-emerald-400 font-medium">{activeAccountsCount} Active</span>
              {blockedAccountsCount > 0 ? (
                <span className="text-rose-400 font-bold bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30">
                  {blockedAccountsCount} Blocked
                </span>
              ) : (
                <span className="text-[#a0a4ab]">0 Blocked</span>
              )}
            </p>
          </div>

          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#a0a4ab] font-mono mb-2">
              <span>ACTIVE APMC BIDS</span>
              <DollarSign className="w-4 h-4 text-[#ff7a17]" />
            </div>
            <p className="font-serif-display text-2xl sm:text-3xl font-bold text-white">₹6.82 Cr</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Zero middleman deductions
            </p>
          </div>

          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#a0a4ab] font-mono mb-2">
              <span>AI SCANS AUDITED</span>
              <Sparkles className="w-4 h-4 text-[#ff7a17]" />
            </div>
            <p className="font-serif-display text-2xl sm:text-3xl font-bold text-white">19,450</p>
            <p className="text-[10px] text-white font-mono mt-1">
              96.8% Model Confidence Avg
            </p>
          </div>

          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#a0a4ab] font-mono mb-2">
              <span>PENDING KYC / 7-12</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-400">
              {kycList.filter(k => k.status === 'Pending').length} Pending
            </p>
            <p className="text-[10px] text-[#a0a4ab] font-mono mt-1">
              Requires Land Record Audit
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-[#212327] pb-3 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-[#a0a4ab] hover:text-white border border-[#212327]'
            }`}
          >
            Overview & Telemetry
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'accounts'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-[#a0a4ab] hover:text-white border border-[#212327]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Accounts & User Management</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'accounts' ? 'bg-black/20 text-black' : 'bg-[#212327] text-white'
            }`}>
              {accounts.length}
            </span>
            {blockedAccountsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {blockedAccountsCount} Blocked
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mandi'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-[#a0a4ab] hover:text-white border border-[#212327]'
            }`}
          >
            Mandi Auctions Moderation ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'kyc'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-[#a0a4ab] hover:text-white border border-[#212327]'
            }`}
          >
            7/12 Land Record Verification ({kycList.filter(k => k.status === 'Pending').length})
          </button>

          <button
            onClick={() => setActiveTab('ai-audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ai-audit'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-[#a0a4ab] hover:text-white border border-[#212327]'
            }`}
          >
            AI Scanner Diagnostics Audit ({aiLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'broadcast'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-[#a0a4ab] hover:text-white border border-[#212327]'
            }`}
          >
            Emergency Krishi Broadcast
          </button>

          <button
            onClick={() => setActiveTab('firebase-orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'firebase-orders'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-amber-400 hover:text-amber-300 border border-amber-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firebase Orders ({firebaseOrders.length})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('firebase-logins')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'firebase-logins'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-sky-400 hover:text-sky-300 border border-sky-500/30'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Firebase Logins ({firebaseLogins.length})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('firebase-scans')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'firebase-scans'
                ? 'bg-[#ff7a17] text-black font-bold shadow-md'
                : 'bg-[#141517] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Farmer Crop Scans ({firebaseCropScans.length})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        
        {/* TAB 0: ACCOUNTS & USER MANAGEMENT */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            {/* Accounts Header & Actions */}
            <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-[#ff7a17]/10 text-[#ff7a17]">
                      <Users className="w-4 h-4" />
                    </span>
                    <h2 className="font-serif-display text-xl font-bold text-white">
                      APMC Citizen & Merchant Account Directorate
                    </h2>
                  </div>
                  <p className="text-xs text-[#a0a4ab]">
                    View all registered farmer, trader, and buyer accounts. Block suspicious actors, reinstate compliant users, or permanently purge records.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsAddAccountModalOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black transition-all shadow-md cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register New Account</span>
                  </button>
                </div>
              </div>

              {/* Summary Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-5 border-t border-[#212327] text-xs">
                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                  <p className="text-[10px] text-[#a0a4ab] font-mono">TOTAL ACCOUNTS</p>
                  <p className="font-bold text-lg text-white mt-0.5">{totalAccountsCount}</p>
                </div>

                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                  <p className="text-[10px] text-emerald-400 font-mono">ACTIVE STATUS</p>
                  <p className="font-bold text-lg text-emerald-400 mt-0.5">{activeAccountsCount}</p>
                </div>

                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                  <p className="text-[10px] text-rose-400 font-mono">BLOCKED / SUSPENDED</p>
                  <p className="font-bold text-lg text-rose-400 mt-0.5">{blockedAccountsCount}</p>
                </div>

                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                  <p className="text-[10px] text-emerald-300 font-mono">FARMERS</p>
                  <p className="font-bold text-lg text-white mt-0.5">{farmerAccountsCount}</p>
                </div>

                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                  <p className="text-[10px] text-amber-300 font-mono">TRADERS & MERCHANTS</p>
                  <p className="font-bold text-lg text-white mt-0.5">{traderAccountsCount}</p>
                </div>

                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                  <p className="text-[10px] text-blue-300 font-mono">INSTITUTIONAL BUYERS</p>
                  <p className="font-bold text-lg text-white mt-0.5">{buyerAccountsCount}</p>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="mt-5 pt-5 border-t border-[#212327] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchAccountQuery}
                    onChange={(e) => setSearchAccountQuery(e.target.value)}
                    placeholder="Search by name, phone (+91), email, location, or APMC license ID..."
                    className="w-full pl-9 pr-8 py-2 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                  />
                  {searchAccountQuery && (
                    <button
                      onClick={() => setSearchAccountQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7d8187] hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Chips & Sort */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Role Selector */}
                  <div className="flex items-center bg-[#0a0a0a] border border-[#212327] rounded-xl p-1 text-xs">
                    {(['all', 'Farmer', 'Trader', 'Buyer'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          roleFilter === r
                            ? 'bg-[#ff7a17] text-black font-bold'
                            : 'text-[#a0a4ab] hover:text-white'
                        }`}
                      >
                        {r === 'all' ? 'All Roles' : r}
                      </button>
                    ))}
                  </div>

                  {/* Status Selector */}
                  <div className="flex items-center bg-[#0a0a0a] border border-[#212327] rounded-xl p-1 text-xs">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        statusFilter === 'all'
                          ? 'bg-[#25282e] text-white font-bold'
                          : 'text-[#a0a4ab] hover:text-white'
                      }`}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => setStatusFilter('active')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        statusFilter === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                          : 'text-[#a0a4ab] hover:text-white'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setStatusFilter('blocked')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        statusFilter === 'blocked'
                          ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                          : 'text-[#a0a4ab] hover:text-white'
                      }`}
                    >
                      Blocked ({blockedAccountsCount})
                    </button>
                  </div>

                  {/* Sort Selector */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#0a0a0a] border border-[#212327] text-[#dadbdf] text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#ff7a17]"
                  >
                    <option value="newest">Recently Registered</option>
                    <option value="rating">Rating (Highest)</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="activity">Most Active Trades</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accounts List Grid */}
            {filteredAccounts.length === 0 ? (
              <div className="bg-[#141517] border border-[#212327] rounded-2xl p-12 text-center">
                <UserX className="w-12 h-12 text-[#7d8187] mx-auto mb-3" />
                <h4 className="text-white font-bold text-base">No Accounts Found</h4>
                <p className="text-xs text-[#a0a4ab] max-w-md mx-auto mt-1">
                  No registered users match your search query or filter criteria. Try resetting filters or clearing the search bar.
                </p>
                <button
                  onClick={() => {
                    setSearchAccountQuery('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-[#212327] hover:bg-[#2c3037] text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.map((acc) => {
                  const isBlocked = acc.isBlocked || acc.status === 'Blocked';
                  const isRootAdmin = acc.id === 'admin_sih_2026';

                  return (
                    <div
                      key={acc.id}
                      className={`bg-[#141517] border rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                        isBlocked
                          ? 'border-rose-500/40 bg-rose-950/5 ring-1 ring-rose-500/20'
                          : 'border-[#212327] hover:border-[#33363f]'
                      }`}
                    >
                      {/* Card Header: User Avatar, Name, and Badges */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={acc.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                                alt={acc.name}
                                className={`w-12 h-12 rounded-xl object-cover border-2 ${
                                  isBlocked
                                    ? 'border-rose-500/60 opacity-80 grayscale'
                                    : acc.role === 'Farmer'
                                    ? 'border-emerald-500/50'
                                    : acc.role === 'Trader'
                                    ? 'border-amber-500/50'
                                    : acc.role === 'Buyer'
                                    ? 'border-blue-500/50'
                                    : 'border-[#ff7a17]/50'
                                }`}
                              />
                              {isBlocked && (
                                <span className="absolute -top-1 -right-1 bg-rose-600 text-white p-1 rounded-full text-[10px]">
                                  <Lock className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-bold text-sm text-white">{acc.name}</h4>
                                {acc.verified && !isBlocked && (
                                  <span title="APMC Verified Citizen">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#7d8187] font-mono">
                                ID: {acc.id}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  acc.role === 'Farmer'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                    : acc.role === 'Trader'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                                    : acc.role === 'Buyer'
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                                    : 'bg-[#ff7a17]/15 text-[#ff7a17] border border-[#ff7a17]/25'
                                }`}>
                                  {acc.role}
                                </span>

                                {acc.rating && (
                                  <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-mono">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {acc.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status Pill */}
                          <div className="shrink-0">
                            {isBlocked ? (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                <Ban className="w-3 h-3" />
                                BLOCKED
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact & Location Details */}
                        <div className="space-y-1.5 mt-4 pt-3 border-t border-[#212327] text-xs text-[#a0a4ab]">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#7d8187] shrink-0" />
                            <span className="text-white font-mono">{acc.phone}</span>
                          </div>

                          {acc.email && (
                            <div className="flex items-center gap-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-[#7d8187] shrink-0" />
                              <span className="text-[#dadbdf] truncate">{acc.email}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#7d8187] shrink-0" />
                            <span className="text-[#dadbdf] truncate">{acc.location}</span>
                          </div>

                          {acc.kccOrLicense && (
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#7d8187] shrink-0" />
                              <span className="text-[11px] font-mono text-[#dadbdf]">
                                {acc.role === 'Farmer' ? 'KCC' : 'APMC Lic'}: {acc.kccOrLicense}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] pt-1 text-[#7d8187] font-mono">
                            <span>Listings: {acc.totalListings || 0}</span>
                            <span>Bids: {acc.activeBids || 0}</span>
                            <span>Joined: {acc.joinedAt || '2026'}</span>
                          </div>
                        </div>

                        {/* If Account is Blocked: Warning Banner with Reason */}
                        {isBlocked && (
                          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-400">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Suspended by APMC Directorate</span>
                            </div>
                            <p className="text-[11px] text-rose-300 leading-snug">
                              Reason: {acc.blockReason || 'Regulatory violation or non-settlement.'}
                            </p>
                            {acc.blockedAt && (
                              <p className="text-[10px] text-rose-400/80 font-mono">
                                Enforced on: {acc.blockedAt}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="mt-4 pt-3 border-t border-[#212327]">
                        {isRootAdmin ? (
                          <div className="w-full text-center py-2 text-xs font-semibold text-[#ff7a17] bg-[#ff7a17]/10 border border-[#ff7a17]/30 rounded-xl flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#ff7a17]" />
                            <span>Protected System Admin</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* Block / Unblock Toggle */}
                            {isBlocked ? (
                              <button
                                onClick={() => onUnblockAccount(acc.id)}
                                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 active:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                title="Reinstate account to Active status"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unblock</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setBlockTargetUser(acc);
                                  setSelectedBlockReason(STANDARD_BLOCK_REASONS[0]);
                                  setCustomBlockReason('');
                                }}
                                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/25 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                title="Suspend account access and revoke sessions"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Block Account</span>
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeleteTargetUser(acc)}
                              className="py-2 px-3 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/25 text-rose-400 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              title="Permanently remove user from platform"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>

                            {/* View Details / Dossier Button */}
                            <button
                              onClick={() => setInspectTargetUser(acc)}
                              className="py-2 px-2.5 rounded-xl text-xs font-medium bg-[#1a1c20] hover:bg-[#25282e] text-[#dadbdf] border border-[#212327] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              title="View full user audit dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* System Health */}
              <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#ff7a17]" />
                    SIH 2026 Core Infrastructure & Subsystem Status
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ALL SYSTEMS NOMINAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Gemini 2.5 Diagnostic Vision</p>
                      <p className="text-[10px] text-[#7d8187] font-mono">Inference Latency: 380ms</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">99.98%</span>
                  </div>

                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">APMC Live Bidding Ledger</p>
                      <p className="text-[10px] text-[#7d8187] font-mono">Consensus: Realtime WebSocket</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">Active</span>
                  </div>

                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Offline SMS Fallback Gateway</p>
                      <p className="text-[10px] text-[#7d8187] font-mono">Toll-Free 1800-KISAN</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">Online</span>
                  </div>

                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Kisan Credit Scoring Engine</p>
                      <p className="text-[10px] text-[#7d8187] font-mono">Model: 7-Factor APMC Ledger</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">Calibrated</span>
                  </div>
                </div>
              </div>

              {/* Recent Audit Activities */}
              <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#ff7a17]" />
                  Realtime Platform Regulatory Ledger
                </h3>

                <div className="space-y-3">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-medium text-white">{act.title}</p>
                        <p className="text-[#a0a4ab] text-[11px] mt-0.5">{act.description}</p>
                      </div>
                      <span className="text-[10px] text-[#7d8187] font-mono shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Regulatory Tools Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-3">APMC Price Benchmark (MSP)</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                    <span className="text-[#dadbdf]">Sharbati Wheat (Grade A)</span>
                    <span className="text-[#ff7a17] font-mono font-bold">₹2,450 / Q</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                    <span className="text-[#dadbdf]">Unjha Cumin (Jeera)</span>
                    <span className="text-[#ff7a17] font-mono font-bold">₹28,500 / Q</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                    <span className="text-[#dadbdf]">Bt Cotton (Medium Staple)</span>
                    <span className="text-[#ff7a17] font-mono font-bold">₹7,120 / Q</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#0a0a0a] rounded-xl border border-[#212327]">
                    <span className="text-[#dadbdf]">Basmati Paddy</span>
                    <span className="text-[#ff7a17] font-mono font-bold">₹3,850 / Q</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-2">Export Data for Govt. Filing</h3>
                <p className="text-xs text-[#a0a4ab] mb-4">
                  Download encrypted CSV audits for APMC regulatory compliance and PM-AASHA subsidy claims.
                </p>
                <button
                  onClick={() => toast.info('Export Started', 'Generating SIH 2026 platform audit CSV...')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#212327] hover:bg-[#2d3036] text-white text-xs font-semibold transition-all border border-[#333]"
                >
                  <Download className="w-3.5 h-3.5 text-[#ff7a17]" />
                  <span>Download APMC Trade Ledger (.CSV)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANDI AUCTIONS MODERATION */}
        {activeTab === 'mandi' && (
          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif-display text-lg font-bold text-white">
                  Active Mandi Produce Lots ({listings.length} Lots)
                </h3>
                <p className="text-xs text-[#a0a4ab] mt-0.5">
                  Verify quality grades, inspect active buyer bids, and enforce MSP floor prices.
                </p>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-[#7d8187] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter crop or farmer..."
                  value={searchMandi}
                  onChange={(e) => setSearchMandi(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#212327] text-[#a0a4ab] font-mono">
                    <th className="pb-3 font-semibold">Crop & Lot</th>
                    <th className="pb-3 font-semibold">Farmer</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold">AI Quality</th>
                    <th className="pb-3 font-semibold">Starting / Current Bid</th>
                    <th className="pb-3 font-semibold">Bids</th>
                    <th className="pb-3 font-semibold text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#212327]">
                  {listings
                    .filter(l => l.cropName.toLowerCase().includes(searchMandi.toLowerCase()) || l.farmerName.toLowerCase().includes(searchMandi.toLowerCase()))
                    .map((lot) => (
                      <tr key={lot.id} className="hover:bg-[#1a1c20] transition-colors">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-3">
                            <img src={lot.imageUrl} alt={lot.cropName} className="w-9 h-9 rounded-lg object-cover ring-1 ring-[#212327]" />
                            <div>
                              <p className="font-semibold text-white">{lot.cropName}</p>
                              <p className="text-[10px] text-[#7d8187] font-mono">{lot.variety}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-[#dadbdf]">
                          <p>{lot.farmerName}</p>
                          <p className="text-[10px] text-[#7d8187]">{lot.farmerLocation.split(',')[0]}</p>
                        </td>
                        <td className="py-3 font-mono text-white">
                          {lot.quantityQuintals} Quintals
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff7a17]/10 text-[#ff7a17] border border-[#ff7a17]/30">
                            <Sparkles className="w-2.5 h-2.5" />
                            {lot.aiQualityScore}/100 ({lot.qualityGrade})
                          </span>
                        </td>
                        <td className="py-3 font-mono">
                          <p className="text-white font-bold">₹{lot.currentHighestBid || lot.startingPricePerQuintal} / Q</p>
                          <p className="text-[10px] text-[#7d8187]">Base: ₹{lot.startingPricePerQuintal}</p>
                        </td>
                        <td className="py-3 font-mono text-[#dadbdf]">
                          {lot.bidCount} Bids
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => toast.success('Lot Verified', `${lot.cropName} marked compliant with APMC Fair Average Quality (FAQ) norms.`)}
                            className="px-2.5 py-1 bg-[#212327] hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 text-xs font-semibold rounded-lg border border-[#333] transition-all"
                          >
                            Verify FAQ
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: 7/12 LAND RECORD & KYC VERIFICATION */}
        {activeTab === 'kyc' && (
          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="font-serif-display text-lg font-bold text-white">
                Revenue Department 7/12 RoR & Land Record Verifications
              </h3>
              <p className="text-xs text-[#a0a4ab] mt-0.5">
                Inspect AnyRoR Gujarat survey numbers, land acreage, and link verified farmer badges.
              </p>
            </div>

            <div className="space-y-3">
              {kycList.map((k) => (
                <div key={k.id} className="p-4 bg-[#0a0a0a] rounded-xl border border-[#212327] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#141517] border border-[#212327] text-[#ff7a17] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-white">{k.farmerName}</p>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          k.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : k.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {k.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a0a4ab] mt-1 font-mono">
                        Survey No: <span className="text-white font-semibold">{k.surveyNo}</span> • Village: {k.village}, Dist: {k.district} • Land: {k.acres} Acres
                      </p>
                      <p className="text-[11px] text-[#7d8187] font-mono mt-0.5">
                        Crop: {k.cropType} • Aadhaar: ****-****-{k.aadhaarLast4} • Submitted: {k.submittedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {k.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveKyc(k.id, k.farmerName)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve 7/12</span>
                        </button>
                        <button
                          onClick={() => handleRejectKyc(k.id, k.farmerName)}
                          className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Flag / Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#7d8187] font-mono">
                        {k.status === 'Approved' ? 'Verified on State Ledger' : 'Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AI SCANNER DIAGNOSTICS AUDIT */}
        {activeTab === 'ai-audit' && (
          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="font-serif-display text-lg font-bold text-white">
                AI Pathological Inference Auditing & Calibration
              </h3>
              <p className="text-xs text-[#a0a4ab] mt-0.5">
                Review Gemini AI diagnostic detections to ensure reliable crop pathology recommendations.
              </p>
            </div>

            <div className="space-y-3">
              {aiLogs.map((log) => (
                <div key={log.id} className="p-4 bg-[#0a0a0a] rounded-xl border border-[#212327] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#ff7a17]/10 text-[#ff7a17] shrink-0">
                      <Scan className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-white">{log.disease}</p>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff7a17]/20 text-[#ff7a17] font-bold">
                          {log.confidence}% Confidence
                        </span>
                      </div>
                      <p className="text-xs text-[#a0a4ab] mt-1 font-mono">
                        Crop: {log.crop} • Location: {log.location} • Farmer: {log.farmerName}
                      </p>
                      <p className="text-[11px] text-[#7d8187] font-mono mt-0.5">
                        Quality Score: {log.qualityScore}/100 • {log.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {log.status === 'Verified' ? (
                      <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Pathologist Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyAiLog(log.id)}
                        className="px-3.5 py-1.5 bg-[#ff7a17] hover:bg-[#e06912] text-black text-xs font-bold rounded-xl transition-all shadow-sm"
                      >
                        Confirm Diagnosis
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EMERGENCY KRISHI BROADCAST */}
        {activeTab === 'broadcast' && (
          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-5 sm:p-8 max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#ff7a17]/10 text-[#ff7a17] flex items-center justify-center mx-auto mb-3 border border-[#ff7a17]/30">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-white">
                Emergency State-Wide Krishi Advisory Broadcast
              </h3>
              <p className="text-xs text-[#a0a4ab] mt-1">
                Dispatches instantaneous SMS push notification and app alerts across registered APMC districts.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#dadbdf] mb-1.5 font-mono">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('all')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      broadcastTarget === 'all'
                        ? 'bg-[#ff7a17] text-black border-[#ff7a17]'
                        : 'bg-[#0a0a0a] text-[#a0a4ab] border-[#212327]'
                    }`}
                  >
                    All Users (14,820)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('farmers')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      broadcastTarget === 'farmers'
                        ? 'bg-[#ff7a17] text-black border-[#ff7a17]'
                        : 'bg-[#0a0a0a] text-[#a0a4ab] border-[#212327]'
                    }`}
                  >
                    Farmers Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('traders')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      broadcastTarget === 'traders'
                        ? 'bg-[#ff7a17] text-black border-[#ff7a17]'
                        : 'bg-[#0a0a0a] text-[#a0a4ab] border-[#212327]'
                    }`}
                  >
                    Traders Only
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#dadbdf] mb-1.5 font-mono">
                  Advisory Title / Heading
                </label>
                <input
                  type="text"
                  placeholder="e.g., Severe Rain Warning & Locust Precaution in Saurashtra"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#dadbdf] mb-1.5 font-mono">
                  Alert Message & Preventive Measures
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter preventive chemical sprays, mandi holiday dates, or weather advisory instructions..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isBroadcasting}
                className="w-full py-3 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-black" />
                <span>{isBroadcasting ? 'Dispatches in Progress...' : 'Transmit Official Alert to Network'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB: FIREBASE MARKETPLACE ORDERS */}
        {activeTab === 'firebase-orders' && (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-[#141517] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      <Database className="w-3.5 h-3.5" />
                      FIRESTORE DATABASE: marketplace_orders
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      REALTIME SYNCED
                    </span>
                  </div>
                  <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-white">
                    Firebase Marketplace Orders & Trade Ledger
                  </h2>
                  <p className="text-xs text-[#a0a4ab] mt-1 font-mono">
                    Project: <span className="text-amber-400 font-semibold">{firebaseConfig.projectId}</span> • Every mandi purchase stores buyer, seller farmer, price, quintals sold & addresses.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-[#7d8187] font-mono">TOTAL ORDERS IN DB</p>
                    <p className="text-xl font-bold text-amber-400 font-mono">{firebaseOrders.length}</p>
                  </div>
                  <div className="text-right pl-3 border-l border-[#212327]">
                    <p className="text-[10px] text-[#7d8187] font-mono">TOTAL TRADE VALUE</p>
                    <p className="text-xl font-bold text-emerald-400 font-mono">
                      ₹{firebaseOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-5 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8187]" />
                  <input
                    type="text"
                    placeholder="Search by buyer name, farmer seller name, crop, address or order ID..."
                    value={ordersSearch}
                    onChange={(e) => setOrdersSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Orders List */}
            {firebaseOrders.filter((ord) => {
              if (!ordersSearch.trim()) return true;
              const q = ordersSearch.toLowerCase().trim();
              const farmerAddr = (ord.farmerSellerAddress || ord.farmerAddress || '').toLowerCase();
              const buyerAddr = (ord.buyerAddress || '').toLowerCase();
              return (
                (ord.buyerName || '').toLowerCase().includes(q) ||
                (ord.farmerSellerName || '').toLowerCase().includes(q) ||
                (ord.cropName || '').toLowerCase().includes(q) ||
                (ord.orderId || '').toLowerCase().includes(q) ||
                buyerAddr.includes(q) ||
                farmerAddr.includes(q)
              );
            }).length === 0 ? (
              <div className="p-12 text-center bg-[#141517] border border-[#212327] rounded-2xl">
                <Database className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
                <h3 className="font-serif-display text-lg font-bold text-white">No Orders Found In Firebase</h3>
                <p className="text-xs text-[#a0a4ab] max-w-md mx-auto mt-1">
                  {ordersSearch.trim()
                    ? 'No orders match your filter criteria.'
                    : 'When buyers click "Buy Stock Now" in the Mandi Marketplace, confirmed transactions immediately populate here and persist in Google Firebase Firestore.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firebaseOrders
                  .filter((ord) => {
                    if (!ordersSearch.trim()) return true;
                    const q = ordersSearch.toLowerCase().trim();
                    const farmerAddr = (ord.farmerSellerAddress || ord.farmerAddress || '').toLowerCase();
                    const buyerAddr = (ord.buyerAddress || '').toLowerCase();
                    return (
                      (ord.buyerName || '').toLowerCase().includes(q) ||
                      (ord.farmerSellerName || '').toLowerCase().includes(q) ||
                      (ord.cropName || '').toLowerCase().includes(q) ||
                      (ord.orderId || '').toLowerCase().includes(q) ||
                      buyerAddr.includes(q) ||
                      farmerAddr.includes(q)
                    );
                  })
                  .map((ord) => (
                    <div
                      key={ord.orderId}
                      className="bg-[#141517] border border-[#212327] hover:border-amber-500/40 rounded-2xl p-5 transition-all space-y-4"
                    >
                      {/* Top Row: Crop & Total Price */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white">{ord.cropName}</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#212327] text-amber-400 font-semibold">
                              {ord.variety}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-[#7d8187] mt-0.5">
                            ID: <span className="text-[#dadbdf]">{ord.orderId}</span> • {ord.orderDate || ord.timestamp || 'Recent'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-emerald-400 font-mono">
                            ₹{ord.totalPrice.toLocaleString('en-IN')}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> {ord.paymentStatus || ord.status || 'Confirmed'}
                          </span>
                        </div>
                      </div>

                      {/* Trade Parties: Buyer & Farmer Seller Details */}
                      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#0a0a0a] border border-[#212327] text-xs">
                        <div>
                          <p className="text-[10px] font-mono text-amber-400/90 font-bold flex items-center gap-1">
                            <span>👤 BUYER</span>
                          </p>
                          <p className="font-bold text-white mt-1">{ord.buyerName}</p>
                          <p className="text-[11px] text-[#a0a4ab] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#7d8187]" /> {ord.buyerPhone || 'Not provided'}
                          </p>
                          <p className="text-[10px] text-[#7d8187] flex items-start gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0 text-[#7d8187] mt-0.5" />
                            <span className="line-clamp-2">{ord.buyerAddress}</span>
                          </p>
                        </div>

                        <div className="border-l border-[#212327] pl-2.5">
                          <p className="text-[10px] font-mono text-emerald-400/90 font-bold flex items-center gap-1">
                            <span>🌾 FARMER / SELLER</span>
                          </p>
                          <p className="font-bold text-white mt-1">{ord.farmerSellerName}</p>
                          <p className="text-[10px] text-[#7d8187] flex items-start gap-1 mt-1">
                            <MapPin className="w-3 h-3 shrink-0 text-[#7d8187] mt-0.5" />
                            <span className="line-clamp-2">{ord.farmerSellerAddress || ord.farmerAddress || 'Gujarat, India'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Rate Breakdown */}
                      <div className="flex items-center justify-between text-xs px-1 font-mono">
                        <span className="text-[#a0a4ab]">
                          Sold: <strong className="text-white">{ord.quantitySoldQuintals} Quintals</strong>
                        </span>
                        <span className="text-[#a0a4ab]">
                          Rate: <strong className="text-white">₹{ord.pricePerQuintal.toLocaleString('en-IN')}/Qtl</strong>
                        </span>
                        <span className="text-[#a0a4ab]">
                          Mode: <strong className="text-amber-400">{ord.paymentMode || 'Instant APMC Escrow'}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: FIREBASE USER LOGINS */}
        {activeTab === 'firebase-logins' && (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-[#141517] border border-sky-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40">
                      <Key className="w-3.5 h-3.5" />
                      FIRESTORE: user_logins, farmer_logins & buyer_logins
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      REALTIME SYNCED
                    </span>
                  </div>
                  <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-white">
                    Firebase User Login Audit Trail
                  </h2>
                  <p className="text-xs text-[#a0a4ab] mt-1 font-mono">
                    Project: <span className="text-sky-400 font-semibold">{firebaseConfig.projectId}</span> • Login data is saved separately in Firestore for Farmers and Buyers.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                  <div className="bg-[#0a0a0a] border border-[#212327] rounded-xl px-3 py-2 text-center">
                    <p className="text-[9px] text-[#7d8187] font-mono uppercase">All Sessions</p>
                    <p className="text-base font-bold text-sky-400 font-mono">{firebaseLogins.length}</p>
                  </div>
                  <div className="bg-[#0a0a0a] border border-[#212327] rounded-xl px-3 py-2 text-center">
                    <p className="text-[9px] text-emerald-400 font-mono uppercase">🌾 Farmer Logins</p>
                    <p className="text-base font-bold text-emerald-400 font-mono">
                      {firebaseFarmerLogins.length || firebaseLogins.filter((l) => (l.role || '').toLowerCase() === 'farmer').length}
                    </p>
                  </div>
                  <div className="bg-[#0a0a0a] border border-[#212327] rounded-xl px-3 py-2 text-center">
                    <p className="text-[9px] text-amber-400 font-mono uppercase">🛒 Buyer Logins</p>
                    <p className="text-base font-bold text-amber-400 font-mono">
                      {firebaseBuyerLogins.length || firebaseLogins.filter((l) => {
                        const r = (l.role || '').toLowerCase();
                        return r === 'buyer' || r === 'trader';
                      }).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter controls */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Segregation Role Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-[#0a0a0a] border border-[#212327] rounded-xl shrink-0">
                  <button
                    onClick={() => setLoginsRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      loginsRoleFilter === 'all'
                        ? 'bg-sky-500 text-black font-bold shadow-sm'
                        : 'text-[#a0a4ab] hover:text-white'
                    }`}
                  >
                    All Logins ({firebaseLogins.length})
                  </button>
                  <button
                    onClick={() => setLoginsRoleFilter('farmer')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      loginsRoleFilter === 'farmer'
                        ? 'bg-emerald-500 text-black font-bold shadow-sm'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <span>🌾 Farmer Logins</span>
                    <span className="text-[10px] opacity-80">
                      ({firebaseFarmerLogins.length || firebaseLogins.filter((l) => (l.role || '').toLowerCase() === 'farmer').length})
                    </span>
                  </button>
                  <button
                    onClick={() => setLoginsRoleFilter('buyer')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      loginsRoleFilter === 'buyer'
                        ? 'bg-amber-500 text-black font-bold shadow-sm'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <span>🛒 Buyer Logins</span>
                    <span className="text-[10px] opacity-80">
                      ({firebaseBuyerLogins.length || firebaseLogins.filter((l) => {
                        const r = (l.role || '').toLowerCase();
                        return r === 'buyer' || r === 'trader';
                      }).length})
                    </span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8187]" />
                  <input
                    type="text"
                    placeholder="Search by user name, email, phone, role, method, or login ID..."
                    value={loginsSearch}
                    onChange={(e) => setLoginsSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Logins List */}
            {(() => {
              let sourceList = firebaseLogins;
              if (loginsRoleFilter === 'farmer') {
                sourceList = firebaseFarmerLogins.length > 0
                  ? firebaseFarmerLogins
                  : firebaseLogins.filter((l) => (l.role || '').toLowerCase() === 'farmer');
              } else if (loginsRoleFilter === 'buyer') {
                sourceList = firebaseBuyerLogins.length > 0
                  ? firebaseBuyerLogins
                  : firebaseLogins.filter((l) => {
                      const r = (l.role || '').toLowerCase();
                      return r === 'buyer' || r === 'trader';
                    });
              }

              const filtered = sourceList.filter((rec) => {
                if (!loginsSearch.trim()) return true;
                const q = loginsSearch.toLowerCase().trim();
                const recName = (rec.userName || '').toLowerCase();
                const recEmail = (rec.userEmail || '').toLowerCase();
                const recPhone = (rec.userPhone || '').toLowerCase();
                const recRole = (rec.role || '').toLowerCase();
                const recMethod = (rec.loginMethod || rec.method || '').toLowerCase();
                const recId = (rec.id || rec.loginId || '').toLowerCase();
                return (
                  recName.includes(q) ||
                  recEmail.includes(q) ||
                  recPhone.includes(q) ||
                  recRole.includes(q) ||
                  recMethod.includes(q) ||
                  recId.includes(q)
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-12 text-center bg-[#141517] border border-[#212327] rounded-2xl">
                    <Key className="w-12 h-12 text-sky-500/40 mx-auto mb-3" />
                    <h3 className="font-serif-display text-lg font-bold text-white">No Login Records Found In Firebase</h3>
                    <p className="text-xs text-[#a0a4ab] max-w-md mx-auto mt-1">
                      {loginsSearch.trim()
                        ? 'No login audit records match your search query.'
                        : `As soon as users authenticate in KisanSync, session documents will appear here from Firestore.`}
                    </p>
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto bg-[#141517] border border-[#212327] rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a0a0a] text-[#7d8187] font-mono border-b border-[#212327]">
                      <tr>
                        <th className="px-4 py-3.5">USER</th>
                        <th className="px-4 py-3.5">ROLE</th>
                        <th className="px-4 py-3.5">LOGIN METHOD</th>
                        <th className="px-4 py-3.5">LOCATION</th>
                        <th className="px-4 py-3.5">TIMESTAMP</th>
                        <th className="px-4 py-3.5">COLLECTION LOCATION</th>
                        <th className="px-4 py-3.5 text-right">FIREBASE STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#212327]">
                      {filtered.map((rec) => {
                        const methodStr = (rec.loginMethod || rec.method || '').toLowerCase();
                        const isGoogle = methodStr.includes('google');
                        const isDemo = methodStr.includes('demo') || methodStr.includes('quick');
                        const isFarmer = (rec.role || '').toLowerCase() === 'farmer';
                        const isBuyer = (rec.role || '').toLowerCase() === 'buyer' || (rec.role || '').toLowerCase() === 'trader';

                        return (
                          <tr key={rec.id || rec.loginId || `login_${Math.random()}`} className="hover:bg-[#1a1c20] transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="font-bold text-white">{rec.userName || 'Kisan User'}</p>
                              <p className="text-[10px] font-mono text-[#7d8187]">
                                {rec.userEmail || rec.userPhone || rec.userId}
                              </p>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                rec.role === 'Admin'
                                  ? 'bg-[#ff7a17]/20 text-[#ff7a17] border border-[#ff7a17]/30'
                                  : isFarmer
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {rec.role || 'Farmer'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#212327] text-white font-mono text-[11px]">
                                {isGoogle ? (
                                  <>
                                    <span className="text-red-400 font-bold">G</span>
                                    <span>Google OAuth</span>
                                  </>
                                ) : isDemo ? (
                                  <>
                                    <span className="text-amber-400">⚡</span>
                                    <span>One-Click Demo</span>
                                  </>
                                ) : (
                                  <>
                                    <Key className="w-3 h-3 text-sky-400" />
                                    <span>{rec.loginMethod || rec.method || 'Phone / Password'}</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-[#a0a4ab]">
                              {rec.location || 'Gujarat, India'}
                            </td>
                            <td className="px-4 py-3.5 font-mono text-[#dadbdf]">
                              {rec.timestamp}
                            </td>
                            <td className="px-4 py-3.5 font-mono text-[11px]">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sky-400">📁 user_logins</span>
                                {isFarmer && (
                                  <span className="text-emerald-400 font-semibold">📁 farmer_logins</span>
                                )}
                                {isBuyer && (
                                  <span className="text-amber-400 font-semibold">📁 buyer_logins</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Stored
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB: FIREBASE FARMER CROP SCANS */}
        {activeTab === 'firebase-scans' && (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-[#141517] border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <Scan className="w-3.5 h-3.5" />
                      FIRESTORE DATABASE: crop_scans & farmer_scans
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      REALTIME SYNCED
                    </span>
                  </div>
                  <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-white">
                    Farmers Crop Diagnostics & Scanning Log
                  </h2>
                  <p className="text-xs text-[#a0a4ab] mt-1 font-mono">
                    Project: <span className="text-emerald-400 font-semibold">{firebaseConfig.projectId}</span> • Every AI diagnostic scan performed by farmers is saved permanently to Firebase with disease detection, quality grade & treatments.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-[#7d8187] font-mono">TOTAL CROP SCANS</p>
                    <p className="text-xl font-bold text-emerald-400 font-mono">{firebaseCropScans.length}</p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-5 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8187]" />
                  <input
                    type="text"
                    placeholder="Search by crop, farmer name, health status, symptoms, or disease..."
                    value={scansSearch}
                    onChange={(e) => setScansSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Scans List / Cards */}
            {firebaseCropScans.filter((scan) => {
              if (!scansSearch.trim()) return true;
              const q = scansSearch.toLowerCase().trim();
              const crop = (scan.cropType || '').toLowerCase();
              const sub = (scan.subjectIdentification || '').toLowerCase();
              const disease = (scan.diseaseDetected || '').toLowerCase();
              const farmer = (scan.farmerName || '').toLowerCase();
              const loc = (scan.farmerLocation || '').toLowerCase();
              const status = (scan.healthStatus || '').toLowerCase();
              return (
                crop.includes(q) ||
                sub.includes(q) ||
                disease.includes(q) ||
                farmer.includes(q) ||
                loc.includes(q) ||
                status.includes(q)
              );
            }).length === 0 ? (
              <div className="p-12 text-center bg-[#141517] border border-[#212327] rounded-2xl">
                <Scan className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
                <h3 className="font-serif-display text-lg font-bold text-white">No Crop Scans Found In Firebase</h3>
                <p className="text-xs text-[#a0a4ab] max-w-md mx-auto mt-1">
                  {scansSearch.trim()
                    ? 'No crop scans match your search query.'
                    : 'When farmers analyze their crops in the AI Crop Diagnostic Analyzer, all diagnostic findings, symptoms, and organic treatment prescriptions will be logged to Firestore.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firebaseCropScans
                  .filter((scan) => {
                    if (!scansSearch.trim()) return true;
                    const q = scansSearch.toLowerCase().trim();
                    const crop = (scan.cropType || '').toLowerCase();
                    const sub = (scan.subjectIdentification || '').toLowerCase();
                    const disease = (scan.diseaseDetected || '').toLowerCase();
                    const farmer = (scan.farmerName || '').toLowerCase();
                    const loc = (scan.farmerLocation || '').toLowerCase();
                    const status = (scan.healthStatus || '').toLowerCase();
                    return (
                      crop.includes(q) ||
                      sub.includes(q) ||
                      disease.includes(q) ||
                      farmer.includes(q) ||
                      loc.includes(q) ||
                      status.includes(q)
                    );
                  })
                  .map((scan) => {
                    const isHealthy = (scan.healthStatus || '').toLowerCase().includes('healthy') ||
                                      (scan.diseaseDetected || '').toLowerCase().includes('healthy') ||
                                      (scan.diseaseDetected || '').toLowerCase().includes('no disease');

                    return (
                      <div
                        key={scan.id || scan.scanId || `scan_${Math.random()}`}
                        className="bg-[#141517] border border-[#212327] hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-all"
                      >
                        {/* Header: Crop name & Health Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif-display text-lg font-bold text-white">
                                {scan.cropType}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                  isHealthy
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {scan.healthStatus || (isHealthy ? 'Healthy Canopy' : 'Disease Detected')}
                              </span>
                            </div>
                            <p className="text-xs text-[#a0a4ab] mt-0.5">
                              {scan.subjectIdentification || scan.cropType}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Firestore Sync
                            </span>
                            <p className="text-[10px] font-mono text-[#7d8187] mt-1">
                              {scan.timestamp ? new Date(scan.timestamp).toLocaleString('en-IN') : 'Recent'}
                            </p>
                          </div>
                        </div>

                        {/* Disease & Quality Metrics */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] text-xs">
                          <div>
                            <span className="text-[10px] text-[#7d8187] font-mono uppercase block">Diagnosis / Disease</span>
                            <span className={`font-semibold ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {scan.diseaseDetected || 'Healthy / No Pathogens'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#7d8187] font-mono uppercase block">AI Quality Score</span>
                            <span className="font-bold text-white font-mono">
                              {scan.aiQualityScore || 90}/100 ({scan.qualityGrade || 'Grade A'})
                            </span>
                          </div>
                        </div>

                        {/* Farmer & Location Info */}
                        <div className="flex items-center justify-between text-xs text-[#a0a4ab] border-t border-[#212327] pt-3">
                          <div>
                            <span className="text-[10px] text-[#7d8187] uppercase block font-mono">Farmer Profile</span>
                            <span className="text-white font-medium">{scan.farmerName}</span>
                            {scan.farmerPhone && (
                              <span className="text-[11px] text-[#7d8187] ml-1.5">({scan.farmerPhone})</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[#7d8187] uppercase block font-mono">Farm Location</span>
                            <span className="text-white">{scan.farmerLocation || 'Gujarat, India'}</span>
                          </div>
                        </div>

                        {/* Symptoms Observed */}
                        {scan.primarySymptomsObserved && scan.primarySymptomsObserved.length > 0 && (
                          <div>
                            <span className="text-[10px] text-[#7d8187] uppercase font-mono block mb-1">Symptoms Identified</span>
                            <div className="flex flex-wrap gap-1.5">
                              {scan.primarySymptomsObserved.map((symptom, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-[#1f2227] text-[#dadbdf] rounded text-[11px]"
                                >
                                  • {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Treatment Summary */}
                        {scan.organicTreatment && scan.organicTreatment.length > 0 && (
                          <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs">
                            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                              🌿 Prescribed Organic Treatment
                            </span>
                            <p className="text-[#dadbdf] text-[11px] leading-relaxed">
                              {scan.organicTreatment.join(' • ')}
                            </p>
                          </div>
                        )}

                        {/* Footer Collection Meta */}
                        <div className="text-[10px] font-mono text-[#7d8187] flex items-center justify-between pt-1">
                          <span>Firestore: <strong className="text-emerald-400">crop_scans/{scan.id}</strong></span>
                          <span>Eligible: <strong className="text-white">{scan.marketEligibility || 'Grade A'}</strong></span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: SUSPEND / BLOCK ACCOUNT CONFIRMATION */}
      {/* ======================================================== */}
      {blockTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141517] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/15 text-rose-400 rounded-xl shrink-0">
                <Ban className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif-display text-lg font-bold text-white">
                  Suspend & Block Account
                </h3>
                <p className="text-xs text-[#a0a4ab] mt-1">
                  Enforce APMC regulatory suspension on this citizen profile.
                </p>
              </div>
              <button
                onClick={() => setBlockTargetUser(null)}
                className="text-[#7d8187] hover:text-white text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Target Account Summary Card */}
            <div className="mt-4 p-3 bg-[#0a0a0a] rounded-xl border border-[#212327] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={blockTargetUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={blockTargetUser.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold text-white text-sm">{blockTargetUser.name}</p>
                  <p className="text-[#7d8187] font-mono text-[11px]">
                    {blockTargetUser.role} • {blockTargetUser.phone}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#212327] text-[#dadbdf]">
                {blockTargetUser.id}
              </span>
            </div>

            {/* Regulatory Reasons Selection */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold text-[#dadbdf] font-mono">
                Select Regulatory Violation Reason:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {STANDARD_BLOCK_REASONS.map((reason, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedBlockReason === reason
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : 'bg-[#0a0a0a] border-[#212327] text-[#a0a4ab] hover:border-[#33363f]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="blockReason"
                      checked={selectedBlockReason === reason}
                      onChange={() => setSelectedBlockReason(reason)}
                      className="mt-0.5 text-[#ff7a17] focus:ring-[#ff7a17]"
                    />
                    <span className="leading-snug">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Notes / Specific Violation Field */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#dadbdf] mb-1 font-mono">
                Custom or Supplemental Justification (Optional):
              </label>
              <input
                type="text"
                value={customBlockReason}
                onChange={(e) => setCustomBlockReason(e.target.value)}
                placeholder="Add specific APMC lot numbers or inspector memo reference..."
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs text-white placeholder:text-[#7d8187] focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Warning Alert */}
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>
                Once suspended, this user will be immediately rejected upon login or OTP verification and prevented from bidding or selling on the exchange.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBlockTargetUser(null)}
                className="px-4 py-2.5 bg-[#1a1c20] hover:bg-[#25282e] text-[#dadbdf] text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Confirm Immediate Suspension</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PERMANENTLY DELETE ACCOUNT CONFIRMATION */}
      {/* ======================================================== */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141517] border border-rose-600/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-600/15 text-rose-500 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg font-bold text-white">
                  Permanently Delete Account?
                </h3>
                <p className="text-xs text-[#a0a4ab] mt-1">
                  You are about to irreversibly erase this citizen account from the system registry.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-[#0a0a0a] rounded-xl border border-rose-500/30 text-xs">
              <p className="font-bold text-white text-sm">{deleteTargetUser.name}</p>
              <p className="text-[#a0a4ab] text-xs mt-0.5">
                Role: <span className="text-white font-semibold">{deleteTargetUser.role}</span> • Phone: <span className="text-white font-mono">{deleteTargetUser.phone}</span>
              </p>
              <p className="text-[11px] text-[#7d8187] font-mono mt-1">
                UID: {deleteTargetUser.id}
              </p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              <p className="font-semibold text-rose-400 mb-1">Irreversible Administrative Action</p>
              <p className="text-[11px] leading-relaxed">
                Deleting this account completely removes their profile, trading credentials, listed crop auctions, and active bids. This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTargetUser(null)}
                className="px-4 py-2.5 bg-[#1a1c20] hover:bg-[#25282e] text-[#dadbdf] text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: REGISTER NEW USER / ONBOARD CITIZEN */}
      {/* ======================================================== */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141517] border border-[#212327] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#212327]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#ff7a17]/10 text-[#ff7a17] rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-white">
                    Register New Citizen / Merchant Account
                  </h3>
                  <p className="text-xs text-[#a0a4ab]">
                    Direct APMC administrative onboarding and profile issuance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(false)}
                className="text-[#7d8187] hover:text-white text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                  Account Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Farmer', 'Trader', 'Buyer'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewUserRole(r)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        newUserRole === r
                          ? 'bg-[#ff7a17] text-black border-[#ff7a17]'
                          : 'bg-[#0a0a0a] text-[#a0a4ab] border-[#212327] hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mukeshbhai D. Patel"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="farmer@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                    Mandi District / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand, Gujarat"
                    value={newUserLocation}
                    onChange={(e) => setNewUserLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                    {newUserRole === 'Farmer' ? 'KCC Card / 7-12 Record' : 'APMC Trader License No.'}
                  </label>
                  <input
                    type="text"
                    placeholder={newUserRole === 'Farmer' ? 'GJ-KCC-99214' : 'APMC-TRD-4482'}
                    value={newUserKcc}
                    onChange={(e) => setNewUserKcc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#dadbdf] mb-1 font-mono">
                  Administrative Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Onboarded during APMC farmer outreach drive..."
                  value={newUserNotes}
                  onChange={(e) => setNewUserNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0a0a0a] border border-[#212327] rounded-xl text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2.5 bg-[#1a1c20] hover:bg-[#25282e] text-[#dadbdf] text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ff7a17] hover:bg-[#e06912] text-black text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register & Issue Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: INSPECT ACCOUNT DOSSIER */}
      {/* ======================================================== */}
      {inspectTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141517] border border-[#212327] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#212327]">
              <div className="flex items-center gap-3">
                <img
                  src={inspectTargetUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={inspectTargetUser.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ff7a17]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-display text-lg font-bold text-white">
                      {inspectTargetUser.name}
                    </h3>
                    {inspectTargetUser.verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-[#a0a4ab]">
                    APMC Dossier • UID: <span className="font-mono text-[#dadbdf]">{inspectTargetUser.id}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectTargetUser(null)}
                className="text-[#7d8187] hover:text-white text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Dossier Body */}
            <div className="mt-4 space-y-4 text-xs">
              {/* Status and Role Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0a] border border-[#212327]">
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">STATUS</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {inspectTargetUser.isBlocked || inspectTargetUser.status === 'Blocked' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                        <Ban className="w-3.5 h-3.5" /> Suspended / Blocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-[#7d8187] font-mono">ROLE & STANDING</p>
                  <p className="font-bold text-white text-xs mt-0.5">
                    {inspectTargetUser.role} • {inspectTargetUser.rating ? `★ ${inspectTargetUser.rating}` : 'Unrated'}
                  </p>
                </div>
              </div>

              {/* If Blocked reason */}
              {(inspectTargetUser.isBlocked || inspectTargetUser.status === 'Blocked') && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-300">
                  <p className="font-bold text-rose-400 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Suspension Reason
                  </p>
                  <p className="text-xs leading-relaxed">
                    {inspectTargetUser.blockReason || 'Regulatory violation or non-settlement.'}
                  </p>
                  {inspectTargetUser.blockedAt && (
                    <p className="text-[10px] text-rose-400/80 font-mono mt-1">
                      Enforcement Timestamp: {inspectTargetUser.blockedAt}
                    </p>
                  )}
                </div>
              )}

              {/* Registry Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0a0a0a] border border-[#212327]">
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">MOBILE NUMBER</p>
                  <p className="font-mono text-white font-semibold mt-0.5">{inspectTargetUser.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">EMAIL ADDRESS</p>
                  <p className="text-white truncate mt-0.5">{inspectTargetUser.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">LOCATION / MANDI</p>
                  <p className="text-white mt-0.5">{inspectTargetUser.location}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">KCC / APMC LICENSE</p>
                  <p className="font-mono text-white mt-0.5">{inspectTargetUser.kccOrLicense || 'Not on file'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">ACTIVE MANDI LISTINGS</p>
                  <p className="text-white font-bold mt-0.5">{inspectTargetUser.totalListings || 0} Lots</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7d8187] font-mono">ACTIVE AUCTION BIDS</p>
                  <p className="text-white font-bold mt-0.5">{inspectTargetUser.activeBids || 0} Bids</p>
                </div>
              </div>

              {inspectTargetUser.notes && (
                <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#212327]">
                  <p className="text-[10px] text-[#7d8187] font-mono mb-1">INTERNAL ADMINISTRATIVE NOTES</p>
                  <p className="text-[#dadbdf] italic">{inspectTargetUser.notes}</p>
                </div>
              )}
            </div>

            {/* Dossier Actions Footer */}
            <div className="mt-6 pt-4 border-t border-[#212327] flex items-center justify-between gap-3">
              {inspectTargetUser.id !== 'admin_sih_2026' ? (
                <div className="flex items-center gap-2">
                  {inspectTargetUser.isBlocked || inspectTargetUser.status === 'Blocked' ? (
                    <button
                      onClick={() => {
                        onUnblockAccount(inspectTargetUser.id);
                        setInspectTargetUser(null);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unblock Account</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const target = inspectTargetUser;
                        setInspectTargetUser(null);
                        setBlockTargetUser(target);
                        setSelectedBlockReason(STANDARD_BLOCK_REASONS[0]);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Block Account</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const target = inspectTargetUser;
                      setInspectTargetUser(null);
                      setDeleteTargetUser(target);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-[#ff7a17] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Root Admin
                </span>
              )}

              <button
                type="button"
                onClick={() => setInspectTargetUser(null)}
                className="px-4 py-2 bg-[#212327] hover:bg-[#2c3037] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
