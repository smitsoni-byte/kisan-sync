import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { mockUser } from '../data/mockData';
import { 
  Sprout, 
  Lock, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Sun, 
  Moon, 
  UserPlus, 
  LogIn, 
  MapPin, 
  Award, 
  Users, 
  Building2, 
  KeyRound, 
  RefreshCw,
  X,
  Check,
  AlertCircle,
  User,
  Shield
} from 'lucide-react';
import { 
  recordUserLoginToFirestore, 
  saveAccountToFirestore, 
  signInWithGoogle, 
  firebaseConfig 
} from '../services/firebase';


export const ADMIN_PASSWORD = 'SIH_2026_timeMBIT';

export const ADMIN_PROFILE: UserProfile = {
  id: 'admin_sih_2026',
  name: 'System Administrator (SIH)',
  role: 'Admin',
  location: 'Gandhinagar State APMC HQ, Gujarat',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phone: '+91 79 2325 0000',
  email: 'admin@kisansync.gov.in',
  rating: 5.0,
  totalListings: 18,
  activeBids: 84,
  status: 'Active',
  isBlocked: false,
};

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'admin';
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (view: ViewMode) => void;
  onOpenTerms?: () => void;
  accounts?: UserProfile[];
  onRegisterAccount?: (account: UserProfile) => void;
}

// Preset verified Demo Users for instant testing
const DEMO_USERS: (UserProfile & { description: string; demoPhone: string })[] = [
  {
    ...mockUser,
    id: 'usr_farmer_ramesh',
    name: 'Ramesh Patel',
    role: 'Farmer',
    location: 'Anand, Gujarat',
    phone: '+91 98765 43210',
    demoPhone: '9876543210',
    description: 'Cotton & Wheat Farmer • 4.9★ Rating • KCC 785',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    totalListings: 4,
    activeBids: 18,
  },
  {
    id: 'usr_trader_vikram',
    name: 'Vikram Sharma',
    role: 'Trader',
    location: 'APMC Unjha, Gujarat',
    phone: '+91 98234 56789',
    demoPhone: '9823456789',
    description: 'APMC Licensed Merchant • Cumin & Spices Trader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    totalListings: 0,
    activeBids: 24,
  },
  {
    id: 'usr_buyer_priya',
    name: 'Priya Mehta',
    role: 'Buyer',
    location: 'Ahmedabad Agro Exports',
    phone: '+91 97123 45678',
    demoPhone: '9712345678',
    description: 'Corporate Bulk Procurement Head • Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 5.0,
    totalListings: 0,
    activeBids: 32,
  },
];

const STATES_DISTRICTS = [
  { state: 'Gujarat', districts: ['Anand', 'Rajkot', 'Ahmedabad', 'Surat', 'Mehsana', 'Vadodara', 'Junagadh', 'Kutch', 'Unjha Mandi'] },
  { state: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Jalandhar', 'Kapurthala'] },
  { state: 'Haryana', districts: ['Karnal', 'Hisar', 'Kurukshetra', 'Ambala', 'Sirsa', 'Rohtak'] },
  { state: 'Maharashtra', districts: ['Nashik', 'Pune', 'Nagpur', 'Solapur', 'Kolhapur', 'Ahmednagar'] },
  { state: 'Madhya Pradesh', districts: ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Hoshangabad'] },
  { state: 'Rajasthan', districts: ['Jaipur', 'Kota', 'Jodhpur', 'Bikaner', 'Sri Ganganagar'] },
  { state: 'Uttar Pradesh', districts: ['Varanasi', 'Lucknow', 'Kanpur', 'Agra', 'Meerut', 'Bareilly'] },
  { state: 'Karnataka', districts: ['Hubli', 'Mysore', 'Belgaum', 'Bellary', 'Shimoga'] },
];

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onNavigate,
  onOpenTerms,
  accounts,
  onRegisterAccount
}) => {
  const { currentLanguage, setIsSelectorOpen } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const isGu = currentLanguage.code === 'gu';
  const isHi = currentLanguage.code === 'hi';

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'admin'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Password Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Admin Login State
  const [adminIdentifier, setAdminIdentifier] = useState('admin@kisansync.gov.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // OTP Login State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);

  // Sign Up Form State
  const [signupRole, setSignupRole] = useState<'Farmer' | 'Trader' | 'Buyer'>('Farmer');
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState('Anand');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [kccOrLicense, setKccOrLicense] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Handle OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle Standard Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      toast.error(
        isGu ? 'કૃપા કરીને ફોન નંબર અથવા ઇમેઇલ દાખલ કરો' : 'Please enter Mobile Number or Email',
        isGu ? 'લૉગિન માટે માન્ય વિગત જરૂરી છે.' : 'A valid credential is required to log in.'
      );
      return;
    }

    if (!loginPassword) {
      toast.error(
        isGu ? 'પાસવર્ડ દાખલ કરો' : 'Password Required',
        isGu ? 'કૃપા કરીને તમારો પાસવર્ડ લખો.' : 'Please enter your password.'
      );
      return;
    }

    // Check if user is logging in as Admin via admin password or identifier
    const isAttemptingAdmin = 
      loginPassword.trim() === ADMIN_PASSWORD || 
      loginIdentifier.toLowerCase().trim() === 'admin' || 
      loginIdentifier.toLowerCase().trim() === 'admin@kisansync.gov.in';

    if (isAttemptingAdmin) {
      if (loginPassword.trim() === ADMIN_PASSWORD) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          recordUserLoginToFirestore(ADMIN_PROFILE, 'Admin Security Key');
          onLoginSuccess(ADMIN_PROFILE);
          toast.success(
            isGu ? 'એડમિન લૉગિન અધિકૃત!' : 'Admin Portal Authenticated',
            isGu ? 'SIH 2026 એડમિનિસ્ટ્રેશન કંટ્રોલ સેન્ટરમાં આપનું સ્વાગત છે.' : 'Welcome to the SIH 2026 Central Agricultural Administration Console.'
          );
        }, 400);
        return;
      } else {
        toast.error(
          'Admin Authentication Failed',
          isGu ? 'ખોટો એડમિન સિક્યુરિટી પાસવર્ડ.' : 'Invalid administrator security credentials.'
        );
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const allAccounts = accounts && accounts.length > 0 ? accounts : DEMO_USERS;
      const cleanId = loginIdentifier.replace(/\D/g, '');
      const normalizedId = loginIdentifier.toLowerCase().trim();

      // Match existing registered account or demo user
      const matched = allAccounts.find(
        (u) =>
          (cleanId && u.phone.replace(/\D/g, '').includes(cleanId)) ||
          (u.email && u.email.toLowerCase() === normalizedId) ||
          u.name.toLowerCase().includes(normalizedId)
      );

      // Check if the account has been suspended or blocked by Admin
      if (matched && (matched.isBlocked || matched.status === 'Blocked')) {
        toast.error(
          isGu ? 'ખાતું બ્લૉક થયેલ છે' : 'Account Blocked / Suspended',
          isGu
            ? `આ ખાતું એડમિનિસ્ટ્રેટર દ્વારા બ્લૉક કરેલ છે. કારણ: ${matched.blockReason || 'નિયમ ઉલ્લંઘન'}. સંપર્ક કરો: admin@kisansync.gov.in`
            : `Access Denied: This account has been suspended by the APMC Administrator. Reason: ${matched.blockReason || 'Regulatory compliance violation'}. Contact: admin@kisansync.gov.in`
        );
        return;
      }

      const userToLogin: UserProfile = matched || {
        id: 'usr_' + Date.now(),
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Kisan User',
        role: 'Farmer',
        location: 'Anand, Gujarat',
        phone: loginIdentifier.startsWith('+91') ? loginIdentifier : `+91 ${loginIdentifier}`,
        email: loginIdentifier.includes('@') ? loginIdentifier : '',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 4.9,
        totalListings: 1,
        activeBids: 3,
        status: 'Active',
        isBlocked: false
      };

      recordUserLoginToFirestore(userToLogin, 'Password Credentials');
      onLoginSuccess(userToLogin);
      toast.success(
        isGu ? `સ્વાગત છે, ${userToLogin.name}!` : `Welcome back, ${userToLogin.name}!`,
        isGu ? 'કિસાનસિંકમાં સફળતાપૂર્વક પ્રવેશ કર્યો.' : 'Successfully logged in to KisanSync.'
      );
    }, 500);
  };

  // Handle Dedicated Admin Portal Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      toast.error(
        isGu ? 'એડમિન પાસવર્ડ જરૂરી છે' : 'Admin Password Required',
        isGu ? 'કૃપા કરીને એડમિન સિક્યુરિટી પાસવર્ડ દાખલ કરો.' : 'Please enter the administrator security key.'
      );
      return;
    }

    if (adminPassword.trim() !== ADMIN_PASSWORD) {
      toast.error(
        isGu ? 'ખોટો એડમિન પાસવર્ડ' : 'Authentication Failed',
        isGu ? 'દાખલ કરેલો એડમિન પાસવર્ડ ખોટો છે.' : 'Incorrect administrator security password.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      recordUserLoginToFirestore(ADMIN_PROFILE, 'Admin Dedicated Portal Key');
      onLoginSuccess(ADMIN_PROFILE);
      toast.success(
        isGu ? 'એડમિન લૉગિન સફળ!' : 'Admin Portal Authenticated',
        isGu ? 'SIH 2026 કંટ્રોલ સેન્ટરમાં આપનું સ્વાગત છે.' : 'Welcome to the SIH 2026 Agricultural Admin Control Center.'
      );
    }, 400);
  };

  // Handle Send OTP
  const handleSendOtp = () => {
    const cleanPhone = otpPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error(
        isGu ? 'અમાન્ય ફોન નંબર' : 'Invalid Mobile Number',
        isGu ? 'કૃપા કરીને 10 અંકનો માન્ય મોબાઇલ નંબર દાખલ કરો.' : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setOtpSent(true);
    setOtpTimer(30);
    setEnteredOtp(['1', '2', '3', '4']); // Pre-fill with demo OTP for instant frictionless test
    toast.ai(
      isGu ? 'OTP મોકલ્યો: 1234' : 'Demo OTP Sent: 1234',
      isGu ? '+91 ' + cleanPhone + ' પર ચકાસણી કોડ મોકલવામાં આવ્યો છે.' : `Verification code sent to +91 ${cleanPhone}. (Auto-filled 1234 for testing)`
    );
  };

  // Handle Verify OTP Login
  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = enteredOtp.join('');
    if (otpString.length < 4) {
      toast.error(
        isGu ? 'કૃપા કરીને 4 અંકનો OTP દાખલ કરો' : 'Enter 4-digit OTP',
        isGu ? 'ચકાસણી માટે સંપૂર્ણ OTP જરૂરી છે.' : 'Complete 4-digit OTP is required.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = otpPhone.replace(/\D/g, '');
      const allAccounts = accounts && accounts.length > 0 ? accounts : DEMO_USERS;
      const matched = allAccounts.find(
        (u) =>
          u.phone.replace(/\D/g, '').includes(cleanPhone) ||
          (u as any).demoPhone === cleanPhone
      );

      // Check if account has been blocked by Admin
      if (matched && (matched.isBlocked || matched.status === 'Blocked')) {
        toast.error(
          isGu ? 'ખાતું બ્લૉક થયેલ છે' : 'Account Blocked / Suspended',
          isGu
            ? `આ ખાતું એડમિનિસ્ટ્રેટર દ્વારા બ્લૉક કરેલ છે. કારણ: ${matched.blockReason || 'નિયમ ઉલ્લંઘન'}.`
            : `Access Denied: This account has been suspended by the APMC Administrator. Reason: ${matched.blockReason || 'Regulatory compliance violation'}.`
        );
        return;
      }

      const userToLogin: UserProfile = matched || {
        id: 'usr_' + Date.now(),
        name: 'Kisan User (' + cleanPhone.slice(-4) + ')',
        role: 'Farmer',
        location: 'Anand, Gujarat',
        phone: `+91 ${cleanPhone}`,
        email: '',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 4.8,
        totalListings: 1,
        activeBids: 2,
        status: 'Active',
        isBlocked: false
      };

      recordUserLoginToFirestore(userToLogin, 'Mobile OTP');
      onLoginSuccess(userToLogin);
      toast.success(
        isGu ? `OTP ચકાસાયો! સ્વાગત છે, ${userToLogin.name}` : `OTP Verified! Welcome, ${userToLogin.name}`,
        isGu ? 'તમારું મોબાઇલ નંબર સફળતાપૂર્વક ચકાસાયું છે.' : 'Mobile identity verified successfully.'
      );
    }, 450);
  };

  // Handle New User Registration / Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error(
        isGu ? 'નામ દાખલ કરો' : 'Full Name Required',
        isGu ? 'કૃપા કરીને તમારું પૂરું નામ લખો.' : 'Please enter your full name.'
      );
      return;
    }

    const cleanPhone = signupPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error(
        isGu ? 'અમાન્ય ફોન નંબર' : 'Invalid Mobile Number',
        isGu ? 'કૃપા કરીને 10 અંકનો મોબાઇલ નંબર દાખલ કરો.' : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!signupPassword || signupPassword.length < 6) {
      toast.error(
        isGu ? 'નબળો પાસવર્ડ' : 'Weak Password',
        isGu ? 'પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ.' : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error(
        isGu ? 'પાસવર્ડ મેળ ખાતા નથી' : 'Passwords Do Not Match',
        isGu ? 'બંને પાસવર્ડ સરખા હોવા જરૂરી છે.' : 'Please ensure both password fields match.'
      );
      return;
    }

    if (!agreedTerms) {
      toast.error(
        isGu ? 'શરતો સ્વીકારો' : 'Accept Terms',
        isGu ? 'કૃપા કરીને સેવા શરતો સ્વીકારો.' : 'Please accept the Terms of Service to proceed.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const newUser: UserProfile = {
        id: 'usr_' + Date.now(),
        name: fullName.trim(),
        role: signupRole,
        location: `${selectedDistrict}, ${selectedState}`,
        phone: `+91 ${cleanPhone}`,
        avatar:
          signupRole === 'Farmer'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            : signupRole === 'Trader'
            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        rating: 5.0,
        totalListings: 0,
        activeBids: 0,
        email: signupEmail.trim() || '',
        kccOrLicense: kccOrLicense.trim() || '',
        status: 'Active',
        isBlocked: false,
        joinedAt: 'Today',
        verified: false
      };

      if (onRegisterAccount) {
        onRegisterAccount(newUser);
      }

      // Persist user account and login event to Firebase Firestore
      saveAccountToFirestore(newUser);
      recordUserLoginToFirestore(newUser, 'New User Sign Up');

      onLoginSuccess(newUser);
      toast.success(
        isGu ? `ખાતું સફળતાપૂર્વક બન્યું!` : isHi ? `खाता सफलतापूर्वक बनाया गया!` : `Account Created Successfully!`,
        isGu
          ? `સ્વાગત છે ${newUser.name}! તમે ${newUser.role} તરીકે નોંધાયા છો.`
          : `Welcome ${newUser.name}! Registered as verified ${newUser.role} in ${newUser.location}.`
      );
    }, 600);
  };

  // Handle Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { user: fbUser, error } = await signInWithGoogle();
      if (error || !fbUser) {
        setIsLoading(false);
        if (error && !error.includes('popup-closed') && !error.includes('cancelled')) {
          toast.error('Google Sign-In', error || 'Google sign-in could not be completed.');
        }
        return;
      }

      const email = fbUser.email || '';
      const cleanEmail = email.toLowerCase().trim();
      const allAccounts = accounts && accounts.length > 0 ? accounts : DEMO_USERS;
      const matched = allAccounts.find(
        (a) => (a.email && a.email.toLowerCase().trim() === cleanEmail) || a.name.toLowerCase() === (fbUser.displayName || '').toLowerCase()
      );

      const userProfile: UserProfile = matched || {
        id: `usr_fb_${fbUser.uid.slice(0, 8)}`,
        name: fbUser.displayName || (email ? email.split('@')[0] : 'Kisan User'),
        role: 'Farmer',
        email: email,
        phone: fbUser.phoneNumber || '+91 98765 43210',
        location: 'Gujarat, India',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5.0,
        totalListings: 1,
        activeBids: 2,
        status: 'Active',
        isBlocked: false,
        joinedAt: 'Today',
        verified: true,
      };

      if (!matched && onRegisterAccount) {
        onRegisterAccount(userProfile);
      }
      await saveAccountToFirestore(userProfile);
      await recordUserLoginToFirestore(userProfile, 'Google Firebase Authentication');

      setIsLoading(false);
      onLoginSuccess(userProfile);
      toast.success(
        isGu ? `ગૂગલ લૉગિન સફળ! સ્વાગત છે, ${userProfile.name}` : `Google Sign-In Successful! Welcome, ${userProfile.name}`,
        `Firebase Database Synced (${firebaseConfig.projectId})`
      );
    } catch (err: any) {
      setIsLoading(false);
      toast.error('Authentication Error', err?.message || 'Failed to authenticate with Firebase.');
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone || forgotPhone.length < 10) {
      toast.error('Mobile Required', 'Enter your 10-digit registered mobile number.');
      return;
    }
    if (!forgotOtpSent) {
      setForgotOtpSent(true);
      setForgotOtp('1234');
      toast.ai('Reset OTP Sent', 'A verification code has been sent to +91 ' + forgotPhone + ' (Use 1234)');
    } else {
      if (!forgotNewPassword || forgotNewPassword.length < 6) {
        toast.error('Password Too Short', 'Enter at least 6 characters for new password.');
        return;
      }
      setIsForgotModalOpen(false);
      setForgotOtpSent(false);
      toast.success('Password Reset Successful', 'You can now sign in with your new password.');
    }
  };

  const availableDistricts =
    STATES_DISTRICTS.find((s) => s.state === selectedState)?.districts || STATES_DISTRICTS[0].districts;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff7a17]/30 selection:text-white flex flex-col justify-between relative overflow-x-hidden font-sans-body">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-radial from-[#ff7a17]/12 via-[#7c3aed]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-[#212327] bg-[#0a0a0a]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Go to KisanSync Home"
        >
          <div className="w-9 h-9 rounded-full bg-[#ff7a17] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-xl font-bold tracking-tight text-white">
              Kisan<span className="text-[#ff7a17]">Sync</span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider bg-[#ff7a17]/15 text-[#ff7a17] border border-[#ff7a17]/40 px-2 py-0.5 rounded-full uppercase">
              SK.AI
            </span>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="flex items-center gap-1.5 bg-[#141517] hover:bg-[#212327] border border-[#212327] rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-all active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-[#ff7a17]" />
            <span>{currentLanguage.nativeName}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-[#141517] hover:bg-[#212327] border border-[#212327] rounded-full text-white transition-all active:scale-95"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#ff7a17]" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* Skip / Browse as Guest */}
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-[#a0a4ab] hover:text-white px-3 py-1.5 rounded-full border border-transparent hover:border-[#212327] transition-all"
          >
            {isGu ? 'અતિથિ તરીકે જુઓ' : isHi ? 'अतिथि के रूप में देखें' : 'Browse as Guest'}
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-xl">

          {/* Primary Form Card */}
          <div className="bg-[#141517] border border-[#212327] rounded-2xl shadow-2xl p-6 sm:p-8">
            
            {/* Tab Switcher: Sign In vs Sign Up vs Admin */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#0a0a0a] rounded-xl border border-[#212327] mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-[#ff7a17] text-black shadow-md'
                    : 'text-[#a0a4ab] hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{isGu ? 'લૉગ ઇન' : 'Sign In'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-[#ff7a17] text-black shadow-md'
                    : 'text-[#a0a4ab] hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{isGu ? 'ખાતું બનાવો' : 'Sign Up'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#ff7a17] text-black shadow-md'
                    : 'text-[#ff7a17] hover:bg-[#ff7a17]/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Admin</span>
              </button>
            </div>

            {/* TAB 1: SIGN IN / LOG IN */}
            {activeTab === 'login' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                    {isGu ? 'કિસાનસિંકમાં સાઇન ઇન કરો' : isHi ? 'किसानसिंक में साइन इन करें' : 'Sign in to KisanSync'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a0a4ab] mt-1">
                    {isGu
                      ? 'AI પાક તપાસ, મંડી હરાજી અને કિસાન ક્રેડિટ સ્કોર વાપરવા માટે પ્રવેશ કરો.'
                      : isHi
                      ? 'AI फसल जांच, मंडी नीलामी और किसान क्रेडिट स्कोर का उपयोग करने के लिए लॉगिन करें।'
                      : 'Access AI diagnostics, transparent mandi bidding, and Kisan Credit tools.'}
                  </p>
                </div>

                {/* Sub-toggle: Password vs Phone OTP */}
                <div className="flex items-center gap-2 border-b border-[#212327] pb-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`pb-1 transition-colors ${
                      loginMethod === 'password'
                        ? 'text-[#ff7a17] border-b-2 border-[#ff7a17]'
                        : 'text-[#7d8187] hover:text-white'
                    }`}
                  >
                    {isGu ? 'પાસવર્ડ સાથે' : 'Password Login'}
                  </button>
                  <span className="text-[#333]">•</span>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`pb-1 transition-colors ${
                      loginMethod === 'otp'
                        ? 'text-[#ff7a17] border-b-2 border-[#ff7a17]'
                        : 'text-[#7d8187] hover:text-white'
                    }`}
                  >
                    {isGu ? 'મોબાઇલ OTP સાથે' : 'Mobile OTP Login'}
                  </button>
                </div>

                {/* Method A: Password Login Form */}
                {loginMethod === 'password' && (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#dadbdf] mb-1.5">
                        {isGu ? 'મોબાઇલ નંબર અથવા ઇમેઇલ' : isHi ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. 9876543210 or ramesh@kisansync.in"
                          className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#dadbdf]">
                          {isGu ? 'પાસવર્ડ' : isHi ? 'पासवर्ड' : 'Password'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsForgotModalOpen(true)}
                          className="text-xs text-[#ff7a17] hover:underline"
                        >
                          {isGu ? 'પાસવર્ડ ભૂલી ગયા?' : isHi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-[#555] outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7d8187] hover:text-white p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 text-[#a0a4ab] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#ff7a17] bg-[#0a0a0a] border-[#212327]"
                        />
                        <span>{isGu ? 'આ ડિવાઇસ પર મને યાદ રાખો' : 'Remember me on this device'}</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-sm sm:text-base py-3 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>{isGu ? 'ચકાસણી થઈ રહી છે...' : 'Signing in...'}</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 text-black" />
                          <span>{isGu ? 'કિસાનસિંકમાં લૉગ ઇન કરો' : 'Sign In to KisanSync'}</span>
                          <ArrowRight className="w-4 h-4 text-black" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Method B: Mobile OTP Login Form */}
                {loginMethod === 'otp' && (
                  <form onSubmit={handleOtpLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#dadbdf] mb-1.5">
                        {isGu ? '10-અંકનો મોબાઇલ નંબર' : isHi ? '10-अंकों का मोबाइल नंबर' : '10-Digit Mobile Number'}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs font-mono text-[#a0a4ab]">
                          +91
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="flex-1 bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpTimer > 0}
                          className="px-4 py-2.5 bg-[#212327] hover:bg-[#2d3036] active:bg-[#383b42] text-white text-xs font-semibold rounded-xl border border-[#333] transition-all whitespace-nowrap cursor-pointer"
                        >
                          {otpTimer > 0 ? `${otpTimer}s` : otpSent ? (isGu ? 'ફરી મોકલો' : 'Resend') : (isGu ? 'OTP મોકલો' : 'Send OTP')}
                        </button>
                      </div>
                    </div>

                    {otpSent && (
                      <div className="p-4 bg-[#0a0a0a] border border-[#212327] rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#dadbdf]">
                            {isGu ? '4-અંકનો OTP દાખલ કરો' : 'Enter 4-Digit Verification Code'}
                          </label>
                          <span className="text-[11px] font-mono text-[#ff7a17] bg-[#ff7a17]/10 px-2 py-0.5 rounded">
                            Demo: 1234
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              maxLength={1}
                              value={enteredOtp[idx]}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newOtp = [...enteredOtp];
                                newOtp[idx] = val;
                                setEnteredOtp(newOtp);
                                if (val && idx < 3) {
                                  document.getElementById(`otp-input-${idx + 1}`)?.focus();
                                }
                              }}
                              className="w-12 h-12 text-center text-xl font-mono font-bold bg-[#141517] border border-[#ff7a17]/60 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#ff7a17]"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !otpSent}
                      className={`w-full min-h-[48px] flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-3 rounded-xl transition-all duration-150 shadow-lg cursor-pointer ${
                        otpSent
                          ? 'bg-[#ff7a17] hover:bg-[#e06912] text-black active:scale-[0.98]'
                          : 'bg-[#212327] text-[#777] cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isGu ? 'ચકાસણી થઈ રહી છે...' : 'Verifying...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isGu ? 'OTP ચકાસો અને લૉગ ઇન કરો' : 'Verify OTP & Enter App'}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#212327]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#141517] px-3 text-[#7d8187] uppercase tracking-wider font-mono text-[10px]">
                      {isGu ? 'અથવા ગૂગલ / ક્વિક એક્સેસ' : 'Or with Google / Quick Demo'}
                    </span>
                  </div>
                </div>

                {/* Firebase Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#0a0a0a] hover:bg-[#1a1c1e] text-white border border-[#212327] hover:border-[#383b42] font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isGu ? 'ગૂગલ એકાઉન્ટ સાથે સાઇન ઇન કરો (Firebase)' : 'Sign in with Google (Firebase)'}</span>
                </button>

                {/* Quick 1-Click Demo Profiles */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#a0a4ab] uppercase tracking-wider">
                      {isGu ? 'ઝડપી ડેમો પ્રોફાઇલ્સ (ઓટો-લૉગિન):' : 'Instant Demo Logins (Auto-sync):'}
                    </span>
                    <span className="text-[10px] text-[#ff7a17] font-mono">1-Click Live Test</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_USERS.map((demo) => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => {
                          recordUserLoginToFirestore(demo, 'Quick Demo Card Click');
                          onLoginSuccess(demo);
                          toast.success(
                            isGu ? `ડેમો લૉગિન: ${demo.name}` : `Demo Login: ${demo.name}`,
                            `${demo.role} • Firebase audit log recorded.`
                          );
                        }}
                        className="text-left p-2.5 rounded-xl bg-[#0a0a0a] border border-[#212327] hover:border-[#ff7a17]/50 hover:bg-[#141517] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={demo.avatar}
                            alt={demo.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#333]"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white group-hover:text-[#ff7a17] truncate">
                              {demo.name}
                            </p>
                            <p className="text-[10px] text-[#7d8187] truncate">
                              {demo.role} • {demo.location.split(',')[0]}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Firebase Real-time DB Status Badge */}
                <div className="p-3 bg-[#0a0a0a]/70 rounded-xl border border-[#212327] flex items-center justify-between text-xs text-[#a0a4ab]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-[11px] text-[#dadbdf]">Firebase Firestore Live</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#ff7a17] bg-[#ff7a17]/10 px-2 py-0.5 rounded">
                    Auto-logging logins
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: CREATE ACCOUNT / SIGN UP */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                    {isGu ? 'નવું કિસાનસિંક ખાતું બનાવો' : isHi ? 'नया किसानसिंक खाता बनाएं' : 'Create KisanSync Account'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a0a4ab] mt-1">
                    {isGu
                      ? 'ખેડૂતો, વેપારીઓ અને ખરીદદારો માટે માન્ય કૃષિ પ્રોફાઇલ.'
                      : 'Verified agricultural registry for farmers, merchants, and buyers.'}
                  </p>
                </div>

                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#dadbdf] mb-2">
                    {isGu ? 'તમારી ભૂમિકા પસંદ કરો' : isHi ? 'अपनी भूमिका चुनें' : 'Select Your Role'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole('Farmer')}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                        signupRole === 'Farmer'
                          ? 'bg-[#ff7a17]/15 border-[#ff7a17] text-white ring-1 ring-[#ff7a17]'
                          : 'bg-[#0a0a0a] border-[#212327] text-[#a0a4ab] hover:border-[#333]'
                      }`}
                    >
                      <Sprout className={`w-5 h-5 mb-1 ${signupRole === 'Farmer' ? 'text-[#ff7a17]' : 'text-[#7d8187]'}`} />
                      <span className="text-xs font-bold text-white">
                        {isGu ? 'ખેડૂત' : isHi ? 'किसान' : 'Farmer'}
                      </span>
                      <span className="text-[9px] text-[#7d8187] mt-0.5">
                        {isGu ? 'વેચાણ & નિદાન' : 'Sell & AI Scan'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('Trader')}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                        signupRole === 'Trader'
                          ? 'bg-[#ff7a17]/15 border-[#ff7a17] text-white ring-1 ring-[#ff7a17]'
                          : 'bg-[#0a0a0a] border-[#212327] text-[#a0a4ab] hover:border-[#333]'
                      }`}
                    >
                      <Users className={`w-5 h-5 mb-1 ${signupRole === 'Trader' ? 'text-[#ff7a17]' : 'text-[#7d8187]'}`} />
                      <span className="text-xs font-bold text-white">
                        {isGu ? 'વેપારી' : isHi ? 'आढ़तिया' : 'Trader'}
                      </span>
                      <span className="text-[9px] text-[#7d8187] mt-0.5">
                        {isGu ? 'મંડી હરાજી' : 'APMC Bidding'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('Buyer')}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                        signupRole === 'Buyer'
                          ? 'bg-[#ff7a17]/15 border-[#ff7a17] text-white ring-1 ring-[#ff7a17]'
                          : 'bg-[#0a0a0a] border-[#212327] text-[#a0a4ab] hover:border-[#333]'
                      }`}
                    >
                      <Building2 className={`w-5 h-5 mb-1 ${signupRole === 'Buyer' ? 'text-[#ff7a17]' : 'text-[#7d8187]'}`} />
                      <span className="text-xs font-bold text-white">
                        {isGu ? 'ખરીદનાર' : isHi ? 'खरीदार' : 'Buyer'}
                      </span>
                      <span className="text-[9px] text-[#7d8187] mt-0.5">
                        {isGu ? 'બલ્ક ખરીદી' : 'Bulk Procure'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'પૂરું નામ' : isHi ? 'पूरा नाम' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Bhavesh Patel"
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#555] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'મોબાઇલ નંબર (10 અંક)' : isHi ? 'मोबाइल नंबर' : 'Mobile Number'}
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2.5 bg-[#0a0a0a] border border-r-0 border-[#212327] rounded-l-xl text-xs font-mono text-[#888]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-r-xl px-3 py-2.5 text-sm text-white placeholder-[#555] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* State & District Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'રાજ્ય' : isHi ? 'राज्य' : 'State'}
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        const dists = STATES_DISTRICTS.find((s) => s.state === e.target.value)?.districts;
                        if (dists && dists.length > 0) setSelectedDistrict(dists[0]);
                      }}
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                    >
                      {STATES_DISTRICTS.map((s) => (
                        <option key={s.state} value={s.state} className="bg-[#141517] text-white">
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'જિલ્લો / મુખ્ય મંડી' : isHi ? 'ज़िला / मंडी' : 'District / APMC Hub'}
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d} className="bg-[#141517] text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional KCC or APMC License ID */}
                <div>
                  <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                    {signupRole === 'Farmer'
                      ? (isGu ? 'કિસાન ક્રેડિટ કાર્ડ (KCC) નંબર (વૈકલ્પિક)' : 'Kisan Credit Card (KCC) No. (Optional)')
                      : (isGu ? 'APMC લાઇસન્સ અથવા GSTIN (વૈકલ્પિક)' : 'APMC Mandi License / GSTIN (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={kccOrLicense}
                    onChange={(e) => setKccOrLicense(e.target.value)}
                    placeholder={signupRole === 'Farmer' ? 'e.g. KCC-GJ-2024-8892' : 'e.g. APMC-UNJ-LIC-7741'}
                    className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555] outline-none font-mono"
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'પાસવર્ડ બનાવો' : isHi ? 'पासवर्ड बनाएं' : 'Create Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl pl-3 pr-9 py-2.5 text-xs text-white placeholder-[#555] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d8187] hover:text-white"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'પાસવર્ડ ફરી લખો' : isHi ? 'पासवर्ड पुष्टि करें' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] outline-none"
                    />
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-[#a0a4ab] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#ff7a17] bg-[#0a0a0a] border-[#212327] mt-0.5"
                    />
                    <span>
                      {isGu
                        ? 'હું કિસાનસિંકના ખેડૂત ડેટા ગોપનીયતા નિયમો અને સેવા શરતો સાથે સંમત છું.'
                        : 'I agree to the KisanSync Terms of Service and transparent farmer data privacy guidelines.'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-sm sm:text-base py-3 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg cursor-pointer mt-3"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>{isGu ? 'ખાતું બની રહ્યું છે...' : 'Creating verified account...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>{isGu ? 'નોંધણી પૂર્ણ કરો & પ્રવેશ મેળવો' : 'Complete Registration & Sign In'}</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: DEDICATED ADMIN PORTAL */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-[#ff7a17]/15 text-[#ff7a17] border border-[#ff7a17]/30">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                      Admin Portal Login
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#a0a4ab]">
                    Smart India Hackathon (SIH 2026) • APMC Regulatory & Agricultural AI Console
                  </p>
                </div>

                {/* SIH 2026 Security Advisory Banner */}
                <div className="p-3.5 bg-[#0a0a0a] rounded-xl border border-[#ff7a17]/30 text-xs text-[#dadbdf] flex items-start gap-3">
                  <Shield className="w-4 h-4 text-[#ff7a17] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <span>Restricted Administrator Access</span>
                      <span className="text-[10px] font-mono bg-[#ff7a17]/20 text-[#ff7a17] px-1.5 py-0.2 rounded font-bold">
                        SIH 2026
                      </span>
                    </p>
                    <p className="text-[11px] text-[#a0a4ab] mt-0.5">
                      Authorised login for state mandi regulators, 7/12 land inspectors, and AI model auditors.
                    </p>
                  </div>
                </div>

                {/* Admin Identifier */}
                <div>
                  <label className="block text-xs font-semibold text-[#dadbdf] mb-1.5 font-mono">
                    Admin Identification / Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="admin@kisansync.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#dadbdf] font-mono">
                      Admin Security Password
                    </label>
                    <span className="text-[10px] text-[#ff7a17] font-mono font-semibold">
                      Restricted Access
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-3" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin security password"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#0a0a0a] border border-[#212327] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#7d8187] focus:outline-none focus:border-[#ff7a17] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-3 text-[#7d8187] hover:text-white"
                      title={showAdminPassword ? 'Hide password' : 'Show password'}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-sm sm:text-base py-3 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg cursor-pointer mt-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Verifying Regulatory Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>Authenticate & Open Admin Console</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#7d8187] font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a17]" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#ff7a17]" />
              <span>e-NAM & APMC Verified</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#ff7a17]" />
              <span>Direct Farmer Payouts</span>
            </div>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#141517] border border-[#212327] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-[#7d8187] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-[#ff7a17]" />
              <h3 className="font-serif-display text-lg font-bold text-white">
                {isGu ? 'પાસવર્ડ પુનઃપ્રાપ્તિ' : 'Reset Account Password'}
              </h3>
            </div>

            <p className="text-xs text-[#a0a4ab] mb-4">
              {isGu
                ? 'તમારા નોંધાયેલા મોબાઇલ નંબર પર સુરક્ષિત OTP મોકલવામાં આવશે.'
                : 'Enter your registered mobile number to receive a 4-digit SMS OTP reset code.'}
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                  {isGu ? 'નોંધાયેલ મોબાઇલ નંબર' : 'Registered Mobile Number'}
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 bg-[#0a0a0a] border border-r-0 border-[#212327] rounded-l-xl text-xs font-mono text-[#888]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-r-xl px-3 py-2 text-sm text-white placeholder-[#555] outline-none font-mono"
                  />
                </div>
              </div>

              {forgotOtpSent && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'SMS OTP કોડ (1234)' : 'SMS OTP Code (Pre-filled: 1234)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#dadbdf] mb-1">
                      {isGu ? 'નવો પાસવર્ડ લખો' : 'Enter New Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#0a0a0a] border border-[#212327] focus:border-[#ff7a17] rounded-xl px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ff7a17] hover:bg-[#e06912] text-black font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                {forgotOtpSent ? (isGu ? 'પાસવર્ડ બદલો' : 'Confirm New Password') : (isGu ? 'OTP મોકલો' : 'Send Reset OTP')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer minimal info */}
      <footer className="relative z-10 py-4 px-4 text-center text-[11px] text-[#7d8187] border-t border-[#212327]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KisanSync • Smart India Hackathon (SIH) • Team Hexa Knights</span>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('landing')} className="hover:text-white">Home</button>
            <span>•</span>
            <button onClick={() => onNavigate('marketplace')} className="hover:text-white">Mandi</button>
            {onOpenTerms && (
              <>
                <span>•</span>
                <button onClick={onOpenTerms} className="hover:text-white">Privacy & Terms</button>
              </>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
};
