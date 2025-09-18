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
  const [isAnimating, setIsAnimating] = useState(false);

  // Separate popular visas
  const popularVisas = visas.filter(visa => visa.isPopular);
  const regularVisas = visas.filter(visa => !visa.isPopular);

  // Content based on language
  const content = lang === 'es' ? {
    title: 'Explora Nuestros',
    subtitle: 'Servicios de visa',
    description: 'Descubre la categoría de visa perfecta para tu viaje a Colombia. Filtra por tu país para encontrar la mejor opción.',
    popularTitle: '🌟 Categorías de visa populares',
    popularSubtitle: 'Nuestros servicios de visa más solicitados',
    filterTitle: '🔍 Filtros de búsqueda',
    countryLabel: 'País de origen',
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
  } : {
    title: 'Explore Our',
    subtitle: 'Visa Services',
    description: 'Discover the perfect visa category for your trip to Colombia. Filter by your country to find the best option.',
    popularTitle: '🌟 Popular Visa Categories',
    popularSubtitle: 'Our most requested visa services',
    filterTitle: '🔍 Search Filters',
    countryLabel: 'Country of origin',
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
  };

  // Helpers copied from Home page cards for chips
  const getBeneficiariesLabel = (beneficiaries: string | undefined, currentLang: string) => {
    if (!beneficiaries) return '';
    const val = beneficiaries.trim().toLowerCase();
    if (currentLang === 'es') {
      if (val === 'yes' || val === 'sí' || val === 'si') return content.withBeneficiaries;
      if (val === 'no') return content.withoutBeneficiaries;
      return beneficiaries;
    } else {
      if (val === 'yes') return content.withBeneficiaries;
      if (val === 'no') return content.withoutBeneficiaries;
      return beneficiaries;
    }
  };

  const getWorkPermitLabel = (workPermit: string | undefined, currentLang: string) => {
    if (!workPermit) return '';
    const val = workPermit.trim().toLowerCase();
    if (currentLang === 'es') {
      if (val === 'yes' || val === 'sí' || val === 'si') return content.openWorkPermit;
      if (val === 'no') return content.withoutWorkPermit;
      return workPermit;
    } else {
      if (val === 'yes') return content.openWorkPermit;
      if (val === 'no') return content.withoutWorkPermit;
      return workPermit;
    }
  };

  // Apply country filter using the exact same logic as the single-visa sidebar
  useEffect(() => {
    let results = [...visas];

    if (country && country !== '') {
      const countryInfo = countries.find((info: Country) => (lang === 'en' ? (info.nameEn || info.name) : (info.name || info.nameEn)) === country);
      if (countryInfo) {
        const categories: string[] = [];
        if (countryInfo.excempted === 'Yes') categories.push('Exempted');
        if (countryInfo.excempted === 'No') categories.push('Not exempted');
        if (countryInfo.excempted === 'Schengen visa') categories.push('Schengen visa');
        if (countryInfo.treaties) categories.push(...countryInfo.treaties.split(', '));

        results = (results as any[]).filter((visa: any) => {
          const visaCountries = visa.countries || [];
          const effectiveVisaCountries = visaCountries.length === 0 ? ['Not exempted'] : visaCountries;

          if (effectiveVisaCountries.includes('All countries')) {
            return true;
          }

          const isExemptedCountry = categories.includes('Exempted');
          const isNotExemptedCountry = categories.includes('Not exempted');
          const isCAN = categories.includes('CAN');
          const isMercosur = categories.includes('Mercosur');
          const isWorkingHolidays = categories.includes('Working holidays');

          const hasExemptedVisa = effectiveVisaCountries.includes('Exempted') || effectiveVisaCountries.includes('Excempted');
          const hasNotExemptedVisa = effectiveVisaCountries.includes('Not exempted') || effectiveVisaCountries.includes('Not excempted');
          const hasCANVisa = effectiveVisaCountries.includes('CAN');
          const hasMercosurVisa = effectiveVisaCountries.includes('Mercosur');
          const hasWorkingHolidayVisa = effectiveVisaCountries.includes('Working holidays');

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

    setFilteredVisas(results);
  }, [visas, country, lang]);

  const clearFilters = () => {
    setCountry('');
  };

  // Displayed visas (no pagination; show filtered set). Keep popular ordering first.
  const displayedVisas = useMemo(() => {
    const filteredIds = new Set(filteredVisas.map(v => v.id));
    const popular = popularVisas.filter(v => filteredIds.has(v.id));
    const regular = regularVisas.filter(v => filteredIds.has(v.id));
    return [...popular, ...regular];
  }, [filteredVisas, popularVisas, regularVisas]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularVisas.slice(0, 6).map((visa) => (
                <a key={visa.id} href={`/${lang}/visas/${visa.slug}`} className="bg-white rounded p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group block">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-primary  group-hover:text-primary transition-colors">
                      {lang === 'es' ? `Visa ${visa.title}` : `${visa.title} Visa`}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {visa.beneficiaries && String(visa.beneficiaries).trim() !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {getBeneficiariesLabel(String(visa.beneficiaries), lang)}
                      </span>
                    )}
                    {visa.workPermit && String(visa.workPermit).trim() !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {getWorkPermitLabel(String(visa.workPermit), lang)}
                      </span>
                    )}
                  </div>
                  {visa.alcance && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-700">
                        {visa.alcance}
                      </p>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section - ONLY Country */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {content.filterTitle}
            </h3>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  {countries
                    .sort((a, b) => (lang === 'en' ? (a.nameEn || a.name).localeCompare(b.nameEn || b.name) : (a.name || a.nameEn).localeCompare(b.name || b.nameEn)))
                    .map((c: Country) => (
                      <option key={c.name} value={lang === 'en' ? (c.nameEn || c.name) : (c.name || c.nameEn)}>
                        {lang === 'en' ? (c.nameEn || c.name) : (c.name || c.nameEn)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {(country) && (
              <div className="mt-4 text-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {content.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-primary">
              {lang === 'es' ? 'Resultados' : 'Results'} ({displayedVisas.length})
            </h3>
          </div>

          {/* Visa Cards Grid - Styled like frontpage */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {displayedVisas.map((visa) => (
              <a
                key={visa.id}
                href={`/${lang}/visas/${visa.slug}`}
                className="bg-white rounded p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group block"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-primary  group-hover:text-primary transition-colors">
                    {lang === 'es' ? `Visa ${visa.title}` : `${visa.title} Visa`}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {visa.beneficiaries && String(visa.beneficiaries).trim() !== '' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {getBeneficiariesLabel(String(visa.beneficiaries), lang)}
                    </span>
                  )}
                  {visa.workPermit && String(visa.workPermit).trim() !== '' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {getWorkPermitLabel(String(visa.workPermit), lang)}
                    </span>
                  )}
                </div>
                {visa.alcance && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-700">
                      {visa.alcance}
                    </p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>    
  );
};

export default VisasSectionFilterSearch; 