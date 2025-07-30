import { useState, useEffect } from 'react';
import { countries } from 'data/countries.js';
import type { Country } from 'data/countries.js';
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/solid';
import { normalizeYesNo } from '../../utils/notionHelpers.ts';

interface VisaData {
  title: string;
  short_description: string;
  countries: string[];
  beneficiaries: string;
  workPermit: string;
  type: string;
}

interface Visa {
  id: string;
  slug: string;
  data: VisaData;
}

interface FilterVisaWidgetProps {
  visas: Visa[];
  lang?: 'en' | 'es';
}

const FilterVisaWidget = ({ visas, lang = 'en' }: FilterVisaWidgetProps) => {
  
  const [country, setCountry] = useState<string>('');
  const [beneficiaries, setBeneficiaries] = useState<boolean>(false); 
  const [workPermit, setWorkPermit] = useState<boolean>(false); 
  const [accrueResidency, setAccrueResidency] = useState<boolean>(false);
  const [list, setList] = useState<Visa[]>([]);
  const [originalList, setOriginalList] = useState<Visa[]>([]); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [itemsPerPage] = useState<number>(50); 
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showCountrySelectorError, setShowCountrySelectorError] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("cards"); 

  // Content based on language
  const content = lang === 'es' ? {
    title: "Encuentra tu visa ideal",
    subtitle: "Filtra por país y requisitos",
    selectCountry: "Selecciona tu país",
    selectCountryPlaceholder: "Busca tu país...",
    beneficiaries: "Incluir cónyuge e hijos",
    workPermit: "Permiso de trabajo",
    residency: "Acumular residencia",
    viewMode: "Vista",
    cards: "Tarjetas",
    list: "Lista",
    noResults: "No se encontraron visas que coincidan con tus criterios",
    tryAgain: "Intenta con diferentes filtros",
    viewDetails: "Ver detalles",
    popular: "Popular",
    guide: "Guía",
    loading: "Cargando...",
    error: "Error al cargar visas",
    reset: "Limpiar filtros",
    results: "resultados",
    page: "Página",
    of: "de"
  } : {
    title: "Find your ideal visa",
    subtitle: "Filter by country and requirements",
    selectCountry: "Select your country",
    selectCountryPlaceholder: "Search your country...",
    beneficiaries: "Include spouse & children",
    workPermit: "Work permit",
    residency: "Accrue residency",
    viewMode: "View",
    cards: "Cards",
    list: "List",
    noResults: "No visas found matching your criteria",
    tryAgain: "Try different filters",
    viewDetails: "View details",
    popular: "Popular",
    guide: "Guide",
    loading: "Loading...",
    error: "Error loading visas",
    reset: "Clear filters",
    results: "results",
    page: "Page",
    of: "of"
  };
  
  useEffect(() => {
    setList(visas);
    setOriginalList(visas);
  }, [visas]);

  useEffect(() => {    
    const countryInfo = countries.find((info: Country) => info.name === country);
    if (!countryInfo) {
      setList(originalList);
      return;
    }

    const categories: string[] = []    
    if (countryInfo.excempted === "Yes") categories.push("Exempted");
    if (countryInfo.excempted === "No") categories.push("Not exempted");
    if (countryInfo.excempted === "Schengen visa") categories.push("Schengen visa");
    if (countryInfo.treaties) categories.push(...countryInfo.treaties.split(", "));
    
    const filteredList = originalList.filter((visa: Visa) => {
      const isExemptedCountry = categories.includes("Exempted");
      const isNotExemptedCountry = categories.includes("Not exempted");
      const isCAN = categories.includes("CAN");
      const isMercosur = categories.includes("Mercosur");
      const isWorkingHolidays = categories.includes("Working holidays");
      
      const meetsBeneficiariesCondition = !beneficiaries || (beneficiaries && normalizeYesNo(visa.data.beneficiaries) === 'yes');
      const meetsWorkPermitCondition = !workPermit || (workPermit && normalizeYesNo(visa.data.workPermit) === 'yes');
      const meetsResidencyCondition = !accrueResidency || (accrueResidency && visa.data.type === 'Migrant');
      
      const hasExemptedVisa = visa.data.countries.includes("Exempted") || visa.data.countries.includes("Excempted");
      const hasNotExemptedVisa = visa.data.countries.includes("Not exempted") || visa.data.countries.includes("Not excempted");
      const hasCANVisa = visa.data.countries.includes("CAN");
      const hasMercosurVisa = visa.data.countries.includes("Mercosur");
      const hasWorkingHolidayVisa = visa.data.countries.includes("Working holidays");
    
      // If visa has "All countries", it applies to everyone
      if (visa.data.countries.includes("All countries")) {
        return meetsBeneficiariesCondition && meetsWorkPermitCondition && meetsResidencyCondition;
      }
      
      const decision = (
        // For exempted countries: show exempted visas, or treaty visas if they have the treaty
        (isExemptedCountry && hasExemptedVisa && !hasNotExemptedVisa) ||
        (isExemptedCountry && isCAN && hasCANVisa && !hasNotExemptedVisa) ||
        (isExemptedCountry && isMercosur && hasMercosurVisa && !hasNotExemptedVisa) ||
        (isExemptedCountry && isWorkingHolidays && hasWorkingHolidayVisa && !hasNotExemptedVisa) ||
        
        // For non-exempted countries: show non-exempted visas, or treaty visas if they have the treaty
        (isNotExemptedCountry && hasNotExemptedVisa && !hasExemptedVisa) ||
        (isNotExemptedCountry && isCAN && hasCANVisa && !hasExemptedVisa) ||
        (isNotExemptedCountry && isMercosur && hasMercosurVisa && !hasExemptedVisa) ||
        (isNotExemptedCountry && isWorkingHolidays && hasWorkingHolidayVisa && !hasExemptedVisa) ||
        
        // For CAN countries: show CAN visas, or exempted/non-exempted based on their status
        (isCAN && hasCANVisa) ||
        
        // For Mercosur countries: show Mercosur visas, or exempted/non-exempted based on their status
        (isMercosur && hasMercosurVisa) ||
        
        // For Working Holidays countries: show Working Holidays visas, or exempted/non-exempted based on their status
        (isWorkingHolidays && hasWorkingHolidayVisa)
      );
      
      return decision && meetsBeneficiariesCondition && meetsWorkPermitCondition && meetsResidencyCondition;
    });
    
    setList(filteredList);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredList.length / itemsPerPage));
  }, [country, beneficiaries, workPermit, accrueResidency, originalList, itemsPerPage]);

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setShowCountrySelectorError(false);
  };

  const resetFilters = () => {
    setCountry('');
    setBeneficiaries(false);
    setWorkPermit(false);
    setAccrueResidency(false);
    setList(originalList);
    setCurrentPage(1);
  };

  const currentItems = list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {content.title}
        </h2>
        <p className="text-xl text-gray-600">
          {content.subtitle}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.selectCountry}
            </label>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">{content.selectCountryPlaceholder}</option>
              {countries.map((countryOption) => (
                <option key={countryOption.name} value={lang === 'en' ? countryOption.nameEn : countryOption.name}>
                  {lang === 'en' ? countryOption.nameEn : countryOption.name}
                </option>
              ))}
            </select>
          </div>

          {/* Beneficiaries */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="beneficiaries"
              checked={beneficiaries}
              onChange={(e) => setBeneficiaries(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="beneficiaries" className="ml-2 text-sm text-gray-700">
              {content.beneficiaries}
            </label>
          </div>

          {/* Work Permit */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="workPermit"
              checked={workPermit}
              onChange={(e) => setWorkPermit(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="workPermit" className="ml-2 text-sm text-gray-700">
              {content.workPermit}
            </label>
          </div>

          {/* Residency */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="residency"
              checked={accrueResidency}
              onChange={(e) => setAccrueResidency(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="residency" className="ml-2 text-sm text-gray-700">
              {content.residency}
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {content.reset}
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {list.length} {content.results}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{content.viewMode}:</span>
          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "cards" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results */}
      {currentItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">{content.noResults}</p>
          <p className="text-gray-400">{content.tryAgain}</p>
        </div>
      ) : (
        <>
          {/* Cards View */}
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((visa) => (
                <div key={visa.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {visa.data.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {visa.data.short_description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {normalizeYesNo(visa.data.beneficiaries) === 'yes' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {lang === 'es' ? '✅ Cónyuge e hijos' : '✅ Spouse & Children'}
                      </span>
                    )}
                    {normalizeYesNo(visa.data.workPermit) === 'yes' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {lang === 'es' ? '💼 Permiso de trabajo' : '💼 Work permit'}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/${lang}/visas/${visa.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    {content.viewDetails}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {currentItems.map((visa) => (
                <div key={visa.id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {visa.data.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {visa.data.short_description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {normalizeYesNo(visa.data.beneficiaries) === 'yes' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {lang === 'es' ? '✅ Cónyuge e hijos' : '✅ Spouse & Children'}
                          </span>
                        )}
                        {normalizeYesNo(visa.data.workPermit) === 'yes' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {lang === 'es' ? '💼 Permiso de trabajo' : '💼 Work permit'}
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={`/${lang}/visas/${visa.slug}`}
                      className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      {content.viewDetails}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lang === 'es' ? 'Anterior' : 'Previous'}
                </button>
                
                <span className="px-3 py-2 text-sm text-gray-600">
                  {content.page} {currentPage} {content.of} {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lang === 'es' ? 'Siguiente' : 'Next'}
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilterVisaWidget; 