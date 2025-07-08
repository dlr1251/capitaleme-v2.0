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
  emojis: string[];
  alcance?: string;
  beneficiaries?: boolean;
  workPermit?: boolean;
  duration?: string;
}

interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  lastEdited: string;
  excerpt?: string;
}

interface HomeVisaAssistanceSectionProps {
  visas: Visa[];
  guides: Guide[];
  lang?: 'en' | 'es';
}

const HomeVisaAssistanceSection = ({ visas = [], guides = [], lang = 'en' }: HomeVisaAssistanceSectionProps) => {
  // Modal state
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter popular visas
  const popularVisas = visas.filter(v => v.isPopular);

  // Helper: beneficiaries label
  const getBeneficiariesLabel = (beneficiaries: boolean | undefined) => {
    if (lang === 'es') {
      if (beneficiaries === true) return '✅ Cónyuge e hijos';
      if (beneficiaries === false) return '❌ Sin beneficiarios';
      return 'Sin beneficiarios';
    } else {
      if (beneficiaries === true) return '✅ Spouse & Children';
      if (beneficiaries === false) return '❌ No beneficiaries';
      return 'No beneficiaries';
    }
  };
  // Helper: work permit label
  const getWorkPermitLabel = (workPermit: boolean | undefined) => {
    if (lang === 'es') {
      if (workPermit === true) return '💼 Permiso de trabajo';
      if (workPermit === false) return '❌ Sin permiso de trabajo';
      return 'Sin permiso de trabajo';
    } else {
      if (workPermit === true) return '💼 Work permit';
      if (workPermit === false) return '❌ No work permit';
      return 'No work permit';
    }
  };

  // Modal open/close handlers
  const openModal = (visa: Visa) => {
    setSelectedVisa(visa);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVisa(null);
    document.body.style.overflow = 'unset';
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

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
      title: lang === 'es' ? "Personalizado" : "Personalized",
      description: lang === 'es' ? "Proceso completo en línea adaptado a tus necesidades" : "Complete online personalized process"
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

  useEffect(() => {
    if (isModalOpen && selectedVisa) {
    }
  }, [isModalOpen, selectedVisa]);

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
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {content.title}
              <span className="block text-primary">{content.subtitle}</span>
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
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
            <div className="bg-white rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-primary mb-2">{content.explorePopular}</h3>
                </div>
                
                {/* Popular Visas List */}
                <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
                  {popularVisas.slice(0, 7).map((visa, idx) => {
                    return (
                      <div
                        key={visa.id || idx}
                        className="group bg-secondary rounded-2xl p-4 border border-white/10 cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
                        onClick={() => { openModal(visa); }}
                        tabIndex={0}
                        role="button"
                        aria-label={visa.title}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { openModal(visa); } }}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 flex flex-col w-10 h-24 rounded-xl bg-white/10 text-2xl items-center justify-center gap-1">
                            {(visa.emojis && visa.emojis.length > 0
                              ? visa.emojis
                              : [undefined, undefined, undefined]
                            ).map((emoji, i) => (
                              <span key={i} className="text-2xl leading-none text-center">{emoji || ''}</span>
                            ))}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{visa.title}</h4>
                            {visa.alcance && (
                              <div className="text-xs text-white/80 mb-1">📋 {visa.alcance}</div>
                            )}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {getBeneficiariesLabel(visa.beneficiaries)}
                              </span>
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {getWorkPermitLabel(visa.workPermit)}
                              </span>
                            </div>
                            <p className="text-primary/70 text-xs line-clamp-2 mb-2">{visa.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Show All Visas Button */}
                <div className="pt-6">
                  <a
                    href={`/${lang}/visas`}
                    className="block w-full text-center py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{letterSpacing: '0.02em'}}
                  >
                    {lang === 'es' ? 'Ver todas las visas' : 'View all visas'}
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
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 justify-center items-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center transition-colors duration-300">
                  <div className="text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white text-sm">
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
            <h3 className="text-3xl font-bold text-white mb-4">Guides</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {guides.slice(0, 4).map((guide, idx) => (
              <a
                key={guide.id || idx}
                href={`/${lang}/guides/${guide.slug}`}
                className="group block bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                tabIndex={0}
                aria-label={guide.title}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-white/60">
                    {new Date(guide.lastEdited || Date.now()).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-white transition-colors duration-300">
                  {guide.title}
                </h4>
                <p className="text-white/80 mb-4 line-clamp-3">
                  {guide.excerpt || (guide.description?.slice(0, 160) + (guide.description && guide.description.length > 160 ? '…' : ''))}
                </p>
              </a>
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

      {/* Modal for Visa Details */}
      {isModalOpen && selectedVisa && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={handleBackdropClick}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto modal-content relative" tabIndex={0}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
              autoFocus
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex flex-col w-10 h-24 gap-1 text-3xl justify-center items-center">
                  {(selectedVisa.emojis && selectedVisa.emojis.length > 0
                    ? selectedVisa.emojis
                    : [undefined, undefined, undefined]
                  ).map((emoji, i) => (
                    <span key={i} className="text-3xl leading-none text-center">{emoji || ''}</span>
                  ))}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">{selectedVisa.title}</h2>
              </div>
              {selectedVisa.alcance && (
                <div className="mb-2 text-gray-700 text-sm">📋 <span className="font-medium">{selectedVisa.alcance}</span></div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {getBeneficiariesLabel(selectedVisa.beneficiaries)}
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {getWorkPermitLabel(selectedVisa.workPermit)}
                </span>
                {selectedVisa.duration && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    ⏳ {selectedVisa.duration}
                  </span>
                )}
              </div>
              <div className="mb-4 text-gray-700 text-base">
                {selectedVisa.description}
              </div>
              <a
                href={`/${lang}/visas/${selectedVisa.slug}`}
                className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang === 'es' ? 'Ir a la página de la visa' : 'Go to visa page'}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeVisaAssistanceSection; 