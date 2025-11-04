import React, { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  ChevronUpIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  ListBulletIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { Lang } from '../../context/LanguageContext.tsx';
import { generatePDF, showPDFConfirmation } from '../../utils/pdfUtils.js';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Visa {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface VisasMobileNavigationProps {
  lang?: Lang;
  pathname?: string;
  title?: string;
  headings?: Heading[];
  visas?: Visa[];
  currentSlug?: string;
}

const VisasMobileNavigation: React.FC<VisasMobileNavigationProps> = ({
  lang = 'en',
  pathname = '',
  title = '',
  headings = [],
  visas = [],
  currentSlug = ''
}) => {
  // Improved heading validation and type conversion
  const typedHeadings: Heading[] = React.useMemo(() => {
    if (!Array.isArray(headings) || headings.length === 0) {
      return [];
    }
    
    return headings
      .filter((heading: any) => 
        heading && 
        typeof heading === 'object' && 
        'id' in heading && 
        'text' in heading && 
        ('level' in heading || 'depth' in heading)
      )
      .map((heading: any) => ({
        id: heading.id,
        text: heading.text,
        level: heading.level || heading.depth || 1
      }));
  }, [headings]);

  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Set current URL on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTOCOpen(false);
        setIsDrawerOpen(false);
      }
    };

    if (isTOCOpen || isDrawerOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isTOCOpen, isDrawerOpen]);

  // Update current section as user scrolls
  useEffect(() => {
    if (typedHeadings.length === 0) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for sticky nav
      let closestHeading: Heading | null = null;
      let minDistance = Infinity;
      
      typedHeadings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) {
          const distance = Math.abs(el.offsetTop - scrollPosition);
          if (distance < minDistance) {
            minDistance = distance;
            closestHeading = heading;
          }
        }
      });
      
      // Handle case where closestHeading could be null
      setCurrentSection(
        closestHeading?.text || typedHeadings[0]?.text || ''
      );
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [typedHeadings]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100, // Offset for sticky nav
        behavior: 'smooth',
      });
      setIsTOCOpen(false);
    }
  };

  const shareContent = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const text = title || document.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setIsShareDropdownOpen(false);
  };

  const downloadPDF = async () => {
    try {
      const confirmed = await showPDFConfirmation(title || 'Visa Information', lang);
      if (!confirmed) return;
      
      const articleContent = document.querySelector('article') || document.querySelector('main');
      if (!articleContent) {
        throw new Error('No content found to generate PDF');
      }
      
      await generatePDF({
        title: title || 'Visa Information',
        content: articleContent.innerHTML,
        lang,
        filename: title
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Text content based on language
  const textContent = {
    en: {
      section: 'Section',
      visas: 'Visas',
      close: 'Close',
      tableOfContents: 'Table of Contents'
    },
    es: {
      section: 'Sección',
      visas: 'Visas',
      close: 'Cerrar',
      tableOfContents: 'Tabla de Contenidos'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  return (
    <>
      {/* Sticky Bar */}
      <div className="fixed top-[56px] left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 h-12 md:hidden">
        {/* Left: TOC Selector */}
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-700 focus:outline-none"
          onClick={() => setIsTOCOpen(true)}
        >
          <ListBulletIcon className="w-5 h-5 text-blue-600" />
          <span className="truncate max-w-[120px]">{currentSection || content.section}</span>
        </button>
        {/* Right: Visas Drawer */}
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-700 focus:outline-none"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Bars3Icon className="w-5 h-5 text-blue-600" />
          <span>{content.visas}</span>
        </button>
      </div>

      {/* TOC Modal */}
      {isTOCOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsTOCOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{content.tableOfContents}</h3>
              <button
                onClick={() => setIsTOCOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {typedHeadings.length > 0 ? (
                <nav className="space-y-2">
                  {typedHeadings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        heading.text === currentSection
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ paddingLeft: `${(heading.level - 1) * 16 + 12}px` }}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-gray-500 text-sm">
                    {lang === 'es' ? 'No hay secciones disponibles' : 'No sections available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visas Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{content.visas}</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {visas.length > 0 ? (
                <nav className="space-y-2">
                  {visas.map((visa) => (
                    <a
                      key={visa.slug}
                      href={visa.url}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        visa.slug === currentSlug
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{visa.title}</div>
                      {visa.description && (
                        <div className="text-xs text-gray-500 mt-1">{visa.description}</div>
                      )}
                    </a>
                  ))}
                </nav>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-gray-500 text-sm">
                    {lang === 'es' ? 'No hay visas disponibles' : 'No visas available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visas Mobile Navigation - Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Share Tab */}
          <div className="relative">
            <button
              onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                isShareDropdownOpen 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-label={lang === 'es' ? 'Compartir' : 'Share'}
            >
              <ShareIcon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium">{lang === 'es' ? 'Compartir' : 'Share'}</span>
            </button>

            {/* Share Dropdown */}
            {isShareDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => shareContent('facebook')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button
                    onClick={() => shareContent('twitter')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    X (Twitter)
                  </button>
                  <button
                    onClick={() => shareContent('whatsapp')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareContent('copy')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {lang === 'es' ? 'Copiar enlace' : 'Copy link'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Download */}
          <button
            onClick={downloadPDF}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            aria-label={lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
          >
            <DocumentArrowDownIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">PDF</span>
          </button>

          {/* Contact Button */}
          <a
            href={`/${lang}/contact`}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            aria-label={lang === 'es' ? 'Contacto' : 'Contact'}
          >
            <PhoneIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{lang === 'es' ? 'Contacto' : 'Contact'}</span>
          </a>

          {/* WhatsApp Inquiry */}
          <a
            href={`https://wa.me/573146022411?text=${encodeURIComponent(`Hello! I want to inquire about: ${title || document.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-green-600 hover:text-green-700 hover:bg-green-50"
            aria-label="WhatsApp"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">WhatsApp</span>
          </a>
        </div>
      </div>

    </>
  );
};

export default VisasMobileNavigation;
