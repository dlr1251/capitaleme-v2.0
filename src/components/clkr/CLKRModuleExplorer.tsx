import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

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
  };
  topics: Topic[];
}

interface CLKRModuleExplorerProps {
  topics?: Topic[];
  modules?: Module[];
  lang?: string;
}

// Expanded color palette for modules
const expandedModuleColors = [
  { primary: 'bg-indigo-300', secondary: 'bg-indigo-50', accent: 'text-indigo-700', hover: 'hover:bg-indigo-200' },
  { primary: 'bg-emerald-300', secondary: 'bg-emerald-50', accent: 'text-emerald-700', hover: 'hover:bg-emerald-200' },
  { primary: 'bg-purple-300', secondary: 'bg-purple-50', accent: 'text-purple-700', hover: 'hover:bg-purple-200' },
  { primary: 'bg-rose-300', secondary: 'bg-rose-50', accent: 'text-rose-700', hover: 'hover:bg-rose-200' },
  { primary: 'bg-cyan-300', secondary: 'bg-cyan-50', accent: 'text-cyan-700', hover: 'hover:bg-cyan-200' },
  { primary: 'bg-amber-300', secondary: 'bg-amber-50', accent: 'text-amber-700', hover: 'hover:bg-amber-200' },
  { primary: 'bg-lime-300', secondary: 'bg-lime-50', accent: 'text-lime-700', hover: 'hover:bg-lime-200' },
  { primary: 'bg-violet-300', secondary: 'bg-violet-50', accent: 'text-violet-700', hover: 'hover:bg-violet-200' },
  { primary: 'bg-sky-300', secondary: 'bg-sky-50', accent: 'text-sky-700', hover: 'hover:bg-sky-200' },
  { primary: 'bg-orange-300', secondary: 'bg-orange-50', accent: 'text-orange-700', hover: 'hover:bg-orange-200' },
  { primary: 'bg-teal-300', secondary: 'bg-teal-50', accent: 'text-teal-700', hover: 'hover:bg-teal-200' },
  { primary: 'bg-pink-300', secondary: 'bg-pink-50', accent: 'text-pink-700', hover: 'hover:bg-pink-200' },
  { primary: 'bg-blue-300', secondary: 'bg-blue-50', accent: 'text-blue-700', hover: 'hover:bg-blue-200' },
  { primary: 'bg-green-300', secondary: 'bg-green-50', accent: 'text-green-700', hover: 'hover:bg-green-200' },
  { primary: 'bg-red-300', secondary: 'bg-red-50', accent: 'text-red-700', hover: 'hover:bg-red-200' },
  { primary: 'bg-yellow-300', secondary: 'bg-yellow-50', accent: 'text-yellow-700', hover: 'hover:bg-yellow-200' },
  { primary: 'bg-slate-300', secondary: 'bg-slate-50', accent: 'text-slate-700', hover: 'hover:bg-slate-200' },
  { primary: 'bg-zinc-300', secondary: 'bg-zinc-50', accent: 'text-zinc-700', hover: 'hover:bg-zinc-200' },
  { primary: 'bg-stone-300', secondary: 'bg-stone-50', accent: 'text-stone-700', hover: 'hover:bg-stone-200' },
  { primary: 'bg-neutral-300', secondary: 'bg-neutral-50', accent: 'text-neutral-700', hover: 'hover:bg-neutral-200' },
  { primary: 'bg-fuchsia-300', secondary: 'bg-fuchsia-50', accent: 'text-fuchsia-700', hover: 'hover:bg-fuchsia-200' },
  { primary: 'bg-amber-200', secondary: 'bg-amber-100', accent: 'text-amber-800', hover: 'hover:bg-amber-300' },
  { primary: 'bg-emerald-200', secondary: 'bg-emerald-100', accent: 'text-emerald-800', hover: 'hover:bg-emerald-300' },
  { primary: 'bg-blue-200', secondary: 'bg-blue-100', accent: 'text-blue-800', hover: 'hover:bg-blue-300' },
  { primary: 'bg-pink-200', secondary: 'bg-pink-100', accent: 'text-pink-800', hover: 'hover:bg-pink-300' },
  { primary: 'bg-lime-200', secondary: 'bg-lime-100', accent: 'text-lime-800', hover: 'hover:bg-lime-300' },
  { primary: 'bg-cyan-200', secondary: 'bg-cyan-100', accent: 'text-cyan-800', hover: 'hover:bg-cyan-300' },
  { primary: 'bg-orange-200', secondary: 'bg-orange-100', accent: 'text-orange-800', hover: 'hover:bg-orange-300' },
  { primary: 'bg-purple-200', secondary: 'bg-purple-100', accent: 'text-purple-800', hover: 'hover:bg-purple-300' },
  { primary: 'bg-teal-200', secondary: 'bg-teal-100', accent: 'text-teal-800', hover: 'hover:bg-teal-300' },
  { primary: 'bg-fuchsia-200', secondary: 'bg-fuchsia-100', accent: 'text-fuchsia-800', hover: 'hover:bg-fuchsia-300' },
  { primary: 'bg-rose-200', secondary: 'bg-rose-100', accent: 'text-rose-800', hover: 'hover:bg-rose-300' },
  { primary: 'bg-yellow-200', secondary: 'bg-yellow-100', accent: 'text-yellow-800', hover: 'hover:bg-yellow-300' },
  { primary: 'bg-slate-200', secondary: 'bg-slate-100', accent: 'text-slate-800', hover: 'hover:bg-slate-300' },
  { primary: 'bg-zinc-200', secondary: 'bg-zinc-100', accent: 'text-zinc-800', hover: 'hover:bg-zinc-300' },
  { primary: 'bg-stone-200', secondary: 'bg-stone-100', accent: 'text-stone-800', hover: 'hover:bg-stone-300' },
  { primary: 'bg-neutral-200', secondary: 'bg-neutral-100', accent: 'text-neutral-800', hover: 'hover:bg-neutral-300' },
];

const CLKRModuleExplorer: React.FC<CLKRModuleExplorerProps> = ({ topics = [], modules = [], lang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Assign a fixed color to each module by name (deterministic)
  const getModuleColor = (moduleName: string) => {
    // Create a simple hash of the module name to get consistent colors
    const hash = moduleName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % expandedModuleColors.length;
    return expandedModuleColors[index];
  };

  // Filter topics based on search query and selected module
  const filteredTopics = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    let filtered = topics;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.module.toLowerCase().includes(query)
      );
    }
    if (selectedModule) {
      filtered = filtered.filter(topic => topic.module === selectedModule);
    }
    return filtered;
  }, [topics, searchQuery, selectedModule]);

  // Get unique modules from topics
  const availableModules = useMemo(() => {
    const moduleNames = [...new Set(topics.map(topic => topic.module))];
    return moduleNames.map(name => ({
      id: name,
      name,
      description: '',
      icon: BookOpenIcon,
      color: getModuleColor(name),
      topics: topics.filter(topic => topic.module === name)
    }));
  }, [topics]);

  // Text content based on language
  const textContent = {
    en: {
      searchPlaceholder: 'Search topics...',
      allModules: 'All Modules',
      noResults: 'No topics found',
      topicsFound: 'topics found',
      readingTime: 'min read'
    },
    es: {
      searchPlaceholder: 'Buscar temas...',
      allModules: 'Todos los Módulos',
      noResults: 'No se encontraron temas',
      topicsFound: 'temas encontrados',
      readingTime: 'min de lectura'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

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
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Module Filter */}
          <div className="sm:w-64">
            <select
              value={selectedModule || ''}
              onChange={(e) => setSelectedModule(e.target.value || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{content.allModules}</option>
              {availableModules.map((module) => (
                <option key={module.id} value={module.name}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        {filteredTopics.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {filteredTopics.length} {content.topicsFound}
          </div>
        )}
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const moduleColor = getModuleColor(topic.module);
            
            return (
              <div
                key={topic.id}
                className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${moduleColor.hover}`}
              >
                <div className={`p-4 ${moduleColor.primary}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${moduleColor.secondary} ${moduleColor.accent}`}>
                      {topic.module}
                    </span>
                    <div className="flex items-center text-xs text-gray-600">
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
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${moduleColor.secondary} ${moduleColor.accent} hover:${moduleColor.primary} transition-colors`}
                    >
                      {lang === 'es' ? 'Leer más' : 'Read more'}
                      <BookOpenIcon className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {content.noResults}
          </h3>
          <p className="text-gray-600">
            {lang === 'es' 
              ? 'Intenta ajustar tus filtros de búsqueda.'
              : 'Try adjusting your search filters.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CLKRModuleExplorer; 