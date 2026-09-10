import React, { useState } from 'react';
import { UserReview, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Star, 
  CheckCircle2, 
  MessageSquareQuote, 
  User, 
  MapPin, 
  Sprout, 
  Sparkles, 
  ShieldCheck,
  Building2,
  Award
} from 'lucide-react';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onAddReview: (newReview: UserReview) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
];

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  user,
  onAddReview
}) => {
  const { currentLanguage } = useLanguage();
  const isGu = currentLanguage.code === 'gu';

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState<string>(user.name || 'Ramesh Patel');
  const [role, setRole] = useState<'Farmer' | 'Trader' | 'Buyer' | 'Agronomist'>(user.role || 'Farmer');
  const [location, setLocation] = useState<string>(user.location || 'Anand, Gujarat');
  const [cropOrTrade, setCropOrTrade] = useState<string>('Sharbati Wheat (Grade A+)');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar || PRESET_AVATARS[0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const RATING_LABELS: { [key: number]: { en: string; gu: string } } = {
    5: { en: '5.0 - Outstanding / Highly Recommended', gu: '૫.૦ - અતિ ઉત્તમ / ખૂબ જ સંતોષકારક' },
    4: { en: '4.0 - Very Good Experience', gu: '૪.૦ - ખૂબ સારો અનુભવ' },
    3: { en: '3.0 - Good & Functional', gu: '૩.૦ - સારો અને ઉપયોગી' },
    2: { en: '2.0 - Fair / Needs Minor Improvement', gu: '૨.૦ - સાધારણ / સુધારાની જરૂર' },
    1: { en: '1.0 - Needs Significant Improvement', gu: '૧.૦ - સુધારો જરૂરી' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError(isGu ? 'કૃપા કરીને રિવ્યુનું શીર્ષક લખો.' : 'Please enter a review headline / title.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 15) {
      setError(
        isGu 
          ? 'કૃપા કરીને તમારો વિગતવાર અનુભવ (ઓછામાં ઓછા ૧૫ અક્ષરો) લખો.' 
          : 'Please enter detailed feedback (at least 15 characters).'
      );
      return;
    }

    let badge = 'Verified Community Review';
    if (role === 'Farmer') badge = isGu ? 'પ્રમાણિત ખેડૂત' : 'Verified Farmer';
    else if (role === 'Trader') badge = isGu ? 'પ્રમાણિત વેપારી' : 'Verified Trader';
    else if (role === 'Buyer') badge = isGu ? 'પ્રમાણિત ખરીદનાર' : 'Verified Buyer';
    else if (role === 'Agronomist') badge = isGu ? 'પ્રમાણિત કૃષિ નિષ્ણાત' : 'Certified Agronomist';

    const newReview: UserReview = {
      id: 'rev-' + Date.now(),
      name: name.trim() || (isGu ? 'અનામી ખેડૂત' : 'Verified User'),
      role: role,
      location: location.trim() || 'India',
      rating: rating,
      title: title.trim(),
      comment: comment.trim(),
      cropOrTrade: cropOrTrade.trim() || 'General Platform',
      verifiedBadge: badge,
      helpfulCount: 1,
      date: new Date().toISOString().split('T')[0],
      avatar: selectedAvatar
    };

    onAddReview(newReview);
    onClose();
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans-body"
    >
      <div className="bg-[#191919] border border-[#212327] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212327]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff7a17] text-black flex items-center justify-center font-bold shrink-0">
              <MessageSquareQuote className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl text-white">
                {isGu ? 'તમારો રિવ્યુ લખો (Write a Review)' : 'Share Your Experience & Review'}
              </h2>
              <p className="text-xs text-[#7d8187] font-mono">
                {isGu ? 'ખેડૂતો, વેપારીઓ અને નિષ્ણાતો સાથે તમારો અનુભવ શેર કરો' : 'Help other farmers & buyers with your verified feedback'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-full text-white hover:bg-[#212327] active:bg-[#2d3036] bg-[#141517] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          
          {/* Star Rating Selector */}
          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 sm:p-5 space-y-2 text-center">
            <label className="block text-white font-bold text-sm">
              {isGu ? 'તમારો રેટિંગ પસંદ કરો (Select Star Rating)' : 'Overall Satisfaction Rating'}
            </label>
            
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= displayRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                    aria-label={`${star} star rating`}
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        isFilled 
                          ? 'fill-[#ff7a17] text-[#ff7a17] drop-shadow-[0_0_8px_rgba(255,122,23,0.5)]' 
                          : 'text-[#363a40] hover:text-[#ff7a17]/50'
                      } transition-colors`} 
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-mono text-[#ff7a17] font-semibold h-4">
              {isGu ? RATING_LABELS[displayRating].gu : RATING_LABELS[displayRating].en}
            </p>
          </div>

          {/* User Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'તમારું નામ (Full Name)' : 'Your Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patel, Gurpreet Singh"
                className="w-full min-h-[46px] bg-[#141517] border border-[#212327] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'ગામ / શહેર, રાજ્ય (Location)' : 'Location / District, State'}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Anand, Gujarat"
                className="w-full min-h-[46px] bg-[#141517] border border-[#212327] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>
          </div>

          {/* Role & Crop Traded */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'તમારી ભૂમિકા (Your Role)' : 'Your Primary Role'}
              </label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full min-h-[46px] bg-[#141517] border border-[#212327] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all cursor-pointer"
              >
                <option value="Farmer">{isGu ? '🌱 ખેડૂત (Farmer / Producer)' : '🌱 Farmer / Producer'}</option>
                <option value="Trader">{isGu ? '🌾 અનાજ વેપારી (Grain Trader)' : '🌾 Grain Trader / Wholesaler'}</option>
                <option value="Buyer">{isGu ? '🏢 મિલ ખરીદનાર (Mill Buyer)' : '🏢 Mill / Institutional Buyer'}</option>
                <option value="Agronomist">{isGu ? '🔬 કૃષિ વૈજ્ઞાનિક (Agronomist)' : '🔬 Agronomist / Expert'}</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'પાક / વિષય (Crop or Trade Category)' : 'Crop / Trade Experience'}
              </label>
              <input
                type="text"
                value={cropOrTrade}
                onChange={(e) => setCropOrTrade(e.target.value)}
                placeholder="e.g. Sharbati Wheat, Tomatoes, Live Bidding"
                className="w-full min-h-[46px] bg-[#141517] border border-[#212327] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-white font-bold mb-1.5">
              {isGu ? 'રિવ્યુ શીર્ષક (Review Headline)' : 'Review Headline / Summary'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isGu ? 'દા.ત. AI નિદાન ખૂબ સચોટ છે અને હરાજીમાં સારો ભાવ મળ્યો!' : 'e.g. Fast bidding settlements & saved my crop with AI diagnosis!'}
              className="w-full min-h-[46px] bg-[#141517] border border-[#212327] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
            />
          </div>

          {/* Detailed Comment */}
          <div>
            <label className="block text-white font-bold mb-1.5">
              {isGu ? 'વિગતવાર રિવ્યુ / અનુભવ (Detailed Review & Feedback)' : 'Detailed Experience & Feedback'}
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isGu 
                ? 'કિસાનસિંક વાપરવાનો તમારો વાસ્તવિક અનુભવ અહીં લખો. જેમ કે પાક સ્કેનિંગ, ઉપચાર, બોલી અથવા પેમેન્ટ...' 
                : 'Describe your honest experience with AI pathology diagnosis, bidding auctions, pricing, or payment transparency...'}
              className="w-full bg-[#141517] border border-[#212327] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
            />
            <span className="text-[10px] text-[#7d8187] pl-1">Min 15 characters</span>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-white font-bold mb-2">
              {isGu ? 'પ્રોફાઇલ અવતાર પસંદ કરો:' : 'Choose Profile Avatar:'}
            </label>
            <div className="flex items-center gap-3">
              {PRESET_AVATARS.map((avatarUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatarUrl)}
                  className={`relative w-11 h-11 rounded-full overflow-hidden transition-all duration-150 ${
                    selectedAvatar === avatarUrl 
                      ? 'ring-3 ring-[#ff7a17] scale-110 shadow-lg' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-300 rounded-xl text-xs font-mono">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#212327] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-6 py-2.5 rounded-full text-white hover:bg-[#212327] active:bg-[#2d3036] bg-[#141517] border border-[#212327] active:scale-[0.97] transition-all duration-150"
            >
              {isGu ? 'રદ કરો' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-8 py-2.5 rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold active:scale-[0.97] shadow-sm transition-all duration-150"
            >
              {isGu ? 'રિવ્યુ સબમિટ કરો' : 'Submit Review'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
