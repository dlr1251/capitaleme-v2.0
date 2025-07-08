import { useState, useEffect, useRef } from 'react';
import Logo from '../../../assets/logo/color-horizontal.svg';
import NavbarMobile from './NavbarMobile.tsx';
import RealEstateMegaMenu from './mega-menus/RealEstateMegaMenu.tsx';
import ResourcesMegaMenu from './mega-menus/ResourcesMegaMenu.tsx';
import BlogMegaMenu from './mega-menus/BlogMegaMenu.tsx';
import VisasMegaMenu from './mega-menus/VisasMegaMenu.tsx';

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
  lang?: string;
  pathname?: string;
  menuData?: MenuDataType;
  onMegaMenuToggle?: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, pathname, menuData = {}, onMegaMenuToggle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isLanguageChanging, setIsLanguageChanging] = useState<boolean>(false);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !(megaMenuRef.current as any).contains(event.target)) {
        setActiveMegaMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUrlForLang = (path: string, targetLang: string) => {
    const currentLang = lang || 'en';
    let cleanedPath = path;
    
    // Remove current language prefix if it exists
    if (cleanedPath.startsWith(`/${currentLang}/`)) {
      cleanedPath = cleanedPath.substring(`/${currentLang}`.length);
    } else if (cleanedPath.startsWith(`/${currentLang}`)) {
      cleanedPath = cleanedPath.substring(`/${currentLang}`.length);
    }
    
    // Add target language prefix - always use /en/ and /es/
    if (targetLang === 'en') {
      return `/en${cleanedPath}`;
    } else {
      return `/es${cleanedPath}`;
    }
  };

  const links = [
    { href: lang === 'en' ? '/en/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros' },
    { href: lang === 'en' ? '/en/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas', hasMegaMenu: false },
    { href: lang === 'en' ? '/en/real-estate' : '/es/real-estate', text: lang === 'en' ? 'Real Estate' : 'Inmobiliario', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/resources' : '/es/resources', text: 'CLKR', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/blog' : '/es/blog', text: lang === 'en' ? 'Blog' : 'Blog', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/contact' : '/es/contact', text: lang === 'en' ? 'Contact' : 'Contacto' },
  ];

  // Helper function to check if a link is active
  const isLinkActive = (linkHref: string) => {
    if (!pathname) return false;
    
    // Exact match
    if (pathname === linkHref) return true;
    
    // For About Us, check if we're on the about page
    if (linkHref.includes('/about') && pathname.includes('/about')) return true;
    
    // For Visas & Immigration, check if we're on visas2 route
    if (linkHref.includes('/visas') && pathname.includes('/visas')) return true;
    
    // For Resources, check if we're on guides or CLKR routes
    if (linkHref.includes('/resources')) {
      return pathname.includes('/guides') || pathname.includes('/clkr');
    }
    
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

  const handleMegaMenuClick = (menuType: string) => {
    if (activeMegaMenu === menuType) {
      setActiveMegaMenu(null);
      onMegaMenuToggle?.(false);
      // Dispatch custom event for sticky header
      document.dispatchEvent(new CustomEvent('megaMenuToggle', { detail: { isOpen: false } }));
    } else {
      setActiveMegaMenu(menuType);
      onMegaMenuToggle?.(true);
      // Dispatch custom event for sticky header
      document.dispatchEvent(new CustomEvent('megaMenuToggle', { detail: { isOpen: true } }));
    }
  };

  const handleLanguageChange = (targetLang: string) => {
    setIsLanguageChanging(true);
    
    // Simulate loading time and then navigate
    setTimeout(() => {
      const newUrl = getUrlForLang(pathname || '/', targetLang);
      window.location.href = newUrl;
    }, 100);
  };

  // Language switcher component
  const LanguageSwitcher = () => (
    <button
      type="button"
      onClick={() => handleLanguageChange(lang === 'en' ? 'es' : 'en')}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm text-gray-700 hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-200 group ${isLanguageChanging ? 'animate-pulse' : ''}`}
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      disabled={isLanguageChanging}
    >
      {/* Bolita tipo notificación con icono de traducción */}
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center border-2 border-white shadow">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
        </svg>
      </span>
      {/* Indicador de idioma */}
      <span className={`text-xs font-medium transition-colors ${isLanguageChanging ? 'text-secondary' : 'text-gray-700 group-hover:text-secondary'}`}>{lang === 'en' ? 'Es' : 'En'}</span>
    </button>
  );

  return (
    <>
      <nav className={`bg-white border-gray-200 w-full transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
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
                      className={`group flex items-center py-2 px-3 text-gray-700 border-b border-gray-100 lg:border-0 lg:hover:text-secondary lg:p-0 transition-all duration-300 relative overflow-hidden ${
                        isLinkActive(link.href) ? 'text-primary font-semibold' : ''
                      } ${activeMegaMenu === link.text ? 'text-secondary' : ''}`}
                    >
                      {/* Special styling for Resources when on guides/CLKR routes */}
                      {link.href.includes('/resources') && (isOnGuidesRoute() || isOnCLKRRoute()) ? (
                        <span className="mr-1 relative z-10 text-secondary font-semibold border-b-2 border-secondary pb-1">
                          {isOnGuidesRoute() ? (lang === 'en' ? 'Guides' : 'Guías') : 'CLKR'}
                        </span>
                      ) : (
                        <span className="mr-1 relative z-10">{link.text}</span>
                      )}
                      
                      {/* Animated arrow icon */}
                      <svg 
                        className={`w-4 h-4 transition-all duration-300 transform arrow-rotate relative z-10 ${
                          activeMegaMenu === link.text ? 'rotate-180 text-secondary' : 'rotate-0 group-hover:rotate-90'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                      {/* Active indicator for mega menu items */}
                      {isLinkActive(link.href) && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full"></div>
                      )}
                      {/* Animated background indicator */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/20 rounded-lg opacity-0 transition-all duration-300 ${
                        activeMegaMenu === link.text ? 'opacity-100' : 'group-hover:opacity-50'
                      }`}></div>
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></div>
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className={`block py-2 px-3 text-gray-700 border-b border-gray-100 lg:border-0 lg:hover:text-secondary lg:p-0 transition-all duration-200 relative ${
                        isLinkActive(link.href) ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      <span className="relative z-10">{link.text}</span>
                      {/* Active indicator for About Us and other non-mega menu items */}
                      {isLinkActive(link.href) && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full"></div>
                      )}
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-secondary/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Language switcher botón simple */}
          <div className="relative inline-block text-left order-2 lg:order-2">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu/hamburger y menú mobile */}
          <div className="lg:hidden order-3">
            <NavbarMobile
              lang={lang || 'en'}
              pathname={pathname || '/'}
              menuData={menuData}
              handleLanguageChange={handleLanguageChange}
              isLanguageChanging={isLanguageChanging}
            />
          </div>
        </div>
      </nav>

      {/* Mega Menu Overlay - Fixed positioning for full width */}
      {activeMegaMenu && (
        <div 
          ref={megaMenuRef}
          onMouseDown={e => e.stopPropagation()}
          className="fixed top-26 left-0 w-full bg-white shadow-xl border-t border-gray-200 py-8 z-30 animate-in slide-in-from-top-2 duration-300 mega-menu-backdrop"
        >
          <div className="max-w-screen-xl mx-auto px-4">
            {/* Real Estate Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Real Estate' : 'Inmobiliario') && (
              <RealEstateMegaMenu lang={lang} menuData={menuData} currentPath={pathname} />
            )}

            {/* Resources Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Resources' : 'Recursos') && (
              <ResourcesMegaMenu lang={lang} menuData={menuData} currentPath={pathname} />
            )}

            {/* Blog Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Blog' : 'Blog') && (
              <BlogMegaMenu lang={lang} menuData={menuData} currentPath={pathname} />
            )}

            {/* Visas Mega Menu */}
            {activeMegaMenu === (lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas') && (
              <VisasMegaMenu lang={lang} menuData={menuData} currentPath={pathname} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
