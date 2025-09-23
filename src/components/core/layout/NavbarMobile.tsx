import { useState, useEffect } from 'react';
import Logo from '../../../assets/logo/color-horizontal.svg';
import LanguageDropdown from '../../shared/LanguageDropdown.tsx';
import type { Lang } from '../../../context/LanguageContext.tsx';
import { 
  XMarkIcon, 
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface NavbarMobileProps {
  lang: Lang;
  pathname: string;
  menuData?: any;
}

// Mobile Menu Subcomponent
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; text: string; hasSubpages?: boolean }>;
  lang: Lang;
  pathname: string;
  menuData?: any;
}

interface SubpageItem {
  title: string;
  description?: string;
  url: string;
  emoji?: string;
  isPopular?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links, lang, pathname, menuData }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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

  // Toggle dropdown for subpages
  const toggleDropdown = (itemText: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemText)) {
      newExpanded.delete(itemText);
    } else {
      newExpanded.add(itemText);
    }
    setExpandedItems(newExpanded);
  };

  // Get subpages for specific sections
  const getSubpages = (itemText: string): SubpageItem[] => {
    if (!menuData) return [];

    switch (itemText) {
      case 'Visas & Immigration':
      case 'Visas Colombianas':
        return (menuData.allVisas || []).slice(0, 6).map((visa: any) => ({
          title: visa.title,
          description: visa.description,
          url: visa.url,
          emoji: visa.emoji || '📋',
          isPopular: visa.isPopular
        }));
      
      case 'Guides':
      case 'Guías':
        return (menuData.allGuides || []).slice(0, 6).map((guide: any) => ({
          title: guide.title,
          description: guide.description,
          url: guide.url,
          emoji: '📚',
          isPopular: guide.isFeatured
        }));
      
      case 'CLKR':
        return (menuData.clkrServices || []).slice(0, 6).map((service: any) => ({
          title: service.title,
          description: service.description,
          url: service.url,
          emoji: '⚖️',
          isPopular: false
        }));
      
      case 'Blog':
        return (menuData.latestNews || []).slice(0, 4).map((post: any) => ({
          title: post.title,
          description: post.excerpt,
          url: post.href,
          emoji: '📝',
          isPopular: post.isFeatured
        }));
      
      default:
        return [];
    }
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
        <style jsx>{`
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 2px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .animate-in {
            animation: slideIn 0.2s ease-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
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
        <div className="p-6 space-y-4">
          {/* Main navigation links */}
          <div className="space-y-2">
            {links.map((link, index) => {
              const subpages = getSubpages(link.text);
              const hasSubpages = subpages.length > 0;
              const isExpanded = expandedItems.has(link.text);
              
              return (
                <div key={link.href} className="mobile-menu-item" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Main menu item */}
                  <div className="relative">
                    {hasSubpages ? (
                      // For items with subpages, use a div instead of anchor to prevent navigation
                      <div
                        className={`block p-4 rounded-lg transition-all duration-300 relative overflow-hidden cursor-pointer ${
                          isLinkActive(link.href) 
                            ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => toggleDropdown(link.text)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium relative z-10">{link.text}</span>
                          <div className="p-1 rounded-md hover:bg-white/20 transition-colors">
                            {isExpanded ? (
                              <ChevronDownIcon className="w-5 h-5" />
                            ) : (
                              <ChevronRightIcon className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                        
                        {/* Active background gradient */}
                        {isLinkActive(link.href) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                        )}
                        
                        {/* Hover effect for non-active items */}
                        {!isLinkActive(link.href) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/20 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300"></div>
                        )}
                      </div>
                    ) : (
                      // For items without subpages, use normal anchor
                      <a
                        href={link.href}
                        onClick={onClose}
                        className={`block p-4 rounded-lg transition-all duration-300 relative overflow-hidden ${
                          isLinkActive(link.href) 
                            ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium relative z-10">{link.text}</span>
                        </div>
                        
                        {/* Active background gradient */}
                        {isLinkActive(link.href) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                        )}
                        
                        {/* Hover effect for non-active items */}
                        {!isLinkActive(link.href) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/20 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300"></div>
                        )}
                      </a>
                    )}
                  </div>

                  {/* Subpages dropdown */}
                  {hasSubpages && isExpanded && (
                    <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-3 border border-slate-200">
                        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {subpages.map((subpage, subIndex) => (
                            <a
                              key={subpage.url}
                              href={subpage.url}
                              onClick={onClose}
                              className={`block p-3 rounded-md transition-all duration-200 group ${
                                pathname === subpage.url
                                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                                  : 'hover:bg-white hover:shadow-sm text-gray-700'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                  pathname === subpage.url
                                    ? 'bg-white/20'
                                    : 'bg-gradient-to-br from-primary/20 to-secondary/20'
                                }`}>
                                  <span className="text-xs">{subpage.emoji}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-medium text-sm line-clamp-1 transition-colors duration-200 ${
                                      pathname === subpage.url
                                        ? 'text-white'
                                        : 'text-gray-900 group-hover:text-primary'
                                    }`}>
                                      {subpage.title}
                                    </h4>
                                    {subpage.isPopular && (
                                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        pathname === subpage.url
                                          ? 'bg-white/20 text-white'
                                          : 'bg-primary/10 text-primary'
                                      }`}>
                                        {lang === 'es' ? 'Popular' : 'Popular'}
                                      </span>
                                    )}
                                  </div>
                                  {subpage.description && (
                                    <p className={`text-xs mt-1 line-clamp-2 ${
                                      pathname === subpage.url
                                        ? 'text-white/80'
                                        : 'text-gray-500 group-hover:text-gray-600'
                                    }`}>
                                      {subpage.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                        
                        {/* View all link */}
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <a
                            href={link.href}
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors"
                          >
                            <span>{lang === 'es' ? 'Ver todos' : 'View All'}</span>
                            <ChevronRightIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced Mobile Navigation removed - now handled by specific layout components

const NavbarMobile: React.FC<NavbarMobileProps> = ({ lang, pathname, menuData }) => {
  // Mobile mega menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Helper functions
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const links = [
    { href: lang === 'en' ? '/en/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros', hasSubpages: false },
    { href: lang === 'en' ? '/en/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas', hasSubpages: true },
    { href: lang === 'en' ? '/en/guides' : '/es/guides', text: lang === 'en' ? 'Guides' : 'Guías', hasSubpages: true },
    { href: lang === 'en' ? '/en/clkr' : '/es/clkr', text: lang === 'en' ? 'CLKR' : 'CLKR', hasSubpages: true },
    { href: lang === 'en' ? '/en/blog' : '/es/blog', text: lang === 'en' ? 'Blog' : 'Blog', hasSubpages: true },
    { href: lang === 'en' ? '/en/contact' : '/es/contact', text: lang === 'en' ? 'Contact' : 'Contacto', hasSubpages: false },
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
        menuData={menuData}
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