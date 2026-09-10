import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDIAN_LANGUAGES, Language, TRANSLATIONS, TranslationKeys, getTranslation } from '../data/languages';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguageCode: (code: string) => void;
  t: (key: TranslationKeys) => string;
  isSelectorOpen: boolean;
  setIsSelectorOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<string>(() => {
    const saved = localStorage.getItem('kisansync_lang');
    if (saved && INDIAN_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    return 'hi'; // Default to Hindi (India's primary spoken language)
  });

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kisansync_lang', langCode);
  }, [langCode]);

  const currentLanguage = INDIAN_LANGUAGES.find((l) => l.code === langCode) || INDIAN_LANGUAGES[0];

  const setLanguageCode = (code: string) => {
    if (INDIAN_LANGUAGES.some((l) => l.code === code)) {
      setLangCode(code);
    }
  };

  const t = (key: TranslationKeys): string => {
    return getTranslation(langCode, key);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguageCode, t, isSelectorOpen, setIsSelectorOpen }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
