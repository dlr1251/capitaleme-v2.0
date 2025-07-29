import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, SparklesIcon, BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline';

interface ModernBlogHeroProps {
  posts: any[];
  categories: string[];
  lang?: 'en' | 'es';
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
}

const ModernBlogHero: React.FC<ModernBlogHeroProps> = ({
  posts = [],
  categories = [],
  lang = 'en',
  onSearchChange,
  onCategoryChange,
  onSortChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const textContent = {
    en: {
      title: 'Our Blog',
      subtitle: 'Insights, updates, and stories from our team',
      description: 'Discover the latest in immigration, business, and life in Colombia. Expert insights, practical advice, and real stories from our legal team.',
      searchPlaceholder: 'Search articles...',
      allCategories: 'All Categories',
      sortBy: 'Sort by',
      date: 'Date',
      sortByTitle: 'Title',
      category: 'Category',
      results: 'results',
      showing: 'Showing',
      of: 'of',
      totalArticles: 'total articles',
      featured: 'Featured',
      latest: 'Latest',
      popular: 'Popular'
    },
    es: {
      title: 'Nuestro Blog',
      subtitle: 'Perspectivas, actualizaciones e historias de nuestro equipo',
      description: 'Descubre lo último en inmigración, negocios y vida en Colombia. Perspectivas expertas, consejos prácticos e historias reales de nuestro equipo legal.',
      searchPlaceholder: 'Buscar artículos...',
      allCategories: 'Todas las Categorías',
      sortBy: 'Ordenar por',
      date: 'Fecha',
      sortByTitle: 'Título',
      category: 'Categoría',
      results: 'resultados',
      showing: 'Mostrando',
      of: 'de',
      totalArticles: 'artículos totales',
      featured: 'Destacados',
      latest: 'Más Recientes',
      popular: 'Populares'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  // Filter posts based on search and category
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

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    onSortChange?.(sort);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('date');
    onSearchChange?.('');
    onCategoryChange?.('all');
    onSortChange?.('date');
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4 mr-2" />
            {content.latest} • {content.popular}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            <span className="gradient-text">{content.title}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {content.description}
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center text-slate-600">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              <span className="font-semibold">{posts.length} {lang === 'es' ? 'Artículos' : 'Articles'}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span className="font-semibold">{categories.length} {lang === 'es' ? 'Categorías' : 'Categories'}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <SparklesIcon className="w-5 h-5 mr-2" />
              <span className="font-semibold">{posts.filter(p => p.featured).length} {content.featured}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg bg-white/80 backdrop-blur-sm shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {/* Category Filter */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
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
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <span className="text-sm text-gray-600 px-2">{content.sortBy}:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
              >
                <option value="date">{content.date}</option>
                <option value="title">{content.sortByTitle}</option>
              </select>
            </div>
          </div>

          {/* Results Count with Animation */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className={`flex flex-wrap items-center justify-center gap-4 mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                <span className="text-sm text-gray-600">
                  {content.showing} <span className="font-semibold text-blue-600">{filteredPosts.length}</span> {content.of} <span className="font-semibold">{posts.length}</span> {content.totalArticles}
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors text-sm font-medium"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                {lang === 'es' ? 'Limpiar filtros' : 'Clear filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModernBlogHero; 