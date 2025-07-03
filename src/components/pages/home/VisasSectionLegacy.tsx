// This is a copy of the original HomePageVisas.tsx for use only in /visas route.
// The code is unchanged from the original HomePageVisas.tsx.

import { useState, useEffect } from 'react';
import { countries } from 'data/countries';
import type { Country } from 'data/countries';

interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  beneficiaries?: any;
  workPermit?: any;
  countries: string[];
  country?: string;
  isPopular: boolean;
  emoji: string;
  alcance: string;
  lastEdited: string;
  duration?: string;
}

interface VisasSectionLegacyProps {
  visas?: Visa[];
  lang?: 'en' | 'es';
  intro?: boolean;
}

const VisasSectionLegacy = ({ visas = [], lang = 'es', intro = true }: VisasSectionLegacyProps) => {
  const [filteredVisas, setFilteredVisas] = useState(visas);
  const [country, setCountry] = useState(lang === 'es' ? 'Estados Unidos de América' : 'United States');
  const [visaType, setVisaType] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(false);
  const [workPermit, setWorkPermit] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Separate popular visas
  const popularVisas = visas.filter(visa => visa.isPopular);
  const regularVisas = visas.filter(visa => !visa.isPopular);

  // Content based on language
  const content = lang === 'es' ? {
    title: 'Explora Nuestros',
    subtitle: 'Servicios de Visa',
    description: 'Descubre la categoría de visa perfecta para tu viaje a Colombia. Filtra por tu país y requisitos para encontrar la mejor opción.',
    popularTitle: '🌟 Categorías de Visa Populares',
    popularSubtitle: 'Nuestros servicios de visa más solicitados',
    filterTitle: '🔍 Filtros de Búsqueda',
    countryLabel: 'País de origen',
    visaTypeLabel: 'Tipo de visa',
    beneficiariesLabel: 'Incluir beneficiarios',
    workPermitLabel: 'Permiso de trabajo',
    clearFilters: 'Limpiar filtros',
    showMore: 'Ver más visas',
    showLess: 'Ver menos',
    contactWhatsApp: 'Contactar por WhatsApp',
    noBeneficiaries: 'Sin beneficiarios',
    withBeneficiaries: '✅ Cónyuge e hijos',
    withoutBeneficiaries: '❌ Sin beneficiarios',
    noWorkPermit: 'Sin permiso de trabajo',
    openWorkPermit: '💼 Permiso de trabajo abierto',
    authorizedActivity: '✅ Actividad autorizada',
    withoutWorkPermit: '❌ Sin permiso de trabajo',
    whatsappMessage: '¡Hola! Estaba revisando el sitio web y quiero discutir la categoría de visa',
    canHelp: '¿Pueden ayudarme con más información?'
  } : {
    title: 'Explore Our',
    subtitle: 'Visa Services',
    description: 'Discover the perfect visa category for your trip to Colombia. Filter by your country and requirements to find the best option.',
    popularTitle: '🌟 Popular Visa Categories',
    popularSubtitle: 'Our most requested visa services',
    filterTitle: '🔍 Search Filters',
    countryLabel: 'Country of origin',
    visaTypeLabel: 'Visa type',
    beneficiariesLabel: 'Include beneficiaries',
    workPermitLabel: 'Work permit',
    clearFilters: 'Clear filters',
    showMore: 'Show more visas',
    showLess: 'Show less',
    contactWhatsApp: 'Contact via WhatsApp',
    noBeneficiaries: 'No beneficiaries',
    withBeneficiaries: '✅ Spouse and children',
    withoutBeneficiaries: '❌ No beneficiaries',
    noWorkPermit: 'No work permit',
    openWorkPermit: '💼 Open work permit',
    authorizedActivity: '✅ Authorized activity',
    withoutWorkPermit: '❌ No work permit',
    whatsappMessage: 'Hello! I was reviewing the website and want to discuss the visa category',
    canHelp: 'Can you help me with more information?'
  };

  // Filter visas based on selected criteria
  useEffect(() => {
    let filtered = [...visas];

    // Filter by country - using the same logic as AllVisaFilterWidget
    if (country) {
      const countryInfo = countries.find((info: Country) => info.name === country);
      if (countryInfo) {
        const categories: string[] = [];
        if (countryInfo?.excempted === "Yes") categories.push("Exempted");
        if (countryInfo?.excempted === "No") categories.push("Not exempted");
        if (countryInfo?.excempted === "Schengen visa") categories.push("Schengen visa");
        if (countryInfo.treaties && countryInfo.treaties !== "null") {
          categories.push(...countryInfo.treaties.split(", "));
        }

        filtered = filtered.filter(visa => {
          const visaCountries = visa.countries || [];
          
          // If visa has no country restrictions (empty array), treat it as "Not exempted" 
          // since that's the most restrictive and safest option
          const effectiveVisaCountries = visaCountries.length === 0 ? ["Not exempted"] : visaCountries;
          
          // If visa has "All countries", it applies to everyone
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
          
          // Use the exact same logic as AllVisaFilterWidget
          const countryDecision = (
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
            (isCAN && isExemptedCountry && hasExemptedVisa) ||
            (isCAN && isNotExemptedCountry && hasNotExemptedVisa) ||
            
            // For Mercosur countries: show Mercosur visas, or exempted/non-exempted based on their status
            (isMercosur && hasMercosurVisa) ||
            (isMercosur && isExemptedCountry && hasExemptedVisa) ||
            (isMercosur && isNotExemptedCountry && hasNotExemptedVisa) ||
            
            // For Working Holidays countries: show Working Holiday visas, or exempted/non-exempted based on their status
            (isWorkingHolidays && hasWorkingHolidayVisa) ||
            (isWorkingHolidays && isExemptedCountry && hasExemptedVisa) ||
            (isWorkingHolidays && isNotExemptedCountry && hasNotExemptedVisa)
          );
          
          return countryDecision;
        });
      }
    }

    // Filter by visa type
    if (visaType) {
      filtered = filtered.filter(visa => {
        const visaTypeCode = visa.title.split(' ')[0];
        return visaTypeCode.toLowerCase().includes(visaType.charAt(0).toLowerCase());
      });
    }

    // Filter by beneficiaries
    if (beneficiaries) {
      filtered = filtered.filter(visa => visa.beneficiaries === 'Yes');
    }

    // Filter by work permit
    if (workPermit) {
      filtered = filtered.filter(visa => visa.workPermit && visa.workPermit !== 'No work permit');
    }

    setFilteredVisas(filtered);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    
    return () => clearTimeout(timer);
  }, [country, visaType, beneficiaries, workPermit, visas]);

  const clearFilters = () => {
    setCountry(lang === 'es' ? 'Estados Unidos de América' : 'United States');
    setVisaType('');
    setBeneficiaries(false);
    setWorkPermit(false);
  };

  // Helper function to get label for beneficiaries
  const getBeneficiariesLabel = (beneficiaries: any) => {
    if (!beneficiaries) return content.noBeneficiaries;
    if (beneficiaries.toLowerCase().includes('yes')) return content.withBeneficiaries;
    if (beneficiaries.toLowerCase().includes('no')) return content.withoutBeneficiaries;
    return beneficiaries;
  };

  // Helper function to get label for work permit
  const getWorkPermitLabel = (workPermit: any) => {
    if (!workPermit) return content.noWorkPermit;
    if (workPermit.toLowerCase().includes('open work permit')) return content.openWorkPermit;
    if (workPermit.toLowerCase().includes('authorized activity')) return content.authorizedActivity;
    if (workPermit.toLowerCase().includes('no')) return content.withoutWorkPermit;
    return workPermit;
  };

  // Handle show more with loading animation
  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowAll(true);
      setIsLoading(false);
    }, 800);
  };

  // Handle WhatsApp contact
  const handleWhatsAppContact = (visaTitle: string) => {
    const message = `${content.whatsappMessage} ${visaTitle}. ${content.canHelp}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573146022411?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get displayed visas (9 initially, then all)
  const displayedVisas = showAll ? filteredVisas : filteredVisas.slice(0, 9);
  const hasMoreVisas = filteredVisas.length > 9;

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {intro && (
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight mb-6">
              {content.title}
              <span className="block text-secondary">{content.subtitle}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        )}

        {/* Popular Visas Section */}
        {popularVisas.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-primary mb-4">
                {content.popularTitle}
              </h3>
              <p className="text-lg text-gray-600">
                {content.popularSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {popularVisas.slice(0, 4).map((visa) => (
                <div key={visa.id} className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border-2 border-secondary/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {visa.emoji && (
                        <span className="text-2xl">{visa.emoji}</span>
                      )}
                      <h4 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors">
                        {visa.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {visa.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {getBeneficiariesLabel(visa.beneficiaries)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getWorkPermitLabel(visa.workPermit)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">
            {content.filterTitle}
          </h3>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.countryLabel}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {countries.map((countryInfo: Country) => (
                    <option key={countryInfo.name} value={countryInfo.name}>
                      {countryInfo.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visa Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.visaTypeLabel}
                </label>
                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{lang === 'es' ? 'Todos los tipos' : 'All types'}</option>
                  <option value="M">M - {lang === 'es' ? 'Migrante' : 'Migrant'}</option>
                  <option value="R">R - {lang === 'es' ? 'Residente' : 'Resident'}</option>
                  <option value="TP">TP - {lang === 'es' ? 'Trabajador Permanente' : 'Permanent Worker'}</option>
                  <option value="TI">TI - {lang === 'es' ? 'Trabajador Independiente' : 'Independent Worker'}</option>
                  <option value="V">V - {lang === 'es' ? 'Visitante' : 'Visitor'}</option>
                </select>
              </div>

              {/* Beneficiaries Filter */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={beneficiaries}
                    onChange={(e) => setBeneficiaries(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {content.beneficiariesLabel}
                  </span>
                </label>
              </div>

              {/* Work Permit Filter */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workPermit}
                    onChange={(e) => setWorkPermit(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {content.workPermitLabel}
                  </span>
                </label>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-6 text-center">
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {content.clearFilters}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-primary">
              {lang === 'es' ? 'Resultados' : 'Results'} ({filteredVisas.length})
            </h3>
          </div>

          {/* Visa Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {displayedVisas.map((visa) => (
              <div key={visa.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {visa.emoji && (
                      <span className="text-2xl">{visa.emoji}</span>
                    )}
                    <h4 className="text-lg font-semibold text-primary">
                      {visa.title}
                    </h4>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {visa.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{lang === 'es' ? 'Beneficiarios' : 'Beneficiaries'}:</span>
                    <span className="font-medium">{getBeneficiariesLabel(visa.beneficiaries)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{lang === 'es' ? 'Permiso de trabajo' : 'Work permit'}:</span>
                    <span className="font-medium">{getWorkPermitLabel(visa.workPermit)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <a
                    href={`/${lang}/visas/${visa.slug}`}
                    className="text-primary hover:text-secondary font-medium text-sm"
                  >
                    {lang === 'es' ? 'Ver detalles' : 'View details'}
                  </a>
                  <button
                    onClick={() => handleWhatsAppContact(visa.title)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
                  >
                    <span>💬</span>
                    {content.contactWhatsApp}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMoreVisas && (
            <div className="text-center mt-8">
              {!showAll ? (
                <button
                  onClick={handleShowMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {lang === 'es' ? 'Cargando...' : 'Loading...'}
                    </span>
                  ) : (
                    content.showMore
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {content.showLess}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VisasSectionLegacy; 