import React, { useState, useMemo } from 'react';
import BlogCard from './BlogCard';
import type { BlogPost } from './BlogCard';

interface BlogExplorerProps {
  posts: BlogPost[];
}

const BlogExplorer = ({ posts }: BlogExplorerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid'); // 'grid' or 'masonry'

  // Extract unique categories from posts (you can add a Category property to your Notion database)
  const categories = useMemo(() => {
    const cats = ['all', 'latest', 'featured'];
    return cats;
  }, []);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    if (selectedCategory === 'latest') return posts.slice(0, 6);
    if (selectedCategory === 'featured') return posts.filter(post => post.properties?.Featured?.checkbox);
    return posts;
  }, [posts, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-light text-gray-900 mb-6">
              Nuestro Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre insights, historias y conocimiento experto sobre inmigración, bienes raíces y vida en Colombia
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Category Tabs */}
            <div className="flex space-x-1">
              {categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'Todos' : 
                   category === 'latest' ? 'Recientes' : 
                   category === 'featured' ? 'Destacados' : category}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'masonry'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Posts Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Mostrando {filteredPosts.length} de {posts.length} artículos
            </p>
          </div>

          {/* Grid Layout */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: BlogPost, index: number) => (
                <div
                  key={post.id}
                  className={`transform transition-all duration-500 ${
                    index % 3 === 0 ? 'md:translate-y-0' : 
                    index % 3 === 1 ? 'md:translate-y-4' : 'md:translate-y-8'
                  }`}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}

          {/* Masonry Layout */}
          {viewMode === 'masonry' && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {filteredPosts.map((post: BlogPost, index: number) => (
                <div key={post.id} className="break-inside-avoid mb-8">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron artículos</h3>
              <p className="text-gray-600">Intenta seleccionar una categoría diferente o revisa más tarde para nuevo contenido.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            Mantente Actualizado
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Recibe los últimos insights y actualizaciones directamente en tu correo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogExplorer; 