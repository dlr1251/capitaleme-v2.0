import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  XMarkIcon, 
  BookOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Article {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface CLKRArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articlesByModule: Record<string, Article[]>;
  currentSlug: string | undefined;
  lang?: string;
}

const CLKRArticlesDrawer: React.FC<CLKRArticlesDrawerProps> = ({
  isOpen,
  onClose,
  articlesByModule = {},
  currentSlug,
  lang = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all articles for search
  const allArticles = useMemo(() => Object.values(articlesByModule || {}).flat(), [articlesByModule]);

  // Filter articles based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles([]);
      setIsSearchMode(false);
      return;
    }

    const filtered = allArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredArticles(filtered);
    setIsSearchMode(true);
  }, [searchQuery, allArticles]);

  // Expand all modules when search is active
  useEffect(() => {
    if (isSearchMode) {
      setExpandedModules(new Set(Object.keys(articlesByModule)));
    }
    // Only run when search mode is toggled on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchMode]);

  // Auto-expand the module containing the current article (only when not in search mode)
  useEffect(() => {
    if (currentSlug && !isSearchMode) {
      let found = false;
      for (const [module, articles] of Object.entries(articlesByModule)) {
        if (articles.some(article => article.slug === currentSlug)) {
          setExpandedModules(prev => {
            if (!prev.has(module)) {
              return new Set([...prev, module]);
            }
            return prev;
          });
          found = true;
          break;
        }
      }
      // Only set state if a module was found
      if (!found) {
        setExpandedModules(new Set());
      }
    }
    // Only run when currentSlug or articlesByModule changes and not in search mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug, articlesByModule]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleModule = (moduleName: string) => {
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

  const handleArticleClick = (article: Article) => {
    window.location.href = article.url;
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Text content based on language
  const textContent = {
    en: {
      searchPlaceholder: 'Search articles...',
      articles: 'Articles',
      noResults: 'No articles found',
      close: 'Close'
    },
    es: {
      searchPlaceholder: 'Buscar artículos...',
      articles: 'Artículos',
      noResults: 'No se encontraron artículos',
      close: 'Cerrar'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        ref={drawerRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{content.articles}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
          {isSearchMode ? (
            // Search results
            <div className="p-4">
              {filteredArticles.length > 0 ? (
                <div className="space-y-2">
                  {filteredArticles.map((article) => (
                    <button
                      key={article.slug}
                      onClick={() => handleArticleClick(article)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        article.slug === currentSlug
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{article.title}</div>
                      {article.description && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {article.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {content.noResults}
                </div>
              )}
            </div>
          ) : (
            // Module list
            <div className="p-4">
              {Object.entries(articlesByModule).map(([moduleName, articles]) => (
                <div key={moduleName} className="mb-4">
                  <button
                    onClick={() => toggleModule(moduleName)}
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <BookOpenIcon className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{moduleName}</span>
                    </div>
                    {expandedModules.has(moduleName) ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedModules.has(moduleName) && (
                    <div className="ml-6 mt-2 space-y-1">
                      {articles.map((article) => (
                        <button
                          key={article.slug}
                          onClick={() => handleArticleClick(article)}
                          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                            article.slug === currentSlug
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CLKRArticlesDrawer; 