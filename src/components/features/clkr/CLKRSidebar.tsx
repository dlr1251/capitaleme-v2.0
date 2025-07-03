import { useState, useEffect, useCallback } from 'react';

interface Article {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface CLKRSidebarProps {
  articlesByModule: Record<string, Article[]>;
  currentSlug: string | undefined;
  lang: string;
}

const CLKRSidebar = ({ articlesByModule, currentSlug, lang }: CLKRSidebarProps) => {
  const [currentSection, setCurrentSection] = useState('');
  const [currentModule, setCurrentModule] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);

  // Get all available modules
  const modules = Object.keys(articlesByModule);

  // Find the module that contains the current page
  const findCurrentModule = useCallback(() => {
    if (!currentSlug) return '';
    
    for (const [module, articles] of Object.entries(articlesByModule)) {
      const foundArticle = articles.find(article => article.slug === currentSlug);
      if (foundArticle) {
        return module;
      }
    }
    return '';
  }, [currentSlug, articlesByModule]);

  // Initialize current module when component loads
  useEffect(() => {
    const initialModule = findCurrentModule();
    if (initialModule) {
      setCurrentModule(initialModule);
      setSelectedModule(initialModule);
      
      // Set the current section to the current article title
      const currentArticle = articlesByModule[initialModule]?.find(article => article.slug === currentSlug);
      if (currentArticle) {
        setCurrentSection(currentArticle.title);
      }
      
      // Scroll to the module after a short delay to ensure DOM is ready
      setTimeout(() => {
        scrollToModule(initialModule);
      }, 100);
    }
  }, [currentSlug, articlesByModule, findCurrentModule]);

  // Function to scroll to a specific module in the sidebar
  const scrollToModule = useCallback((moduleName: string) => {
    if (!moduleName) return;
    
    setIsScrolling(true);
    
    // Find the module section in the sidebar
    const moduleElements = document.querySelectorAll('[data-module]');
    let targetModule: Element | null = null;
    
    for (const element of moduleElements) {
      const elementModule = element.getAttribute('data-module');
      if (elementModule === moduleName) {
        targetModule = element;
        break;
      }
    }
    
    if (targetModule) {
      // Find the scrollable container (the articles section)
      const scrollableContainer = targetModule.closest('.overflow-y-auto');
      
      if (scrollableContainer) {
        const containerRect = scrollableContainer.getBoundingClientRect();
        const targetRect = targetModule.getBoundingClientRect();
        const scrollTop = scrollableContainer.scrollTop;
        const targetTop = targetRect.top - containerRect.top + scrollTop;
        
        scrollableContainer.scrollTo({
          top: targetTop - 20, // Small offset for better visibility
          behavior: 'smooth'
        });
      }
      
      // Reset scrolling state after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    } else {
      // If module not found, try again after a short delay (for initial load)
      setTimeout(() => {
        if (moduleName) {
          scrollToModule(moduleName);
        }
      }, 200);
    }
  }, []);

  // Function to determine current section and module based on sidebar scroll position
  const handleSidebarScroll = useCallback(() => {
    if (isScrolling) return; // Don't update during programmatic scrolling
    
    // Find the scrollable container in the sidebar
    const scrollableContainer = document.querySelector('.overflow-y-auto');
    if (!scrollableContainer) return;
    
    const scrollTop = scrollableContainer.scrollTop;
    const containerHeight = scrollableContainer.clientHeight;
    
    // Find all module sections in the sidebar
    const moduleElements = document.querySelectorAll('[data-module]');
    let currentModuleName = '';
    let currentSectionTitle = '';
    let closestModule: Element | null = null;
    let minDistance = Infinity;
    
    moduleElements.forEach((moduleElement) => {
      const rect = moduleElement.getBoundingClientRect();
      const containerRect = scrollableContainer.getBoundingClientRect();
      const moduleTop = rect.top - containerRect.top + scrollTop;
      const moduleBottom = moduleTop + rect.height;
      
      // Check if this module is visible in the viewport
      if (moduleTop <= scrollTop + containerHeight * 0.3 && moduleBottom >= scrollTop) {
        const distance = Math.abs(scrollTop - moduleTop);
        if (distance < minDistance) {
          minDistance = distance;
          closestModule = moduleElement;
          currentModuleName = moduleElement.getAttribute('data-module') || '';
          
          // Get the first article title as the current section
          const firstArticle = moduleElement.querySelector('a');
          if (firstArticle) {
            const titleElement = firstArticle.querySelector('.font-medium');
            currentSectionTitle = titleElement?.textContent || '';
          }
        }
      }
    });
    
    setCurrentSection(currentSectionTitle);
    
    // Update current module automatically when scrolling
    if (currentModuleName && currentModuleName !== currentModule) {
      setCurrentModule(currentModuleName);
      // Clear manual selection when automatically detecting a different module
      if (selectedModule && selectedModule !== currentModuleName) {
        setSelectedModule('');
      }
    }
  }, [isScrolling, currentModule, selectedModule]);

  // Add sidebar scroll listener
  useEffect(() => {
    // Add sidebar scroll listener with throttling
    let ticking = false;
    const throttledHandleSidebarScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleSidebarScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Find the scrollable container and add listener
    const scrollableContainer = document.querySelector('.overflow-y-auto');
    if (scrollableContainer) {
      scrollableContainer.addEventListener('scroll', throttledHandleSidebarScroll);
      
      // Initial call
      handleSidebarScroll();
      
      return () => {
        scrollableContainer.removeEventListener('scroll', throttledHandleSidebarScroll);
      };
    }
  }, [handleSidebarScroll]);

  // Function to handle main window scroll for TOC highlighting (separate from sidebar)
  const handleMainScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200; // Offset for better detection
    
    // Find all section headings (h2, h3) in the main content
    const headings = document.querySelectorAll('h2, h3');
    let currentSectionTitle = '';
    let closestHeading: Element | null = null;
    let minDistance = Infinity;
    
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const distance = Math.abs(scrollPosition - elementTop);
      
      if (scrollPosition >= elementTop && distance < minDistance) {
        currentSectionTitle = heading.textContent || '';
        closestHeading = heading;
        minDistance = distance;
      }
    });
    
    // Only update current section if we're not in a manual selection state
    if (!selectedModule && currentSectionTitle) {
      setCurrentSection(currentSectionTitle);
    }
  }, [selectedModule]);

  // Add main window scroll listener
  useEffect(() => {
    // Add main window scroll listener with throttling
    let ticking = false;
    const throttledHandleMainScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMainScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleMainScroll);
    
    // Initial call
    handleMainScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledHandleMainScroll);
    };
  }, [handleMainScroll]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          📚 {lang === 'es' ? 'CLKR' : 'CLKR'}
        </h2>
        <p className="text-sm text-gray-600">
          {lang === 'es' ? 'Centro de Recursos Legales' : 'Colombian Legal Knowledge Repository'}
        </p>
      </div>

      {/* Sticky Current Section */}
      {currentSection && (  
        <div className="flex-shrink-0 sticky-section-title">
              
          {/* Module Selector */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {lang === 'es' ? 'Módulo' : 'Module'}
            </label>
            <select
              value={selectedModule || currentModule}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedModule(selectedValue);
                setCurrentModule(selectedValue);
                scrollToModule(selectedValue);
              }}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                isScrolling 
                  ? 'border-blue-300 bg-blue-50' 
                  : selectedModule 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300'
              }`}
            >
              <option value="">{lang === 'es' ? 'Todos los módulos' : 'All modules'}</option>
              {modules.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Scrollable Articles Section */}
      <div className="flex-1 overflow-y-auto min-h-0 py-4">
        <div className="space-y-6">
          {Object.entries(articlesByModule).map(([module, articles]) => (
            <div key={module} data-module={module} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                {module}
              </h3>
              <div className="space-y-1">
                {articles.map((article) => (
                  <a
                    key={article.slug}
                    href={article.url}
                    className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                      article.slug === currentSlug
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="font-medium">{article.title}</div>
                    {article.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {article.description}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Quick Links */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {lang === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
        </h3>
        <div className="space-y-2">
          <a 
            href={`/${lang}/clkr`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">🏠</span>
            {lang === 'es' ? 'Inicio CLKR' : 'CLKR Home'}
          </a>
          <a 
            href={`/${lang}/contact`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">📞</span>
            {lang === 'es' ? 'Contáctanos' : 'Contact Us'}
          </a>
          <a 
            href={`/${lang}/visas`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">🛂</span>
            {lang === 'es' ? 'Visas' : 'Visas'}
          </a>
          <a 
            href={`/${lang}/real-estate`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">🏠</span>
            {lang === 'es' ? 'Bienes Raíces' : 'Real Estate'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CLKRSidebar; 