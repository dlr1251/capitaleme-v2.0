import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  DocumentTextIcon,
  ScaleIcon,
  LightBulbIcon,
  SparklesIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

interface HomePageCLKRProps {
  lang?: 'en' | 'es';
  clkrServices?: any[];
}

// Beautiful, readable colors for each legal module
const moduleColors = {
  'Constitutional Law': { 
    primary: 'bg-blue-500', 
    secondary: 'bg-blue-50', 
    accent: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-50'
  },
  'Administrative Law': { 
    primary: 'bg-emerald-500', 
    secondary: 'bg-emerald-50', 
    accent: 'text-emerald-700',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-50'
  },
  'Civil Law': { 
    primary: 'bg-purple-500', 
    secondary: 'bg-purple-50', 
    accent: 'text-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-50'
  },
  'Criminal Law': { 
    primary: 'bg-red-500', 
    secondary: 'bg-red-50', 
    accent: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-50'
  },
  'Family Law': { 
    primary: 'bg-pink-500', 
    secondary: 'bg-pink-50', 
    accent: 'text-pink-700',
    border: 'border-pink-200',
    hover: 'hover:bg-pink-50'
  },
  'Labour Law': { 
    primary: 'bg-orange-500', 
    secondary: 'bg-orange-50', 
    accent: 'text-orange-700',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-50'
  },
  'Business Law': { 
    primary: 'bg-indigo-500', 
    secondary: 'bg-indigo-50', 
    accent: 'text-indigo-700',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-50'
  },
  'Tax Law': { 
    primary: 'bg-amber-500', 
    secondary: 'bg-amber-50', 
    accent: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-50'
  },
  'Financial Law': { 
    primary: 'bg-teal-500', 
    secondary: 'bg-teal-50', 
    accent: 'text-teal-700',
    border: 'border-teal-200',
    hover: 'hover:bg-teal-50'
  },
  'Real Estate & Urbanism': { 
    primary: 'bg-lime-500', 
    secondary: 'bg-lime-50', 
    accent: 'text-lime-700',
    border: 'border-lime-200',
    hover: 'hover:bg-lime-50'
  },
  'Consumer Law': { 
    primary: 'bg-cyan-500', 
    secondary: 'bg-cyan-50', 
    accent: 'text-cyan-700',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-50'
  },
  'Intellectual Property Law': { 
    primary: 'bg-violet-500', 
    secondary: 'bg-violet-50', 
    accent: 'text-violet-700',
    border: 'border-violet-200',
    hover: 'hover:bg-violet-50'
  },
  'International Public Law': { 
    primary: 'bg-sky-500', 
    secondary: 'bg-sky-50', 
    accent: 'text-sky-700',
    border: 'border-sky-200',
    hover: 'hover:bg-sky-50'
  },
  'Exchange Law': { 
    primary: 'bg-rose-500', 
    secondary: 'bg-rose-50', 
    accent: 'text-rose-700',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-50'
  },
  'Police Law': { 
    primary: 'bg-slate-500', 
    secondary: 'bg-slate-50', 
    accent: 'text-slate-700',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-50'
  },
  'Private International Law': { 
    primary: 'bg-fuchsia-500', 
    secondary: 'bg-fuchsia-50', 
    accent: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    hover: 'hover:bg-fuchsia-50'
  },
  'General Legal Theory': { 
    primary: 'bg-gray-500', 
    secondary: 'bg-gray-50', 
    accent: 'text-gray-700',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50'
  }
};

const HomePageCLKR: React.FC<HomePageCLKRProps> = ({ lang = 'en', clkrServices = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Calculate global stats
  const globalStats = useMemo(() => {
    const totalArticles = clkrServices.length;
    const totalReadingTime = clkrServices.reduce((sum, service) => sum + (service.readingTime || 0), 0);
    const uniqueModules = new Set(clkrServices.map(service => service.module)).size;
    
    return { totalArticles, totalReadingTime, uniqueModules };
  }, [clkrServices]);

  // Filter articles based on search and module selection
  const filteredArticles = useMemo(() => {
    return clkrServices.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.module.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModule = selectedModule === '' || service.module === selectedModule;
      
      return matchesSearch && matchesModule;
    });
  }, [clkrServices, searchQuery, selectedModule]);

  // Group articles by module
  const articlesByModule = useMemo(() => {
    const grouped = filteredArticles.reduce((acc, article) => {
      const module = article.module || 'General';
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(article);
      return acc;
    }, {} as Record<string, typeof clkrServices>);
    
    return grouped;
  }, [filteredArticles]);

  // Get module color
  const getModuleColor = useCallback((moduleName: string) => {
    return moduleColors[moduleName as keyof typeof moduleColors] || moduleColors['General Legal Theory'];
  }, []);

  // Handle module selection
  const handleModuleSelect = useCallback((moduleName: string) => {
    if (selectedModule === moduleName) {
      setSelectedModule('');
      // Clear expanded modules when deselecting
      setExpandedModules(new Set());
    } else {
      setSelectedModule(moduleName);
      // Auto-expand the selected module
      setExpandedModules(new Set([moduleName]));
    }
  }, [selectedModule]);

  // Toggle module expansion
  const toggleModule = useCallback((moduleName: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleName)) {
        newSet.delete(moduleName);
      } else {
        newSet.add(moduleName);
      }
      return newSet;
    });
  }, []);

  // Get unique modules for sidebar
  const uniqueModules = useMemo(() => {
    const modules = new Set(clkrServices.map(service => service.module));
    return Array.from(modules).sort();
  }, [clkrServices]);

  // Auto-expand selected module
  React.useEffect(() => {
    if (selectedModule) {
      setExpandedModules(new Set([selectedModule]));
    }
  }, [selectedModule]);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <SparklesIcon className="w-4 h-4" />
            {lang === 'en' ? 'AI-Generated & Attorney-Reviewed' : 'Generado por IA y Revisado por Abogados'}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {lang === 'en' ? 'Colombian Legal Repository' : 'Repositorio Legal Colombiano'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Comprehensive legal knowledge base with AI-generated content reviewed by experienced attorneys'
              : 'Base de conocimiento legal integral con contenido generado por IA revisado por abogados experimentados'
            }
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              <DocumentTextIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{globalStats.totalArticles}</div>
            <div className="text-sm text-gray-600">Total Articles</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
              <ScaleIcon className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{globalStats.uniqueModules}</div>
            <div className="text-sm text-gray-600">Legal Modules</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              <ClockIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{globalStats.totalReadingTime}h</div>
            <div className="text-sm text-gray-600">Total Reading Time</div>
          </div>
        </div>

        {/* Main Explorer */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {lang === 'en' ? 'Explore Repository' : 'Explorar Repositorio'}
                </h3>
                <p className="text-white">
                  {lang === 'en' 
                    ? 'Search, filter, and explore legal articles by module'
                    : 'Busca, filtra y explora artículos legales por módulo'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <div className="w-full lg:w-80 border-r border-gray-200 bg-gray-50">
              <div className="p-6">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Search articles...' : 'Buscar artículos...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Module Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {lang === 'en' ? 'Legal Modules' : 'Módulos Legales'}
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleModuleSelect('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedModule === '' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang === 'en' ? 'All Modules' : 'Todos los Módulos'}
                    </button>
                    {uniqueModules.map(moduleName => {
                      const moduleColor = getModuleColor(moduleName);
                      const isSelected = selectedModule === moduleName;
                      return (
                        <button
                          key={moduleName}
                          onClick={() => handleModuleSelect(moduleName)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                            isSelected 
                              ? `${moduleColor.primary} text-white` 
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${moduleColor.primary}`} />
                          {moduleName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  {lang === 'en' ? 'Showing' : 'Mostrando'} {filteredArticles.length} {lang === 'en' ? 'articles' : 'artículos'}
                  {selectedModule && (
                    <span> {lang === 'en' ? 'in' : 'en'} <span className="font-medium">{selectedModule}</span></span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {lang === 'en' ? 'No articles found' : 'No se encontraron artículos'}
                  </h3>
                  <p className="text-gray-600">
                    {lang === 'en' 
                      ? 'Try adjusting your search or module filter'
                      : 'Intenta ajustar tu búsqueda o filtro de módulo'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Articles by Module */}
                  {Object.keys(articlesByModule).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(articlesByModule).map(([moduleName, articles]) => {
                        const moduleColor = getModuleColor(moduleName);
                        const isExpanded = expandedModules.has(moduleName);
                        const isSelected = selectedModule === moduleName;
                        const typedArticles = articles as typeof clkrServices;
                        
                        return (
                          <div key={moduleName} className={`border ${moduleColor.border} rounded-xl overflow-hidden`}>
                            {/* Module Header */}
                            <button
                              onClick={() => toggleModule(moduleName)}
                              className={`w-full p-4 text-left ${moduleColor.hover} transition-all duration-200 flex items-center justify-between`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${moduleColor.primary}`} />
                                <h4 className="font-semibold text-gray-900">{moduleName}</h4>
                                <span className="text-sm text-gray-500">({typedArticles.length})</span>
                              </div>
                              {isExpanded ? (
                                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                            
                            {/* Module Content */}
                            {isExpanded && (
                              <div className="border-t border-gray-100 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                  {typedArticles.map((article: any) => (
                                    <a
                                      key={article.id}
                                      href={`/${lang}/clkr/${article.slug}`}
                                      className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md block"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${moduleColor.primary}`} />
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                          </h5>
                                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {article.description}
                                          </p>
                                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                              <ClockIcon className="w-3 h-3" />
                                              {article.readingTime || 0} min
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <DocumentTextIcon className="w-3 h-3" />
                                              {article.module}
                                            </span>
                                          </div>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {lang === 'en' ? 'No articles match your current filters' : 'Ningún artículo coincide con tus filtros actuales'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageCLKR; 