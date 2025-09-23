import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  XMarkIcon, 
  BookOpenIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Guide {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface GuidesArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  guides: Guide[];
  currentSlug: string | undefined;
  lang?: string;
}

const GuidesArticlesDrawer: React.FC<GuidesArticlesDrawerProps> = ({
  isOpen,
  onClose,
  guides = [],
  currentSlug,
  lang = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter guides based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGuides([]);
      setIsSearchMode(false);
      return;
    }

    const filtered = guides.filter(guide =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guide.description && guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredGuides(filtered);
    setIsSearchMode(true);
  }, [searchQuery, guides]);

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

  const handleGuideClick = (guide: Guide) => {
    window.location.href = guide.url;
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
      searchPlaceholder: 'Search guides...',
      guides: 'Legal Guides',
      noResults: 'No guides found',
      close: 'Close'
    },
    es: {
      searchPlaceholder: 'Buscar guías...',
      guides: 'Guías Legales',
      noResults: 'No se encontraron guías',
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
          <h3 className="text-lg font-semibold text-gray-900">{content.guides}</h3>
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
              {filteredGuides.length > 0 ? (
                <div className="space-y-2">
                  {filteredGuides.map((guide) => (
                    <button
                      key={guide.slug}
                      onClick={() => handleGuideClick(guide)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        guide.slug === currentSlug
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{guide.title}</div>
                      {guide.description && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {guide.description}
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
            // Guides list
            <div className="p-4">
              {guides.length > 0 ? (
                <div className="space-y-2">
                  {guides.map((guide) => (
                    <button
                      key={guide.slug}
                      onClick={() => handleGuideClick(guide)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        guide.slug === currentSlug
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start">
                        <BookOpenIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{guide.title}</div>
                          {guide.description && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {guide.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {content.noResults}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidesArticlesDrawer;
