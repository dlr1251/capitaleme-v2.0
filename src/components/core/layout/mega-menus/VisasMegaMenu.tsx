import { useState, useEffect } from 'react';
import { countries } from '../../../../data/countries';
import type { Country } from '../../../../data/countries';

interface VisasMegaMenuProps {
  lang?: string;
  menuData?: any;
}

const VisasMegaMenu: React.FC<VisasMegaMenuProps> = ({ lang, menuData = {} }) => {
  // Visa filtering state
  const [visaFilters, setVisaFilters] = useState({
    country: 'All',
    visaType: 'All',
    popular: false
  });
  const [filteredVisas, setFilteredVisas] = useState<any[]>([]);
  
  // Guides filtering state
  const [guideFilters, setGuideFilters] = useState({
    category: 'All',
    popular: false
  });
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);

  // Visa filtering logic
  useEffect(() => {
    if (menuData.allVisas) {
      const filtered = menuData.allVisas.filter((visa: any) => {
        if (visaFilters.country !== 'All') {
          const countryInfo = countries.find((info: Country) =>
            info.name === visaFilters.country || info.nameEn === visaFilters.country
          );
          if (!countryInfo) return false;
          const categories = [];
          if (countryInfo.excempted === "Yes") categories.push("Exempted");
          if (countryInfo.excempted === "No") categories.push("Not exempted");
          if (countryInfo.excempted === "Schengen visa") categories.push("Schengen visa");
          if (countryInfo.treaties) categories.push(...countryInfo.treaties.split(", "));
          const isExemptedCountry = categories.includes("Exempted");
          const isNotExemptedCountry = categories.includes("Not exempted");
          const isCAN = categories.includes("CAN");
          const isMercosur = categories.includes("Mercosur");
          const isWorkingHolidays = categories.includes("Working holidays");
          const hasExemptedVisa = visa.country?.includes("Exempted") || visa.country?.includes("Excempted");
          const hasNotExemptedVisa = visa.country?.includes("Not exempted") || visa.country?.includes("Not excempted");
          const hasCANVisa = visa.country?.includes("CAN");
          const hasMercosurVisa = visa.country?.includes("Mercosur");
          const hasWorkingHolidayVisa = visa.country?.includes("Working holidays");
          if (visa.country?.includes("All countries")) return true;
          const countryMatch = (
            (isExemptedCountry && hasExemptedVisa && !hasNotExemptedVisa) ||
            (isExemptedCountry && isCAN && hasCANVisa && !hasNotExemptedVisa) ||
            (isExemptedCountry && isMercosur && hasMercosurVisa && !hasNotExemptedVisa) ||
            (isExemptedCountry && isWorkingHolidays && hasWorkingHolidayVisa && !hasNotExemptedVisa) ||
            (isNotExemptedCountry && hasNotExemptedVisa && !hasExemptedVisa) ||
            (isNotExemptedCountry && isCAN && hasCANVisa && !hasExemptedVisa) ||
            (isNotExemptedCountry && isMercosur && hasMercosurVisa && !hasExemptedVisa) ||
            (isNotExemptedCountry && isWorkingHolidays && hasWorkingHolidayVisa && !hasExemptedVisa) ||
            (isCAN && hasCANVisa) ||
            (isCAN && isExemptedCountry && hasExemptedVisa) ||
            (isCAN && isNotExemptedCountry && hasNotExemptedVisa) ||
            (isMercosur && hasMercosurVisa) ||
            (isMercosur && isExemptedCountry && hasExemptedVisa) ||
            (isMercosur && isNotExemptedCountry && hasNotExemptedVisa) ||
            (isWorkingHolidays && hasWorkingHolidayVisa) ||
            (isWorkingHolidays && isExemptedCountry && hasExemptedVisa) ||
            (isWorkingHolidays && isNotExemptedCountry && hasNotExemptedVisa)
          );
          if (!countryMatch) return false;
        }
        if (visaFilters.visaType !== 'All' && visa.visaType !== visaFilters.visaType) return false;
        if (visaFilters.popular && !visa.isPopular) return false;
        return true;
      });
      setFilteredVisas(filtered);
    } else {
      setFilteredVisas([]);
    }
  }, [menuData.allVisas, visaFilters, lang]);

  // Guides filtering logic
  useEffect(() => {
    if (menuData.allGuides) {
      const filtered = menuData.allGuides.filter((guide: any) => {
        if (guideFilters.category !== 'All' && guide.category !== guideFilters.category) return false;
        if (guideFilters.popular && !guide.isPopular) return false;
        return true;
      });
      setFilteredGuides(filtered);
    } else {
      setFilteredGuides([]);
    }
  }, [menuData.allGuides, guideFilters, lang]);

  const handleVisaFilterChange = (filterType: string, value: string | boolean) => {
    setVisaFilters(prev => ({ ...prev, [filterType]: value }));
  };
  const resetVisaFilters = () => {
    setVisaFilters({ country: 'All', visaType: 'All', popular: false });
  };
  const handleGuideFilterChange = (filterType: string, value: string | boolean) => {
    setGuideFilters(prev => ({ ...prev, [filterType]: value }));
  };
  const resetGuideFilters = () => {
    setGuideFilters({ category: 'All', popular: false });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Visas with Filters */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {lang === 'en' ? 'Colombian Visas' : 'Visas Colombianas'}
          </h3>
          <div className="flex-1 flex flex-col">
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <select value={visaFilters.country} onChange={e => handleVisaFilterChange('country', e.target.value)} className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
                    <option value="All">{lang === 'en' ? 'All Countries' : 'Todos los Países'}</option>
                    {countries.sort((a: Country, b: Country) => a.nameEn.localeCompare(b.nameEn)).map((country: Country, idx: number) => (
                      <option key={idx} value={lang === 'en' ? country.nameEn : country.name}>
                        {lang === 'en' ? country.nameEn : country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <select value={visaFilters.visaType} onChange={e => handleVisaFilterChange('visaType', e.target.value)} className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
                    <option value="All">{lang === 'en' ? 'All Types' : 'Todos los Tipos'}</option>
                    {menuData.visaTypes?.map((type: string) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {menuData.visaFilters?.hasPopular && (
                  <div className="flex items-center">
                    <input type="checkbox" id="popular-filter" checked={visaFilters.popular} onChange={e => handleVisaFilterChange('popular', e.target.checked)} className="h-3 w-3 text-primary border-gray-300 rounded" />
                    <label htmlFor="popular-filter" className="ml-2 text-xs text-gray-700">{lang === 'en' ? 'Popular' : 'Popular'}</label>
                  </div>
                )}
              </div>
              {(visaFilters.country !== 'All' || visaFilters.visaType !== 'All' || visaFilters.popular) && (
                <button onClick={resetVisaFilters} className="text-xs text-primary hover:text-secondary underline">{lang === 'en' ? 'Reset Filters' : 'Restablecer Filtros'}</button>
              )}
            </div>
            <div className="space-y-2 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredVisas.length > 0 ? (
                filteredVisas.map(visa => (
                  <a key={visa.id} href={visa.url} className="block group p-2 rounded-lg hover:bg-gray-50 border border-gray-100 hover:border-primary transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary line-clamp-2 transition-colors duration-200">{visa.title}</h4>
                        {visa.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{visa.description}</p>}
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                  {lang === 'en' ? 'No visas match your filters.' : 'No hay visas que coincidan con tus filtros.'}
                </div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <a href={lang === 'en' ? '/en/visas' : '/es/visas'} className="inline-flex text-sm items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
                {lang === 'en' ? 'All Visas' : 'Todas las Visas'}
              </a>
            </div>
          </div>
        </div>
        
        {/* Column 2: Guides */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            {lang === 'en' ? 'Guides' : 'Guías'}
          </h3>
          <div className="flex-1 flex flex-col">
            <p className="text-xs text-gray-500 mb-3">
              {lang === 'en' 
                ? 'Free tutorials & guides in English & Spanish' 
                : 'Tutoriales y guías gratis en inglés y español'
              }
            </p>
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                {menuData.guideFilters?.hasPopular && (
                  <div className="flex items-center">
                    <input type="checkbox" id="guide-popular-filter" checked={guideFilters.popular} onChange={e => handleGuideFilterChange('popular', e.target.checked)} className="h-3 w-3 text-secondary border-gray-300 rounded" />
                    <label htmlFor="guide-popular-filter" className="ml-2 text-xs text-gray-700">{lang === 'en' ? 'Popular' : 'Popular'}</label>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredGuides.length > 0 ? (
                filteredGuides.map(guide => (
                  <a key={guide.id} href={guide.url} className="block group p-2 rounded-lg hover:bg-gray-50 border border-gray-100 hover:border-secondary transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">{guide.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-secondary line-clamp-2 transition-colors duration-200">{guide.title}</h4>
                        {guide.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{guide.description}</p>}
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {guide.readingTime} {lang === 'en' ? 'min read' : 'min lectura'}
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                  {lang === 'en' ? 'No guides match your filters.' : 'No hay guías que coincidan con tus filtros.'}
                </div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <a href={lang === 'en' ? '/en/guides' : '/es/guides'} className="inline-flex text-sm items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
                {lang === 'en' ? 'All Guides' : 'Todas las Guías'}
              </a>
            </div>
          </div>
        </div>
        
        {/* Column 3: Consultations */}
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0H8m0 0v4m0-4H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2H8z"/>
              </svg>
              {lang === 'en' ? 'Need Help? - Consultations' : '¿Necesitas Ayuda? - Consultas'}
            </h3>
            <div className="space-y-2 mb-4 flex-1">
              <div className="space-y-2 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                <a href="https://wa.me/573001234567?text=Hola,%20necesito%20información%20sobre%20visas%20colombianas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-gradient-to-r from-secondary to-primary text-white px-3 py-2 rounded-lg hover:from-secondary hover:to-primary text-xs font-medium transition-all duration-200">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisasMegaMenu; 