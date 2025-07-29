import React, { useState, useEffect } from 'react';
import { BookOpenIcon, UsersIcon, SparklesIcon, ClockIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';

interface BlogStatsProps {
  posts: any[];
  categories: string[];
  lang?: 'en' | 'es';
}

const BlogStats: React.FC<BlogStatsProps> = ({
  posts = [],
  categories = [],
  lang = 'en'
}) => {
  const [counts, setCounts] = useState({
    articles: 0,
    categories: 0,
    featured: 0,
    totalViews: 0,
    totalLikes: 0,
    avgReadingTime: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const animateCounters = () => {
      const finalCounts = {
        articles: posts.length,
        categories: categories.length,
        featured: posts.filter(p => p.featured).length,
        totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
        totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
        avgReadingTime: Math.round(posts.reduce((sum, post) => sum + (post.reading_time || 5), 0) / posts.length) || 5
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounts({
          articles: Math.round(finalCounts.articles * progress),
          categories: Math.round(finalCounts.categories * progress),
          featured: Math.round(finalCounts.featured * progress),
          totalViews: Math.round(finalCounts.totalViews * progress),
          totalLikes: Math.round(finalCounts.totalLikes * progress),
          avgReadingTime: Math.round(finalCounts.avgReadingTime * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounts(finalCounts);
        }
      }, stepDuration);
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, [posts, categories]);

  const textContent = {
    en: {
      title: 'Our Content',
      description: 'Discover our comprehensive collection of legal insights and resources',
      articles: 'Articles',
      categories: 'Categories',
      featured: 'Featured',
      totalViews: 'Total Views',
      totalLikes: 'Total Likes',
      avgReadingTime: 'Avg. Reading Time'
    },
    es: {
      title: 'Nuestro Contenido',
      description: 'Descubre nuestra colección integral de perspectivas legales y recursos',
      articles: 'Artículos',
      categories: 'Categorías',
      featured: 'Destacados',
      totalViews: 'Vistas Totales',
      totalLikes: 'Me Gusta Totales',
      avgReadingTime: 'Tiempo Promedio de Lectura'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  const stats = [
    {
      icon: BookOpenIcon,
      label: content.articles,
      value: counts.articles,
      color: 'blue',
      delay: 0
    },
    {
      icon: UsersIcon,
      label: content.categories,
      value: counts.categories,
      color: 'green',
      delay: 100
    },
    {
      icon: SparklesIcon,
      label: content.featured,
      value: counts.featured,
      color: 'purple',
      delay: 200
    },
    {
      icon: EyeIcon,
      label: content.totalViews,
      value: counts.totalViews,
      color: 'indigo',
      delay: 300
    },
    {
      icon: HeartIcon,
      label: content.totalLikes,
      value: counts.totalLikes,
      color: 'pink',
      delay: 400
    },
    {
      icon: ClockIcon,
      label: content.avgReadingTime,
      value: counts.avgReadingTime,
      color: 'orange',
      delay: 500
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      pink: 'bg-pink-50 text-pink-600 border-pink-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl p-6 border-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${getColorClasses(stat.color)}`}
              style={{
                animationDelay: `${stat.delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease-out ${stat.delay}ms`
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl bg-white/50 mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium opacity-80">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <SparklesIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">
              {lang === 'es' 
                ? `${posts.length} artículos publicados • Actualizado regularmente`
                : `${posts.length} articles published • Updated regularly`
              }
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogStats; 