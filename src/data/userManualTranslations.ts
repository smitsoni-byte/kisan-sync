export interface ManualStep {
  num: string;
  title: string;
  desc: string;
  extra?: string;
}

export interface ManualSectionContent {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  description: string;
  steps: ManualStep[];
  keyPoints: string[];
  audioText: string;
  extraContent?: {
    heading: string;
    items: string[];
  }[];
}

export interface ManualFAQItem {
  q: string;
  a: string;
}

export interface ManualTranslation {
  modalTitle: string;
  versionBadge: string;
  modalSubtitle: string;
  shareWhatsApp: string;
  preparingPdf: string;
  sharePdfWhatsApp: string;
  sharePdfWhatsAppDesc: string;
  downloadBtn: string;
  selectFormat: string;
  printPdf: string;
  printPdfDesc: string;
  textGuide: string;
  textGuideDesc: string;
  copied: string;
  copy: string;
  copiedToastTitle: string;
  copiedToastDesc: string;
  shareBarPrompt: string;
  shareOnWhatsAppBtn: string;
  closeBtn: string;
  cancelBtn: string;
  listenBtn: string;
  playingBtn: string;
  farmerHelplineLabel: string;
  helplineNumber: string;
  faqSectionTitle: string;
  faqHeading: string;
  faqs: ManualFAQItem[];
  launchCropScanner: string;
  exploreMarketplace: string;
  listNewCrop: string;
  sections: {
    quickstart: ManualSectionContent;
    search: ManualSectionContent;
    analyzer: ManualSectionContent;
    marketplace: ManualSectionContent;
    listing: ManualSectionContent;
    languages: ManualSectionContent;
    faq: ManualSectionContent;
  };
  fullManualText: string;
}

export const USER_MANUAL_TRANSLATIONS: Record<string, ManualTranslation> = {
  hi: {
    modalTitle: 'किसानसिंक उपयोगकर्ता मार्गदर्शिका',
    versionBadge: 'v2.5 आधिकारिक',
    modalSubtitle: 'एआई फसल रोग निदान, सीधी नीलामी मंडी और 22+ भाषाओं की संपूर्ण जानकारी',
    shareWhatsApp: 'व्हाट्सएप शेयर',
    preparingPdf: 'PDF तैयार हो रही है...',
    sharePdfWhatsApp: 'व्हाट्सएप PDF शेयर',
    sharePdfWhatsAppDesc: 'सीधे किसान भाइयों और व्हाट्सएप ग्रुप में भेजें',
    downloadBtn: 'डाउनलोड',
    selectFormat: 'डाउनलोड प्रारूप चुनें',
    printPdf: 'प्रिंट / PDF डाउनलोड',
    printPdfDesc: 'रंगबिरंगी प्रिंटेबल PDF गाइड',
    textGuide: 'टेक्स्ट फाइल (.txt)',
    textGuideDesc: 'ऑफ़लाइन पढ़ने के लिए सुरक्षित करें',
    copied: 'कॉपी हो गया!',
    copy: 'कॉपी करें',
    copiedToastTitle: 'मार्गदर्शिका क्लिपबोर्ड पर कॉपी हो गई!',
    copiedToastDesc: 'आप इसे व्हाट्सएप या नोट्स में पेस्ट कर सकते हैं।',
    shareBarPrompt: 'इस मार्गदर्शिका की PDF किसान ग्रुप में साझा करें:',
    shareOnWhatsAppBtn: 'व्हाट्सएप पर शेयर करें',
    closeBtn: 'समझ आ गया',
    cancelBtn: 'रद्द करें',
    listenBtn: 'बोलकर सुनें',
    playingBtn: 'आवाज जारी...',
    farmerHelplineLabel: '२४/७ किसान हेल्पलाइन:',
    helplineNumber: '1800-KISAN-SYNC (1800-547-267) - टोल-फ्री',
    faqSectionTitle: '६. प्रश्नोत्तरी और सहायता (FAQ)',
    faqHeading: 'अक्सर पूछे जाने वाले प्रश्न',
    launchCropScanner: 'एआई फसल स्कैनर खोलें',
    exploreMarketplace: 'लाइव नीलामी मंडी देखें',
    listNewCrop: 'नई फसल लिस्ट करें (+)',
    faqs: [
      {
        q: 'यदि कैमरा चालू न हो तो क्या करें?',
        a: 'ब्राउज़र सेटिंग्स में जाकर कैमरा अनुमति को "Allow" करें, या सीधे "गैलरी से अपलोड करें" बटन दबाकर मोबाइल से ली गई फोटो अपलोड करें।'
      },
      {
        q: 'क्या फोटो धुंधली होने पर एआई सही निदान देगा?',
        a: 'किसानसिंक में "ज़ीरो हैलुसिनेशन" नियम लागू है। यदि फोटो स्पष्ट नहीं है, तो सिस्टम अनुमान लगाने के बजाय स्पष्ट फोटो लेने की चेतावनी देगा।'
      },
      {
        q: 'फसल बिकने के बाद भुगतान कब मिलता है?',
        a: 'व्यापारी द्वारा माल प्राप्त करने और गुणवत्ता सत्यापन के तुरंत बाद एस्क्रो खाते से सीधे आपके बैंक खाते में भुगतान जारी किया जाता है।'
      },
      {
        q: '२४ घंटे किसान हेल्पलाइन नंबर क्या है?',
        a: 'टोल-फ्री हेल्पलाइन: 1800-KISAN-SYNC (1800-547-267) पर कभी भी संपर्क कर सकते हैं।'
      }
    ],
    sections: {
      quickstart: {
        id: 'quickstart',
        tabLabel: 'त्वरित शुरुआत (Quick Start)',
        title: 'किसानों के लिए स्मार्ट एआई कृषि मंच',
        subtitle: '३ आसान चरणों में किसानसिंक का उपयोग करें',
        description: 'किसानसिंक किसानों और प्रमाणित खरीदारों के बीच बिना बिचौलियों के सीधा सेतु बनाता है। एआई द्वारा फसल के रोग की तुरंत जांच करें और अपनी उपज का बेहतरीन मूल्य पाएं।',
        audioText: 'त्वरित शुरुआत। ३ सरल चरणों में किसानसिंक का उपयोग करें। १: फसल स्कैन करें। २: जैविक और रासायनिक उपचार पर्ची पाएं। ३: सीधी बोली मंडी में ऊंची कीमत पर बेचें।',
        steps: [
          {
            num: '१',
            title: 'फसल स्कैन करें',
            desc: 'पत्ती या फल की फोटो कैमरे से खींचें या अपलोड करें। एआई तुरंत रोग की पहचान कर ० से १०० गुणवत्ता स्कोर देगा।'
          },
          {
            num: '२',
            title: 'उपचार और पर्ची प्राप्त करें',
            desc: 'जैविक उपाय और सटीक रासायनिक कवकनाशी की मात्रा (प्रति लीटर पानी) देखें और व्हाट्सएप पर साझा करें।'
          },
          {
            num: '३',
            title: 'सीधी नीलामी में बेचें',
            desc: '१-क्लिक में एआई गुणवत्ता प्रमाण पत्र (Grade A+/A) के साथ फसल लिस्ट करें और देश भर के व्यापारियों से ऊंची बोली पाएं।'
          }
        ],
        keyPoints: ['शून्य बिचौलिया कमीशन', '९६%+ एआई रोग निदान सटीकता', '२२+ भारतीय भाषाओं में समर्थन']
      },
      search: {
        id: 'search',
        tabLabel: '१. स्मार्ट वॉइस सर्च',
        title: 'बोलकर या लिखकर खेती का कोई भी प्रश्न पूछें',
        subtitle: 'मॉड्यूल १: स्मार्ट वॉइस सर्च और २४/७ कृषि सहायक',
        description: 'फसल के रोग, खाद की मात्रा, सरकारी सब्सिडी, आज के मंडी भाव या सिंचाई के बारे में तुरंत सटीक वैज्ञानिक मार्गदर्शन प्राप्त करें।',
        audioText: 'स्मार्ट वॉइस सर्च। माइक्रोफोन बटन दबाकर अपनी मातृभाषा में खेती का प्रश्न बोलें। सिस्टम आपकी आवाज को पहचानकर तुरंत सही वैज्ञानिक सलाह देगा।',
        steps: [
          {
            num: '१',
            title: 'वॉइस इनपुट (Voice Query)',
            desc: 'सर्च बार में दिए गए माइक्रोफोन (🎤) बटन पर क्लिक करके अपनी भाषा में प्रश्न बोलें।'
          },
          {
            num: '२',
            title: 'स्वचालित पाठ रूपांतरण',
            desc: 'सिस्टम आपकी आवाज को तुरंत सटीक पाठ में बदलता है। आवश्यकतानुसार आप इसे संपादित भी कर सकते हैं।'
          },
          {
            num: '३',
            title: 'ऑडियो प्लेबैक',
            desc: '"बोलकर सुनें" बटन दबाकर संपूर्ण कृषि सलाह को अपनी भाषा में स्पष्ट सुन सकते हैं।'
          },
          {
            num: '४',
            title: 'व्हाट्सएप साझाकरण',
            desc: '१-क्लिक में संरचित कृषि सलाह को अन्य किसान भाइयों और समूहों में साझा करें।'
          }
        ],
        keyPoints: ['२४ घंटे एआई कृषि परामर्श', 'ICAR और कृषि विश्वविद्यालयों द्वारा प्रमाणित', '२२+ क्षेत्रीय भाषाओं में ऑडियो']
      },
      analyzer: {
        id: 'analyzer',
        tabLabel: '२. एआई फसल जांच',
        title: 'कैमरे और फोटो द्वारा फसल रोग का सटीक विश्लेषण',
        subtitle: 'मॉड्यूल २: एआई फसल स्वास्थ्य एवं रोग निदान स्कैनर',
        description: 'खेत में खड़ी पत्ती, तने या फल की स्पष्ट फोटो लेकर रोग, फंगस, कीट या पोषक तत्वों की कमी सेकंडों में पहचानें और ६-सूत्रीय रिपोर्ट प्राप्त करें।',
        audioText: 'मॉड्यूल २: एआई फसल रोग निदान। कैमरे से फोटो खींचें या अपलोड करें। एआई तुरंत रोग पहचानकर ६-सूत्रीय संपूर्ण कृषि रिपोर्ट प्रदान करेगा।',
        steps: [
          {
            num: '१',
            title: 'वानस्पतिक पहचान (Botanical ID)',
            desc: 'पौधे का वैज्ञानिक नाम और प्रभावित भाग (पत्ती, फल या तना) की सटीक पहचान।'
          },
          {
            num: '२',
            title: 'रोग का निदान (Pathogen Diagnosis)',
            desc: 'फफूंद, वायरस, बैक्टीरिया या पोषक तत्व की कमी की पहचान सटीकता प्रतिशत के साथ।'
          },
          {
            num: '३',
            title: 'एआई गुणवत्ता अंक (Quality Score)',
            desc: '० से १०० गुणवत्ता स्कोर और निर्यात ग्रेड (Grade A+, A, B+)।'
          },
          {
            num: '४',
            title: 'दिखाई देने वाले लक्षण (Symptoms)',
            desc: 'पत्ती पर धब्बे, पीलापन, झुलसा या सड़न के मुख्य दृश्य लक्षण।'
          },
          {
            num: '५',
            title: 'अनुशंसित उपचार योजना',
            desc: 'नीम तेल व ट्राइकोडर्मा जैविक उपाय + सटीक रासायनिक स्प्रे (मिली/ग्राम प्रति लीटर पानी)।'
          },
          {
            num: '६',
            title: 'वैज्ञानिक सावधानियां',
            desc: 'ICAR और कृषि दिशानिर्देशों के अनुसार सुरक्षा व छिड़काव सावधानियां।'
          }
        ],
        keyPoints: ['ज़ीरो हैलुसिनेशन नीति', 'जैविक और रासायनिक दोहरा उपचार', 'सीधा मंडी गुणवत्ता प्रमाणन']
      },
      marketplace: {
        id: 'marketplace',
        tabLabel: '३. बोली मंडी',
        title: 'शून्य बिचौलिया, लाइव नीलामी और पारदर्शी भाव',
        subtitle: 'मॉड्यूल ३: सीधा बोली व्यापार मंच',
        description: 'प्रमाणित किसान और थोक व्यापारी/प्रोसेसिंग मिलें बिना किसी दलाल के सीधे ऑनलाइन बोली लगाते हैं। किसान को मिलता है अपनी मेहनत का सर्वश्रेष्ठ दाम।',
        audioText: 'मॉड्यूल ३: लाइव नीलामी बोली मंडी। शून्य बिचौलिया कटौती के साथ किसान और व्यापारी के बीच पारदर्शी नीलामी और सुरक्षित एस्क्रो भुगतान।',
        steps: [
          {
            num: '१',
            title: 'लॉट ब्राउज़ करें',
            desc: 'एआई गुणवत्ता ग्रेड, नमी का प्रतिशत और वर्तमान उच्चतम बोली देखें।'
          },
          {
            num: '२',
            title: 'त्वरित बोली चिप्स',
            desc: 'त्वरित वृद्धि चिप्स (+₹100, +₹250, +₹500/क्विंटल) से तुरंत बोली लगाएं या मनचाही राशि दर्ज करें।'
          },
          {
            num: '३',
            title: 'पारदर्शी लाइव लेजर',
            desc: 'सभी बोलियां समय और व्यापारी के सत्यापित बैज के साथ लाइव लेजर में दर्ज होती हैं।'
          },
          {
            num: '४',
            title: 'एस्क्रो भुगतान गारंटी',
            desc: 'नीलामी समाप्त होने पर उच्चतम बोलीदाता के साथ सुरक्षित सौदा और माल प्राप्ति पर भुगतान।'
          }
        ],
        keyPoints: ['०% दलाली कमीशन', 'पारदर्शी टाइमर नीलामी', 'सुरक्षित बैंक एस्क्रो ट्रांसफर']
      },
      listing: {
        id: 'listing',
        tabLabel: '४. फसल लिस्ट करना',
        title: 'अपनी फसल को ऑनलाइन नीलामी मंडी में रखें',
        subtitle: 'मॉड्यूल ४: नई फसल लॉट लिस्ट करने की विधि',
        description: 'सिर्फ २ मिनट में अपनी कटी हुई फसल को नीलामी के लिए लिस्ट करें और देश भर के खरीदारों से प्रतिस्पर्धी बोलियां पाएं।',
        audioText: 'मॉड्यूल ४: फसल लिस्ट करना। फसल का नाम, मात्रा, न्यूनतम आधार मूल्य और नमी भरकर २ मिनट में अपनी फसल लाइव नीलामी में जोड़ें।',
        steps: [
          {
            num: '१',
            title: 'फसल का नाम और किस्म',
            desc: 'फसल चुनें (जैसे शरबती गेहूं, संकर कपास, देसी चना, जीरा, टमाटर आदि)।'
          },
          {
            num: '२',
            title: 'मात्रा (क्विंटल में)',
            desc: 'उपलब्ध कुल वजन क्विंटल में दर्ज करें (१ क्विंटल = १०० किलोग्राम)।'
          },
          {
            num: '३',
            title: 'न्यूनतम आधार मूल्य (₹/क्विंटल)',
            desc: 'नीलामी शुरू करने के लिए अपना न्यूनतम रिज़र्व मूल्य निर्धारित करें।'
          },
          {
            num: '४',
            title: 'नमी और एआई प्रमाणन',
            desc: 'अनाज में १०-१२% नमी आदर्श होती है। एआई गुणवत्ता स्कोर अपने आप जुड़ जाएगा।'
          }
        ],
        keyPoints: ['त्वरित २ मिनट में लिस्टिंग', 'सत्यापित किसान बैज', 'अखिल भारतीय खरीदार पहुंच']
      },
      languages: {
        id: 'languages',
        tabLabel: '५. २२+ भाषाएं',
        title: 'हर भारतीय किसान के लिए अपनी मातृभाषा का अनुभव',
        subtitle: 'मॉड्यूल ५: भारत की २२+ अनुसूचित भाषाएं',
        description: 'हिंदी, गुजराती, पंजाबी, मराठी, तेलुगु, तमिल, बंगाली, कन्नड़, मलयालम, उड़िया, असमिया, भोजपुरी, मारवाड़ी सहित सभी भाषाओं में पूर्ण समर्थन।',
        audioText: 'मॉड्यूल ५: भारत की २२ भाषाओं में पूर्ण समर्थन। ऊपर दिए गए ग्लोब बटन से कभी भी अपनी मनपसंद भाषा चुनें।',
        steps: [
          {
            num: '१',
            title: 'ग्लोब 🌐 बटन दबाएं',
            desc: 'शीर्ष नेविगेशन बार में स्थित भाषा चयनकर्ता (ग्लोब 🌐) पर क्लिक करें।'
          },
          {
            num: '२',
            title: 'अपनी भाषा चुनें',
            desc: 'अपनी क्षेत्रीय भाषा या बोली को सूची से चुनें या खोजें।'
          },
          {
            num: '३',
            title: 'तत्काल रूपांतरण',
            desc: 'पूरा इंटरफ़ेस, एआई रोग निदान और मंडी भाव बिना किसी देरी के आपकी भाषा में बदल जाएंगे।'
          }
        ],
        keyPoints: ['२२ आधिकारिक भाषाएं', 'स्थानीय कृषि शब्दावली (मंडी, क्विंटल, बोली)', '१००% स्पष्ट यूनिकोड फॉन्ट']
      },
      faq: {
        id: 'faq',
        tabLabel: '६. प्रश्नोत्तरी (FAQ)',
        title: 'अक्सर पूछे जाने वाले प्रश्न और निवारण',
        subtitle: 'मॉड्यूल ६: किसान सहायता एवं तकनीकी समाधान',
        description: 'कैमरा उपयोग, एआई निदान की सत्यता और नीलामी भुगतान से जुड़े सभी मुख्य प्रश्नों के स्पष्ट उत्तर।',
        audioText: 'मॉड्यूल ६: प्रश्नोत्तरी और सहायता। कैमरा अनुमति दें। ज़ीरो हैलुसिनेशन नीति। २४ घंटे टोल-फ्री किसान हेल्पलाइन 1800-547-267।',
        steps: [
          {
            num: 'प्र.१',
            title: 'यदि कैमरा न खुले तो क्या करें?',
            desc: 'ब्राउज़र में कैमरा अनुमति "Allow" करें या गैलरी बटन से सीधे फोटो अपलोड करें।'
          },
          {
            num: 'प्र.२',
            title: 'क्या एआई धुंधली फोटो पर अनुमान लगाता है?',
            desc: 'नहीं, किसानसिंक में ज़ीरो हैलुसिनेशन नियम है। धुंधली फोटो पर पुनः स्पष्ट फोटो लेने का निर्देश दिया जाता है।'
          },
          {
            num: 'प्र.३',
            title: 'भुगतान की सुरक्षा कैसे होती है?',
            desc: 'खरीदार द्वारा माल प्राप्त और सत्यापित करने के तुरंत बाद एस्क्रो से सुरक्षित बैंक ट्रांसफर होता है।'
          }
        ],
        keyPoints: ['टोल-फ्री किसान सहायता', 'सुरक्षित एस्क्रो भुगतान', 'सत्यापित एआई पैथोलॉजी']
      }
    },
    fullManualText: `==============================================================================
   किसानसिंक (KisanSync) - आधिकारिक उपयोगकर्ता मार्गदर्शिका v2.5
   एआई फसल रोग निदान • सीधी नीलामी बोली मंडी • २२+ भारतीय भाषाएं
==============================================================================

[१] त्वरित शुरुआत (QUICK START GUIDE)
------------------------------------------------------------------------------
१. फसल स्कैन करें: 
   कैमरे से पत्ती का फोटो लें या अपलोड करें। एआई तुरंत रोग पहचानकर गुणवत्ता अंक देगा।
२. उपचार पर्ची प्राप्त करें:
   जैविक उपाय और रासायनिक कीटनाशक का सटीक प्रति लीटर डोज देखें और साझा करें।
३. सीधी नीलामी में बेचें:
   १-क्लिक में एआई प्रमाण पत्र (Grade A+/A) के साथ फसल लिस्ट करें और ऊंची बोली पाएं।

[२] मॉड्यूल १: स्मार्ट वॉइस सर्च & २४/७ कृषि सहायक
------------------------------------------------------------------------------
• वॉइस सर्च: सर्च बार में माइक्रोफ़ोन (🎤) बटन दबाकर अपनी भाषा में प्रश्न पूछें।
• बोलकर सुनें: "बोलकर सुनें" बटन दबाने से पूरा उत्तर स्पष्ट आवाज में सुनाई देगा।
• व्हाट्सएप शेयर: संरचित सलाह सीधे किसान ग्रुप में साझा करें।

[३] मॉड्यूल २: एआई फसल रोग निदान (६-सूत्रीय रिपोर्ट)
------------------------------------------------------------------------------
१. वानस्पतिक पहचान: पौधे का वैज्ञानिक नाम और प्रभावित भाग।
२. रोग का निदान: फंगस, वायरस, बैक्टीरिया या पोषक तत्वों की कमी।
३. एआई गुणवत्ता अंक: ० से १०० स्कोर और निर्यात ग्रेड (A+, A, B+)।
४. दिखाई देने वाले लक्षण: पत्ती के धब्बे, पीलापन या झुलसा की स्थिति।
५. अनुशंसित उपचार: नीम तेल/ट्राइकोडर्मा जैविक उपाय + अनुशंसित रासायनिक डोज।
६. वैज्ञानिक सावधानियां: ICAR कृषि दिशानिर्देशों के अनुसार सुरक्षा उपाय।

[४] मॉड्यूल ३: सीधी नीलामी बोली मंडी
------------------------------------------------------------------------------
• शून्य बिचौलिया कटौती: किसान और प्रमाणित व्यापारियों के बीच सीधा सौदा।
• त्वरित वृद्धि चिप्स: +₹100, +₹250, +₹500 प्रति क्विंटल की त्वरित बोली।
• पारदर्शी लाइव लेजर: सभी बोलियों का समयबद्ध ऑडिट रिकॉर्ड।
• एस्क्रो भुगतान गारंटी: माल की डिलीवरी और जांच पर सुरक्षित भुगतान।

[५] मॉड्यूल ४: नई फसल लिस्ट करने की विधि
------------------------------------------------------------------------------
• फसल का नाम और किस्म (जैसे शरबती गेहूं, संकर कपास, देसी चना)।
• उपलब्ध मात्रा (क्विंटल में, १ क्विंटल = १०० किलो)।
• न्यूनतम आधार मूल्य (Reserve Price ₹/क्विंटल)।
• नमी का प्रतिशत (सामान्यतः १०-१२%)।
• एआई गुणवत्ता प्रमाण पत्र का स्वतः जुड़ाव।

[६] मॉड्यूल ५: २२+ भारतीय क्षेत्रीय भाषाएं
------------------------------------------------------------------------------
हिंदी, ગુજરાતી, English, ਪੰਜਾਬੀ, मराठी, తెలుగు, தமிழ், বাংলা, ಕನ್ನಡ, മലയാളം, 
ଓଡ଼ିଆ, असमिया, भोजपुरी, मारवाड़ी सहित सभी अनुसूचित भाषाओं में पूर्ण समर्थन।

[७] किसान सहायता एवं संपर्क
------------------------------------------------------------------------------
• टोल-फ्री किसान हेल्पलाइन: 1800-KISAN-SYNC (1800-547-267)
• ईमेल: support@kisansync.gov.in / help@kisansync.ai
• पोर्टल: https://kisansync.ai

==============================================================================
   किसानसिंक: भारतीय किसानों के लिए एआई तकनीक और खुले बाजार की शक्ति
==============================================================================`
  },

  gu: {
    modalTitle: 'કિસાનસિંક વપરાશકર્તા માર્ગદર્શિકા',
    versionBadge: 'v2.5 સત્તાવાર',
    modalSubtitle: 'એઆઈ પાક નિદાન, ડાયરેક્ટ બિડિંગ માર્કેટપ્લેસ અને ૨૨+ ભાષાઓની સંપૂર્ણ માહિતી',
    shareWhatsApp: 'વોટ્સએપ શેર',
    preparingPdf: 'PDF તૈયાર થઈ રહી છે...',
    sharePdfWhatsApp: 'વોટ્સએપ PDF શેર',
    sharePdfWhatsAppDesc: 'સીધું ખેડૂત મિત્રો અને વોટ્સએપ ગ્રૂપમાં મોકલો',
    downloadBtn: 'ડાઉનલોડ',
    selectFormat: 'ડાઉનલોડ ફોર્મેટ પસંદ કરો',
    printPdf: 'પ્રિન્ટ / PDF ડાઉનલોડ',
    printPdfDesc: 'રંગબેરંગી પ્રિન્ટેબલ PDF માર્ગદર્શિકા',
    textGuide: 'ટેક્સ્ટ ફાઈલ (.txt)',
    textGuideDesc: 'ઓફલાઇન વાંચવા માટે સેવ કરો',
    copied: 'કોપી થઈ ગયું!',
    copy: 'કોપી કરો',
    copiedToastTitle: 'માર્ગદર્શિકા ક્લિપબોર્ડ પર કોપી થઈ ગઈ!',
    copiedToastDesc: 'તમે તેને વોટ્સએપ અથવા નોંધમાં પેસ્ટ કરી શકો છો.',
    shareBarPrompt: 'આ માર્ગદર્શિકાની PDF ખેડૂત ગ્રૂપમાં શેર કરો:',
    shareOnWhatsAppBtn: 'વોટ્સએપ પર શેર કરો',
    closeBtn: 'સમજાઈ ગયું',
    cancelBtn: 'રદ કરો',
    listenBtn: 'બોલીને સાંભળો',
    playingBtn: 'વાંચન ચાલુ...',
    farmerHelplineLabel: '૨૪/૭ કિસાન હેલ્પલાઇન:',
    helplineNumber: '1800-KISAN-SYNC (1800-547-267) - ટોલ-ફ્રી',
    faqSectionTitle: '૬. પ્રશ્નોત્તરી અને સહાય (FAQ)',
    faqHeading: 'વારંવાર પૂછાતા પ્રશ્નો',
    launchCropScanner: 'AI પાક સ્કેનર ખોલો',
    exploreMarketplace: 'લાઈવ માર્કેટપ્લેસ જુઓ',
    listNewCrop: 'નવો પાક લિસ્ટ કરો (+)',
    faqs: [
      {
        q: 'જો કેમેરા ચાલુ ન થાય તો શું કરવું?',
        a: 'બ્રાઉઝર સેટિંગ્સમાં જઈને કેમેરાની પરમિશન "Allow" કરો, અથવા સીધું "ગેલેરી" બટન દબાવીને મોબાઇલથી પાડેલો ફોટો અપલોડ કરો.'
      },
      {
        q: 'ફોટો ઝાંખો હોય તો AI સાચું નિદાન આપશે?',
        a: 'કિસાનસિંક એઆઈમાં "Zero Hallucination" નિયમ લાગુ છે. જો ફોટો સ્પષ્ટ ન હોય તો તે ચેતવણી આપશે અને અંદાજિત અનુમાન નહીં લગાવે.'
      },
      {
        q: 'માલ વેચાયા પછી પૈસા ક્યારે મળે છે?',
        a: 'વેપારી દ્વારા માલ પ્રાપ્ત થયા અને ગુણવત્તા ચકાસાયા પછી તાત્કાલિક એસ્ક્રો ખાતામાંથી સીધા બેંક ખાતામાં જમા થાય છે.'
      },
      {
        q: '૨૪ કલાક ખેડૂત હેલ્પલાઇન નંબર શું છે?',
        a: 'ટોલ-ફ્રી ખેડૂત હેલ્પલાઇન: 1800-KISAN-SYNC (1800-547-267) પર સંપર્ક કરી શકો છો.'
      }
    ],
    sections: {
      quickstart: {
        id: 'quickstart',
        tabLabel: 'ઝડપી શરૂઆત (Quick Start)',
        title: 'ખેડૂતો માટે સ્માર્ટ એઆઈ કૃષિ પ્લેટફોર્મ',
        subtitle: '૩ સરળ પગલાંમાં કિસાનસિંકનો ઉપયોગ કરો',
        description: 'કિસાનસિંક એ ખેડૂત અને વેપારી વચ્ચે કોઈ પણ વચેટીયા વગર સીધો સેતુ સ્થાપે છે. પાકના રોગનું એઆઈ દ્વારા ત્વરિત નિદાન મેળવો અને પ્રમાણિત ગુણવત્તા સાથે ખુલ્લા બજારમાં ઊંચા ભાવે માલ વેચો.',
        audioText: 'ઝડપી શરૂઆત. ૩ સરળ પગલાંમાં કિસાનસિંકનો ઉપયોગ કરો. ૧: પાક સ્કેન કરો. ૨: ઉપચાર પ્રિસ્ક્રિપ્શન મેળવો. ૩: ડાયરેક્ટ બિડિંગમાં વેચો.',
        steps: [
          {
            num: '૧',
            title: 'પાક સ્કેન કરો',
            desc: 'કેમેરાથી પાંદડાનો ફોટો પાડો અથવા અપલોડ કરો. AI સેલ્યુલર ટેક્ષ્ચર સ્કેન કરી રોગ ઓળખશે.'
          },
          {
            num: '૨',
            title: 'ઉપચાર & પ્રિસ્ક્રિપ્શન મેળવો',
            desc: 'જૈવિક અને વૈજ્ઞાનિક દવાનો છંટકાવ (ડોઝ પ્રતિ લીટર) જુઓ અને વોટ્સએપ પર શેર કરો.'
          },
          {
            num: '૩',
            title: 'ડાયરેક્ટ બિડિંગમાં વેચો',
            desc: '૧-ક્લિકમાં AI સર્ટિફિકેટ (Grade A+/A) સાથે માલ લિસ્ટ કરો અને વેપારીઓની લાઈવ બોલીથી ઊંચો ભાવ મેળવો.'
          }
        ],
        keyPoints: ['ઝીરો વચેટીયા કમિશન', '૯૬%+ એઆઈ સચોટતા', '૨૨+ ભારતીય પ્રાદેશિક ભાષાઓ']
      },
      search: {
        id: 'search',
        tabLabel: '૧. સ્માર્ટ વોઇસ સર્ચ',
        title: 'બોલીને કે ટાઈપ કરીને ખેતીનો કોઈપણ પ્રશ્ન પૂછો',
        subtitle: 'મોડ્યુલ ૧: સ્માર્ટ વોઇસ સર્ચ & ૨૪/૭ કૃષિ સહાયક',
        description: 'પાકના રોગ, ખાતરનું પ્રમાણ, સરકારી સબસિડી, આજના મંડી ભાવ કે પિયત વિશે ત્વરિત અને સચોટ વૈજ્ઞાનિક માર્ગદર્શન મેળવો.',
        audioText: 'સ્માર્ટ વોઇસ સર્ચ. માઇક્રોફોન બટન દબાવીને તમારી માતૃભાષામાં પ્રશ્ન પૂછો. સિસ્ટમ તમારા અવાજને ઓળખીને તાત્કાલિક સાચો જવાબ આપશે.',
        steps: [
          {
            num: '૧',
            title: 'વોઇસ ઇનપુટ (Voice Query)',
            desc: 'સર્ચ બારમાં માઇક્રોફોન (🎤) બટન દબાવીને તમારી માતૃભાષામાં પ્રશ્ન બોલો.'
          },
          {
            num: '૨',
            title: 'ઓટોમેટિક ટેક્સ્ટ',
            desc: 'સિસ્ટમ તમારા અવાજને વાંચીને આપમેળે લખાણમાં ફેરવે છે.'
          },
          {
            num: '૩',
            title: 'ઓડિયો પ્લેબેક',
            desc: '"🔊 બોલીને સાંભળો" બટન દબાવવાથી તમામ જવાબો સ્પષ્ટ અવાજમાં વંચાશે.'
          },
          {
            num: '૪',
            title: 'વોટ્સએપ શેરિંગ',
            desc: '૧-ક્લિકમાં સંપૂર્ણ કૃષિ પ્રિસ્ક્રિપ્શન અન્ય ખેડૂત મિત્રો સાથે શેર કરો.'
          }
        ],
        keyPoints: ['૨૪ કલાક AI કૃષિ પરામર્શ', 'ICAR અને માન્ય યુનિવર્સિટી આધારિત સલાહ', '૨૨+ પ્રાદેશિક ભાષાઓમાં ઓડિયો સપોર્ટ']
      },
      analyzer: {
        id: 'analyzer',
        tabLabel: '૨. AI પાક નિદાન',
        title: 'કેમેરા અને ફોટો વડે પાકના રોગનું સચોટ વિશ્લેષણ',
        subtitle: 'મોડ્યુલ ૨: AI પાક આરોગ્ય નિદાન સ્કેનર',
        description: 'ખેતરમાં ઉભેલા પાંદડા કે ફળનો ફોટો પાડીને રોગ, ફૂગ, જીવાત કે પોષક તત્વોની ખામી સેકન્ડોમાં શોધો અને ૬-મુદ્દાનું પ્રિસ્ક્રિપ્શન મેળવો.',
        audioText: 'મોડ્યુલ ૨: AI પાક આરોગ્ય નિદાન. કેમેરાથી પાંદડાનો ફોટો પાડો. AI સેલ્યુલર ટેક્ષ્ચર સ્કેન કરી રોગ અને ૬-મુદ્દાનું પ્રિસ્ક્રિપ્શન આપશે.',
        steps: [
          {
            num: '૧',
            title: 'પાકની ઓળખ (Botanical ID)',
            desc: 'વનસ્પતિનું વૈજ્ઞાનિક નામ અને છોડના અસરગ્રસ્ત ભાગની ઓળખ.'
          },
          {
            num: '૨',
            title: 'રોગનું નિદાન (Pathogen Diagnosis)',
            desc: 'ફૂગ, વાયરસ, બેક્ટેરિયા કે પોષક તત્વોની ખામી ચોકસાઈ ટકાવારી સાથે.'
          },
          {
            num: '૩',
            title: 'AI ગુણવત્તા સ્કોર (Quality Score)',
            desc: '૦ થી ૧૦૦ ગુણવત્તા સ્કોર અને ગ્રેડિંગ (Grade A+, A, B+).'
          },
          {
            num: '૪',
            title: 'જોવા મળેલા લક્ષણો (Symptoms)',
            desc: 'પાંદડાના કુંડાળા, પીળાશ કે ડાઘની સચોટ પેટર્ન.'
          },
          {
            num: '૫',
            title: 'ભલામણ કરેલ ઉપચાર',
            desc: 'જૈવિક લીમડાનું તેલ/ટ્રાઇકોડર્મા + માન્ય કેમિકલ દવા (મિલી/ગ્રામ પ્રતિ લીટર).'
          },
          {
            num: '૬',
            title: 'વૈજ્ઞાનિક સાવચેતી',
            desc: 'હવામાન મુજબ છંટકાવની સાવચેતી અને ICAR માર્ગદર્શિકા મુજબની સલામતી સૂચનાઓ.'
          }
        ],
        keyPoints: ['ઝીરો હેલ્યુસિનેશન નિયમ', 'જૈવિક અને વૈજ્ઞાનિક બેવડા ઉપચાર', 'સીધું માર્કેટપ્લેસ લિસ્ટિંગ']
      },
      marketplace: {
        id: 'marketplace',
        tabLabel: '૩. બિડિંગ બજાર',
        title: 'ઝીરો વચેટીયા, લાઈવ હરાજી અને પારદર્શક ભાવ',
        subtitle: 'મોડ્યુલ ૩: ઓપન બિડિંગ ટ્રેડિંગ માર્કેટપ્લેસ',
        description: 'પ્રમાણિત ખેડૂતો અને મોટા વેપારીઓ/મિલો વચ્ચે સીધી ઓનલાઇન હરાજી. ખેડૂતને મળે છે પોતાના પાકના શ્રેષ્ઠ ભાવ.',
        audioText: 'મોડ્યુલ ૩: ઓપન બિડિંગ ટ્રેડિંગ માર્કેટપ્લેસ. ઝીરો વચેટીયા કમિશન સાથે ખેડૂત અને વેપારી વચ્ચે સીધી લાઈવ હરાજી.',
        steps: [
          {
            num: '૧',
            title: 'લાઈવ લોટ પસંદગી',
            desc: 'AI ગુણવત્તા સ્કોર (Grade A+/A), ભેજનું પ્રમાણ અને વર્તમાન સૌથી ઊંચી બોલી જુઓ.'
          },
          {
            num: '૨',
            title: 'ઝડપી બોલી (+₹૧૦૦, +₹૨૫૦, +₹૫૦૦)',
            desc: 'સરળ ચિપ્સ વડે ઝડપથી બોલી લગાવો અથવા પોતાની રકમ લખો.'
          },
          {
            num: '૩',
            title: 'ઓડિટ ટ્રેઇલ (Live Ledger)',
            desc: 'તમામ બોલીઓ સમય અને વેપારીના વેરિફાઈડ બેજ સાથે લાઈવ દેખાય છે.'
          },
          {
            num: '૪',
            title: 'એસ્ક્રો સુરક્ષા (Safe Settlement)',
            desc: 'હરાજી પૂર્ણ થતાં સૌથી ઊંચી બોલી લગાવનાર સાથે સુરક્ષિત સોદો.'
          }
        ],
        keyPoints: ['૦% વચેટીયા કમિશન', 'ઓપન ટાઈમર હરાજી', 'સુરક્ષિત બેંક ટ્રાન્સફર']
      },
      listing: {
        id: 'listing',
        tabLabel: '૪. પાક લિસ્ટ કરવો',
        title: 'તમારો પાક ઓનલાઇન બજારમાં મૂકો',
        subtitle: 'મોડ્યુલ ૪: નવો પાક લિસ્ટ કરવાની પદ્ધતિ',
        description: 'માત્ર ૨ મિનિટમાં તમારા ખેતરનો પાક હરાજી માટે લિસ્ટ કરો અને દેશભરના વેપારીઓ પાસેથી બોલી મેળવો.',
        audioText: 'મોડ્યુલ ૪: નવો પાક લિસ્ટ કરવાની પદ્ધતિ. પાકનું નામ, જથ્થો, પ્રારંભિક ભાવ અને ભેજ ભરીને ૨ મિનિટમાં પાક લાઈવ મૂકો.',
        steps: [
          {
            num: '૧',
            title: 'પાક & જાત',
            desc: 'પાકનું નામ પસંદ કરો (દા.ત. શરબતી ઘઉં, કપાસ, જીરું, રોમા ટામેટા).'
          },
          {
            num: '૨',
            title: 'જથ્થો (ક્વિન્ટલમાં)',
            desc: 'ઉપલબ્ધ જથ્થો ક્વિન્ટલમાં લખો (૧ ક્વિન્ટલ = ૧૦૦ કિલોગ્રામ).'
          },
          {
            num: '૩',
            title: 'પ્રારંભિક ભાવ (Reserve Price ₹/qtl)',
            desc: 'હરાજી શરૂ કરવા માટે ન્યૂનતમ ભાવ નિર્ધારિત કરો.'
          },
          {
            num: '૪',
            title: 'ભેજ & સર્ટિફિકેશન',
            desc: 'ભેજનું પ્રમાણ (સામાન્ય રીતે ૧૦-૧૨%) અને AI સ્કેનરનો ક્વોલિટી સ્કોર જોડો.'
          }
        ],
        keyPoints: ['તાત્કાલિક લાઈવ લિસ્ટિંગ', 'વેરિફાઈડ ખેડૂત પ્રોફાઈલ', 'દેશવ્યાપી વેપારી પહોંચ']
      },
      languages: {
        id: 'languages',
        tabLabel: '૫. ૨૨+ ભાષાઓ',
        title: 'તમારી માતૃભાષામાં સરળ ખેતી',
        subtitle: 'મોડ્યુલ ૫: ૨૨+ માન્ય ભારતીય પ્રાદેશિક ભાષાઓ',
        description: 'ગુજરાતી, હિન્દી, પંજાબી, મરાઠી, તેલુગુ, તમિલ, બંગાળી, કન્નડ, મલયાલમ, ઓડિયા સહિત તમામ ૨૨ બંધારણીય ભાષાઓ ઉપલબ્ધ.',
        audioText: 'મોડ્યુલ ૫: ૨૨ બંધારણીય ભારતીય ભાષાઓમાં સંપૂર્ણ પ્લેટફોર્મ સપોર્ટ. ગ્લોબ બટનથી કોઈપણ સમયે ભાષા બદલો.',
        steps: [
          {
            num: '૧',
            title: 'ગ્લોબ આઇકન પર ક્લિક કરો',
            desc: 'ટોપ નેવબારમાં આપેલા ગ્લોબ આઇકન 🌐 બટન પર ક્લિક કરો.'
          },
          {
            num: '૨',
            title: 'ભાષા પસંદ કરો',
            desc: 'તમારી સ્થાનિક બોલી (ગુજરાતી, हिन्दी, ਪੰਜਾਬੀ, मराठी વગેરે) પસંદ કરો.'
          },
          {
            num: '૩',
            title: 'તાત્કાલિક રૂપાંતરણ',
            desc: 'સંપૂર્ણ એપ્લિકેશન, AI નિદાન અને માર્કેટપ્લેસ તરત જ તમારી ભાષામાં બદલાશે.'
          }
        ],
        keyPoints: ['૨૨ સત્તાવાર ભાષાઓ', 'સ્થાનિક કૃષિ પરિભાષા (મંડી, ક્વિન્ટલ, બોલી)', '૧૦૦% સચોટ ગુજરાતી યુનિકોડ']
      },
      faq: {
        id: 'faq',
        tabLabel: '૬. પ્રશ્નોત્તરી (FAQ)',
        title: 'વારંવાર પૂછાતા પ્રશ્નો અને ઉકેલ',
        subtitle: 'મોડ્યુલ ૬: ખેડૂત સહાય અને સમસ્યા નિવારણ',
        description: 'કિસાનસિંક પ્લેટફોર્મના ઉપયોગ, કેમેરા પરમિશન, AI સચોટતા અને નાણાકીય સુરક્ષા સંબંધિત મહત્વપૂર્ણ પ્રશ્નો.',
        audioText: 'મોડ્યુલ ૬: પ્રશ્નોત્તરી અને સહાય. કેમેરા પરમિશન આપો. ઝીરો હેલ્યુસિનેશન નિયમ. ટોલ-ફ્રી ખેડૂત હેલ્પલાઇન 1800-547-267.',
        steps: [
          {
            num: 'પ્ર.૧',
            title: 'જો કેમેરા ચાલુ ન થાય તો?',
            desc: 'બ્રાઉઝરમાં કેમેરાની પરમિશન "Allow" કરો, અથવા સીધું "ગેલેરી" બટન દબાવીને ફોટો અપલોડ કરો.'
          },
          {
            num: 'પ્ર.૨',
            title: 'ઝાંખા ફોટામાં AI સાચું નિદાન આપશે?',
            desc: 'ના, કિસાનસિંકમાં ઝીરો હેલ્યુસિનેશન નિયમ છે. સ્પષ્ટ ફોટો લેવા સૂચવશે.'
          },
          {
            num: 'પ્ર.૩',
            title: 'માલ વેચાયા પછી પૈસા ક્યારે મળે?',
            desc: 'માલ ચકાસાયા પછી તાત્કાલિક એસ્ક્રો ખાતામાંથી સીધા બેંક ખાતામાં જમા થાય છે.'
          }
        ],
        keyPoints: ['ટોલ-ફ્રી ખેડૂત હેલ્પલાઇન', 'સુરક્ષિત બેંકિંગ & એસ્ક્રો', 'પ્રમાણિત AI ડાયગ્નોસ્ટિક્સ']
      }
    },
    fullManualText: `==============================================================================
   કિસાનસિંક (KisanSync) - સત્તાવાર વપરાશકર્તા માર્ગદર્શિકા v2.5
   એઆઈ પાક આરોગ્ય નિદાન • ડાયરેક્ટ બિડિંગ હરાજી • ૨૨+ ભારતીય ભાષાઓ
==============================================================================

[૧] ઝડપી શરૂઆત (QUICK START GUIDE)
------------------------------------------------------------------------------
૧. પાક સ્કેન કરો: 
   કેમેરાથી પાંદડાનો ફોટો પાડો અથવા અપલોડ કરો. AI સેલ્યુલર ટેક્ષ્ચર સ્કેન કરી રોગ ઓળખશે.
૨. ઉપચાર & પ્રિસ્ક્રિપ્શન મેળવો:
   જૈવિક અને વૈજ્ઞાનિક દવાનો છંટકાવ (ડોઝ પ્રતિ લીટર) જુઓ અને વોટ્સએપ પર શેર કરો.
૩. ડાયરેક્ટ બિડિંગમાં વેચો:
   ૧-ક્લિકમાં AI સર્ટિફિકેટ (Grade A+/A) સાથે માલ લિસ્ટ કરો અને વેપારીઓની લાઈવ બોલીથી ઊંચો ભાવ મેળવો.

[૨] મોડ્યુલ ૧: સ્માર્ટ વોઇસ સર્ચ & ૨૪/૭ કૃષિ સહાયક
------------------------------------------------------------------------------
• વોઇસ સર્ચ: સર્ચ બારમાં આપેલા માઇક્રોફોન (🎤) બટન પર ક્લિક કરીને તમારી માતૃભાષામાં પ્રશ્ન પૂછો.
• ઓડિયો સલાહ: "🔊 બોલીને સાંભળો" બટન દબાવવાથી આખો જવાબ સ્પષ્ટ અવાજમાં વંચાશે.
• વોટ્સએપ શેરિંગ: સીધું ખેડૂત મિત્રો સાથે શેર કરવા માટે "Share" બટન વાપરો.

[૩] મોડ્યુલ ૨: AI પાક આરોગ્ય નિદાન સ્કેનર (૬-મુદ્દાનું કૃષિ નિદાન અહેવાલ)
------------------------------------------------------------------------------
૧. પાકની ઓળખ: વનસ્પતિનું વૈજ્ઞાનિક નામ અને છોડના અંગની ઓળખ.
૨. રોગનું નિદાન: ફૂગ, વાયરસ, બેક્ટેરિયા કે પોષક તત્વોની ખામી.
૩. AI ક્વોલિટી સ્કોર: ૦ થી ૧૦૦ ગુણવત્તા સ્કોર અને ગ્રેડિંગ (Grade A+, A, B+).
૪. જોવા મળેલા લક્ષણો: પાંદડાના કુંડાળા, પીળાશ કે ડાઘની વિગત.
૫. ભલામણ કરેલ ઉપચાર: લીમડાનું તેલ/ટ્રાઇકોડર્મા + ચોક્કસ કેમિકલ સ્પ્રે (પ્રતિ લીટર માપ).
૬. વૈજ્ઞાનિક સાવચેતી નોંધ: ICAR માર્ગદર્શિકા મુજબની સાવચેતી.

[૪] મોડ્યુલ ૩: ઓપન બિડિંગ ટ્રેડિંગ માર્કેટ (LIVE AUCTION MARKETPLACE)
------------------------------------------------------------------------------
• ઝીરો વચેટીયા કમિશન: ખેડૂત અને પ્રમાણિત વેપારી વચ્ચે સીધો સોદો.
• ક્વિક ઇન્ક્રીમેન્ટ ચિપ્સ: +₹૧૦૦, +₹૨૫૦, +₹૫૦૦ પ્રતિ ક્વિન્ટલની ઝડપી બોલી.
• પારદર્શક લેજર: તમામ બોલીઓનું ઓનલાઇન ઓડિટ ટ્રેઇલ.
• એસ્ક્રો ચુકવણી ગેરંટી: માલની ડિલિવરી સમયે સુરક્ષિત નાણાં ટ્રાન્સફર.

[૫] મોડ્યુલ ૪: નવો પાક લિસ્ટ કરવાની પદ્ધતિ
------------------------------------------------------------------------------
• પાકનું નામ & જાત (દા.ત. શરબતી ઘઉં, કપાસ, દેશી મગફળી, જીરું).
• ઉપલબ્ધ જથ્થો (ક્વિન્ટલમાં, ૧ ક્વિન્ટલ = ૧૦૦ કિલો).
• શરૂઆતની લઘુત્તમ બોલી (Reserve Price ₹/qtl).
• ભેજનું પ્રમાણ (Moisture % - સામાન્ય રીતે ૧૦-૧૨%).
• AI ક્વોલિટી સર્ટિફિકેટ ઓટો-અટેચ.

[૬] મોડ્યુલ ૫: ૨૨+ બંધારણીય પ્રાદેશિક ભાષાઓ
------------------------------------------------------------------------------
ગુજરાતી, हिन्दी, English, ਪੰਜਾਬੀ, मराठी, తెలుగు, தமிழ், বাংলা, ಕನ್ನಡ, മലയാളം, 
ઓડિયા, ભોજપુરી, મારવાડી સહિત તમામ ભાષાઓમાં પૂર્ણ સહાય.

[૭] ખેડૂત સહાય & સંપર્ક
------------------------------------------------------------------------------
• ટોલ-ફ્રી ખેડૂત હેલ્પલાઇન: 1800-KISAN-SYNC (1800-547-267)
• ઇમેઇલ: support@kisansync.gov.in / help@kisansync.ai
• વેબસાઇટ: https://kisansync.ai

==============================================================================
   કિસાનસિંક: ભારતના ખેડૂતો માટે AI ટેકનોલોજી અને ખુલ્લા બજારની શક્તિ
==============================================================================`
  },

  en: {
    modalTitle: 'KisanSync Platform User Manual',
    versionBadge: 'v2.5 Official',
    modalSubtitle: 'Complete step-by-step documentation for Farmers, Agronomists & Buyers',
    shareWhatsApp: 'WhatsApp Share',
    preparingPdf: 'Preparing PDF...',
    sharePdfWhatsApp: 'Share PDF on WhatsApp',
    sharePdfWhatsAppDesc: 'Share directly with farmers & groups',
    downloadBtn: 'Download',
    selectFormat: 'Select Download Format',
    printPdf: 'Print / Save as PDF',
    printPdfDesc: 'Color printable operations guide',
    textGuide: 'Text Guide (.txt)',
    textGuideDesc: 'For offline reading and records',
    copied: 'Copied!',
    copy: 'Copy',
    copiedToastTitle: 'Guide Copied to Clipboard!',
    copiedToastDesc: 'Ready to paste in WhatsApp or notes.',
    shareBarPrompt: 'Share current guide PDF to WhatsApp:',
    shareOnWhatsAppBtn: 'Share on WhatsApp',
    closeBtn: 'Understood',
    cancelBtn: 'Cancel',
    listenBtn: 'Listen',
    playingBtn: 'Playing...',
    farmerHelplineLabel: '24/7 Farmer Helpline:',
    helplineNumber: '1800-KISAN-SYNC (1800-547-267) - Toll-Free',
    faqSectionTitle: '6. FAQ & Help',
    faqHeading: 'Frequently Asked Questions',
    launchCropScanner: 'Launch AI Crop Scanner',
    exploreMarketplace: 'Explore Bidding Marketplace',
    listNewCrop: 'List New Crop Lot (+)',
    faqs: [
      {
        q: 'What if the live camera does not open?',
        a: 'Check your browser camera permissions or tap "Upload from Gallery" to pick a photo from your file manager or camera.'
      },
      {
        q: 'Will the AI provide accurate diagnosis for blurry images?',
        a: 'KisanSync applies strict zero-hallucination protocols. Blurry images will trigger an Uncertainty Warning instead of guessing.'
      },
      {
        q: 'When is payout released after auction completion?',
        a: 'Funds are released from secure escrow directly into your verified bank account upon delivery and quality verification.'
      },
      {
        q: 'What is the 24/7 Farmer Helpline number?',
        a: 'Toll-free helpline: 1800-KISAN-SYNC (1800-547-267) available round the clock.'
      }
    ],
    sections: {
      quickstart: {
        id: 'quickstart',
        tabLabel: 'Quick Start Guide',
        title: 'Smart AI Agricultural Control Platform',
        subtitle: 'Use KisanSync in 3 Easy Steps',
        description: 'KisanSync bridges farmers directly with verified institutional buyers and traders without middleman cuts. Get instant AI vision crop pathology scans and trade verified harvest lots.',
        audioText: 'Quick start guide. Use KisanSync in 3 easy steps. Step 1: Scan field crop. Step 2: Get organic and chemical treatment prescription. Step 3: Sell directly via live bidding auction.',
        steps: [
          {
            num: '1',
            title: 'Scan Field Crop',
            desc: 'Point camera at foliage or upload a photo. AI scans cellular texture to detect diseases and assigns a 0-100 Quality Score.'
          },
          {
            num: '2',
            title: 'Get Treatment & Prescription',
            desc: 'Review biological remedies + exact chemical spray dosages per liter with crop safety measures.'
          },
          {
            num: '3',
            title: 'Sell via Direct Bidding',
            desc: 'Publish certified lots to the live bidding hub with verified Grade A+/A certificate to get higher prices.'
          }
        ],
        keyPoints: ['0% Middleman Commission', '96%+ AI Diagnosis Accuracy', '22+ Scheduled Indian Languages']
      },
      search: {
        id: 'search',
        tabLabel: '1. Smart Voice Search',
        title: 'Ask Any Agricultural Question by Voice or Text',
        subtitle: 'Module 1: Smart Voice Search & 24/7 Farming Assistant',
        description: 'Get instant, scientifically verified answers for crop protection, fertilizer schedules, mandi price discovery, and government subsidy schemes.',
        audioText: 'Module 1: Smart voice search. Tap microphone icon to speak farming questions in your regional language. System converts speech to text and gives instant agronomy advice.',
        steps: [
          {
            num: '1',
            title: 'Voice Query Input',
            desc: 'Click microphone (🎤) button inside the search bar and speak naturally in your mother tongue.'
          },
          {
            num: '2',
            title: 'Speech to Text Transcription',
            desc: 'Voice input instantly transcribes into precise agricultural text, which you can review or edit.'
          },
          {
            num: '3',
            title: 'Audio Playback Advisory',
            desc: 'Click "Listen to Answer" to hear the agronomic advisory read aloud in clear speech.'
          },
          {
            num: '4',
            title: 'WhatsApp Sharing',
            desc: 'Export structured advice directly into farmer WhatsApp groups with a single click.'
          }
        ],
        keyPoints: ['24/7 Autonomous Agronomic Advisory', 'ICAR & University Grounded Protocols', 'Audio TTS in 22+ Regional Languages']
      },
      analyzer: {
        id: 'analyzer',
        tabLabel: '2. AI Field Scanner',
        title: 'Precision Botanical Vision & Diagnostic Engine',
        subtitle: 'Module 2: AI Crop Health & Pathology Scanner',
        description: 'Analyze foliage, stems, and fruits using computer vision trained on agricultural plant pathology to identify diseases and generate a 6-point clinical agronomy report.',
        audioText: 'Module 2: AI Crop Health Scanner. Take high resolution photo of foliage. AI identifies plant diseases and delivers complete 6 point assessment.',
        steps: [
          {
            num: '1',
            title: 'Botanical Identification',
            desc: 'Scientific botanical nomenclature and infected tissue classification.'
          },
          {
            num: '2',
            title: 'Pathogen Diagnosis',
            desc: 'Fungal, viral, bacterial, or nutrient deficiency with confidence percentage.'
          },
          {
            num: '3',
            title: 'Standardized AI Quality Score',
            desc: '0 to 100 commercial grading tier certified for marketplace auctions (Grade A+, A, B+).'
          },
          {
            num: '4',
            title: 'Observed Foliage Symptoms',
            desc: 'Tissue chlorosis, necrosis, leaf spots, and pustule distribution.'
          },
          {
            num: '5',
            title: 'Actionable Treatment Plan',
            desc: 'Bio-organic remedies (Neem oil/Trichoderma) + targeted chemical fungicides with exact dosages.'
          },
          {
            num: '6',
            title: 'Scientific Agronomic Disclaimer',
            desc: 'Safety protocols and weather guidelines adhering to national agronomy standards.'
          }
        ],
        keyPoints: ['Strict zero-hallucination protocols', 'Dual organic and chemical remediation', 'Direct auction quality certification']
      },
      marketplace: {
        id: 'marketplace',
        tabLabel: '3. Bidding Market',
        title: 'Zero Middleman Deductions & Real-time Bidding',
        subtitle: 'Module 3: Direct Bidding Trading Marketplace',
        description: 'Direct transparent auction trading between verified farmers and institutional buyers with real-time countdown bidding and secure escrow guarantee.',
        audioText: 'Module 3: Direct Bidding Trading Marketplace. Zero middleman deductions and live countdown auctions with verified escrow protection.',
        steps: [
          {
            num: '1',
            title: 'Browse Certified Harvest Lots',
            desc: 'Review lots with certified quality badges, moisture content, and reserve prices.'
          },
          {
            num: '2',
            title: 'Instant Increment Chips',
            desc: 'Use one-tap increment chips (+₹100, +₹250, +₹500/qtl) or enter custom bid amount.'
          },
          {
            num: '3',
            title: 'Verified Audit Ledger',
            desc: 'Transparent timestamped ledger records all incoming competing bids in real time.'
          },
          {
            num: '4',
            title: 'Guaranteed Escrow Settlement',
            desc: 'Payment released directly upon physical delivery and quality verification.'
          }
        ],
        keyPoints: ['0% Middleman Brokerage', 'Real-time countdown auctions', 'Verified instant settlement']
      },
      listing: {
        id: 'listing',
        tabLabel: '4. Listing Produce',
        title: 'Publish Your Harvest to the Marketplace',
        subtitle: 'Module 4: Listing Fresh Produce Lots',
        description: 'List your harvested produce in under 2 minutes with automated AI quality score attachment and receive bids from verified buyers nationwide.',
        audioText: 'Module 4: Listing fresh produce. Input crop name, quantity, base price and moisture to publish lot in 2 minutes.',
        steps: [
          {
            num: '1',
            title: 'Crop Name & Cultivar',
            desc: 'Select crop type and commercial cultivar (e.g., Sharbati Wheat, Hybrid Cotton, Roma Tomatoes).'
          },
          {
            num: '2',
            title: 'Available Quantity (Quintals)',
            desc: 'Specify quantity in quintals (1 Quintal = 100 kg).'
          },
          {
            num: '3',
            title: 'Reserve Floor Price (₹/qtl)',
            desc: 'Set the minimum base price to initiate buyer bidding.'
          },
          {
            num: '4',
            title: 'Moisture & AI Quality Grade',
            desc: 'Input grain moisture % (typically 10-12%) and auto-attach verified AI Quality Grade.'
          }
        ],
        keyPoints: ['Instant 2-minute listing', 'Verified farmer badge', 'Nationwide buyer reach']
      },
      languages: {
        id: 'languages',
        tabLabel: '5. 22+ Languages',
        title: 'Native Language Experience for Every Indian Farmer',
        subtitle: 'Module 5: 22+ Scheduled Indian Languages',
        description: 'Full native script and agricultural terminology support across Hindi, Gujarati, Punjabi, Marathi, Telugu, Tamil, Bengali, Kannada, Malayalam, Odia, and all 22 scheduled languages.',
        audioText: 'Module 5: Full native script support across all 22 Scheduled Indian languages. Tap the globe button anytime to switch interface language.',
        steps: [
          {
            num: '1',
            title: 'Tap Globe 🌐 Selector',
            desc: 'Click the language pill (Globe 🌐) in the top header or mobile menu.'
          },
          {
            num: '2',
            title: 'Select Your Native Language',
            desc: 'Choose your regional dialect with phonetic search or quick chips.'
          },
          {
            num: '3',
            title: 'Zero Latency Switch',
            desc: 'The entire UI, voice assistant, and diagnostic reports switch instantly.'
          }
        ],
        keyPoints: ['22 Official Languages', 'Native Agronomic Terms', '100% Crisp Unicode Rendering']
      },
      faq: {
        id: 'faq',
        tabLabel: '6. FAQ & Help',
        title: 'Frequently Asked Questions & Support',
        subtitle: 'Module 6: Farmer Help & Technical Troubleshooting',
        description: 'Comprehensive troubleshooting guide for camera usage, diagnostic confidence, and secure payouts.',
        audioText: 'Module 6: Frequently asked questions. Grant camera permissions. Zero hallucination protocols ensure accurate diagnosis. Toll-free helpline 1800-547-267.',
        steps: [
          {
            num: 'Q.1',
            title: 'What if the camera does not open?',
            desc: 'Grant camera permissions in browser or tap "Upload from Gallery" to select a photo.'
          },
          {
            num: 'Q.2',
            title: 'Does AI guess on blurry images?',
            desc: 'No, strict zero-hallucination rules ensure the AI never guesses on unreadable foliage.'
          },
          {
            num: 'Q.3',
            title: 'When is payout released?',
            desc: 'Funds are released from escrow directly into your verified bank account on delivery.'
          }
        ],
        keyPoints: ['Toll-Free 24/7 Support', 'Secure Escrow Settlement', 'Ground-Truth AI Pathology']
      }
    },
    fullManualText: `==============================================================================
   KISANSYNC - OFFICIAL PLATFORM USER MANUAL & OPERATIONS GUIDE v2.5
   Autonomous Agronomic Diagnostics • Direct Real-Time Bidding Marketplace
==============================================================================

[1] QUICK START GUIDE
------------------------------------------------------------------------------
1. SCAN FIELD CROP:
   Point camera at leaf/fruit or upload high-res photo. AI scans cellular patterns to detect diseases.
2. GET TREATMENT & PRESCRIPTION:
   Review bio-organic controls + targeted chemical fungicides with exact dosages per liter.
3. SELL VIA DIRECT BIDDING:
   Transfer verified AI Quality Badge (Grade A+/A) into the auction hub to get high buyer bids.

[2] MODULE 1: SMART VOICE SEARCH & 24/7 FARMING ASSISTANT
------------------------------------------------------------------------------
• Voice Search: Tap the microphone (🎤) icon inside the search bar and speak your agricultural query.
• Audio Playback: Click "🔊 Listen to Answer" to hear the advisory spoken clearly in regional languages.
• WhatsApp Sharing: One-click export formatted for farmer groups and agronomists.

[3] MODULE 2: AI FIELD PATHOLOGY & PRECISION DIAGNOSTICS (6-POINT REPORT)
------------------------------------------------------------------------------
1. Botanical Identification: Scientific taxon and affected plant tissue.
2. Pathogen Diagnosis: Fungal, viral, bacterial, or nutrient deficiency with confidence score.
3. AI Quality Score: 0-100 score and export quality tier (Grade A+, A, B+, B).
4. Observed Symptoms: Necrotic lesions, chlorosis, wilting, or spot distribution.
5. Actionable Treatment Plan:
   - Bio-Organic Controls: Neem oil emulsion, Trichoderma harzianum, Bio-fungicides.
   - Precision Chemical Sprays: Verified chemical compounds with exact ml/g per liter of water.
6. Scientific Agronomic Disclaimer: Guidelines complying with national agronomy protocols.

[4] MODULE 3: DIRECT BIDDING TRADING MARKETPLACE (AUCTION PROTOCOL)
------------------------------------------------------------------------------
• Zero Middleman Deductions: Connects producers directly with verified mills and wholesale traders.
• Tactile Increments: Instant quick-bid chips (+₹100, +₹250, +₹500/qtl).
• Live Audit Ledger: Transparent timestamped bidding history with verified buyer badges.
• Guaranteed Settlement: Escrow protection on final auction closure.

[5] MODULE 4: LISTING FRESH PRODUCE LOTS
------------------------------------------------------------------------------
• Crop Name & Commercial Cultivar (e.g., Lokwan Wheat, Hybrid Cotton, Roma Tomatoes).
• Quantity in Quintals (1 Quintal = 100 kg).
• Reserve Base Price (₹ per Quintal).
• Grain Moisture Percentage (typically 10-12%).
• Automatic linkage of verified AI Quality Score & Grade A+ badge.

[6] MODULE 5: 22+ SCHEDULED INDIAN REGIONAL LANGUAGES
------------------------------------------------------------------------------
Full native script support for Gujarati, Hindi, Punjabi, Marathi, Telugu, Tamil, 
Bengali, Kannada, Malayalam, Odia, Assamese, Bhojpuri, Marwari, and English.

[7] 24/7 HELPLINE & SUPPORT
------------------------------------------------------------------------------
• Toll-Free Farmer Support: 1800-KISAN-SYNC (1800-547-267)
• Email: support@kisansync.gov.in / help@kisansync.ai
• Portal: https://kisansync.ai

==============================================================================
   KISANSYNC: EMPOWERING INDIAN FARMERS WITH AUTONOMOUS AGRONOMY & FAIR TRADE
==============================================================================`
  },

  pa: {
    modalTitle: 'ਕਿਸਾਨਸਿੰਕ ਵਰਤੋਂਕਾਰ ਮਾਰਗਦਰਸ਼ਕ',
    versionBadge: 'v2.5 ਅਧਿਕਾਰਤ',
    modalSubtitle: 'ਏਆਈ ਫਸਲ ਰੋਗ ਜਾਂਚ, ਸਿੱਧੀ ਮੰਡੀ ਬੋਲੀ ਅਤੇ ੨੨+ ਭਾਸ਼ਾਵਾਂ ਦੀ ਜਾਣਕਾਰੀ',
    shareWhatsApp: 'ਵਟਸਐਪ ਸ਼ੇਅਰ',
    preparingPdf: 'PDF ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ...',
    sharePdfWhatsApp: 'ਵਟਸਐਪ PDF ਸ਼ੇਅਰ',
    sharePdfWhatsAppDesc: 'ਸਿੱਧਾ ਕਿਸਾਨ ਵੀਰਾਂ ਅਤੇ ਵਟਸਐਪ ਗਰੁੱਪਾਂ ਵਿੱਚ ਭੇਜੋ',
    downloadBtn: 'ਡਾਊਨਲੋਡ',
    selectFormat: 'ਡਾਊਨਲੋਡ ਫਾਰਮੈਟ ਚੁਣੋ',
    printPdf: 'ਪ੍ਰਿੰਟ / PDF ਡਾਊਨਲੋਡ',
    printPdfDesc: 'ਰੰਗਦਾਰ ਪ੍ਰਿੰਟੇਬਲ PDF ਗਾਈਡ',
    textGuide: 'ਟੈਕਸਟ ਫਾਈਲ (.txt)',
    textGuideDesc: 'ਔਫਲਾਈਨ ਪੜ੍ਹਨ ਲਈ ਸੰਭਾਲੋ',
    copied: 'ਕਾਪੀ ਹੋ ਗਿਆ!',
    copy: 'ਕਾਪੀ ਕਰੋ',
    copiedToastTitle: 'ਗਾਈਡ ਕਲਿੱਪਬੋਰਡ ਤੇ ਕਾਪੀ ਹੋ ਗਈ!',
    copiedToastDesc: 'ਤੁਸੀਂ ਇਸਨੂੰ ਵਟਸਐਪ ਜਾਂ ਨੋਟਸ ਵਿੱਚ ਪੇਸਟ ਕਰ ਸਕਦੇ ਹੋ।',
    shareBarPrompt: 'ਇਸ ਗਾਈਡ ਦੀ PDF ਕਿਸਾਨ ਗਰੁੱਪਾਂ ਵਿੱਚ ਸਾਂਝੀ ਕਰੋ:',
    shareOnWhatsAppBtn: 'ਵਟਸਐਪ ਤੇ ਸ਼ੇਅਰ ਕਰੋ',
    closeBtn: 'ਸਮਝ ਆ ਗਿਆ',
    cancelBtn: 'ਰੱਦ ਕਰੋ',
    listenBtn: 'ਸੁਣੋ',
    playingBtn: 'ਆਵਾਜ਼ ਜਾਰੀ...',
    farmerHelplineLabel: '੨੪/੭ ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ:',
    helplineNumber: '1800-KISAN-SYNC (1800-547-267) - ਟੋਲ-ਫ੍ਰੀ',
    faqSectionTitle: '੬. ਸਵਾਲ-ਜਵਾਬ ਅਤੇ ਮਦਦ (FAQ)',
    faqHeading: 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ',
    launchCropScanner: 'ਏਆਈ ਫਸਲ ਸਕੈਨਰ ਖੋਲ੍ਹੋ',
    exploreMarketplace: 'ਲਾਈਵ ਮੰਡੀ ਬੋਲੀ ਦੇਖੋ',
    listNewCrop: 'ਨਵੀਂ ਫਸਲ ਲਿਸਟ ਕਰੋ (+)',
    faqs: [
      {
        q: 'ਜੇਕਰ ਕੈਮਰਾ ਨਾ ਚੱਲੇ ਤਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
        a: 'ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਕੈਮਰੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਗੈਲਰੀ ਬਟਨ ਦਬਾ ਕੇ ਮੋਬਾਈਲ ਤੋਂ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ।'
      },
      {
        q: 'ਕੀ ਧੁੰਦਲੀ ਫੋਟੋ ਤੇ ਏਆਈ ਸਹੀ ਨਤੀਜਾ ਦੇਵੇਗਾ?',
        a: 'ਕਿਸਾਨਸਿੰਕ ਵਿੱਚ ਜ਼ੀਰੋ ਹੈਲੁਸੀਨੇਸ਼ਨ ਨਿਯਮ ਹੈ। ਧੁੰਦਲੀ ਫੋਟੋ ਤੇ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਦੀ ਬਜਾਏ ਸਾਫ਼ ਫੋਟੋ ਲੈਣ ਦੀ ਸਲਾਹ ਮਿਲੇਗੀ।'
      },
      {
        q: 'ਫਸਲ ਵਿਕਣ ਤੋਂ ਬਾਅਦ ਪੈਸੇ ਕਦੋਂ ਮਿਲਦੇ ਹਨ?',
        a: 'ਖਰੀਦਦਾਰ ਦੁਆਰਾ ਮਾਲ ਦੀ ਜਾਂਚ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਐਸਕਰੋ ਖਾਤੇ ਵਿੱਚੋਂ ਸਿੱਧੇ ਤੁਹਾਡੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਰਕਮ ਭੇਜੀ ਜਾਂਦੀ ਹੈ।'
      },
      {
        q: 'ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ ਨੰਬਰ ਕੀ ਹੈ?',
        a: 'ਟੋਲ-ਫ੍ਰੀ ਨੰਬਰ: 1800-KISAN-SYNC (1800-547-267) ਹਰ ਸਮੇਂ ਉਪਲਬਧ ਹੈ।'
      }
    ],
    sections: {
      quickstart: {
        id: 'quickstart',
        tabLabel: 'ਤੁਰੰਤ ਸ਼ੁਰੂਆਤ (Quick Start)',
        title: 'ਕਿਸਾਨਾਂ ਲਈ ਸਮਾਰਟ ਏਆਈ ਖੇਤੀ ਪਲੇਟਫਾਰਮ',
        subtitle: '੩ ਸੌਖੇ ਕਦਮਾਂ ਵਿੱਚ ਕਿਸਾਨਸਿੰਕ ਦੀ ਵਰਤੋਂ ਕਰੋ',
        description: 'ਕਿਸਾਨਸਿੰਕ ਕਿਸਾਨਾਂ ਅਤੇ ਵਪਾਰੀਆਂ ਵਿਚਕਾਰ ਬਿਨਾਂ ਵਿਚੋਲਿਆਂ ਦੇ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰਵਾਉਂਦਾ ਹੈ। ਫਸਲ ਰੋਗਾਂ ਦੀ ਤੁਰੰਤ ਜਾਂਚ ਕਰੋ ਅਤੇ ਉੱਚੀ ਬੋਲੀ ਪ੍ਰਾਪਤ ਕਰੋ।',
        audioText: 'ਤੁਰੰਤ ਸ਼ੁਰੂਆਤ। ੧: ਫਸਲ ਸਕੈਨ ਕਰੋ। ੨: ਇਲਾਜ ਪਰਚੀ ਲਵੋ। ੩: ਸਿੱਧੀ ਮੰਡੀ ਵਿੱਚ ਵੇਚੋ।',
        steps: [
          { num: '੧', title: 'ਫਸਲ ਸਕੈਨ ਕਰੋ', desc: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ ਅੱਪਲੋਡ ਕਰੋ। ਏਆਈ ਤੁਰੰਤ ਰੋਗ ਪਛਾਣੇਗਾ।' },
          { num: '੨', title: 'ਇਲਾਜ ਤੇ ਪਰਚੀ ਪ੍ਰਾਪਤ ਕਰੋ', desc: 'ਜੈਵਿਕ ਅਤੇ ਰਸਾਇਣਕ ਕੀਟਨਾਸ਼ਕ ਦੀ ਸਹੀ ਮਾਤਰਾ ਦੇਖੋ।' },
          { num: '੩', title: 'ਸਿੱਧੀ ਬੋਲੀ ਵਿੱਚ ਵੇਚੋ', desc: 'ਏਆਈ ਕੁਆਲਿਟੀ ਸਰਟੀਫਿਕੇਟ ਨਾਲ ਫਸਲ ਲਿਸਟ ਕਰੋ ਅਤੇ ਉੱਚਾ ਮੁਨਾਫ਼ਾ ਕਮਾਓ।' }
        ],
        keyPoints: ['ਜ਼ੀਰੋ ਵਿਚੋਲੀਆ ਕਮਿਸ਼ਨ', '੯੬%+ ਏਆਈ ਜਾਂਚ ਸ਼ੁੱਧਤਾ', '੨੨+ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ']
      },
      search: {
        id: 'search',
        tabLabel: '੧. ਸਮਾਰਟ ਵੌਇਸ ਸਰਚ',
        title: 'ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਖੇਤੀ ਦਾ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ',
        subtitle: 'ਮੌਡਿਊਲ ੧: ਸਮਾਰਟ ਵੌਇਸ ਸਰਚ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ',
        description: 'ਫਸਲਾਂ ਦੇ ਰੋਗ, ਖਾਦ, ਸਬਸਿਡੀਆਂ, ਮੰਡੀ ਭਾਅ ਅਤੇ ਸਿੰਚਾਈ ਬਾਰੇ ਵਿਗਿਆਨਕ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ।',
        audioText: 'ਸਮਾਰਟ ਵੌਇਸ ਸਰਚ। ਮਾਈਕ੍ਰੋਫੋਨ ਬਟਨ ਦਬਾ ਕੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ।',
        steps: [
          { num: '੧', title: 'ਵੌਇਸ ਇਨਪੁੱਟ', desc: 'ਮਾਈਕ੍ਰੋਫੋਨ 🎤 ਬਟਨ ਦਬਾ ਕੇ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਬੋਲੋ।' },
          { num: '੨', title: 'ਟੈਕਸਟ ਰੂਪਾਂਤਰਣ', desc: 'ਸਿਸਟਮ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨੂੰ ਆਪਣੇ ਆਪ ਲਿਖਤ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।' },
          { num: '੩', title: 'ਆਡੀਓ ਸੁਣੋ', desc: '"ਸੁਣੋ" ਬਟਨ ਦਬਾ ਕੇ ਪੂਰੀ ਸਲਾਹ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਸੁਣੋ।' },
          { num: '੪', title: 'ਵਟਸਐਪ ਸ਼ੇਅਰਿੰਗ', desc: '੧-ਕਲਿੱਕ ਵਿੱਚ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਵਟਸਐਪ ਗਰੁੱਪਾਂ ਵਿੱਚ ਸਾਂਝੀ ਕਰੋ।' }
        ],
        keyPoints: ['੨੪ ਘੰਟੇ ਏਆਈ ਖੇਤੀ ਸਲਾਹ', 'ICAR ਅਧਾਰਿਤ ਨਿਯਮ', '੨੨+ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਆਡੀਓ']
      },
      analyzer: {
        id: 'analyzer',
        tabLabel: '੨. ਏਆਈ ਫਸਲ ਜਾਂਚ',
        title: 'ਕੈਮਰੇ ਅਤੇ ਫੋਟੋ ਰਾਹੀਂ ਫਸਲ ਰੋਗਾਂ ਦਾ ਸਹੀ ਵਿਸ਼ਲੇਸ਼ਣ',
        subtitle: 'ਮੌਡਿਊਲ ੨: ਏਆਈ ਫਸਲ ਸਿਹਤ ਸਕੈਨਰ',
        description: 'ਖੇਤ ਵਿੱਚ ਖੜ੍ਹੀ ਫਸਲ ਦੀ ਫੋਟੋ ਲੈ ਕੇ ਉੱਲੀ, ਕੀੜੇ ਜਾਂ ਕਮੀਆਂ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ੬-ਨੁਕਾਤੀ ਰਿਪੋਰਟ ਲਵੋ।',
        audioText: 'ਮੌਡਿਊਲ ੨: ਏਆਈ ਫਸਲ ਜਾਂਚ ਸਕੈਨਰ। ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਰਿਪੋਰਟ ਲਵੋ।',
        steps: [
          { num: '੧', title: 'ਬੋਟੈਨੀਕਲ ਪਛਾਣ', desc: 'ਪੌਦੇ ਦਾ ਨਾਮ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਅੰਗ ਦੀ ਪਛਾਣ।' },
          { num: '੨', title: 'ਰੋਗ ਦੀ ਪਛਾਣ', desc: 'ਉੱਲੀ, ਵਾਇਰਸ, ਬੈਕਟੀਰੀਆ ਜਾਂ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਕਮੀ।' },
          { num: '੩', title: 'ਏਆਈ ਕੁਆਲਿਟੀ ਸਕੋਰ', desc: '੦ ਤੋਂ ੧੦੦ ਗੁਣਵੱਤਾ ਸਕੋਰ ਅਤੇ ਗ੍ਰੇਡ (Grade A+, A, B+)।' },
          { num: '੪', title: 'ਲੱਛਣ', desc: 'ਪੱਤਿਆਂ ਤੇ ਦਾਗ, ਪੀਲਾਪਣ ਅਤੇ ਸੜਨ ਦੇ ਲੱਛਣ।' },
          { num: '੫', title: 'ਇਲਾਜ ਵਿਧੀ', desc: 'ਨੀਮ ਤੇਲ/ਟ੍ਰਾਈਕੋਡਰਮਾ ਜੈਵਿਕ ਉਪਾਅ + ਰਸਾਇਣਕ ਸਪਰੇਅ ਮਾਤਰਾ।' },
          { num: '੬', title: 'ਵਿਗਿਆਨਕ ਸਾਵਧਾਨੀਆਂ', desc: 'ਖੇਤੀਬਾੜੀ ਵਿਭਾਗ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਸੁਰੱਖਿਆ ਨਿਰਦੇਸ਼।' }
        ],
        keyPoints: ['ਜ਼ੀਰੋ ਹੈਲੁਸੀਨੇਸ਼ਨ ਨਿਯਮ', 'ਜੈਵਿਕ ਅਤੇ ਰਸਾਇਣਕ ਦੋਹਰਾ ਇਲਾਜ', 'ਮੰਡੀ ਸਰਟੀਫਿਕੇਸ਼ਨ']
      },
      marketplace: {
        id: 'marketplace',
        tabLabel: '੩. ਮੰਡੀ ਬੋਲੀ',
        title: 'ਜ਼ੀਰੋ ਵਿਚੋਲਗੀ, ਲਾਈਵ ਨਿਲਾਮੀ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਭਾਅ',
        subtitle: 'ਮੌਡਿਊਲ ੩: ਸਿੱਧੀ ਮੰਡੀ ਬੋਲੀ ਵਪਾਰ',
        description: 'ਕਿਸਾਨ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਵਪਾਰੀ ਆਪਸ ਵਿੱਚ ਸਿੱਧੀ ਆਨਲਾਈਨ ਬੋਲੀ ਲਗਾਉਂਦੇ ਹਨ। ਕਿਸਾਨ ਨੂੰ ਮਿਲਦਾ ਹੈ ਸਭ ਤੋਂ ਵੱਧ ਭਾਅ।',
        audioText: 'ਮੌਡਿਊਲ ੩: ਲਾਈਵ ਮੰਡੀ ਬੋਲੀ। ਸਿੱਧਾ ਵਪਾਰ ਅਤੇ ਸੁਰੱਖਿਅਤ ਐਸਕਰੋ ਭੁਗਤਾਨ।',
        steps: [
          { num: '੧', title: 'ਲੌਟ ਦੇਖੋ', desc: 'ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ, ਨਮੀ ਅਤੇ ਮੌਜੂਦਾ ਉੱਚੀ ਬੋਲੀ ਦੇਖੋ।' },
          { num: '੨', title: 'ਤੁਰੰਤ ਬੋਲੀ ਚਿਪਸ', desc: '+₹੧੦੦, +₹੨੫੦, +₹੫੦੦ ਨਾਲ ਤੁਰੰਤ ਬੋਲੀ ਵਧਾਓ।' },
          { num: '੩', title: 'ਪਾਰਦਰਸ਼ੀ ਲੇਜ਼ਰ', desc: 'ਸਾਰੀਆਂ ਬੋਲੀਆਂ ਸਮੇਂ ਸਿਰ ਲਾਈਵ ਦਿਖਾਈ ਦਿੰਦੀਆਂ ਹਨ।' },
          { num: '੪', title: 'ਐਸਕਰੋ ਸੁਰੱਖਿਆ', desc: 'ਨਿਲਾਮੀ ਖਤਮ ਹੋਣ ਤੇ ਸੁਰੱਖਿਅਤ ਸੌਦਾ ਅਤੇ ਪੈਸੇ ਦੀ ਗਾਰੰਟੀ।' }
        ],
        keyPoints: ['੦% ਕਮਿਸ਼ਨ', 'ਲਾਈਵ ਟਾਈਮਰ ਨਿਲਾਮੀ', 'ਸੁਰੱਖਿਅਤ ਬੈਂਕ ਟਰਾਂਸਫਰ']
      },
      listing: {
        id: 'listing',
        tabLabel: '੪. ਫਸਲ ਲਿਸਟ ਕਰੋ',
        title: 'ਆਪਣੀ ਫਸਲ ਨੂੰ ਮੰਡੀ ਵਿੱਚ ਵੇਚਣ ਲਈ ਰੱਖੋ',
        subtitle: 'ਮੌਡਿਊਲ ੪: ਨਵੀਂ ਫਸਲ ਲਿਸਟ ਕਰਨ ਦਾ ਤਰੀਕਾ',
        description: 'ਸਿਰਫ਼ ੨ ਮਿੰਟਾਂ ਵਿੱਚ ਆਪਣੀ ਫਸਲ ਨਿਲਾਮੀ ਲਈ ਰੱਖੋ ਅਤੇ ਦੇਸ਼ ਭਰ ਦੇ ਖਰੀਦਦਾਰਾਂ ਤੋਂ ਬੋਲੀਆਂ ਲਵੋ।',
        audioText: 'ਮੌਡਿਊਲ ੪: ਫਸਲ ਲਿਸਟ ਕਰਨਾ। ਫਸਲ ਦਾ ਨਾਮ, ਮਾਤਰਾ, ਰੇਟ ਅਤੇ ਨਮੀ ਭਰ ਕੇ ਲਿਸਟ ਕਰੋ।',
        steps: [
          { num: '੧', title: 'ਫਸਲ ਤੇ ਕਿਸਮ', desc: 'ਫਸਲ ਚੁਣੋ (ਜਿਵੇਂ ਕਣਕ, ਨਰਮਾ/ਕਪਾਹ, ਬਾਸਮਤੀ ਝੋਨਾ)।' },
          { num: '੨', title: 'ਮਾਤਰਾ (ਕੁਇੰਟਲ ਵਿੱਚ)', desc: 'ਉਪਲਬਧ ਕੁਲ ਵਜ਼ਨ ਕੁਇੰਟਲ ਵਿੱਚ ਦਰਜ ਕਰੋ।' },
          { num: '੩', title: 'ਸ਼ੁਰੂਆਤੀ ਭਾਅ (₹/ਕੁਇੰਟਲ)', desc: 'ਨਿਲਾਮੀ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਘੱਟੋ-ਘੱਟ ਰੇਟ ਤੈਅ ਕਰੋ।' },
          { num: '੪', title: 'ਨਮੀ ਅਤੇ ਏਆਈ ਗ੍ਰੇਡ', desc: 'ਨਮੀ (੧੦-੧੨%) ਅਤੇ ਏਆਈ ਸਕੋਰ ਆਪਣੇ ਆਪ ਜੁੜ ਜਾਵੇਗਾ।' }
        ],
        keyPoints: ['੨ ਮਿੰਟਾਂ ਵਿੱਚ ਲਿਸਟਿੰਗ', 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨ ਬੈਜ', 'ਪੂਰੇ ਭਾਰਤ ਦੇ ਖਰੀਦਦਾਰ']
      },
      languages: {
        id: 'languages',
        tabLabel: '੫. ੨੨+ ਭਾਸ਼ਾਵਾਂ',
        title: 'ਹਰ ਕਿਸਾਨ ਲਈ ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਦਾ ਅਨੁਭਵ',
        subtitle: 'ਮੌਡਿਊਲ ੫: ਭਾਰਤ ਦੀਆਂ ੨੨+ ਭਾਸ਼ਾਵਾਂ',
        description: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਗੁਜਰਾਤੀ, ਮਰਾਠੀ, ਤੇਲਗੂ, ਤਾਮਿਲ, ਬੰਗਾਲੀ ਸਮੇਤ ਸਾਰੀਆਂ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਪੂਰਾ ਸਮਰਥਨ।',
        audioText: 'ਮੌਡਿਊਲ ੫: ਭਾਰਤ ਦੀਆਂ ੨੨ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਪੂਰਾ ਪਲੇਟਫਾਰਮ ਉਪਲਬਧ ਹੈ।',
        steps: [
          { num: '੧', title: 'ਗਲੋਬ 🌐 ਬਟਨ ਦਬਾਓ', desc: 'ਸਿਖਰ ਤੇ ਦਿੱਤੇ ਗਏ ਗਲੋਬ ਆਈਕਨ ਤੇ ਕਲਿੱਕ ਕਰੋ।' },
          { num: '੨', title: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', desc: 'ਆਪਣੀ ਮਨਪਸੰਦ ਬੋਲੀ ਚੁਣੋ।' },
          { num: '੩', title: 'ਤੁਰੰਤ ਬਦਲਾਅ', desc: 'ਪੂਰਾ ਐਪ ਅਤੇ ਏਆਈ ਜਾਂਚ ਤੁਰੰਤ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬਦਲ ਜਾਵੇਗੀ।' }
        ],
        keyPoints: ['੨੨ ਅਧਿਕਾਰਤ ਭਾਸ਼ਾਵਾਂ', 'ਸਥਾਨਕ ਖੇਤੀ ਸ਼ਬਦਾਵਲੀ', '੧੦੦% ਸ਼ੁੱਧ ਗੁਰਮੁਖੀ ਲਿਪੀ']
      },
      faq: {
        id: 'faq',
        tabLabel: '੬. ਸਵਾਲ-ਜਵਾਬ (FAQ)',
        title: 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ ਅਤੇ ਹੱਲ',
        subtitle: 'ਮੌਡਿਊਲ ੬: ਕਿਸਾਨ ਸਹਾਇਤਾ ਅਤੇ ਤਕਨੀਕੀ ਹੱਲ',
        description: 'ਕੈਮਰਾ, ਏਆਈ ਜਾਂਚ ਅਤੇ ਭੁਗਤਾਨ ਸੁਰੱਖਿਆ ਨਾਲ ਜੁੜੇ ਅਹਿਮ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ।',
        audioText: 'ਮੌਡਿਊਲ ੬: ਸਵਾਲ-ਜਵਾਬ ਅਤੇ ਮਦਦ। ਟੋਲ-ਫ੍ਰੀ ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ 1800-547-267।',
        steps: [
          { num: 'ਸ.੧', title: 'ਜੇਕਰ ਕੈਮਰਾ ਨਾ ਖੁੱਲ੍ਹੇ?', desc: 'ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਪਰਮਿਸ਼ਨ ਦਿਓ ਜਾਂ ਗੈਲਰੀ ਤੋਂ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ।' },
          { num: 'ਸ.੨', title: 'ਕੀ ਏਆਈ ਧੁੰਦਲੀ ਫੋਟੋ ਤੇ ਅੰਦਾਜ਼ਾ ਲਗਾਏਗਾ?', desc: 'ਨਹੀਂ, ਸਾਫ਼ ਫੋਟੋ ਲੈਣ ਲਈ ਕਿਹਾ ਜਾਵੇਗਾ।' },
          { num: 'ਸ.੩', title: 'ਪੈਸੇ ਦੀ ਸੁਰੱਖਿਆ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ?', desc: 'ਮਾਲ ਪਹੁੰਚਣ ਤੇ ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਭੁਗਤਾਨ ਹੁੰਦਾ ਹੈ।' }
        ],
        keyPoints: ['ਟੋਲ-ਫ੍ਰੀ ਕਿਸਾਨ ਸਹਾਇਤਾ', 'ਸੁਰੱਖਿਅਤ ਐਸਕਰੋ ਭੁਗਤਾਨ', 'ਸੱਚੀ ਏਆਈ ਜਾਂਚ']
      }
    },
    fullManualText: `==============================================================================
   ਕਿਸਾਨਸਿੰਕ (KisanSync) - ਸੱਤਾਵਾਰ ਯੂਜ਼ਰ ਗਾਈਡ v2.5
   ਏਆਈ ਫਸਲ ਰੋਗ ਜਾਂਚ • ਸਿੱਧੀ ਮੰਡੀ ਬੋਲੀ • ੨੨+ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ
==============================================================================
ਟੋਲ-ਫ੍ਰੀ ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ: 1800-KISAN-SYNC (1800-547-267)
ਪੋਰਟਲ: https://kisansync.ai`
  },

  mr: {
    modalTitle: 'किसानसिंक वापरकर्ता मार्गदर्शिका',
    versionBadge: 'v2.5 अधिकृत',
    modalSubtitle: 'एआय पीक रोग निदान, थेट लिलाव बाजार आणि २२+ भाषांची संपूर्ण माहिती',
    shareWhatsApp: 'व्हॉट्सॲप शेअर',
    preparingPdf: 'PDF तयार होत आहे...',
    sharePdfWhatsApp: 'व्हॉट्सॲप PDF शेअर',
    sharePdfWhatsAppDesc: 'थेट शेतकरी मित्र आणि व्हॉट्सॲप ग्रुपवर पाठवा',
    downloadBtn: 'डाउनलोड',
    selectFormat: 'डाउनलोड फॉरमॅट निवडा',
    printPdf: 'प्रिंट / PDF सेव्ह करा',
    printPdfDesc: 'रंगीत प्रिंटेबल PDF मार्गदर्शिका',
    textGuide: 'टेक्स्ट फाइल (.txt)',
    textGuideDesc: 'ऑफलाईन वाचनासाठी जतन करा',
    copied: 'कॉपी झाले!',
    copy: 'कॉपी करा',
    copiedToastTitle: 'मार्गदर्शिका क्लिपबोर्डवर कॉपी झाली!',
    copiedToastDesc: 'तुम्ही हे व्हॉट्सॲप किंवा नोट्समध्ये पेस्ट करू शकता.',
    shareBarPrompt: 'या मार्गदर्शिकेची PDF शेतकरी ग्रुपमध्ये शेअर करा:',
    shareOnWhatsAppBtn: 'व्हॉट्सॲपवर शेअर करा',
    closeBtn: 'समजले',
    cancelBtn: 'रद्द करा',
    listenBtn: 'ऐका',
    playingBtn: 'आवाज सुरू...',
    farmerHelplineLabel: '२४/७ शेतकरी हेल्पलाइन:',
    helplineNumber: '1800-KISAN-SYNC (1800-547-267) - टोल-फ्री',
    faqSectionTitle: '६. प्रश्नोत्तरे आणि मदत (FAQ)',
    faqHeading: 'नेहमी विचारले जाणारे प्रश्न',
    launchCropScanner: 'AI पीक स्कॅनर उघडा',
    exploreMarketplace: 'लाईव्ह लिलाव बाजार पहा',
    listNewCrop: 'नवीन पीक लिस्ट करा (+)',
    faqs: [
      {
        q: 'कॅमेरा चालू न झाल्यास काय करावे?',
        a: 'ब्राउझर सेटिंग्जमध्ये जाऊन कॅमेरा परवानगी "Allow" करा किंवा थेट गॅलरीतून फोटो अपलोड करा.'
      },
      {
        q: 'अस्पष्ट फोटोवर एआय अचूक निदान करेल का?',
        a: 'किसानसिंकमध्ये झिरो हॅल्युसिनेशन नियम आहे. फोटो स्पष्ट नसल्यास पुन्हा स्पष्ट फोटो काढण्याची सूचना दिली जाईल.'
      },
      {
        q: 'माल विकल्यानंतर पैसे कधी मिळतात?',
        a: 'व्यापाऱ्याला माल मिळाल्यावर आणि गुणवत्ता तपासणीनंतर थेट बँक खात्यात रक्कम वर्ग केली जाते.'
      },
      {
        q: '२४ तास शेतकरी हेल्पलाइन नंबर काय आहे?',
        a: 'टोल-फ्री हेल्पलाइन: 1800-KISAN-SYNC (1800-547-267) वर संपर्क करू शकता.'
      }
    ],
    sections: {
      quickstart: {
        id: 'quickstart',
        tabLabel: 'जलद सुरुवात (Quick Start)',
        title: 'शेतकऱ्यांसाठी स्मार्ट एआय कृषी प्लॅटफॉर्म',
        subtitle: '३ सोप्या टप्प्यांत किसानसिंकचा वापर करा',
        description: 'किसानसिंक शेतकरी आणि व्यापाऱ्यांमध्ये थेट दुवा साधते. पिकांच्या रोगांचे त्वरित निदान मिळवा आणि थेट लिलावात चांगला भाव मिळवा.',
        audioText: 'जलद सुरुवात. १: पीक स्कॅन करा. २: सेंद्रिय व रासायनिक औषधांची मात्रा मिळवा. ३: थेट लिलावात चांगल्या भावाने विका.',
        steps: [
          { num: '१', title: 'पीक स्कॅन करा', desc: 'पानाचा फोटो काढा किंवा अपलोड करा. AI लगेच रोगाची ओळख करेल.' },
          { num: '२', title: 'उपचार व प्रिस्क्रिप्शन मिळवा', desc: 'सेंद्रिय आणि रासायनिक औषधांची प्रति लिटर मात्रा पहा.' },
          { num: '३', title: 'थेट लिलावात विका', desc: 'एआय गुणवत्ता प्रमाणपत्रासह माल लिस्ट करा आणि थेट व्यापाऱ्यांकडून जास्त भाव मिळवा.' }
        ],
        keyPoints: ['शून्य दलाली कमिशन', '९६%+ अचूक निदान', '२२+ भारतीय भाषा']
      },
      search: {
        id: 'search',
        tabLabel: '१. स्मार्ट व्हॉइस सर्च',
        title: 'बोलून किंवा टाईप करून शेतीचा कोणताही प्रश्न विचारा',
        subtitle: 'मॉड्यूल १: स्मार्ट व्हॉइस सर्च आणि कृषी सहाय्यक',
        description: 'पिकांचे रोग, खतांचे प्रमाण, सरकारी योजना, आजचे बाजारभाव याबद्दल त्वरित अचूक माहिती मिळवा.',
        audioText: 'स्मार्ट व्हॉइस सर्च. मायक्रोफोन बटण दाबून आपल्या भाषेत प्रश्न विचारा.',
        steps: [
          { num: '१', title: 'व्हॉइस इनपुट', desc: 'सर्च बारमधील मायक्रोफोन 🎤 बटणावर क्लिक करून प्रश्न बोला.' },
          { num: '२', title: 'स्वयंचलित मजकूर', desc: 'सिस्टम तुमचा आवाज लगेच अचूक मजकुरात रूपांतरित करते.' },
          { num: '३', title: 'ऑडिओ प्लेबॅक', desc: '"ऐका" बटण दाबून संपूर्ण सल्ला स्पष्ट आवाजात ऐका.' },
          { num: '४', title: 'व्हॉट्सॲप शेअरिंग', desc: 'एका क्लिकवर शेतीविषयक सल्ला व्हॉट्सॲप ग्रुपवर शेअर करा.' }
        ],
        keyPoints: ['२४ तास एआय कृषी सल्ला', 'विद्यापीठ प्रमाणित शिफारसी', '२२+ भाषांमध्ये ऑडिओ']
      },
      analyzer: {
        id: 'analyzer',
        tabLabel: '२. AI पीक तपासणी',
        title: 'कॅमेऱ्याद्वारे पीक रोगांचे अचूक विश्लेषण',
        subtitle: 'मॉड्यूल २: AI पीक आरोग्य तपासणी स्कॅनर',
        description: 'पाने, खोड किंवा फळांचे फोटो काढून बुरशी, कीड किंवा पोषक तत्वांची कमतरता काही सेकंदात ओळखा.',
        audioText: 'मॉड्यूल २: AI पीक आरोग्य तपासणी. फोटो अपलोड करा आणि ६-मुद्द्यांचा अहवाल मिळवा.',
        steps: [
          { num: '१', title: 'वनस्पती ओळख', desc: 'पिकाचे शास्त्रीय नाव आणि बाधित भागाची ओळख.' },
          { num: '२', title: 'रोग निदान', desc: 'बुरशी, विषाणू किंवा पोषक तत्वांची कमतरता.' },
          { num: '३', title: 'एआय गुणवत्ता स्कोअर', desc: '० ते १०० स्कोअर आणि निर्यात प्रत (Grade A+, A, B+).' },
          { num: '४', title: 'दिसणारी लक्षणे', desc: 'पानावरील डाग, पिवळेपणा किंवा वाळण्याची लक्षणे.' },
          { num: '५', title: 'उपाययोजना', desc: 'सेंद्रिय निंबोळी तेल/ट्रायकोडर्मा + रासायनिक फवारणी प्रति लिटर.' },
          { num: '६', title: 'वैज्ञानिक दक्षता', desc: 'कृषी विद्यापीठांच्या शिफारशींनुसार सुरक्षा सूचना.' }
        ],
        keyPoints: ['झिरो हॅल्युसिनेशन नियम', 'सेंद्रिय व रासायनिक दुहेरी उपाय', 'थेट बाजार गुणवत्ता प्रमाणपत्र']
      },
      marketplace: {
        id: 'marketplace',
        tabLabel: '३. लिलाव बाजार',
        title: 'शून्य दलाली, लाईव्ह लिलाव आणि पारदर्शक दर',
        subtitle: 'मॉड्यूल ३: थेट लिलाव व्यापार मंच',
        description: 'शेतकरी आणि मोठे व्यापारी थेट ऑनलाईन लिलावात सहभागी होतात. शेतकऱ्याला मिळतो सर्वोत्तम दर.',
        audioText: 'मॉड्यूल ३: थेट लिलाव बाजार. शून्य दलाली आणि सुरक्षित एस्क्रो बँक व्यवहार.',
        steps: [
          { num: '१', title: 'लॉट निवडा', desc: 'गुणवत्ता प्रत, ओलावा आणि सध्याची सर्वोच्च बोली पहा.' },
          { num: '२', title: 'त्वरित बोली चिप्स', desc: '+₹१००, +₹२५०, +₹५०० ने त्वरित बोली वाढवा.' },
          { num: '३', title: 'पारदर्शक लेजर', desc: 'सर्व बोल्या वेळेसह लाईव्ह दिसतात.' },
          { num: '४', title: 'एस्क्रो सुरक्षितता', desc: 'लिलाव संपल्यावर सर्वोच्च बोलीदारासोबत सुरक्षित करार.' }
        ],
        keyPoints: ['०% दलाली', 'लाईव्ह टायमर लिलाव', 'सुरक्षित बँक ट्रान्सफर']
      },
      listing: {
        id: 'listing',
        tabLabel: '४. पीक लिस्ट करणे',
        title: 'तुमचा शेतमाल ऑनलाईन बाजारात विक्रीसाठी ठेवा',
        subtitle: 'मॉड्यूल ४: नवीन पीक लॉट लिस्ट करण्याची पद्धत',
        description: 'फक्त २ मिनिटांत आपला शेतमाल लिलावासाठी लिस्ट करा आणि देशभरातील व्यापाऱ्यांकडून बोली मिळवा.',
        audioText: 'मॉड्यूल ४: पीक लिस्ट करणे. नाव, वजन, मूळ भाव आणि ओलावा भरून २ मिनिटांत विक्रीसाठी ठेवा.',
        steps: [
          { num: '१', title: 'पिकाचे नाव व जात', desc: 'पीक निवडा (उदा. शरबती गहू, कापूस, सोयाबीन, हरभरा, टोमॅटो).' },
          { num: '२', title: 'प्रमाण (क्विंटलमध्ये)', desc: 'एकूण वजन क्विंटलमध्ये नोंदवा (१ क्विंटल = १०० किलो).' },
          { num: '३', title: 'किमान पायाभूत भाव (₹/क्विंटल)', desc: 'लिलाव सुरू करण्यासाठी किमान भाव निश्चित करा.' },
          { num: '४', title: 'ओलावा आणि एआय ग्रेड', desc: 'ओलावा (१०-१२%) आणि एआय गुणवत्ता स्कोअर आपोआप जोडला जाईल.' }
        ],
        keyPoints: ['२ मिनिटांत जलद लिस्टिंग', 'प्रमाणित शेतकरी बॅज', 'देशव्यापी व्यापारी पोहोच']
      },
      languages: {
        id: 'languages',
        tabLabel: '੫. २२+ भाषा',
        title: 'प्रत्येक भारतीय शेतकऱ्यासाठी मातृभाषेचा अनुभव',
        subtitle: 'मॉड्यूल ५: भारताच्या २२+ अधिकृत भाषा',
        description: 'मराठी, हिंदी, गुजराती, पंजाबी, तेलगू, तामिळ, बंगाली, कन्नड यांसह सर्व २२ भाषांमध्ये उपलब्ध.',
        audioText: 'मॉड्यूल ५: भारताच्या सर्व २२ भाषांमध्ये पूर्ण समर्थन. ग्लोब बटणावरून कधीही भाषा बदला.',
        steps: [
          { num: '१', title: 'ग्लोब 🌐 बटण दाबा', desc: 'वरच्या पट्टीतील भाषा निवड बटणावर क्लिक करा.' },
          { num: '२', title: 'आपली भाषा निवडा', desc: 'आपली प्रादेशिक भाषा निवडा.' },
          { num: '३', title: 'त्वरित बदल', desc: 'संपूर्ण ॲप त्वरित आपल्या भाषेत बदलेल.' }
        ],
        keyPoints: ['२२ अधिकृत भाषा', 'स्थानिक कृषी संज्ञा', '१००% अचूक देवनागरी लिपी']
      },
      faq: {
        id: 'faq',
        tabLabel: '६. प्रश्नोत्तरे (FAQ)',
        title: 'नेहमी विचारले जाणारे प्रश्न आणि उत्तरे',
        subtitle: 'मॉड्यूल ६: शेतकरी मदत आणि तांत्रिक निराकरण',
        description: 'कॅमेरा वापर, एआय अचूकता आणि लिलाव पेमेंट संबंधी माहिती.',
        audioText: 'मॉड्यूल ६: प्रश्नोत्तरे आणि मदत. टोल-फ्री शेतकरी हेल्पलाइन 1800-547-267.',
        steps: [
          { num: 'प्र.१', title: 'कॅमेरा सुरू न झाल्यास?', desc: 'ब्राउझरमध्ये कॅमेरा परवानगी द्या किंवा गॅलरीतून फोटो अपलोड करा.' },
          { num: 'प्र.२', title: 'धुंद फोटोवर एआय अचूक उत्तर देईल का?', desc: 'नाही, अचूकतेसाठी स्पष्ट फोटो काढण्याची सूचना मिळेल.' },
          { num: 'प्र.३', title: 'पैसे कसे सुरक्षित मिळतात?', desc: 'माल पोहोचल्यावर थेट एस्क्रो खात्यातून बँक खात्यात जमा होतात.' }
        ],
        keyPoints: ['टोल-फ्री शेतकरी हेल्पलाइन', 'सुरक्षित एस्क्रो व्यवहार', 'सत्यापित एआय तंत्रज्ञान']
      }
    },
    fullManualText: `==============================================================================
   किसानसिंक (KisanSync) - अधिकृत वापरकर्ता मार्गदर्शिका v2.5
   एआय पीक रोग निदान • थेट लिलाव बाजार • २२+ भारतीय भाषा
==============================================================================
टोल-फ्री शेतकरी हेल्पलाइन: 1800-KISAN-SYNC (1800-547-267)
पोर्टल: https://kisansync.ai`
  }
};

/**
 * Helper to get manual translation for any selected language code.
 * Falls back gracefully to Hindi if language is Indian regional, or English.
 */
export const getManualTranslation = (langCode: string): ManualTranslation => {
  if (USER_MANUAL_TRANSLATIONS[langCode]) {
    return USER_MANUAL_TRANSLATIONS[langCode];
  }

  // If language is Hindi-adjacent / devanagari / Indian dialects without custom pack, fallback to Hindi
  if (['bho', 'mai', 'mwr', 'ne', 'kok', 'doi', 'sd', 'sa', 'ks', 'ur'].includes(langCode)) {
    return USER_MANUAL_TRANSLATIONS['hi'];
  }

  // For other regional languages, use Hindi or English as universal base
  return USER_MANUAL_TRANSLATIONS['hi'] || USER_MANUAL_TRANSLATIONS['en'];
};
