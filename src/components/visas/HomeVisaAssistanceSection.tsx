import React, { useEffect, useState } from 'react';
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon,
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  BriefcaseIcon
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
  requirements?: string;
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
    sampleVisa: visas[0],
    allVisasData: visas.map(v => ({ id: v.id, title: v.title, isPopular: v.isPopular }))
  });
  
  // Modal state
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper: beneficiaries label with complete string
  const getBeneficiariesLabel = (beneficiaries: boolean | undefined) => {
    if (lang === 'es') {
      if (beneficiaries === true) return '✅ Incluye cónyuge e hijos';
      if (beneficiaries === false) return '❌ No incluye beneficiarios';
      return 'Sin información de beneficiarios';
    } else {
      if (beneficiaries === true) return '✅ Includes spouse & children';
      if (beneficiaries === false) return '❌ No beneficiaries included';
      return 'No beneficiary information';
    }
  };
  
  // Helper: work permit label with complete string
  const getWorkPermitLabel = (workPermit: boolean | undefined) => {
    if (lang === 'es') {
      if (workPermit === true) return '💼 Permiso de trabajo incluido';
      if (workPermit === false) return '❌ Sin permiso de trabajo';
      return 'Sin información de permiso de trabajo';
    } else {
      if (workPermit === true) return '💼 Work permit included';
      if (workPermit === false) return '❌ No work permit';
      return 'No work permit information';
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
    guide: "Guía",
    modal: {
      scope: "Alcance",
      requirements: "Requisitos específicos",
      duration: "Duración",
      close: "Cerrar"
    }
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
    guide: "Guide",
    modal: {
      scope: "Scope",
      requirements: "Specific requirements",
      duration: "Duration",
      close: "Close"
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
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Popular Visas Section */}
        {(popularVisas.length > 0 || visas.length > 0) && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {popularVisas.length > 0 ? content.popularTitle : (lang === 'es' ? '🌟 Categorías de Visa Disponibles' : '🌟 Available Visa Categories')}
              </h3>
              <p className="text-gray-600">
                {popularVisas.length > 0 ? content.popularSubtitle : (lang === 'es' ? 'Explora nuestras opciones de visa más relevantes' : 'Explore our most relevant visa options')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(popularVisas.length > 0 ? popularVisas : visas.slice(0, 6)).map((visa) => (
                <div key={visa.id} className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer" onClick={() => openModal(visa)}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{visa.emojis?.[0] || '📋'}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {visa.isPopular ? content.popular : (lang === 'es' ? 'Disponible' : 'Available')}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {visa.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {visa.description}
                  </p>
                  
                  {/* Scope Description */}
                  {visa.alcance && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">{content.modal.scope}:</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {visa.alcance}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {visa.beneficiaries !== undefined && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {getBeneficiariesLabel(visa.beneficiaries)}
                      </span>
                    )}
                    {visa.workPermit !== undefined && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        {getWorkPermitLabel(visa.workPermit)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {visa.duration || (lang === 'es' ? 'Duración variable' : 'Variable duration')}
                    </span>
                    <span className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      {content.viewDetails}
                    </span>
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
                {lang === 'es' 
                  ? 'Recursos legales especializados creados por nuestro equipo de abogados colombianos. Guías prácticas basadas en casos reales y experiencia directa con el sistema legal colombiano.' 
                  : 'Specialized legal resources created by our team of Colombian attorneys. Practical guides based on real cases and direct experience with the Colombian legal system.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.slice(0, 3).map((guide) => (
                <div key={guide.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <DocumentTextIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {content.guide}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {guide.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {guide.description || (lang === 'es' 
                      ? 'Guía práctica con información legal actualizada y consejos basados en nuestra experiencia real con clientes internacionales' 
                      : 'Practical guide with updated legal information and advice based on our real experience with international clients'
                    )}
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

      {/* Modal for Visa Details */}
      {isModalOpen && selectedVisa && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedVisa.emojis?.[0] || '📋'}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedVisa.title}</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{content.modal.scope}</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedVisa.alcance || selectedVisa.description}
                  </p>
                </div>
                
                {selectedVisa.requirements && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{content.modal.requirements}</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedVisa.requirements }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVisa.beneficiaries !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">{lang === 'es' ? 'Beneficiarios' : 'Beneficiaries'}</h5>
                      <p className="text-sm text-gray-700">{getBeneficiariesLabel(selectedVisa.beneficiaries)}</p>
                    </div>
                  )}
                  
                  {selectedVisa.workPermit !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">{lang === 'es' ? 'Permiso de Trabajo' : 'Work Permit'}</h5>
                      <p className="text-sm text-gray-700">{getWorkPermitLabel(selectedVisa.workPermit)}</p>
                    </div>
                  )}
                </div>
                
                {selectedVisa.duration && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{content.modal.duration}</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedVisa.duration}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {content.modal.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeVisaAssistanceSection; 