import { useState, useEffect } from 'react';
import Logo from '../../../assets/logo/color-horizontal.svg';

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
  lang: string;
  pathname: string;
  menuData?: MenuDataType;
  handleLanguageChange: (lang: string) => void;
  isLanguageChanging: boolean;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({ lang, pathname, menuData = {}, handleLanguageChange, isLanguageChanging }) => {
  // Mobile mega menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileActiveSection, setMobileActiveSection] = useState<string | null>(null);
  const [mobileExpandedSections, setMobileExpandedSections] = useState<Set<string>>(new Set());

  // Helper functions
  const isMobileSectionExpanded = (sectionName: string) => mobileExpandedSections.has(sectionName);
  
  const handleMobileSectionToggle = (sectionName: string) => {
    setMobileExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setMobileActiveSection(null);
    setMobileExpandedSections(new Set());
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleMobileMenuClose();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Helper function to check if a link is active
  const isLinkActive = (linkHref: string) => {
    if (!pathname) return false;
    
    // Exact match
    if (pathname === linkHref) return true;
    
    // For About Us, check if we're on the about page
    if (linkHref.includes('/about') && pathname.includes('/about')) return true;
    
    // For Visas & Immigration, check if we're on visas2 route
    if (linkHref.includes('/visas2') && pathname.includes('/visas2')) return true;
    
    // For Resources, check if we're on guides or CLKR routes
    if (linkHref.includes('/resources')) {
      return pathname.includes('/guides') || pathname.includes('/clkr');
    }
    
    // For other pages, check if pathname includes the link href (but not for root)
    if (linkHref !== '/' && pathname.includes(linkHref)) return true;
    
    return false;
  };

  // Menu data
  const popularVisas = menuData.popularVisas || [];
  const guides = menuData.guides || [];
  const clkrServices = menuData.clkrServices || [];
  const latestNews = menuData.latestNews || [];
  const featuredProperty = menuData.featuredProperty;
  const realEstateArticles = menuData.realEstateArticles || [];

  const links = [
    { href: lang === 'en' ? '/en/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros', hasMegaMenu: false },
    { href: lang === 'en' ? '/en/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/real-estate' : '/es/real-estate', text: lang === 'en' ? 'Real Estate' : 'Inmobiliario', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/resources' : '/es/resources', text: lang === 'en' ? 'Resources' : 'Recursos', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/blog' : '/es/blog', text: lang === 'en' ? 'News' : 'Blog', hasMegaMenu: true },
    { href: lang === 'en' ? '/en/contact' : '/es/contact', text: lang === 'en' ? 'Contact' : 'Contacto', hasMegaMenu: false },
  ];

  return (
    <>
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
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd"/>
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden mobile-megamenu-backdrop"
            onClick={handleMobileMenuClose}
          />
          
          {/* Mobile menu */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white top-12 overflow-y-auto mobile-menu-container mobile-menu-smooth-scroll">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between mobile-content-fade-in">
              <div className="flex items-center space-x-3">
                <img
                  src={Logo.src}
                  alt="Capital M Logo"
                  className="h-8 mobile-icon-bounce"
                  width={100}
                />
                <span className="text-lg font-semibold text-gray-900">
                  {lang === 'en' ? 'Menu' : 'Menú'}
                </span>
              </div>
              <button
                onClick={handleMobileMenuClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mobile-menu-touch-target mobile-button-scale"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Menu content */}
            <div className="px-4 py-6 space-y-6 mobile-content-fade-in">
              {/* Main navigation links */}
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={link.href} className="mobile-menu-item" style={{ animationDelay: `${index * 50}ms` }}>
                    {link.hasMegaMenu ? (
                      <button
                        onClick={() => handleMobileSectionToggle(link.text)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 mobile-menu-touch-target mobile-button-scale mobile-menu-focus ${
                          isLinkActive(link.href) 
                            ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{link.text}</span>
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 mobile-arrow-rotate ${
                            isMobileSectionExpanded(link.text) ? 'expanded' : ''
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        onClick={handleMobileMenuClose}
                        className={`block p-4 rounded-lg transition-all duration-300 mobile-menu-touch-target mobile-menu-focus ${
                          isLinkActive(link.href) 
                            ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{link.text}</span>
                      </a>
                    )}

                    {/* Mega menu content for each section */}
                    {link.hasMegaMenu && isMobileSectionExpanded(link.text) && (
                      <div className="mt-2 ml-4 space-y-4 mobile-section-expand">
                        
                        {/* Visas & Immigration Mega Menu */}
                        {link.text === (lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas') && (
                          <div className="space-y-4">
                            {/* Popular Visas */}
                            {popularVisas.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-blue-600 icon-color-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  {lang === 'en' ? 'Popular Visas' : 'Visas Populares'}
                                </h4>
                                <div className="space-y-2">
                                  {popularVisas.slice(0, 4).map((visa, index) => (
                                    <a
                                      key={visa.href}
                                      href={visa.href}
                                      onClick={handleMobileMenuClose}
                                      className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 mobile-card-hover mobile-menu-focus"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-xs">📋</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-medium text-gray-900 text-sm">{visa.title}</h5>
                                          {visa.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{visa.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mobile-gradient-blue">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                {lang === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}
                              </h4>
                              <div className="space-y-2">
                                <a
                                  href={lang === 'en' ? '/en/contact' : '/es/contact'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'Get Consultation' : 'Obtener Consulta'}
                                </a>
                                <a
                                  href={lang === 'en' ? '/en/visas2' : '/es/visas2'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-white text-blue-600 text-center py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'View All Visas' : 'Ver Todas las Visas'}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Real Estate Mega Menu */}
                        {link.text === (lang === 'en' ? 'Real Estate' : 'Inmobiliario') && (
                          <div className="space-y-4">
                            {/* Featured Property */}
                            {featuredProperty && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-green-600 icon-color-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                                  </svg>
                                  {lang === 'en' ? 'Featured Property' : 'Propiedad Destacada'}
                                </h4>
                                <a
                                  href={featuredProperty.href}
                                  onClick={handleMobileMenuClose}
                                  className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 mobile-card-hover mobile-menu-focus"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                                      {featuredProperty.image && (
                                        <img 
                                          src={featuredProperty.image} 
                                          alt={featuredProperty.title}
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-gray-900 text-sm">{featuredProperty.title}</h5>
                                      <p className="text-xs text-gray-600 mt-1">{featuredProperty.location}</p>
                                      <p className="text-xs font-semibold text-green-600 mt-1">{featuredProperty.price}</p>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 mobile-gradient-green">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                {lang === 'en' ? 'Real Estate Services' : 'Servicios Inmobiliarios'}
                              </h4>
                              <div className="space-y-2">
                                <a
                                  href={lang === 'en' ? '/en/real-estate' : '/es/real-estate'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'Browse Properties' : 'Ver Propiedades'}
                                </a>
                                <a
                                  href={lang === 'en' ? '/en/contact' : '/es/contact'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-white text-green-600 text-center py-2 px-4 rounded-md border border-green-600 hover:bg-green-50 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'List Your Property' : 'Listar Tu Propiedad'}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Resources Mega Menu */}
                        {link.text === (lang === 'en' ? 'Resources' : 'Recursos') && (
                          <div className="space-y-4">
                            {/* Guides */}
                            {guides.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-blue-600 icon-color-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                  </svg>
                                  {lang === 'en' ? 'Guides' : 'Guías'}
                                </h4>
                                <div className="space-y-2">
                                  {guides.slice(0, 3).map((guide, index) => (
                                    <a
                                      key={guide.href}
                                      href={guide.href}
                                      onClick={handleMobileMenuClose}
                                      className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 mobile-card-hover mobile-menu-focus"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-xs">📚</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-medium text-gray-900 text-sm">{guide.title}</h5>
                                          {guide.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{guide.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* CLKR Services */}
                            {clkrServices.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-purple-600 icon-color-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                  </svg>
                                  CLKR
                                </h4>
                                <div className="space-y-2">
                                  {clkrServices.slice(0, 3).map((service, index) => (
                                    <a
                                      key={service.href}
                                      href={service.href}
                                      onClick={handleMobileMenuClose}
                                      className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 mobile-card-hover mobile-menu-focus"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-xs">⚖️</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-medium text-gray-900 text-sm">{service.title}</h5>
                                          {service.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 mobile-gradient-purple">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                {lang === 'en' ? 'Quick Access' : 'Acceso Rápido'}
                              </h4>
                              <div className="space-y-2">
                                <a
                                  href={lang === 'en' ? '/en/guides' : '/es/guides'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'All Guides' : 'Todas las Guías'}
                                </a>
                                <a
                                  href={lang === 'en' ? '/en/clkr' : '/es/clkr'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-white text-purple-600 text-center py-2 px-4 rounded-md border border-purple-600 hover:bg-purple-50 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  CLKR Repository
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Blog Mega Menu */}
                        {link.text === (lang === 'en' ? 'News' : 'Blog') && (
                          <div className="space-y-4">
                            {/* Latest Blog Posts */}
                            {latestNews.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-orange-600 icon-color-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                                  </svg>
                                  {lang === 'en' ? 'Latest Blog Posts' : 'Últimas Entradas del Blog'}
                                </h4>
                                <div className="space-y-2">
                                  {latestNews.slice(0, 3).map((news, index) => (
                                    <a
                                      key={news.href}
                                      href={news.href}
                                      onClick={handleMobileMenuClose}
                                      className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 mobile-card-hover mobile-menu-focus"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-xs">📰</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-medium text-gray-900 text-sm">{news.title}</h5>
                                          {news.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{news.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 mobile-gradient-orange">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                {lang === 'en' ? 'Stay Updated' : 'Mantente Actualizado'}
                              </h4>
                              <div className="space-y-2">
                                <a
                                  href={lang === 'en' ? '/en/blog2' : '/es/blog2'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-orange-600 text-white text-center py-2 px-4 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'All Articles' : 'Todos los Artículos'}
                                </a>
                                <a
                                  href={lang === 'en' ? '/en/contact' : '/es/contact'}
                                  onClick={handleMobileMenuClose}
                                  className="block w-full bg-white text-orange-600 text-center py-2 px-4 rounded-md border border-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium mobile-button-scale mobile-menu-focus"
                                >
                                  {lang === 'en' ? 'Subscribe' : 'Suscribirse'}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact section */}
              <div className="border-t border-gray-200 pt-6 mobile-section-divider">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {lang === 'en' ? 'Get in Touch' : 'Contáctanos'}
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:info@capitaleme.com"
                    onClick={handleMobileMenuClose}
                    className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mobile-menu-touch-target mobile-menu-focus"
                  >
                    <span className="text-xl mr-3">📧</span>
                    <span className="text-gray-700">info@capitaleme.com</span>
                  </a>
                  <a
                    href="https://wa.me/573001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleMobileMenuClose}
                    className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mobile-menu-touch-target mobile-menu-focus"
                  >
                    <span className="text-xl mr-3">💬</span>
                    <span className="text-gray-700">WhatsApp</span>
                  </a>
                  <a
                    href={lang === 'en' ? '/en/contact' : '/es/contact'}
                    onClick={handleMobileMenuClose}
                    className="flex items-center p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors mobile-menu-touch-target mobile-menu-focus mobile-button-scale"
                  >
                    <span className="text-xl mr-3">🚀</span>
                    <span className="font-medium">{lang === 'en' ? 'Contact Form' : 'Formulario de Contacto'}</span>
                  </a>
                </div>
              </div>

              {/* Language switcher */}
              <div className="border-t border-gray-200 pt-6 mobile-section-divider">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {lang === 'en' ? 'Language' : 'Idioma'}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    disabled={isLanguageChanging || lang === 'en'}
                    className={`w-full p-3 rounded-lg text-left transition-colors mobile-menu-touch-target mobile-menu-focus mobile-button-scale ${
                      lang === 'en' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    } ${isLanguageChanging ? 'mobile-menu-loading' : ''}`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">🇺🇸</span>
                      <span className="font-medium">English</span>
                      {lang === 'en' && (
                        <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('es')}
                    disabled={isLanguageChanging || lang === 'es'}
                    className={`w-full p-3 rounded-lg text-left transition-colors mobile-menu-touch-target mobile-menu-focus mobile-button-scale ${
                      lang === 'es' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    } ${isLanguageChanging ? 'mobile-menu-loading' : ''}`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">🇨🇴</span>
                      <span className="font-medium">Español</span>
                      {lang === 'es' && (
                        <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavbarMobile; 