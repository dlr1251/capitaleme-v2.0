import { useState, useRef, useEffect } from 'react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type Lang = 'en' | 'es';

interface LanguageDropdownProps {
  lang: Lang;
  pathname: string;
}

function getUrlForLang(path: string, targetLang: string) {
  let cleanedPath = path.replace(/\/$/, '');
  if (cleanedPath === '' || cleanedPath === '/' || cleanedPath === '/en' || cleanedPath === '/es') {
    return `/${targetLang}`;
  }
  const langPrefixRegex = /^\/(en|es)(\/|$)/;
  cleanedPath = cleanedPath.replace(langPrefixRegex, '/');
  let finalPath = `/${targetLang}${cleanedPath}`.replace(/\/+/g, '/');
  if (finalPath.length > 1 && finalPath.endsWith('/')) {
    finalPath = finalPath.slice(0, -1);
  }
  return finalPath;
}

export default function LanguageDropdown({ lang, pathname }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const currentLanguage = languages.find(l => l.code === lang);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (targetLang: Lang) => {
    const url = getUrlForLang(pathname, targetLang);
    window.location.href = url;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
        aria-label="Select language"
      >
        <GlobeAltIcon className="w-4 h-4 text-primary" aria-hidden="true" />
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  handleLanguageChange(language.code as Lang);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  language.code === lang 
                    ? 'bg-secondary/10 text-secondary font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 