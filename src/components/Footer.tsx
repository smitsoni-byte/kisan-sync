import React from 'react';
import { Sprout, ShieldCheck, Cpu, ArrowRight, Heart, BookOpen, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getReviewUIStrings } from '../data/reviewTranslations';
import { ViewMode } from '../types';

export const Footer: React.FC<{ 
  onNavigate: (view: ViewMode) => void;
  onOpenManual?: () => void;
  onOpenReviews?: () => void;
  onOpenTerms?: () => void;
}> = ({ onNavigate, onOpenManual, onOpenReviews, onOpenTerms }) => {
  const { currentLanguage, t } = useLanguage();
  const reviewUI = getReviewUIStrings(currentLanguage.code);

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-[#212327] pt-12 pb-28 md:pb-10 font-sans-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#212327]">
          
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold">
                <Sprout className="w-4 h-4 text-black" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Kisan<span className="text-[#ff7a17]">Sync</span>
              </span>
            </div>
            <p className="text-sm text-[#dadbdf] leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#ff7a17] font-mono bg-[#141517] p-2.5 rounded-full border border-[#212327]">
              <ShieldCheck className="w-4 h-4 text-[#ff7a17] shrink-0" />
              <span className="truncate">{t('verifiedMiddlemenZero')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-mono text-xs mb-4 uppercase tracking-wider">{t('platformModules')}</h4>
            <ul className="space-y-2.5 text-sm text-[#dadbdf]">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#ff7a17] transition-colors flex items-center gap-1.5 text-left">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                  <span>{t('dashboard')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analyzer')} className="hover:text-[#ff7a17] transition-colors flex items-center gap-1.5 text-left">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                  <span>{t('fieldAnalyzer')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-[#ff7a17] transition-colors flex items-center gap-1.5 text-left">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                  <span>{t('tradingMarket')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-[#ff7a17] transition-colors flex items-center gap-1.5 text-left">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                  <span>{t('home')}</span>
                </button>
              </li>
              {onOpenManual && (
                <li>
                  <button onClick={onOpenManual} className="hover:text-[#ff7a17] text-[#ff7a17] transition-colors flex items-center gap-1.5 text-left font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                    <span>{currentLanguage.code === 'gu' ? 'વપરાશ માર્ગદર્શિકા (User Manual)' : 'How to Use / User Manual'}</span>
                  </button>
                </li>
              )}
              {onOpenReviews && (
                <li>
                  <button onClick={onOpenReviews} className="hover:text-[#ff7a17] text-[#dadbdf] hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <Star className="w-3.5 h-3.5 text-[#ff7a17] fill-[#ff7a17] shrink-0" />
                    <span>{reviewUI.modalTitle}</span>
                  </button>
                </li>
              )}
              {onOpenTerms && (
                <li>
                  <button onClick={onOpenTerms} className="hover:text-[#ff7a17] text-[#dadbdf] hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a17] shrink-0" />
                    <span>{currentLanguage.code === 'gu' ? 'સેવાની શરતો & પ્રાઇવસી પોલિસી' : 'Terms of Service & Privacy'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Tech & AI Stack */}
          <div>
            <h4 className="text-white font-mono text-xs mb-4 uppercase tracking-wider">{t('agronomicAiEngine')}</h4>
            <ul className="space-y-2 text-sm text-[#dadbdf] font-mono">
              <li className="flex items-center gap-2 text-white font-semibold">
                <Cpu className="w-4 h-4 text-[#ff7a17] shrink-0" />
                <span>sk.ai Vision Pathology</span>
              </li>
              <li className="text-xs text-[#7d8187]">• Real-time Chlorophyll & Blight Detection</li>
              <li className="text-xs text-[#7d8187]">• Automated AI Quality Scoring (0-100)</li>
              <li className="text-xs text-[#7d8187]">• Real-time Bid Escrow Contract Readiness</li>
            </ul>
          </div>

          {/* Contact / Helpline */}
          <div>
            <h4 className="text-white font-mono text-xs mb-4 uppercase tracking-wider">{t('farmerHelpline')}</h4>
            <p className="text-xs text-[#7d8187] mb-3">
              {t('heroDesc')}
            </p>
            <div className="p-3 bg-[#141517] rounded-2xl border border-[#212327] space-y-1 font-mono">
              <p className="text-xs font-bold text-[#7d8187]">{t('tollFreeHelpline')}</p>
              <p className="text-sm font-bold text-[#ff7a17]">1800-KISAN-SYNC (547-267)</p>
              <p className="text-[10px] text-[#7d8187]">{t('availableLanguages22')}</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9aa0a6] gap-3 font-mono text-center sm:text-left leading-relaxed">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 max-w-md sm:max-w-none">
            <span>© {new Date().getFullYear()} KisanSync (SK.ai) • Team Hexa Knights</span>
            {onOpenTerms && (
              <>
                <span className="text-[#404349] hidden sm:inline">•</span>
                <button 
                  onClick={onOpenTerms}
                  className="text-[#dadbdf] hover:text-[#ff7a17] underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {currentLanguage.code === 'gu' ? 'સેવાની શરતો & પ્રાઇવસી' : 'Terms & Privacy Policy'}
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-[#ff7a17] fill-[#ff7a17]" />
            <span>{t('designedForAgriculture')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


