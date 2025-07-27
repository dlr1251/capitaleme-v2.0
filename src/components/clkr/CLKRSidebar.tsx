import { useState, useEffect, useCallback } from 'react';
import { ChevronDownIcon, ChevronRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface Article {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface CLKRSidebarProps {
  articlesByModule: Record<string, Article[]>;
  currentSlug: string | undefined;
  lang?: string;
}

const CLKRSidebar = ({ articlesByModule, currentSlug, lang = 'en' }: CLKRSidebarProps) => {
  const [currentSection, setCurrentSection] = useState('');
  const [currentModule, setCurrentModule] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

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
      setExpandedModules(new Set([initialModule]));
      
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

  // Handle module selection
  const handleModuleSelect = (moduleName: string) => {
    setSelectedModule(moduleName);
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleName)) {
        newSet.delete(moduleName);
      } else {
        newSet.add(moduleName);
      }
      return newSet;
    });
  };

  // Handle article click
  const handleArticleClick = (article: Article) => {
    window.location.href = article.url;
  };

  // Text content based on language
  const textContent = {
    en: {
      navigation: 'Navigation',
      modules: 'Modules',
      articles: 'Articles',
      currentArticle: 'Current Article'
    },
    es: {
      navigation: 'Navegación',
      modules: 'Módulos',
      articles: 'Artículos',
      currentArticle: 'Artículo Actual'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{content.navigation}</h3>
      </div>

      {/* Module Selector */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {content.modules}
        </label>
        <select
          value={selectedModule}
          onChange={(e) => handleModuleSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{content.modules}</option>
          {modules.map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>
      </div>

      {/* Articles List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {modules.map((moduleName) => {
            const articles = articlesByModule[moduleName] || [];
            const isExpanded = expandedModules.has(moduleName);
            const isCurrentModule = moduleName === currentModule;
            
            return (
              <div key={moduleName} data-module={moduleName} className="mb-4">
                <button
                  onClick={() => handleModuleSelect(moduleName)}
                  className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                    isCurrentModule 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{moduleName}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {articles.map((article) => (
                      <button
                        key={article.slug}
                        onClick={() => handleArticleClick(article)}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                          article.slug === currentSlug
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {article.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Article Info */}
      {currentSection && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {content.currentArticle}
          </h4>
          <p className="text-sm text-gray-900">{currentSection}</p>
        </div>
      )}
    </div>
  );
};

export default CLKRSidebar; 