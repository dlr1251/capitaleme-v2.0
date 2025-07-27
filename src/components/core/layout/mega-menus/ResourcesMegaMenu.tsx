
import React from 'react';

interface ResourcesMegaMenuProps {
  lang?: string;
  currentPath?: string;
  clkrData?: any;
  loading?: boolean;
  error?: string;
}

const ResourcesMegaMenu: React.FC<ResourcesMegaMenuProps> = ({
  clkrData,
  loading,
  lang = 'en',
  currentPath,
}) => {
  const [selectedCLKRModule, setSelectedCLKRModule] = React.useState<string>('All');
  const [clkrSortOrder, setClkrSortOrder] = React.useState<string>('desc');

  // Filter and sort CLKR articles based on selected module and only show categories with content
  const filteredCLKRArticles = React.useMemo(() => {
    let articles = [];
    if (selectedCLKRModule === 'All') {
      articles = clkrData?.allCLKRServices || [];
    } else {
      articles = clkrData?.allCLKRServices?.filter((article: any) => 
        article.module === selectedCLKRModule
      ) || [];
    }
    
    // Sort articles based on sort order
    return articles.sort((a: any, b: any) => {
      const dateA = new Date(a.lastUpdated || a.date || a.lastEdited || '2024-01-01');
      const dateB = new Date(b.lastUpdated || b.date || b.lastEdited || '2024-01-01');
      return clkrSortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [clkrData?.allCLKRServices, selectedCLKRModule, clkrSortOrder]);

  // Filter out empty categories
  const nonEmptyModules = React.useMemo(() => {
    return clkrData?.modules || [];
  }, [clkrData?.modules]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (clkrData?.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{clkrData.error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: CLKR Categories */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              {lang === 'en' ? 'CLKR Categories' : 'Categorías CLKR'}
            </h3>
            <a 
              href={lang === 'en' ? '/en/resources' : '/es/resources'} 
              className="text-xs text-secondary hover:text-primary transition-colors duration-200 underline"
            >
              {lang === 'en' ? 'View All Resources' : 'Ver Todos los Recursos'}
            </a>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="space-y-2 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* All Categories Button */}
              <button 
                onClick={() => setSelectedCLKRModule('All')}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                  selectedCLKRModule === 'All' 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-white border-gray-200 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedCLKRModule === 'All' 
                        ? 'bg-primary' 
                        : 'bg-gray-100 group-hover:bg-primary/10'
                    }`}>
                      <span className={`text-sm ${
                        selectedCLKRModule === 'All' ? 'text-white' : 'text-gray-600 group-hover:text-primary'
                      }`}>📚</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {lang === 'en' ? 'All Categories' : 'Todas las Categorías'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {lang === 'en' ? 'Browse all CLKR content' : 'Explorar todo el contenido CLKR'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {nonEmptyModules.length}
                  </span>
                </div>
              </button>
              
              {/* Individual Category Buttons - Only show non-empty categories */}
              {nonEmptyModules.slice(0, 4).map((module: string) => (
                <button 
                  key={module}
                  onClick={() => setSelectedCLKRModule(module)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                    selectedCLKRModule === module 
                      ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                      : 'bg-white border-gray-200 hover:border-secondary/30 hover:bg-secondary/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedCLKRModule === module 
                          ? 'bg-secondary' 
                          : 'bg-gray-100 group-hover:bg-secondary/10'
                      }`}>
                        <span className={`text-sm ${
                          selectedCLKRModule === module ? 'text-white' : 'text-gray-600 group-hover:text-secondary'
                        }`}>📋</span>
                      </div>
                      <span className="text-sm font-medium">{module}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {clkrData?.allCLKRServices?.filter((article: any) => article.module === module).length}
                    </span>
                  </div>
                </button>
              ))}
              
              {/* Show More Categories if available */}
              {nonEmptyModules.length > 5 && (
                <button className="w-full text-center p-2 text-sm text-secondary hover:text-primary hover:bg-secondary/5 rounded-lg transition-colors">
                  {lang === 'en' ? `+${nonEmptyModules.length - 5} more categories` : `+${nonEmptyModules.length - 5} categorías más`}
                </button>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <a 
                href={lang === 'en' ? '/en/clkr' : '/es/clkr'} 
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-sm font-medium transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                {lang === 'en' ? 'Visit Full CLKR Repository' : 'Visitar Repositorio CLKR Completo'}
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: CLKR Entries */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              {lang === 'en' ? 'CLKR Articles' : 'Artículos CLKR'}
            </h3>
            <span className="text-xs text-gray-500">
              <div>
                {lang === 'en' ? 'CLKR stands for' : 'CLKR significa'}
              </div>
              <div className="italic underline">
                {lang === 'en' ? 'Colombian Legal Knowledge Repository' : 'Repositorio de Conocimiento Legal Colombiano'}
              </div>
            </span>
          </div>
          
          <div className="flex-1 flex flex-col">
            {/* Filter Controls - Single toggle button with animated arrow */}
            <div className="mb-4 flex items-center gap-2">
              <button 
                onClick={() => setClkrSortOrder(clkrSortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1 bg-primary text-white hover:bg-primary/90"
              >
                <svg className={`w-3 h-3 transition-transform duration-200 ${clkrSortOrder === 'desc' ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
                {clkrSortOrder === 'desc' ? (lang === 'en' ? 'Latest first' : 'Recientes primero') : (lang === 'en' ? 'Oldest first' : 'Antiguos primero')}
              </button>
              
              <span className="text-xs text-gray-500">
                {filteredCLKRArticles.length} {lang === 'en' ? 'articles' : 'artículos'}
              </span>
            </div>

            {/* Scrollable CLKR Articles */}
            <div className="space-y-2 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredCLKRArticles.length > 0 ? (
                filteredCLKRArticles.map((article: any, index: number) => (
                  <a
                    key={article.id || article.url || index}
                    href={article.url}
                    className={`block group p-3 rounded-lg border transition-all duration-200 hover:shadow-md
                      ${currentPath && currentPath.startsWith(article.url) ? 'bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg' : 'hover:bg-primary/5 hover:border-primary/30 bg-white'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">📄</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary text-sm line-clamp-2 transition-colors duration-200">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {article.readingTime || 5} {lang === 'en' ? 'min read' : 'min lectura'}
                          </span>
                          {article.module && (
                            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                              {article.module}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                  {lang === 'en' ? 'No CLKR articles available.' : 'No hay artículos CLKR disponibles.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Quick Actions */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
            </svg>
            {lang === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}
          </h3>
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🔍</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">
                    {lang === 'en' ? 'Search CLKR' : 'Buscar en CLKR'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'en' ? 'Find specific legal information and procedures.' : 'Encuentra información legal específica y procedimientos.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📋</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">
                    {lang === 'en' ? 'Latest Updates' : 'Últimas Actualizaciones'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'en' ? 'Stay updated with the latest legal changes and procedures.' : 'Mantente actualizado con los últimos cambios legales y procedimientos.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">⚖️</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">
                    {lang === 'en' ? 'Legal Expertise' : 'Experiencia Legal'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'en' ? 'Access comprehensive legal knowledge and expert guidance.' : 'Accede a conocimiento legal integral y orientación experta.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <a href={lang === 'en' ? '/en/contact' : '/es/contact'} className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-sm font-medium transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {lang === 'en' ? 'Get Legal Consultation' : 'Obtener Consulta Legal'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesMegaMenu; 