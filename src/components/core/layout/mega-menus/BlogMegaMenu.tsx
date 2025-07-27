
import React, { useState, useEffect } from 'react';
import { getAllContentData } from '../../../../lib/contentData.js';

interface BlogMegaMenuProps {
  lang?: string;
  currentPath?: string;
  blogData?: any;
  loading?: boolean;
}

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

const BlogMegaMenu: React.FC<BlogMegaMenuProps> = ({ blogData, loading, lang = 'en', currentPath }) => {
  const [latestBlogPosts, setLatestBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use blogData prop if available, otherwise fetch from contentData
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (blogData?.latestNews && blogData.latestNews.length > 0) {
          // Use the blogData prop if available
          setLatestBlogPosts(blogData.latestNews);
        } else {
          // Fallback to fetching from contentData
          const contentData = await getAllContentData(lang);
          const posts = contentData?.latestNews || [];
          setLatestBlogPosts(posts);
        }
      } catch (err) {
        console.error('Error fetching blog posts for mega menu:', err);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [lang, blogData]);

  // Get excerpt from text
  const getExcerpt = (text: string, wordCount: number) => {
    const words = text.split(' ');
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get relative time string
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

  // Get category styling
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

  // Generate gradient based on text
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

  // Format date for overlay
  const formatDateForOverlay = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return { day, month, year };
  };

  const textContent = {
    en: {
      latestBlogPosts: 'Latest Blog Posts',
      quickActions: 'Quick Actions',
      viewAllPosts: 'View All Posts',
      getConsultation: 'Get Consultation',
      featured: 'Featured',
      readMore: 'Read More',
      minRead: 'min read',
      noData: 'No blog data available.',
      loading: 'Loading blog posts...'
    },
    es: {
      latestBlogPosts: 'Últimas Entradas del Blog',
      quickActions: 'Acciones Rápidas',
      viewAllPosts: 'Ver Todas las Entradas',
      getConsultation: 'Obtener Consulta',
      featured: 'Destacado',
      readMore: 'Leer Más',
      minRead: 'min de lectura',
      noData: 'No hay datos de blog disponibles.',
      loading: 'Cargando publicaciones...'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  if (isLoading || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !latestBlogPosts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{content.noData}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Latest Blog Posts */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            {content.latestBlogPosts}
          </h3>
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {latestBlogPosts.slice(0, 6).map((post) => {
                const categoryStyling = getCategoryStyling(post.category);
                const gradientClass = post.image ? generateGradient(post.title) : categoryStyling.gradient;
                
                return (
                  <a 
                    key={post.id} 
                    href={`/${lang}/blog/${post.slug}`}
                    className={`block group p-3 rounded-lg border transition-all duration-200
                      ${currentPath && currentPath.startsWith(`/${lang}/blog/${post.slug}`) ? 'bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg' : 'hover:bg-primary/5 hover:border-primary/30'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center text-white text-xs font-medium ${post.image ? 'hidden' : ''}`}>
                          {categoryStyling.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary line-clamp-2 transition-colors duration-200">
                          {post.title}
                        </h4>
                        {post.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{getExcerpt(post.description, 12)}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {post.reading_time || 5} {content.minRead}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
                            </svg>
                            {getRelativeTime(post.pub_date)}
                          </span>
                        </div>
                        {/* Author information */}
                        {post.author && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {post.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-gray-600">{post.author}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Quick Actions */}
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
              </svg>
              {content.quickActions}
            </h3>
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <a
                href={`/${lang}/blog`}
                className="block w-full bg-secondary text-white text-center py-2 px-4 rounded-md hover:bg-primary transition-colors text-sm font-medium"
              >
                {content.viewAllPosts}
              </a>
              <a
                href={`/${lang}/contact`}
                className="block w-full bg-white text-secondary text-center py-2 px-4 rounded-md border border-secondary hover:bg-secondary/5 transition-colors text-sm font-medium"
              >
                {content.getConsultation}
              </a>
            </div>
          </div>
        </div>

        {/* Column 3: Featured Post */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>
            {content.featured}
          </h3>
          
          {latestBlogPosts.length > 0 ? (
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20 h-full">
              <div className="relative mb-3">
                {latestBlogPosts[0].image ? (
                  <img 
                    src={latestBlogPosts[0].image} 
                    alt={latestBlogPosts[0].title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                <div className={`w-full h-32 bg-gradient-to-br ${generateGradient(latestBlogPosts[0].title)} flex items-center justify-center rounded-lg ${latestBlogPosts[0].image ? 'hidden' : ''}`}>
                  <div className="text-center text-white">
                    <div className="text-2xl mb-1">{getCategoryStyling(latestBlogPosts[0].category).icon}</div>
                    <div className="text-xs font-medium opacity-90">{latestBlogPosts[0].title}</div>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  {content.featured}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {latestBlogPosts[0].title}
              </h4>
              {latestBlogPosts[0].description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {getExcerpt(latestBlogPosts[0].description, 20)}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{getRelativeTime(latestBlogPosts[0].pub_date)}</span>
                <span>{latestBlogPosts[0].reading_time || 5} {content.minRead}</span>
              </div>
              <a 
                href={`/${lang}/blog/${latestBlogPosts[0].slug}`}
                className="block w-full bg-primary text-white text-center py-2 px-4 rounded-md hover:bg-secondary transition-colors text-sm font-medium"
              >
                {content.readMore}
              </a>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center">
                {content.noData}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogMegaMenu; 