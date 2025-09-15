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
  BriefcaseIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';

// Visa and Guide types
interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPopular: boolean;
  emoji: string;
  alcance?: string;
  beneficiaries?: string;
  workPermit?: string;
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
  
  // Modal state
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper: beneficiaries label - simplified to show raw data
  const getBeneficiariesLabel = (beneficiaries: string | undefined) => {
    if (!beneficiaries || beneficiaries === '') {
      return lang === 'es' ? 'Sin información' : 'No information';
    }
    return beneficiaries;
  };
  
  // Helper: work permit label - simplified to show raw data
  const getWorkPermitLabel = (workPermit: string | undefined) => {
    if (!workPermit || workPermit === '') {
      return lang === 'es' ? 'Sin información' : 'No information';
    }
    return workPermit;
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
    title: "Asistencia en visas colombianas",
    subtitle: "Servicios legales integrales",
    description: "Como abogados no solo nos enfocamos en tu papeleo. Nos procuramos entender tus necesidades y riesgos legales al mudarte al extranjero para asegurar tu mejor estrategia con la mayor tasa de éxito posible.",
    explorePopular: "Explora algunas visas populares",
    discoverAll: "Descubrir todas las categorías de visa",
    guides: "Guías y recursos",
    viewAllGuides: "Ver todas las guías",
    legalExpertise: "Experiencia legal",
    documentPreparation: "Preparación de documentos",
    familyApplications: "Solicitudes familiares",
    popularTitle: "Categorías de visas populares en Colombia",
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
    },
    beneficiaries: "Beneficiarios",
    workPermit: "Permiso de trabajo"
  } : {
    title: "Visa assistance",
    subtitle: "and legal support",
    description: "As attorneys we procure to understand your needs and legal risks when moving and operating abroad to ensure your best strategy.",
    explorePopular: "Explore some popular visas",
    discoverAll: "Discover all visa categories",
    guides: "Guides & Resources",
    viewAllGuides: "View all guides",
    legalExpertise: "Legal expertise",
    documentPreparation: "Document preparation",
    familyApplications: "Family applications",
    popularTitle: "Popular visa categories in Colombia",
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
    },
    beneficiaries: "Beneficiaries",
    workPermit: "Work permit"
  };

  // Combined features section (merging visa features and why choose us)
  const combinedFeatures = [
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Precios transparentes" : "Transparent pricing",
      description: lang === 'es' ? "Costos claros sin tarifas ocultas" : "Clear costs with no hidden fees"
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Equipo experto y bilingüe" : "Expert bilingual team",
      description: lang === 'es' ? "Profesionales bilingües con años de experiencia" : "Bilingual professionals with years of experience"
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Proceso eficiente" : "Efficient process",
      description: lang === 'es' ? "Enfoque impulsado por tecnología para resultados más rápidos y mejores" : "Technology-driven approach for faster, better results"
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: lang === 'es' ? "Resultados probados" : "Proven results",
      description: lang === 'es' ? "Cientos de casos exitosos completados" : "Hundreds of successful cases completed"
    }
  ];

  // Filter popular visas
  const popularVisas = visas.filter(v => v.isPopular);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-left mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShieldCheckIcon className="w-4 h-4" />
            {lang === 'en' ? 'Professional visa services' : 'Servicios profesionales de visa'}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {content.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {content.subtitle}
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Why Choose Us - Combined Features */}
        <div className="mb-24">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {combinedFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Visas Section */}
        {(popularVisas.length > 0 || visas.length > 0) && (
          <div className="mb-24">
            <div className="text-left mb-16">
              <h3 className="text-3xl font-bold text-secondary mb-4">
                {popularVisas.length > 0 ? content.popularTitle : (lang === 'es' ? 'Visas populares en Colombia' : 'Popular visas in Colombia')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(popularVisas.length > 0 ? popularVisas : visas.slice(0, 6)).map((visa) => (
                <div key={visa.id} className="bg-white rounded p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group" onClick={() => openModal(visa)}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-primary  group-hover:text-primary transition-colors">
                      {lang === 'es' ? `Visa ${visa.title}` : `${visa.title} Visa`}
                    </h4>                  
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {visa.beneficiaries && visa.beneficiaries.trim() !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                         {`${content.beneficiaries}: ${getBeneficiariesLabel(visa.beneficiaries)}`}
                      </span>
                    )}
                    {visa.workPermit && visa.workPermit.trim() !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {`${content.workPermit}: ${getWorkPermitLabel(visa.workPermit)}`}
                      </span>
                    )}
                  </div>  
                  
                  {/* Scope Description */}
                  {visa.alcance && (
                    <div className="mb-6">
                      {/* <p className="text-sm text-gray-500 font-medium mb-2">{content.modal.scope}:</p> */}
                      <p className="text-sm text-gray-700">
                        {visa.alcance}
                      </p>
                    </div>
                  )}
                  
                                 
                </div>
              ))}
            </div>
            
            <div className="text-left mt-12">
              <a 
                href={`/${lang}/visas`}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-lg group"
              >
                {content.discoverAll}
                <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        )}

        {/* Guides Section */}
        {guides.length > 0 && (
          <div className="mb-24">
            <div className="text-left mb-16">
              <h3 className="text-3xl font-bold text-primary mb-4">
                {content.guides}
              </h3>
              <p className="text-xl text-gray-600">
                {lang === 'es' 
                  ? 'Recursos útiles para entender mejor el proceso de visa'
                  : 'Helpful resources to better understand the visa process'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {guides.slice(0, 4).map((guide) => (
                <a href={`/${lang}/guides/${guide.slug}`} key={guide.id} className="bg-white rounded-sm p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <DocumentTextIcon className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="text-lg font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                    {guide.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {guide.excerpt || guide.description}
                  </p>
                  <div className="flex items-center justify-between">                
                  </div>
                </a>
              ))}
            </div>
            
            <div className="text-left mt-12">
              <a 
                href={`/${lang}/guides`}
                className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200 font-semibold"
              >
                {content.viewAllGuides}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Visa Details Modal */}
      {isModalOpen && selectedVisa && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {selectedVisa.emoji}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedVisa.title}</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedVisa.description}</p>
              
              {selectedVisa.alcance && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{content.modal.scope}:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedVisa.alcance}</p>
                </div>
              )}
              
              {selectedVisa.requirements && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{content.modal.requirements}:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedVisa.requirements}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedVisa.beneficiaries && selectedVisa.beneficiaries.trim() !== '' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {getBeneficiariesLabel(selectedVisa.beneficiaries)}
                  </span>
                )}
                                    {selectedVisa.workPermit && selectedVisa.workPermit.trim() !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-blue-200">
                        {`${content.workPermit}: ${getWorkPermitLabel(selectedVisa.workPermit)}`}
                      </span>
                    )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {selectedVisa.duration || (lang === 'es' ? 'Duración variable' : 'Variable duration')}
                </span>
                <a 
                  href={`/${lang}/visas/${selectedVisa.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  {lang === 'es' ? 'Ver detalles completos' : 'View full details'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeVisaAssistanceSection; 