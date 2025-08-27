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
    withBeneficiaries: '✅ Spouse & Children',
    withoutBeneficiaries: '❌ No beneficiaries',
    noWorkPermit: 'No work permit',
    openWorkPermit: '💼 Open work permit',
    authorizedActivity: '✅ Authorized activity',
    withoutWorkPermit: '❌ No work permit',
    whatsappMessage: 'Hello! I was reviewing the website and want to discuss the visa category',
    canHelp: 'Can you help me with more information?'
  };

  // Funciones auxiliares para chips
  const getBeneficiariesLabel = (beneficiaries: string | boolean | undefined, lang: string) => {
    if (typeof beneficiaries === 'string') {
      const val = beneficiaries.trim().toLowerCase();
      if (lang === 'es') {
        if (val === 'yes' || val === 'sí' || val === 'si') return content.withBeneficiaries;
        if (val === 'no') return content.withoutBeneficiaries;
        return beneficiaries;
      } else {
        if (val === 'yes') return content.withBeneficiaries;
        if (val === 'no') return content.withoutBeneficiaries;
        return beneficiaries;
      }
    }
    if (typeof beneficiaries === 'boolean') {
      if (lang === 'es') {
        return beneficiaries ? content.withBeneficiaries : content.withoutBeneficiaries;
      } else {
        return beneficiaries ? content.withBeneficiaries : content.withoutBeneficiaries;
      }
    }
    return '';
  };

  const getWorkPermitLabel = (workPermit: string | boolean | undefined, lang: string) => {
    if (typeof workPermit === 'string') {
      const val = workPermit.trim().toLowerCase();
      if (lang === 'es') {
        if (val === 'yes' || val === 'sí' || val === 'si') return content.openWorkPermit;
        if (val === 'no') return content.withoutWorkPermit;
        return workPermit;
      } else {
        if (val === 'yes') return content.openWorkPermit;
        if (val === 'no') return content.withoutWorkPermit;
        return workPermit;
      }
    }
    if (typeof workPermit === 'boolean') {
      if (lang === 'es') {
        return workPermit ? content.openWorkPermit : content.withoutWorkPermit;
      } else {
        return workPermit ? content.openWorkPermit : content.withoutWorkPermit;
      }
    }
    return '';
  };

  // Handle WhatsApp contact
  const handleWhatsAppContact = (visaTitle: string) => {
    const message = `${content.whatsappMessage} "${visaTitle}". ${content.canHelp}`;
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle show more/less
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  // Get unique countries and visa types
  const uniqueCountries = useMemo(() => {
    const countrySet = new Set<string>();
    visas.forEach(visa => {
      if (visa.country) countrySet.add(visa.country);
      if (visa.countries && Array.isArray(visa.countries)) {
        visa.countries.forEach(c => countrySet.add(c));
      }
    });
    return Array.from(countrySet).sort();
  }, [visas]);

  const uniqueVisaTypes = useMemo(() => {
    const typeSet = new Set<string>();
    visas.forEach(visa => {
      if (visa.category) typeSet.add(visa.category);
    });
    return Array.from(typeSet).sort();
  }, [visas]);

  // Apply filters
  useEffect(() => {
    let results = visas;

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      results = searchResults.map(result => result.item);
    }

    // Apply country filter
    if (country) {
      results = results.filter(visa => 
        visa.country === country || 
        (visa.countries && visa.countries.includes(country))
      );
    }

    // Apply visa type filter
    if (visaType) {
      results = results.filter(visa => visa.category === visaType);
    }

    // Apply beneficiaries filter
    if (beneficiaries) {
      if (beneficiaries === 'yes') {
        results = results.filter(visa => 
          typeof visa.beneficiaries === 'string' 
            ? visa.beneficiaries.toLowerCase().includes('yes') 
            : visa.beneficiaries === true
        );
      } else if (beneficiaries === 'no') {
        results = results.filter(visa => 
          typeof visa.beneficiaries === 'string' 
            ? visa.beneficiaries.toLowerCase().includes('no') 
            : visa.beneficiaries === false
        );
      }
    }

    // Apply work permit filter
    if (workPermit) {
      if (workPermit === 'yes') {
        results = results.filter(visa => 
          typeof visa.workPermit === 'string' 
            ? visa.workPermit.toLowerCase().includes('yes') 
            : visa.workPermit === true
        );
      } else if (workPermit === 'no') {
        results = results.filter(visa => 
          typeof visa.workPermit === 'string' 
            ? visa.workPermit.toLowerCase().includes('no') 
            : visa.workPermit === false
        );
      }
    }

    setFilteredVisas(results);
  }, [visas, searchQuery, country, visaType, beneficiaries, workPermit, fuse]);

  // Clear all filters
  const clearFilters = () => {
    setCountry('');
    setVisaType('');
    setBeneficiaries('');
    setWorkPermit('');
    setSearchQuery('');
  };

  // Get displayed visas (popular + regular with pagination)
  const displayedVisas = useMemo(() => {
    if (showAll) {
      return [...popularVisas, ...regularVisas];
    }
    return [...popularVisas, ...regularVisas.slice(0, 6)];
  }, [popularVisas, regularVisas, showAll]);

  const hasMoreVisas = regularVisas.length > 6;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro Section */}
        {intro && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {content.subtitle}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        )}

        {/* Popular Visas Section */}
        {popularVisas.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {content.popularTitle}
              </h3>
              <p className="text-gray-600">
                {content.popularSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularVisas.slice(0, 6).map((visa) => (
                <div key={visa.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{visa.emoji || '📋'}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {lang === 'es' ? 'Popular' : 'Popular'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {visa.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {visa.description}
                  </p>
                  <a 
                    href={`/${lang}/visas/${visa.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    {lang === 'es' ? 'Ver detalles' : 'View details'}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {content.filterTitle}
            </h3>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.countryLabel}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{lang === 'es' ? 'Todos los países' : 'All countries'}</option>
                  {uniqueCountries.map(countryName => (
                    <option key={countryName} value={countryName}>{countryName}</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{lang === 'es' ? 'Todos los tipos' : 'All types'}</option>
                  {uniqueVisaTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Beneficiaries Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.beneficiariesLabel}
                </label>
                <select
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{lang === 'es' ? 'Cualquiera' : 'Any'}</option>
                  <option value="yes">{lang === 'es' ? 'Con beneficiarios' : 'With beneficiaries'}</option>
                  <option value="no">{lang === 'es' ? 'Sin beneficiarios' : 'Without beneficiaries'}</option>
                </select>
              </div>

              {/* Work Permit Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.workPermitLabel}
                </label>
                <select
                  value={workPermit}
                  onChange={(e) => setWorkPermit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{lang === 'es' ? 'Cualquiera' : 'Any'}</option>
                  <option value="yes">{lang === 'es' ? 'Con permiso de trabajo' : 'With work permit'}</option>
                  <option value="no">{lang === 'es' ? 'Sin permiso de trabajo' : 'Without work permit'}</option>
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'es' ? 'Buscar visas...' : 'Search visas...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            {/* Clear Filters Button */}
            {(country || visaType || beneficiaries || workPermit || searchQuery) && (
              <div className="mt-4 text-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {content.clearFilters}
                </button>
              </div>
            )}

            {/* Search Help Tooltip */}
            {searchQuery && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  <QuestionMarkCircleIcon className="w-4 h-4" />
                  {lang === 'es' 
                    ? 'Use this bar to filter visas by name, description, or category. Combine with filters for best results.'
                    : 'Use this bar to filter visas by name, description, or category. Combine with filters for best results.'}
                </div>
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
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block focus:outline-none focus:ring-2 focus:ring-primary p-3 h-full min-h-[260px] flex flex-col relative"
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
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488"/>
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
                className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors font-medium"
              >
                {showAll ? content.showLess : content.showMore}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>    
  );
};

export default VisasSectionFilterSearch; 