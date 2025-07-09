import { useState, useEffect } from 'react';
import { countries } from '../../../data/countries.js';
import type { Country } from '../../../data/countries.js';

interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  beneficiaries?: string;
  workPermit?: string;
  countries: string[];
  country?: string;
  isPopular: boolean;
  emoji?: string;
  alcance?: string;
  lastEdited?: string;
  duration?: string;
}

interface HomePageVisasProps {
  visas?: Visa[];
  lang?: string;
}

const HomePageVisas = ({ visas = [], lang = 'es' }: HomePageVisasProps) => {
  const [filteredVisas, setFilteredVisas] = useState<Visa[]>(visas);
  const [country, setCountry] = useState<string>('Estados Unidos de América');
  const [visaType, setVisaType] = useState<string>('');
  const [beneficiaries, setBeneficiaries] = useState<boolean>(false);
  const [workPermit, setWorkPermit] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Separate popular visas
  const popularVisas = visas.filter((visa: Visa) => visa.isPopular);
  const regularVisas = visas.filter((visa: Visa) => !visa.isPopular);

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
    setCountry('Estados Unidos de América');
    setVisaType('');
    setBeneficiaries(false);
    setWorkPermit(false);
  };

  // Helper function to get label for beneficiaries
  const getBeneficiariesLabel = (beneficiaries: string) => {
    if (!beneficiaries) return 'Sin beneficiarios';
    if (beneficiaries.toLowerCase().includes('yes')) return '✅ Cónyuge e hijos';
    if (beneficiaries.toLowerCase().includes('no')) return '❌ Sin beneficiarios';
    return beneficiaries;
  };

  // Helper function to get label for work permit
  const getWorkPermitLabel = (workPermit: string) => {
    if (!workPermit) return 'Sin permiso de trabajo';
    if (workPermit.toLowerCase().includes('open work permit')) return '💼 Permiso de trabajo abierto';
    if (workPermit.toLowerCase().includes('authorized activity')) return '✅ Actividad autorizada';
    if (workPermit.toLowerCase().includes('no')) return '❌ Sin permiso de trabajo';
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
    const message = `¡Hola! Estaba revisando el sitio web y quiero discutir la categoría de visa ${visaTitle}. ¿Pueden ayudarme con más información?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573146022411?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get displayed visas (9 initially, then all)
  const displayedVisas = showAll ? filteredVisas : filteredVisas.slice(0, 9);
  const hasMoreVisas = filteredVisas.length > 9;

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Liquid Crystal Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-6">
            <span className="text-2xl">🌟</span>
            <span className="text-sm font-medium text-gray-700">Servicios de Visa</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Explora Nuestros
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Servicios de Visa
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre la categoría de visa perfecta para tu viaje a Colombia. Filtra por tu país y requisitos para encontrar la mejor opción.
          </p>
        </div>

        {/* Popular Visas Section */}
        {popularVisas.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl mb-6">
                <span className="text-3xl">✨</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Categorías de Visa Populares
                </h3>
              </div>
              <p className="text-lg text-gray-600">
                Nuestros servicios de visa más solicitados
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularVisas.slice(0, 4).map((visa: Visa) => (
                <div key={visa.id} className="group relative">
                  {/* Liquid Crystal Card */}
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {visa.emoji && (
                            <span className="text-2xl">{visa.emoji}</span>
                          )}
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {visa.title}
                          </h4>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                          Popular
                        </span>
                      </div>
                      
                      {visa.alcance && (
                        <p className="text-sm text-gray-600 mb-4 font-medium">
                          📋 {visa.alcance}
                        </p>
                      )}
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-blue-100/80 text-blue-800 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-200/50">
                            {getBeneficiariesLabel(String(visa.beneficiaries))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-green-100/80 text-green-800 rounded-full text-xs font-medium backdrop-blur-sm border border-green-200/50">
                            {getWorkPermitLabel(String(visa.workPermit))}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <a 
                          href={`/${lang}/visas2/${visa.slug}`}
                          className="flex-1 inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl px-4 py-2.5 hover:bg-blue-50/80 hover:shadow-lg"
                        >
                          Saber más
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppContact(visa.title);
                          }}
                          className="inline-flex items-center justify-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-2.5 hover:bg-green-100/80 hover:shadow-lg"
                        >
                          💬 Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className={`mb-12 p-8 rounded-2xl border transition-all duration-500 ${
          isAnimating 
            ? 'bg-gradient-to-r from-blue-100/50 to-indigo-100/50 border-blue-300 shadow-xl' 
            : 'bg-white/90 backdrop-blur-sm border-white/40 shadow-xl'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                País de Origen
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                {countries
                  .sort((a: Country, b: Country) => (a.nameEn || '').localeCompare(b.nameEn || ''))
                  .map((c: Country, i: number) => (
                    <option key={i} value={c.name}>
                      {lang === 'es' ? c.name : c.nameEn}
                    </option>
                  ))}
              </select>
            </div>

            {/* Visa Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Visa
              </label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                <option value="">Todos los Tipos</option>
                <option value="visitor">Visitante (V)</option>
                <option value="migrant">Migrante (M)</option>
                <option value="resident">Residente (R)</option>
              </select>
            </div>

            {/* Beneficiaries Filter */}
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Permite Beneficiarios
                </span>
              </label>
            </div>

            {/* Work Permit Filter */}
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={workPermit}
                  onChange={(e) => setWorkPermit(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Permiso de Trabajo
                </span>
              </label>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(country || visaType || beneficiaries || workPermit) && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-gray-200/80 transition-all duration-200 border border-gray-200/50"
              >
                Limpiar Todos los Filtros
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Mostrando {displayedVisas.length} de {filteredVisas.length} categorías de visa
            </p>
          </div>
        </div>

        {/* All Visa Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVisas.map((visa: Visa) => (
            <div key={visa.id} className="group relative">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {visa.emoji && (
                        <span className="text-xl">{visa.emoji}</span>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {visa.title}
                      </h3>
                    </div>
                    {visa.isPopular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  {visa.alcance && (
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      📋 {visa.alcance}
                    </p>
                  )}
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-blue-100/80 text-blue-800 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-200/50">
                        {getBeneficiariesLabel(String(visa.beneficiaries))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-green-100/80 text-green-800 rounded-full text-xs font-medium backdrop-blur-sm border border-green-200/50">
                        {getWorkPermitLabel(String(visa.workPermit))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={`/${lang}/visas2/${visa.slug}`}
                      className="flex-1 inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl px-4 py-2.5 hover:bg-blue-50/80 hover:shadow-lg"
                    >
                      Saber más
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppContact(visa.title);
                      }}
                      className="inline-flex items-center justify-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-2.5 hover:bg-green-100/80 hover:shadow-lg"
                    >
                      💬 Contactar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {hasMoreVisas && !showAll && (
          <div className="text-center mt-12">
            <button
              onClick={handleShowMore}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cargando...
                </div>
              ) : (
                `Mostrar ${filteredVisas.length - 9} Visas Más`
              )}
            </button>
          </div>
        )}

        {/* View All Visas Link */}
        <div className="text-center mt-16">
          <a
            href={`/${lang}/visas2`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors group"
          >
            Ver Todas las Categorías de Visa
            <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
        </div>

        {/* No Results Message */}
        {filteredVisas.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No se encontraron visas</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Intenta ajustar tus filtros para ver más opciones de visa.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Limpiar Todos los Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePageVisas; 