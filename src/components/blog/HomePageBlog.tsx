import { useState, useEffect } from 'react';

// Type definitions
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

interface HomePageBlogProps {
  lang?: string;
  posts?: BlogPost[];
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

const HomePageBlog: React.FC<HomePageBlogProps> = ({ lang = 'en', posts = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use posts prop if provided
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      // Posts are passed as props, no need to fetch
      setLoading(false);
    } catch (err) {
      console.error('Error processing blog posts:', err);
      setError('Failed to load blog posts');
      setLoading(false);
    }
  }, [posts]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {lang === 'es' ? 'Cargando publicaciones...' : 'Loading blog posts...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const textContent = {
    en: {
      badge: '📚 Legal Insights & Resources',
      title: 'Latest from Our',
      subtitle: 'Legal Blog',
      description: 'Stay informed with expert insights on Colombian immigration, real estate, and legal matters. Our comprehensive guides help you navigate Colombia\'s legal landscape with confidence.',
      featured: 'Featured',
      readFullArticle: 'Read Full Article',
      recentPosts: 'Recent Posts',
      viewAllPosts: 'View All Posts',
      newsletterTitle: 'Stay Updated with Legal Insights',
      newsletterDescription: 'Get the latest updates on Colombian immigration, real estate, and legal matters delivered to your inbox.',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Enter your email',
      minRead: 'min read',
      by: 'by'
    },
    es: {
      badge: '📚 Recursos e Información Legal',
      title: 'Lo Último de Nuestro',
      subtitle: 'Blog Legal',
      description: 'Mantente informado con las mejores perspectivas sobre inmigración colombiana, bienes raíces y asuntos legales. Nuestras guías completas te ayudan a navegar el panorama legal de Colombia con confianza.',
      featured: 'Destacado',
      readFullArticle: 'Leer Artículo Completo',
      recentPosts: 'Publicaciones Recientes',
      viewAllPosts: 'Ver Todas las Publicaciones',
      newsletterTitle: 'Mantente Actualizado con Información Legal',
      newsletterDescription: 'Recibe las últimas actualizaciones sobre inmigración colombiana, bienes raíces y asuntos legales en tu bandeja de entrada.',
      subscribe: 'Suscribirse',
      emailPlaceholder: 'Ingresa tu email',
      minRead: 'min de lectura',
      by: 'por'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5);

  if (!featuredPost) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              {lang === 'es' ? 'No hay publicaciones disponibles.' : 'No blog posts available.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const categoryStyling = getCategoryStyling(featuredPost.category);
  const gradientClass = featuredPost.image ? generateGradient(featuredPost.title) : categoryStyling.gradient;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {content.title}
            <span className="block text-secondary">{content.subtitle}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                {featuredPost.image ? (
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                <div className={`w-full h-64 md:h-80 bg-gradient-to-br ${gradientClass} flex items-center justify-center ${featuredPost.image ? 'hidden' : ''}`}>
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{categoryStyling.icon}</div>
                    <div className="text-sm font-medium opacity-90">{featuredPost.title}</div>
                    {featuredPost.category && (
                      <div className="text-xs opacity-75 mt-1">{featuredPost.category}</div>
                    )}
                  </div>
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {content.featured}
                  </span>
                </div>
                
                {featuredPost.category && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryStyling.bgColor} ${categoryStyling.textColor} ${categoryStyling.borderColor}`}>
                      {featuredPost.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {content.by} {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featuredPost.reading_time || 5} {content.minRead}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(featuredPost.pub_date)}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.description}
                </p>
                
                <a 
                  href={`/${lang}/blog/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-lg hover:from-secondary/80 hover:to-primary/80 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  {content.readFullArticle}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Posts - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {content.recentPosts}
              </h3>
              
              <div className="space-y-6">
                {recentPosts.map((post: BlogPost, index: number) => {
                  const postCategoryStyling = getCategoryStyling(post.category);
                  const postGradientClass = post.image ? generateGradient(post.title) : postCategoryStyling.gradient;
                  
                  return (
                    <article key={post.id} className="group">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
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
                          
                          <div className={`w-full h-full bg-gradient-to-br ${postGradientClass} flex items-center justify-center ${post.image ? 'hidden' : ''}`}>
                            <div className="text-center text-white">
                              <div className="text-lg">{postCategoryStyling.icon}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span>{formatDate(post.pub_date)}</span>
                            <span>•</span>
                            <span>{post.reading_time || 5} {content.minRead}</span>
                          </div>
                          
                          <a href={`/${lang}/blog/${post.slug}`}>
                            <h4 className="text-sm font-semibold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                              {post.title}
                            </h4>
                          </a>
                          
                          {post.category && (
                            <div className="flex flex-wrap gap-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${postCategoryStyling.bgColor} ${postCategoryStyling.textColor} ${postCategoryStyling.borderColor}`}>
                                {post.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a 
                  href={`/${lang}/blog`}
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition-all duration-300"
                >
                  {content.viewAllPosts}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{content.newsletterTitle}</h3>
            <p className="text-lg mb-6 opacity-90">
              {content.newsletterDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder={content.emailPlaceholder}
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                {content.subscribe}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageBlog; 