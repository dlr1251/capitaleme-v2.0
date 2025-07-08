// This is a copy of the original HomePageVisas.tsx for use only in /visas route.
// The code is unchanged from the original HomePageVisas.tsx.

import { useState, useEffect } from 'react';
import { countries } from 'data/countries.js';
import type { Country } from 'data/countries.js';
import Fuse from 'fuse.js';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

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
  const [country, setCountry] = useState(lang === 'es' ? 'Estados Unidos de América' : 'United States');
  const [visaType, setVisaType] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(false);
  const [workPermit, setWorkPermit] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [joyrideRun, setJoyrideRun] = useState(false);
  const joyrideSteps: Step[] = [
    {
      target: '#country-filter',
      content: (
        <div className="text-primary">
          <b>Country of Origin</b><br/>
          The country you select determines which visas are available to you. Some visas are only available to citizens of certain countries.
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '#beneficiaries-filter',
      content: (
        <div className="text-primary">
          <b>Beneficiaries</b><br/>
          Not all visas allow beneficiaries. Beneficiaries are your spouse or partner and children under 25 who are economically dependent on you.
        </div>
      ),
    },
    {
      target: '#workpermit-filter',
      content: (
        <div className="text-primary">
          <b>Work Permit</b><br/>
          This filter shows visas that allow you to be employed by Colombian companies under a labor law contract.
        </div>
      ),
    },
    {
      target: '#search-bar',
      content: (
        <div className="text-primary">
          <b>Search</b><br/>
          Use this bar to filter visas by name, description, or category. Combine with filters for best results.
        </div>
      ),
    },
  ];

  // Fuse.js setup
  const fuse = new Fuse(visas, {
    keys: ['title', 'description', 'category'],
    threshold: 0.3,
    minMatchCharLength: 2,
  });

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

    // Filter by country
    if (country) {
      // Find the country object
      const countryInfo = countries.find((info: Country) => info.name === country || info.nameEn === country);
      // Get the country code for filtering
      let countryCode = '';
      if (countryInfo) {
        countryCode = lang === 'es' ? countryInfo.name : countryInfo.nameEn;
      }
      if (countryCode) {
        filtered = filtered.filter(visa => {
          // Accept 'All' as a wildcard for all countries
          return visa.countries.includes(countryCode) || visa.countries.includes('All');
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

    // Fuse.js search (applied last, so it always narrows down the filtered set)
    if (searchQuery.trim().length > 1) {
      const fuseFiltered = new Fuse(filtered, {
        keys: ['title', 'description', 'category'],
        threshold: 0.3,
        minMatchCharLength: 2,
      });
      filtered = fuseFiltered.search(searchQuery).map((result: { item: Visa }) => result.item);
    }

    // Sort visas
    filtered = sortVisas(filtered);

    setFilteredVisas(filtered);
    setShowAll(false); // Reset showAll when filters/search change
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [country, visaType, beneficiaries, workPermit, visas, searchQuery]);

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

  // Show more/less logic
  const displayedVisas = showAll ? filteredVisas : filteredVisas.slice(0, 9);
  const hasMoreVisas = filteredVisas.length > 9;

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
      <Joyride
        steps={joyrideSteps}
        run={joyrideRun}
        continuous
        showSkipButton
        showProgress
        disableScrolling={true}
        styles={{
          options: {
            backgroundColor: '#fff',
            primaryColor: '#16345F', // primary
            textColor: '#222',
            zIndex: 10000,
            overlayColor: 'rgba(22,52,95,0.1)',
          },
          buttonClose: { color: '#16345F' },
          buttonNext: { background: '#16345F', color: '#fff' },
          buttonBack: { color: '#16345F' },
          tooltip: { border: '1px solid #16345F', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
        }}
        locale={{ last: 'Finish', skip: 'Skip', next: 'Next', back: 'Back' }}
        callback={(data: CallBackProps) => {
          if (data.status === 'finished' || data.status === 'skipped') setJoyrideRun(false);
        }}
      />
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
            <div className="mt-6 max-w-2xl mx-auto text-base text-gray-800 bg-primary-50 border border-primary-200 rounded-lg p-5 shadow-sm">
              <div className="mb-2 font-semibold text-primary-700 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                How to use the Visa Finder
              </div>
              <ol className="list-decimal list-inside text-base text-gray-700 space-y-1">
                <li><b>Country:</b> Select your country of origin to see visas relevant to your nationality.</li>
                <li><b>Visa Type:</b> Filter by visa type (V, M, R, etc.) to narrow down categories.</li>
                <li><b>Beneficiaries/Work Permit:</b> Use the checkboxes to show only visas that allow beneficiaries or work permits.</li>
                <li><b>Search:</b> Use the search bar below to find visas by name, description, or category. The search works instantly as you type and combines with the filters above.</li>
                <li><b>Show More:</b> If there are many results, click "Show more visas" to see all. Click "Show less" to collapse the list.</li>
              </ol>
              <div className="mt-2 text-sm text-primary-700">Tip: You can combine filters and search for best results!</div>
            </div>
          </div>
        )}




        {/* Filters Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">
            {content.filterTitle}
          </h3>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
            {/* Joyride Help Button (top-right of filter card) */}
            <button
              className="absolute top-4 right-4 z-20 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-secondary transition-colors flex items-center"
              onClick={() => setJoyrideRun(true)}
              aria-label="Show tutorial"
              style={{ boxShadow: '0 2px 8px rgba(22,52,95,0.12)' }}
            >
              <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Country Filter */}
              <div id="country-filter">
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
              <div className="flex items-center" id="beneficiaries-filter">
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
              <div className="flex items-center" id="workpermit-filter">
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

            {/* Clear Filters Button - small, right-aligned */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300 transition-colors"
                style={{ minWidth: 0 }}
              >
                {content.clearFilters}
              </button>
            </div>
          </div>
        </div>

          {/* Search Bar */}
          <div className="mb-10 flex justify-center" id="search-bar">
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar visas...' : 'Search visas...'}
            className="w-full max-w-xl px-6 py-3 rounded-full border border-gray-300 shadow focus:ring-2 focus:ring-primary focus:border-primary text-lg transition-all duration-200 bg-white placeholder-gray-400"
            style={{ fontWeight: 500 }}
            autoComplete="off"
            spellCheck={false}
          />
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
              <a
                key={visa.id}
                href={`/${lang}/visas/${visa.slug}`}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block focus:outline-none focus:ring-2 focus:ring-primary"
                tabIndex={0}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {visa.emoji && (
                      <span className="text-2xl">{visa.emoji}</span>
                    )}
                    <h4 className="text-lg font-semibold text-primary">
                      {visa.title}
                    </h4>
                    {visa.isPopular && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">Popular</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {visa.description}
                </p>
                <div className="text-xs text-primary font-medium mb-2">
                  {visa.alcance && (
                    <span>{lang === 'es' ? 'Alcance: ' : 'Scope: '}{visa.alcance}</span>
                  )}
                </div>
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
                  <span className="text-primary hover:text-secondary font-medium text-sm underline group-hover:no-underline">
                    {lang === 'es' ? 'Ver detalles' : 'View details'}
                  </span>
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); handleWhatsAppContact(visa.title); }}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
                  >
                    <span>💬</span>
                    {content.contactWhatsApp}
                  </button>
                </div>
              </a>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMoreVisas && (
            <div className="text-center mt-8">
              {!showAll ? (
                <button
                  onClick={() => setShowAll(true)}
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {lang === 'es' ? 'Cargando...' : 'Loading...'}
                    </span>
                  ) : (
                    lang === 'es' ? 'Ver más visas' : 'Show more visas'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {lang === 'es' ? 'Ver menos' : 'Show less'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VisasSectionFilterSearch; 