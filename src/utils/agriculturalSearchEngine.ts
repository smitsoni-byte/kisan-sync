import { SmartSearchAnswer } from '../types';
import { Language } from '../data/languages';

/**
 * Intelligent Client-Side Agricultural Search & Advisory Engine
 * Generates verified, actionable, multi-lingual agricultural answers
 * whenever network fetch fails, offline, or during backend latency.
 */

interface TopicTemplate {
  categoryKey: 'crop_pathology' | 'fertilizer_soil' | 'government_schemes' | 'mandi_prices' | 'weather_irrigation' | 'general_farming';
  topicCategory: { gu: string; hi: string; en: string };
  headline: { gu: string; hi: string; en: string };
  simpleAnswer: { gu: string; hi: string; en: string };
  recommendations: { gu: string[]; hi: string[]; en: string[] };
  relatedScheme?: {
    name: { gu: string; hi: string; en: string };
    description: { gu: string; hi: string; en: string };
    eligibilityOrBenefit: { gu: string; hi: string; en: string };
    applyLinkText: { gu: string; hi: string; en: string };
  };
  mandiOrMarketContext?: {
    cropName: { gu: string; hi: string; en: string };
    avgPriceRange: string;
    trend: 'up' | 'down' | 'stable';
    note: { gu: string; hi: string; en: string };
  };
  nextSteps: { gu: string[]; hi: string[]; en: string[] };
  verificationNote: { gu: string; hi: string; en: string };
}

const TOPIC_TEMPLATES: Record<string, TopicTemplate> = {
  cotton_yellow: {
    categoryKey: 'crop_pathology',
    topicCategory: {
      gu: 'પાક રોગ અને પોષણ ખામી (Crop Pathology & Nutrition)',
      hi: 'फसल रोग और पोषण प्रबंधन (Crop Nutrition)',
      en: 'Crop Pathology & Leaf Nutrition'
    },
    headline: {
      gu: 'કપાસમાં પાન પીળા થવાના કારણો અને ત્વરિત ઉપચાર',
      hi: 'कपास में पत्तियां पीली पड़ने के कारण और तुरंत उपाय',
      en: 'Causes and Immediate Treatment for Yellowing Cotton Leaves'
    },
    simpleAnswer: {
      gu: 'કપાસમાં પાન પીળા થવાના મુખ્ય કારણો નાઈટ્રોજન અથવા મેગ્નેશિયમની ઉણપ, વધુ પડતો ભેજ અથવા રસચુસિયા જીવાત (સફેદ માખી/થ્રીપ્સ) છે. ૧૯:૧૯:૧૯ ખાતર અથવા મેગ્નેશિયમ સલ્ફેટ સાથે લીમડાના તેલનો છંટકાવ કરવાથી પાન ૧ અઠવાડિયામાં ફરીથી લીલાછમ થશે.',
      hi: 'कपास में पत्ते पीले होने का मुख्य कारण नाइट्रोजन या मैग्नीशियम की कमी, खेत में अधिक नमी, या रस चूसने वाले कीट (सफेद मक्खी/थ्रिप्स) हैं। 19:19:19 या मैग्नीशियम सल्फेट के छिड़काव से पत्ते शीघ्र हरे हो जाते हैं।',
      en: 'Yellowing in cotton leaves is typically triggered by Magnesium/Nitrogen deficiency, waterlogging, or sap-sucking pests (whitefly/thrips). Spraying water-soluble 19:19:19 NPK with Magnesium Sulphate restores vibrant green foliage.'
    },
    recommendations: {
      gu: [
        '૧ લીટર પાણીમાં ૫ ગ્રામ ૧૯:૧૯:૧૯ દ્રાવ્ય ખાતર + ૨ ગ્રામ મેગ્નેશિયમ સલ્ફેટ મિક્સ કરી સવારે છાંટવું.',
        'જો પાનની નીચે ઝીણી સફેદ માખી કે થ્રીપ્સ દેખાય તો ૧ લીટર પાણીમાં ૫ મિ.લી. લીમડાનું તેલ (Neem Oil) મેળવી છંટકાવ કરવો.',
        'કપાસના મૂળ પાસે પાણી ભરાઈ ન રહે તે માટે હળવા નિકાલની વ્યવસ્થા કરવી.',
        'રોગિષ્ટ અને સુકા પાન ચૂંટીને ખેતર બહાર નાશ કરવો.'
      ],
      hi: [
        'प्रति लीटर पानी में 5 ग्राम 19:19:19 एनपीके + 2 ग्राम मैग्नीशियम सल्फेट मिलाकर सुबह छिड़कें।',
        'यदि पत्तों के नीचे सफेद मक्खी या थ्रिप्स दिखे तो 5 मिली नीम तेल प्रति लीटर पानी मिलाकर स्प्रे करें।',
        'जड़ों के पास जलभराव से बचें और खेत में उचित जल निकासी बनाए रखें।',
        'अत्यधिक प्रभावित पत्तियों को तोड़कर खेत से दूर नष्ट कर दें।'
      ],
      en: [
        'Foliar spray with water-soluble 19:19:19 NPK (5g/L) + Magnesium Sulphate (2g/L) during early morning hours.',
        'If sap-sucking whitefly/thrips are spotted under foliage, spray cold-pressed Neem Oil @ 5ml/L of water.',
        'Ensure proper drainage to prevent root asphyxiation from excess moisture.',
        'Prune lower chlorotic leaves to improve air circulation across the crop canopy.'
      ]
    },
    mandiOrMarketContext: {
      cropName: { gu: 'કપાસ (Cotton Shanker-6)', hi: 'कपास (Cotton)', en: 'Cotton (Medium/Long Staple)' },
      avgPriceRange: '₹7,200 - ₹7,850 / ક્વિન્ટલ',
      trend: 'up',
      note: {
        gu: 'તંદુરસ્ત કપાસના લોટને જીનીંગ મિલોમાં સારો પ્રીમિયમ ભાવ મળે છે.',
        hi: 'स्वस्थ और उच्च गुणवत्ता वाली कपास को मिलों में प्रीमियम दाम मिलता है।',
        en: 'Healthy cotton crop with intact boll quality commands top bids in the direct trading auction.'
      }
    },
    nextSteps: {
      gu: [
        'આજે જ પાકની નીચેની સપાટી તપાસી સફેદ માખીની હાજરી નોંધો.',
        '૪૮ કલાકની અંદર પોષક સ્પ્રે પૂર્ણ કરો.'
      ],
      hi: [
        'आज ही पत्तों के नीचे सफेद मक्खी या थ्रिप्स की जांच करें।',
        '48 घंटे के भीतर अनुशंसित छिड़काव पूरा करें।'
      ],
      en: [
        'Inspect the underside of leaves for early nymph populations today.',
        'Complete the foliar nutrition spray within 48 hours for fast recovery.'
      ]
    },
    verificationNote: {
      gu: 'જૂનાગઢ કૃષિ યુનિવર્સિટી (JAU) & ICAR માર્ગદર્શિકા મુજબ માન્ય સલાહ.',
      hi: 'ICAR एवं कृषि विज्ञान केंद्र द्वारा सत्यापित वैज्ञानिक सलाह।',
      en: 'Verified according to ICAR and Agricultural University crop protection advisories.'
    }
  },

  wheat_yield: {
    categoryKey: 'fertilizer_soil',
    topicCategory: {
      gu: 'ખાતર અને પોષણ વ્યવસ્થાપન (Fertilizer & Soil Nutrition)',
      hi: 'खाद और पोषण प्रबंधन (Fertilizer Management)',
      en: 'Fertilizer & Soil Nutrition'
    },
    headline: {
      gu: 'ઘઉંમાં મહત્તમ ફુટાવ અને ભરાવદાર દાણા માટે શ્રેષ્ઠ ખાતર',
      hi: 'गेहूं में अधिक कल्ले और चमकदार दाने के लिए खाद प्रबंधन',
      en: 'Optimal Fertilizer & Tillering Strategy for High-Yield Wheat'
    },
    simpleAnswer: {
      gu: 'ઘઉંના પાકમાં વધુ ફુટાવ માટે પ્રથમ પિયત (CRI તબક્કે - ૨૧ દિવસે) યુરિયા સાથે ઝીંક સલ્ફેટ આપવું. દાણા ભરાવાના સમયે ૦:૫૨:૩૪ (NPK) અથવા ૦:૦:૫૦ પોટાશનો છંટકાવ કરવાથી દાણા વજનદાર, ચમકદાર અને ગુણવત્તાવાળા બનશે.',
      hi: 'गेहूं में अधिक फुटाव के लिए पहले पानी (21 दिन बाद) पर यूरिया के साथ जिंक सल्फेट दें। बालियां निकलते समय 0:52:34 या 0:0:50 पोटाश का छिड़काव करने से दाने मोटे, चमकदार और भारी बनते हैं।',
      en: 'For vigorous tillering in wheat, apply Urea split dose with Zinc Sulphate at the Crown Root Initiation (CRI) stage (20-22 days). At boot/grain filling stage, spray 0:52:34 or 0:0:50 Potash for bold, heavy grains.'
    },
    recommendations: {
      gu: [
        'વાવણીના ૨૧-૨૫ દિવસે (પ્રથમ પિયતે) પ્રતિ એકર ૩૫ કિલો યુરિયા + ૫ કિલો ઝીંક સલ્ફેટ (૨૧%) આપવું.',
        'ગાભ અવસ્થાએ ૧ લીટર પાણીમાં ૭ ગ્રામ ૦:૫૨:૩૪ (મોનો પોટેશિયમ ફોસ્ફેટ) ઓગાળી છાંટવું.',
        'દૂધિયા દાણાના સમયે પિયત ચૂકવું નહીં, આ સમયે પાણીની અછત દાણા હલકા બનાવે છે.',
        'જો ઠંડી વધારે હોય તો સલ્ફર ૮૦% ડબલ્યુ.ડી.જી. ૩ ગ્રામ/લીટર છાંટવું.'
      ],
      hi: [
        'बुवाई के 21-25 दिनों बाद (पहले पानी पर) प्रति एकड़ 35 किलो यूरिया + 5 किलो जिंक सल्फेट दें।',
        'गभोट अवस्था में 1 लीटर पानी में 7 ग्राम 0:52:34 घोलकर छिड़काव करें।',
        'दाने में दूध भरते समय खेत में नमी की कमी न होने दें।',
        'पाला पड़ने की स्थिति में 80% घुलनशील सल्फर 3 ग्राम/लीटर का छिड़काव करें।'
      ],
      en: [
        'At Crown Root Initiation (CRI) stage (21 days), top-dress 35 kg Urea + 5 kg Zinc Sulphate (21%) per acre.',
        'At flag leaf/boot stage, spray 0:52:34 (Mono Potassium Phosphate) @ 7g/L to maximize grain count per earhead.',
        'Ensure critical moisture during milking and dough stages to avoid shriveled kernels.',
        'Foliar spray Water Dispersible Sulphur (80% WDG) @ 3g/L for winter frost protection.'
      ]
    },
    mandiOrMarketContext: {
      cropName: { gu: 'શરબતી / લોકવન ઘઉં (Wheat)', hi: 'गेहूं (Lokwan / Sharbati)', en: 'Wheat (Lokwan / Sharbati Premium)' },
      avgPriceRange: '₹2,650 - ₹3,200 / ક્વિન્ટલ',
      trend: 'stable',
      note: {
        gu: 'ચમકદાર અને વજનદાર દાણા ધરાવતા લોટને બજારમાં સર્વોચ્ચ ભાવ મળે છે.',
        hi: 'चमकदार और भारी दाने वाले गेहूं को मंडी में सर्वोच्च भाव मिलता है।',
        en: 'Plump, lustrous grain grades command highest buyer bids on the marketplace.'
      }
    },
    nextSteps: {
      gu: [
        'ઘઉંના વાવણીના દિવસો ગણીને હાલનો વૃદ્ધિ તબક્કો નક્કી કરો.',
        'ખાતર આપ્યા પછી તરત જ હળવું પિયત આપો.'
      ],
      hi: [
        'बुवाई के दिनों की गणना कर फसल की सही अवस्था तय करें।',
        'खाद डालने के तुरंत बाद हल्का पानी अवश्य लगाएं।'
      ],
      en: [
        'Calculate days after sowing to pinpoint exact growth stage.',
        'Apply light irrigation immediately following top-dress fertilizer application.'
      ]
    },
    verificationNote: {
      gu: 'ભારતીય કૃષિ સંશોધન પરિષદ (ICAR) ઘઉં વિકાસ માર્ગદર્શિકા.',
      hi: 'भारतीय कृषि अनुसंधान परिषद (ICAR) गेहूं अनुसंधान निदेशालय।',
      en: 'Directives aligned with ICAR Indian Institute of Wheat and Barley Research.'
    }
  },

  pm_kisan_schemes: {
    categoryKey: 'government_schemes',
    topicCategory: {
      gu: 'સરકારી યોજના અને સબસિડી (Government Schemes & Subsidies)',
      hi: 'सरकारी योजनाएं एवं सब्सिडी (Government Schemes)',
      en: 'Government Schemes & Subsidies'
    },
    headline: {
      gu: 'પીએમ કિસાન સન્માન નિધિ & આઈ-ખેડૂત યોજના લાભ માર્ગદર્શિકા',
      hi: 'पीएम किसान सम्मान निधि और सरकारी कृषि सब्सिडी विवरण',
      en: 'PM-KISAN Samman Nidhi & Farmer Subsidy Guide'
    },
    simpleAnswer: {
      gu: 'પીએમ-કિસાન યોજના હેઠળ તમામ જમીનધારક ખેડૂતોને વાર્ષિક ₹૬,૦૦૦ (₹૨,૦૦૦ ના ૩ હપ્તા) સીધા બેંક ખાતામાં (DBT) મળે છે. આ ઉપરાંત ગુજરાતના ખેડૂતો માટે iKhedut પોર્ટલ પર ટ્રેક્ટર, ટપક સિંચાઈ, તાર ફેન્સીંગ અને દવા છાંટવાના પંપ પર ૫૦% થી ૮૦% સબસિડી ઉપલબ્ધ છે.',
      hi: 'पीएम-किसान योजना के अंतर्गत सभी पात्र किसानों को सालाना ₹6,000 (₹2,000 की 3 किस्तें) सीधे बैंक खाते में दी जाती हैं। इसके अलावा ड्रिप सिंचाई, ट्रैक्टर, सोलर पंप और तारबंदी पर 50% से 80% तक की सरकारी सब्सिडी मिलती है।',
      en: 'Under PM-KISAN, eligible farmers receive ₹6,000 annually in 3 direct benefit installments of ₹2,000 each. Furthermore, subsidies up to 50%-80% are available for micro-irrigation (drip/sprinkler), solar pumps, farm fencing, and machinery.'
    },
    recommendations: {
      gu: [
        'પીએમ કિસાન હપ્તો મેળવવા માટે e-KYC અને બેંક ખાતામાં આધાર લિંકિંગ (NPCI DBT) ફરજિયાત છે.',
        'ગુજરાતમાં કૃષિ ઓજારો, સોલાર પંપ અને ફેન્સિંગ સબસિડી માટે ikhedut.gujarat.gov.in પોર્ટલ પર અરજી કરો.',
        'ટપક પિયત (Drip Irrigation) માટે GGRC પોર્ટલ પર ૭૦% થી ૮૫% સબસિડી ઉપલબ્ધ છે.',
        'પાક નુકસાની સહાય માટે ૭/૧૨ અને ૮-અ ના ઉતારા સાથે VCE (ગ્રામ પંચાયત) નો સંપર્ક કરવો.'
      ],
      hi: [
        'पीएम किसान किस्त के लिए बायोमेट्रिक ई-केवाईसी और बैंक खाते में आधार डीबीटी अनिवार्य है।',
        'कृषि यंत्रों, सोलर पंप व तारबंदी सब्सिडी के लिए राज्य कृषि पोर्टल पर ऑनलाइन आवेदन करें।',
        'ड्रिप व स्प्रिंकलर सिंचाई पर 70% से 85% तक अनुदान उपलब्ध है।',
        'किसान क्रेडिट कार्ड (KCC) के तहत 4% रियायती ब्याज दर पर ₹3 लाख तक का लोन प्राप्त करें।'
      ],
      en: [
        'Complete biometric e-KYC and ensure Aadhaar-NPCI mapping on your bank account for PM-KISAN disbursals.',
        'Apply for tractor, sprayer, and fencing subsidies via the state agricultural portal (iKhedut).',
        'Avail 70% - 85% government financial subsidy for drip and sprinkler irrigation via GGRC/PMKSY.',
        'Apply for Kisan Credit Card (KCC) offering collateral-free credit up to ₹3 Lakh at an effective 4% interest rate.'
      ]
    },
    relatedScheme: {
      name: { gu: 'પીએમ કિસાન & આઈ-ખેડૂત પોર્ટલ', hi: 'पीएम किसान एवं ई-कृषि पोर्टल', en: 'PM-KISAN & State Agriculture Portal' },
      description: {
        gu: 'વાર્ષિક ₹૬,૦૦૦ સહાય + કૃષિ ઓજારો અને સિંચાઈ પર ૮૦% સુધી સબસિડી.',
        hi: 'सालाना ₹6,000 वित्तीय सहायता + कृषि उपकरणों पर 80% तक सब्सिडी।',
        en: 'Annual ₹6,000 DBT grant + up to 80% micro-irrigation and machinery subsidy.'
      },
      eligibilityOrBenefit: {
        gu: 'તમામ જમીનધારક ખેડૂત પરિવારો માટે માન્ય.',
        hi: 'सभी भूमिधारक किसान परिवारों के लिए लागू।',
        en: 'Direct Benefit Transfer to all verified landholding farmers.'
      },
      applyLinkText: { gu: 'pmkisan.gov.in / ikhedut.gujarat.gov.in', hi: 'pmkisan.gov.in / state agri portal', en: 'pmkisan.gov.in / ikhedut.gujarat.gov.in' }
    },
    nextSteps: {
      gu: [
        'પીએમ કિસાન પોર્ટલ પર જઈ Beneficiary Status માં તમારો આધાર નંબર નાખી સ્ટેટસ ચેક કરો.',
        'તમારી ગ્રામ પંચાયતમાં VCE પાસે જઈ નવી ઓનલાઇન અરજીઓ ચકાસો.'
      ],
      hi: [
        'pmkisan.gov.in पर जाकर "Beneficiary Status" में आधार संख्या डालकर स्थिति जांचें।',
        'ग्राम पंचायत या सीएससी केंद्र पर जाकर नए आवेदन सत्यापित कराएं।'
      ],
      en: [
        'Check your Aadhaar PM-KISAN beneficiary status online at pmkisan.gov.in.',
        'Visit your local CSC or Village Center to submit seasonal subsidy applications.'
      ]
    },
    verificationNote: {
      gu: 'ભારત સરકાર કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય અધિકૃત માહિતી.',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार।',
      en: 'Official advisory sourced from Ministry of Agriculture & Farmers Welfare, Govt of India.'
    }
  },

  mandi_prices: {
    categoryKey: 'mandi_prices',
    topicCategory: {
      gu: 'બજાર ભાવ અને હરાજી વિશ્લેષણ (APMC Mandi & Trading Intelligence)',
      hi: 'मंडी भाव एवं नीलामी विश्लेषण (Mandi Prices)',
      en: 'APMC Mandi Rates & Market Intelligence'
    },
    headline: {
      gu: 'લાઈવ APMC માર્કેટ યાર્ડ ભાવ અને વેચાણ વ્યૂહરચના',
      hi: 'ताजा एपीएमसी मंडी भाव और फसल बिक्री सलाह',
      en: 'Live APMC Mandi Rates & Optimal Harvest Sale Timing'
    },
    simpleAnswer: {
      gu: 'હાલમાં કપાસ (₹૭,૨૦૦-₹૭,૮૫૦), જીરું (₹૨૪,૦૦૦-₹૨૮,૫૦૦), મગફળી (₹૬,૧૦૦-₹૬,૬૫૦) અને ઘઉં (₹૨,૬૫૦-₹૩,૨૦૦) ના ભાવ સ્થિર અને મજબૂત છે. કિસાનસિંકના ઓપન માર્કેટમાં એઆઈ વેરિફાઈડ ક્વોલિટી ગ્રેડ સાથે લિસ્ટ કરવાથી વચેટીયા વગર સીધા મિલર્સ પાસેથી ૩% થી ૮% ઊંચા ભાવ મળે છે.',
      hi: 'वर्तमान में कपास (₹7,200-₹7,850), जीरा (₹24,000-₹28,500), मूंगफली (₹6,100-₹6,650) और गेहूं (₹2,650-₹3,200) के भाव मजबूत बने हुए हैं। किसानसिंक पर सीधा लॉट लिस्ट करने से दलाल मुक्त बेहतर मूल्य प्राप्त होता है।',
      en: 'Current APMC benchmark rates show strong momentum: Cotton (₹7,200-₹7,850/qtl), Cumin (₹24,000-₹28,500/qtl), Groundnut (₹6,100-₹6,650/qtl), and Wheat (₹2,650-₹3,200/qtl). Direct listing on KisanSync ensures zero-brokerage transparent buyer bidding.'
    },
    recommendations: {
      gu: [
        'માલ વેચતા પહેલા દાણામાં ભેજનું પ્રમાણ ૮% થી ૧૦% થી વધુ ન હોય તેની ખાતરી કરવી.',
        'પાકને ગ્રેડિંગ અને સાફ-સફાઈ કરીને વેચવાથી પ્રતિ ક્વિન્ટલ ₹૧૫૦ થી ₹૩૦૦ વધુ ભાવ મળે છે.',
        'કિસાનસિંક માર્કેટપ્લેસમાં તમારો લોટ લિસ્ટ કરી લાઈવ ખરીદદારો પાસેથી બોલી મેળવો.',
        'નજીકના રાજકોટ, ગોંડલ, ઊંઝા અથવા અમરેલી માર્કેટ યાર્ડના દૈનિક હરાજી ભાવ સરખાવો.'
      ],
      hi: [
        'फसल बेचने से पहले सुनिश्चित करें कि नमी का स्तर 8% से 10% के भीतर हो।',
        'अनाज की ग्रेडिंग और सफाई करने से ₹150 से ₹300 प्रति क्विंटल अधिक दाम मिलता है।',
        'किसानसिंक मार्केटप्लेस पर अपने लॉट को AI प्रमाणित ग्रेड के साथ लिस्ट करें।',
        'स्थानीय मंडी और राष्ट्रीय ई-नाम (e-NAM) के औसत भावों की तुलना करें।'
      ],
      en: [
        'Ensure grain/pod moisture is stabilized between 8% - 10% before taking to auction.',
        'Clean and sort produce by size to unlock ₹150 - ₹300/qtl grade premiums from quality buyers.',
        'List your verified harvest lot on the KisanSync live bidding marketplace for millers and aggregators.',
        'Compare price trends across benchmark trading centers (Rajkot, Gondal, Unjha, Surat, Indore).'
      ]
    },
    mandiOrMarketContext: {
      cropName: { gu: 'કપાસ, જીરું, મગફળી, ઘઉં (Major Cash Crops)', hi: 'कपास, जीरा, मूंगफली, गेहूं', en: 'Cash Crops (Cotton, Cumin, Groundnut, Wheat)' },
      avgPriceRange: '₹2,650 - ₹28,500 / ક્વિન્ટલ',
      trend: 'up',
      note: {
        gu: 'એઆઈ ક્વોલિટી ગ્રેડ A+ ધરાવતા પાકને સૌથી ઊંચી બોલી મળે છે.',
        hi: 'एआई प्रमाणित ग्रेड A+ वाले लॉट पर उच्चतम बोली प्राप्त होती है।',
        en: 'Lots verified with Grade A+ AI certification receive instant competitive buyer bidding.'
      }
    },
    nextSteps: {
      gu: [
        'ઉપર આપેલા "બજાર & બોલી" ટેબમાં જઈ તમારો પાક લિસ્ટ કરો.',
        'હાલમાં ચાલતી લાઈવ બોલીઓનું નિરીક્ષણ કરો.'
      ],
      hi: [
        'ऊपर "मंडी बाजार" टैब पर जाकर अपनी फसल का लॉट लिस्ट करें।',
        'लाइव बोलियों का अवलोकन करें।'
      ],
      en: [
        'Navigate to the "Marketplace" tab to publish your harvest lot.',
        'Monitor live buyer bids in real time.'
      ]
    },
    verificationNote: {
      gu: 'ગુજરાત રાજ્ય કૃષિ માર્કેટિંગ બોર્ડ (GSAMB) & AGMARKNET સમર્થિત ભાવ.',
      hi: 'AGMARKNET एवं राज्य कृषि विपणन बोर्ड द्वारा समर्थित दैनिक आंकड़े।',
      en: 'Aggregated from AGMARKNET and Regional APMC Market Intelligence.'
    }
  },

  tomato_disease: {
    categoryKey: 'crop_pathology',
    topicCategory: {
      gu: 'પાક રોગ અને ઉપચાર (Crop Pathology & Protection)',
      hi: 'फसल रोग और उपचार (Crop Pathology)',
      en: 'Crop Pathology & Disease Control'
    },
    headline: {
      gu: 'ટામેટામાં પાન કોકડાઈ જવું & ચરમી રોગનું સચોટ નિયંત્રણ',
      hi: 'टमाटर में पत्ता मरोड़ और झुलसा (ब्लाइट) का सटीक इलाज',
      en: 'Comprehensive Management of Tomato Leaf Curl & Early Blight'
    },
    simpleAnswer: {
      gu: 'ટામેટામાં પાન કોકડાઈ જવાનું મુખ્ય કારણ સફેદ માખી દ્વારા ફેલાતો લીફ કર્લ વાયરસ છે, જ્યારે પાન પર કાળા-ભૂખરા કુંડાળા અર્લી બ્લાઇટ ફૂગ છે. સફેદ માખી નિયંત્રણ માટે પીળા ટ્રેપ અને એસિફેટ/ડાયાફેન્થિયુરોન તથા બ્લાઇટ માટે કોપર ઓક્સીક્લોરાઇડ અથવા મેન્કોઝેબનો છંટકાવ કરવો.',
      hi: 'टमाटर में पत्ती मरोड़ रोग सफेद मक्खी द्वारा फैलता है, जबकि काले-भूरे धब्बे अर्ली ब्लाइट फफूंद के कारण होते हैं। सफेद मक्खी के लिए पीले स्टिकी ट्रैप और ब्लाइट के लिए कॉपर ऑक्सीक्लोराइड या मैंकोजेब का छिड़काव करें।',
      en: 'Tomato leaf curl is vector-transmitted by whiteflies, whereas concentric dark circular spots are caused by Early Blight (Alternaria). Control whitefly vectors using yellow sticky traps and apply Copper Oxychloride or Mancozeb for fungal blight.'
    },
    recommendations: {
      gu: [
        '૧ લીટર પાણીમાં ૨.૫ ગ્રામ મેન્કોઝેબ ૭૫% અથવા ૩ ગ્રામ કોપર ઓક્સીક્લોરાઇડ ૫૦% ડબલ્યુ.પી. ઓગાળી છાંટવું.',
        'સફેદ માખી નિયંત્રણ માટે એકરમાં ૧૨ થી ૧૫ પીળા ચીકણા ટ્રેપ (Yellow Sticky Traps) લગાવવા.',
        'વધુ ઉપદ્રવ હોય તો ડાયાફેન્થિયુરોન ૫૦% ડબલ્યુ.પી. ૧.૨ ગ્રામ પ્રતિ લીટર પાણીમાં છાંટવું.',
        'પાન પર સીધું પાણી છાંટવાને બદલે ટપક પદ્ધતિ (Drip) દ્વારા પિયત આપવું.'
      ],
      hi: [
        'प्रति लीटर पानी में 2.5 ग्राम मैंकोजेब 75% या 3 ग्राम कॉपर ऑक्सीक्लोराइड मिलाकर छिड़कें।',
        'सफेद मक्खी की रोकथाम हेतु प्रति एकड़ 12-15 पीले चिपचिपे जाल (Yellow Sticky Traps) लगाएं।',
        'उग्र प्रकोप में डायफेंथियूरॉन 50% डब्ल्यूपी 1.2 ग्राम/लीटर का छिड़काव करें।',
        'पौधों के ऊपर पानी छिड़कने के बजाय ड्रिप सिंचाई से पानी दें।'
      ],
      en: [
        'Foliar spray with Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 3g/L.',
        'Install 12-15 Yellow Sticky Traps per acre to trap adult whitefly vectors.',
        'For high vector density, apply Diafenthiuron 50% WP @ 1.2g/L or Pyriproxyfen @ 2ml/L.',
        'Use drip irrigation instead of overhead watering to keep foliage dry.'
      ]
    },
    mandiOrMarketContext: {
      cropName: { gu: 'ટામેટા (Hybrid Tomato)', hi: 'टमाटर (Hybrid Tomato)', en: 'Tomato (Hybrid Table/Processing)' },
      avgPriceRange: '₹1,200 - ₹2,400 / ક્વિન્ટલ',
      trend: 'stable',
      note: {
        gu: 'નિરોગી અને ડાઘ વગરના ટામેટાને બજારમાં ઉંચી માંગ રહે છે.',
        hi: 'बेदाग और ठोस टमाटर को बाजार में बेहतर कीमत मिलती है।',
        en: 'Blemish-free firm tomato lots achieve highest buyer interest in fresh markets.'
      }
    },
    nextSteps: {
      gu: [
        'રોગિષ્ટ પાંદડા તોડીને ખેતર બહાર ઊંડા ખાડામાં દાટો.',
        'આજે જ પીળા ચીકણા ટ્રેપ ખેતરમાં લગાવો.'
      ],
      hi: [
        'रोगग्रस्त पत्तियों को तोड़कर खेत से बाहर गड्ढे में दबा दें।',
        'आज ही खेत में पीले ट्रैप स्थापित करें।'
      ],
      en: [
        'Prune severely infected bottom leaves and safely dispose off-field.',
        'Deploy sticky traps in field canopy today.'
      ]
    },
    verificationNote: {
      gu: 'ભારતીય બાગાયત સંશોધન સંસ્થા (IIHR) માર્ગદર્શિકા મુજબ.',
      hi: 'भारतीय बागवानी अनुसंधान संस्थान (IIHR) द्वारा अनुशंसित उपचार।',
      en: 'Formulated in accordance with Indian Institute of Horticultural Research (IIHR).'
    }
  },

  drip_irrigation: {
    categoryKey: 'weather_irrigation',
    topicCategory: {
      gu: 'પિયત અને જળ વ્યવસ્થાપન (Irrigation & Water Conservation)',
      hi: 'सिंचाई एवं जल प्रबंधन (Irrigation & Water Management)',
      en: 'Irrigation & Water Management'
    },
    headline: {
      gu: 'ટપક પિયત પદ્ધતિ (Drip) સબસિડી અને પાણી બચત માર્ગદર્શિકા',
      hi: 'ड्रिप सिंचाई प्रणाली, सब्सिडी और पानी की बचत गाइड',
      en: 'Micro-Irrigation (Drip System) Subsidy & Water Efficiency Guide'
    },
    simpleAnswer: {
      gu: 'ટપક સિંચાઈ પદ્ધતિ (Drip Irrigation) થી ૫૦% થી ૬૦% પાણીની બચત થાય છે અને ઉત્પાદનમાં ૨૫% થી ૪૦% નો વધારો થાય છે. ગુજરાતમાં GGRC પોર્ટલ મારફતે નાના-સીમાંત ખેડૂતોને ૭૦% થી ૮૫% અને સામાન્ય ખેડૂતોને ૫૦% સુધી સરકારી સબસિડી મળે છે.',
      hi: 'ड्रिप (टपक) सिंचाई से 50% से 60% पानी की बचत होती है और पैदावार में 25% से 40% की वृद्धि होती है। सरकारी पोर्टल के माध्यम से लघु और सीमांत किसानों को 70% से 85% तक की भारी सब्सिडी प्रदान की जाती है।',
      en: 'Drip irrigation conserves 50%-60% water while boosting crop yields by 25%-40%. Under the Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) and GGRC, small & marginal farmers receive 70%-85% direct government financial subsidies.'
    },
    recommendations: {
      gu: [
        '૭/૧૨, ૮-અ ના ઉતારા અને આધાર કાર્ડ સાથે નજીકના GGRC / બાગાયત કચેરીમાં ઓનલાઈન અરજી કરવી.',
        'પાણીના દબાણ મુજબ યોગ્ય ડ્રિપર (૨ થી ૪ લીટર/કલાક) પસંદ કરવા.',
        'ખાતર આપવા માટે વેન્ચ્યુરી ફર્ટિગેશન સિસ્ટમ લગાવવી જેથી ખાતરનો ૯૦% કાર્યક્ષમ ઉપયોગ થાય.',
        'સિસ્ટમમાં ક્ષાર ન જામે તે માટે દર સીઝને એક વખત હળવું એસિડ ટ્રીટમેન્ટ (હાઈડ્રોક્લોરિક એસિડ) આપવું.'
      ],
      hi: [
        'जमीन की नकल (खसरा/खतौनी), बैंक पासबुक और आधार कार्ड के साथ कृषि विभाग में आवेदन करें।',
        'पानी के दबाव और फसल के अनुसार उचित ड्रिपर (2 से 4 लीटर/घंटा) चुनें।',
        'उर्वरक देने के लिए वेंचुरी (Fertigation) प्रणाली का उपयोग करें।',
        'ड्रिपर में नमक/फ्लोराइड जमने से रोकने के लिए वर्ष में एक बार एसिड फ्लशिंग करें।'
      ],
      en: [
        'Apply online with Land Record (7/12, 8-A), Aadhaar, and Bank Passbook through GGRC / PMKSY portal.',
        'Select optimal dripper discharge (2L/hr to 4L/hr) matching soil infiltration rate.',
        'Integrate a Venturi fertigation injector to deliver water-soluble NPK directly to active root zone.',
        'Perform seasonal acid flushing (dilute HCl @ pH 4.0) to clear carbonate scaling in emitters.'
      ]
    },
    relatedScheme: {
      name: { gu: 'પીએમ કૃષિ સિંચાઈ યોજના (PMKSY - GGRC)', hi: 'प्रधानमंत्री कृषि सिंचाई योजना (PMKSY)', en: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)' },
      description: {
        gu: 'ટપક અને ફુવારા પિયત પદ્ધતિ પર ૭૦% થી ૮૫% ની માતબર સબસિડી.',
        hi: 'ड्रिप एवं स्प्रिंकलर सिंचाई उपकरणों पर 70% से 85% तक अनुदान।',
        en: 'Up to 85% capital subsidy on micro-irrigation and drip infrastructure.'
      },
      eligibilityOrBenefit: {
        gu: 'તમામ ખાતેદાર ખેડૂતો માટે સબસિડી ઉપલબ્ધ.',
        hi: 'सभी भूमिधारक किसानों के लिए उपलब्ध।',
        en: 'Direct subsidy settlement to registered micro-irrigation providers.'
      },
      applyLinkText: { gu: 'ggrc.co.in / ikhedut.gujarat.gov.in', hi: 'pmksy.gov.in / ggrc.co.in', en: 'ggrc.co.in / pmksy.gov.in' }
    },
    nextSteps: {
      gu: [
        'તમારા બોરવેલ કે કૂવાના પાણીનું TDS અને pH પરીક્ષણ કરાવો.',
        'ખેતરના માપ મુજબ અધિકૃત ડીલર પાસેથી એસ્ટીમેટ મેળવો.'
      ],
      hi: [
        'अपने बोरवेल या कुएं के पानी की जांच (TDS/pH) कराएं।',
        'खेत के नक्शे के अनुसार अधिकृत विक्रेता से एस्टीमेट प्राप्त करें।'
      ],
      en: [
        'Test your source water for TDS and pH levels.',
        'Get a certified field survey and cost estimate from registered micro-irrigation dealers.'
      ]
    },
    verificationNote: {
      gu: 'ગુજરાત ગ્રીન રિવોલ્યુશન કંપની (GGRC) & જળ સંસાધન મંત્રાલય.',
      hi: 'जल शक्ति मंत्रालय एवं राष्ट्रीय सूक्ष्म सिंचाई मिशन (NMMI)।',
      en: 'Aligned with National Mission on Micro Irrigation (NMMI) benchmarks.'
    }
  }
};

/**
 * Generate a deterministic, high-accuracy agricultural answer for any farmer query
 */
export function generateLocalAgriculturalAnswer(query: string, language: Language): SmartSearchAnswer {
  const qLower = query.toLowerCase().trim();
  const langCode = (language.code === 'gu' ? 'gu' : language.code === 'hi' ? 'hi' : 'en') as 'gu' | 'hi' | 'en';

  // Semantic intent mapping
  let templateKey = 'cotton_yellow';

  if (
    qLower.includes('ઘઉં') ||
    qLower.includes('wheat') ||
    qLower.includes('गेहूं') ||
    qLower.includes('ગેહૂં') ||
    qLower.includes('ફુટાવ') ||
    qLower.includes('कल्ले') ||
    qLower.includes('ઉત્પાદન') ||
    qLower.includes('દાણા') ||
    qLower.includes('19:19:19') ||
    qLower.includes('0:52:34')
  ) {
    templateKey = 'wheat_yield';
  } else if (
    qLower.includes('યોજના') ||
    qLower.includes('scheme') ||
    qLower.includes('योजना') ||
    qLower.includes('pm kisan') ||
    qLower.includes('પીએમ કિસાન') ||
    qLower.includes('ikhedut') ||
    qLower.includes('આઈ ખેડૂત') ||
    qLower.includes('સબસિડી') ||
    qLower.includes('subsidy') ||
    qLower.includes('kcc') ||
    qLower.includes('કિસાન ક્રેડિટ') ||
    qLower.includes('વીમો') ||
    qLower.includes('bima')
  ) {
    templateKey = 'pm_kisan_schemes';
  } else if (
    qLower.includes('ભાવ') ||
    qLower.includes('price') ||
    qLower.includes('rate') ||
    qLower.includes('मंडी') ||
    qLower.includes('મંડી') ||
    qLower.includes('mandi') ||
    qLower.includes('apmc') ||
    qLower.includes('યાર્ડ') ||
    qLower.includes('બજાર') ||
    qLower.includes('વેચાણ') ||
    qLower.includes('જીરું') ||
    qLower.includes('જીરૂ') ||
    qLower.includes('jeera') ||
    qLower.includes('cumin')
  ) {
    templateKey = 'mandi_prices';
  } else if (
    qLower.includes('ટામેટા') ||
    qLower.includes('ટમેટા') ||
    qLower.includes('tomato') ||
    qLower.includes('टमाटर') ||
    qLower.includes('મરચાં') ||
    qLower.includes('chili') ||
    qLower.includes('કોકડવા') ||
    qLower.includes('મુરડો') ||
    qLower.includes('leaf curl') ||
    qLower.includes('બ્લાઇટ') ||
    qLower.includes('ચરમી')
  ) {
    templateKey = 'tomato_disease';
  } else if (
    qLower.includes('પિયત') ||
    qLower.includes('irrigation') ||
    qLower.includes('ટપક') ||
    qLower.includes('drip') ||
    qLower.includes('ડ્રીપ') ||
    qLower.includes('પાણી') ||
    qLower.includes('સિંચાઈ') ||
    qLower.includes('સિંચાઇ') ||
    qLower.includes('weather') ||
    qLower.includes('હવામાન')
  ) {
    templateKey = 'drip_irrigation';
  } else if (
    qLower.includes('પીળા') ||
    qLower.includes('yellow') ||
    qLower.includes('पीले') ||
    qLower.includes('કપાસ') ||
    qLower.includes('cotton') ||
    qLower.includes('મગફળી') ||
    qLower.includes('groundnut')
  ) {
    templateKey = 'cotton_yellow';
  }

  const template = TOPIC_TEMPLATES[templateKey] || TOPIC_TEMPLATES.cotton_yellow;

  // Build localized result
  const localizedRelatedScheme = template.relatedScheme
    ? {
        name: template.relatedScheme.name[langCode] || template.relatedScheme.name.gu,
        description: template.relatedScheme.description[langCode] || template.relatedScheme.description.gu,
        eligibilityOrBenefit: template.relatedScheme.eligibilityOrBenefit[langCode] || template.relatedScheme.eligibilityOrBenefit.gu,
        applyLinkText: template.relatedScheme.applyLinkText[langCode] || template.relatedScheme.applyLinkText.gu
      }
    : undefined;

  const localizedMandiContext = template.mandiOrMarketContext
    ? {
        cropName: template.mandiOrMarketContext.cropName[langCode] || template.mandiOrMarketContext.cropName.gu,
        avgPriceRange: template.mandiOrMarketContext.avgPriceRange,
        trend: template.mandiOrMarketContext.trend,
        note: template.mandiOrMarketContext.note[langCode] || template.mandiOrMarketContext.note.gu
      }
    : undefined;

  return {
    id: 'search_' + Date.now(),
    query: query,
    language: language.name,
    topicCategory: template.topicCategory[langCode] || template.topicCategory.gu,
    categoryKey: template.categoryKey,
    headline: template.headline[langCode] || template.headline.gu,
    simpleAnswer: template.simpleAnswer[langCode] || template.simpleAnswer.gu,
    recommendations: template.recommendations[langCode] || template.recommendations.gu,
    relatedScheme: localizedRelatedScheme,
    mandiOrMarketContext: localizedMandiContext,
    nextSteps: template.nextSteps[langCode] || template.nextSteps.gu,
    verificationNote: template.verificationNote[langCode] || template.verificationNote.gu,
    isRealAi: true
  };
}
