import React, { useEffect, useState } from 'react';
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

// Visa and Guide types
interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPopular: boolean;
  emoji: string;
}

interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  lastEdited: string;
}

interface HomeVisaAssistanceSectionProps {
  visas: Visa[];
  guides: Guide[];
  lang?: 'en' | 'es';
}

const HomeVisaAssistanceSection = ({ visas = [], guides = [], lang = 'en' }: HomeVisaAssistanceSectionProps) => {
  // Filter popular visas
  const popularVisas = visas.filter(v => v.isPopular);

  // Top section features (4 cards)
  const topFeatures = [
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Precios Transparentes" : "Transparent Pricing",
      description: lang === 'es' ? "Costos claros sin tarifas ocultas" : "Clear costs with no hidden fees"
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Orientación Experta" : "Expert Guidance",
      description: lang === 'es' ? "Asistencia legal profesional durante todo el proceso" : "Professional legal assistance throughout the process"
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Procesamiento Rápido" : "Fast Processing",
      description: lang === 'es' ? "Manejo eficiente para minimizar los tiempos de espera" : "Efficient handling to minimize waiting times"
    },
    {
      icon: <ComputerDesktopIcon className="w-6 h-6" />,
      title: lang === 'es' ? "100% Virtual y Personalizado" : "100% Virtual & Personalized",
      description: lang === 'es' ? "Proceso completo en línea adaptado a tus necesidades" : "Complete online process tailored to your needs"
    }
  ];

  // Content based on language
  const content = lang === 'es' ? {
    title: "Tu solicitud de visa",
    subtitle: "hecha simple",
    tagline: "Hacemos las visas con asesoría legal integral",
    description: "Como abogados no solo nos enfocamos en tu papeleo. Procuramos entender tus necesidades y riesgos legales al mudarte al extranjero para asegurar tu mejor estrategia con la mayor tasa de éxito posible.",
    explorePopular: "Explora algunas visas populares",
    discoverAll: "Descubrir todas las categorías de visa",
    guides: "Guías y Recursos",
    viewAllGuides: "Ver todas las guías",
    legalExpertise: "Experiencia Legal",
    documentPreparation: "Preparación de Documentos",
    familyApplications: "Solicitudes Familiares"
  } : {
    title: "Your visa application",
    subtitle: "made simple",
    tagline: "We do visas with comprehensive legal advice",
    description: "As attorneys we not only focus on your paperwork. We procure to understand your needs and legal risks when moving abroad to ensure your best strategy with the highest success rate possible.",
    explorePopular: "Explore some popular visas",
    discoverAll: "Discover all visa categories",
    guides: "Guides & Resources",
    viewAllGuides: "View all guides",
    legalExpertise: "Legal Expertise",
    documentPreparation: "Document Preparation",
    familyApplications: "Family Applications"
  };

  return (
    <section className="relative bg-secondary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-px h-32 bg-gradient-to-b from-blue-400/20 to-transparent"></div>
        <div className="absolute bottom-20 right-1/4 w-px h-32 bg-gradient-to-b from-purple-400/20 to-transparent"></div>
        <div className="absolute top-1/2 left-10 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-20 w-1 h-1 bg-blue-400/40 rounded-full animate-ping"></div>
      </div>
      
      {/* Top Section - Two Columns */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {content.title}
              <span className="block text-primary">{content.subtitle}</span>
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                {content.tagline}
              </h2>
              <p className="text-xl text-white/80 font-light">
                {content.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-white">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-white" />
                {content.legalExpertise}
              </div>
              <div className="flex items-center text-white">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-white" />
                {content.documentPreparation}
              </div>
              <div className="flex items-center text-white">
                <UserGroupIcon className="w-5 h-5 mr-2 text-white" />
                {content.familyApplications}
              </div>
            </div>
          </div>
          
          {/* Right Column - Popular Visas */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">{content.explorePopular}</h3>
                </div>
                
                {/* Popular Visas List */}
                <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {popularVisas.slice(0, 7).map((visa, idx) => (
                    <div key={visa.id || idx} className="group bg-white/5 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 border border-white/10">
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 text-2xl flex items-center justify-center">
                          {visa.emoji || (idx % 2 === 0 ? '🛂' : '🌎')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{visa.title}</h4>
                          <p className="text-white/70 text-xs line-clamp-2 mb-2">{visa.description}</p>
                          <a 
                            href={`/${lang}/visas/${visa.slug}`} 
                            className="inline-block px-3 py-1 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 text-xs font-medium"
                          >
                            {lang === 'es' ? 'Ver detalles' : 'View details'}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Discover All Button */}
                <div className="text-center pt-4">
                  <a 
                    href={`/${lang}/visas`}
                    className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 font-medium backdrop-blur-sm"
                  >
                    {content.discoverAll}
                    <EyeIcon className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Top Features (4 cards) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/30 rounded-lg flex items-center justify-center group-hover:bg-blue-600/50 transition-colors duration-300">
                  <div className="text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200/80 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - Guides (4 cards) */}
      {guides.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">{content.guides}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {guides.slice(0, 4).map((guide, idx) => (
              <div key={guide.id || idx} className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                    {content.guides.slice(0, 5)}
                  </span>
                  <span className="text-xs text-white/60">
                    {new Date(guide.lastEdited || Date.now()).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <a className="block group-hover:text-white transition-colors duration-300" href={`/${lang}/guides/${guide.slug}`}>
                  <h4 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-white transition-colors duration-300">
                    {guide.title}
                  </h4>
                </a>
                
                <p className="text-white/80 mb-4 line-clamp-3">{guide.description}</p>
                
                <a 
                  href={`/${lang}/guides/${guide.slug}`} 
                  className="inline-block px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 text-sm font-semibold backdrop-blur-sm"
                >
                  {lang === 'es' ? 'Ver guía' : 'View guide'}
                </a>
              </div>
            ))}
          </div>
          
          {/* View All Guides Button */}
          <div className="text-center">
            <a 
              href={`/${lang}/guides`}
              className="inline-flex items-center px-8 py-4 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 font-medium backdrop-blur-sm"
            >
              {content.viewAllGuides}
              <SparklesIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeVisaAssistanceSection; 