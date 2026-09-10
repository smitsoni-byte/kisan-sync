import React, { useMemo } from 'react';
import { ViewMode, UserReview } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedReviews, getReviewUIStrings } from '../data/reviewTranslations';
import { 
  Scan, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  Star,
  Users,
  MessageSquareQuote,
  PlusCircle,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';

interface LandingPageProps {
  onNavigate: (view: ViewMode) => void;
  user?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onOpenListModal: () => void;
  onOpenManual?: () => void;
  reviews?: UserReview[];
  onOpenAddReview?: () => void;
  onOpenReviewsModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  user,
  onOpenAuth,
  onOpenListModal, 
  onOpenManual,
  reviews = [],
  onOpenAddReview,
  onOpenReviewsModal
}) => {
  const { currentLanguage, t } = useLanguage();

  const localizedReviews = useMemo(() => {
    return getLocalizedReviews(reviews, currentLanguage.code);
  }, [reviews, currentLanguage.code]);

  const reviewUI = useMemo(() => {
    return getReviewUIStrings(currentLanguage.code);
  }, [currentLanguage.code]);

  return (
    <div id="home-landing-container" className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff7a17]/30 selection:text-white font-sans-body overflow-x-hidden">
      
      {/* Hero Section */}
      <section id="home-hero-section" className="relative overflow-hidden pt-10 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 border-b border-[#212327]">
        
        {/* Soft Sunset Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[#ff7a17]/10 via-[#7c3aed]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="space-y-6 sm:space-y-8 min-w-0">
            
            {/* Top AI Badge */}
            <div id="home-hero-badge" className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#141517] border border-[#212327] text-white text-xs font-mono tracking-wider uppercase max-w-full">
              <Sparkles className="w-4 h-4 text-[#ff7a17] shrink-0" />
              <span className="truncate">{t('tagline')}</span>
              <span className="bg-[#ff7a17] text-black font-bold text-[10px] px-2 py-0.5 rounded-full uppercase shrink-0">
                LIVE
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 id="home-hero-heading" className="font-serif-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-white leading-tight sm:leading-[1.1] break-words">
                {t('heroTitle')}
              </h1>
            </div>

            {/* CTAs - Pill Buttons */}
            <div id="home-hero-cta-group" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-2">
              <button
                id="btn-hero-scan"
                onClick={() => onNavigate('analyzer')}
                className="w-full sm:w-auto min-h-[52px] flex items-center justify-center gap-2.5 bg-white hover:bg-[#fafaf7] active:bg-neutral-200 text-[#0a0a0a] font-bold text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-150 active:scale-[0.97] shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Scan className="w-5 h-5 text-[#0a0a0a] shrink-0" />
                <span className="whitespace-nowrap">{t('scanFieldNow')}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                id="btn-hero-market"
                onClick={() => onNavigate('marketplace')}
                className="w-full sm:w-auto min-h-[52px] flex items-center justify-center gap-2 bg-[#141517] hover:bg-[#212327] active:bg-[#2d3036] text-white border border-[#212327] hover:border-white/30 font-semibold text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full transition-all duration-150 active:scale-[0.97] shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-[#ff7a17] shrink-0" />
                <span className="whitespace-nowrap">{t('exploreMarket')}</span>
              </button>

              {!user && onOpenAuth && (
                <button
                  id="btn-hero-login"
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto min-h-[52px] flex items-center justify-center gap-2 bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full transition-all duration-150 active:scale-[0.97] shadow-lg cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-black shrink-0" />
                  <span className="whitespace-nowrap">{currentLanguage.code === 'gu' ? 'લૉગ ઇન કરો' : currentLanguage.code === 'hi' ? 'लॉग इन करें' : 'Sign In to App'}</span>
                </button>
              )}
            </div>

            {/* Hero Stats Pill */}
            <div id="home-hero-stats-bar" className="pt-8 sm:pt-10 grid grid-cols-3 gap-3 sm:gap-8 border-t border-[#212327] max-w-md sm:max-w-lg mx-auto">
              <div id="stat-ai-accuracy" className="text-center min-w-0">
                <p className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold">96%</p>
                <p className="text-[10px] sm:text-xs text-[#7d8187] font-mono tracking-wider uppercase mt-0.5 truncate">{t('aiAccuracy')}</p>
              </div>
              <div id="stat-middleman-fees" className="text-center min-w-0">
                <p className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-[#ff7a17] font-bold">₹0</p>
                <p className="text-[10px] sm:text-xs text-[#7d8187] font-mono tracking-wider uppercase mt-0.5 truncate">{t('middlemanFees')}</p>
              </div>
              <div id="stat-higher-bids" className="text-center min-w-0">
                <p className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold">+22%</p>
                <p className="text-[10px] sm:text-xs text-[#7d8187] font-mono tracking-wider uppercase mt-0.5 truncate">{t('higherBids')}</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials & Community Reviews Section */}
      <section id="home-testimonials-section" className="py-14 sm:py-20 lg:py-24 bg-[#0a0a0a] relative overflow-hidden border-b border-[#212327]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#ff7a17] bg-[#141517] border border-[#212327] px-4 py-1 rounded-full">
                <Users className="w-3.5 h-3.5" />
                <span>{t('voicesFromField')}</span>
              </div>
              <h2 id="home-testimonials-heading" className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-normal text-white break-words">
                {t('trustedByFarmers')}
              </h2>
              <p className="text-[#7d8187] text-sm leading-relaxed">
                {t('testimonialsDesc')}
              </p>
            </div>

            {/* Write a review and view all buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onOpenAddReview && (
                <button
                  id="btn-home-write-review"
                  onClick={onOpenAddReview}
                  className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 shadow-sm font-mono cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>{reviewUI.writeReviewBtn}</span>
                </button>
              )}

              {onOpenReviewsModal && (
                <button
                  id="btn-home-view-all-reviews"
                  onClick={onOpenReviewsModal}
                  className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] text-white font-semibold text-xs sm:text-sm transition-all duration-150 active:scale-95 font-mono cursor-pointer"
                >
                  <MessageSquareQuote className="w-4 h-4 text-[#ff7a17]" />
                  <span>{reviewUI.viewAllReviewsBtn(localizedReviews.length)}</span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div id="home-reviews-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {localizedReviews.slice(0, 3).map((rItem) => (
              <div
                key={rItem.id}
                id={`home-review-card-${rItem.id}`}
                className="bg-[#191919] rounded-2xl p-6 sm:p-7 border border-[#212327] flex flex-col justify-between space-y-4 shadow-xs hover:border-white/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex text-[#ff7a17] gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < rItem.rating 
                              ? 'fill-[#ff7a17] text-[#ff7a17]' 
                              : 'text-[#363a40]'
                          }`} 
                        />
                      ))}
                    </div>
                    {rItem.verifiedBadge && (
                      <span className="text-[10px] font-mono text-[#ff7a17] bg-[#141517] px-2.5 py-0.5 rounded-full border border-[#212327] truncate">
                        {rItem.verifiedBadge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-white font-serif-display text-lg font-bold leading-snug">
                      {rItem.title}
                    </h4>
                    <p className="text-[#dadbdf] text-sm leading-relaxed italic mt-1.5 font-sans">
                      "{rItem.comment}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#212327]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={rItem.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                      alt={rItem.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#ff7a17] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{rItem.name}</p>
                      <p className="text-xs text-[#7d8187] font-mono truncate">{rItem.role} • {rItem.location}</p>
                    </div>
                  </div>

                  {onOpenReviewsModal && (
                    <button
                      id={`btn-review-read-more-${rItem.id}`}
                      onClick={onOpenReviewsModal}
                      className="text-xs text-[#7d8187] hover:text-[#ff7a17] font-mono shrink-0 pl-2 cursor-pointer"
                      title="Read full review"
                    >
                      {reviewUI.readMoreBtn}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Bottom rating trust bar */}
          <div id="home-rating-trust-bar" className="mt-8 p-4 bg-[#141517] rounded-2xl border border-[#212327] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ff7a17]" />
              <span className="text-white font-bold">
                {reviewUI.verifiedTrustBar}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[#7d8187]">
                {reviewUI.overallRatingLabel} <strong className="text-[#ff7a17]">4.9 / 5.0 ★</strong> ({localizedReviews.length} {reviewUI.reviewsCountLabel})
              </span>
              {onOpenAddReview && (
                <button
                  id="btn-home-add-review-bottom"
                  onClick={onOpenAddReview}
                  className="text-[#ff7a17] hover:underline font-bold cursor-pointer"
                >
                  {reviewUI.addReviewBtn}
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA Band */}
      <section id="home-cta-section" className="py-12 sm:py-16 lg:py-20 bg-[#141517] text-white border-b border-[#212327]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">
          <h2 id="home-bottom-cta-heading" className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-normal text-white break-words">
            {t('readyToProtect')}
          </h2>
          <p id="home-bottom-cta-description" className="text-[#dadbdf] text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            {t('bottomCtaDesc')}
          </p>
          <div id="home-bottom-cta-buttons" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              id="btn-home-open-dashboard"
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto bg-white hover:bg-[#fafaf7] text-[#0a0a0a] font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-md transition-all cursor-pointer"
            >
              {t('openFarmerCenter')}
            </button>
            <button
              id="btn-home-list-crop"
              onClick={onOpenListModal}
              className="w-full sm:w-auto bg-[#0a0a0a] hover:bg-[#191919] text-white border border-white/20 font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all cursor-pointer"
            >
              {t('listProduceBidding')}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
