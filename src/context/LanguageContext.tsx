import React, { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'en' | 'es';

interface LanguageContextProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ initialLang: Lang; children: React.ReactNode }> = ({ initialLang, children }) => {
  const [lang, setLang] = useState<Lang>(initialLang);

  // Sync with URL on popstate (back/forward navigation)
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/(en|es)(\/|$)/);
      if (match) setLang(match[1] as Lang);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}; 