import { useState, useEffect, useRef, useCallback } from 'react';
import { getPageTitle, getPageDescription, getPageSelectValue } from '../../../../utils/notionHelpers.js';

interface BlogMegaMenuProps {
  lang?: string;
  menuData?: any;
  currentPath?: string;
}

interface BlogPost {
  title: string;
  href: string;
  image: string;
  date: string;
  excerpt?: string;
  readingTime: number;
  pubDate: string;
  createdDate?: string;
  lastEdited?: string;
  author?: {
    name: string;
    avatar: string;
    role?: string;
  };
}

const BlogMegaMenu: React.FC<BlogMegaMenuProps> = ({ lang, menuData = {}, currentPath }) => {
  const [latestBlogPosts, setLatestBlogPosts] = useState<BlogPost[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);



  // Get blog posts from menuData or use fallback
  useEffect(() => {
    if (menuData.latestNews && menuData.latestNews.length > 0) {
      // Transform the data to include proper date fields
      const transformedPosts = menuData.latestNews.map((post: any) => ({
        ...post,
        createdDate: post.date || post.pubDate,
        lastEdited: post.lastEdited || post.pubDate
      }));
      setLatestBlogPosts(transformedPosts);
    } else {
        // Fallback data with author information
        setLatestBlogPosts([
          { 
            title: lang === 'en' ? 'Counting Your Days' : 'Contando Tus Días', 
            href: lang === 'en' ? '/en/blog/counting-your-days' : '/es/blog/counting-your-days',
            image: '/blog/counting-your-days/img-1.webp',
            date: '2024',
            excerpt: lang === 'en' ? 'Understanding Colombian immigration time limits' : 'Entendiendo los límites de tiempo de inmigración colombiana',
            readingTime: 5,
            pubDate: '2024-01-15',
            createdDate: '2024-01-15',
            lastEdited: '2024-01-20',
            author: {
              name: 'Daniel Luque',
              avatar: '/images/team/danielluque.jpg',
              role: 'Legal Expert'
            }
          },
          { 
            title: lang === 'en' ? 'DNV Confusion' : 'Confusión DNV', 
            href: lang === 'en' ? '/en/blog/dnv-confusion' : '/es/blog/dnv-confusion',
            image: '/blog/dnv-confusion/img-1.webp',
            date: '2024',
            excerpt: lang === 'en' ? 'Decoding Colombia\'s Digital Nomad Visa requirements' : 'Descifrando los requisitos de la Visa de Nómada Digital',
            readingTime: 4,
            pubDate: '2024-01-12',
            createdDate: '2024-01-12',
            lastEdited: '2024-01-18',
            author: {
              name: 'María Fernanda Duarte',
              avatar: '/images/team/mafeduarte.jpg',
              role: 'Abogada'
            }
          },
          { 
            title: lang === 'en' ? 'On Gringo Prices' : 'Sobre Precios Gringo', 
            href: lang === 'en' ? '/en/blog/on-gringo-prices' : '/es/blog/on-gringo-prices',
            image: '/blog/gringo-prices/img-1.webp',
            date: '2024',
            excerpt: lang === 'en' ? 'Understanding cost differences in Colombia' : 'Entendiendo las diferencias de costo en Colombia',
            readingTime: 6,
            pubDate: '2024-01-10',
            createdDate: '2024-01-10',
            lastEdited: '2024-01-16',
            author: {
              name: 'Mateo Martínez',
              avatar: '/images/team/mateo.jpeg',
              role: 'Legal Assistant'
            }
          },
          { 
            title: lang === 'en' ? 'Apostille Services Guide' : 'Guía de Servicios de Apostilla', 
            href: lang === 'en' ? '/en/blog/apostille' : '/es/blog/apostille',
            image: '/blog/apostille/img-1.webp',
            date: '2024',
            excerpt: lang === 'en' ? 'Complete guide to document apostille services' : 'Guía completa de servicios de apostilla de documentos',
            readingTime: 7,
            pubDate: '2024-01-08',
            createdDate: '2024-01-08',
            lastEdited: '2024-01-14',
            author: {
              name: 'Sara Garcia',
              avatar: '/images/team/sara.jpeg',
              role: 'Accounting and Administration'
            }
          },
          { 
            title: lang === 'en' ? 'Colombian Business Visa Guide' : 'Guía de Visa de Negocios Colombiana', 
            href: lang === 'en' ? '/en/blog/business-visa' : '/es/blog/visa-negocios',
            image: '/blog/counting-your-days/img-2.webp',
            date: '2024',
            excerpt: lang === 'en' ? 'Complete guide to Colombian business visa requirements' : 'Guía completa de requisitos para visa de negocios colombiana',
            readingTime: 8,
            pubDate: '2024-01-05',
            createdDate: '2024-01-05',
            lastEdited: '2024-01-12',
            author: {
              name: 'Harold Zuluaga',
              avatar: '/images/team/harold.jpeg',
              role: 'Legal Intern'
            }
          },
          { 
            title: lang === 'en' ? 'Digital Nomad Lifestyle in Colombia' : 'Estilo de Vida Nómada Digital en Colombia', 
            href: lang === 'en' ? '/en/blog/digital-nomad' : '/es/blog/nomada-digital',
            image: '/blog/dnv-confusion/img-2.webp',
            date: '2024',
            excerpt: lang === 'en' ? 'Living and working remotely in Colombia' : 'Vivir y trabajar remotamente en Colombia',
            readingTime: 6,
            pubDate: '2024-01-03',
            createdDate: '2024-01-03',
            lastEdited: '2024-01-10',
            author: {
              name: 'Daniel Paul',
              avatar: '/images/team/ferrett.jpeg',
              role: 'Consultor Inmobiliario'
            }
          }
        ]);
      }
  }, [menuData.latestNews, lang]);

  // Calculate relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get excerpt from text
  const getExcerpt = (text: string, wordCount: number) => {
    const words = text.split(' ');
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  };

  // Format date for overlay
  const formatDateForOverlay = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return { day, month, year };
  };



  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Latest Blog Posts */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            {lang === 'en' ? 'Latest Blog Posts' : 'Últimas Entradas del Blog'}
          </h3>
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {latestBlogPosts.slice(0, 6).map((post, index) => (
                <a 
                  key={post.href} 
                  href={post.href}
                  className={`block group p-3 rounded-lg border transition-all duration-200
                    ${currentPath && currentPath.startsWith(post.href) ? 'bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg' : 'hover:bg-primary/5 hover:border-primary/30'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/blog/counting-your-days/img-1.webp';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary line-clamp-2 transition-colors duration-200">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{getExcerpt(post.excerpt, 12)}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {post.readingTime} {lang === 'en' ? 'min read' : 'min lectura'}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
                          </svg>
                          {getRelativeTime(post.pubDate)}
                        </span>
                      </div>
                      {/* Author information */}
                      {post.author && (
                        <div className="flex items-center gap-2 mt-2">
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name}
                            className="w-4 h-4 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/team/danielluque.jpg';
                            }}
                          />
                          <span className="text-xs text-gray-600">{post.author.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <a href={lang === 'en' ? '/en/blog' : '/es/blog'} className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-sm font-medium transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
                {lang === 'en' ? 'All Blog Posts' : 'Todas las Entradas del Blog'}
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Featured Article */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            {lang === 'en' ? 'Featured Article' : 'Artículo Destacado'}
          </h3>
          <div className="flex-1 flex flex-col">
            {latestBlogPosts.length > 0 && (
              <div className="group flex-1 flex flex-col">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <div className="relative h-32">
                    <img 
                      src={latestBlogPosts[0].image} 
                      alt={latestBlogPosts[0].title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/blog/counting-your-days/img-1.webp';
                      }}
                    />

                    {/* Beautiful last edited date overlay */}
                    {latestBlogPosts[0].lastEdited && (
                      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-white/20">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">
                            {formatDateForOverlay(latestBlogPosts[0].lastEdited).day}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            {formatDateForOverlay(latestBlogPosts[0].lastEdited).month}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateForOverlay(latestBlogPosts[0].lastEdited).year}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                  <h4 className="font-semibold text-gray-900 group-hover:text-secondary transition-colors">
                    {latestBlogPosts[0].title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {getExcerpt(latestBlogPosts[0].excerpt || '', 20)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {latestBlogPosts[0].readingTime} {lang === 'en' ? 'min read' : 'min lectura'}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
                      </svg>
                      {getRelativeTime(latestBlogPosts[0].pubDate)}
                    </span>
                  </div>
                  {/* Author information for featured article */}
                  {latestBlogPosts[0].author && (
                    <div className="flex items-center gap-2 mt-2">
                      <img 
                        src={latestBlogPosts[0].author.avatar} 
                        alt={latestBlogPosts[0].author.name}
                        className="w-5 h-5 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/team/danielluque.jpg';
                        }}
                      />
                      <div>
                        <span className="text-xs font-medium text-gray-700">{latestBlogPosts[0].author.name}</span>
                        {latestBlogPosts[0].author.role && (
                          <div className="text-xs text-gray-500">{latestBlogPosts[0].author.role}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-auto pt-4">
                  <a href={latestBlogPosts[0].href} className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-sm font-medium transition-all duration-200">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {lang === 'en' ? 'Read Article' : 'Leer Artículo'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Newsletter & Social */}
        <div className="flex flex-col h-full">
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {lang === 'en' ? 'Stay Updated' : 'Mantente Actualizado'}
              </h3>
              <div className="flex-1 flex flex-col">
                <p className="text-xs text-gray-600 mb-4">
                  {lang === 'en' 
                    ? 'Get the latest immigration news and legal insights delivered to your inbox.' 
                    : 'Recibe las últimas noticias de inmigración y asesoría legal en tu correo.'
                  }
                </p>
                <div className="space-y-3 flex-1">
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      placeholder={lang === 'en' ? 'Enter your email' : 'Ingresa tu correo'}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button className="w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-sm font-medium transition-all duration-200">
                      {lang === 'en' ? 'Subscribe' : 'Suscribirse'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {lang === 'en' ? 'No spam, unsubscribe at any time.' : 'Sin spam, cancela cuando quieras.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"/>
                </svg>
                {lang === 'en' ? 'Follow Us' : 'Síguenos'}
              </h3>
              <div className="flex justify-center space-x-3">
                <a href="https://youtube.com/@capitaleme" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5 text-red-600 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com/@capitaleme" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-black hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/capitaleme" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5 text-blue-600 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/capitaleme" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5 text-blue-600 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/capitaleme" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5 text-pink-600 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.617 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogMegaMenu; 