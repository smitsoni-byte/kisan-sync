import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { generateGuidePDF } from '../utils/guidePdfGenerator';
import { getManualTranslation } from '../data/userManualTranslations';
import { 
  BookOpen, 
  X, 
  Scan, 
  ShoppingBag, 
  PlusCircle, 
  Globe, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Zap, 
  Copy, 
  Check, 
  Mic, 
  Volume2, 
  Download, 
  Printer, 
  FileText, 
  Loader2, 
  Share2 
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.12-.533-1.637-.682-2.696-2.336-2.778-2.445-.082-.11-.664-.882-.664-1.682 0-.8.419-1.194.568-1.356.149-.162.325-.203.433-.203.11 0 .217 0 .312.006.1.006.234-.038.366.28.136.327.466 1.135.507 1.217.042.083.07.18.014.29-.055.11-.083.18-.165.276-.083.097-.174.216-.248.29-.083.083-.17.172-.073.338.097.166.432.714.927 1.155.637.568 1.174.744 1.34.827.166.083.263.07.36-.042.097-.11.415-.483.526-.649.11-.166.222-.138.373-.083.153.055.968.456 1.134.54.166.083.277.124.318.193.042.07.042.405-.102.81zm-3.392-10.416C6.586 4 2.25 8.336 2.25 13.681c0 1.83.51 3.54 1.393 5.008L2 22l3.434-1.587c1.414.794 3.037 1.268 4.797 1.268 5.357 0 9.75-4.336 9.75-9.681 0-5.345-4.393-9.681-9.95-9.95-9.681z" />
  </svg>
);

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { currentLanguage } = useLanguage();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState<'quickstart' | 'search' | 'analyzer' | 'marketplace' | 'listing' | 'languages' | 'faq'>('quickstart');
  const [copiedManual, setCopiedManual] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isSharingPdf, setIsSharingPdf] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const trans = getManualTranslation(currentLanguage.code);

  const sectionsConfig = [
    { id: 'quickstart' as const, label: trans.sections.quickstart.tabLabel, icon: Zap },
    { id: 'search' as const, label: trans.sections.search.tabLabel, icon: Mic },
    { id: 'analyzer' as const, label: trans.sections.analyzer.tabLabel, icon: Scan },
    { id: 'marketplace' as const, label: trans.sections.marketplace.tabLabel, icon: ShoppingBag },
    { id: 'listing' as const, label: trans.sections.listing.tabLabel, icon: PlusCircle },
    { id: 'languages' as const, label: trans.sections.languages.tabLabel, icon: Globe },
    { id: 'faq' as const, label: trans.sections.faq.tabLabel, icon: HelpCircle },
  ];

  // Language mapping for Web Speech Synthesis
  const getSpeechLanguageCode = (code: string): string => {
    const speechMap: Record<string, string> = {
      hi: 'hi-IN',
      gu: 'gu-IN',
      mr: 'mr-IN',
      pa: 'pa-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
      as: 'as-IN',
      ur: 'ur-PK',
      en: 'en-IN',
    };
    return speechMap[code] || 'hi-IN';
  };

  // In-app Speech Narration for Section
  const handleSpeakSection = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.info('Audio not supported', 'Your browser does not support speech synthesis.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getSpeechLanguageCode(currentLanguage.code);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Download Plain Text File in Current Language
  const handleDownloadTextFile = () => {
    try {
      const text = trans.fullManualText;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KisanSync_User_Manual_${currentLanguage.code}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloadMenuOpen(false);

      toast.success(
        trans.copiedToastTitle || 'User Manual Downloaded!',
        `KisanSync_User_Manual_${currentLanguage.code}.txt saved successfully.`
      );
    } catch (e) {
      console.error('Download error:', e);
      toast.error('Download failed', 'Please try copying the guide instead.');
    }
  };

  // Download / Print Styled PDF Document
  const handleDownloadPDF = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.info('Popup Blocked', 'Please allow popups to print/save as PDF.');
        return;
      }

      const activeSec = trans.sections[activeSection] || trans.sections.quickstart;
      const stepsHtml = activeSec.steps
        .map(
          (s) => `
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #ea580c; color: #ffffff; font-weight: 800; font-size: 11pt;">${s.num}</span>
            <h3 style="font-size: 13pt; font-weight: 700; color: #0f172a; margin: 0;">${s.title}</h3>
          </div>
          <p style="font-size: 11pt; color: #334155; line-height: 1.55; margin: 0; padding-left: 36px;">${s.desc}</p>
        </div>`
        )
        .join('');

      const contentHtml = `
<!DOCTYPE html>
<html lang="${currentLanguage.code}">
<head>
  <meta charset="UTF-8">
  <title>${trans.modalTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 40px;
      line-height: 1.6;
      font-size: 12pt;
    }
    .header {
      border-bottom: 3px solid #ea580c;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 24pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-tag {
      color: #ea580c;
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .meta-box {
      text-align: right;
      font-size: 9pt;
      color: #64748b;
    }
    .meta-badge {
      display: inline-block;
      background: #ffedd5;
      color: #c2410c;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 4px;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .section-subtitle {
      font-size: 12pt;
      color: #ea580c;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .section-desc {
      font-size: 11pt;
      color: #334155;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .key-points {
      background: #fff7ed;
      border: 1.5px solid #fed7aa;
      border-radius: 12px;
      padding: 14px 18px;
      margin-top: 18px;
    }
    .key-points ul {
      margin: 0;
      padding-left: 20px;
      color: #7c2d12;
      font-size: 10.5pt;
      line-height: 1.6;
    }
    .helpline {
      background: #f1f5f9;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px 18px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">KisanSync 🌱</div>
      <div class="brand-tag">${trans.modalTitle}</div>
    </div>
    <div class="meta-box">
      <div class="meta-badge">${trans.versionBadge}</div>
      <div>${currentLanguage.nativeName} (${currentLanguage.code.toUpperCase()})</div>
      <div>${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div>
    <h1 class="section-title">${activeSec.title}</h1>
    <div class="section-subtitle">${activeSec.subtitle}</div>
    <p class="section-desc">${activeSec.description}</p>
    
    <div>
      ${stepsHtml}
    </div>

    ${
      activeSec.keyPoints && activeSec.keyPoints.length > 0
        ? `<div class="key-points">
            <ul style="list-style-type: square;">
              ${activeSec.keyPoints.map((k) => `<li>${k}</li>`).join('')}
            </ul>
          </div>`
        : ''
    }

    <div class="helpline">
      <div>
        <strong>${trans.farmerHelplineLabel}</strong>
        <span style="color: #ea580c; font-weight: 700; margin-left: 6px;">${trans.helplineNumber}</span>
      </div>
      <div style="color: #475569; font-size: 9.5pt;">portal: <strong>https://kisansync.ai</strong></div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

      printWindow.document.open();
      printWindow.document.write(contentHtml);
      printWindow.document.close();
      setIsDownloadMenuOpen(false);
    } catch (e) {
      console.error('PDF error:', e);
      toast.error('Print failed', 'Could not open print window.');
    }
  };

  // Generate & Share PDF directly on WhatsApp
  const handleSharePdfOnWhatsApp = async () => {
    try {
      setIsSharingPdf(true);
      toast.info(trans.preparingPdf, 'Generating official KisanSync PDF manual...');

      const { pdfFile, fileName } = await generateGuidePDF(
        activeSection,
        currentLanguage.code,
        currentLanguage
      );

      const shareText = `🌾 *${trans.modalTitle}* (${trans.versionBadge})\n\n📄 *${currentSectionData.title}*\n${currentSectionData.description}\n\n📞 *${trans.farmerHelplineLabel}* ${trans.helplineNumber}\n🌐 *Portal:* https://kisansync.ai`;

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: `KisanSync - ${currentSectionData.title}`,
          text: shareText,
        });
        toast.success('Shared Successfully!', 'PDF manual shared via WhatsApp / Native Share.');
      } else {
        const fileUrl = URL.createObjectURL(pdfFile);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const waText = encodeURIComponent(`${shareText}\n\n*(PDF file downloaded to your device)*`);
        window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
        toast.success('PDF Downloaded & WhatsApp Opened', 'Attach the downloaded PDF to your chat.');
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Share error:', error);
        toast.error('Share failed', 'Could not share PDF directly.');
      }
    } finally {
      setIsSharingPdf(false);
      setIsDownloadMenuOpen(false);
    }
  };

  // Copy full manual text to clipboard
  const handleCopyFullManual = () => {
    const text = trans.fullManualText;
    navigator.clipboard.writeText(text);
    setCopiedManual(true);
    toast.success(trans.copiedToastTitle, trans.copiedToastDesc);
    setTimeout(() => setCopiedManual(false), 3000);
  };

  // Direct WhatsApp share text message
  const handleShareOnWhatsApp = () => {
    const activeSec = trans.sections[activeSection] || trans.sections.quickstart;
    const shareMessage = `🌱 *${trans.modalTitle}* (${currentLanguage.nativeName})\n\n📖 *${activeSec.title}*\n${activeSec.subtitle}\n\n${activeSec.description}\n\n📞 *${trans.farmerHelplineLabel}* ${trans.helplineNumber}\n🌐 https://kisansync.ai`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const currentSectionData = trans.sections[activeSection] || trans.sections.quickstart;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-modal-title"
      >
        {/* MODAL HEADER */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shadow-md shrink-0 border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-md">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manual-modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  {trans.modalTitle}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 font-medium">
                    {trans.versionBadge}
                  </span>
                </h2>
              </div>
              <p className="text-xs text-emerald-200/90 line-clamp-1">
                {trans.modalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick WhatsApp Share Button */}
            <button
              id="user-manual-whatsapp-share-btn"
              onClick={handleShareOnWhatsApp}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-semibold rounded-lg transition-all"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-300" />
              <span>{trans.shareWhatsApp}</span>
            </button>

            {/* DOWNLOAD DROPDOWN */}
            <div className="relative">
              <button
                id="user-manual-download-menu-btn"
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm"
              >
                {isSharingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{trans.downloadBtn}</span>
              </button>

              {isDownloadMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDownloadMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {trans.selectFormat}
                    </div>

                    <button
                      onClick={handleSharePdfOnWhatsApp}
                      disabled={isSharingPdf}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2.5 transition-colors"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold">{trans.sharePdfWhatsApp}</div>
                        <div className="text-[10px] text-emerald-600/70 font-normal">{trans.sharePdfWhatsAppDesc}</div>
                      </div>
                    </button>

                    <button
                      onClick={handleDownloadPDF}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 font-medium flex items-center gap-2.5 transition-colors"
                    >
                      <Printer className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-700">{trans.printPdf}</div>
                        <div className="text-[10px] text-slate-400">{trans.printPdfDesc}</div>
                      </div>
                    </button>

                    <button
                      onClick={handleDownloadTextFile}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 font-medium flex items-center gap-2.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-700">{trans.textGuide}</div>
                        <div className="text-[10px] text-slate-400">{trans.textGuideDesc}</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* COPY BUTTON */}
            <button
              id="user-manual-copy-full-btn"
              onClick={handleCopyFullManual}
              className="p-1.5 hover:bg-white/10 rounded-lg text-emerald-200 transition-colors"
              title="Copy Full Guide"
            >
              {copiedManual ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* CLOSE BUTTON */}
            <button
              id="user-manual-close-modal-btn"
              onClick={() => {
                if (isPlayingAudio) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg text-emerald-200 hover:text-white transition-colors"
              aria-label="Close user guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Sidebar Tabs + Content Area) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
          {/* NAVIGATION TABS */}
          <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 shadow-sm">
            {sectionsConfig.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`user-manual-tab-${sec.id}`}
                  onClick={() => {
                    if (isPlayingAudio) window.speechSynthesis.cancel();
                    setIsPlayingAudio(false);
                    setActiveSection(sec.id);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENT SECTION */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/30">
            {activeSection === 'faq' ? (
              /* FAQ SECTION */
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{trans.faqHeading}</h3>
                    <p className="text-xs text-slate-500">{trans.sections.faq.description}</p>
                  </div>
                  <button
                    onClick={() => handleSpeakSection(trans.faqs.map(f => `${f.q}. ${f.a}`).join('. '))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isPlayingAudio
                        ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isPlayingAudio ? trans.playingBtn : trans.listenBtn}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {trans.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
                      <div className="font-bold text-slate-800 text-sm mb-1.5 flex items-start gap-2">
                        <span className="text-emerald-600 font-extrabold shrink-0">Q{idx + 1}.</span>
                        <span>{faq.q}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>

                {/* HELPLINE BANNER */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{trans.farmerHelplineLabel}</div>
                      <div className="text-sm font-extrabold text-emerald-700">{trans.helplineNumber}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD SECTION */
              <div className="space-y-5 max-w-3xl">
                {/* SECTION HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{currentSectionData.title}</h3>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">{currentSectionData.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakSection(currentSectionData.audioText)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isPlayingAudio
                          ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isPlayingAudio ? trans.playingBtn : trans.listenBtn}</span>
                    </button>
                  </div>
                </div>

                {/* OVERVIEW DESCRIPTION */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs text-xs text-slate-600 leading-relaxed">
                  {currentSectionData.description}
                </div>

                {/* STEP-BY-STEP FLOW */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {currentLanguage.code === 'gu' ? 'પગલાંવાર વિગત:' : currentLanguage.code === 'hi' ? 'चरणबद्ध विवरण:' : 'Step-by-Step Instructions:'}
                  </div>
                  {currentSectionData.steps.map((step, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {step.num}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 text-xs mb-1">{step.title}</div>
                        <div className="text-xs text-slate-600 leading-relaxed">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* KEY HIGHLIGHTS */}
                {currentSectionData.keyPoints && currentSectionData.keyPoints.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
                    <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>{currentLanguage.code === 'gu' ? 'મુખ્ય વિશેષતાઓ & લાભ:' : currentLanguage.code === 'hi' ? 'मुख्य विशेषताएं एवं लाभ:' : 'Key Highlights & Benefits:'}</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-amber-900/90 pl-1">
                      {currentSectionData.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* QUICK ACTION BUTTONS */}
                <div className="pt-2 flex flex-wrap gap-2.5">
                  {activeSection === 'analyzer' && onNavigateTab && (
                    <button
                      onClick={() => {
                        onNavigateTab('scanner');
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Scan className="w-4 h-4" />
                      <span>{trans.launchCropScanner}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {activeSection === 'marketplace' && onNavigateTab && (
                    <button
                      onClick={() => {
                        onNavigateTab('marketplace');
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{trans.exploreMarketplace}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {activeSection === 'listing' && onNavigateTab && (
                    <button
                      onClick={() => {
                        onNavigateTab('marketplace');
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{trans.listNewCrop}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{trans.farmerHelplineLabel}</span>
            <span className="font-bold text-emerald-700">{trans.helplineNumber}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleShareOnWhatsApp}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{trans.shareOnWhatsAppBtn}</span>
            </button>

            <button
              id="user-manual-cancel-btn"
              onClick={() => {
                if (isPlayingAudio) window.speechSynthesis.cancel();
                onClose();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 hover:text-slate-900 border border-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              aria-label="Cancel"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>{trans.cancelBtn || trans.closeBtn || 'Cancel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
