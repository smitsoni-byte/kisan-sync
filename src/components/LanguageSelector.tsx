import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_LANGUAGES, Language } from '../data/languages';
import { Globe, Search, Check, X, Sparkles, MapPin } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguageCode, isSelectorOpen, setIsSelectorOpen, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isSelectorOpen) return null;

  const filteredLanguages = INDIAN_LANGUAGES.filter((lang) => {
    const term = searchTerm.toLowerCase();
    return (
      lang.name.toLowerCase().includes(term) ||
      lang.nativeName.toLowerCase().includes(term) ||
      lang.scriptName.toLowerCase().includes(term) ||
      lang.region.toLowerCase().includes(term)
    );
  });

  const popularLangs = filteredLanguages.filter((l) => l.isPopular);
  const remainingLangs = filteredLanguages.filter((l) => !l.isPopular);

  const handleSelect = (code: string) => {
    setLanguageCode(code);
    setIsSelectorOpen(false);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsSelectorOpen(false); }}
      className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans-body"
    >
      <div className="bg-[#191919] border border-[#212327] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212327]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-2xl text-white">{t('selectLanguage')}</h2>
                <span className="text-[10px] font-mono bg-[#141517] text-[#ff7a17] border border-[#212327] px-2 py-0.5 rounded-full">
                  22+ Indian Languages
                </span>
              </div>
              <p className="text-xs text-[#7d8187] font-mono">Select your preferred regional language for UI & AI disease reports</p>
            </div>
          </div>

          <button
            onClick={() => setIsSelectorOpen(false)}
            className="p-2 rounded-full text-white hover:bg-[#212327] bg-[#141517] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7d8187] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchLanguage')}
            className="w-full min-h-[48px] bg-[#141517] border border-[#212327] rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-[#7d8187] focus:outline-none focus:border-[#ff7a17] transition-all font-mono"
          />
        </div>

        {/* Languages Scrollable Container */}
        <div className="max-h-[380px] overflow-y-auto space-y-6 pr-1">
          
          {/* Popular Languages Grid */}
          {popularLangs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff7a17] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#ff7a17]" />
                <span>{t('popularLanguages')}</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {popularLangs.map((lang) => {
                  const isSelected = currentLanguage.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`p-3.5 min-h-[72px] rounded-2xl border text-left transition-all duration-150 relative flex flex-col justify-between active:scale-[0.97] ${
                        isSelected
                          ? 'bg-[#141517] border-[#ff7a17] ring-1 ring-[#ff7a17] shadow-sm'
                          : 'bg-[#141517] border-[#212327] hover:border-white/40 active:bg-[#212327]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-base text-white">{lang.nativeName}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#ff7a17] text-black flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-[#7d8187] flex items-center justify-between font-mono">
                        <span>{lang.name}</span>
                        <span className="text-[10px] bg-[#212327] px-1.5 py-0.2 rounded text-[#dadbdf]">
                          {lang.scriptName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remaining Scheduled & Regional Languages List */}
          {remainingLangs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#dadbdf] uppercase tracking-wider pt-2 border-t border-[#212327]">
                <span>{t('allLanguages')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {remainingLangs.map((lang) => {
                  const isSelected = currentLanguage.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`p-3.5 min-h-[64px] rounded-xl border text-left transition-all duration-150 flex items-center justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#141517] border-[#ff7a17] ring-1 ring-[#ff7a17]'
                          : 'bg-[#141517] border-[#212327] hover:border-white/40 active:bg-[#212327]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{lang.nativeName}</span>
                          <span className="text-xs text-[#7d8187]">({lang.name})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#7d8187] font-mono mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 text-[#ff7a17]" />
                            {lang.region}
                          </span>
                          <span>•</span>
                          <span>{lang.scriptName}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#ff7a17] text-black flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredLanguages.length === 0 && (
            <div className="p-8 text-center text-[#7d8187] space-y-2 font-mono">
              <p>No language matches "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#ff7a17] font-bold underline"
              >
                Clear Search
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#212327] flex items-center justify-between text-xs text-[#7d8187] font-mono">
          <span>Current: <strong className="text-white">{currentLanguage.nativeName} ({currentLanguage.name})</strong></span>
          <button
            onClick={() => setIsSelectorOpen(false)}
            className="bg-[#ff7a17] hover:bg-[#e06912] text-black font-semibold px-5 py-2.5 rounded-full transition-all"
          >
            Apply Language
          </button>
        </div>

      </div>
    </div>
  );
};
