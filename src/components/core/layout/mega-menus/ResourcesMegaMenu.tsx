import { useState, useMemo } from 'react';

interface ResourcesMegaMenuProps {
  lang?: string;
  menuData?: any;
  currentPath?: string;
}

const ResourcesMegaMenu: React.FC<ResourcesMegaMenuProps> = ({ lang, menuData = {}, currentPath }) => {
  const [selectedCLKRModule, setSelectedCLKRModule] = useState<string>('All');
  const [clkrSortOrder, setClkrSortOrder] = useState<string>('desc');

  const clkrModules = menuData.clkrModules || [];
  
  // DEBUG: Log the menuData to see what's being passed
  console.log('[DEBUG] ResourcesMegaMenu menuData:', menuData);
  console.log('[DEBUG] ResourcesMegaMenu clkrServices:', menuData.clkrServices);
  console.log('[DEBUG] ResourcesMegaMenu clkrModules:', menuData.clkrModules);

  // Filter and sort CLKR articles based on selected module and only show categories with content
  const filteredCLKRArticles = useMemo(() => {
    let articles = [];
    if (selectedCLKRModule === 'All') {
      articles = menuData.clkrServices || [];
    } else {
      articles = (menuData.clkrServices || []).filter((article: any) => 
        article.module === selectedCLKRModule
      );
    }
    
    // Sort articles based on sort order
    return articles.sort((a: any, b: any) => {
      const dateA = new Date(a.lastUpdated || a.date || '2024-01-01');
      const dateB = new Date(b.lastUpdated || b.date || '2024-01-01');
      return clkrSortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [menuData.clkrServices, selectedCLKRModule, clkrSortOrder]);

  // Filter out empty categories
  const nonEmptyModules = useMemo(() => {
    return clkrModules.filter((module: string) => {
      const moduleArticles = (menuData.clkrServices || []).filter((article: any) => 
        article.module === module
      );
      return moduleArticles.length > 0;
    });
  }, [clkrModules, menuData.clkrServices]);

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
                      {(menuData.clkrServices || []).filter((article: any) => article.module === module).length}
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
                    key={article.id || article.href || index}
                    href={article.href}
                    className={`block group p-3 rounded-lg border transition-all duration-200 hover:shadow-md
                      ${currentPath && currentPath.startsWith(article.href) ? 'bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg' : 'hover:bg-primary/5 hover:border-primary/30 bg-white'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm line-clamp-2 transition-colors duration-200 ${
                          currentPath && currentPath.startsWith(article.href) 
                            ? 'text-white' 
                            : 'text-gray-900 group-hover:text-secondary'
                        }`}>
                          {article.title || `Untitled Article (ID: ${article.id})`}
                        </h4>              
                        <div className={`flex items-center gap-3 mt-2 text-xs ${
                          currentPath && currentPath.startsWith(article.href) ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {article.readingTime || 5} {lang === 'en' ? 'min read' : 'min lectura'}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
                            </svg>
                            {article.lastUpdated || '2024-01-15'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            currentPath && currentPath.startsWith(article.href) 
                              ? 'bg-white/20 text-white' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {article.module || 'CLKR'}
                          </span>
                        </div>
                      </div>
                      {/* Arrow indicator for hover */}
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        currentPath && currentPath.startsWith(article.href) ? 'text-white' : 'text-secondary'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                  {lang === 'en' ? 'No CLKR articles available for this category.' : 'No hay artículos CLKR disponibles para esta categoría.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Consultations & Social Media */}
        <div className="flex flex-col h-full">
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Schedule Consultation - Updated to match Visas mega menu */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
                </svg>
                {lang === 'en' ? 'Need Help? - Consultations' : '¿Necesitas Ayuda? - Consultas'}
              </h3>
              <div className="space-y-2 mb-4 flex-1">
                <div className="space-y-2 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <a href="https://calendly.com/capital-m-law/rush-initial-consultation?back=1&month=2025-06" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center">
                        <span className="text-white text-xs">⚡</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">{lang === 'en' ? 'Rush Consultation' : 'Consulta Urgente'}</span>
                        <div className="text-xs text-gray-500">{lang === 'en' ? 'Same day' : 'Mismo día'}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-secondary">$90</span>
                  </a>
                  <a href="https://calendly.com/capital-m-law/standard-initial-consultation?back=1&month=2025-07" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
                        <span className="text-white text-xs">📅</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">{lang === 'en' ? 'Standard Consultation' : 'Consulta Estándar'}</span>
                        <div className="text-xs text-gray-500">{lang === 'en' ? 'Next available' : 'Próxima disponible'}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">$55</span>
                  </a>
                  <a href="https://calendly.com/capital-m-law/programmed-initial-consultation?back=1&month=2025-07" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center">
                        <span className="text-white text-xs">📋</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">{lang === 'en' ? 'Programmed Consultation' : 'Consulta Programada'}</span>
                        <div className="text-xs text-gray-500">{lang === 'en' ? 'Scheduled' : 'Programada'}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-secondary">$45</span>
                  </a>
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <a href={lang === 'en' ? '/en/contact' : '/es/contact'} className="inline-flex items-center justify-center bg-gradient-to-r from-secondary to-primary text-white px-3 py-2 rounded-lg hover:from-secondary hover:to-primary text-xs font-medium transition-all duration-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    {lang === 'en' ? 'Write Us' : 'Escríbenos'}
                  </a>
                  <a href="https://wa.me/573001234567?text=Hola,%20necesito%20información%20sobre%20servicios%20legales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-gradient-to-r from-secondary to-primary text-white px-3 py-2 rounded-lg hover:from-secondary hover:to-primary text-xs font-medium transition-all duration-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
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

export default ResourcesMegaMenu; 