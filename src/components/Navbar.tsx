import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sprout, 
  Scan, 
  ShoppingBag, 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  Menu, 
  X, 
  Sparkles,
  MapPin,
  CheckCircle2,
  Globe,
  BookOpen,
  Sun,
  Moon,
  Star,
  MessageSquareQuote,
  Award,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown
} from 'lucide-react';


interface NavbarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup' | 'admin') => void;
  onLogout: () => void;
  onOpenListModal: () => void;
  onOpenManual?: () => void;
  onOpenReviews?: () => void;
  onOpenCreditModal?: () => void;
  onOpenTerms?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenAuth,
  onLogout,
  onOpenListModal,
  onOpenManual,
  onOpenReviews,
  onOpenCreditModal,
  onOpenTerms
}) => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentLanguage, setIsSelectorOpen, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'landing' as ViewMode, label: t('home'), icon: Home },
    { id: 'dashboard' as ViewMode, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'analyzer' as ViewMode, label: t('fieldAnalyzer'), icon: Scan, badge: 'AI' },
    { id: 'marketplace' as ViewMode, label: t('tradingMarket'), icon: ShoppingBag, badge: 'Live' },
    ...(user?.role === 'Admin' ? [{ id: 'admin' as ViewMode, label: 'Admin Console', icon: ShieldCheck, badge: 'SIH' }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#212327] text-white transition-all w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2">
            
            {/* Logo & Brand - Clean single-line wordmark */}
            <div 
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff7a17] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                  Kisan<span className="text-[#ff7a17]">Sync</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider bg-[#ff7a17]/15 text-[#ff7a17] border border-[#ff7a17]/40 px-2 py-0.5 rounded-full uppercase shrink-0">
                  SK.AI
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links - Pill Shape */}
            <nav className="hidden md:flex items-center gap-1 bg-[#141517] p-1.5 rounded-full border border-[#212327]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-150 select-none active:scale-[0.97] ${
                      isActive
                        ? 'bg-white text-black shadow-sm font-semibold'
                        : 'text-[#dadbdf] hover:text-white hover:bg-[#1a1c20]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#7d8187]'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-mono tracking-wider font-bold px-2 py-0.2 rounded-full ${
                        isActive ? 'bg-[#ff7a17] text-black' : 'bg-[#212327] text-[#ff7a17]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right User Bar & Actions */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              {/* Light / Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] rounded-full p-2.5 min-h-[44px] min-w-[44px] text-xs font-semibold text-white transition-all duration-150 active:scale-95 shadow-xs"
                title={theme === 'dark' ? (currentLanguage.code === 'gu' ? 'લાઇટ મોડ ચાલુ કરો' : 'Switch to Light Mode') : (currentLanguage.code === 'gu' ? 'ડાર્ક મોડ ચાલુ કરો' : 'Switch to Dark Mode')}
                aria-label="Toggle color theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#ff7a17] transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              {/* Kisan Credit Score Button */}
              {onOpenCreditModal && (
                <button
                  onClick={onOpenCreditModal}
                  className="flex items-center gap-1.5 bg-[#ff7a17]/15 hover:bg-[#ff7a17]/25 active:bg-[#ff7a17]/35 border border-[#ff7a17]/40 rounded-full px-3.5 py-2 min-h-[44px] text-xs font-semibold text-white transition-all duration-150 active:scale-95 shadow-xs font-mono group"
                  title={currentLanguage.code === 'gu' ? 'કિસાન ક્રેડિટ & વેપાર ઇતિહાસ સ્કોર (785)' : 'Kisan Credit & Trade Score (785/900)'}
                >
                  <Award className="w-4 h-4 text-[#ff7a17] group-hover:scale-110 transition-transform" />
                  <span className="hidden xl:inline">{currentLanguage.code === 'gu' ? 'ક્રેડિટ' : 'Credit'}</span>
                  <span className="bg-[#ff7a17] text-black font-bold px-1.5 py-0.2 rounded text-[10px]">785</span>
                </button>
              )}

              {/* User Manual / How to Use Guide Button */}
              {onOpenManual && (
                <button
                  onClick={onOpenManual}
                  className="flex items-center gap-1.5 bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] rounded-full px-3.5 py-2 min-h-[44px] text-xs font-semibold text-[#dadbdf] hover:text-white transition-all duration-150 active:scale-95 shadow-xs font-mono"
                  title={currentLanguage.code === 'gu' ? 'વપરાશ માર્ગદર્શિકા (User Manual)' : 'How to Use / Platform Manual'}
                >
                  <BookOpen className="w-4 h-4 text-[#ff7a17]" />
                  <span className="hidden lg:inline">{currentLanguage.code === 'gu' ? 'માર્ગદર્શિકા' : 'Manual'}</span>
                </button>
              )}


              {/* Community Reviews Button */}
              {onOpenReviews && (
                <button
                  onClick={onOpenReviews}
                  className="flex items-center gap-1.5 bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] rounded-full px-3.5 py-2 min-h-[44px] text-xs font-semibold text-[#dadbdf] hover:text-white transition-all duration-150 active:scale-95 shadow-xs font-mono"
                  title={currentLanguage.code === 'gu' ? 'ખેડૂત રિવ્યુ & રેટિંગ્સ (Reviews)' : 'Community Reviews & Ratings'}
                >
                  <Star className="w-4 h-4 text-[#ff7a17] fill-[#ff7a17]" />
                  <span className="hidden lg:inline">{currentLanguage.code === 'gu' ? 'રિવ્યુ' : 'Reviews'}</span>
                </button>
              )}

              {/* Language Picker Pill Button */}
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="flex items-center gap-2 bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] rounded-full px-3.5 py-2 min-h-[44px] text-xs font-semibold text-white transition-all duration-150 active:scale-95 shadow-xs"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-[#ff7a17]" />
                <span className="font-bold">{currentLanguage.nativeName}</span>
                <span className="text-[10px] bg-[#212327] px-1.5 py-0.5 rounded-full font-mono text-[#ff7a17]">
                  {currentLanguage.code.toUpperCase()}
                </span>
              </button>

              <button
                onClick={onOpenListModal}
                className="flex items-center gap-2 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-semibold text-sm px-4.5 py-2.5 min-h-[44px] rounded-full transition-all duration-150 active:scale-95 shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span>{t('listProduce')}</span>
              </button>

              {/* Profile Pill (When Logged In) vs Log In / Sign Up Buttons (When Logged Out) */}
              {user ? (
                <div className="relative">
                  <div 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 bg-[#141517] hover:bg-[#191919] active:bg-[#212327] border border-[#212327] hover:border-[#ff7a17]/50 rounded-full p-1.5 pr-3 min-h-[44px] cursor-pointer transition-all duration-150 active:scale-95 select-none"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#ff7a17]/70"
                    />
                    <div className="text-left text-xs">
                      <div className="font-semibold text-white flex items-center gap-1">
                        <span className="truncate max-w-[100px]">{user.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ff7a17]" />
                      </div>
                      <div className="text-[#7d8187] flex items-center gap-1 text-[10px] font-mono">
                        <MapPin className="w-2.5 h-2.5 text-[#ff7a17]" />
                        <span className="truncate max-w-[90px]">{user.location.split(',')[0]}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#7d8187] transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#141517] border border-[#212327] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="flex items-center gap-3 p-2 bg-[#0a0a0a] rounded-xl mb-2 border border-[#212327]">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-[#ff7a17]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-[#ff7a17] font-semibold">{user.role} • {user.phone}</p>
                          <p className="text-[10px] text-[#7d8187] truncate">{user.location}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        {user.role === 'Admin' ? (
                          <button
                            onClick={() => {
                              setCurrentView('admin');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#ff7a17] bg-[#ff7a17]/10 hover:bg-[#ff7a17]/20 border border-[#ff7a17]/30 transition-colors text-left font-semibold"
                          >
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck className="w-4 h-4 text-[#ff7a17]" />
                              <span>Admin Control Console</span>
                            </div>
                            <span className="text-[9px] bg-[#ff7a17] text-black font-mono font-bold px-1.5 py-0.2 rounded">
                              SIH 2026
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCurrentView('dashboard');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#dadbdf] hover:text-white hover:bg-[#1f2125] transition-colors text-left"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#ff7a17]" />
                            <span>Farmer Dashboard</span>
                          </button>
                        )}

                        {onOpenCreditModal && (
                          <button
                            onClick={() => {
                              onOpenCreditModal();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#dadbdf] hover:text-white hover:bg-[#1f2125] transition-colors text-left font-mono"
                          >
                            <div className="flex items-center gap-2.5">
                              <Award className="w-4 h-4 text-[#ff7a17]" />
                              <span>Credit Score</span>
                            </div>
                            <span className="bg-[#ff7a17] text-black font-bold text-[10px] px-1.5 py-0.2 rounded">785</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onOpenAuth('login');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#dadbdf] hover:text-white hover:bg-[#1f2125] transition-colors text-left"
                        >
                          <UserPlus className="w-4 h-4 text-emerald-400" />
                          <span>Switch User / Account</span>
                        </button>

                        <div className="border-t border-[#212327] my-1" />

                        <button
                          onClick={() => {
                            onLogout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out / Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1.5 bg-[#141517] hover:bg-[#212327] border border-[#212327] hover:border-white/30 rounded-full px-3.5 py-2 min-h-[44px] text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'લૉગ ઇન' : currentLanguage.code === 'hi' ? 'लॉग इन' : 'Log In'}</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="flex items-center gap-1.5 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] rounded-full px-4 py-2 min-h-[44px] text-xs font-bold text-black transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-black" />
                    <span>{currentLanguage.code === 'gu' ? 'સાઇન અપ' : currentLanguage.code === 'hi' ? 'साइन अप' : 'Sign Up'}</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('admin')}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#a0a4ab] hover:text-[#ff7a17] bg-[#141517] hover:bg-[#212327] border border-[#212327] hover:border-[#ff7a17]/40 rounded-full px-2.5 py-2 min-h-[44px] transition-all active:scale-95 cursor-pointer"
                    title="SIH 2026 Admin Portal"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a17]" />
                    <span className="hidden xl:inline">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Header Action Controls */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {/* Mobile Auth Button if not logged in */}
              {!user && (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 py-1.5 min-h-[36px] bg-[#ff7a17] text-black text-[11px] font-bold rounded-full flex items-center gap-1 transition-all"
                >
                  <LogIn className="w-3 h-3 text-black" />
                  <span>Log In</span>
                </button>
              )}

              {/* Theme Toggle Button Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center bg-[#141517] active:bg-[#212327] border border-[#212327] rounded-full text-white transition-all shrink-0"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-[#ff7a17]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                )}
              </button>

              {/* Language Selector */}
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="px-2.5 py-1.5 min-h-[36px] bg-[#141517] active:bg-[#212327] border border-[#212327] rounded-full text-xs font-bold flex items-center gap-1 text-white transition-all shrink-0"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#ff7a17]" />
                <span className="text-[11px] font-mono">{currentLanguage.code.toUpperCase()}</span>
              </button>

              {/* Sell Produce Quick Button (visible on screens >= 400px) */}
              <button
                onClick={onOpenListModal}
                className="hidden min-[400px]:flex items-center gap-1 bg-[#ff7a17] active:bg-[#e06912] text-black px-2.5 py-1.5 min-h-[36px] rounded-full font-bold text-xs shadow-sm transition-all shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 text-black" />
                <span className="truncate">{t('sell')}</span>
              </button>
              
              {/* Hamburger Drawer Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center text-[#dadbdf] hover:text-white active:bg-[#212327] bg-[#141517] rounded-full border border-[#212327] transition-all shrink-0"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-[#212327] px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
            {user ? (
              <div className="p-3 bg-[#191919] rounded-2xl mb-3 border border-[#212327] space-y-2.5">
                <div 
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#ff7a17]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{user.name}</p>
                    <p className="text-xs text-[#ff7a17] truncate">{user.role} • {user.location}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#ff7a17] shrink-0" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#26282c] text-xs">
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    className="text-[#dadbdf] hover:text-white"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-400 font-semibold hover:text-rose-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#141517] rounded-2xl mb-3 border border-[#212327] space-y-3">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#ff7a17]" />
                  <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {currentLanguage.code === 'gu' ? 'કિસાનસિંક માં સ્વાગત છે' : 'Welcome to KisanSync'}
                  </p>
                </div>
                <p className="text-xs text-[#a0a4ab]">
                  {currentLanguage.code === 'gu'
                    ? 'AI પાક તપાસ, મંડી હરાજી અને ક્રેડિટ સ્કોર વાપરવા માટે સાઇન ઇન કરો.'
                    : 'Sign in to access AI crop diagnostics, live mandi bidding, and Kisan Credit tools.'}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 bg-[#212327] hover:bg-[#2d3036] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-[#333] transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'લૉગ ઇન' : 'Log In'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 bg-[#ff7a17] hover:bg-[#e06912] text-black text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-black" />
                    <span>{currentLanguage.code === 'gu' ? 'સાઇન અપ' : 'Sign Up'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#ff7a17] text-black font-semibold'
                        : 'text-[#dadbdf] hover:bg-[#141517] active:bg-[#1f2125]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#ff7a17]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-black/20 text-black' : 'bg-[#212327] text-[#ff7a17]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Sell Option */}
              <button
                onClick={() => {
                  onOpenListModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-white hover:bg-[#141517] active:bg-[#1f2125] transition-colors border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-[#ff7a17]" />
                  <span>{currentLanguage.code === 'gu' ? 'પાક લિસ્ટ કરો (+ વેચો)' : '+ List Produce to Sell'}</span>
                </div>
                <span className="text-[10px] bg-[#ff7a17] text-black px-2.5 py-0.5 rounded-full font-bold">
                  SELL
                </span>
              </button>

              {/* Kisan Credit Score in Mobile Drawer */}
              {onOpenCreditModal && (
                <button
                  onClick={() => {
                    onOpenCreditModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-white bg-[#ff7a17]/10 hover:bg-[#ff7a17]/20 border border-[#ff7a17]/30 transition-colors font-mono"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'કિસાન ક્રેડિટ & વેપાર ઇતિહાસ' : 'Kisan Credit & Trade Score'}</span>
                  </div>
                  <span className="text-xs bg-[#ff7a17] text-black px-2.5 py-0.5 rounded-full font-bold">
                    785 / 900
                  </span>
                </button>
              )}

              {/* User Manual Guide */}
              {onOpenManual && (
                <button
                  onClick={() => {
                    onOpenManual();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#dadbdf] hover:bg-[#141517] active:bg-[#1f2125] transition-colors font-mono"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'વપરાશ માર્ગદર્શિકા (Manual)' : 'User Manual / Guide'}</span>
                  </div>
                  <span className="text-[10px] bg-[#212327] text-[#ff7a17] px-2 py-0.5 rounded-full font-bold">
                    GUIDE
                  </span>
                </button>
              )}


              {/* Community Reviews in Mobile Drawer */}
              {onOpenReviews && (
                <button
                  onClick={() => {
                    onOpenReviews();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#dadbdf] hover:bg-[#141517] active:bg-[#1f2125] transition-colors font-mono"
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#ff7a17] fill-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'ખેડૂત રિવ્યુ & રેટિંગ્સ (Reviews)' : 'Community Reviews & Ratings'}</span>
                  </div>
                  <span className="text-[10px] bg-[#ff7a17]/20 text-[#ff7a17] px-2 py-0.5 rounded-full font-bold">
                    4.9★
                  </span>
                </button>
              )}

              {/* Theme Switcher in Mobile Drawer */}
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#dadbdf] hover:bg-[#141517] active:bg-[#1f2125] transition-colors font-mono"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-[#ff7a17]" />
                  ) : (
                    <Moon className="w-5 h-5 text-indigo-500" />
                  )}
                  <span>
                    {theme === 'dark' 
                      ? (currentLanguage.code === 'gu' ? 'લાઇટ મોડ (Light Theme)' : 'Switch to Light Theme') 
                      : (currentLanguage.code === 'gu' ? 'ડાર્ક મોડ (Dark Theme)' : 'Switch to Dark Theme')}
                  </span>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  theme === 'dark' ? 'bg-[#ff7a17]/20 text-[#ff7a17]' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* Language Picker */}
              <button
                onClick={() => {
                  setIsSelectorOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#dadbdf] hover:bg-[#141517] active:bg-[#1f2125] transition-colors font-mono"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#ff7a17]" />
                  <span>{currentLanguage.code === 'gu' ? 'ભાષા પસંદ કરો (22+ Languages)' : 'Change Language'}</span>
                </div>
                <span className="text-xs bg-[#212327] text-white px-2 py-0.5 rounded-full font-bold">
                  {currentLanguage.nativeName}
                </span>
              </button>

              {/* Terms of Service & Privacy Policy in Mobile Drawer */}
              {onOpenTerms && (
                <button
                  onClick={() => {
                    onOpenTerms();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#dadbdf] hover:bg-[#141517] active:bg-[#1f2125] transition-colors font-mono border-t border-[#212327]/60 mt-1"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'સેવાની શરતો & પ્રાઇવસી પોલિસી' : 'Terms of Service & Privacy'}</span>
                  </div>
                  <span className="text-[10px] bg-[#212327] text-[#9aa0a6] px-2 py-0.5 rounded-full font-bold">
                    LEGAL
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Persistent Bottom Mobile Navigation Bar — 5 full-width accessible tabs */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0d0e]/95 backdrop-blur-xl border-t border-[#212327] px-2 py-1.5 shadow-2xl safe-area-bottom w-full max-w-full"
      >
        <div className="grid grid-cols-5 gap-1 items-center w-full max-w-md mx-auto">
          {/* 1. Home */}
          <button
            onClick={() => setCurrentView('landing')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 min-w-0 ${
              currentView === 'landing' 
                ? 'text-[#ff7a17] font-bold bg-[#141517] ring-1 ring-[#ff7a17]/30 shadow-xs' 
                : 'text-[#7d8187] hover:text-white active:text-white'
            }`}
          >
            <Home className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${currentView === 'landing' ? 'text-[#ff7a17] scale-110' : 'text-[#7d8187]'}`} />
            <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
              {t('home')}
            </span>
          </button>

          {/* 2. Dashboard */}
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 min-w-0 ${
              currentView === 'dashboard' 
                ? 'text-[#ff7a17] font-bold bg-[#141517] ring-1 ring-[#ff7a17]/30 shadow-xs' 
                : 'text-[#7d8187] hover:text-white active:text-white'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${currentView === 'dashboard' ? 'text-[#ff7a17] scale-110' : 'text-[#7d8187]'}`} />
            <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
              {t('dashboard')}
            </span>
          </button>

          {/* 3. Field Analyzer (AI) */}
          <button
            onClick={() => setCurrentView('analyzer')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 min-w-0 relative ${
              currentView === 'analyzer' 
                ? 'text-[#ff7a17] font-bold bg-[#141517] ring-1 ring-[#ff7a17]/30 shadow-xs' 
                : 'text-[#7d8187] hover:text-white active:text-white'
            }`}
          >
            <div className="relative">
              <Scan className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${currentView === 'analyzer' ? 'text-[#ff7a17] scale-110' : 'text-[#7d8187]'}`} />
              <span className="absolute -top-1 -right-2.5 text-[8px] font-mono font-bold bg-[#ff7a17] text-black px-1 rounded-full shadow-xs">
                AI
              </span>
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
              {currentLanguage.code === 'gu' ? 'પાક નિદાન' : currentLanguage.code === 'hi' ? 'फसल जांच' : 'AI Scan'}
            </span>
          </button>

          {/* 4. Trading Market */}
          <button
            onClick={() => setCurrentView('marketplace')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 min-w-0 relative ${
              currentView === 'marketplace' 
                ? 'text-[#ff7a17] font-bold bg-[#141517] ring-1 ring-[#ff7a17]/30 shadow-xs' 
                : 'text-[#7d8187] hover:text-white active:text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${currentView === 'marketplace' ? 'text-[#ff7a17] scale-110' : 'text-[#7d8187]'}`} />
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#ff7a17] animate-pulse" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
              {currentLanguage.code === 'gu' ? 'બજાર' : currentLanguage.code === 'hi' ? 'मंडी' : 'Market'}
            </span>
          </button>

          {/* 5. User Manual Guide */}
          <button
            onClick={onOpenManual || (() => onOpenListModal())}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#dadbdf] hover:text-white active:scale-95 transition-all duration-150 min-w-0"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#ff7a17]" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center text-[#ff7a17] font-semibold">
              {currentLanguage.code === 'gu' ? 'માર્ગદર્શિકા' : currentLanguage.code === 'hi' ? 'मार्गदर्शिका' : 'Guide'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

