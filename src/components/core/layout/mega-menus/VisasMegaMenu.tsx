import React from 'react';

interface VisasMegaMenuProps {
  lang?: string;
  menuData?: any;
  currentPath?: string;
}

const VisasMegaMenu: React.FC<VisasMegaMenuProps> = ({ lang = 'en', menuData = {}, currentPath }) => {
  const popularVisas = menuData.popularVisas || [];
  const visasGuides = menuData.visasGuides || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Column 1: Popular Visas */}
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {lang === 'en' ? 'Popular Visas' : 'Visas Populares'}
        </h3>
        <div className="flex-1 flex flex-col">
          <div className="space-y-3 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {popularVisas.length > 0 ? (
              popularVisas.map((visa: any, idx: number) => (
                <a
                  key={visa.slug || visa.id || idx}
                  href={`/${lang}/visas/${visa.slug}`}
                  className={`block group p-3 rounded-lg border transition-all duration-200 ${currentPath && currentPath.startsWith(`/${lang}/visas/${visa.slug}`) ? 'bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg' : 'hover:bg-primary/5 hover:border-primary/30'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">{visa.emoji || '🛂'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary text-sm line-clamp-2 transition-colors duration-200">
                        {visa.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {visa.duration || (lang === 'en' ? 'Varies' : 'Variable')}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                {lang === 'en' ? 'No popular visas available.' : 'No hay visas populares.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column 2: Quick Actions */}
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
            </svg>
            {lang === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}
          </h3>
          <div className="space-y-2 flex-1 flex flex-col justify-center">
            <a
              href={lang === 'en' ? '/en/contact' : '/es/contact'}
              className="block w-full bg-primary text-white text-center py-2 px-4 rounded-md hover:bg-secondary transition-colors text-sm font-medium"
            >
              {lang === 'en' ? 'Get Consultation' : 'Obtener Consulta'}
            </a>
            <a
              href={lang === 'en' ? '/en/visas' : '/es/visas'}
              className="block w-full bg-white text-primary text-center py-2 px-4 rounded-md border border-primary hover:bg-primary/5 transition-colors text-sm font-medium"
            >
              {lang === 'en' ? 'View All Visas' : 'Ver Todas las Visas'}
            </a>
          </div>
        </div>
      </div>

      {/* Column 3: Visa Guides */}
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
          {lang === 'en' ? 'Visa Guides' : 'Guías de Visas'}
        </h3>
        <div className="flex-1 flex flex-col">
          <div className="space-y-3 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {visasGuides.length > 0 ? (
              visasGuides.map((guide: any, idx: number) => (
                <a
                  key={guide.slug || guide.id || idx}
                  href={guide.href || `/${lang}/guides/${guide.slug}`}
                  className={`block group p-3 rounded-lg border transition-all duration-200 ${currentPath && currentPath.startsWith(guide.href || `/${lang}/guides/${guide.slug}`) ? 'bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg' : 'hover:bg-primary/5 hover:border-primary/30'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">📘</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary text-sm line-clamp-2 transition-colors duration-200">
                        {guide.title}
                      </h4>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                {lang === 'en' ? 'No visa guides available.' : 'No hay guías de visas.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisasMegaMenu; 