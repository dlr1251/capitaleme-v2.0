// This is a copy of the original HomePageVisas.tsx for use only in /visas route.
// The code is unchanged from the original HomePageVisas.tsx.

import { useState, useEffect, useMemo } from 'react';
import { countries } from 'data/countries.js';
import type { Country } from 'data/countries.js';
import Fuse from 'fuse.js';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button.tsx';
import Input from '../ui/Input.tsx';
import Card from '../ui/Card.tsx';

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

const VisasSectionFilterSearch = ({ visas = [], lang = 'es', intro = true }: VisasSectionLegacyProps) => {
  const [filteredVisas, setFilteredVisas] = useState(visas);
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  // Cambiar el estado de booleano a string para beneficiaries y workPermit
  const [beneficiaries, setBeneficiaries] = useState('');
  const [workPermit, setWorkPermit] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Remove tutorial overlay state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState<string | null>(null);
  
  // Fuse.js setup
  const fuse = new Fuse(visas, {
    keys: ['title', 'description', 'category'],
    threshold: 0.5,
    minMatchCharLength: 3,
  });

  // Separate popular visas
  const popularVisas = visas.filter(visa => visa.isPopular);
  const regularVisas = visas.filter(visa => !visa.isPopular);

  // Content based on language
  const content = lang === 'es' ? {
    title: 'Explora Nuestros',
    subtitle: 'Servicios de visa',
    description: 'Descubre la categoría de visa perfecta para tu viaje a Colombia. Filtra por tu país y requisitos para encontrar la mejor opción.',
    popularTitle: '🌟 Categorías de visa populares',
    popularSubtitle: 'Nuestros servicios de visa más solicitados',
    filterTitle: '🔍 Filtros de búsqueda',
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

  // Sorting: V types first, then M, then R, then alphabetically
  function sortVisas(visas: Visa[]) {
    return [...visas].sort((a, b) => {
      const getTypeOrder = (title: string) => {
        if (title.startsWith('V')) return 0;
        if (title.startsWith('M')) return 1;
        if (title.startsWith('R')) return 2;
        return 3;
      };
      const typeOrderA = getTypeOrder(a.title);
      const typeOrderB = getTypeOrder(b.title);
      if (typeOrderA !== typeOrderB) return typeOrderA - typeOrderB;
      return a.title.localeCompare(b.title);
    });
  }

  // Filter visas based on selected criteria and search
  useEffect(() => {
    let filtered = [...visas];

    // Improved Filter by country (VisaSidebarFilters logic)
    if (country) {
      // Find the country object
      const countryInfo = countries.find((info: Country) => info.name === country || info.nameEn === country);
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
          // If visa has no country restrictions (empty array), treat as ["Not exempted"]
          const effectiveVisaCountries = visaCountries.length === 0 ? ["Not exempted"] : visaCountries;

          // If visa has "All countries", it applies to everyone
          if (effectiveVisaCountries.includes("All countries") || effectiveVisaCountries.includes("All")) {
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
      filtered = filtered.filter(visa => {
        if (beneficiaries === 'yes') {
          return visa.beneficiaries === 'yes';
        } else if (beneficiaries === 'no') {
          return visa.beneficiaries === 'no';
        }
        return true;
      });
    }
    // Filter by work permit
    if (workPermit) {
      if (workPermit === 'yes') {
        filtered = filtered.filter(visa => visa.workPermit === 'yes');
      } else if (workPermit === 'no') {
        filtered = filtered.filter(visa => visa.workPermit === 'no');
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      const searchResultIds = new Set(searchResults.map(result => result.item.id));
      filtered = filtered.filter(visa => searchResultIds.has(visa.id));
    }

    // Sort the filtered results
    const sortedFiltered = sortVisas(filtered);
    setFilteredVisas(sortedFiltered);
  }, [country, visaType, beneficiaries, workPermit, searchQuery, visas, lang]);

  const clearFilters = () => {
    setCountry('');
    setVisaType('');
    // Cambiar el estado de booleano a string para beneficiaries y workPermit
    setBeneficiaries('');
    setWorkPermit('');
    setSearchQuery('');
  };

  const getBeneficiariesLabel = (beneficiaries: any) => {
    if (lang === 'es') {
      if (beneficiaries === 'yes' || beneficiaries === true) return '✅ Incluye cónyuge e hijos';
      if (beneficiaries === 'no' || beneficiaries === false) return '❌ No incluye beneficiarios';
      return 'Sin información de beneficiarios';
    } else {
      if (beneficiaries === 'yes' || beneficiaries === true) return '✅ Includes spouse & children';
      if (beneficiaries === 'no' || beneficiaries === false) return '❌ No beneficiaries included';
      return 'No beneficiary information';
    }
  };

  const getWorkPermitLabel = (workPermit: any) => {
    if (lang === 'es') {
      if (workPermit === 'yes' || workPermit === true || workPermit === 'Open work permit' || workPermit === 'Work permit') return '💼 Permiso de trabajo';
      if (workPermit === 'no' || workPermit === false || workPermit === 'No work permit') return '❌ Sin permiso de trabajo';
      return 'Sin información de permiso de trabajo';
    } else {
      if (workPermit === 'yes' || workPermit === true || workPermit === 'Open work permit' || workPermit === 'Work permit') return '💼 Work permit';
      if (workPermit === 'no' || workPermit === false || workPermit === 'No work permit') return '❌ No work permit';
      return 'No work permit information';
    }
  };

  const handleShowMore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowAll(!showAll);
      setIsAnimating(false);
    }, 150);
  };

  const handleWhatsAppContact = (visaTitle: string) => {
    const message = `${content.whatsappMessage} ${visaTitle}. ${content.canHelp}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573146022411?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Show more/less logic
  const displayedVisas = showAll ? filteredVisas : filteredVisas.slice(0, 9);
  const hasMoreVisas = filteredVisas.length > 9;

  // Memoized, deterministic, non-mutating sorted countries array
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', lang === 'es' ? 'es' : 'en')
    );
  }, [lang]);

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
        {/* Header */}
        {intro && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-6">
              {content.title}
              <span className="block text-secondary">{content.subtitle}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {content.description}
            </p>
            {/* Callout explicativo */}
            <div className="max-w-2xl mx-auto mb-8">
              <Card>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">🌍</span>
                  <div className="text-left text-primary-800 text-base">
                    {lang === 'es' ? (
                      <>
                        <b>¿Por qué es importante seleccionar tu país?</b><br />
                        El país de origen determina a qué visas puedes aplicar y si tienes exenciones o tratados especiales. Usa los filtros para encontrar la visa ideal según tu nacionalidad y necesidades. Puedes combinar los filtros para resultados más precisos.
                      </>
                    ) : (
                      <>
                        <b>Why is selecting your country important?</b><br />
                        Your country of origin determines which visas you can apply for and if you have exemptions or special treaties. Use the filters to find the best visa for your nationality and needs. You can combine filters for more precise results.
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">
            {content.filterTitle}
          </h3>
          {/* Fila minimalista de filtros */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3 w-full justify-center">
            {/* Country Filter */}
            <div className="flex-1 min-w-[160px] relative" id="country-filter">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {content.countryLabel}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                onFocus={() => setActiveTooltip('country')}
                onBlur={() => setActiveTooltip(null)}
                onMouseEnter={() => setActiveTooltip('country')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <option value="">{lang === 'es' ? 'Selecciona país de origen' : 'Select country of origin'}</option>
                {sortedCountries.map((countryInfo: Country) => (
                  <option key={countryInfo.name} value={lang === 'en' ? countryInfo.nameEn : countryInfo.name}>
                    {lang === 'en' ? countryInfo.nameEn : countryInfo.name}
                  </option>
                ))}
              </select>
              {activeTooltip === 'country' && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-700 z-50 w-64 max-w-[calc(100vw-2rem)]">
                  {lang === 'es'
                    ? 'El país de origen determina a qué visas puedes aplicar y si tienes exenciones o tratados especiales.'
                    : 'The country you select determines which visas are available to you. Some visas are only available to citizens of certain countries.'}
                </div>
              )}
            </div>
            {/* Visa Type Filter */}
            <div className="flex-1 min-w-[120px]" id="visa-type-filter">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {content.visaTypeLabel}
              </label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
              >
                <option value="">{lang === 'es' ? 'Todos los tipos' : 'All types'}</option>
                <option value="V">V - {lang === 'es' ? 'Visitante' : 'Visitor'}</option>
                <option value="M">M - {lang === 'es' ? 'Migrante' : 'Migrant'}</option>
                <option value="R">R - {lang === 'es' ? 'Residente' : 'Resident'}</option>                
              </select>
            </div>
            {/* Beneficiaries Filter */}
            <div className="flex-1 min-w-[120px] flex flex-col justify-end relative" id="beneficiaries-filter">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {content.beneficiariesLabel}
              </label>
              <select
                value={beneficiaries}
                onChange={e => setBeneficiaries(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                onFocus={() => setActiveTooltip('beneficiaries')}
                onBlur={() => setActiveTooltip(null)}
                onMouseEnter={() => setActiveTooltip('beneficiaries')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <option value="">{lang === 'es' ? 'Seleccionar' : 'Select'}</option>
                <option value="yes">{lang === 'es' ? 'Sí' : 'Yes'}</option>
                <option value="no">{lang === 'es' ? 'No' : 'No'}</option>
              </select>
              {activeTooltip === 'beneficiaries' && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-700 z-50 w-64 max-w-[calc(100vw-2rem)]">
                  {lang === 'es'
                    ? 'Este filtro muestra visas que permiten incluir a tu cónyuge e hijos en la solicitud.'
                    : 'This filter shows visas that allow you to include your spouse and children in the application.'}
                </div>
              )}
            </div>
            {/* Work Permit Filter */}
            <div className="flex-1 min-w-[120px] flex flex-col justify-end relative" id="workpermit-filter">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {content.workPermitLabel}
              </label>
              <select
                value={workPermit}
                onChange={e => setWorkPermit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                onFocus={() => setActiveTooltip('workpermit')}
                onBlur={() => setActiveTooltip(null)}
                onMouseEnter={() => setActiveTooltip('workpermit')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <option value="">{lang === 'es' ? 'Seleccionar' : 'Select'}</option>
                <option value="yes">{lang === 'es' ? 'Sí' : 'Yes'}</option>
                <option value="no">{lang === 'es' ? 'No' : 'No'}</option>
              </select>
              {activeTooltip === 'workpermit' && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-700 z-50 w-64 max-w-[calc(100vw-2rem)]">
                  {lang === 'es'
                    ? 'Este filtro muestra visas que permiten trabajar en Colombia bajo contrato laboral.'
                    : 'This filter shows visas that allow you to be employed by Colombian companies under a labor law contract.'}
                </div>
              )}
            </div>
            {/* Clear Filters Button */}
            <div className="flex items-center justify-end min-w-[100px]">
              <Button
                variant="subtle"
                size="sm"
                onClick={clearFilters}
                className="ml-2"
              >
                {content.clearFilters}
              </Button>
            </div>          
          </div>
        </div>
        {/* Search Bar debajo de los filtros */}
        <div className="mb-10 flex justify-center relative" id="search-bar">
          <div className="w-full max-w-xl">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar visas...' : 'Search visas...'}
              inputSize="md"
              className="font-medium"
              autoComplete="off"
              spellCheck={false}
              onFocus={() => setActiveTooltip('search')}
              onBlur={() => setActiveTooltip(null)}
              onMouseEnter={() => setActiveTooltip('search')}
              onMouseLeave={() => setActiveTooltip(null)}
            />
            {activeTooltip === 'search' && (
              <div className="absolute left-1/2 top-full ml-[-32px] mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-700 z-50 w-64 max-w-[calc(100vw-2rem)]">
                {lang === 'es'
                  ? 'Usa esta barra para filtrar visas por nombre, descripción o categoría. Puedes combinar con los filtros.'
                  : 'Use this bar to filter visas by name, description, or category. Combine with filters for best results.'}
              </div>
            )}
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
            {displayedVisas.map((visa, idx) => (
              <a
                key={visa.id}
                href={`/${lang}/visas/${visa.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block focus:outline-none focus:ring-2 focus:ring-primary p-3 h-full min-h-[260px] flex flex-col relative"
                tabIndex={0}
              >
                {/* Subtle index at top left (out of total results) */}
                <div className="absolute top-2 left-3 text-xs text-gray-400 font-medium z-10 bg-white/80 px-2 py-0.5 rounded">
                  {idx + 1} of {visas.length}
                </div>
                <div className="flex items-start gap-3 mb-2 mt-3">
                  <span className="text-3xl">{visa.emoji}</span>
                  <div className="flex-1 min-w-0 flex items-center justify-end">
                    <h4 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors line-clamp-1 text-right">
                      {visa.title}
                    </h4>                    
                  </div>
                </div>
                {/* Alcance de la visa */}
                <div className="mb-2 min-h-[2.25rem]">
                  {visa.alcance && (
                    <div className="text-sm text-slate-500 rounded p-2 font-medium w-full text-right">
                      {visa.alcance.slice(0, 250)} {visa.alcance.length > 250 && '...'}
                    </div>
                  )}
                </div>                
                <div className="flex-1" />
                {/* Bottom row: labels left, WhatsApp right */}
                <div className="flex items-end justify-between mt-2 pt-2 w-full">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeof visa.beneficiaries === 'string' && visa.beneficiaries.toLowerCase().includes('yes') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                      {getBeneficiariesLabel(visa.beneficiaries)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${visa.workPermit && visa.workPermit !== 'No work permit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                      {getWorkPermitLabel(visa.workPermit)}
                    </span>
                  </div>
                  <div className="relative flex items-end group/whatsapp">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWhatsAppContact(visa.title);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm"
                      style={{ minWidth: 40, minHeight: 40, justifyContent: 'center' }}
                      aria-label="Inquire about this visa category through WhatsApp"
                      type="button"
                      onMouseEnter={() => setShowWhatsAppPopup(visa.id)}
                      onMouseLeave={() => setShowWhatsAppPopup(null)}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </button>
                    {showWhatsAppPopup === visa.id && (
                      <div className="absolute bottom-12 right-0 bg-green-600 text-white text-xs rounded px-3 py-2 shadow-lg z-50 whitespace-nowrap max-w-[calc(100vw-2rem)]">
                        {lang === 'es' ? 'Consultar sobre esta categoría de visa por WhatsApp' : 'Inquire about this visa category through WhatsApp'}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMoreVisas && (
            <div className="text-center mt-8">
                <button
                onClick={handleShowMore}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                {showAll ? content.showLess : content.showMore}
                </button>
            </div>
          )}
        </div>
      </div>
    </section>    
  );
};

export default VisasSectionFilterSearch; 