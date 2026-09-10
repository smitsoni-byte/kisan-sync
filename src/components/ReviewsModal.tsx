import React, { useState, useMemo } from 'react';
import { UserReview, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { getLocalizedReviews, getReviewUIStrings } from '../data/reviewTranslations';
import { 
  X, 
  Star, 
  ThumbsUp, 
  MessageSquareQuote, 
  Search, 
  Filter, 
  PlusCircle, 
  Award, 
  CheckCircle2, 
  Users, 
  Sprout, 
  TrendingUp, 
  MapPin,
  Sparkles,
  Calendar
} from 'lucide-react';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: UserReview[];
  onOpenAddReview: () => void;
  onHelpfulVote: (reviewId: string) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  onOpenAddReview,
  onHelpfulVote
}) => {
  const { currentLanguage } = useLanguage();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [votedMap, setVotedMap] = useState<{ [key: string]: boolean }>({});

  const localizedReviews = useMemo(() => {
    return getLocalizedReviews(reviews, currentLanguage.code);
  }, [reviews, currentLanguage.code]);

  const reviewUI = useMemo(() => {
    return getReviewUIStrings(currentLanguage.code);
  }, [currentLanguage.code]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = localizedReviews.length;
    if (total === 0) return { avg: 5.0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    
    const sum = localizedReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    localizedReviews.forEach((r) => {
      if (r.rating in counts) {
        counts[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    return { avg, total, counts };
  }, [localizedReviews]);

  const filteredReviews = useMemo(() => {
    return localizedReviews.filter((r) => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.cropOrTrade && r.cropOrTrade.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = selectedRole === 'All' || r.role === selectedRole;
      const matchesRating = r.rating >= minRating;

      return matchesSearch && matchesRole && matchesRating;
    });
  }, [localizedReviews, searchTerm, selectedRole, minRating]);

  if (!isOpen) return null;

  const handleVote = (reviewId: string) => {
    if (votedMap[reviewId]) {
      toast.info('Already voted', 'You have already marked this review as helpful.');
      return;
    }

    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
    onHelpfulVote(reviewId);
    toast.success(
      reviewUI.voteThankYou,
      reviewUI.voteMarked
    );
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans-body"
    >
      <div className="bg-[#141517] border border-[#212327] rounded-3xl max-w-3xl w-full p-5 sm:p-7 space-y-6 shadow-2xl my-auto text-white max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212327] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff7a17] text-black flex items-center justify-center font-bold shrink-0">
              <MessageSquareQuote className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-xl sm:text-2xl text-white">
                  {reviewUI.modalTitle}
                </h2>
                <span className="text-[10px] font-mono bg-[#191919] text-[#ff7a17] border border-[#ff7a17]/30 px-2 py-0.5 rounded-full uppercase">
                  {reviewUI.modalReviewsBadge(localizedReviews.length)}
                </span>
              </div>
              <p className="text-xs text-[#7d8187] font-mono hidden sm:block">
                {reviewUI.modalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddReview}
              className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-xs font-mono transition-all active:scale-95 shadow-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span className="whitespace-nowrap">{reviewUI.addReviewBtn}</span>
            </button>

            <button 
              onClick={onClose} 
              className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-full text-white hover:bg-[#212327] active:bg-[#2d3036] bg-[#191919] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Aggregate Stats Card */}
        <div className="bg-[#191919] border border-[#212327] rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center shrink-0">
          
          <div className="text-center sm:text-left sm:border-r border-[#212327] pr-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-serif-display text-4xl sm:text-5xl text-white font-bold">{stats.avg}</span>
              <div className="space-y-0.5">
                <div className="flex text-[#ff7a17]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ff7a17] text-[#ff7a17]" />
                  ))}
                </div>
                <p className="text-[10px] font-mono text-[#7d8187] uppercase">
                  {stats.total} {reviewUI.verifiedRatings}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="sm:col-span-2 space-y-1.5 font-mono text-xs">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = stats.counts[starNum as 1 | 2 | 3 | 4 | 5];
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={starNum} className="flex items-center gap-2 text-[#7d8187]">
                  <span className="w-6 text-[11px] text-right font-bold text-white">{starNum}★</span>
                  <div className="flex-1 h-2 bg-[#141517] rounded-full overflow-hidden border border-[#212327]">
                    <div 
                      className="h-full bg-[#ff7a17] rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="w-10 text-[10px] text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Toolbar (Search & Filter) */}
        <div className="space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7d8187] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={reviewUI.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[42px] bg-[#191919] border border-[#212327] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#7d8187] focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-[#191919] border border-[#212327] rounded-full px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff7a17] min-h-[42px] cursor-pointer"
              >
                <option value="All">{reviewUI.allRoles}</option>
                <option value="Farmer">{reviewUI.farmerRole}</option>
                <option value="Trader">{reviewUI.traderRole}</option>
                <option value="Buyer">{reviewUI.buyerRole}</option>
                <option value="Agronomist">{reviewUI.agronomistRole}</option>
              </select>

              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-[#191919] border border-[#212327] rounded-full px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff7a17] min-h-[42px] cursor-pointer"
              >
                <option value={0}>{reviewUI.allStars}</option>
                <option value={5}>5 ★ Only</option>
                <option value={4}>4 ★ & above</option>
                <option value={3}>3 ★ & above</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List (Scrollable) */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {filteredReviews.length === 0 ? (
            <div className="bg-[#191919] border border-[#212327] rounded-2xl p-10 text-center space-y-3 my-4">
              <MessageSquareQuote className="w-10 h-10 text-[#7d8187] mx-auto" />
              <p className="text-white font-serif-display text-lg">
                {reviewUI.noReviewsFound}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('All');
                  setMinRating(0);
                }}
                className="text-xs text-[#ff7a17] font-mono underline"
              >
                {reviewUI.resetFilters}
              </button>
            </div>
          ) : (
            filteredReviews.map((r) => {
              const isVoted = !!votedMap[r.id];
              return (
                <div
                  key={r.id}
                  className="bg-[#191919] border border-[#212327] rounded-2xl p-5 space-y-3.5 hover:border-white/20 transition-all shadow-xs"
                >
                  
                  {/* Top line: Stars + Date + Verified Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#ff7a17]">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < r.rating 
                                ? 'fill-[#ff7a17] text-[#ff7a17]' 
                                : 'text-[#363a40]'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{r.rating}.0</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#7d8187]">
                      {r.verifiedBadge && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#ff7a17] bg-[#141517] px-2.5 py-0.5 rounded-full border border-[#ff7a17]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#ff7a17]" />
                          <span>{r.verifiedBadge}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7d8187]" />
                        {r.date}
                      </span>
                    </div>
                  </div>

                  {/* Headline & Body */}
                  <div>
                    <h4 className="font-serif-display text-lg text-white font-bold leading-snug">
                      {r.title}
                    </h4>
                    <p className="text-sm text-[#dadbdf] leading-relaxed mt-1 font-sans">
                      "{r.comment}"
                    </p>
                  </div>

                  {/* Footer: User profile & Helpful Button */}
                  <div className="pt-3 border-t border-[#212327] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={r.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                        alt={r.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#ff7a17]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      <div>
                        <p className="font-bold text-white">{r.name}</p>
                        <p className="text-[11px] text-[#7d8187] font-mono">
                          {r.role} • {r.location} {r.cropOrTrade ? `• (${r.cropOrTrade})` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(r.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all active:scale-95 ${
                        isVoted
                          ? 'bg-[#ff7a17]/20 text-[#ff7a17] border border-[#ff7a17]'
                          : 'bg-[#141517] hover:bg-[#212327] border border-[#212327] text-[#dadbdf] hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'text-[#ff7a17]' : 'text-[#7d8187]'}`} />
                      <span>{reviewUI.helpfulBtn}</span>
                      <span className="font-bold">({r.helpfulCount + (isVoted ? 1 : 0)})</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="p-3 bg-[#0a0a0a] rounded-2xl border border-[#212327] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shrink-0">
          <span className="text-[#7d8187]">
            {reviewUI.escrowTrustNote}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenAddReview}
              className="flex-1 sm:flex-initial px-5 py-2 min-h-[40px] rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold transition-all duration-150 active:scale-95"
            >
              {reviewUI.addReviewBtn}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 min-h-[40px] rounded-full bg-[#191919] hover:bg-[#212327] active:bg-[#2d3036] text-white border border-[#212327] transition-all duration-150 active:scale-95"
            >
              {reviewUI.closeBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

