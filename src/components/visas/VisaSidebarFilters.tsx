import { useState, useEffect } from 'react';
import type { Country } from 'data/countries.js';
import { countries } from 'data/countries.js';

interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  countries: string[];
  beneficiaries?: boolean;
  workPermit?: boolean;
  type: 'Visitor' | 'Migrant' | 'Resident';
  isPopular?: boolean;
  emoji?: string;
  alcance?: string;
  lastEdited?: string;
  duration?: string;
}

interface VisaSidebarFiltersProps {
  visas: Visa[];
  currentSlug: string;
  lang: string;
  countries: Country[];
  visaTypes: string[];
}

const VisaSidebarFilters = ({ visas, currentSlug, lang, countries: visaCountries, visaTypes }: VisaSidebarFiltersProps) => {
  const [filters, setFilters] = useState<{ country: string; visaType: string }>({
    country: '',
    visaType: 'All',
  });
  const [filteredVisas, setFilteredVisas] = useState<Visa[]>(visas);

  // Filter visas based on selected criteria
  useEffect(() => {
    let filtered = [...visas];

    // Filter by country
    if (filters.country && filters.country !== '') {
      const countryInfo = countries.find((info: Country) => info.name === filters.country);
      if (countryInfo) {
        const categories: string[] = [];
        if (countryInfo.excempted === "Yes") categories.push("Exempted");
        if (countryInfo.excempted === "No") categories.push("Not exempted");
        if (countryInfo.excempted === "Schengen visa") categories.push("Schengen visa");
        if (countryInfo.treaties) categories.push(...countryInfo.treaties.split(", "));

        filtered = (filtered as any[]).filter((visa: any) => {
          const visaCountries = visa.countries || [];
          const effectiveVisaCountries = visaCountries.length === 0 ? ["Not exempted"] : visaCountries;
          
          if (effectiveVisaCountries.includes("All countries")) {
            return true;
          }
          
          const isExemptedCountry = categories.includes("Exempted");
          const isNotExemptedCountry = categories.includes("Not exempted");
          const isCAN = categories.includes("CAN");
          const isMercosur = categories.includes("Mercosur");
          const isWorkingHolidays = categories.includes("Working holidays");
          
          const hasExemptedVisa = effectiveVisaCountries.includes("Exempted") || effectiveVisaCountries.includes("Excempted");
          const hasNotExemptedVisa = effectiveVisaCountries.includes("Not exempted") || effectiveVisaCountries.includes("Not excempted");
          const hasCANVisa = effectiveVisaCountries.includes("CAN");
          const hasMercosurVisa = effectiveVisaCountries.includes("Mercosur");
          const hasWorkingHolidayVisa = effectiveVisaCountries.includes("Working holidays");
          
          return (
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
        });
      }
    }

    // Filter by visa type
    if (filters.visaType && filters.visaType !== 'All') {
      filtered = filtered.filter((visa: Visa) => visa.type === filters.visaType);
    }

    setFilteredVisas(filtered);
  }, [visas, filters]);

  const handleFilterChange = (filterType: 'country' | 'visaType', value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = () => {
    setFilters({ country: '', visaType: 'All' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          🛂 {lang === 'es' ? 'Visas' : 'Visas'}
        </h2>
        <p className="text-sm text-gray-600">
          {lang === 'es' ? 'Filtra y encuentra la visa perfecta para ti' : 'Filter and find the perfect visa for you'}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Country Filter */}
        <div>   
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{lang === 'es' ? 'Selecciona país de origen' : 'Select country of origin'}</option>
            {countries
              .sort((a, b) => (a.nameEn || a.name).localeCompare(b.nameEn || b.name))
              .map((country: Country) => (
                <option key={country.name} value={country.name}>{country.name}</option>
              ))}
          </select>
        </div>

        {/* Visa Type Filter */}
        <div>
          
          <select
            value={filters.visaType}
            onChange={(e) => handleFilterChange('visaType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="All">{lang === 'es' ? 'Selecciona tipo de Visa' : 'Select Visa Type'}</option>
            {visaTypes.map((type: string) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {lang === 'es' ? `${filteredVisas.length} visas encontradas` : `${filteredVisas.length} visas found`}
        </p>
        <button
          onClick={resetFilters}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          {lang === 'es' ? 'Limpiar' : 'Clear'}
        </button>
      </div>

      {/* Visa List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filteredVisas.map((visa: Visa) => (
          <a
            key={visa.slug}
            href={`/${lang}/visas/${visa.slug}`}
            className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
              visa.slug === currentSlug
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
            }`}
          >
            <div className="font-medium">{visa.title}</div>
            {visa.description && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {visa.description}
              </div>
            )}
            {visa.isPopular && (
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {lang === 'es' ? 'Popular' : 'Popular'}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* Quick Links */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {lang === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
        </h3>
        <div className="space-y-2">
          <a 
            href={`/${lang}/visas`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">🏠</span>
            {lang === 'es' ? 'Inicio Visas' : 'Visas Home'}
          </a>
          <a 
            href={`/${lang}/contact`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">📞</span>
            {lang === 'es' ? 'Contáctanos' : 'Contact Us'}
          </a>
          <a 
            href={`/${lang}/real-estate`} 
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <span className="mr-2">🏠</span>
            {lang === 'es' ? 'Bienes Raíces' : 'Real Estate'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default VisaSidebarFilters; 