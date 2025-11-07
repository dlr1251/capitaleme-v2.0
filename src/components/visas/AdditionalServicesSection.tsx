import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
  HeartIcon,
  LanguageIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/solid';

interface AdditionalServicesSectionProps {
  lang?: 'en' | 'es';
  showHeader?: boolean;
}

const AdditionalServicesSection = ({ lang = 'en', showHeader = true }: AdditionalServicesSectionProps) => {
  const content = lang === 'es' ? {
    title: "Servicios Adicionales",
    subtitle: "Complementa tu proceso de visa con nuestros servicios especializados",
    services: [
      {
        icon: <ShieldCheckIcon className="w-8 h-8" />,
        title: "Procesamiento de Registros Criminales del FBI (DBP)",
        description: "Obtención y procesamiento de certificados de antecedentes penales del FBI para procesos de visa",
        features: ["Procesamiento rápido", "Documentación oficial", "Asistencia completa"]
      },
      {
        icon: <DocumentTextIcon className="w-8 h-8" />,
        title: "Apostillas y Certificados de Nacimiento",
        description: "Legalización de documentos estadounidenses mediante apostilla para uso en Colombia",
        features: ["Apostillas oficiales", "Certificados de nacimiento", "Legalización completa"]
      },
      {
        icon: <ClipboardDocumentListIcon className="w-8 h-8" />,
        title: "Certificado de Movimiento Migratorio",
        description: "Obtención del certificado que documenta el historial migratorio para procesos legales",
        features: ["Historial completo", "Documentación oficial", "Proceso simplificado"]
      },
      {
        icon: <ClockIcon className="w-8 h-8" />,
        title: "Extensión de Permisos",
        description: "Renovación y extensión de permisos de estadía para mantener estatus legal",
        features: ["Renovación oportuna", "Asesoría legal", "Proceso eficiente"]
      },
      {
        icon: <LanguageIcon className="w-8 h-8" />,
        title: "Traducciones Certificadas",
        description: "Servicio de traducción oficial de documentos para procesos legales e inmigración",
        features: ["Traductores certificados", "Documentos oficiales", "Aceptación garantizada"]
      },
      {
        icon: <HeartIcon className="w-8 h-8" />,
        title: "Seguro de Salud de Viaje - Genki",
        description: "Seguro médico especializado para viajeros y expatriados con cobertura internacional",
        features: ["Cobertura global", "Atención de emergencias", "Planes flexibles"]
      }
    ]
  } : {
    title: "Additional Services",
    subtitle: "Complement your visa process with our specialized services",
    services: [
      {
        icon: <ShieldCheckIcon className="w-8 h-8" />,
        title: "FBI Criminal Records Processing (DBP)",
        description: "Obtainment and processing of FBI criminal background certificates for visa processes",
        features: ["Fast processing", "Official documentation", "Complete assistance"]
      },
      {
        icon: <DocumentTextIcon className="w-8 h-8" />,
        title: "US Apostilles and Birth Certificates",
        description: "Legalization of US documents through apostille for use in Colombia",
        features: ["Official apostilles", "Birth certificates", "Complete legalization"]
      },
      {
        icon: <ClipboardDocumentListIcon className="w-8 h-8" />,
        title: "Certificate of Migratory Movement",
        description: "Obtainment of certificate documenting migratory history for legal processes",
        features: ["Complete history", "Official documentation", "Simplified process"]
      },
      {
        icon: <ClockIcon className="w-8 h-8" />,
        title: "Permit Extension",
        description: "Renewal and extension of stay permits to maintain legal status",
        features: ["Timely renewal", "Legal advice", "Efficient process"]
      },
      {
        icon: <LanguageIcon className="w-8 h-8" />,
        title: "Certified Translation Services",
        description: "Official document translation service for legal and immigration processes",
        features: ["Certified translators", "Official documents", "Guaranteed acceptance"]
      },
      {
        icon: <HeartIcon className="w-8 h-8" />,
        title: "Travel Health Insurance - Genki",
        description: "Specialized medical insurance for travelers and expatriates with international coverage",
        features: ["Global coverage", "Emergency care", "Flexible plans"]
      }
    ]
  };

  const contentWrapper = (
    <>
      {showHeader && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm h-full flex flex-col">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6 flex-shrink-0">
                <div className="text-white">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                {service.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </div>
                ))}
              </div>                       
            </div>
          ))}
        </div>
    </>
  );

  if (showHeader) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {contentWrapper}
        </div>
      </section>
    );
  }

  return <div>{contentWrapper}</div>;
};

export default AdditionalServicesSection;
