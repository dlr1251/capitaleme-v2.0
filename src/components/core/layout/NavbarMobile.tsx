import { useState, useEffect } from 'react';
import Logo from '../../../assets/logo/color-horizontal.svg';
import LanguageDropdown from '../../shared/LanguageDropdown.tsx';
import type { Lang } from '../../../context/LanguageContext.tsx';
import { 
  XMarkIcon, 
  Bars3Icon
} from '@heroicons/react/24/outline';

// Simplified interface - no longer needed for basic mobile menu

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
    // if (linkHref.includes('/real-estate') && pathname.includes('/real-estate')) return true;
    
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
      <div className="lg:hidden fixed inset-0 z-[60] bg-white top-0 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-[70]">
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

// Enhanced Mobile Navigation removed - now handled by specific layout components

const NavbarMobile: React.FC<NavbarMobileProps> = ({ lang, pathname }) => {
  // Mobile mega menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Helper functions
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };



  const links = [
    { href: lang === 'en' ? '/en/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros' },
    { href: lang === 'en' ? '/en/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas' },
    { href: lang === 'en' ? '/en/guides' : '/es/guides', text: lang === 'en' ? 'Guides' : 'Guías' },
    { href: lang === 'en' ? '/en/clkr' : '/es/clkr', text: lang === 'en' ? 'CLKR' : 'CLKR' },
    { href: lang === 'en' ? '/en/blog' : '/es/blog', text: lang === 'en' ? 'Blog' : 'Blog' },
    { href: lang === 'en' ? '/en/contact' : '/es/contact', text: lang === 'en' ? 'Contact' : 'Contacto' },
  ];

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
    </div>
  );
};

export default NavbarMobile;

// Basic mobile menu styles
const mobileMenuStyles = `
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