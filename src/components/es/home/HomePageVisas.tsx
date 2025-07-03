import { useState, useEffect } from 'react';
import { countries } from '../../../data/countries';
import type { Country } from '../../../data/countries';

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
    <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight mb-6">
            Explora Nuestros
            <span className="block text-secondary">Servicios de Visa</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre la categoría de visa perfecta para tu viaje a Colombia. Filtra por tu país y requisitos para encontrar la mejor opción.
          </p>
        </div>

        {/* Popular Visas Section */}
        {popularVisas.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-primary mb-4">
                🌟 Categorías de Visa Populares
              </h3>
              <p className="text-lg text-gray-600">
                Nuestros servicios de visa más solicitados
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {popularVisas.slice(0, 4).map((visa: Visa) => (
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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                      Popular
                    </span>
                  </div>
                  
                  {visa.alcance && (
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      📋 {visa.alcance}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        Beneficiarios: {getBeneficiariesLabel(String(visa.beneficiaries))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        Permiso de Trabajo: {getWorkPermitLabel(String(visa.workPermit))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={`/${lang}/visas2/${visa.slug}`}
                      className="flex-1 inline-flex items-center justify-center text-secondary hover:text-primary font-medium text-sm transition-colors bg-white border border-secondary/20 rounded-lg px-3 py-2 hover:bg-secondary/5"
                    >
                      Saber más
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppContact(visa.title);
                      }}
                      className="inline-flex items-center justify-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors bg-green-50 border border-green-200 rounded-lg px-3 py-2 hover:bg-green-100"
                    >
                      💬 Contactar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className={`mb-12 p-6 rounded-xl border transition-all duration-300 ${
          isAnimating ? 'bg-secondary/10 border-secondary' : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País de Origen
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Visa
              </label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
              >
                <option value="">Todos los Tipos</option>
                <option value="visitor">Visitante (V)</option>
                <option value="migrant">Migrante (M)</option>
                <option value="resident">Residente (R)</option>
              </select>
            </div>

            {/* Beneficiaries Filter */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.checked)}
                  className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Permite Beneficiarios
                </span>
              </label>
            </div>

            {/* Work Permit Filter */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={workPermit}
                  onChange={(e) => setWorkPermit(e.target.checked)}
                  className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Permiso de Trabajo
                </span>
              </label>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(country || visaType || beneficiaries || workPermit) && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpiar Todos los Filtros
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Mostrando {displayedVisas.length} de {filteredVisas.length} categorías de visa
            </p>
          </div>
        </div>

        {/* All Visa Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVisas.map((visa: Visa) => (
            <div key={visa.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {visa.emoji && (
                    <span className="text-xl">{visa.emoji}</span>
                  )}
                  <h3 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors">
                    {visa.title}
                  </h3>
                </div>
                {visa.isPopular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    Popular
                  </span>
                )}
              </div>
              
              {visa.alcance && (
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  📋 {visa.alcance}
                </p>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    Beneficiarios: {getBeneficiariesLabel(String(visa.beneficiaries))}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    Permiso de Trabajo: {getWorkPermitLabel(String(visa.workPermit))}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={`/${lang}/visas2/${visa.slug}`}
                  className="flex-1 inline-flex items-center justify-center text-secondary hover:text-primary font-medium text-sm transition-colors bg-white border border-secondary/20 rounded-lg px-3 py-2 hover:bg-secondary/5"
                >
                  Saber más
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsAppContact(visa.title);
                  }}
                  className="inline-flex items-center justify-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors bg-green-50 border border-green-200 rounded-lg px-3 py-2 hover:bg-green-100"
                >
                  💬 Contactar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {hasMoreVisas && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              disabled={isLoading}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cargando...
                </div>
              ) : (
                `Mostrar ${filteredVisas.length - 9} Visas Más`
              )}
            </button>
          </div>
        )}

        {/* View All Visas Link */}
        <div className="text-center mt-12">
          <a
            href={`/${lang}/visas2`}
            className="inline-flex items-center text-secondary hover:text-primary font-medium text-lg transition-colors"
          >
            Ver Todas las Categorías de Visa
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
        </div>

        {/* No Results Message */}
        {filteredVisas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron visas</h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros para ver más opciones de visa.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
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