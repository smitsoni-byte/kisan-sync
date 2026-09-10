import { UserReview } from '../types';

export interface LocalizedReviewContent {
  name: string;
  role: string;
  location: string;
  title: string;
  comment: string;
  cropOrTrade?: string;
  verifiedBadge?: string;
}

// Translations for initial review cards across Indian languages
export const REVIEW_TRANSLATIONS: Record<string, Record<string, LocalizedReviewContent>> = {
  en: {
    'rev-1': {
      name: 'Balwinder Singh',
      role: 'Farmer',
      location: 'Ludhiana, Punjab',
      title: 'Saved my paddy crop and got ₹400/qtl higher price!',
      comment: 'KisanSync changed my farming income completely. The AI camera caught leaf rust 5 days before it spread, saving my entire paddy. Then I sold my 180 quintals harvest at ₹400/quintal above local Mandi rates through transparent live bidding!',
      cropOrTrade: 'Basmati Paddy (Grade A+)',
      verifiedBadge: 'Verified Farmer • 180 Qtl Sold'
    },
    'rev-2': {
      name: 'Priya Deshmukh',
      role: 'Farmer',
      location: 'Nashik, Maharashtra',
      title: 'Grade A+ AI certificate builds instant trust with buyers',
      comment: 'Buyers used to doubt my organic claim. Now, KisanSync AI Quality Score gives my tomatoes an A+ verification badge. Bidders compete nationwide right from my mobile phone with zero middleman cuts!',
      cropOrTrade: 'Organic Tomatoes (Grade A+)',
      verifiedBadge: 'Verified Farmer • 45 Qtl Sold'
    },
    'rev-3': {
      name: 'Vikramaditya Rao',
      role: 'Buyer',
      location: 'Hyderabad, Telangana',
      title: 'Zero quality risk for bulk mill procurement',
      comment: 'As a bulk buyer, quality risk is our biggest bottleneck. KisanSync AI crop health ratings allow us to place confident high bids on verified batches with zero middleman markups and guaranteed delivery.',
      cropOrTrade: 'Grains & Pulses Trader',
      verifiedBadge: 'Verified Buyer • 1,200 Qtl Bought'
    },
    'rev-4': {
      name: 'Dr. Arvind Joshi',
      role: 'Agronomist',
      location: 'Anand Agriculture University, Gujarat',
      title: 'Outstanding botanical accuracy and dosage precision',
      comment: 'The cellular pathology diagnostics and organic bio-control prescriptions align rigorously with ICAR agronomic standards. The 6-point diagnosis provides immediate clarity to farmers in their native languages.',
      cropOrTrade: 'Field Pathology Advisory',
      verifiedBadge: 'Certified Agronomist'
    },
    'rev-5': {
      name: 'Harpreet Kaur',
      role: 'Trader',
      location: 'Bathinda, Punjab',
      title: 'Fast bidding settlements and transparent escrow',
      comment: 'Trading wheat and mustard on KisanSync is remarkably fast. The live ledger prevents any underhand bidding and the UPI escrow settlement takes less than 2 hours once the harvest lot arrives.',
      cropOrTrade: 'Wheat & Mustard Wholesale',
      verifiedBadge: 'Wholesale Partner • 650 Qtl Traded'
    }
  },

  gu: {
    'rev-1': {
      name: 'બલવિંદર સિંઘ',
      role: 'ખેડૂત',
      location: 'લુધિયાણા, પંજાબ',
      title: 'મારા ડાંગરના પાકને બચાવ્યો અને ₹૪૦૦/ક્વિન્ટલ ઊંચો ભાવ મળ્યો!',
      comment: 'કિસાનસિંકે મારી ખેતીની આવક સંપૂર્ણ બદલી નાખી. એઆઈ કેમેરાએ ગેરુ રોગ ફેલાવાના ૫ દિવસ પહેલા જ પકડી પાડ્યો, જેથી મારો આખો ડાંગરનો પાક બચી ગયો. પછી મેં ૧૮૦ ક્વિન્ટલ પાક સ્થાનિક યાર્ડ કરતા ₹૪૦૦/ક્વિન્ટલ વધુ ભાવે સીધી લાઈવ હરાજીથી વેચ્યો!',
      cropOrTrade: 'બાસમતી ડાંગર (ગ્રેડ A+)',
      verifiedBadge: 'ચકાસાયેલ ખેડૂત • ૧૮૦ ક્વિન્ટલ વેચાણ'
    },
    'rev-2': {
      name: 'પ્રિયા દેશમુખ',
      role: 'ખેડૂત',
      location: 'નાસિક, મહારાષ્ટ્ર',
      title: 'ગ્રેડ A+ એઆઈ સર્ટિફિકેટથી ખરીદદારોમાં ત્વરિત વિશ્વાસ બેસે છે',
      comment: 'પહેલા વેપારીઓ મારા ઓર્ગેનિક પાક પર શંકા કરતા હતા. હવે કિસાનસિંક એઆઈ ક્વોલિટી સ્કોર મારા ટામેટાંને A+ વેરિફિકેશન બેજ આપે છે. દેશભરના ખરીદદારો દલાલ વિના સીધા મારા ફોન પર ઊંચા ભાવ આપે છે!',
      cropOrTrade: 'ઓર્ગેનિક ટામેટાં (ગ્રેડ A+)',
      verifiedBadge: 'ચકાસાયેલ ખેડૂત • ૪૫ ક્વિન્ટલ વેચાણ'
    },
    'rev-3': {
      name: 'વિક્રમાદિત્ય રાવ',
      role: 'ખરીદદાર',
      location: 'હૈદરાબાદ, તેલંગાણા',
      title: 'જથ્થાબંધ મિલ ખરીદી માટે શૂન્ય ગુણવત્તા જોખમ',
      comment: 'મોટા જથ્થાબંધ ખરીદદાર તરીકે ગુણવત્તાનું જોખમ અમારો મુખ્ય પડકાર હતો. કિસાનસિંકના એઆઈ રેટિંગથી અમે કોઈપણ વચેટિયા વગર ખાતરીપૂર્વકના પાક લોટ પર ઊંચી બોલી લગાવી શકીએ છીએ.',
      cropOrTrade: 'અનાજ અને કઠોળ વેપારી',
      verifiedBadge: 'ચકાસાયેલ ખરીદદાર • ૧,૨૦૦ ક્વિન્ટલ ખરીદી'
    },
    'rev-4': {
      name: 'ડો. અરવિંદ જોશી',
      role: 'કૃષિ વૈજ્ઞાનિક',
      location: 'આણંદ કૃષિ યુનિવર્સિટી, ગુજરાત',
      title: 'અસાધારણ રોગ નિદાન ચોકસાઈ અને સચોટ ડોઝ ભલામણ',
      comment: 'કોષીય સ્તરનું રોગ નિદાન અને ઓર્ગેનિક જૈવિક ઉપચાર સંપૂર્ણપણે ICAR કૃષિ વિજ્ઞાન માપદંડોને અનુરૂપ છે. આ ૬-મુદ્દાનું વિશ્લેષણ ખેડૂતોને પોતાની માતૃભાષામાં ત્વરિત માર્ગદર્શન પૂરું પાડે છે.',
      cropOrTrade: 'પાક રોગ નિદાન સલાહકાર',
      verifiedBadge: 'પ્રમાણિત કૃષિ વૈજ્ઞાનિક'
    },
    'rev-5': {
      name: 'હરપ્રીત કૌર',
      role: 'વેપારી',
      location: 'બઠિંડા, પંજાબ',
      title: 'ઝડપી હરાજી પતાવટ અને પારદર્શક એસ્ક્રો પેમેન્ટ',
      comment: 'કિસાનસિંક પર ઘઉં અને રાઈનો વેપાર ખૂબ ઝડપી છે. લાઈવ લેજરથી કોઈપણ ગેરરીતિ અટકે છે અને પાક પહોંચ્યા પછી ૨ કલાકની અંદર UPI એસ્ક્રો દ્વારા સીધું પેમેન્ટ મળી જાય છે.',
      cropOrTrade: 'ઘઉં અને રાઈ જથ્થાબંધ વેપાર',
      verifiedBadge: 'જથ્થાબંધ પાર્ટનર • ૬૫૦ ક્વિન્ટલ વેપાર'
    }
  },

  hi: {
    'rev-1': {
      name: 'बलविंदर सिंह',
      role: 'किसान',
      location: 'लुधियाना, पंजाब',
      title: 'मेरी धान की फसल बचाई और ₹400/क्विंटल अधिक भाव मिला!',
      comment: 'किसानसिंक ने मेरी खेती की कमाई पूरी तरह बदल दी। एआई कैमरे ने रतुआ रोग फैलने से ५ दिन पहले ही पहचान लिया और मेरी पूरी धान बच गई। इसके बाद पारदर्शी लाइव नीलामी से मैंने अपनी १८० क्विंटल फसल स्थानीय मंडी से ₹४००/क्विंटल ज्यादा भाव में बेची!',
      cropOrTrade: 'बासमती धान (ग्रेड A+)',
      verifiedBadge: 'सत्यापित किसान • १८० क्विंटल बेचा'
    },
    'rev-2': {
      name: 'प्रिया देशमुख',
      role: 'किसान',
      location: 'नासिक, महाराष्ट्र',
      title: 'ग्रेड A+ एआई प्रमाणपत्र से खरीदारों का तुरंत भरोसा मिलता है',
      comment: 'पहले खरीदार मेरे जैविक दावे पर शक करते थे। अब किसानसिंक एआई क्वालिटी स्कोर मेरे टमाटरों को A+ सत्यापन बैज देता है। पूरे देश के व्यापारी बिना किसी बिचौलिये के सीधे मेरे मोबाइल पर बोली लगाते हैं!',
      cropOrTrade: 'जैविक टमाटर (ग्रेड A+)',
      verifiedBadge: 'सत्यापित किसान • ४५ क्विंटल बेचा'
    },
    'rev-3': {
      name: 'विक्रमादित्य राव',
      role: 'खरीदार',
      location: 'हैदराबाद, तेलंगाना',
      title: 'थोक मिल खरीद के लिए शून्य गुणवत्ता जोखिम',
      comment: 'थोक खरीदार के रूप में गुणवत्ता जोखिम हमारी सबसे बड़ी समस्या थी। किसानसिंक एआई फसल रेटिंग हमें बिना बिचौलियों के प्रमाणित लॉट पर सुरक्षित और ऊंची बोली लगाने की सुविधा देती है।',
      cropOrTrade: 'अनाज एवं दलहन व्यापारी',
      verifiedBadge: 'सत्यापित खरीदार • १,२०० क्विंटल खरीदा'
    },
    'rev-4': {
      name: 'डॉ. अरविंद जोशी',
      role: 'कृषि वैज्ञानिक',
      location: 'आनंद कृषि विश्वविद्यालय, गुजरात',
      title: 'उत्कृष्ट पादप सटीकता और सटीक जैविक उपचार सलाह',
      comment: 'कोशिकीय रोग निदान और जैविक नियंत्रण के उपाय पूरी तरह से आईसीएआर (ICAR) मानकों के अनुरूप हैं। यह ६-सूत्रीय निदान किसानों को उनकी अपनी भाषा में तुरंत स्पष्ट मार्गदर्शन देता है।',
      cropOrTrade: 'फसल रोग विशेषज्ञ परामर्श',
      verifiedBadge: 'प्रमाणित कृषि वैज्ञानिक'
    },
    'rev-5': {
      name: 'हरप्रीत कौर',
      role: 'व्यापारी',
      location: 'बठिंडा, पंजाब',
      title: 'त्वरित नीलामी निपटान और पारदर्शी एस्क्रो भुगतान',
      comment: 'किसानसिंक पर गेहूं और सरसों का व्यापार बेहद तेज और सुरक्षित है। लाइव लेज़र से धांधली रुकती है और माल पहुंचते ही यूपीआई एस्क्रो द्वारा २ घंटे के अंदर पूरा भुगतान मिल जाता है।',
      cropOrTrade: 'गेहूं एवं सरसों थोक व्यापार',
      verifiedBadge: 'थोक साझेदार • ६५० क्विंटल व्यापार'
    }
  },

  pa: {
    'rev-1': {
      name: 'ਬਲਵਿੰਦਰ ਸਿੰਘ',
      role: 'ਕਿਸਾਨ',
      location: 'ਲੁਧਿਆਣਾ, ਪੰਜਾਬ',
      title: 'ਝੋਨੇ ਦੀ ਫਸਲ ਬਚਾਈ ਅਤੇ ₹400/ਕੁਇੰਟਲ ਵੱਧ ਭਾਅ ਮਿਲਿਆ!',
      comment: 'ਕਿਸਾਨਸਿੰਕ ਨੇ ਮੇਰੀ ਖੇਤੀ ਆਮਦਨ ਬਦਲ ਦਿੱਤੀ। ਏਆਈ ਕੈਮਰੇ ਨੇ ਪੀਲੀ ਕੁੰਗੀ ਫੈਲਣ ਤੋਂ 5 ਦਿਨ ਪਹਿਲਾਂ ਹੀ ਫੜ ਲਈ, ਜਿਸ ਨਾਲ ਮੇਰਾ ਸਾਰਾ ਝੋਨਾ ਬਚ ਗਿਆ। ਫਿਰ ਮੈਂ 180 ਕੁਇੰਟਲ ਫਸਲ ਸਿੱਧੀ ਬੋਲੀ ਰਾਹੀਂ ₹400/ਕੁਇੰਟਲ ਵੱਧ ਭਾਅ ਤੇ ਵੇਚੀ!',
      cropOrTrade: 'ਬਾਸਮਤੀ ਝੋਨਾ (ਗ੍ਰੇਡ A+)',
      verifiedBadge: 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨ • 180 ਕੁਇੰਟਲ ਵੇਚਿਆ'
    },
    'rev-2': {
      name: 'ਪ੍ਰਿਆ ਦੇਸ਼ਮੁਖ',
      role: 'ਕਿਸਾਨ',
      location: 'ਨਾਸਿਕ, ਮਹਾਂਰਾਸ਼ਟਰ',
      title: 'ਗ੍ਰੇਡ A+ ਏਆਈ ਸਰਟੀਫਿਕੇਟ ਨਾਲ ਖਰੀਦਦਾਰਾਂ ਦਾ ਤੁਰੰਤ ਵਿਸ਼ਵਾਸ ਬਣਦਾ ਹੈ',
      comment: 'ਪਹਿਲਾਂ ਵਪਾਰੀ ਮੇਰੀ ਜੈਵਿਕ ਫਸਲ ਤੇ ਸ਼ੱਕ ਕਰਦੇ ਸਨ। ਹੁਣ ਕਿਸਾਨਸਿੰਕ ਏਆਈ ਸਕੋਰ ਮੇਰੇ ਟਮਾਟਰਾਂ ਨੂੰ A+ ਬੈਜ ਦਿੰਦਾ ਹੈ। ਪੂਰੇ ਦੇਸ਼ ਦੇ ਖਰੀਦਦਾਰ ਬਿਨਾਂ ਆੜ੍ਹਤੀਏ ਦੇ ਮੇਰੇ ਮੋਬਾਈਲ ਤੇ ਉੱਚੀ ਬੋਲੀ ਲਗਾਉਂਦੇ ਹਨ!',
      cropOrTrade: 'ਜੈਵਿਕ ਟਮਾਟਰ (ਗ੍ਰੇਡ A+)',
      verifiedBadge: 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨ • 45 ਕੁਇੰਟਲ ਵੇਚਿਆ'
    },
    'rev-3': {
      name: 'ਵਿਕਰਮਾਦਿਤਿਆ ਰਾਓ',
      role: 'ਖਰੀਦਦਾਰ',
      location: 'ਹੈਦਰਾਬਾਦ, ਤੇਲੰਗਾਨਾ',
      title: 'ਥੋਕ ਮਿੱਲ ਖਰੀਦ ਲਈ ਜ਼ੀਰੋ ਕੁਆਲਿਟੀ ਜੋਖਮ',
      comment: 'ਥੋਕ ਖਰੀਦਦਾਰ ਵਜੋਂ ਗੁਣਵੱਤਾ ਸਾਡੀ ਸਭ ਤੋਂ ਵੱਡੀ ਚਿੰਤਾ ਸੀ। ਕਿਸਾਨਸਿੰਕ ਏਆਈ ਰੇਟਿੰਗ ਨਾਲ ਅਸੀਂ ਬਿਨਾਂ ਵਿਚੋਲੇ ਦੇ ਭਰੋਸੇਯੋਗ ਲਾਟ ਉੱਤੇ ਉੱਚੀ ਬੋਲੀ ਲਗਾਉਂਦੇ ਹਾਂ।',
      cropOrTrade: 'ਅਨਾਜ ਅਤੇ ਦਾਲਾਂ ਵਪਾਰੀ',
      verifiedBadge: 'ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ • 1,200 ਕੁਇੰਟਲ ਖਰੀਦਿਆ'
    },
    'rev-4': {
      name: 'ਡਾ. ਅਰਵਿੰਦ ਜੋਸ਼ੀ',
      role: 'ਖੇਤੀ ਵਿਗਿਆਨੀ',
      location: 'ਆਨੰਦ ਐਗਰੀਕਲਚਰ ਯੂਨੀਵਰਸਿਟੀ, ਗੁਜਰਾਤ',
      title: 'ਸ਼ਾਨਦਾਰ ਰੋਗ ਜਾਂਚ ਸ਼ੁੱਧਤਾ ਅਤੇ ਸਹੀ ਜੈਵਿਕ ਇਲਾਜ',
      comment: 'ਪੌਦਿਆਂ ਦੇ ਰੋਗਾਂ ਦਾ ਨਿਦਾਨ ਅਤੇ ਜੈਵਿਕ ਇਲਾਜ ICAR ਦੇ ਮਾਪਦੰਡਾਂ ਮੁਤਾਬਕ ਹੈ। ਇਹ ਜਾਂਚ ਕਿਸਾਨਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਤੁਰੰਤ ਸਹੀ ਸਲਾਹ ਦਿੰਦੀ ਹੈ।',
      cropOrTrade: 'ਫਸਲ ਰੋਗ ਸਲਾਹਕਾਰ',
      verifiedBadge: 'ਪ੍ਰਮਾਣਿਤ ਖੇਤੀ ਵਿਗਿਆਨੀ'
    },
    'rev-5': {
      name: 'ਹਰਪ੍ਰੀਤ ਕੌਰ',
      role: 'ਵਪਾਰੀ',
      location: 'ਬਠਿੰਡਾ, ਪੰਜਾਬ',
      title: 'ਤੇਜ਼ ਬੋਲੀ ਨਿਪਟਾਰਾ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਐਸਕਰੋ ਭੁਗਤਾਨ',
      comment: 'ਕਿਸਾਨਸਿੰਕ ਤੇ ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਦਾ ਵਪਾਰ ਬਹੁਤ ਤੇਜ਼ ਹੈ। ਲਾਈਵ ਲੇਜਰ ਧੋਖਾਧੜੀ ਰੋਕਦਾ ਹੈ ਅਤੇ ਮਾਲ ਪਹੁੰਚਣ ਤੇ 2 ਘੰਟਿਆਂ ਵਿੱਚ UPI ਰਾਹੀਂ ਪੈਸੇ ਮਿਲ ਜਾਂਦੇ ਹਨ।',
      cropOrTrade: 'ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਥੋਕ ਵਪਾਰ',
      verifiedBadge: 'ਥੋਕ ਭਾਈਵਾਲ • 650 ਕੁਇੰਟਲ ਵਪਾਰ'
    }
  },

  mr: {
    'rev-1': {
      name: 'बलविंदर सिंग',
      role: 'शेतकरी',
      location: 'लुधियाना, पंजाब',
      title: 'माझे भाताचे पीक वाचवले आणि ₹४००/क्विंटल जास्त भाव मिळवला!',
      comment: 'किसानसिंकने माझी शेतीची कमाई पूर्णपणे बदलून टाकली. एआय कॅमेऱ्याने तांबेरा रोग पसरण्यापूर्वी ५ दिवस आधीच पकडला. त्यानंतर थेट लिलावाद्वारे १८० क्विंटल भात स्थानिक बाजारपेठेपेक्षा ₹४००/क्विंटल जास्त भावाने विकला!',
      cropOrTrade: 'बासमती भात (ग्रेड A+)',
      verifiedBadge: 'प्रमाणित शेतकरी • १८० क्विंटल विक्री'
    },
    'rev-2': {
      name: 'प्रिया देशमुख',
      role: 'शेतकरी',
      location: 'नाशिक, महाराष्ट्र',
      title: 'ग्रेड A+ एआय प्रमाणपत्राने खरेदीदारांचा त्वरित विश्वास बसतो',
      comment: 'आधी व्यापारी माझ्या सेंद्रिय दाव्यावर शंका घेत असत. आता किसानसिंक एआय क्वालिटी स्कोअर माझ्या टोमॅटोला A+ बॅज देतो. देशभरातील खरेदीदार मध्यस्थांशिवाय थेट माझ्या मोबाईलवरून जास्त बोली लावतात!',
      cropOrTrade: 'सेंद्रिय टोमॅटो (ग्रेड A+)',
      verifiedBadge: 'प्रमाणित शेतकरी • ४५ क्विंटल विक्री'
    },
    'rev-3': {
      name: 'विक्रमादित्य राव',
      role: 'खरेदीदार',
      location: 'हैदराबाद, तेलंगणा',
      title: 'मोठ्या प्रमाणात खरेदीसाठी शून्य गुणवत्ता जोखीम',
      comment: 'घाऊक खरेदीदार म्हणून गुणवत्ता जोखीम आमची सर्वात मोठी अडचण होती. किसानसिंक एआय पीक रेटिंगमुळे आम्ही दलालांशिवाय प्रमाणित पिकावर आत्मविश्वासाने जास्त बोली लावू शकतो.',
      cropOrTrade: 'धान्य व कडधान्य व्यापारी',
      verifiedBadge: 'प्रमाणित खरेदीदार • १,२०० क्विंटल खरेदी'
    },
    'rev-4': {
      name: 'डॉ. अरविंद जोशी',
      role: 'कृषी शास्त्रज्ञ',
      location: 'आनंद कृषी विद्यापीठ, गुजरात',
      title: 'उत्कृष्ट वनस्पती अचूकता आणि अचूक सेंद्रिय उपाय',
      comment: 'सेल्युलर पॅथॉलॉजी निदान आणि सेंद्रिय नियंत्रण उपाय ICAR मानकांनुसार आहेत. हे ६-मुद्द्यांचे विश्लेषण शेतकऱ्यांना त्यांच्या स्वतःच्या भाषेत त्वरित स्पष्ट मार्गदर्शन देते.',
      cropOrTrade: 'पीक रोग सल्लागार',
      verifiedBadge: 'प्रमाणित कृषी शास्त्रज्ञ'
    },
    'rev-5': {
      name: 'हरप्रीत कौर',
      role: 'व्यापारी',
      location: 'बठिंडा, पंजाब',
      title: 'जलद लिलाव पूर्तता आणि पारदर्शक एस्क्रो पेमेंट',
      comment: 'किसानसिंकवर गहू आणि मोहरीचा व्यापार अतिशय जलद होतो. थेट लेजरमुळे गैरव्यवहार टळतो आणि माल पोहोचल्यानंतर २ तासांच्या आत UPI द्वारे संपूर्ण रक्कम मिळते.',
      cropOrTrade: 'गहू व मोहरी घाऊक व्यापार',
      verifiedBadge: 'घाऊक भागीदार • ६५० क्विंटल व्यापार'
    }
  },

  bn: {
    'rev-1': {
      name: 'বলবিন্দর সিং',
      role: 'কৃষক',
      location: 'লুধিয়ানা, পাঞ্জাব',
      title: 'আমার ধানের ফসল বাঁচিয়েছে এবং ₹৪০০/কুইন্টাল বেশি দাম পেয়েছি!',
      comment: 'কিসানসিঙ্ক আমার চাষের আয় সম্পূর্ণ বদলে দিয়েছে। এআই ক্যামেরা মরিচা রোগ ছড়ানোর ৫ দিন আগেই শনাক্ত করে। এরপর স্বচ্ছ নিলামের মাধ্যমে স্থানীয় বাজারের চেয়ে ₹৪০০/কুইন্টাল বেশি দামে ১৮০ কুইন্টাল ধান বিক্রি করেছি!',
      cropOrTrade: 'বাসমতী ধান (গ্রেড A+)',
      verifiedBadge: 'যাচাইকৃত কৃষক • ১৮০ কুইন্টাল বিক্রি'
    },
    'rev-2': {
      name: 'প্রিয়া দেশমুখ',
      role: 'কৃষক',
      location: 'নাসিক, মহারাষ্ট্র',
      title: 'গ্রেড A+ এআই সার্টিফিকেট ক্রেতাদের তাত্ক্ষণিক আস্থা তৈরি করে',
      comment: 'আগে ব্যবসায়ীরা আমার জৈব ফসলে সন্দেহ করতেন। এখন কিসানসিঙ্ক এআই স্কোর আমার টমেটোকে A+ ব্যাজ দেয়। সারা দেশের ক্রেতারা মধ্যস্বত্বভোগী ছাড়াই সরাসরি আমার মোবাইলে ডাক হাঁকেন!',
      cropOrTrade: 'জৈব টমেটো (গ্রেড A+)',
      verifiedBadge: 'যাচাইকৃত কৃষক • ৪৫ কুইন্টাল বিক্রি'
    },
    'rev-3': {
      name: 'বিক্রমাদিত্য রাও',
      role: 'ক্রেতা',
      location: 'হায়দ্রাবাদ, তেলেঙ্গানা',
      title: 'পাইকারি মিল সংগ্রহের জন্য শূন্য গুণমান ঝুঁকি',
      comment: 'পাইকারি ক্রেতা হিসাবে মানের ঝুঁকি ছিল সবচেয়ে বড় সমস্যা। কিসানসিঙ্ক এআই রেটিং আমাদের কোনো দালাল ছাড়াই যাচাইকৃত ফসলে আত্মবিশ্বাসের সাথে বেশি দাম দিতে সাহায্য করে।',
      cropOrTrade: 'শস্য ও ডাল ব্যবসায়ী',
      verifiedBadge: 'যাচাইকৃত ক্রেতা • ১,২০০ কুইন্টাল ক্রয়'
    },
    'rev-4': {
      name: 'ড. অরবিন্দ জোশী',
      role: 'কৃষি বিজ্ঞানী',
      location: 'আনন্দ কৃষি বিশ্ববিদ্যালয়, গুজরাট',
      title: 'অসামান্য উদ্ভিদ রোগ নির্ণয় এবং সুনির্দিষ্ট জৈব প্রতিকার',
      comment: 'সেলুলার প্যাথলজি ডায়াগনস্টিকস এবং জৈব নিয়ন্ত্রণ ব্যবস্থা সম্পূর্ণভাবে ICAR মানদণ্ডের সাথে সঙ্গতিপূর্ণ। এই ৬-দফা রোগ নির্ণয় কৃষকদের নিজস্ব ভাষায় তাৎক্ষণিক দিকনির্দেশনা দেয়।',
      cropOrTrade: 'ফসল রোগ উপদেষ্টা',
      verifiedBadge: 'প্রত্যয়িত কৃষিবিদ'
    },
    'rev-5': {
      name: 'হরপ্রীত কৌর',
      role: 'ব্যবসায়ী',
      location: 'ভাটিণ্ডা, পাঞ্জাব',
      title: 'দ্রুত নিলাম নিষ্পত্তি এবং স্বচ্ছ এসক্রো পেমেন্ট',
      comment: 'কিসানসিঙ্কে গম ও সরিষা বাণিজ্য অত্যন্ত দ্রুত। লাইভ লেজার অনিয়ম রোধ করে এবং ফসল পৌঁছানোর ২ ঘণ্টার মধ্যে UPI এসক্রোর মাধ্যমে সরাসরি সম্পূর্ণ পেমেন্ট নিষ্পত্তি হয়।',
      cropOrTrade: 'গম ও সরিষা পাইকারি',
      verifiedBadge: 'পাইকারি অংশীদার • ৬৫০ কুইন্টাল বাণিজ্য'
    }
  },

  ta: {
    'rev-1': {
      name: 'பல்விந்தர் சிங்',
      role: 'விவசாயி',
      location: 'லூதியானா, பஞ்சாப்',
      title: 'என் நெற்பயிரை காப்பாற்றி ₹400/குவின்டால் கூடுதல் விலை பெற்றுத் தந்தது!',
      comment: 'கிசான்சின்க் என் விவசாய வருமானத்தை முழுமையாக மாற்றியது. ஏஐ கேமரா இலை துரு நோயை பரவுவதற்கு 5 நாட்களுக்கு முன்பே கண்டறிந்தது. பின்னர் 180 குவின்டால் நெல்லை நேரடி ஏலம் மூலம் சந்தை விலையை விட ₹400/குவின்டால் கூடுதல் விலைக்கு விற்றேன்!',
      cropOrTrade: 'பாசுமதி நெல் (தரம் A+)',
      verifiedBadge: 'சரிபார்க்கப்பட்ட விவசாயி • 180 குவின்டால் விற்பனை'
    },
    'rev-2': {
      name: 'பிரியா தேஷ்முக்',
      role: 'விவசாயி',
      location: 'நாசிக், மகாராஷ்டிரா',
      title: 'கிரேடு A+ ஏஐ சான்றிதழ் வாங்குபவர்களிடம் உடனடி நம்பிக்கையை ஏற்படுத்துகிறது',
      comment: 'முன்பு வியாபாரிகள் என் இயற்கை விவசாயத்தை சந்தேகித்தனர். இப்போது கிசான்சின்க் ஏஐ தரம் என் தக்காளிக்கு A+ பேட்ஜ் வழங்குகிறது. நாடு முழுவதும் உள்ள வாங்குபவர்கள் இடைத்தரகர்கள் இன்றி என் மொபைலிலேயே போட்டி போட்டு ஏலம் எடுக்கின்றனர்!',
      cropOrTrade: 'இயற்கை தக்காளி (தரம் A+)',
      verifiedBadge: 'சரிபார்க்கப்பட்ட விவசாயி • 45 குவின்டால் விற்பனை'
    },
    'rev-3': {
      name: 'விக்ரமாதித்யா ராவ்',
      role: 'வாங்குபவர்',
      location: 'ஹைதராபாத், தெலங்கானா',
      title: 'மொத்த மில் கொள்முதலுக்கு பூஜ்ஜிய தர ஆபத்து',
      comment: 'மொத்த வாங்குபவராக தர ஆபத்தே எங்கள் முக்கிய சவாலாக இருந்தது. கிசான்சின்க் ஏஐ மதிப்பீடுகள் இடைத்தரகர்கள் இன்றி உறுதிப்படுத்தப்பட்ட பயிர்களுக்கு நம்பிக்கையுடன் அதிக ஏலத்தொகை வைக்க உதவுகின்றன.',
      cropOrTrade: 'தானியங்கள் & பருப்பு வியாபாரி',
      verifiedBadge: 'சரிபார்க்கப்பட்ட வாங்குபவர் • 1,200 குவின்டால் கொள்முதல்'
    },
    'rev-4': {
      name: 'டாக்டர் அரவிந்த் ஜோஷி',
      role: 'வேளாண் விஞ்ஞானி',
      location: 'ஆனந்த் வேளாண் பல்கலைக்கழகம், குஜராத்',
      title: 'சிறந்த தாவரவியல் துல்லியம் மற்றும் இயற்கை சிகிச்சை முறை',
      comment: 'செல் நோயியல் கண்டறிதல் மற்றும் இயற்கை கட்டுப்பாட்டு பரிந்துரைகள் ICAR வேளாண் தரநிலைகளுடன் ஒத்துப்போகின்றன. இந்த 6-புள்ளி கண்டறிதல் விவசாயிகளுக்கு தங்கள் சொந்த மொழியிலேயே உடனடி தெளிவை அளிக்கிறது.',
      cropOrTrade: 'பயிர் நோய் ஆலோசனை',
      verifiedBadge: 'சான்றளிக்கப்பட்ட வேளாண் வல்லுநர்'
    },
    'rev-5': {
      name: 'ஹர்ப்ரீத் கவுர்',
      role: 'வியாபாரி',
      location: 'பதிண்டா, பஞ்சாப்',
      title: 'விரைவான ஏல தீர்வு மற்றும் வெளிப்படையான எஸ்க்ரோ கட்டணம்',
      comment: 'கிசான்சின்கில் கோதுமை மற்றும் கடுகு வர்த்தகம் மிக விரைவானது. நேரடி பதிவேடு முறைகேடுகளை தடுக்கிறது மற்றும் பயிர் வந்த 2 மணி நேரத்திற்குள் UPI மூலம் முழு தொகையும் செலுத்தப்படுகிறது.',
      cropOrTrade: 'கோதுமை & கடுகு மொத்த விற்பனை',
      verifiedBadge: 'மொத்த விற்பனை கூட்டாளி • 650 குவின்டால் வர்த்தகம்'
    }
  },

  te: {
    'rev-1': {
      name: 'బల్విందర్ సింగ్',
      role: 'రైతు',
      location: 'లూధియానా, పంజాబ్',
      title: 'నా వరి పంటను రక్షించి ₹400/క్వింటాల్ ఎక్కువ ధర అందించింది!',
      comment: 'కిసాన్‌సింక్ నా వ్యవసాయ ఆదాయాన్ని పూర్తిగా మార్చివేసింది. వ్యాపించడానికి 5 రోజుల ముందే ఏఐ కెమెరా తుప్పు తెగులును గుర్తించి నా వరి పంటను కాపాడింది. తర్వాత 180 క్వింటాళ్ల దిగుబడిని మార్కెట్ కంటే ₹400/క్వింటాల్ అధిక ధరకు ప్రత్యక్ష వేలంలో అమ్మాను!',
      cropOrTrade: 'బాస్మతి వరి (గ్రేడ్ A+)',
      verifiedBadge: 'ధృవీకరించబడిన రైతు • 180 క్వింటాళ్లు అమ్మారు'
    },
    'rev-2': {
      name: 'ప్రియా దేశ్‌ముఖ్',
      role: 'రైతు',
      location: 'నాసిక్, మహారాష్ట్ర',
      title: 'గ్రేడ్ A+ ఏఐ సర్టిఫికేట్ కొనుగోలుదారులలో తక్షణ నమ్మకాన్ని పెంచుతుంది',
      comment: 'గతంలో వ్యాపారులు నా సేంద్రీయ పంటను అనుమానించేవారు. ఇప్పుడు కిసాన్‌సింక్ ఏఐ క్వాలిటీ స్కోర్ నా టమాటాలకు A+ ధృవీకరణ బ్యాడ్జ్ ఇస్తుంది. దేశవ్యాప్త వ్యాపారులు దళారులు లేకుండా నేరుగా నా ఫోన్ ద్వారా వేలం వేస్తారు!',
      cropOrTrade: 'సేంద్రీయ టమాటాలు (గ్రేడ్ A+)',
      verifiedBadge: 'ధృవీకరించబడిన రైతు • 45 క్వింటాళ్లు అమ్మారు'
    },
    'rev-3': {
      name: 'విక్రమాదిత్య రావు',
      role: 'కొనుగోలుదారు',
      location: 'హైదరాబాద్, తెలంగాణ',
      title: 'హోల్‌సేల్ మిల్లు కొనుగోళ్లకు సున్నా నాణ్యత రిస్క్',
      comment: 'హోల్‌సేల్ కొనుగోలుదారుగా నాణ్యత రిస్క్ మాకు అతిపెద్ద సవాలు. కిసాన్‌సింక్ ఏఐ పంట రేటింగ్‌ల వల్ల మేము మధ్యవర్తులు లేకుండా ధృవీకరించిన పంటలపై ధైర్యంగా అధిక వేలం వేయగలుగుతున్నాము.',
      cropOrTrade: 'ధాన్యాలు & పప్పుధాన్యాల వ్యాపారి',
      verifiedBadge: 'ధృవీకరించబడిన కొనుగోలుదారు • 1,200 క్వింటాళ్లు కొనుగోలు'
    },
    'rev-4': {
      name: 'డాక్టర్ అరవింద్ జోషి',
      role: 'వ్యవసాయ శాస్త్రవేత్త',
      location: 'ఆనంద్ అగ్రికల్చర్ యూనివర్సిటీ, గుజరాత్',
      title: 'అద్భుతమైన తెగుళ్ల గుర్తింపు ఖచ్చితత్వం మరియు సహజ నివారణ మార్గాలు',
      comment: 'కణ స్థాయి వ్యాధి నిర్ధారణ మరియు సేంద్రీయ నియంత్రణ పద్ధతులు ICAR వ్యవసాయ ప్రమాణాలకు అనుగుణంగా ఉన్నాయి. ఈ 6-పాయింట్ల విశ్లేషణ రైతులకు వారి మాతృభాషలోనే తక్షణ స్పష్టతను ఇస్తుంది.',
      cropOrTrade: 'పంట వ్యాధి నిపుణుల సలహా',
      verifiedBadge: 'సర్టిఫైడ్ అగ్రోనమిస్ట్'
    },
    'rev-5': {
      name: 'హర్‌ప్రీత్ కౌర్',
      role: 'వ్యాపారి',
      location: 'భటిండా, పంజాబ్',
      title: 'వేగవంతమైన వేలం చెల్లింపులు మరియు పారదర్శక ఎస్క్రో సేవలు',
      comment: 'కిసాన్‌సింక్‌లో గోధుమలు, ఆవాల వ్యాపారం చాలా వేగంగా జరుగుతుంది. లైవ్ లెడ్జర్ మోసాలను నివారిస్తుంది మరియు పంట చేరిన 2 గంటల్లోనే UPI ద్వారా మొత్తం చెల్లింపు పూర్తవుతుంది.',
      cropOrTrade: 'గోధుమలు & ఆవాల హోల్‌సేల్',
      verifiedBadge: 'హోల్‌సేల్ భాగస్వామి • 650 క్వింటాళ్ల వ్యాపారం'
    }
  },

  kn: {
    'rev-1': {
      name: 'ಬಲ್ವಿಂದರ್ ಸಿಂಗ್',
      role: 'ರೈತ',
      location: 'ಲುಧಿಯಾನ, ಪಂಜಾಬ್',
      title: 'ನನ್ನ ಭತ್ತದ ಬೆಳೆ ಉಳಿಸಿತು ಮತ್ತು ₹400/ಕ್ವಿಂಟಾಲ್ ಅಧಿಕ ಬೆಲೆ ತಂದುಕೊಟ್ಟಿತು!',
      comment: 'ಕಿಸಾನ್‌ಸಿಂಕ್ ನನ್ನ ಕೃಷಿ ಆದಾಯವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಬದಲಾಯಿಸಿದೆ. ಎಐ ಕ್ಯಾಮೆರಾ ತುಕ್ಕು ರೋಗ ಹರಡುವ 5 ದಿನಗಳ ಮೊದಲೇ ಪತ್ತೆಹಚ್ಚಿ ನನ್ನ ಭತ್ತದ ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸಿತು. ನಂತರ 180 ಕ್ವಿಂಟಾಲ್ ಇಳುವರಿಯನ್ನು ಮಾರುಕಟ್ಟೆಗಿಂತ ₹400/ಕ್ವಿಂಟಾಲ್ ಅಧಿಕ ಬೆಲೆಗೆ ನೇರ ಹರಾಜಿನಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿದೆ!',
      cropOrTrade: 'ಬಾಸ್ಮತಿ ಭತ್ತ (ಗ್ರೇಡ್ A+)',
      verifiedBadge: 'ದೃಢೀಕೃತ ರೈತ • 180 ಕ್ವಿಂಟಾಲ್ ಮಾರಾಟ'
    },
    'rev-2': {
      name: 'ಪ್ರಿಯಾ ದೇಶಮುಖ್',
      role: 'ರೈತ',
      location: 'ನಾಸಿಕ್, ಮಹಾರಾಷ್ಟ್ರ',
      title: 'ಗ್ರೇಡ್ A+ ಎಐ ಪ್ರಮಾಣಪತ್ರವು ಖರೀದಿದಾರರಲ್ಲಿ ತಕ್ಷಣದ ವಿಶ್ವಾಸವನ್ನು ಮೂಡಿಸುತ್ತದೆ',
      comment: 'ಹಿಂದೆ ವ್ಯಾಪಾರಿಗಳು ನನ್ನ ಸಾವಯವ ಬೆಳೆಯನ್ನು ಅನುಮಾನಿಸುತ್ತಿದ್ದರು. ಈಗ ಕಿಸಾನ್‌ಸಿಂಕ್ ಎಐ ಗುಣಮಟ್ಟ ಸ್ಕೋರ್ ನನ್ನ ಟೊಮೆಟೊಗಳಿಗೆ A+ ಬ್ಯಾಡ್ಜ್ ನೀಡುತ್ತದೆ. ದೇಶದಾದ್ಯಂತ ಖರೀದಿದಾರರು ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ನನ್ನ ಮೊಬೈಲ್‌ನಲ್ಲೇ ಹರಾಜು ಕೂಗುತ್ತಾರೆ!',
      cropOrTrade: 'ಸಾವಯವ ಟೊಮೆಟೊ (ಗ್ರೇಡ್ A+)',
      verifiedBadge: 'ದೃಢೀಕೃತ ರೈತ • 45 ಕ್ವಿಂಟಾಲ್ ಮಾರಾಟ'
    },
    'rev-3': {
      name: 'ವಿಕ್ರಮಾದಿತ್ಯ ರಾವ್',
      role: 'ಖರೀದಿದಾರ',
      location: 'ಹೈದರಾಬಾದ್, ತೆಲಂಗಾಣ',
      title: 'ಸಗಟು ಮಿಲ್ ಖರೀದಿಗಾಗಿ ಶೂನ್ಯ ಗುಣಮಟ್ಟದ ಅಪಾಯ',
      comment: 'ಸಗಟು ಖರೀದಿದಾರರಾಗಿ ಗುಣಮಟ್ಟದ ಅಪಾಯವೇ ನಮಗೆ ದೊಡ್ಡ ಸವಾಲಾಗಿತ್ತು. ಕಿಸಾನ್‌ಸಿಂಕ್ ಎಐ ರೇಟಿಂಗ್‌ಗಳು ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ದೃಢೀಕೃತ ಬೆಳೆಗೆ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಹೆಚ್ಚಿನ ಬೆಲೆ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
      cropOrTrade: 'ಧಾನ್ಯ ಮತ್ತು ಬೇಳೆಕಾಳು ವ್ಯಾಪಾರಿ',
      verifiedBadge: 'ದೃಢೀಕೃತ ಖರೀದಿದಾರ • 1,200 ಕ್ವಿಂಟಾಲ್ ಖರೀದಿ'
    },
    'rev-4': {
      name: 'ಡಾ. ಅರವಿಂದ್ ಜೋಶಿ',
      role: 'ಕೃಷಿ ವಿಜ್ಞಾನಿ',
      location: 'ಆನಂದ್ ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಗುಜರಾತ್',
      title: 'ಅತ್ಯುತ್ತಮ ರೋಗ ಪತ್ತೆ ನಿಖರತೆ ಮತ್ತು ಸಾವಯವ ಪರಿಹಾರಗಳು',
      comment: 'ಕೋಶ ಮಟ್ಟದ ರೋಗ ನಿರ್ಣಯ ಮತ್ತು ಸಾವಯವ ನಿಯಂತ್ರಣ ಶಿಫಾರಸುಗಳು ICAR ಮಾನದಂಡಗಳಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಅನುಗುಣವಾಗಿವೆ. ಈ 6-ಅಂಶಗಳ ವಿಶ್ಲೇಷಣೆಯು ರೈತರಿಗೆ ತಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.',
      cropOrTrade: 'ಬೆಳೆ ರೋಗ ಸಲಹೆಗಾರ',
      verifiedBadge: 'ಪ್ರಮಾಣೀಕೃತ ಕೃಷಿ ವಿಜ್ಞಾನಿ'
    },
    'rev-5': {
      name: 'ಹರ್‌ಪ್ರೀತ್ ಕೌರ್',
      role: 'ವ್ಯಾಪಾರಿ',
      location: 'ಭಟಿಂಡಾ, ಪಂಜಾಬ್',
      title: 'ವೇಗದ ಹರಾಜು ಇತ್ಯರ್ಥ ಮತ್ತು ಪಾರದರ್ಶಕ ಎಸ್ಕ್ರೊ ಪಾವತಿ',
      comment: 'ಕಿಸಾನ್‌ಸಿಂಕ್‌ನಲ್ಲಿ ಗೋಧಿ ಮತ್ತು ಸಾಸಿವೆ ವ್ಯಾಪಾರ ಅತ್ಯಂತ ವೇಗವಾಗಿದೆ. ಲೈವ್ ಲೆಡ್ಜರ್ ಅಕ್ರಮಗಳನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ಸರಕು ತಲುಪಿದ 2 ಗಂಟೆಗಳಲ್ಲಿ UPI ಮೂಲಕ ಪೂರ್ಣ ಪಾವತಿಯಾಗುತ್ತದೆ.',
      cropOrTrade: 'ಗೋಧಿ ಮತ್ತು ಸಾಸಿವೆ ಸಗಟು ವ್ಯಾಪಾರ',
      verifiedBadge: 'ಸಗಟು ಪಾಲುದಾರ • 650 ಕ್ವಿಂಟಾಲ್ ವ್ಯಾಪಾರ'
    }
  }
};

// UI Localized strings for Reviews & Testimonials Section and Modals
export interface ReviewUIStrings {
  writeReviewBtn: string;
  viewAllReviewsBtn: (count: number) => string;
  readMoreBtn: string;
  verifiedTrustBar: string;
  overallRatingLabel: string;
  reviewsCountLabel: string;
  addReviewBtn: string;
  modalTitle: string;
  modalSubtitle: string;
  modalReviewsBadge: (count: number) => string;
  verifiedRatings: string;
  searchPlaceholder: string;
  allRoles: string;
  farmerRole: string;
  traderRole: string;
  buyerRole: string;
  agronomistRole: string;
  allStars: string;
  noReviewsFound: string;
  resetFilters: string;
  helpfulBtn: string;
  closeBtn: string;
  escrowTrustNote: string;
  voteThankYou: string;
  voteMarked: string;
}

export const REVIEW_UI_DICTIONARY: Record<string, Partial<ReviewUIStrings>> = {
  en: {
    writeReviewBtn: '✍️ Write a Review',
    viewAllReviewsBtn: (count: number) => `View All Reviews (${count})`,
    readMoreBtn: 'Read →',
    verifiedTrustBar: '100% Verified Agriculture Community Reviews',
    overallRatingLabel: 'Overall Rating:',
    reviewsCountLabel: 'reviews',
    addReviewBtn: '+ Add Review',
    modalTitle: 'Community Reviews & Ratings',
    modalSubtitle: 'Verified feedback from farmers, agronomists & traders across India',
    modalReviewsBadge: (count: number) => `${count} Reviews`,
    verifiedRatings: 'Verified Ratings',
    searchPlaceholder: 'Search by name, location, crop, or keywords...',
    allRoles: 'All Roles',
    farmerRole: 'Farmers Only',
    traderRole: 'Traders Only',
    buyerRole: 'Buyers Only',
    agronomistRole: 'Agronomists',
    allStars: 'All Stars',
    noReviewsFound: 'No reviews match your filters',
    resetFilters: 'Reset all filters',
    helpfulBtn: 'Helpful',
    closeBtn: 'Close',
    escrowTrustNote: 'Verified by KisanSync Escrow & Agronomic Ledger',
    voteThankYou: 'Thank you!',
    voteMarked: 'Marked as helpful.'
  },

  gu: {
    writeReviewBtn: '✍️ તમારો રિવ્યુ લખો',
    viewAllReviewsBtn: (count: number) => `બધા રિવ્યુ જુઓ (${count})`,
    readMoreBtn: 'વિગત →',
    verifiedTrustBar: '૧૦૦% ચકાસાયેલ ખેડૂત પ્રતિસાદ',
    overallRatingLabel: 'સરેરાશ રેટિંગ:',
    reviewsCountLabel: 'રિવ્યુ',
    addReviewBtn: '+ રિવ્યુ ઉમેરો',
    modalTitle: 'ખેડૂત & વેપારી રિવ્યુ',
    modalSubtitle: 'ભારતના વાસ્તવિક ખેડૂતો અને વેપારીઓના ચકાસાયેલા પ્રતિસાદ',
    modalReviewsBadge: (count: number) => `${count} રિવ્યુ`,
    verifiedRatings: 'ચકાસાયેલ રેટિંગ્સ',
    searchPlaceholder: 'નામ, શહેર, પાક અથવા કીવર્ડ દ્વારા રિવ્યુ શોધો...',
    allRoles: 'તમામ ભૂમિકાઓ',
    farmerRole: 'ખેડૂત (Farmer)',
    traderRole: 'વેપારી (Trader)',
    buyerRole: 'ખરીદનાર (Buyer)',
    agronomistRole: 'કૃષિ નિષ્ણાત (Agronomist)',
    allStars: 'બધા રેટિંગ્સ',
    noReviewsFound: 'કોઈ રિવ્યુ મળ્યા નથી',
    resetFilters: 'ફિલ્ટર રીસેટ કરો',
    helpfulBtn: 'ઉપયોગી',
    closeBtn: 'બંધ કરો',
    escrowTrustNote: 'કિસાનસિંક: પારદર્શક ખેડૂત પ્રતિસાદ પ્લેટફોર્મ',
    voteThankYou: 'આભાર!',
    voteMarked: 'તમારો વોટ નોંધાઈ ગયો છે.'
  },

  hi: {
    writeReviewBtn: '✍️ अपना रिव्यू लिखें',
    viewAllReviewsBtn: (count: number) => `सभी रिव्यू देखें (${count})`,
    readMoreBtn: 'पढ़ें →',
    verifiedTrustBar: '१००% सत्यापित कृषि समुदाय समीक्षाएं',
    overallRatingLabel: 'सरेराश रेटिंग:',
    reviewsCountLabel: 'समीक्षाएं',
    addReviewBtn: '+ रिव्यू जोड़ें',
    modalTitle: 'किसान और व्यापारी समीक्षाएं',
    modalSubtitle: 'देशभर के किसानों, कृषि विशेषज्ञों और व्यापारियों की सत्यापित राय',
    modalReviewsBadge: (count: number) => `${count} समीक्षाएं`,
    verifiedRatings: 'सत्यापित रेटिंग्स',
    searchPlaceholder: 'नाम, स्थान, फसल या कीवर्ड से खोजें...',
    allRoles: 'सभी भूमिकाएं',
    farmerRole: 'केवल किसान',
    traderRole: 'केवल व्यापारी',
    buyerRole: 'केवल खरीदार',
    agronomistRole: 'कृषि विशेषज्ञ',
    allStars: 'सभी स्टार',
    noReviewsFound: 'आपके फ़िल्टर के अनुसार कोई रिव्यू नहीं मिला',
    resetFilters: 'फ़िल्टर रीसेट करें',
    helpfulBtn: 'मददगार',
    closeBtn: 'बंद करें',
    escrowTrustNote: 'किसानसिंक एस्क्रो व एग्रोनॉमिक लेजर द्वारा सत्यापित',
    voteThankYou: 'धन्यवाद!',
    voteMarked: 'सफलतापूर्वक मददगार चिन्हित किया गया।'
  },

  pa: {
    writeReviewBtn: '✍️ ਆਪਣੀ ਸਮੀਖਿਆ ਲਿਖੋ',
    viewAllReviewsBtn: (count: number) => `ਸਾਰੀਆਂ ਸਮੀਖਿਆਵਾਂ ਦੇਖੋ (${count})`,
    readMoreBtn: 'ਪੜ੍ਹੋ →',
    verifiedTrustBar: '100% ਪ੍ਰਮਾਣਿਤ ਖੇਤੀਬਾੜੀ ਭਾਈਚਾਰਾ ਸਮੀਖਿਆਵਾਂ',
    overallRatingLabel: 'ਕੁੱਲ ਰੇਟਿੰਗ:',
    reviewsCountLabel: 'ਸਮੀਖਿਆਵਾਂ',
    addReviewBtn: '+ ਸਮੀਖਿਆ ਸ਼ਾਮਲ ਕਰੋ',
    modalTitle: 'ਕਿਸਾਨ ਅਤੇ ਵਪਾਰੀ ਸਮੀਖਿਆਵਾਂ',
    modalSubtitle: 'ਭਾਰਤ ਭਰ ਦੇ ਕਿਸਾਨਾਂ ਅਤੇ ਵਪਾਰੀਆਂ ਵੱਲੋਂ ਪ੍ਰਮਾਣਿਤ ਫੀਡਬੈਕ',
    modalReviewsBadge: (count: number) => `${count} ਸਮੀਖਿਆਵਾਂ`,
    verifiedRatings: 'ਪ੍ਰਮਾਣਿਤ ਰੇਟਿੰਗਾਂ',
    searchPlaceholder: 'ਨਾਮ, ਸਥਾਨ ਜਾਂ ਫਸਲ ਮੁਤਾਬਕ ਖੋਜੋ...',
    allRoles: 'ਸਾਰੀਆਂ ਭੂਮਿਕਾਵਾਂ',
    farmerRole: 'ਸਿਰਫ਼ ਕਿਸਾਨ',
    traderRole: 'ਸਿਰਫ਼ ਵਪਾਰੀ',
    buyerRole: 'ਸਿਰਫ਼ ਖਰੀਦਦਾਰ',
    agronomistRole: 'ਖੇਤੀ ਵਿਗਿਆਨੀ',
    allStars: 'ਸਾਰੇ ਸਟਾਰ',
    noReviewsFound: 'ਕੋਈ ਸਮੀਖਿਆ ਨਹੀਂ ਮਿਲੀ',
    resetFilters: 'ਫਿਲਟਰ ਰੀਸੈੱਟ ਕਰੋ',
    helpfulBtn: 'ਲਾਹੇਵੰਦ',
    closeBtn: 'ਬੰਦ ਕਰੋ',
    escrowTrustNote: 'ਕਿਸਾਨਸਿੰਕ ਐਸਕਰੋ ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ',
    voteThankYou: 'ਧੰਨਵਾਦ!',
    voteMarked: 'ਵੋਟ ਦਰਜ ਕੀਤੀ ਗਈ।'
  },

  mr: {
    writeReviewBtn: '✍️ तुमचा अभिप्राय नोंदवा',
    viewAllReviewsBtn: (count: number) => `सर्व अभिप्राय पहा (${count})`,
    readMoreBtn: 'वाचा →',
    verifiedTrustBar: '१००% प्रमाणित शेतकरी व व्यापारी अभिप्राय',
    overallRatingLabel: 'एकूण रेटिंग:',
    reviewsCountLabel: 'अभिप्राय',
    addReviewBtn: '+ अभिप्राय जोडा',
    modalTitle: 'शेतकरी व व्यापारी अभिप्राय',
    modalSubtitle: 'देशभरातील शेतकरी, तज्ज्ञ व खरेदीदारांचे प्रमाणित अनुभव',
    modalReviewsBadge: (count: number) => `${count} अभिप्राय`,
    verifiedRatings: 'प्रमाणित रेटिंग्ज',
    searchPlaceholder: 'नाव, गाव, पीक किंवा शब्दाने शोधा...',
    allRoles: 'सर्व भूमिका',
    farmerRole: 'फक्त शेतकरी',
    traderRole: 'फक्त व्यापारी',
    buyerRole: 'फक्त खरेदीदार',
    agronomistRole: 'कृषी शास्त्रज्ञ',
    allStars: 'सर्व रेटिंग्ज',
    noReviewsFound: 'कोणताही अभिप्राय आढळला नाही',
    resetFilters: 'फिल्टर रीसेट करा',
    helpfulBtn: 'उपयुक्त',
    closeBtn: 'बंद करा',
    escrowTrustNote: 'किसानसिंक एस्क्रो व कृषी खात्याद्वारे प्रमाणित',
    voteThankYou: 'धन्यवाद!',
    voteMarked: 'उपयुक्त म्हणून नोंदवले.'
  },

  bn: {
    writeReviewBtn: '✍️ আপনার মতামত দিন',
    viewAllReviewsBtn: (count: number) => `সব রিভিউ দেখুন (${count})`,
    readMoreBtn: 'পড়ুন →',
    verifiedTrustBar: '১০০% যাচাইকৃত কৃষক ও ব্যবসায়ী পর্যালোচনা',
    overallRatingLabel: 'গড় রেটিং:',
    reviewsCountLabel: 'রিভিউ',
    addReviewBtn: '+ রিভিউ যোগ করুন',
    modalTitle: 'কৃষক ও ব্যবসায়ী প্রতিক্রিয়া',
    modalSubtitle: 'ভারত জুড়ে কৃষক ও ক্রেতাদের খাঁটি ও যাচাইকৃত মতামত',
    modalReviewsBadge: (count: number) => `${count} রিভিউ`,
    verifiedRatings: 'যাচাইকৃত রেটিং',
    searchPlaceholder: 'নাম, স্থান, ফসল বা বিষয় দিয়ে খুঁজুন...',
    allRoles: 'সকল ভূমিকা',
    farmerRole: 'কেবলমাত্র কৃষক',
    traderRole: 'কেবলমাত্র ব্যবসায়ী',
    buyerRole: 'কেবলমাত্র ক্রেতা',
    agronomistRole: 'কৃষি বিশেষজ্ঞ',
    allStars: 'সব স্টার',
    noReviewsFound: 'কোনো রিভিউ পাওয়া যায়নি',
    resetFilters: 'ফিল্টার রিসেট করুন',
    helpfulBtn: 'উপকারী',
    closeBtn: 'বন্ধ করুন',
    escrowTrustNote: 'কিসানসিঙ্ক এসক্রো দ্বারা যাচাইকৃত',
    voteThankYou: 'ধন্যবাদ!',
    voteMarked: 'উপকারী হিসেবে চিহ্নিত করা হয়েছে।'
  },

  ta: {
    writeReviewBtn: '✍️ உங்கள் கருத்தை எழுதவும்',
    viewAllReviewsBtn: (count: number) => `அனைத்து கருத்துகளையும் காண்க (${count})`,
    readMoreBtn: 'படிக்க →',
    verifiedTrustBar: '100% சரிபார்க்கப்பட்ட விவசாயிகள் மற்றும் வாங்குபவர்கள் கருத்துகள்',
    overallRatingLabel: 'மொத்த மதிப்பீடு:',
    reviewsCountLabel: 'மதிப்புரைகள்',
    addReviewBtn: '+ கருத்து சேர்க்க',
    modalTitle: 'விவசாயிகள் மற்றும் வணிகர்கள் மதிப்புரைகள்',
    modalSubtitle: 'இந்தியா முழுவதும் உள்ள விவசாயிகளின் சரிபார்க்கப்பட்ட கருத்துகள்',
    modalReviewsBadge: (count: number) => `${count} மதிப்புரைகள்`,
    verifiedRatings: 'சரிபார்க்கப்பட்ட மதிப்பீடுகள்',
    searchPlaceholder: 'பெயர், இடம் அல்லது பயிர் மூலம் தேடவும்...',
    allRoles: 'அனைத்து பாத்திரங்கள்',
    farmerRole: 'விவசாயிகள் மட்டும்',
    traderRole: 'வணிகர்கள் மட்டும்',
    buyerRole: 'வாங்குபவர்கள் மட்டும்',
    agronomistRole: 'வேளாண் வல்லுநர்கள்',
    allStars: 'அனைத்து மதிப்பீடுகள்',
    noReviewsFound: 'கருத்துகள் எதுவும் கிடைக்கவில்லை',
    resetFilters: 'வடிப்பான்களை மீட்டமைக்க',
    helpfulBtn: 'பயனுள்ளது',
    closeBtn: 'மூடுக',
    escrowTrustNote: 'கிசான்சின்க் எஸ்க்ரோ மூலம் சரிபார்க்கப்பட்டது',
    voteThankYou: 'நன்றி!',
    voteMarked: 'பயனுள்ளதாக பதிவு செய்யப்பட்டது.'
  },

  te: {
    writeReviewBtn: '✍️ మీ సమీక్షను రాయండి',
    viewAllReviewsBtn: (count: number) => `అన్ని సమీక్షలు చూడండి (${count})`,
    readMoreBtn: 'చదవండి →',
    verifiedTrustBar: '100% ధృవీకరించబడిన వ్యవసాయ సంఘం సమీక్షలు',
    overallRatingLabel: 'మొత్తం రేటింగ్:',
    reviewsCountLabel: 'సమీక్షలు',
    addReviewBtn: '+ సమీక్షను జోడించండి',
    modalTitle: 'రైతులు మరియు వ్యాపారుల సమీక్షలు',
    modalSubtitle: 'దేశవ్యాప్తంగా రైతులు, వ్యాపారుల నుండి ధృవీకరించబడిన అనుభవాలు',
    modalReviewsBadge: (count: number) => `${count} సమీక్షలు`,
    verifiedRatings: 'ధృవీకరించబడిన రేటింగ్‌లు',
    searchPlaceholder: 'పేరు, ప్రాంతం లేదా పంట పేరుతో వెతకండి...',
    allRoles: 'అన్ని పాత్రలు',
    farmerRole: 'రైతులు మాత్రమే',
    traderRole: 'వ్యాపారులు మాత్రమే',
    buyerRole: 'కొనుగోలుదారులు మాత్రమే',
    agronomistRole: 'వ్యవసాయ నిపుణులు',
    allStars: 'అన్ని నక్షత్రాలు',
    noReviewsFound: 'సమీక్షలు ఏవీ కనుగొనబడలేదు',
    resetFilters: 'ఫిల్టర్‌లను రీసెట్ చేయండి',
    helpfulBtn: 'ఉపయోగకరం',
    closeBtn: 'మూసివేయి',
    escrowTrustNote: 'కిసాన్‌సింక్ ఎస్క్రో ద్వారా ధృవీకరించబడింది',
    voteThankYou: 'ధన్యవాదాలు!',
    voteMarked: 'ఉపయోగకరంగా గుర్తించబడింది.'
  },

  kn: {
    writeReviewBtn: '✍️ ನಿಮ್ಮ ವಿಮರ್ಶೆ ಬರೆಯಿರಿ',
    viewAllReviewsBtn: (count: number) => `ಎಲ್ಲಾ ವಿಮರ್ಶೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ (${count})`,
    readMoreBtn: 'ಓದಿ →',
    verifiedTrustBar: '100% ದೃಢೀಕೃತ ಕೃಷಿ ಸಮುದಾಯದ ವಿಮರ್ಶೆಗಳು',
    overallRatingLabel: 'ಒಟ್ಟು ರೇಟಿಂಗ್:',
    reviewsCountLabel: 'ವಿಮರ್ಶೆಗಳು',
    addReviewBtn: '+ ವಿಮರ್ಶೆ ಸೇರಿಸಿ',
    modalTitle: 'ರೈತರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ವಿಮರ್ಶೆಗಳು',
    modalSubtitle: 'ದೇಶದಾದ್ಯಂತ ರೈತರು, ತಜ್ಞರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ನೈಜ ಅನುಭವಗಳು',
    modalReviewsBadge: (count: number) => `${count} ವಿಮರ್ಶೆಗಳು`,
    verifiedRatings: 'ದೃಢೀಕೃತ ರೇಟಿಂಗ್‌ಗಳು',
    searchPlaceholder: 'ಹೆಸರು, ಸ್ಥಳ ಅಥವಾ ಬೆಳೆಯ ಮೂಲಕ ಹುಡುಕಿ...',
    allRoles: 'ಎಲ್ಲಾ ಪಾತ್ರಗಳು',
    farmerRole: 'ರೈತರು ಮಾತ್ರ',
    traderRole: 'ವ್ಯಾಪಾರಿಗಳು ಮಾತ್ರ',
    buyerRole: 'ಖರೀದಿದಾರರು ಮಾತ್ರ',
    agronomistRole: 'ಕೃಷಿ ತಜ್ಞರು',
    allStars: 'ಎಲ್ಲಾ ಸ್ಟಾರ್‌ಗಳು',
    noReviewsFound: 'ಯಾವುದೇ ವಿಮರ್ಶೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    resetFilters: 'ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ',
    helpfulBtn: 'ಉಪಯುಕ್ತ',
    closeBtn: 'ಮುಚ್ಚಿ',
    escrowTrustNote: 'ಕಿಸಾನ್‌ಸಿಂಕ್ ಎಸ್ಕ್ರೋ ಮೂಲಕ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    voteThankYou: 'ಧನ್ಯವಾದಗಳು!',
    voteMarked: 'ಉಪಯುಕ್ತವೆಂದು ಗುರುತಿಸಲಾಗಿದೆ.'
  }
};

export function getReviewUIStrings(langCode: string): ReviewUIStrings {
  const base = REVIEW_UI_DICTIONARY['en'] as ReviewUIStrings;
  const match = REVIEW_UI_DICTIONARY[langCode] || REVIEW_UI_DICTIONARY[langCode === 'en' ? 'en' : 'hi'] || {};
  return {
    writeReviewBtn: match.writeReviewBtn || base.writeReviewBtn,
    viewAllReviewsBtn: match.viewAllReviewsBtn || base.viewAllReviewsBtn,
    readMoreBtn: match.readMoreBtn || base.readMoreBtn,
    verifiedTrustBar: match.verifiedTrustBar || base.verifiedTrustBar,
    overallRatingLabel: match.overallRatingLabel || base.overallRatingLabel,
    reviewsCountLabel: match.reviewsCountLabel || base.reviewsCountLabel,
    addReviewBtn: match.addReviewBtn || base.addReviewBtn,
    modalTitle: match.modalTitle || base.modalTitle,
    modalSubtitle: match.modalSubtitle || base.modalSubtitle,
    modalReviewsBadge: match.modalReviewsBadge || base.modalReviewsBadge,
    verifiedRatings: match.verifiedRatings || base.verifiedRatings,
    searchPlaceholder: match.searchPlaceholder || base.searchPlaceholder,
    allRoles: match.allRoles || base.allRoles,
    farmerRole: match.farmerRole || base.farmerRole,
    traderRole: match.traderRole || base.traderRole,
    buyerRole: match.buyerRole || base.buyerRole,
    agronomistRole: match.agronomistRole || base.agronomistRole,
    allStars: match.allStars || base.allStars,
    noReviewsFound: match.noReviewsFound || base.noReviewsFound,
    resetFilters: match.resetFilters || base.resetFilters,
    helpfulBtn: match.helpfulBtn || base.helpfulBtn,
    closeBtn: match.closeBtn || base.closeBtn,
    escrowTrustNote: match.escrowTrustNote || base.escrowTrustNote,
    voteThankYou: match.voteThankYou || base.voteThankYou,
    voteMarked: match.voteMarked || base.voteMarked
  };
}

export function getLocalizedReview(review: UserReview, langCode: string): UserReview {
  const langDict = REVIEW_TRANSLATIONS[langCode];
  if (langDict && langDict[review.id]) {
    const loc = langDict[review.id];
    return {
      ...review,
      name: loc.name,
      role: (loc.role as any) || review.role,
      location: loc.location,
      title: loc.title,
      comment: loc.comment,
      cropOrTrade: loc.cropOrTrade || review.cropOrTrade,
      verifiedBadge: loc.verifiedBadge || review.verifiedBadge
    };
  }

  // Fallback for languages without custom overrides (e.g. falls back to Hindi if non-English, or English if code is en)
  const fallbackKey = langCode === 'en' ? 'en' : (REVIEW_TRANSLATIONS[langCode] ? langCode : 'hi');
  const fallbackDict = REVIEW_TRANSLATIONS[fallbackKey] || REVIEW_TRANSLATIONS['en'];
  if (fallbackDict && fallbackDict[review.id]) {
    const loc = fallbackDict[review.id];
    return {
      ...review,
      name: loc.name,
      role: (loc.role as any) || review.role,
      location: loc.location,
      title: loc.title,
      comment: loc.comment,
      cropOrTrade: loc.cropOrTrade || review.cropOrTrade,
      verifiedBadge: loc.verifiedBadge || review.verifiedBadge
    };
  }

  return review;
}

export function getLocalizedReviews(reviews: UserReview[], langCode: string): UserReview[] {
  return reviews.map((r) => getLocalizedReview(r, langCode));
}
