/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, CropListing, ActivityItem, CropAnalysisResult, UserReview, UserProfile, MarketplaceOrder } from './types';
import { mockUser, initialListings, mockWeather, initialActivities, initialReviews, mockCreditProfile, mockTradeLedger, initialAccounts } from './data/mockData';
import { recordMarketplaceBidToFirestore, recordMarketplaceOrderToFirestore } from './services/firebase';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageSelector } from './components/LanguageSelector';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { FieldAnalyzer } from './components/FieldAnalyzer';
import { Marketplace } from './components/Marketplace';
import { ListCropModal } from './components/ListCropModal';
import { UserManualModal } from './components/UserManualModal';
import { AddReviewModal } from './components/AddReviewModal';
import { ReviewsModal } from './components/ReviewsModal';
import { KisanCreditModal } from './components/KisanCreditModal';
import { TermsPrivacyModal } from './components/TermsPrivacyModal';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';

function AppContent() {
  // Persistent Authenticated User session in localStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kisansync_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return null;
  });

  // Default view: if user not logged in, prompt Auth page; otherwise admin or landing
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('kisansync_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'Admin') return 'admin';
        return 'landing';
      } catch (e) {
        /* ignore */
      }
    }
    return 'auth';
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');
  const toast = useToast();
  const { currentLanguage } = useLanguage();

  // Persistent listings state in localStorage
  const [listings, setListings] = useState<CropListing[]>(() => {
    const saved = localStorage.getItem('kisansync_listings_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Check older storage key and migrate
    const oldSaved = localStorage.getItem('kisansync_listings');
    if (oldSaved) {
      try {
        const parsed: CropListing[] = JSON.parse(oldSaved);
        return parsed.map((item) => {
          if (item.id === 'crop-103' || item.cropName.toLowerCase().includes('basmati')) {
            return { ...item, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' };
          }
          return item;
        });
      } catch (e) { /* ignore */ }
    }
    return initialListings;
  });

  // Persistent activities state
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('kisansync_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialActivities;
  });

  // Persistent user reviews state in localStorage
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const saved = localStorage.getItem('kisansync_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialReviews;
  });

  // Persistent accounts state (Admin user management & authentication)
  const [accounts, setAccounts] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('kisansync_all_accounts_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        /* ignore */
      }
    }
    return initialAccounts;
  });

  useEffect(() => {
    localStorage.setItem('kisansync_all_accounts_v2', JSON.stringify(accounts));
  }, [accounts]);

  // Admin user management handlers
  const handleBlockAccount = (accountId: string, reason?: string) => {
    if (accountId === 'admin_sih_2026') {
      toast.error('Action Prohibited', 'Root System Administrator account is protected and cannot be suspended.');
      return;
    }
    const targetUser = accounts.find((a) => a.id === accountId);
    const resolvedReason = reason || 'Suspended for regulatory compliance review by APMC Administrator';

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              status: 'Blocked',
              isBlocked: true,
              blockReason: resolvedReason,
              blockedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            }
          : acc
      )
    );

    // If current logged-in user is the one blocked, terminate active session
    if (currentUser?.id === accountId) {
      setCurrentUser(null);
      localStorage.removeItem('kisansync_auth_user');
      setCurrentView('auth');
      toast.error('Account Suspended', 'Your active session has been suspended by the administrator.');
    } else {
      toast.success(
        'Account Suspended',
        `${targetUser?.name || 'User'} has been blocked and restricted from accessing the platform.`
      );
    }

    // Log administrative action
    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'bid',
      title: `Account Suspended: ${targetUser?.name || accountId}`,
      description: `User account (${targetUser?.role || 'User'}) blocked by Admin. Reason: ${resolvedReason}`,
      timestamp: 'Just Now',
      statusBadge: 'Account Blocked'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleUnblockAccount = (accountId: string) => {
    const targetUser = accounts.find((a) => a.id === accountId);
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              status: 'Active',
              isBlocked: false,
              blockReason: undefined,
              blockedAt: undefined
            }
          : acc
      )
    );

    toast.success(
      'Account Restored',
      `Access reinstated for ${targetUser?.name || 'User'}. Account is now Active.`
    );

    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'bid',
      title: `Account Restored: ${targetUser?.name || accountId}`,
      description: `User account unblocked and restored to active trading status.`,
      timestamp: 'Just Now',
      statusBadge: 'Account Active'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (accountId === 'admin_sih_2026') {
      toast.error('Action Prohibited', 'Root System Administrator account is protected and cannot be deleted.');
      return;
    }
    const targetUser = accounts.find((a) => a.id === accountId);
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));

    // If current logged-in user is the one deleted, terminate active session
    if (currentUser?.id === accountId) {
      setCurrentUser(null);
      localStorage.removeItem('kisansync_auth_user');
      setCurrentView('auth');
      toast.error('Account Deleted', 'Your account has been permanently removed by the administrator.');
    } else {
      toast.success(
        'Account Deleted',
        `Permanent deletion complete for ${targetUser?.name || 'User'}.`
      );
    }

    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'bid',
      title: `Account Deleted: ${targetUser?.name || accountId}`,
      description: `Permanently removed user account and revoked credentials from state APMC registry.`,
      timestamp: 'Just Now',
      statusBadge: 'Account Deleted'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleCreateAccount = (newAcc: UserProfile) => {
    setAccounts((prev) => [newAcc, ...prev]);
    toast.success('Account Created', `Created verified profile for ${newAcc.name} (${newAcc.role}).`);
  };

  const handleRegisterAccount = (newAcc: UserProfile) => {
    setAccounts((prev) => {
      const exists = prev.some((a) => a.id === newAcc.id || a.phone === newAcc.phone);
      if (exists) return prev;
      return [newAcc, ...prev];
    });
  };

  // Modal State for Listing New Crop
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [modalInitialAnalysis, setModalInitialAnalysis] = useState<CropAnalysisResult | null>(null);

  // Modal State for User Manual / Guide
  const [isManualOpen, setIsManualOpen] = useState(false);

  // Modal State for Reviews
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // Modal State for Kisan Credit & Trade History Score
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  // Modal State for Terms of Service & Privacy Policy
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);


  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('kisansync_listings_v2', JSON.stringify(listings));
    localStorage.setItem('kisansync_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('kisansync_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('kisansync_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Handle Placing a New Bid on Marketplace
  const handlePlaceBid = (cropId: string, amount: number, buyerName: string) => {
    const targetCrop = listings.find((l) => l.id === cropId);

    const newBid = {
      id: 'bid_' + Date.now(),
      cropId: cropId,
      buyerName: buyerName,
      buyerLocation: currentUser?.location || 'Verified Buyer',
      amount: amount,
      timestamp: 'Just Now',
      isHighest: true
    };

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === cropId) {
          const updatedHistory = [
            newBid,
            ...item.bidsHistory.map((b) => ({ ...b, isHighest: false }))
          ];

          return {
            ...item,
            currentHighestBid: amount,
            bidCount: item.bidCount + 1,
            bidsHistory: updatedHistory
          };
        }
        return item;
      })
    );

    // Save bid to Firebase Firestore database asynchronously
    if (targetCrop) {
      recordMarketplaceBidToFirestore(
        targetCrop,
        newBid,
        currentUser?.location,
        currentUser?.phone
      ).catch((err) => console.warn('[Firebase Bid Sync]', err));

      // Add activity log item
      const newAct: ActivityItem = {
        id: 'act_' + Date.now(),
        type: 'bid',
        title: `New Top Bid: ₹${amount.toLocaleString('en-IN')}/qtl`,
        description: `${buyerName} placed top bid on ${targetCrop.cropName} lot (#${targetCrop.id})`,
        timestamp: 'Just Now',
        amount: amount,
        statusBadge: 'Active High Bid'
      };
      setActivities((prev) => [newAct, ...prev]);

      toast.success(
        currentLanguage.code === 'gu' ? 'નવી બોલી સ્વીકારાઈ!' : 'Top Bid Placed Successfully!',
        currentLanguage.code === 'gu'
          ? `₹${amount.toLocaleString('en-IN')}/ક્વિન્ટલ ની બોલી ${targetCrop.cropName} પર નોંધાઈ ગઈ છે.`
          : `Your bid of ₹${amount.toLocaleString('en-IN')}/qtl is now leading for ${targetCrop.cropName}.`
      );
    }
  };

  // Handle Saving & Finalizing Direct Mandi Trade Order
  const handleSaveOrder = async (order: MarketplaceOrder) => {
    // 1. Update listings quantity
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === order.listingId) {
          const remainingQty = Math.max(0, item.quantityQuintals - order.quantitySoldQuintals);
          return {
            ...item,
            quantityQuintals: remainingQty,
          };
        }
        return item;
      })
    );

    // 2. Add Activity item
    const newAct: ActivityItem = {
      id: 'act_ord_' + Date.now(),
      type: 'payout',
      title: `Trade Finalized: ${order.cropName} (${order.quantitySoldQuintals} Qtl)`,
      description: `Buyer ${order.buyerName} purchased ${order.quantitySoldQuintals} Qtl from ${order.farmerSellerName} at ₹${order.pricePerQuintal.toLocaleString('en-IN')}/Qtl`,
      timestamp: 'Just Now',
      amount: order.totalPrice,
      statusBadge: 'Firebase Order Stored',
    };
    setActivities((prev) => [newAct, ...prev]);

    toast.success(
      currentLanguage.code === 'gu' ? 'વેપાર ઓર્ડર Firebase માં સાચવ્યો!' : 'Mandi Trade Order Saved to Firebase!',
      currentLanguage.code === 'gu'
        ? `ખરીદનાર ${order.buyerName} અને ખેડૂત ${order.farmerSellerName} નો વેપાર સફળતાપૂર્વક Firebase ડેટાબેઝમાં નોંધાઈ ગયો છે.`
        : `Order #${order.orderId} (₹${order.totalPrice.toLocaleString('en-IN')}) saved to Firebase Firestore database.`
    );
  };

  // Handle Adding a New Crop Listing
  const handleAddListing = (newListing: CropListing) => {
    setListings((prev) => [newListing, ...prev]);

    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'listing',
      title: 'New Crop Lot Published',
      description: `${newListing.quantityQuintals} Quintals of ${newListing.cropName} listed for bidding.`,
      timestamp: 'Just Now',
      statusBadge: 'Live Lot'
    };
    setActivities((prev) => [newAct, ...prev]);
    setCurrentView('marketplace');

    toast.success(
      currentLanguage.code === 'gu' ? 'પાક સફળતાપૂર્વક લિસ્ટ થયો!' : 'Crop Lot Published to Market!',
      currentLanguage.code === 'gu'
        ? `${newListing.cropName} (${newListing.quantityQuintals} ક્વિન્ટલ) હરાજી માટે લાઈવ છે.`
        : `${newListing.quantityQuintals} Quintals of ${newListing.cropName} is now live for buyers to bid.`
    );
  };

  // Handle Adding a New User Review
  const handleAddReview = (newReview: UserReview) => {
    setReviews((prev) => [newReview, ...prev]);

    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'listing',
      title: `⭐ ${newReview.rating}★ Review Submitted`,
      description: `"${newReview.title}" published by ${newReview.name} (${newReview.location})`,
      timestamp: 'Just Now',
      statusBadge: 'Verified Review'
    };
    setActivities((prev) => [newAct, ...prev]);

    toast.success(
      currentLanguage.code === 'gu' ? 'રિવ્યુ સફળતાપૂર્વક પ્રકાશિત થયો!' : 'Review Submitted Successfully!',
      currentLanguage.code === 'gu'
        ? 'કિસાનસિંક સમુદાય સાથે તમારો પ્રતિસાદ શેર કરવા બદલ આભાર.'
        : 'Thank you for sharing your verified experience with the KisanSync community.'
    );
  };

  // Handle Helpful Vote on a Review
  const handleHelpfulVote = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  // Open List modal pre-populated with AI analysis result
  const handleOpenListModalWithAnalysis = (analysis: CropAnalysisResult) => {
    setModalInitialAnalysis(analysis);
    setIsListModalOpen(true);
  };

  // Handle Login / Registration Success
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('kisansync_auth_user', JSON.stringify(user));
    if (user.role === 'Admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kisansync_auth_user');
    setCurrentView('auth');
    toast.info(
      currentLanguage.code === 'gu' ? 'લૉગ આઉટ સફળ' : 'Logged Out',
      currentLanguage.code === 'gu'
        ? 'તમે કિસાનસિંક માંથી સફળતાપૂર્વક સાઇન આઉટ થયા છો.'
        : 'You have been signed out of KisanSync.'
    );
  };

  // Open Auth Page
  const handleOpenAuth = (mode: 'login' | 'signup' | 'admin' = 'login') => {
    setAuthMode(mode);
    setCurrentView('auth');
  };

  // Dedicated Full-Page Auth View
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans-body selection:bg-[#ff7a17]/30 selection:text-white w-full max-w-full overflow-x-hidden relative">
        <AuthPage
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={setCurrentView}
          onOpenTerms={() => setIsTermsModalOpen(true)}
          accounts={accounts}
          onRegisterAccount={handleRegisterAccount}
        />

        {/* Global Multi-Language Modal Selector */}
        <LanguageSelector />

        {/* Terms of Service & Privacy Policy Modal */}
        <TermsPrivacyModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans-body selection:bg-[#ff7a17]/30 selection:text-white w-full max-w-full overflow-x-hidden relative">
      
      {/* Global Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenListModal={() => {
          setModalInitialAnalysis(null);
          setIsListModalOpen(true);
        }}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenReviews={() => setIsReviewsModalOpen(true)}
        onOpenCreditModal={() => setIsCreditModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
      />

      {/* Main Content Body View Switcher */}
      <main className="flex-1 pb-20 md:pb-0 w-full max-w-full overflow-x-hidden">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={setCurrentView}
            user={currentUser}
            onOpenAuth={handleOpenAuth}
            onOpenListModal={() => {
              setModalInitialAnalysis(null);
              setIsListModalOpen(true);
            }}
            onOpenManual={() => setIsManualOpen(true)}
            reviews={reviews}
            onOpenAddReview={() => setIsAddReviewOpen(true)}
            onOpenReviewsModal={() => setIsReviewsModalOpen(true)}
          />
        )}

        {currentView === 'dashboard' && (
          <FarmerDashboard
            user={currentUser || mockUser}
            listings={listings}
            activities={activities}
            weather={mockWeather}
            onNavigate={setCurrentView}
            onOpenListModal={() => {
              setModalInitialAnalysis(null);
              setIsListModalOpen(true);
            }}
            onOpenManual={() => setIsManualOpen(true)}
          />
        )}

        {currentView === 'analyzer' && (
          <FieldAnalyzer
            currentUser={currentUser}
            onNavigate={setCurrentView}
            onOpenTerms={() => setIsTermsModalOpen(true)}
            onAnalysisComplete={(result) => {
              const newAct: ActivityItem = {
                id: 'act_' + Date.now(),
                type: 'analysis',
                title: 'AI Crop Diagnostic Completed',
                description: `${result.cropType} scanned: ${result.healthStatus} (${result.aiQualityScore}/100 Quality).`,
                timestamp: 'Just Now',
                statusBadge: 'AI Scanned'
              };
              setActivities((prev) => [newAct, ...prev]);

              toast.ai(
                currentLanguage.code === 'gu' ? 'પાક નિદાન સફળતાપૂર્વક પૂર્ણ!' : 'AI Crop Diagnostic Ready!',
                `${result.cropType}: ${result.healthStatus} (Quality Score: ${result.aiQualityScore}/100)`
              );
            }}
            onOpenListModalWithAnalysis={handleOpenListModalWithAnalysis}
          />
        )}

        {currentView === 'marketplace' && (
          <Marketplace
            listings={listings}
            currentUser={currentUser}
            onPlaceBid={handlePlaceBid}
            onSaveOrder={handleSaveOrder}
            onOpenListModal={() => {
              setModalInitialAnalysis(null);
              setIsListModalOpen(true);
            }}
            onOpenReviews={() => setIsReviewsModalOpen(true)}
            onOpenAddReview={() => setIsAddReviewOpen(true)}
            onOpenCreditModal={() => setIsCreditModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            user={currentUser || mockUser}
            listings={listings}
            activities={activities}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            accounts={accounts}
            onBlockAccount={handleBlockAccount}
            onUnblockAccount={handleUnblockAccount}
            onDeleteAccount={handleDeleteAccount}
            onCreateAccount={handleCreateAccount}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        onNavigate={setCurrentView} 
        onOpenManual={() => setIsManualOpen(true)}
        onOpenReviews={() => setIsReviewsModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
      />

      {/* Kisan Credit & Trade History Score Modal */}
      <KisanCreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        user={currentUser || mockUser}
        creditProfile={mockCreditProfile}
        tradeLedger={mockTradeLedger}
        onOpenScan={() => {
          setIsCreditModalOpen(false);
          setCurrentView('analyzer');
        }}
      />


      {/* List Crop Modal */}
      <ListCropModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        user={currentUser || mockUser}
        initialAnalysis={modalInitialAnalysis}
        onAddListing={handleAddListing}
      />

      {/* Add User Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        user={currentUser || mockUser}
        onAddReview={handleAddReview}
      />

      {/* Community Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        reviews={reviews}
        onOpenAddReview={() => {
          setIsReviewsModalOpen(false);
          setIsAddReviewOpen(true);
        }}
        onHelpfulVote={handleHelpfulVote}
      />

      {/* Language Selector Modal */}
      <LanguageSelector />

      {/* Interactive In-App User Manual Modal */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onNavigateTab={(tab) => {
          setIsManualOpen(false);
          if (tab === 'analyzer' || tab === 'marketplace' || tab === 'dashboard') {
            setCurrentView(tab as any);
          } else if (tab === 'listing') {
            setIsListModalOpen(true);
          }
        }}
      />

      {/* Terms of Service & Privacy Policy Modal (Team Hexa Knights - SIH) */}
      <TermsPrivacyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
