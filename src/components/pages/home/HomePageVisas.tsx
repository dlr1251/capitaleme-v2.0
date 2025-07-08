// This file is now reserved for the new Home Visa Assistance Section.
// The legacy visas section has been moved to VisasSectionLegacy.tsx for use in /visas route only.

import { useState, useEffect } from 'react';
import { countries } from 'data/countries.js';
import type { Country } from 'data/countries.js';

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

interface HomePageVisasProps {
  visas?: Visa[];
  lang?: 'en' | 'es';
  intro?: boolean;
}

const HomePageVisas = ({ visas = [], lang = 'es', intro = true }: HomePageVisasProps) => {
  const [filteredVisas, setFilteredVisas] = useState<Visa[]>(visas);
  const [country, setCountry] = useState(lang === 'es' ? 'Estados Unidos de América' : 'United States of America');
  const [visaType, setVisaType] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(false);
  const [workPermit, setWorkPermit] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Define content based on language
  const content = lang === 'es' ? {
    title: "Explora Nuestros",
    subtitle: "Servicios de Visa",
    description: "Descubre las opciones de visa disponibles para tu nacionalidad. Nuestro sistema inteligente filtra automáticamente las visas que aplican para tu país de origen.",
    countryLabel: "País de origen",
    visaTypeLabel: "Tipo de visa",
    beneficiariesLabel: "Incluir beneficiarios",
    workPermitLabel: "Con permiso de trabajo",
    clearFilters: "Limpiar filtros",
    showMore: "Ver más visas",
    showLess: "Ver menos",
    noVisasFound: "No se encontraron visas que coincidan con tus criterios.",
    tryDifferentFilters: "Intenta con diferentes filtros o contacta a nuestro equipo para una consulta personalizada.",
    contactUs: "Contáctanos",
    beneficiaries: {
      yes: "✅ Cónyuge e Hijos",
      no: "❌ Sin beneficiarios",
      none: "Sin beneficiarios"
    },
    workPermit: {
      open: "💼 Permiso de trabajo abierto",
      authorized: "✅ Actividad autorizada",
      no: "❌ Sin permiso de trabajo",
      none: "Sin permiso de trabajo"
    },
    whatsappMessage: "¡Hola! Estaba revisando el sitio web y quiero discutir la categoría de visa"
  } : {
    title: "Explore Our",
    subtitle: "Visa Services",
    description: "Discover the visa options available for your nationality. Our intelligent system automatically filters visas that apply to your country of origin.",
    countryLabel: "Country of origin",
    visaTypeLabel: "Visa type",
    beneficiariesLabel: "Include beneficiaries",
    workPermitLabel: "With work permit",
    clearFilters: "Clear filters",
    showMore: "Show more visas",
    showLess: "Show less",
    noVisasFound: "No visas found matching your criteria.",
    tryDifferentFilters: "Try different filters or contact our team for a personalized consultation.",
    contactUs: "Contact Us",
    beneficiaries: {
      yes: "✅ Spouse & Children",
      no: "❌ No beneficiaries",
      none: "No beneficiaries"
    },
    workPermit: {
      open: "💼 Open work permit",
      authorized: "✅ Authorized activity",
      no: "❌ No work permit",
      none: "No work permit"
    },
    whatsappMessage: "Hello! I was reviewing the website and want to discuss the visa category"
  };

  // Separate popular visas
  const popularVisas = visas.filter(visa => visa.isPopular);
  const regularVisas = visas.filter(visa => !visa.isPopular);

  // Filter visas based on selected criteria
  useEffect(() => {
    let filtered = [...visas];

    // Filter by country - using the same logic as AllVisaFilterWidget
    if (country) {
      const countryInfo = countries.find((info: Country) => info.name === country);
      if (countryInfo) {
        const categories: string[] = [];
        if (countryInfo.excempted === "Yes") categories.push("Exempted");
        if (countryInfo.excempted === "No") categories.push("Not exempted");
        if (countryInfo.excempted === "Schengen visa") categories.push("Schengen visa");
        if (countryInfo.treaties && countryInfo.treaties !== "null") {
          categories.push(...countryInfo.treaties.split(", "));
        }

        filtered = filtered.filter(visa => {
          try {
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
          } catch (error) {
            
            return false;
          }
        });
      }
    }

    // Filter by visa type
    if (visaType) {
      filtered = filtered.filter(visa => {
        try {
          const visaTypeCode = visa.title?.split(' ')[0] || '';
          return visaTypeCode.toLowerCase().includes(visaType.charAt(0).toLowerCase());
        } catch (error) {
          
          return false;
        }
      });
    }

    // Filter by beneficiaries
    if (beneficiaries) {
      filtered = filtered.filter(visa => {
        try {
          return visa.beneficiaries === 'Yes';
        } catch (error) {
          
          return false;
        }
      });
    }

    // Filter by work permit
    if (workPermit) {
      filtered = filtered.filter(visa => {
        try {
          return visa.workPermit && visa.workPermit !== 'No work permit';
        } catch (error) {
          
          return false;
        }
      });
    }

    setFilteredVisas(filtered);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    
    return () => clearTimeout(timer);
  }, [country, visaType, beneficiaries, workPermit, visas]);

  const clearFilters = () => {
    setCountry(lang === 'es' ? 'Estados Unidos de América' : 'United States of America');
    setVisaType('');
    setBeneficiaries(false);
    setWorkPermit(false);
  };

  // Helper function to get label for beneficiaries
  const getBeneficiariesLabel = (beneficiaries: any) => {
    try {
      if (!beneficiaries || typeof beneficiaries !== 'string') return content.beneficiaries.none;
      if (beneficiaries.toLowerCase().includes('yes')) return content.beneficiaries.yes;
      if (beneficiaries.toLowerCase().includes('no')) return content.beneficiaries.no;
      return beneficiaries;
    } catch (error) {
      
      return content.beneficiaries.none;
    }
  };

  // Helper function to get label for work permit
  const getWorkPermitLabel = (workPermit: any) => {
    try {
      if (!workPermit || typeof workPermit !== 'string') return content.workPermit.none;
      if (workPermit.toLowerCase().includes('open work permit')) return content.workPermit.open;
      if (workPermit.toLowerCase().includes('authorized activity')) return content.workPermit.authorized;
      if (workPermit.toLowerCase().includes('no')) return content.workPermit.no;
      return workPermit;
    } catch (error) {
      
      return content.workPermit.none;
    }
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
    const message = `${content.whatsappMessage} ${visaTitle}. ¿Pueden ayudarme con más información?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573146022411?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get displayed visas (9 initially, then all)
  const displayedVisas = showAll ? filteredVisas : filteredVisas.slice(0, 9);
  const hasMoreVisas = filteredVisas.length > 9;

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {intro && (
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-primary tracking-tight mb-6">
              {content.title}
              <span className="block text-secondary">{content.subtitle}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {content.countryLabel}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">{lang === 'es' ? 'Todos los tipos' : 'All types'}</option>
                <option value="M">M - {lang === 'es' ? 'Migrante' : 'Migrant'}</option>
                <option value="V">V - {lang === 'es' ? 'Visitante' : 'Visitor'}</option>
                <option value="R">R - {lang === 'es' ? 'Residente' : 'Resident'}</option>
              </select>
            </div>

            {/* Beneficiaries Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="beneficiaries"
                checked={beneficiaries}
                onChange={(e) => setBeneficiaries(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="beneficiaries" className="text-sm font-medium text-gray-700">
                {content.beneficiariesLabel}
              </label>
            </div>

            {/* Work Permit Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="workPermit"
                checked={workPermit}
                onChange={(e) => setWorkPermit(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="workPermit" className="text-sm font-medium text-gray-700">
                {content.workPermitLabel}
              </label>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {content.clearFilters}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          {filteredVisas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {content.noVisasFound}
              </h3>
              <p className="text-gray-500 mb-6">
                {content.tryDifferentFilters}
              </p>
              <a
                href={lang === 'es' ? '/es/contact' : '/en/contact'}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {content.contactUs}
              </a>
            </div>
          ) : (
            <>
              {/* Popular Visas Section */}
              {popularVisas.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {lang === 'es' ? 'Visas Populares' : 'Popular Visas'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularVisas.map((visa) => (
                      <div key={visa.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-3xl">{visa.emoji || '📋'}</div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {lang === 'es' ? 'Popular' : 'Popular'}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{visa.title || 'Visa'}</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{visa.description || ''}</p>
                        <div className="space-y-2 text-sm text-gray-500">
                          <div>{lang === 'es' ? 'Beneficiarios:' : 'Beneficiaries:'} {getBeneficiariesLabel(visa.beneficiaries)}</div>
                          <div>{lang === 'es' ? 'Permiso de trabajo:' : 'Work permit:'} {getWorkPermitLabel(visa.workPermit)}</div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <a
                            href={`/${lang}/visas/${visa.slug || visa.id}`}
                            className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                          >
                            {lang === 'es' ? 'Ver detalles' : 'View details'}
                          </a>
                          <button
                            onClick={() => handleWhatsAppContact(visa.title || 'Visa')}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            💬
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Visas Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {lang === 'es' ? 'Todas las Visas' : 'All Visas'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedVisas.map((visa) => (
                    <div key={visa.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-4">{visa.emoji || '📋'}</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{visa.title || 'Visa'}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{visa.description || ''}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div>{lang === 'es' ? 'Beneficiarios:' : 'Beneficiaries:'} {getBeneficiariesLabel(visa.beneficiaries)}</div>
                        <div>{lang === 'es' ? 'Permiso de trabajo:' : 'Work permit:'} {getWorkPermitLabel(visa.workPermit)}</div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <a
                          href={`/${lang}/visas/${visa.slug || visa.id}`}
                          className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                          {lang === 'es' ? 'Ver detalles' : 'View details'}
                        </a>
                        <button
                          onClick={() => handleWhatsAppContact(visa.title || 'Visa')}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          💬
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreVisas && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleShowMore}
                      disabled={isLoading}
                      className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {lang === 'es' ? 'Cargando...' : 'Loading...'}
                        </span>
                      ) : showAll ? (
                        content.showLess
                      ) : (
                        content.showMore
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomePageVisas; 