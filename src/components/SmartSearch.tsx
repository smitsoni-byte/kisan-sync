import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SmartSearchAnswer, ViewMode } from '../types';
import { generateLocalAgriculturalAnswer } from '../utils/agriculturalSearchEngine';
import { 
  Search, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  ShieldCheck,
  TrendingUp,
  Droplets,
  Landmark,
  Bug,
  Sprout,
  Scan,
  ShoppingBag
} from 'lucide-react';

interface SmartSearchProps {
  onNavigate?: (view: ViewMode) => void;
  variant?: 'hero' | 'dashboard' | 'standalone';
  className?: string;
  initialQuery?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  onNavigate,
  variant = 'hero',
  className = '',
  initialQuery = ''
}) => {
  const { currentLanguage, t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<SmartSearchAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Text to Speech (TTS) state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Rotating placeholder questions tailored to language
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholderQuestions = {
    gu: [
      'મારા કપાસના પાકમાં પાન પીળા થઈ રહ્યા છે, શું કરું?',
      'ઘઉંમાં વધુ ઉત્પાદન માટે કયું ખાતર નાખવું?',
      'કિસાન સન્માન નિધિ યોજના વિશે માહિતી આપો...',
      'આજના કપાસ અને જીરુંના બજાર ભાવ શું છે?',
      'ટામેટામાં પાન કોકડાઈ જવાની દવા કઈ છે?',
      'ડ્રીપ ઈરીગેશન (ટપક પિયત) માટે સબસિડી કેવી રીતે મેળવવી?'
    ],
    hi: [
      'कपास के पत्ते पीले हो रहे हैं, क्या उपाय करें?',
      'गेहूं में ज्यादा कल्ले और पैदावार के लिए कौन सा खाद डालें?',
      'पीएम किसान सम्मान निधि का लाभ कैसे मिलेगा?',
      'आज का कपास और जीरा मंडी भाव क्या है?',
      'टमाटर में पत्ती मरोड़ रोग की दवा क्या है?',
      'ड्रिप सिंचाई पर सरकारी सब्सिडी कैसे प्राप्त करें?'
    ],
    en: [
      'My cotton leaves are turning yellow, what should I do?',
      'What fertilizer should I use for higher wheat yield?',
      'Which government schemes are available for farmers?',
      'What is today\'s cotton and cumin mandi price?',
      'How to control leaf curl disease in tomato?',
      'How can I get government subsidy for drip irrigation?'
    ]
  };

  const currentPlaceholders = 
    currentLanguage.code === 'gu' ? placeholderQuestions.gu :
    currentLanguage.code === 'hi' ? placeholderQuestions.hi :
    placeholderQuestions.en;

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % currentPlaceholders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentPlaceholders.length]);

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
      if (!('speechSynthesis' in window)) {
        setTtsSupported(false);
      }
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  // Map app language code to BCP 47 speech recognition code
  const getSpeechLangCode = (langCode: string): string => {
    switch (langCode) {
      case 'gu': return 'gu-IN';
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'pa': return 'pa-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'bn': return 'bn-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'or': return 'or-IN';
      case 'ur': return 'ur-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  };

  // Start / Stop Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(
        currentLanguage.code === 'gu'
          ? 'આ બ્રાઉઝરમાં વોઇસ સર્ચ સપોર્ટ નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.'
          : currentLanguage.code === 'hi'
          ? 'इस ब्राउज़र में वॉइस सर्च समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।'
          : 'Voice search is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechLangCode(currentLanguage.code);

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errType = event?.error || '';

        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          setError(
            currentLanguage.code === 'gu'
              ? 'માઇક્રોફોન પરવાનગી મળી નથી. કૃપા કરીને બ્રાઉઝર સેટિંગ્સમાં માઇક્રોફોનની મંજૂરી આપો અથવા ટાઇપ કરીને પ્રશ્ન પૂછો.'
              : currentLanguage.code === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग में माइक्रोफ़ोन की अनुमति दें या लिखकर खोजें।'
              : currentLanguage.code === 'mr'
              ? 'मायक्रोफोन परवानगी मिळाली नाही. कृपया ब्राउझर सेटिंग्जमध्ये मायक्रोफोन सुरू करा किंवा टाईप करा.'
              : currentLanguage.code === 'pa'
              ? 'ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਚਾਲੂ ਕਰੋ ਜਾਂ ਟਾਈਪ ਕਰੋ।'
              : 'Microphone access was not allowed. Please enable microphone permission in your browser or type your inquiry.'
          );
        } else if (errType === 'no-speech') {
          // User did not speak; reset gracefully without blocking error
          setError(null);
        } else if (errType === 'network') {
          setError(
            currentLanguage.code === 'gu'
              ? 'નેટવર્ક સમસ્યા: વોઇસ સર્ચ માટે કૃપા કરીને ઇન્ટરનેટ કનેક્શન તપાસો.'
              : currentLanguage.code === 'hi'
              ? 'नेटवर्क समस्या: वॉइस सर्च के लिए कृपया इंटरनेट कनेक्शन जांचें।'
              : 'Voice recognition network error. Please verify your internet connection.'
          );
        } else if (errType !== 'aborted') {
          setError(
            currentLanguage.code === 'gu'
              ? 'વોઇસ ઇનપુટમાં સમસ્યા આવી છે. કૃપા કરીને ફરીથી પ્રયાસ કરો અથવા ટાઇપ કરો.'
              : currentLanguage.code === 'hi'
              ? 'वॉइस इनपुट में समस्या आई। कृपया पुनः प्रयास करें या लिखकर खोजें।'
              : 'Voice input encountered an issue. Please try again or type your question.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setError(
        currentLanguage.code === 'gu'
          ? 'વોઇસ સર્ચ શરૂ થઈ શક્યું નથી. કૃપા કરીને ટાઇપ કરીને શોધો.'
          : currentLanguage.code === 'hi'
          ? 'वॉइस सर्च शुरू नहीं हो सका। कृपया लिखकर खोजें।'
          : 'Unable to initialize voice search. Please type your search query.'
      );
    }
  };

  // Perform AI Search query
  const executeSearch = async (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q || !q.trim()) return;

    const trimmedQuery = q.trim();

    // Stop ongoing speech recognition if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Stop ongoing audio synthesis
    stopAudio();

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch('/api/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmedQuery,
          language: currentLanguage.name,
          languageCode: currentLanguage.code,
          nativeLanguageName: currentLanguage.nativeName
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.result) {
          setAnswer(data.result);
          return;
        }
      }

      // If response not ok or data invalid, fallback to expert local engine
      const localResult = generateLocalAgriculturalAnswer(trimmedQuery, currentLanguage);
      setAnswer(localResult);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Network / API search offline, loading expert local knowledge answer:', err?.message || err);
      // Graceful instant fallback to pre-baked expert agricultural knowledge engine
      const fallbackResult = generateLocalAgriculturalAnswer(trimmedQuery, currentLanguage);
      setAnswer(fallbackResult);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  // Text to Speech playback
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (!answer || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterances

      // Build clean spoken text
      const spokenText = `${answer.headline}. ${answer.simpleAnswer}. ${
        answer.recommendations?.length ? 'મુખ્ય ઉપાય: ' + answer.recommendations.join('. ') : ''
      }`;

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = getSpeechLangCode(currentLanguage.code);
      utterance.rate = 0.95; // Farmer-friendly, slightly slower paced clear speech
      utterance.pitch = 1.0;

      // Try to select an authentic native voice matching language
      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = currentLanguage.code;
      const matchedVoice = voices.find(
        (v) => v.lang.startsWith(targetLangPrefix) || v.lang.includes(targetLangPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis playback error:', err);
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Copy answer to clipboard for WhatsApp sharing
  const handleCopyAdvice = () => {
    if (!answer) return;
    const textToCopy = `🌾 *KisanSync કૃષિ સલાહ*\n\n📌 *પ્રશ્ન:* ${answer.query}\n\n💡 *જવાબ:* ${answer.headline}\n${answer.simpleAnswer}\n\n✅ *ભલામણો:*\n${answer.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n🏛️ *સંબંધિત:* ${answer.relatedScheme?.name || 'KisanSync SK.AI'}\n\n_${answer.verificationNote}_`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Popular Quick Suggestion Chips for 1-Tap Farmer Inquiries
  const quickSuggestions = {
    gu: [
      { text: 'કપાસમાં પાન પીળા થાય છે?', icon: Sprout, query: 'મારા કપાસના પાકમાં પાન પીળા થઈ રહ્યા છે, શું કરું?' },
      { text: 'ઘઉંમાં ખાતર વ્યવસ્થાપન', icon: Droplets, query: 'ઘઉંના પાકમાં વધુ ઉત્પાદન માટે કયું ખાતર નાખવું?' },
      { text: 'PM-KISAN અને સબસિડી', icon: Landmark, query: 'ખેડૂતો માટે સરકારી યોજનાઓ અને સબસિડી કઈ કઈ છે?' },
      { text: 'આજના બજાર ભાવ', icon: TrendingUp, query: 'આજના મુખ્ય પાકોના મંડી બજાર ભાવ શું છે?' },
      { text: 'ટપક પિયત (ડ્રીપ) પદ્ધતિ', icon: Droplets, query: 'કપાસમાં પિયત ક્યારે આપવું અને ડ્રીપ સબસિડી કેવી રીતે મળે?' },
      { text: 'લીંબોળી તેલ સ્પ્રે', icon: Bug, query: 'લીંબોળીના તેલથી જીવાત નિયંત્રણ કેવી રીતે કરવું?' }
    ],
    hi: [
      { text: 'कपास में पीले पत्ते', icon: Sprout, query: 'कपास के पत्ते पीले हो रहे हैं, क्या उपाय करें?' },
      { text: 'गेहूं खाद गाइड', icon: Droplets, query: 'गेहूं में ज्यादा पैदावार के लिए कौन सा खाद डालें?' },
      { text: 'PM-KISAN योजना', icon: Landmark, query: 'किसानों के लिए सरकारी योजनाएं और सब्सिडी की जानकारी दें' },
      { text: 'आज का मंडी भाव', icon: TrendingUp, query: 'आज का कपास और गेहूं का मंडी भाव क्या है?' },
      { text: 'ड्रिप सिंचाई तकनीक', icon: Droplets, query: 'फसलों में ड्रिप सिंचाई और सरकारी सब्सिडी कैसे प्राप्त करें?' },
      { text: 'नीम तेल कीटनाशक', icon: Bug, query: 'नीम तेल का जैविक कीटनाशक स्प्रे कैसे करें?' }
    ],
    en: [
      { text: 'Cotton Yellow Leaves', icon: Sprout, query: 'My cotton leaves are turning yellow, what should I do?' },
      { text: 'Wheat Fertilizer Guide', icon: Droplets, query: 'What fertilizer schedule should I use for wheat?' },
      { text: 'PM-KISAN & Schemes', icon: Landmark, query: 'Which government agricultural schemes and subsidies are available?' },
      { text: 'Today\'s Mandi Prices', icon: TrendingUp, query: 'What is today\'s agricultural commodity mandi price and trend?' },
      { text: 'Drip Irrigation Setup', icon: Droplets, query: 'When should I irrigate cotton and how to apply for drip subsidy?' },
      { text: 'Neem Oil Pest Spray', icon: Bug, query: 'How to use neem oil spray for organic pest control?' }
    ]
  };

  const currentSuggestions = 
    currentLanguage.code === 'gu' ? quickSuggestions.gu :
    currentLanguage.code === 'hi' ? quickSuggestions.hi :
    quickSuggestions.en;

  // Category Colors and Icons
  const getCategoryMeta = (catKey: string) => {
    switch (catKey) {
      case 'crop_pathology':
        return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: Bug };
      case 'fertilizer_soil':
        return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: Sprout };
      case 'government_schemes':
        return { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Landmark };
      case 'mandi_prices':
        return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: TrendingUp };
      case 'weather_irrigation':
        return { color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', icon: Droplets };
      default:
        return { color: 'text-[#ff7a17] bg-[#ff7a17]/10 border-[#ff7a17]/30', icon: HelpCircle };
    }
  };

  return (
    <div className={`w-full max-w-full overflow-hidden ${className}`}>
      
      {/* Search Input Box Card */}
      <div className="relative bg-[#141517] border border-[#212327] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl transition-all duration-200 focus-within:border-[#ff7a17]/70 focus-within:ring-2 focus-within:ring-[#ff7a17]/20 w-full max-w-full">
        
        {/* Top Header Label */}
        <div className="flex items-center justify-between px-1.5 sm:px-2 pt-0.5 pb-2 border-b border-[#212327] mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#ff7a17] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#ff7a17] truncate">
              {currentLanguage.code === 'gu' ? 'SK.AI સ્માર્ટ કૃષિ શોધ & વોઇસ સહાયક' : currentLanguage.code === 'hi' ? 'SK.AI स्मार्ट कृषि खोज एवं वॉइस सहायक' : 'SK.AI Smart Search & Voice Assistant'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#7d8187] hidden sm:inline-block shrink-0">
            {currentLanguage.nativeName} ({currentLanguage.name})
          </span>
        </div>

        {/* Input Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative w-full">
          
          {/* Search Icon */}
          <div className="pl-1 sm:pl-3 text-[#7d8187] shrink-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Text Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isListening}
            placeholder={isListening ? (currentLanguage.code === 'gu' ? '🎙️ સાંભળી રહ્યું છે... બોલો' : '🎙️ Listening... Speak now') : currentPlaceholders[placeholderIndex]}
            className="flex-1 min-w-0 bg-transparent text-white placeholder:text-[#7d8187] text-xs sm:text-base focus:outline-none py-2 sm:py-3 pr-1"
          />

          {/* Clear Query Button */}
          {query && !isLoading && !isListening && (
            <button
              onClick={() => {
                setQuery('');
                setAnswer(null);
                stopAudio();
              }}
              aria-label="Clear search"
              className="p-1.5 text-[#7d8187] hover:text-white hover:bg-[#212327] rounded-full transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Microphone Voice Search Button */}
          <button
            type="button"
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice search'}
            title={isListening ? 'Stop Voice Recording' : 'Search by Voice (બોલીને પૂછો)'}
            className={`relative min-h-[38px] min-w-[38px] sm:min-h-[48px] sm:min-w-[48px] p-2 sm:p-3 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 select-none active:scale-95 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50 ring-4 ring-red-500/30'
                : 'bg-[#212327] hover:bg-[#2c2f35] text-[#ff7a17] hover:text-white border border-[#30333a]'
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Search Submit Button */}
          <button
            type="button"
            onClick={() => executeSearch()}
            disabled={isLoading || !query.trim()}
            className="min-h-[38px] sm:min-h-[48px] px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-[#ff7a17] hover:bg-[#ff8f38] active:bg-[#e66807] disabled:opacity-50 disabled:pointer-events-none text-black font-bold text-xs sm:text-base flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 shadow-md shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline whitespace-nowrap">{t('searchCrops') || 'Search'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>

        </div>

        {/* Live Voice Recording Status Bar */}
        {isListening && (
          <div className="mt-2.5 pt-2.5 border-t border-[#212327] flex items-center justify-between gap-2 px-2 bg-red-950/20 p-2 rounded-xl border border-red-500/30 animate-pulse">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <div className="flex items-center gap-0.5 shrink-0">
                <span className="w-1 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] sm:text-sm font-semibold text-red-200 truncate">
                {currentLanguage.code === 'gu' ? 'સાંભળી રહ્યું છે... બોલો' : currentLanguage.code === 'hi' ? 'सुन रहा है... बोलें' : 'Listening... Speak your question'}
              </span>
            </div>
            <button
              onClick={toggleListening}
              className="text-[10px] sm:text-xs font-mono text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-full shrink-0"
            >
              {currentLanguage.code === 'gu' ? 'પૂર્ણ' : 'Stop'}
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        {!answer && (
          <div className="mt-2.5 pt-2.5 border-t border-[#212327]">
            <div className="flex items-center gap-1.5 mb-2 px-0.5">
              <Sparkles className="w-3 h-3 text-[#ff7a17]" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#7d8187]">
                {currentLanguage.code === 'gu' ? 'ઝડપી પ્રશ્નો (૧-ક્લિક)' : currentLanguage.code === 'hi' ? 'त्वरित प्रश्न (1-क्लिक)' : 'Popular Farming Queries'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {currentSuggestions.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item.query);
                      executeSearch(item.query);
                    }}
                    className="group bg-[#191919] hover:bg-[#212327] active:bg-[#282b30] border border-[#212327] hover:border-[#ff7a17]/50 text-[#dadbdf] hover:text-white text-xs py-1.5 px-2.5 sm:px-3.5 rounded-full transition-all duration-150 flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <IconComponent className="w-3 h-3 text-[#ff7a17] group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Error Notice */}
      {error && (
        <div className="mt-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm p-3 sm:p-4 rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold break-words">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-200 p-1 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Smart AI Answer Result Box */}
      {answer && (
        <div className="mt-4 sm:mt-6 bg-[#141517] border border-[#212327] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-6 relative overflow-hidden transition-all duration-300 animate-in fade-in-50">
          
          {/* Top Result Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#212327]">
            
            {/* Category Pill */}
            {(() => {
              const meta = getCategoryMeta(answer.categoryKey);
              const CatIcon = meta.icon;
              return (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border truncate ${meta.color}`}>
                    <CatIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{answer.topicCategory}</span>
                  </span>
                  <span className="bg-[#191919] border border-[#212327] text-[#ff7a17] text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3" />
                    <span>SK.AI</span>
                  </span>
                </div>
              );
            })()}

            {/* Action Bar (Audio + Copy + Close) */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {/* TTS Listen Button */}
              {ttsSupported && (
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`min-h-[36px] sm:min-h-[42px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 border ${
                    isPlayingAudio
                      ? 'bg-[#ff7a17] text-black border-[#ff7a17] shadow-lg shadow-[#ff7a17]/20 ring-2 ring-[#ff7a17]/30'
                      : 'bg-[#191919] hover:bg-[#212327] text-white border-[#212327]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{currentLanguage.code === 'gu' ? 'બંધ કરો' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#ff7a17]" />
                      <span className="text-[11px]">{currentLanguage.code === 'gu' ? '🔊 સાંભળો' : '🔊 Listen'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Copy Advice Button */}
              <button
                type="button"
                onClick={handleCopyAdvice}
                title="Copy advice to share on WhatsApp"
                className="min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#191919] hover:bg-[#212327] text-[#dadbdf] hover:text-white border border-[#212327] text-xs font-mono flex items-center gap-1 transition-colors active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Share'}</span>
              </button>

              {/* Close Card */}
              <button
                type="button"
                onClick={() => {
                  setAnswer(null);
                  stopAudio();
                }}
                className="p-1.5 text-[#7d8187] hover:text-white hover:bg-[#212327] rounded-full transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Headline & Query */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#7d8187] flex items-center gap-1.5">
              <span>{currentLanguage.code === 'gu' ? 'પ્રશ્ન:' : currentLanguage.code === 'hi' ? 'प्रश्न:' : 'Query:'}</span>
              <span className="text-[#dadbdf] italic">"{answer.query}"</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-white font-normal leading-tight text-balance">
              {answer.headline}
            </h2>
          </div>

          {/* Simple Practical Answer (Main summary for farmers) */}
          <div className="bg-[#191919] border border-[#212327] rounded-2xl p-4 sm:p-5 relative">
            <div className="flex items-center gap-2 mb-2 text-[#ff7a17] text-xs font-mono uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentLanguage.code === 'gu' ? 'સરળ ખેડૂત માર્ગદર્શન' : currentLanguage.code === 'hi' ? 'सरल किसान परामर्श' : 'Practical Farmer Advisory'}</span>
            </div>
            <p className="text-base sm:text-lg text-white leading-relaxed font-normal">
              {answer.simpleAnswer}
            </p>
          </div>

          {/* Actionable Recommendations List */}
          {answer.recommendations && answer.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#ff7a17] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{currentLanguage.code === 'gu' ? 'તાત્કાલિક પગલાં & દવાનો જથ્થો' : currentLanguage.code === 'hi' ? 'आवश्यक कदम एवं दवा की मात्रा' : 'Key Actionable Steps & Dosages'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {answer.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="bg-[#191919] border border-[#212327] rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 hover:border-white/20 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#ff7a17] text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm text-[#dadbdf] leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relevant Government Scheme (If Available) */}
          {answer.relatedScheme && (
            <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Landmark className="w-4 h-4" />
                <span>{currentLanguage.code === 'gu' ? 'સંબંધિત સરકારી યોજના' : currentLanguage.code === 'hi' ? 'संबंधित सरकारी योजना' : 'Related Government Scheme'}</span>
              </div>
              <h4 className="text-base font-bold text-white">
                {answer.relatedScheme.name}
              </h4>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                {answer.relatedScheme.description}
              </p>
              {answer.relatedScheme.eligibilityOrBenefit && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-blue-300">
                  <span>💰 {answer.relatedScheme.eligibilityOrBenefit}</span>
                  {answer.relatedScheme.applyLinkText && (
                    <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                      <ExternalLink className="w-3 h-3" />
                      <span>{answer.relatedScheme.applyLinkText}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mandi & Market Context (If Available) */}
          {answer.mandiOrMarketContext && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>{currentLanguage.code === 'gu' ? 'બજાર ભાવ & હરાજી સલાહ' : currentLanguage.code === 'hi' ? 'मंडी भाव एवं नीलामी सलाह' : 'Market Price & Trading Context'}</span>
                </div>
                {answer.mandiOrMarketContext.avgPriceRange && (
                  <span className="text-sm font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    {answer.mandiOrMarketContext.avgPriceRange}
                  </span>
                )}
              </div>
              {answer.mandiOrMarketContext.note && (
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  {answer.mandiOrMarketContext.note}
                </p>
              )}
            </div>
          )}

          {/* Next Quick Actions for Farmers */}
          {onNavigate && (
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-[#212327]">
              <button
                type="button"
                onClick={() => onNavigate('analyzer')}
                className="flex-1 min-h-[48px] bg-white hover:bg-[#fafaf7] active:bg-neutral-200 text-black font-semibold text-sm px-5 py-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <Scan className="w-4 h-4 text-black shrink-0" />
                <span>{t('scanFieldNow') || 'Scan Field with AI Scanner'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="flex-1 min-h-[48px] bg-[#191919] hover:bg-[#212327] text-white border border-[#212327] hover:border-white/20 font-semibold text-sm px-5 py-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#ff7a17] shrink-0" />
                <span>{t('exploreMarket') || 'Explore Live Bidding'}</span>
              </button>
            </div>
          )}

          {/* Verification Disclaimer Notice */}
          <div className="pt-2 border-t border-[#212327] flex items-start gap-2 text-xs text-[#7d8187]">
            <ShieldCheck className="w-4 h-4 text-[#7d8187] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {answer.verificationNote}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
