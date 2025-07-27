import { useState, useMemo, useEffect } from 'react';
import { getAllContentData } from '../../lib/contentData.js';

// Define types for blog posts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image: string;
  lang: string;
  published: boolean;
  featured: boolean;
  author: string;
  pub_date: string;
  last_edited: string;
  reading_time?: number;
  tags?: string[];
}

interface BlogExplorerProps {
  posts?: BlogPost[];
  className?: string;
  lang?: 'en' | 'es';
}

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  } else {
    return 'Just now';
  }
};

const getCategoryStyling = (category: string) => {
  const categoryLower = category?.toLowerCase() || '';
  
  if (categoryLower.includes('immigration') || categoryLower.includes('visa')) {
    return {
      gradient: 'from-blue-500 to-indigo-600',
      icon: '🛂',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    };
  } else if (categoryLower.includes('business') || categoryLower.includes('company')) {
    return {
      gradient: 'from-green-500 to-emerald-600',
      icon: '💼',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    };
  } else if (categoryLower.includes('lifestyle') || categoryLower.includes('life')) {
    return {
      gradient: 'from-purple-500 to-pink-600',
      icon: '🏠',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    };
  } else if (categoryLower.includes('legal') || categoryLower.includes('law')) {
    return {
      gradient: 'from-orange-500 to-red-600',
      icon: '⚖️',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    };
  } else if (categoryLower.includes('tax') || categoryLower.includes('finance')) {
    return {
      gradient: 'from-teal-500 to-cyan-600',
      icon: '💰',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200'
    };
  } else {
    return {
      gradient: 'from-slate-500 to-gray-600',
      icon: '📄',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200'
    };
  }
};

const generateGradient = (text: string): string => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-teal-500 to-cyan-600',
    'from-slate-500 to-gray-600'
  ];
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const BlogExplorer = ({ posts = [], className = "", lang = 'en' }: BlogExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from Supabase if none provided
  useEffect(() => {
    const fetchPosts = async () => {
      if (posts.length > 0) {
        setAllPosts(posts);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const contentData = await getAllContentData(lang);
        const fetchedPosts = contentData?.latestNews || [];
        setAllPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [posts, lang]);

  // Get unique categories from posts
  const categories = useMemo(() => {
    const cats = allPosts
      .map((post: BlogPost) => post.category)
      .filter((cat: string | undefined | null): cat is string => typeof cat === 'string' && Boolean(cat));
    return ['all', ...new Set(cats)];
  }, [allPosts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = allPosts.filter((post: BlogPost) => {
      const title = post.title;
      const description = post.description;
      const category = post.category;
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a: BlogPost, b: BlogPost) => {
      if (sortBy === 'date') {
        const dateA = a.pub_date ? new Date(a.pub_date).getTime() : 0;
        const dateB = b.pub_date ? new Date(b.pub_date).getTime() : 0;
        return dateB - dateA;
      } else if (sortBy === 'title') {
        const titleA = a.title;
        const titleB = b.title;
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    return filtered;
  }, [allPosts, searchTerm, selectedCategory, sortBy]);

  const textContent = {
    en: {
      searchPlaceholder: 'Search posts...',
      allCategories: 'All Categories',
      sortByDate: 'Sort by Date',
      sortByTitle: 'Sort by Title',
      showingResults: 'Showing {filtered} of {total} posts',
      noPostsFound: 'No posts found matching your criteria.',
      loading: 'Loading posts...',
      error: 'Failed to load posts'
    },
    es: {
      searchPlaceholder: 'Buscar publicaciones...',
      allCategories: 'Todas las Categorías',
      sortByDate: 'Ordenar por Fecha',
      sortByTitle: 'Ordenar por Título',
      showingResults: 'Mostrando {filtered} de {total} publicaciones',
      noPostsFound: 'No se encontraron publicaciones que coincidan con tus criterios.',
      loading: 'Cargando publicaciones...',
      error: 'Error al cargar publicaciones'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-600">{content.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{content.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={content.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category: string) => (
            <option key={category} value={category}>
              {category === 'all' ? content.allCategories : category}
            </option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date">{content.sortByDate}</option>
          <option value="title">{content.sortByTitle}</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {content.showingResults.replace('{filtered}', filteredPosts.length.toString()).replace('{total}', allPosts.length.toString())}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: BlogPost) => {
            const categoryStyling = getCategoryStyling(post.category);
            const gradientClass = post.image ? generateGradient(post.title) : categoryStyling.gradient;
            
            return (
              <article key={post.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ${post.image ? 'hidden' : ''}`}>
                    <div className="text-center text-white">
                      <div className="text-3xl mb-2">{categoryStyling.icon}</div>
                      <div className="text-xs font-medium opacity-90">{post.title}</div>
                      {post.category && (
                        <div className="text-xs opacity-75 mt-1">{post.category}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Icon overlay */}
                  <div className="absolute top-3 right-3 text-xl bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                    {categoryStyling.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500 font-medium">{getRelativeTime(post.pub_date)}</span>
                    {post.category && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryStyling.bgColor} ${categoryStyling.textColor}`}>
                        {post.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    <a href={`/${lang}/blog/${post.slug}`} className="block">
                      {post.title}
                    </a>
                  </h3>
                  
                  {post.description && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {post.description}
                    </p>
                  )}
                  
                  <a
                    href={`/${lang}/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 group/link"
                  >
                    {lang === 'es' ? 'Leer más' : 'Read more'}
                    <svg className="ml-1 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{content.noPostsFound}</p>
        </div>
      )}
    </div>
  );
};

export default BlogExplorer; 