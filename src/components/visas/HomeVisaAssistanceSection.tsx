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
  category?: string;
  isFeatured?: boolean;
}

interface HomeVisaAssistanceSectionProps {
  visas: Visa[];
  guides: Guide[];
  lang?: 'en' | 'es';
}

const HomeVisaAssistanceSection = ({ visas = [], guides = [], lang = 'en' }: HomeVisaAssistanceSectionProps) => {
  // Debug: Log the data being received
  console.log('HomeVisaAssistanceSection received:', { 
    totalVisas: visas.length, 
    popularVisas: visas.filter(v => v.isPopular).length,
    sampleVisa: visas[0]
  });
  
  // Modal state
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Content based on language
  const content = lang === 'es' ? {
    title: "Asistencia de Visa",
    subtitle: "Servicios Legales Integrales",
    description: "Como abogados no solo nos enfocamos en tu papeleo. Nos procuramos entender tus necesidades y riesgos legales al mudarte al extranjero para asegurar tu mejor estrategia con la mayor tasa de éxito posible.",
    explorePopular: "Explora algunas visas populares",
    discoverAll: "Descubrir todas las categorías de visa",
    guides: "Guías y Recursos",
    viewAllGuides: "Ver todas las guías",
    legalExpertise: "Experiencia Legal",
    documentPreparation: "Preparación de Documentos",
    familyApplications: "Solicitudes Familiares",
    popularTitle: "🌟 Categorías de visa populares",
    popularSubtitle: "Nuestros servicios de visa más solicitados",
    viewDetails: "Ver detalles",
    readGuide: "Leer guía",
    popular: "Popular",
    guide: "Guía"
  } : {
    title: "Visa Assistance",
    subtitle: "Comprehensive Legal Services",
    description: "As attorneys we not only focus on your paperwork. We procure to understand your needs and legal risks when moving abroad to ensure your best strategy with the highest success rate possible.",
    explorePopular: "Explore some popular visas",
    discoverAll: "Discover all visa categories",
    guides: "Guides & Resources",
    viewAllGuides: "View all guides",
    legalExpertise: "Legal Expertise",
    documentPreparation: "Document Preparation",
    familyApplications: "Family Applications",
    popularTitle: "🌟 Popular Visa Categories",
    popularSubtitle: "Our most requested visa services",
    viewDetails: "View details",
    readGuide: "Read guide",
    popular: "Popular",
    guide: "Guide"
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
      title: lang === 'es' ? "Asesoría Experta" : "Expert Guidance",
      description: lang === 'es' ? "Asistencia legal profesional durante todo el proceso" : "Professional legal assistance throughout the process"
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Procesamiento Rápido" : "Fast Processing",
      description: lang === 'es' ? "Manejo eficiente para minimizar tiempos de espera" : "Efficient handling to minimize waiting times"
    },
    {
      icon: <ComputerDesktopIcon className="w-6 h-6" />,
      title: lang === 'es' ? "100% Virtual y Personalizado" : "100% Virtual & Personalized",
      description: lang === 'es' ? "Proceso completo en línea adaptado a tus necesidades" : "Complete online process tailored to your needs"
    }
  ];

  // Filter popular visas
  const popularVisas = visas.filter(v => v.isPopular);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {content.subtitle}
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {topFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Popular Visas Section */}
        {popularVisas.length > 0 && (
          <div className="mb-16">
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
                <div key={visa.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => openModal(visa)}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{visa.emojis?.[0] || '📋'}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {content.popular}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {visa.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {visa.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {visa.beneficiaries !== undefined && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {getBeneficiariesLabel(visa.beneficiaries)}
                      </span>
                    )}
                    {visa.workPermit !== undefined && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {getWorkPermitLabel(visa.workPermit)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                    {content.viewDetails}
                    <EyeIcon className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <a 
                href={`/${lang}/visas`}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {content.discoverAll}
              </a>
            </div>
          </div>
        )}

        {/* Guides Section */}
        {guides.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {content.guides}
              </h3>
              <p className="text-gray-600">
                {lang === 'es' ? 'Recursos útiles para tu proceso de visa' : 'Useful resources for your visa process'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.slice(0, 3).map((guide) => (
                <div key={guide.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <DocumentTextIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {content.guide}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {guide.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {guide.description}
                  </p>
                  <a 
                    href={`/${lang}/guides/${guide.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    {content.readGuide}
                    <EyeIcon className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <a 
                href={`/${lang}/guides`}
                className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
              >
                {content.viewAllGuides}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedVisa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedVisa.emojis?.[0] || '📋'}</span>
                <h3 className="text-2xl font-bold text-gray-900">{selectedVisa.title}</h3>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">{selectedVisa.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedVisa.beneficiaries !== undefined && (
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {getBeneficiariesLabel(selectedVisa.beneficiaries)}
                </span>
              )}
              {selectedVisa.workPermit !== undefined && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {getWorkPermitLabel(selectedVisa.workPermit)}
                </span>
              )}
            </div>
            
            <div className="flex gap-4">
              <a 
                href={`/${lang}/visas/${selectedVisa.slug}`}
                className="flex-1 bg-primary text-white text-center py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {content.viewDetails}
              </a>
              <button 
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeVisaAssistanceSection; 