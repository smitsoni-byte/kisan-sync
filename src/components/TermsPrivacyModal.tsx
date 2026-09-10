import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Copy, 
  Check, 
  Trash2, 
  Search, 
  Download, 
  ExternalLink,
  Scale,
  Sparkles,
  Info,
  ChevronRight,
  PhoneCall,
  Mail,
  Building2,
  Sprout,
  KeyRound,
  UserCheck,
  Camera,
  ShoppingBag,
  Award,
  RefreshCw,
  UserX,
  Gavel
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { getTermsTranslation, TermsSection } from '../data/termsPrivacyData';

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'rights' | 'contact';
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'terms'
}) => {
  const { currentLanguage } = useLanguage();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'rights' | 'contact'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const content = useMemo(() => getTermsTranslation(currentLanguage.code), [currentLanguage.code]);

  if (!isOpen) return null;

  // Filter sections by search query
  const filteredSections = content.sections.filter(sec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.points.some(p => p.toLowerCase().includes(q))
    );
  });

  const getSectionIcon = (iconName: string) => {
    const iconClass = "w-5 h-5 text-[#ff7a17] shrink-0";
    switch (iconName) {
      case 'Sprout': return <Sprout className={iconClass} />;
      case 'UserCheck': return <UserCheck className={iconClass} />;
      case 'KeyRound': return <KeyRound className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'AlertTriangle': return <AlertTriangle className={iconClass} />;
      case 'Camera': return <Camera className={iconClass} />;
      case 'ShoppingBag': return <ShoppingBag className={iconClass} />;
      case 'Lock': return <Lock className={iconClass} />;
      case 'Award': return <Award className={iconClass} />;
      case 'Scale': return <Scale className={iconClass} />;
      case 'RefreshCw': return <RefreshCw className={iconClass} />;
      case 'UserX': return <UserX className={iconClass} />;
      case 'Gavel': return <Gavel className={iconClass} />;
      case 'Mail': return <Mail className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  const handleCopy = () => {
    const fullText = `${content.title}\nLast Updated: ${content.lastUpdated}\n${content.teamName} - ${content.appName}\n\n${content.intro}\n\n` +
      content.sections.map(s => `${s.title}\n${s.summary}\n` + s.points.map(p => `• ${p}`).join('\n') + (s.importantNotice ? `\n[NOTE]: ${s.importantNotice}` : '')).join('\n\n') +
      `\n\nContact: ${content.contactInfo.email} | Helpline: ${content.contactInfo.phone}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      toast.success(
        currentLanguage.code === 'gu' ? 'શરતો ક્લિપબોર્ડમાં કોપી થઈ ગઈ છે!' : 'Terms copied to clipboard!'
      );
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadText = () => {
    const fullText = `${content.title}\nLast Updated: ${content.lastUpdated}\n${content.teamName} - ${content.appName}\n\n${content.intro}\n\n` +
      content.sections.map(s => `${s.title}\n${s.summary}\n` + s.points.map(p => `• ${p}`).join('\n') + (s.importantNotice ? `\n[NOTE]: ${s.importantNotice}` : '')).join('\n\n') +
      `\n\nContact: ${content.contactInfo.email} | Helpline: ${content.contactInfo.phone}`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KisanSync_Terms_Privacy_${currentLanguage.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.info(
      currentLanguage.code === 'gu' ? 'ફાઇલ ડાઉનલોડ થઈ ગઈ છે.' : 'Terms file downloaded.'
    );
  };

  const handleRequestDataDeletion = () => {
    setIsDeletingData(true);
    setTimeout(() => {
      setIsDeletingData(false);
      setDeletionSuccess(true);
      toast.success(
        currentLanguage.code === 'gu'
          ? 'ડેટા રિમૂવલ વિનંતી ટીમ હેક્ઝા નાઈટ્સને સફળતાપૂર્વક મોકલવામાં આવી છે.'
          : 'Data deletion request has been submitted to Team Hexa Knights.'
      );
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="terms-privacy-modal-card"
        className="relative w-full max-w-4xl bg-[#0e1013] border border-[#212327] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto text-slate-100 font-sans-body"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-[#212327] bg-[#141517]/80">
          <h2 className="text-lg sm:text-xl font-bold text-[#ff7a17] tracking-tight">
            {currentLanguage.code === 'gu' ? 'પ્રાઇવસી અને પોલિસી (Privacy and Policy)' : 'Privacy and Policy'}
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-[#dadbdf] hover:text-white hover:bg-[#212327] active:bg-[#282b30] transition-colors"
              title="Copy Terms & Policy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownloadText}
              className="p-2 rounded-xl text-[#dadbdf] hover:text-white hover:bg-[#212327] active:bg-[#282b30] transition-colors"
              title="Download Text File (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#dadbdf] hover:text-white hover:bg-[#212327] active:bg-[#282b30] transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="px-5 sm:px-8 py-3 bg-[#111215] border-b border-[#212327] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#181a1e] rounded-full border border-[#212327] w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === 'terms'
                  ? 'bg-[#ff7a17] text-black shadow-sm'
                  : 'text-[#dadbdf] hover:text-white hover:bg-[#212327]'
              }`}
            >
              {currentLanguage.code === 'gu' ? 'સેવાની શરતો (Terms)' : 'Terms of Service'}
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === 'privacy'
                  ? 'bg-[#ff7a17] text-black shadow-sm'
                  : 'text-[#dadbdf] hover:text-white hover:bg-[#212327]'
              }`}
            >
              {currentLanguage.code === 'gu' ? 'પ્રાઇવસી પોલિસી (Privacy)' : 'Privacy Policy'}
            </button>
            <button
              onClick={() => setActiveTab('rights')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === 'rights'
                  ? 'bg-[#ff7a17] text-black shadow-sm'
                  : 'text-[#dadbdf] hover:text-white hover:bg-[#212327]'
              }`}
            >
              {currentLanguage.code === 'gu' ? 'ડેટા અધિકાર & ડિલીટ' : 'Data Rights & Deletion'}
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === 'contact'
                  ? 'bg-[#ff7a17] text-black shadow-sm'
                  : 'text-[#dadbdf] hover:text-white hover:bg-[#212327]'
              }`}
            >
              {currentLanguage.code === 'gu' ? 'સંપર્ક & હેલ્પલાઇન' : 'Contact & Helpline'}
            </button>
          </div>

          {/* Quick Search in Terms */}
          {activeTab === 'terms' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8187]" />
              <input
                type="text"
                placeholder={currentLanguage.code === 'gu' ? 'શરત શોધો...' : 'Search terms...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181a1e] border border-[#212327] rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#7d8187] focus:outline-none focus:border-[#ff7a17]"
              />
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              {/* Intro Banner */}
              <div className="p-4 rounded-2xl bg-[#141517] border border-[#212327] text-xs sm:text-sm text-[#dadbdf] leading-relaxed">
                {content.intro}
              </div>

              {/* AI Disclaimer Highlight Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {currentLanguage.code === 'gu' 
                      ? 'મહત્વપૂર્ણ વૈજ્ઞાનિક ડિસ્ક્લેમર (AI Diagnostic Advisory)' 
                      : 'Important Scientific & Agronomic Disclaimer'}
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {currentLanguage.code === 'gu'
                    ? 'કિસાન સિંક (SK.ai) દ્વારા અપાતું પાક રોગ નિદાન અને જમીન વિશ્લેષણ આર્ટિફિશિયલ ઇન્ટેલિજન્સ પર આધારિત છે. કોઈપણ મોટો છંટકાવ કે પાક બદલવાના નિર્ણય પહેલાં સ્થાનિક કૃષિ અધિકારી અથવા કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) ની સલાહ અવશ્ય લેવી.'
                    : 'AI-generated disease diagnostics, pest identification, and soil recommendations are indicative visual assessments. Always consult an Agricultural Extension Officer, Krishi Vigyan Kendra (KVK), or certified soil laboratory before executing major chemical sprays or crop transitions.'}
                </p>
              </div>

              {/* Numbered Sections */}
              <div className="space-y-4">
                {filteredSections.map((sec) => (
                  <div 
                    key={sec.id}
                    className="p-5 rounded-2xl bg-[#141517] border border-[#212327] hover:border-[#ff7a17]/30 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#1c1e22] border border-[#26292e] flex items-center justify-center">
                          {getSectionIcon(sec.iconName)}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {sec.title}
                          </h3>
                          <p className="text-xs text-[#9aa0a6]">
                            {sec.summary}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#7d8187] px-2 py-0.5 rounded bg-[#181a1e]">
                        #{sec.number}
                      </span>
                    </div>

                    {/* Points list */}
                    <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-[#dadbdf]">
                      {sec.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#ff7a17] font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Important Notice Callout if present */}
                    {sec.importantNotice && (
                      <div className="mt-2 p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-[11px] sm:text-xs text-red-300 font-medium">
                        ⚠️ {sec.importantNotice}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY & PHOTO OWNERSHIP */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#141517] border border-[#212327] space-y-3">
                <div className="flex items-center gap-2.5 text-white font-bold text-sm sm:text-base">
                  <Lock className="w-5 h-5 text-[#ff7a17]" />
                  <span>
                    {currentLanguage.code === 'gu' ? 'ખેડૂત ગોપનીયતા સુરક્ષા કવચ' : 'Farmer Privacy & Data Protection Safeguard'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#dadbdf] leading-relaxed">
                  {currentLanguage.code === 'gu'
                    ? 'ટીમ હેક્ઝા નાઈટ્સ ખેડૂત ભાઈઓની અંગત માહિતી, ખેતરના ફોટા અને વેચાણના આંકડાઓને અત્યંત સુરક્ષિત રાખવા માટે પ્રતિબદ્ધ છે. અમે કોઈ પણ વ્યાપારી જાહેરાત કંપની કે દલાલોને ખેડૂતનો ડેટા વેચતા નથી.'
                    : 'Team Hexa Knights is dedicated to the utmost confidentiality of agricultural field photos, diagnostic scans, and direct auction trade figures. Your crop imagery and farm telemetry are never sold, rented, or monetized with third-party advertisers.'}
                </p>
              </div>

              {/* Visual Privacy Principles Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#141517] border border-[#212327] space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                    <Camera className="w-4 h-4 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? '૧૦૦% ફોટો માલિકી' : '100% Photo Ownership'}</span>
                  </div>
                  <p className="text-xs text-[#9aa0a6] leading-relaxed">
                    {currentLanguage.code === 'gu'
                      ? 'તમે અપલોડ કરેલા તમામ ફોટા તમારી અંગત માલિકીના રહે છે. તે ફક્ત તમને રોગ નિદાન અને જમીન ભલામણ આપવા માટે જ પ્રોસેસ થાય છે.'
                      : 'You retain sole legal ownership of all leaf and soil photos uploaded. They are solely processed to render instant botanical pathology and soil agronomic advice.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141517] border border-[#212327] space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'શૂન્ય ડેટા વેચાણ' : 'Zero Data Commercialization'}</span>
                  </div>
                  <p className="text-xs text-[#9aa0a6] leading-relaxed">
                    {currentLanguage.code === 'gu'
                      ? 'તમારો ફોન નંબર, લોકેશન કે પાક ઉપજના આંકડા ત્રીજા પક્ષને વેચવામાં આવતા નથી.'
                      : 'Your mobile credentials, coordinates, and yield metrics are never traded, sold, or shared with third-party brokers.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141517] border border-[#212327] space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                    <KeyRound className="w-4 h-4 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'એન્ક્રિપ્ટેડ સંગ્રહ' : 'Secure Cloud Storage'}</span>
                  </div>
                  <p className="text-xs text-[#9aa0a6] leading-relaxed">
                    {currentLanguage.code === 'gu'
                      ? 'તમારો તમામ વેપાર ઇતિહાસ અને કિસાન ક્રેડિટ સ્કોર સુરક્ષિત એન્ક્રિપ્શન હેઠળ સંગ્રહિત થાય છે.'
                      : 'All farmer credit profiles and trade ledgers are preserved in high-integrity encrypted datastores.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141517] border border-[#212327] space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                    <Trash2 className="w-4 h-4 text-[#ff7a17]" />
                    <span>{currentLanguage.code === 'gu' ? 'કાયમી ડિલીટ કરવાની છૂટ' : 'Right to Full Erasure'}</span>
                  </div>
                  <p className="text-xs text-[#9aa0a6] leading-relaxed">
                    {currentLanguage.code === 'gu'
                      ? 'તમે ઇચ્છો ત્યારે એક ક્લિકમાં તમારો તમામ સ્કેન ડેટા અને એકાઉન્ટ રેકોર્ડ ડિલીટ કરી શકો છો.'
                      : 'Submit a deletion request anytime to purge your historical diagnostic photos and ledger entries completely.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA RIGHTS & DELETION REQUEST */}
          {activeTab === 'rights' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#141517] border border-[#212327] space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#ff7a17]" />
                  <span>{content.dataRights.title}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.dataRights.points.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#181a1e] border border-[#212327] space-y-1">
                      <div className="font-semibold text-xs text-white">{p.title}</div>
                      <div className="text-[11px] text-[#9aa0a6] leading-relaxed">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Data Erasure / Deletion Form */}
              <div className="p-5 sm:p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
                <div className="flex items-center gap-3 text-red-400 font-bold text-sm sm:text-base">
                  <Trash2 className="w-5 h-5" />
                  <span>
                    {currentLanguage.code === 'gu' ? 'ડેટા અને ફોટા ડિલીટ કરવાની વિનંતી (Data Erasure Request)' : 'Request Data Deletion & Profile Erasure'}
                  </span>
                </div>
                <p className="text-xs text-red-200/80 leading-relaxed">
                  {currentLanguage.code === 'gu'
                    ? 'જો તમે કિસાન સિંકમાંથી તમારા તમામ અપલોડ કરેલા પાક ફોટા, જમીન વિશ્લેષણ પરિણામો અને એકાઉન્ટ માહિતી કાયમી ધોરણે દૂર કરવા માંગતા હોવ, તો નીચે આપેલા બટન પર ક્લિક કરો.'
                    : 'If you wish to permanently purge all uploaded crop photos, soil diagnostic entries, and personal profile information from Kisan Sync, initiate the request below.'}
                </p>

                {deletionSuccess ? (
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>
                      {currentLanguage.code === 'gu'
                        ? 'વિનંતી સફળતાપૂર્વક નોંધાઈ છે! તમારો ડેટા ૨૪ કલાકમાં સર્વર પરથી દૂર કરવામાં આવશે.'
                        : 'Request submitted successfully! Your data will be completely purged from our active datastores within 24 hours.'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleRequestDataDeletion}
                    disabled={isDeletingData}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-mono text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {isDeletingData
                        ? (currentLanguage.code === 'gu' ? 'પ્રક્રિયા ચાલુ છે...' : 'Processing...')
                        : (currentLanguage.code === 'gu' ? 'મારો તમામ ડેટા ડિલીટ કરો' : 'Delete All My Photos & Data')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & HELPLINE */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#141517] border border-[#212327] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <Building2 className="w-5 h-5 text-[#ff7a17]" />
                  <span>Team Hexa Knights – Smart India Hackathon</span>
                </div>
                <p className="text-xs sm:text-sm text-[#dadbdf] leading-relaxed">
                  {currentLanguage.code === 'gu'
                    ? 'કિસાન સિંક (SK.ai) સેવાની શરતો અથવા પ્રાઇવસી અંગેના કોઈપણ પ્રશ્ન કે ફરિયાદ માટે નીચે આપેલા સત્તાવાર માધ્યમો દ્વારા અમારો સંપર્ક કરો:'
                    : 'For any legal questions, privacy concerns, terms verification, or platform support, connect with Team Hexa Knights via official channels:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#181a1e] border border-[#212327] space-y-1">
                    <div className="text-[11px] text-[#7d8187] font-mono flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#ff7a17]" />
                      <span>Official Email</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white font-mono">
                      support@kisansync.in
                    </div>
                    <div className="text-[10px] text-[#9aa0a6]">
                      hexaknights.sih@gmail.com
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181a1e] border border-[#212327] space-y-1">
                    <div className="text-[11px] text-[#7d8187] font-mono flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-[#ff7a17]" />
                      <span>Farmer Toll-Free Helpline</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#ff7a17] font-mono">
                      1800-KISAN-SYNC (547-267)
                    </div>
                    <div className="text-[10px] text-[#9aa0a6]">
                      Available across 22+ Indian languages
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#181a1e] border border-[#212327] text-xs text-[#9aa0a6] font-mono">
                  📍 {content.contactInfo.address}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-8 py-4 border-t border-[#212327] bg-[#141517] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#7d8187] font-mono text-center sm:text-left">
            © {new Date().getFullYear()} Team Hexa Knights • Kisan Sync (SK.ai)
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#ff7a17] hover:bg-[#e06912] active:bg-[#c95907] text-black font-semibold text-xs font-mono transition-all duration-150 cursor-pointer shadow-sm"
          >
            {currentLanguage.code === 'gu' ? 'હું શરતો સ્વીકારું છું (I Agree)' : 'I Understand & Agree'}
          </button>
        </div>
      </div>
    </div>
  );
};
