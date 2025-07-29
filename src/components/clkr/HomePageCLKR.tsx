import * as React from 'react';
import { BookOpenIcon, UsersIcon, BriefcaseIcon, HomeIcon, CheckCircleIcon, InformationCircleIcon, StarIcon, DocumentTextIcon, ScaleIcon, LightBulbIcon, SparklesIcon, AcademicCapIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/solid';

interface HomePageCLKRProps {
  lang?: 'en' | 'es';
  clkrServices?: any[];
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; lang?: 'en' | 'es' },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('CLKR Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">
            {this.props.lang === 'es' ? 'Error al cargar el repositorio legal' : 'Error loading legal repository'}
          </p>
          <p className="text-gray-600">
            {this.props.lang === 'es' ? 'Por favor, intenta refrescar la página' : 'Please try refreshing the page'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const HomePageCLKR: React.FC<HomePageCLKRProps> = ({ lang = 'en', clkrServices = [] }) => {
  // Get featured articles (first 3 popular ones)
  const featuredArticles = clkrServices?.slice(0, 3) || [];
  
  const content = lang === 'es' ? {
    title: "Repositorio Legal Colombiano",
    subtitle: "Tu acceso directo a la legislación y jurisprudencia colombiana",
    description: "Más de 200 artículos legales especializados, organizados en 17 módulos temáticos. Desde derecho constitucional hasta derecho laboral, nuestro repositorio ofrece análisis profundos y actualizados del sistema legal colombiano.",
    features: [
      {
        icon: BookOpenIcon,
        title: "Legislación Actualizada",
        description: "Leyes, decretos y reglamentos vigentes con análisis experto"
      },
      {
        icon: UsersIcon,
        title: "Jurisprudencia Especializada",
        description: "Sentencias y precedentes judiciales comentados"
      },
      {
        icon: BriefcaseIcon,
        title: "Doctrina Legal",
        description: "Análisis y comentarios de expertos legales"
      }
    ],
    featuredArticles: "Artículos Destacados",
    exploreButton: "Explorar Repositorio",
    learnMore: "Conoce más",
    stats: {
      articles: "200+ Artículos",
      modules: "17 Módulos",
      updated: "Actualizado Diariamente"
    },
    funFacts: [
      {
        icon: SparklesIcon,
        title: "Más de 200 artículos especializados",
        description: "Cada artículo escrito por abogados colombianos con experiencia práctica"
      },
      {
        icon: AcademicCapIcon,
        title: "17 módulos temáticos completos",
        description: "Desde derecho constitucional hasta derecho laboral y comercial"
      },
      {
        icon: ClockIcon,
        title: "Actualización diaria de contenido",
        description: "Mantente al día con los cambios legales más recientes"
      },
      {
        icon: GlobeAltIcon,
        title: "Análisis de expertos legales",
        description: "Información verificada por nuestro equipo de abogados especializados"
      }
    ]
  } : {
    title: "Colombian Legal Repository",
    subtitle: "Your direct access to Colombian legislation and jurisprudence",
    description: "Over 200 specialized legal articles organized in 17 thematic modules. From constitutional law to labor law, our repository offers deep and updated analysis of the Colombian legal system.",
    features: [
      {
        icon: BookOpenIcon,
        title: "Updated Legislation",
        description: "Current laws, decrees and regulations with expert analysis"
      },
      {
        icon: UsersIcon,
        title: "Specialized Jurisprudence",
        description: "Commented rulings and judicial precedents"
      },
      {
        icon: BriefcaseIcon,
        title: "Legal Doctrine",
        description: "Expert legal analysis and commentary"
      }
    ],
    featuredArticles: "Featured Articles",
    exploreButton: "Explore Repository",
    learnMore: "Learn More",
    stats: {
      articles: "200+ Articles",
      modules: "17 Modules", 
      updated: "Updated Daily"
    },
    funFacts: [
      {
        icon: SparklesIcon,
        title: "Over 200 specialized articles",
        description: "Each article written by Colombian attorneys with practical experience"
      },
      {
        icon: AcademicCapIcon,
        title: "17 complete thematic modules",
        description: "From constitutional law to labor and commercial law"
      },
      {
        icon: ClockIcon,
        title: "Daily content updates",
        description: "Stay current with the most recent legal changes"
      },
      {
        icon: GlobeAltIcon,
        title: "Expert legal analysis",
        description: "Information verified by our team of specialized attorneys"
      }
    ]
  };

  return (
    <ErrorBoundary lang={lang}>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              {content.subtitle}
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Fun Facts Section - Modern Design */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {lang === 'es' ? '¿Por qué elegir nuestro repositorio?' : 'Why choose our repository?'}
              </h2>
              <p className="text-gray-600">
                {lang === 'es' 
                  ? 'Descubre lo que hace único nuestro repositorio legal' 
                  : 'Discover what makes our legal repository unique'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.funFacts.map((fact, index) => (
                <div key={index} className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Decorative gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <fact.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {fact.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {fact.description}
                    </p>
                  </div>
                  
                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.stats.articles}</h3>
              <p className="text-gray-600 text-sm">{lang === 'es' ? 'Artículos especializados' : 'Specialized articles'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ScaleIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.stats.modules}</h3>
              <p className="text-gray-600 text-sm">{lang === 'es' ? 'Módulos temáticos' : 'Thematic modules'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LightBulbIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.stats.updated}</h3>
              <p className="text-gray-600 text-sm">{lang === 'es' ? 'Contenido actualizado' : 'Updated content'}</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {content.features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Featured Articles Section */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {content.featuredArticles}
                </h2>
                <p className="text-gray-600">
                  {lang === 'es' 
                    ? 'Artículos más populares y relevantes de nuestro repositorio' 
                    : 'Most popular and relevant articles from our repository'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArticles.map((article, index) => (
                  <div key={article.id || index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">📋</span>
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        <StarIcon className="w-3 h-3 mr-1" />
                        {lang === 'es' ? 'Destacado' : 'Featured'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {article.module || 'Legal'}
                      </span>
                      <a 
                        href={article.url || `/${lang}/clkr/${article.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        {lang === 'es' ? 'Leer más' : 'Read more'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <a
              href={`/${lang}/clkr`}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {content.exploreButton}
            </a>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomePageCLKR; 