import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  content?: string;
  category?: string;
  image?: string;
  lang: string;
  published?: boolean;
  featured?: boolean;
  author?: string;
  pub_date?: string;
  last_edited?: string;
  reading_time?: number;
  tags?: string[];
}

interface BlogCardProps {
  post: BlogPost;
  lang?: 'en' | 'es';
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

// Category styling function
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

// Generate gradient based on title
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

// Format date function
const formatDate = (dateString: string, lang: string = 'en'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return '';
  }
};

// Get relative time
const getRelativeTime = (dateString: string, lang: string = 'en'): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (lang === 'es') {
      if (diffInDays > 0) {
        return diffInDays === 1 ? 'hace 1 día' : `hace ${diffInDays} días`;
      } else if (diffInHours > 0) {
        return diffInHours === 1 ? 'hace 1 hora' : `hace ${diffInHours} horas`;
      } else if (diffInMinutes > 0) {
        return diffInMinutes === 1 ? 'hace 1 minuto' : `hace ${diffInMinutes} minutos`;
      } else {
        return 'ahora mismo';
      }
    } else {
      if (diffInDays > 0) {
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
      } else if (diffInHours > 0) {
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
      } else if (diffInMinutes > 0) {
        return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
      } else {
        return 'Just now';
      }
    }
  } catch (error) {
    return '';
  }
};

const BlogCard: React.FC<BlogCardProps> = ({ 
  post, 
  lang = 'en', 
  variant = 'default',
  className = ''
}) => {
  const categoryStyling = getCategoryStyling(post.category || '');
  const gradientClass = post.image ? generateGradient(post.title) : categoryStyling.gradient;
  const relativeTime = getRelativeTime(post.pub_date || post.last_edited || '', lang);
  const readingTime = post.reading_time || 5;
  const author = post.author || 'Capital M Law';

  const textContent = {
    en: {
      readMore: 'Read more',
      minRead: 'min read',
      by: 'by'
    },
    es: {
      readMore: 'Leer más',
      minRead: 'min de lectura',
      by: 'por'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  if (variant === 'compact') {
    return (
      <article className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{relativeTime}</span>
            {post.category && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryStyling.bgColor} ${categoryStyling.textColor}`}>
                {post.category}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {post.description || post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <UserIcon className="w-3 h-3 mr-1" />
              <span>{content.by} {author}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{readingTime} {content.minRead}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 ${className}`}>
        {/* Cover Image */}
        <div className="relative h-80 overflow-hidden">
          {post.image ? (
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Placeholder */}
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ${post.image ? 'hidden' : ''}`}>
            <div className="text-center text-white">
              <div className="text-6xl mb-4">{categoryStyling.icon}</div>
              <div className="text-lg font-medium opacity-90">{post.title}</div>
              {post.category && (
                <div className="text-sm opacity-75 mt-2">{post.category}</div>
              )}
            </div>
          </div>
          
          {/* Category overlay */}
          <div className="absolute top-4 right-4 text-2xl bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            {categoryStyling.icon}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{relativeTime}</span>
            {post.category && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryStyling.bgColor} ${categoryStyling.textColor}`}>
                {post.category}
              </span>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
            {post.description || post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>{content.by} {author}</span>
              <span className="mx-2">•</span>
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{readingTime} {content.minRead}</span>
            </div>
            
            <a 
              href={`/${lang}/blog/${post.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {content.readMore}
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${className}`}>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder */}
        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ${post.image ? 'hidden' : ''}`}>
          <div className="text-center text-white">
            <div className="text-4xl mb-2">{categoryStyling.icon}</div>
            <div className="text-sm font-medium opacity-90">{post.title}</div>
            {post.category && (
              <div className="text-xs opacity-75 mt-1">{post.category}</div>
            )}
          </div>
        </div>
        
        {/* Category overlay */}
        <div className="absolute top-3 right-3 text-xl bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          {categoryStyling.icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">{relativeTime}</span>
          {post.category && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryStyling.bgColor} ${categoryStyling.textColor}`}>
              {post.category}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.description || post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <UserIcon className="w-3 h-3 mr-1" />
            <span>{content.by} {author}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="w-3 h-3 mr-1" />
            <span>{readingTime} {content.minRead}</span>
          </div>
          
          <a 
            href={`/${lang}/blog/${post.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            {content.readMore}
            <ArrowRightIcon className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default BlogCard; 