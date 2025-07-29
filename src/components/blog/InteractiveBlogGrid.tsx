import React, { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import BlogCard from './BlogCard.tsx';

interface InteractiveBlogGridProps {
  posts: any[];
  lang?: 'en' | 'es';
}

const InteractiveBlogGrid: React.FC<InteractiveBlogGridProps> = ({
  posts = [],
  lang = 'en'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const textContent = {
    en: {
      searchPlaceholder: 'Search articles...',
      allCategories: 'All Categories',
      sortBy: 'Sort by',
      date: 'Date',
      title: 'Title',
      category: 'Category',
      results: 'results',
      showing: 'Showing',
      of: 'of',
      totalArticles: 'total articles',
      clearFilters: 'Clear filters',
      gridView: 'Grid View',
      masonryView: 'Masonry View',
      noResults: 'No articles found matching your criteria.',
      tryDifferent: 'Try adjusting your search or filters.'
    },
    es: {
      searchPlaceholder: 'Buscar artículos...',
      allCategories: 'Todas las Categorías',
      sortBy: 'Ordenar por',
      date: 'Fecha',
      title: 'Título',
      category: 'Categoría',
      results: 'resultados',
      showing: 'Mostrando',
      of: 'de',
      totalArticles: 'artículos totales',
      clearFilters: 'Limpiar filtros',
      gridView: 'Vista de Cuadrícula',
      masonryView: 'Vista de Mosaico',
      noResults: 'No se encontraron artículos que coincidan con tus criterios.',
      tryDifferent: 'Intenta ajustar tu búsqueda o filtros.'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = posts.map(post => post.category).filter(Boolean);
    return [...new Set(cats)];
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.pub_date || a.last_edited || 0).getTime();
        const dateB = new Date(b.pub_date || b.last_edited || 0).getTime();
        return dateB - dateA;
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('date');
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filter Bar */}
      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{content.allCategories}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{content.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">{content.date}</option>
              <option value="title">{content.title}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              title={content.gridView}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'masonry' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              title={content.masonryView}
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {content.showing} <span className="font-semibold text-blue-600">{filteredPosts.length}</span> {content.of} <span className="font-semibold">{posts.length}</span> {content.totalArticles}
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              {content.clearFilters}
            </button>
          </div>
        )}
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {viewMode === 'masonry' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="break-inside-avoid mb-6 transform hover:scale-105 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s ease-out ${index * 100}ms`
                  }}
                >
                  <BlogCard 
                    post={post} 
                    lang={lang} 
                    variant="default"
                    className="hover-lift"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s ease-out ${index * 100}ms`
                  }}
                >
                  <BlogCard 
                    post={post} 
                    lang={lang} 
                    variant="default"
                    className="hover-lift"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`text-center py-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-gray-400 text-8xl mb-6 animate-bounce">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {content.noResults}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {content.tryDifferent}
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            {content.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveBlogGrid; 