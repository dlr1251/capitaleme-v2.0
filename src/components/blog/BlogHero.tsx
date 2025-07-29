import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BlogHeroProps {
  posts: any[];
  categories: string[];
  lang?: 'en' | 'es';
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
}

const BlogHero: React.FC<BlogHeroProps> = ({
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

  const textContent = {
    en: {
      title: 'Our Blog',
      subtitle: 'Insights, updates, and stories from our team. Discover the latest in immigration, business, and life in Colombia.',
      searchPlaceholder: 'Search articles...',
      allCategories: 'All Categories',
      sortBy: 'Sort by',
      date: 'Date',
      sortByTitle: 'Title',
      category: 'Category',
      results: 'results',
      showing: 'Showing',
      of: 'of',
      totalArticles: 'total articles'
    },
    es: {
      title: 'Nuestro Blog',
      subtitle: 'Perspectivas, actualizaciones e historias de nuestro equipo. Descubre lo último en inmigración, negocios y vida en Colombia.',
      searchPlaceholder: 'Buscar artículos...',
      allCategories: 'Todas las Categorías',
      sortBy: 'Ordenar por',
      date: 'Fecha',
      sortByTitle: 'Título',
      category: 'Categoría',
      results: 'resultados',
      showing: 'Mostrando',
      of: 'de',
      totalArticles: 'artículos totales'
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
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">{content.date}</option>
                <option value="title">{content.sortByTitle}</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="text-sm text-gray-600">
                {content.showing} <span className="font-semibold">{filteredPosts.length}</span> {content.of} <span className="font-semibold">{posts.length}</span> {content.totalArticles}
              </div>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                {lang === 'es' ? 'Limpiar filtros' : 'Clear filters'}
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{posts.length}</div>
              <div className="text-sm text-gray-600">{lang === 'es' ? 'Artículos' : 'Articles'}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
              <div className="text-sm text-gray-600">{lang === 'es' ? 'Categorías' : 'Categories'}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {posts.filter(post => post.featured).length}
              </div>
              <div className="text-sm text-gray-600">{lang === 'es' ? 'Destacados' : 'Featured'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;