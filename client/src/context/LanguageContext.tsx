import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, DEFAULT_LANGUAGE } from '@/lib/translations';

// Define the context type
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: () => 'rtl' | 'ltr';
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
  dir: () => 'ltr',
});

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or use default
  const [language, setLanguageState] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || DEFAULT_LANGUAGE;
  });

  // Update language handler
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Set the dir attribute on the html element
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    
    // Additional font adjustments for Persian
    if (lang === 'fa') {
      document.documentElement.classList.add('font-persian');
    } else {
      document.documentElement.classList.remove('font-persian');
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Get translation for current language or fallback to key
    const translation = translations[language]?.[key] || translations.en?.[key] || key;
    
    // Replace any parameters in the translation string
    if (params) {
      return Object.entries(params).reduce((str, [key, value]) => {
        return str.replace(new RegExp(`{${key}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  };
  
  // Direction helper
  const dir = (): 'rtl' | 'ltr' => {
    return language === 'fa' ? 'rtl' : 'ltr';
  };

  // Set initial direction when component mounts
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    
    if (language === 'fa') {
      document.documentElement.classList.add('font-persian');
    } else {
      document.documentElement.classList.remove('font-persian');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);