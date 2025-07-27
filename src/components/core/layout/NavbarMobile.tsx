import { useState, useEffect } from 'react';
import Logo from '../../../assets/logo/color-horizontal.svg';
import LanguageDropdown from '../../shared/LanguageDropdown.tsx';
import type { Lang } from '../../../context/LanguageContext.tsx';
import { 
  XMarkIcon, 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  ShareIcon,
  BookOpenIcon,
  ListBulletIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon as MarkdownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

interface MenuDataType {
  popularVisas?: any[];
  visasGuides?: any[];
  featuredProperty?: any;
  realEstateArticles?: any[];
  guides?: any[];
  clkrServices?: any[];
  clkrModules?: any[];
  latestNews?: any[];
  visaCategories?: any[];
  featuredProperties?: any[];
  realEstateServices?: any[];
  popularResources?: any[];
  resourceTools?: any[];
  latestArticles?: any[];
  newsCategories?: any[];
}

interface NavbarMobileProps {
  lang: Lang;
  pathname: string;
}

// Mobile Menu Subcomponent
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; text: string }>;
  lang: Lang;
  pathname: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links, lang, pathname }) => {
  // Helper function to check if a link is active
  const isLinkActive = (linkHref: string) => {
    if (!pathname) return false;
    
    // Exact match (href already includes language prefix)
    if (pathname === linkHref) return true;
    
    // For About Us, check if we're on the about page
    if (linkHref.includes('/about') && pathname.includes('/about')) return true;
    
    // For Visas & Immigration, check if we're on visas or visas2 route
    if (linkHref.includes('/visas') && (pathname.includes('/visas') || pathname.includes('/visas2'))) return true;
    
    // For Real Estate, check if we're on real-estate routes
    if (linkHref.includes('/real-estate') && pathname.includes('/real-estate')) return true;
    
    // For Blog, check if we're on blog routes
    if (linkHref.includes('/blog') && pathname.includes('/blog')) return true;
    
    // For Contact, check if we're on contact page
    if (linkHref.includes('/contact') && pathname.includes('/contact')) return true;
    
    // For Guides, check if we're on guides routes
    if (linkHref.includes('/guides') && pathname.includes('/guides')) return true;
    
    // For CLKR, check if we're on CLKR routes
    if (linkHref.includes('/clkr') && pathname.includes('/clkr')) return true;
    
    // For other pages, check if pathname includes the link href (but not for root)
    if (linkHref !== '/' && pathname.includes(linkHref)) return true;
    
    return false;
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Full screen mobile menu */}
      <div className="lg:hidden fixed inset-0 z-50 bg-white top-0 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-60">
          <div className="flex items-center space-x-3">
            <img
              src={Logo.src}
              alt="Capital M Logo"
              className="h-8"
              width={100}
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Menu content */}
        <div className="p-6 space-y-6">
          {/* Main navigation links */}
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={link.href} className="mobile-menu-item" style={{ animationDelay: `${index * 50}ms` }}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className={`block p-4 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    isLinkActive(link.href) 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium relative z-10">{link.text}</span>
                  
                  {/* Active background gradient */}
                  {isLinkActive(link.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                  )}
                  
                  {/* Hover effect for non-active items */}
                  {!isLinkActive(link.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/20 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300"></div>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced Mobile Navigation Subcomponent
interface EnhancedMobileNavProps {
  lang: Lang;
  currentUrl: string;
  onTabClick: (tab: 'share' | 'pdf' | 'markdown' | 'search') => void;
  activeTab: 'share' | 'pdf' | 'markdown' | 'search' | null;
  isShareDropdownOpen: boolean;
  onShareContent: (platform: string) => void;
}

const EnhancedMobileNav: React.FC<EnhancedMobileNavProps> = ({
  lang,
  currentUrl,
  onTabClick,
  activeTab,
  isShareDropdownOpen,
  onShareContent
}) => {
  return (
    <>
      {/* Enhanced Mobile Navigation - Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Share Tab */}
          <div className="relative">
            <button
              onClick={() => onTabClick('share')}
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
                    onClick={() => onShareContent('facebook')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button
                    onClick={() => onShareContent('twitter')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    X (Twitter)
                  </button>
                  <button
                    onClick={() => onShareContent('whatsapp')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={() => onShareContent('copy')}
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

          {/* PDF Download Tab */}
          <button
            onClick={() => onTabClick('pdf')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              activeTab === 'pdf' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label={lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
          >
            <DocumentArrowDownIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{lang === 'es' ? 'PDF' : 'PDF'}</span>
          </button>

          {/* Markdown Copy Tab */}
          <button
            onClick={() => onTabClick('markdown')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              activeTab === 'markdown' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label={lang === 'es' ? 'Copiar Markdown' : 'Copy Markdown'}
          >
            <MarkdownIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{lang === 'es' ? 'MD' : 'MD'}</span>
          </button>

          {/* Search Tab */}
          <button
            onClick={() => onTabClick('search')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              activeTab === 'search' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label={lang === 'es' ? 'Buscar' : 'Search'}
          >
            <MagnifyingGlassIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{lang === 'es' ? 'Buscar' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Floating Action Buttons - Stacked vertically */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40 flex flex-col space-y-2">
        {/* Go Up Button */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center hover:scale-105"
          aria-label={lang === 'es' ? 'Subir al inicio' : 'Scroll to top'}
        >
          <ChevronUpIcon className="w-4 h-4" />
        </button>

        {/* WhatsApp Button */}
        {currentUrl && (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${document.title} ${currentUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
            aria-label={lang === 'es' ? 'Compartir en WhatsApp' : 'Share on WhatsApp'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
        )}
      </div>
    </>
  );
};

const NavbarMobile: React.FC<NavbarMobileProps> = ({ lang, pathname }) => {
  // Mobile mega menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Enhanced mobile navigation state
  const [activeTab, setActiveTab] = useState<'share' | 'pdf' | 'markdown' | 'search' | null>(null);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<string>('');
  const [isUpperNavVisible, setIsUpperNavVisible] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Set current URL on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Auto-detect current section based on scroll position
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      // Show upper nav when scrolling past the first heading
      const firstHeading = document.querySelector('h2, h3, h4, h5, h6');
      if (firstHeading) {
        const firstHeadingTop = firstHeading.getBoundingClientRect().top + window.scrollY;
        setIsUpperNavVisible(window.scrollY > firstHeadingTop - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers on escape key
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPdfModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Helper functions
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Enhanced mobile navigation functions
  const generatePDF = async () => {
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.padding = '40px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.6';
      tempContainer.style.color = '#333';

      const mainContent = document.querySelector('.prose') || document.querySelector('main');
      if (mainContent) {
        tempContainer.innerHTML = `
          <h1 style="font-size: 24px; margin-bottom: 20px; color: #1f2937;">${document.title}</h1>
          ${mainContent.innerHTML}
        `;
      }

      document.body.appendChild(tempContainer);

      const canvas = await (html2canvas as any)(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (error) {
      
    }
  };

  const copyMarkdown = async () => {
    try {
      const mainContent = document.querySelector('.prose') || document.querySelector('main');
      if (!mainContent) return;

      let markdown = `# ${document.title}\n\n`;
      
      const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        const prefix = '#'.repeat(level);
        markdown += `${prefix} ${heading.textContent}\n\n`;
      });

      const paragraphs = mainContent.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent?.trim()) {
          markdown += `${p.textContent}\n\n`;
        }
      });

      await navigator.clipboard.writeText(markdown);
      
      // Show success feedback
      const button = document.querySelector('[data-action="markdown"]') as HTMLElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = lang === 'es' ? '¡Copiado!' : 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      
    }
  };

  const shareContent = (platform: string) => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const text = document.title;
    
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
  };

  const handleTabClick = (tab: 'share' | 'pdf' | 'markdown' | 'search') => {
    setActiveTab(tab);
    
    if (tab === 'share') {
      setIsShareDropdownOpen(!isShareDropdownOpen);
    } else if (tab === 'pdf') {
      setIsPdfModalOpen(true);
      setIsShareDropdownOpen(false);
    } else if (tab === 'markdown') {
      copyMarkdown();
      setIsShareDropdownOpen(false);
    } else if (tab === 'search') {
      setIsShareDropdownOpen(false);
    } else {
      setIsShareDropdownOpen(false);
    }
  };



  const links = [
    { href: lang === 'en' ? '/en/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros' },
    { href: lang === 'en' ? '/en/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas' },
    { href: lang === 'en' ? '/en/guides' : '/es/guides', text: lang === 'en' ? 'Guides' : 'Guías' },
    { href: lang === 'en' ? '/en/real-estate' : '/es/real-estate', text: lang === 'en' ? 'Real Estate' : 'Inmobiliario' },
    { href: lang === 'en' ? '/en/clkr' : '/es/clkr', text: lang === 'en' ? 'CLKR' : 'CLKR' },
    { href: lang === 'en' ? '/en/blog' : '/es/blog', text: lang === 'en' ? 'Blog' : 'Blog' },
    { href: lang === 'en' ? '/en/contact' : '/es/contact', text: lang === 'en' ? 'Contact' : 'Contacto' },
  ];

  // Only show enhanced mobile navigation on CLKR pages
  const isCLKRPage = pathname && (pathname.includes('/clkr/') || pathname.includes('/clkr'));

  return (
    <div className="relative">
      {/* Hamburger button for mobile */}
      <button
        type="button"
        className="lg:hidden inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 order-3 focus:outline-none transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-controls="mobile-menu"
        aria-expanded={mobileMenuOpen}
      >
        <span className="sr-only">Open main menu</span>
        {mobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile menu dropdown */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        links={links}
        lang={lang}
        pathname={pathname}
      />
      
      {/* Enhanced Mobile Navigation - Only show on CLKR pages */}
      {isCLKRPage && (
        <EnhancedMobileNav
          lang={lang}
          currentUrl={currentUrl}
          onTabClick={handleTabClick}
          activeTab={activeTab}
          isShareDropdownOpen={isShareDropdownOpen}
          onShareContent={shareContent}
        />
      )}
      
      {/* PDF Confirmation Modal */}
      {isPdfModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsPdfModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <DocumentArrowDownIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
                </h3>
                <p className="text-sm text-gray-500">
                  {lang === 'es' ? '¿Deseas descargar esta página como PDF?' : 'Do you want to download this page as PDF?'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                {lang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  generatePDF();
                  setIsPdfModalOpen(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {lang === 'es' ? 'Descargar' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;

// Add CSS for mobile menu improvements
const mobileMenuStyles = `
  .mobile-menu-container {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }

  .mobile-menu-container::-webkit-scrollbar {
    width: 6px;
  }

  .mobile-menu-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .mobile-menu-container::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
  }

  .mobile-menu-container::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }

  .mobile-menu-smooth-scroll {
    scroll-behavior: smooth;
  }

  .mobile-content-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mobile-menu-item {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .mobile-section-expand {
    animation: expandSection 0.3s ease-out;
  }

  @keyframes expandSection {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
    }
  }

  .mobile-card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .mobile-button-scale:hover {
    transform: scale(1.05);
  }

  .mobile-menu-focus:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .mobile-arrow-rotate {
    transition: transform 0.3s ease;
  }

  .mobile-arrow-rotate.expanded {
    transform: rotate(180deg);
  }

  .mobile-icon-bounce {
    animation: bounce 0.6s ease-in-out;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  .mobile-touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  .mobile-gradient-blue {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  }

  .mobile-gradient-green {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  }

  .mobile-gradient-purple {
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  }

  .mobile-gradient-orange {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  }

  .icon-color-transition {
    transition: color 0.3s ease;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'mobile-menu-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = mobileMenuStyles;
    document.head.appendChild(style);
  }
} 