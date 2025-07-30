import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, BookOpenIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Topic {
  id: string;
  title: string;
  description: string;
  readingTime: number;
  module: string;
  url?: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    primary: string;
    secondary: string;
    accent: string;
    hover: string;
    border: string;
  };
  topics: Topic[];
}

interface CLKRModuleExplorerProps {
  topics?: Topic[];
  modules?: Module[];
  lang?: string;
}

// Legal branch color mapping for consistent module colors
const legalBranchColors = {
  // Constitutional Law
  'Derecho Constitucional': { primary: 'bg-blue-500', secondary: 'bg-blue-50', accent: 'text-blue-700', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
  'Constitutional Law': { primary: 'bg-blue-500', secondary: 'bg-blue-50', accent: 'text-blue-700', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
  
  // Administrative Law
  'Derecho Administrativo': { primary: 'bg-green-500', secondary: 'bg-green-50', accent: 'text-green-700', hover: 'hover:bg-green-100', border: 'border-green-200' },
  'Administrative Law': { primary: 'bg-green-500', secondary: 'bg-green-50', accent: 'text-green-700', hover: 'hover:bg-green-100', border: 'border-green-200' },
  
  // Civil Law
  'Derecho Civil': { primary: 'bg-purple-500', secondary: 'bg-purple-50', accent: 'text-purple-700', hover: 'hover:bg-purple-100', border: 'border-purple-200' },
  'Civil Law': { primary: 'bg-purple-500', secondary: 'bg-purple-50', accent: 'text-purple-700', hover: 'hover:bg-purple-100', border: 'border-purple-200' },
  
  // Commercial Law
  'Derecho Comercial': { primary: 'bg-orange-500', secondary: 'bg-orange-50', accent: 'text-orange-700', hover: 'hover:bg-orange-100', border: 'border-orange-200' },
  'Commercial Law': { primary: 'bg-orange-500', secondary: 'bg-orange-50', accent: 'text-orange-700', hover: 'hover:bg-orange-100', border: 'border-orange-200' },
  
  // Labor Law
  'Derecho Laboral': { primary: 'bg-red-500', secondary: 'bg-red-50', accent: 'text-red-700', hover: 'hover:bg-red-100', border: 'border-red-200' },
  'Labor Law': { primary: 'bg-red-500', secondary: 'bg-red-50', accent: 'text-red-700', hover: 'hover:bg-red-100', border: 'border-red-200' },
  
  // Criminal Law
  'Derecho Penal': { primary: 'bg-gray-800', secondary: 'bg-gray-50', accent: 'text-gray-700', hover: 'hover:bg-gray-100', border: 'border-gray-200' },
  'Criminal Law': { primary: 'bg-gray-800', secondary: 'bg-gray-50', accent: 'text-gray-700', hover: 'hover:bg-gray-100', border: 'border-gray-200' },
  
  // Immigration Law
  'Derecho Migratorio': { primary: 'bg-teal-500', secondary: 'bg-teal-50', accent: 'text-teal-700', hover: 'hover:bg-teal-100', border: 'border-teal-200' },
  'Immigration Law': { primary: 'bg-teal-500', secondary: 'bg-teal-50', accent: 'text-teal-700', hover: 'hover:bg-teal-100', border: 'border-teal-200' },
  
  // Real Estate Law
  'Derecho Inmobiliario': { primary: 'bg-amber-500', secondary: 'bg-amber-50', accent: 'text-amber-700', hover: 'hover:bg-amber-100', border: 'border-amber-200' },
  'Real Estate Law': { primary: 'bg-amber-500', secondary: 'bg-amber-50', accent: 'text-amber-700', hover: 'hover:bg-amber-100', border: 'border-amber-200' },
  
  // Tax Law
  'Derecho Tributario': { primary: 'bg-indigo-500', secondary: 'bg-indigo-50', accent: 'text-indigo-700', hover: 'hover:bg-indigo-100', border: 'border-indigo-200' },
  'Tax Law': { primary: 'bg-indigo-500', secondary: 'bg-indigo-50', accent: 'text-indigo-700', hover: 'hover:bg-indigo-100', border: 'border-indigo-200' },
  
  // Family Law
  'Derecho de Familia': { primary: 'bg-pink-500', secondary: 'bg-pink-50', accent: 'text-pink-700', hover: 'hover:bg-pink-100', border: 'border-pink-200' },
  'Family Law': { primary: 'bg-pink-500', secondary: 'bg-pink-50', accent: 'text-pink-700', hover: 'hover:bg-pink-100', border: 'border-pink-200' },
  
  // International Law
  'Derecho Internacional': { primary: 'bg-cyan-500', secondary: 'bg-cyan-50', accent: 'text-cyan-700', hover: 'hover:bg-cyan-100', border: 'border-cyan-200' },
  'International Law': { primary: 'bg-cyan-500', secondary: 'bg-cyan-50', accent: 'text-cyan-700', hover: 'hover:bg-cyan-100', border: 'border-cyan-200' },
  
  // Default for unknown modules
  'default': { primary: 'bg-slate-500', secondary: 'bg-slate-50', accent: 'text-slate-700', hover: 'hover:bg-slate-100', border: 'border-slate-200' }
};

const CLKRModuleExplorer: React.FC<CLKRModuleExplorerProps> = ({ topics = [], modules = [], lang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Get module color based on legal branch
  const getModuleColor = (moduleName: string) => {
    return legalBranchColors[moduleName as keyof typeof legalBranchColors] || legalBranchColors.default;
  };

  // Filter topics based on search query and selected module
  const filteredTopics = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    
    let filtered = topics;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.module.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected module
    if (selectedModule) {
      filtered = filtered.filter(topic => topic.module === selectedModule);
    }
    
    return filtered;
  }, [topics, searchQuery, selectedModule]);

  // Get unique modules from topics with their counts
  const availableModules = useMemo(() => {
    const moduleNames = [...new Set(topics.map(topic => topic.module))];
    
    return moduleNames.map(name => {
      const moduleTopics = topics.filter(topic => topic.module === name);
      const filteredModuleTopics = filteredTopics.filter(topic => topic.module === name);
      
      return {
        id: name,
        name,
        description: '',
        icon: BookOpenIcon,
        color: getModuleColor(name),
        topics: moduleTopics,
        totalCount: moduleTopics.length,
        filteredCount: filteredModuleTopics.length,
        hasResults: filteredModuleTopics.length > 0
      };
    }).sort((a, b) => b.totalCount - a.totalCount); // Sort by total count
  }, [topics, filteredTopics]);

  // Group filtered topics by module
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: Topic[] } = {};
    
    filteredTopics.forEach(topic => {
      if (!groups[topic.module]) {
        groups[topic.module] = [];
      }
      groups[topic.module].push(topic);
    });
    
    return Object.entries(groups).map(([moduleName, topics]) => ({
      moduleName,
      topics,
      color: getModuleColor(moduleName)
    })).sort((a, b) => b.topics.length - a.topics.length); // Sort by result count
  }, [filteredTopics]);

  // Text content based on language
  const textContent = {
    en: {
      searchPlaceholder: 'Search legal topics, modules, or descriptions...',
      allModules: 'All Modules',
      noResults: 'No topics found',
      topicsFound: 'topics found',
      readingTime: 'min read',
      clearFilters: 'Clear filters',
      filterByModule: 'Filter by module',
      resultsFor: 'Results for',
      showing: 'Showing',
      of: 'of',
      totalTopics: 'total topics'
    },
    es: {
      searchPlaceholder: 'Buscar temas legales, módulos o descripciones...',
      allModules: 'Todos los Módulos',
      noResults: 'No se encontraron temas',
      topicsFound: 'temas encontrados',
      readingTime: 'min de lectura',
      clearFilters: 'Limpiar filtros',
      filterByModule: 'Filtrar por módulo',
      resultsFor: 'Resultados para',
      showing: 'Mostrando',
      of: 'de',
      totalTopics: 'temas totales'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedModule(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {lang === 'es' ? 'Explorador de Módulos CLKR' : 'CLKR Module Explorer'}
        </h2>
        <p className="text-gray-600 max-w-4xl mx-auto">
          {lang === 'es' 
            ? 'Explora nuestros módulos de conocimiento legal y encuentra la información que necesitas.'
            : 'Explore our legal knowledge modules and find the information you need.'
          }
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Module Filter Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {content.filterByModule}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {/* All Modules Button */}
            <button
              onClick={() => setSelectedModule(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 mr-2 mb-2 ${
                selectedModule === null
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {content.allModules} ({topics.length})
            </button>

            {/* Module Buttons */}
            {availableModules.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 mr-2 mb-2 ${
                  selectedModule === module.name
                    ? `${module.color.primary} text-white shadow-lg`
                    : module.hasResults
                    ? `${module.color.secondary} ${module.color.accent} hover:${module.color.primary} hover:text-white`
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                disabled={!module.hasResults}
                title={module.hasResults ? `${module.filteredCount} ${content.topicsFound}` : 'No results'}
              >
                {module.name} ({module.filteredCount})
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters and Results Count */}
        {(searchQuery || selectedModule) && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="text-sm text-gray-600">
              {content.showing} <span className="font-semibold">{filteredTopics.length}</span> {content.of} <span className="font-semibold">{topics.length}</span> {content.totalTopics}
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              {content.clearFilters}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-8">
          {/* Grouped Results by Module */}
          {groupedResults.map((group) => (
            <div key={group.moduleName} className="space-y-4">
              {/* Module Header */}
              <div className={`flex items-center justify-between p-4 rounded-lg ${group.color.secondary} ${group.color.border} border`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${group.color.primary} text-white`}>
                    <BookOpenIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${group.color.accent}`}>
                      {group.moduleName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {group.topics.length} {content.topicsFound}
                    </p>
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${group.color.hover}`}
                  >
                    <div className={`p-4 ${group.color.primary}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${group.color.secondary} ${group.color.accent}`}>
                          {topic.module}
                        </span>
                        <div className="flex items-center text-xs text-white">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {topic.readingTime} {content.readingTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {topic.description}
                      </p>
                      
                      {topic.url && (
                        <a
                          href={topic.url}
                          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${group.color.secondary} ${group.color.accent} hover:${group.color.primary} hover:text-white transition-colors`}
                        >
                          {lang === 'es' ? 'Leer más' : 'Read more'}
                          <BookOpenIcon className="ml-2 h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {content.noResults}
          </h3>
          <p className="text-gray-600">
            {lang === 'es' 
              ? 'Intenta ajustar tus filtros de búsqueda o selecciona un módulo diferente.'
              : 'Try adjusting your search filters or select a different module.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CLKRModuleExplorer; 