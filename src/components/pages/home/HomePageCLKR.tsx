import { useState, useEffect } from 'react';

// Type definitions
interface CLKRItem {
  title: string;
  slug: string;
  description: string;
  module: string;
  icon: { type: string; emoji: string };
  views: number;
}

interface HomePageCLKRProps {
  lang?: 'en' | 'es';
}

const HomePageCLKR = ({ lang = 'es' }: HomePageCLKRProps) => {
  const [clkrData, setClkrData] = useState<CLKRItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Define content based on language
  const content = lang === 'es' ? {
    badge: "⚖️ Repositorio de Conocimiento Legal Colombiano",
    title: "El Repositorio Legal Más Grande",
    subtitle: "sobre Derecho Colombiano en Español",
    description: "Accede a recursos legales colombianos integrales, traducciones y conocimientos expertos. Navega el complejo panorama legal de Colombia con confianza a través de nuestra extensa base de datos.",
    stats: [
      { number: "2,500+", label: "Documentos Legales", icon: "📚" },
      { number: "8", label: "Categorías Legales", icon: "📂" },
      { number: "50K+", label: "Usuarios Mensuales", icon: "👥" },
      { number: "24/7", label: "Acceso", icon: "🌐" }
    ],
    categories: [
      { name: "Derecho de Inmigración", count: 150, icon: "🛂", color: "from-blue-500 to-cyan-500" },
      { name: "Derecho Civil", count: 89, icon: "⚖️", color: "from-green-500 to-emerald-500" },
      { name: "Derecho Comercial", count: 67, icon: "💼", color: "from-purple-500 to-pink-500" },
      { name: "Derecho Laboral", count: 45, icon: "👷", color: "from-orange-500 to-red-500" }
    ],
    featuredResources: "Recursos Destacados",
    viewAllResources: "Ver Todos los Recursos",
    exploreCategory: "Explorar categoría",
    documentsAvailable: "documentos disponibles"
  } : {
    badge: "⚖️ Colombian Legal Knowledge Repository",
    title: "The Largest Legal Repository",
    subtitle: "on Colombian Law in Spanish",
    description: "Access comprehensive Colombian legal resources, translations, and expert knowledge. Navigate Colombia's complex legal landscape with confidence through our extensive database.",
    stats: [
      { number: "2,500+", label: "Legal Documents", icon: "📚" },
      { number: "8", label: "Legal Categories", icon: "📂" },
      { number: "50K+", label: "Monthly Users", icon: "👥" },
      { number: "24/7", label: "Access", icon: "🌐" }
    ],
    categories: [
      { name: "Immigration Law", count: 150, icon: "🛂", color: "from-blue-500 to-cyan-500" },
      { name: "Civil Law", count: 89, icon: "⚖️", color: "from-green-500 to-emerald-500" },
      { name: "Commercial Law", count: 67, icon: "💼", color: "from-purple-500 to-pink-500" },
      { name: "Labor Law", count: 45, icon: "👷", color: "from-orange-500 to-red-500" }
    ],
    featuredResources: "Featured Resources",
    viewAllResources: "View All Resources",
    exploreCategory: "Explore category",
    documentsAvailable: "documents available"
  };

  useEffect(() => {
    const fetchCLKRData = async () => {
      try {
        // This would be fetched from your API endpoint that gets Notion data
        // For now, using mock data that matches the Notion structure
        const mockData: CLKRItem[] = lang === 'es' ? [
          {
            title: "Principios Constitucionales en Colombia",
            slug: "principios-constitucionales-colombia",
            description: "Entendiendo los principios constitucionales fundamentales que rigen la ley y sociedad colombiana.",
            module: "Derecho Constitucional",
            icon: { type: "emoji", emoji: "📜" },
            views: 1247
          },
          {
            title: "Interpretación Legal en Colombia",
            slug: "interpretacion-legal-colombia", 
            description: "Cómo los tribunales colombianos interpretan y aplican textos legales y precedentes.",
            module: "Teoría Legal",
            icon: { type: "emoji", emoji: "⚖️" },
            views: 892
          },
          {
            title: "Salarios y Beneficios en Colombia",
            slug: "salarios-beneficios-colombia",
            description: "Guía integral sobre la ley laboral colombiana respecto a salarios, beneficios y derechos de los trabajadores.",
            module: "Derecho Laboral",
            icon: { type: "emoji", emoji: "💰" },
            views: 1567
          },
          {
            title: "Contrato Laboral en Colombia",
            slug: "contrato-laboral-colombia",
            description: "Elementos esenciales y requisitos para contratos laborales válidos en Colombia.",
            module: "Derecho Laboral",
            icon: { type: "emoji", emoji: "📋" },
            views: 734
          }
        ] : [
          {
            title: "Constitutional Principles in Colombia",
            slug: "constitutional-principles-colombia",
            description: "Understanding the fundamental constitutional principles that govern Colombian law and society.",
            module: "Constitutional Law",
            icon: { type: "emoji", emoji: "📜" },
            views: 1247
          },
          {
            title: "Legal Interpretation in Colombia",
            slug: "legal-interpretation-colombia", 
            description: "How Colombian courts interpret and apply legal texts and precedents.",
            module: "Legal Theory",
            icon: { type: "emoji", emoji: "⚖️" },
            views: 892
          },
          {
            title: "Salaries and Benefits in Colombia",
            slug: "salaries-benefits-colombia",
            description: "Comprehensive guide on Colombian labor law regarding salaries, benefits, and workers' rights.",
            module: "Labor Law",
            icon: { type: "emoji", emoji: "💰" },
            views: 1567
          },
          {
            title: "Labor Contract in Colombia",
            slug: "labor-contract-colombia",
            description: "Essential elements and requirements for valid labor contracts in Colombia.",
            module: "Labor Law",
            icon: { type: "emoji", emoji: "📋" },
            views: 734
          }
        ];
        
        setClkrData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CLKR data:', error);
        setLoading(false);
      }
    };

    fetchCLKRData();
  }, [lang]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="text-xl">⚖️</span>
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {content.subtitle}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {content.categories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.count} {content.documentsAvailable}
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                  {content.exploreCategory}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {content.featuredResources}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clkrData.map((item: CLKRItem, index: number) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    {item.icon?.type === 'emoji' && (
                      <span className="text-2xl">
                        {item.icon.emoji}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {item.views} {lang === 'es' ? 'vistas' : 'views'}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {item.module}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <a 
            href={`/${lang}/clkr`}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            {content.viewAllResources}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePageCLKR; 