import React, { useState, useEffect, useRef } from 'react';
import { CropListing, CropAnalysisResult, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { optimizeImageForAnalysis } from '../utils/imageOptimizer';
import { 
  X, 
  Upload, 
  Award, 
  CheckCircle2, 
  Sprout, 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  Sparkles,
  Info
} from 'lucide-react';

interface ListCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  initialAnalysis?: CropAnalysisResult | null;
  onAddListing: (newListing: CropListing) => void;
}

// Preset verified crop photo library for quick selection
const PRESET_CROP_IMAGES = [
  { name: 'Wheat (ઘઉં)', category: 'Grains', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cotton (કપાસ)', category: 'Commercial', url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tomatoes (ટામેટા)', category: 'Vegetables', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { name: 'Basmati Rice (ડાંગર)', category: 'Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Groundnut (મગફળી)', category: 'Pulses', url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Red Chilli (લાલ મરચાં)', category: 'Commercial', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80' },
];

export const ListCropModal: React.FC<ListCropModalProps> = ({
  isOpen,
  onClose,
  user,
  initialAnalysis,
  onAddListing
}) => {
  const { currentLanguage, t } = useLanguage();
  const isGu = currentLanguage.code === 'gu';

  const [cropName, setCropName] = useState(initialAnalysis ? initialAnalysis.cropType : 'Golden Sharbati Wheat');
  const [variety, setVariety] = useState('Organic Grade A');
  const [category, setCategory] = useState<'Grains' | 'Vegetables' | 'Fruits' | 'Pulses' | 'Commercial'>('Grains');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(50);
  const [startingPrice, setStartingPrice] = useState<number>(2800);
  const [moisturePercentage, setMoisturePercentage] = useState<number>(11.5);
  const [organicCertified, setOrganicCertified] = useState<boolean>(true);
  const [description, setDescription] = useState(
    initialAnalysis 
      ? `AI Scanned ${initialAnalysis.cropType} lot. Score: ${initialAnalysis.aiQualityScore}/100. ${initialAnalysis.summaryAdvice}`
      : 'Freshly harvested produce lot verified by KisanSync AI.'
  );

  // Crop image state (Farmer custom upload or AI analysis image)
  const [imageUrl, setImageUrl] = useState<string>(
    initialAnalysis?.imageUrl || PRESET_CROP_IMAGES[0].url
  );
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isCustomImageUploaded, setIsCustomImageUploaded] = useState<boolean>(!!initialAnalysis?.imageUrl);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialAnalysis) {
      setCropName(initialAnalysis.cropType || 'Fresh Produce Lot');
      setVariety(initialAnalysis.subjectIdentification ? initialAnalysis.subjectIdentification.split('-')[0].trim() : 'Certified Grade');
      setDescription(`AI Scanned ${initialAnalysis.cropType} lot. Score: ${initialAnalysis.aiQualityScore}/100. ${initialAnalysis.summaryAdvice}`);
      if (initialAnalysis.imageUrl) {
        setImageUrl(initialAnalysis.imageUrl);
        setIsCustomImageUploaded(true);
        setImageFileName('AI_Diagnostic_Scan.jpg');
      }
      const lower = (initialAnalysis.cropType || '').toLowerCase();
      if (lower.includes('tomato') || lower.includes('potato') || lower.includes('onion') || lower.includes('chili') || lower.includes('ટામેટા') || lower.includes('બટાટા') || lower.includes('ડુંગળી') || lower.includes('મરચાં')) {
        setCategory('Vegetables');
      } else if (lower.includes('wheat') || lower.includes('rice') || lower.includes('ઘઉં') || lower.includes('ડાંગર')) {
        setCategory('Grains');
      } else if (lower.includes('cotton') || lower.includes('cumin') || lower.includes('mustard') || lower.includes('કપાસ') || lower.includes('જીરું') || lower.includes('રાયડો')) {
        setCategory('Commercial');
      } else if (lower.includes('groundnut') || lower.includes('મગફળી')) {
        setCategory('Pulses');
      }
    }
  }, [initialAnalysis, isOpen]);

  if (!isOpen) return null;

  const aiQualityScore = initialAnalysis ? initialAnalysis.aiQualityScore : 92;
  const qualityGrade = initialAnalysis ? initialAnalysis.qualityGrade : 'A+';

  // Process File to Base64 Data URL with fast client-side optimizer
  const processImageFile = async (file: File) => {
    setImageUploadError(null);
    if (!file.type.startsWith('image/')) {
      setImageUploadError(isGu ? 'કૃપા કરીને માત્ર ફોટો ફાઈલ (JPG, PNG) પસંદ કરો.' : 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      const optimized = await optimizeImageForAnalysis(file, 1280, 0.88);
      setImageUrl(optimized.base64);
      setImageFileName(file.name);
      setIsCustomImageUploaded(true);
    } catch (e) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setImageFileName(file.name);
          setIsCustomImageUploaded(true);
        }
      };
      reader.onerror = () => {
        setImageUploadError(isGu ? 'ફોટો અપલોડ કરવામાં ભૂલ થઈ. ફરી પ્રયાસ કરો.' : 'Failed to read image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(PRESET_CROP_IMAGES[0].url);
    setImageFileName(null);
    setIsCustomImageUploaded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: CropListing = {
      id: 'crop-' + Date.now(),
      farmerName: user.name,
      farmerLocation: user.location,
      farmerRating: user.rating,
      farmerAvatar: user.avatar,
      cropName: cropName.trim(),
      variety: variety.trim(),
      category: category,
      quantityQuintals: Number(quantityQuintals),
      aiQualityScore: aiQualityScore,
      qualityGrade: qualityGrade,
      startingPricePerQuintal: Number(startingPrice),
      currentHighestBid: Number(startingPrice),
      bidCount: 0,
      bidsHistory: [],
      endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 24h auction window
      imageUrl: imageUrl,
      harvestDate: new Date().toISOString().split('T')[0],
      organicCertified: organicCertified,
      moisturePercentage: Number(moisturePercentage),
      description: description.trim()
    };

    onAddListing(newListing);
    onClose();
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans-body"
    >
      <div className="bg-[#191919] border border-[#212327] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212327]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff7a17] text-black flex items-center justify-center font-bold shrink-0">
              <Sprout className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl text-white">
                {isGu ? 'નવો પાક લિસ્ટ કરો (List Fresh Harvest)' : t('listCropModalTitle')}
              </h2>
              <p className="text-xs text-[#7d8187] font-mono">
                {isGu ? 'તમારા પાકનો ફોટો અપલોડ કરો અને ડાયરેક્ટ હરાજી શરૂ કરો' : 'Upload custom harvest photos & launch direct bidding'}
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

        {/* AI Verification Badge Header if attached */}
        {initialAnalysis && (
          <div className="p-4 bg-[#141517] border border-[#ff7a17]/40 rounded-2xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#ff7a17] shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">
                  {isGu ? 'AI નિદાન પ્રમાણપત્ર જોડાયેલ છે' : 'Attached AI Diagnostic Verification'}
                </p>
                <p className="text-[#7d8187]">
                  Grade {initialAnalysis.qualityGrade} ({initialAnalysis.aiQualityScore}/100 Score)
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-[#ff7a17] text-black font-bold px-2.5 py-1 rounded-full uppercase">
              AI VERIFIED
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          
          {/* ═══════════════════════════════════════════════════════════════════
              FARMER CROP IMAGE UPLOAD SECTION (Camera & File Upload)
              ═══════════════════════════════════════════════════════════════════ */}
          <div className="bg-[#141517] border border-[#212327] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#ff7a17]" />
                <label className="text-white font-bold text-sm">
                  {isGu ? 'પાકનો વાસ્તવિક ફોટો અપલોડ કરો (Farmer Crop Photo)' : 'Upload Crop Photo / Harvest Image'}
                </label>
              </div>
              <span className="text-[11px] text-[#7d8187]">
                {isGu ? 'ખેડૂત પોતાનો ફોટો મૂકી શકે છે' : 'Supports JPG, PNG, WebP'}
              </span>
            </div>

            {/* Hidden Input elements */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Upload Box / Image Preview */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 transition-all duration-150 ${
                isDraggingOver
                  ? 'border-[#ff7a17] bg-[#ff7a17]/10'
                  : 'border-[#282b30] bg-[#191919] hover:border-white/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Image Thumbnail Preview */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#212327] shrink-0 shadow-inner group">
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_CROP_IMAGES[0].url;
                    }}
                  />
                  {isCustomImageUploaded && (
                    <span className="absolute bottom-1 left-1 right-1 bg-emerald-500/90 text-black text-[9px] font-bold text-center py-0.5 rounded-sm uppercase">
                      {isGu ? 'ખેડૂત ફોટો' : 'Uploaded'}
                    </span>
                  )}
                </div>

                {/* Upload & Action Controls */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
                  <div>
                    <p className="text-white font-bold text-sm">
                      {isCustomImageUploaded
                        ? (imageFileName || (isGu ? 'કસ્ટમ ફોટો અપલોડ થયેલ છે' : 'Custom crop photo selected'))
                        : (isGu ? 'તમારા ખેતરના તાજા પાકનો ફોટો જોડો' : 'Add photo of your harvested produce')}
                    </p>
                    <p className="text-[11px] text-[#7d8187] mt-0.5">
                      {isGu 
                        ? 'સ્પષ્ટ ફોટો અપલોડ કરવાથી વેપારીઓ ઝડપથી અને ઊંચી બોલી લગાવે છે.' 
                        : 'Clear harvest photos receive up to 25% higher bids from verified buyers.'}
                    </p>
                  </div>

                  {/* Upload Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold text-xs transition-all active:scale-95 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-black" />
                      <span>{isGu ? 'ગેલેરીમાંથી ફોટો પસંદ કરો' : 'Upload From Gallery'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-full bg-[#141517] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] text-white text-xs font-semibold transition-all active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#ff7a17]" />
                      <span>{isGu ? 'કેમેરાથી ફોટો પાડો' : 'Take Photo (Camera)'}</span>
                    </button>

                    {isCustomImageUploaded && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-full bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs transition-all active:scale-95"
                        title="Remove uploaded image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isGu ? 'દૂર કરો' : 'Reset'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Sample Presets */}
              <div className="mt-3 pt-3 border-t border-[#212327]">
                <p className="text-[10px] text-[#7d8187] uppercase font-bold mb-1.5">
                  {isGu ? 'અથવા પ્રમાણિત નમૂના ફોટો પસંદ કરો:' : 'Or Select From Verified Preset Crops:'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CROP_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setImageFileName(preset.name);
                        setIsCustomImageUploaded(false);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                        imageUrl === preset.url
                          ? 'bg-[#ff7a17]/20 border border-[#ff7a17] text-[#ff7a17] font-bold'
                          : 'bg-[#141517] hover:bg-[#212327] border border-[#212327] text-[#dadbdf]'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {imageUploadError && (
              <p className="text-xs text-rose-400 font-mono bg-rose-950/30 p-2 rounded-xl border border-rose-500/30">
                {imageUploadError}
              </p>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              CROP DETAILS & SPECIFICATIONS
              ═══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'પાકનું નામ (Crop Title)' : 'Crop Title / Name'}
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Sharbati Wheat, Shankar Cotton"
                className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'જાત / વેરાયટી (Crop Variety)' : 'Crop Variety'}
              </label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Lokwan, Hybrid-6, Desi Organic"
                className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'કેટેગરી (Category)' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all cursor-pointer"
              >
                <option value="Grains">{isGu ? 'ધાન્ય (Grains)' : 'Grains'}</option>
                <option value="Vegetables">{isGu ? 'શાકભાજી (Vegetables)' : 'Vegetables'}</option>
                <option value="Fruits">{isGu ? 'ફળફળાદી (Fruits)' : 'Fruits'}</option>
                <option value="Pulses">{isGu ? 'કઠોળ (Pulses)' : 'Pulses'}</option>
                <option value="Commercial">{isGu ? 'રોકડિયા (Commercial)' : 'Commercial'}</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'જથ્થો (Quintals)' : 'Quantity (Quintals)'}
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
                className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
              <span className="text-[10px] text-[#7d8187] pl-2">1 Qtl = 100 kg</span>
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'શરૂઆતની લઘુત્તમ બોલી (₹/Qtl)' : 'Reserve Price (₹/Qtl)'}
              </label>
              <input
                type="number"
                min={100}
                required
                value={startingPrice}
                onChange={(e) => setStartingPrice(Math.max(100, Number(e.target.value)))}
                className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-1.5">
                {isGu ? 'ભેજનું પ્રમાણ (Moisture %)' : 'Moisture Level (%)'}
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={100}
                required
                value={moisturePercentage}
                onChange={(e) => setMoisturePercentage(Number(e.target.value))}
                className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
              />
            </div>

            <div className="flex items-center min-h-[48px] sm:pt-4">
              <label className="flex items-center gap-3 cursor-pointer text-white font-bold py-2 select-none">
                <input
                  type="checkbox"
                  checked={organicCertified}
                  onChange={(e) => setOrganicCertified(e.target.checked)}
                  className="w-5 h-5 accent-[#ff7a17] rounded cursor-pointer"
                />
                <span>{isGu ? '૧૦૦% પ્રાકૃતિક / ઓર્ગેનિક પાક' : 'Organic Certified Harvest'}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-1.5">
              {isGu ? 'પાકની વિશેષતા અને વિગત (Lot Description)' : 'Lot Description & Notes'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isGu ? 'દા.ત. સૂર્યપ્રકાશમાં સૂકવેલો ચોખ્ખો માલ, ઉચ્ચ તેલ ટકાવારી...' : 'e.g. Clean sun-dried produce, uniform color, ready for immediate dispatch.'}
              className="w-full bg-[#141517] border border-[#212327] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff7a17] transition-all"
            />
          </div>

          <div className="pt-4 border-t border-[#212327] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-6 py-3 rounded-full text-white hover:bg-[#212327] active:bg-[#2d3036] bg-[#141517] border border-[#212327] active:scale-[0.97] transition-all duration-150"
            >
              {isGu ? 'રદ કરો' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="min-h-[48px] px-8 py-3 rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-bold active:scale-[0.97] shadow-sm transition-all duration-150"
            >
              {isGu ? 'લાઈવ માર્કેટમાં લિસ્ટ કરો (Publish Lot)' : 'Publish Listing Lot'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
