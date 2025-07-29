import { useState, useEffect, useRef } from 'react';
import Logo from '../../../assets/logo/color-horizontal.svg';
import NavbarMobile from './NavbarMobile.tsx';
import RealEstateMegaMenu from './mega-menus/RealEstateMegaMenu.tsx';
import ResourcesMegaMenu from './mega-menus/ResourcesMegaMenu.tsx';
import BlogMegaMenu from './mega-menus/BlogMegaMenu.tsx';
import VisasMegaMenu from './mega-menus/VisasMegaMenu.tsx';
import LanguageDropdown from '../../shared/LanguageDropdown.tsx';

type Lang = 'en' | 'es';

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
  // New visa filtering data
  allVisas?: any[];
  visaCountries?: string[];
  visaTypes?: string[];
  popularVisasFiltered?: any[];
  visaFilters?: {
    countries: string[];
    visaTypes: string[];
    hasPopular: boolean;
  };
  // New guides filtering data
  allGuides?: any[];
  guideCategories?: string[];
  popularGuidesFiltered?: any[];
  guideFilters?: {
    categories: string[];
    hasPopular: boolean;
  };
}

interface NavbarProps {
  lang?: Lang;
  pathname?: string;
  onMegaMenuToggle?: (isOpen: boolean) => void;
  menuData?: MenuDataType;
}

const Navbar: React.FC<NavbarProps> = ({ lang, pathname, onMegaMenuToggle, menuData }) => {
  // Add client-side detection
  const [isClient, setIsClient] = useState<boolean>(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple scroll effect - only run on client
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Handle click outside to close mega menu - only run on client
  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !(megaMenuRef.current as any).contains(event.target)) {
        setActiveMegaMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isClient]);

  const links = [
    { href: lang === 'en' ? '/en/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros' },
    { href: lang === 'en' ? '/en/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas', hasMegaMenu: false },
    { href: lang === 'en' ? '/en/guides' : '/es/guides', text: lang === 'en' ? 'Guides' : 'Guías', hasMegaMenu: false },
    { href: lang === 'en' ? '/en/clkr' : '/es/clkr', text: 'CLKR', hasMegaMenu: false },
    // { href: lang === 'en' ? '/en/real-estate' : '/es/real-estate', text: lang === 'en' ? 'Real Estate' : 'Inmobiliario', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/blog' : '/es/blog', text: lang === 'en' ? 'Blog' : 'Blog', hasMegaMenu: false },
    { href: lang === 'en' ? '/en/contact' : '/es/contact', text: lang === 'en' ? 'Contact' : 'Contacto' },
  ];

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

  // Helper function to check if we're on guides route
  const isOnGuidesRoute = () => {
    return pathname && pathname.includes('/guides');
  };

  // Helper function to check if we're on CLKR route
  const isOnCLKRRoute = () => {
    return pathname && pathname.includes('/clkr');
  };

  // Helper function to check if we should show shadow (exclude CLKR pages)
  const shouldShowShadow = () => {
    // During SSR or before client hydration, always show a default shadow
    if (!isClient) {
      return true;
    }
    return isScrolled && !isOnCLKRRoute();
  };

  const handleMegaMenuClick = (menuType: string) => {
    if (activeMegaMenu === menuType) {
      setActiveMegaMenu(null);
      onMegaMenuToggle?.(false);
      // Dispatch custom event for sticky header
      if (isClient) {
        document.dispatchEvent(new CustomEvent('megaMenuToggle', { detail: { isOpen: false } }));
      }
    } else {
      setActiveMegaMenu(menuType);
      onMegaMenuToggle?.(true);
      // Dispatch custom event for sticky header
      if (isClient) {
        document.dispatchEvent(new CustomEvent('megaMenuToggle', { detail: { isOpen: true } }));
      }
    }
  };

  return (
    <>
      <nav className={`bg-white border-gray-200 w-full transition-all duration-300 sticky top-0 z-50 ${shouldShowShadow() ? 'shadow-lg' : 'shadow-sm'} ${activeMegaMenu ? 'shadow-none' : ''}`}>
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-2 md:p-4">
          <a href={lang === 'es' ? '/es' : '/en'} className="px-0 w-1/3 md:w-auto flex items-center">
            <img
              src={Logo.src}
              loading="eager"
              alt="Capital M Logo"
              className="h-8 md:mr-3"
              width={100}
            />
          </a>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:w-auto order-3 lg:order-1">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:mt-0 lg:space-x-8 rtl:space-x-reverse">
              {links.map((link) => (
                <li key={link.href} className="relative">
                  {link.hasMegaMenu ? (
                    <button
                      onClick={() => handleMegaMenuClick(link.text)}
                      className={`group flex items-center py-4 px-8 text-gray-700 border-b border-gray-100 lg:border-0 lg:p-0 transition-all duration-300 relative overflow-hidden rounded-lg ${
                        isLinkActive(link.href) 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg' 
                          : 'lg:hover:text-secondary'
                      } ${activeMegaMenu === link.text ? 'text-secondary' : ''}`}
                    >
                      {/* Special styling for Resources when on guides/CLKR routes */}
                      {link.href.includes('/resources') && (isOnGuidesRoute() || isOnCLKRRoute()) ? (
                        <span className={`mr-1 relative z-10 font-semibold ${
                          isLinkActive(link.href) ? 'text-white' : 'text-secondary'
                        }`}>
                          {isOnGuidesRoute() ? (lang === 'en' ? 'Guides' : 'Guías') : 'CLKR'}
                        </span>
                      ) : (
                        <span className={`mr-1 relative z-10 ${
                          isLinkActive(link.href) ? 'text-white px-2' : ''
                        }`}>{link.text}</span>
                      )}
                      
                      {/* Animated arrow icon */}
                      <svg 
                        className={`w-4 h-4 transition-all duration-300 transform arrow-rotate relative z-10 ${
                          activeMegaMenu === link.text 
                            ? 'rotate-180 text-secondary' 
                            : isLinkActive(link.href)
                            ? 'rotate-0 text-white'
                            : 'rotate-0 group-hover:rotate-90'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                      
                      {/* Active background gradient */}
                      {isLinkActive(link.href) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg"></div>
                      )}
                      
                      {/* Hover effect for non-active items */}
                      {!isLinkActive(link.href) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      )}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className={`block py-4 px-8 text-gray-700 border-b border-gray-100 lg:border-0 lg:p-0 transition-all duration-300 relative rounded-lg ${
                        isLinkActive(link.href) 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg' 
                          : 'lg:hover:text-secondary'
                      }`}
                    >
                      <span className="relative z-10 px-2">{link.text}</span>
                      
                      {/* Active background gradient */}
                      {isLinkActive(link.href) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg px-2"></div>
                      )}
                      
                      {/* Hover effect for non-active items */}
                      {!isLinkActive(link.href) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/20 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300"></div>
                      )}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Language dropdown */}
          <div className="relative inline-block text-left order-2 lg:order-2">
            <LanguageDropdown lang={lang || 'en'} pathname={pathname || '/'} />
          </div>

          {/* Mobile menu/hamburger y menú mobile */}
          <div className="lg:hidden order-3">
            <NavbarMobile
              lang={lang || 'en'}
              pathname={pathname || '/'}
            />
          </div>
        </div>
      </nav>

      {/* Mega Menu Overlay - Fixed positioning for full width */}
      {activeMegaMenu && (
        <div 
          ref={megaMenuRef}
          onMouseDown={e => e.stopPropagation()}
          className="fixed top-16 left-0 w-full bg-white shadow-xl border-t border-gray-200 py-8 z-30 animate-in slide-in-from-top-2 duration-300 mega-menu-backdrop"
        >
          <div className="max-w-screen-xl mx-auto px-4">
            {/* Real Estate Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Real Estate' : 'Inmobiliario') && (
              <RealEstateMegaMenu lang={lang} currentPath={pathname} />
            )}

            {/* Resources Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'CLKR' : 'CLKR') && (
              <ResourcesMegaMenu 
                lang={lang} 
                currentPath={pathname} 
                clkrData={menuData}
                loading={false}
              />
            )}

            {/* Blog Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Blog' : 'Blog') && (
              <BlogMegaMenu 
                lang={lang} 
                currentPath={pathname} 
                blogData={menuData}
                loading={false}
              />
            )}

            {/* Visas Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas') && (
              <VisasMegaMenu 
                lang={lang} 
                currentPath={pathname} 
                visas={menuData}
                loading={false}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
