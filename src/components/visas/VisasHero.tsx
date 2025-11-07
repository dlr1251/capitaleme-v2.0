// React import removed - not needed in React 17+
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EyeIcon,
  SparklesIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/solid';

// Type definitions
interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji?: string;
  isPopular?: boolean;
}

interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  lastEdited?: string;
}

interface VisasHeroProps {
  popularVisas?: Visa[];
  guides?: Guide[];
  lang?: 'en' | 'es';
}

const VisasHero = ({ popularVisas = [], guides = [], lang = 'en' }: VisasHeroProps) => {
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

  // Content based on language
  const content = lang === 'es' ? {
    title: "Tu proceso de visa,",
    subtitle: "con asesoría legal",
    tagline: "Si quieres ir lejos, ve con un abogado",
    description: "Como abogados no solo nos enfocamos en tu papeleo. Nos procuramos entender tus necesidades y riesgos legales al mudarte al extranjero para asegurar tu mejor estrategia con la mayor tasa de éxito posible.",
    guides: "Guías y Recursos",
    viewAllGuides: "Ver todas las guías",
    legalExpertise: "Experiencia Legal",
    documentPreparation: "Preparación de Documentos",
    familyApplications: "Solicitudes Familiares"
  } : {
    title: "Your visa application,",
    subtitle: "with legal advice",
    tagline: "We do visas differently",
    description: "As attorneys we not only focus on your paperwork. We procure to understand your needs and legal risks when moving abroad to ensure your best strategy with the highest success rate possible.",
    guides: "Guides & Resources",
    viewAllGuides: "View all guides",
    legalExpertise: "Legal Expertise",
    documentPreparation: "Document Preparation",
    familyApplications: "Family Applications"
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            {content.title}{' '}
            <span className="text-secondary">
              {content.subtitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
            {content.tagline}
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {topFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Guides Section */}
        {guides.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {content.guides}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'es' ? 'Recursos útiles para tu proceso de visa' : 'Useful resources for your visa process'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {guides.slice(0, 3).map((guide) => (
                <div key={guide.id} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <DocumentTextIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {lang === 'es' ? 'Guía' : 'Guide'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                    {guide.description}
                  </p>
                  <a 
                    href={`/${lang}/guides/${guide.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors mt-auto"
                  >
                    {lang === 'es' ? 'Leer guía' : 'Read guide'}
                    <EyeIcon className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <a 
                href={`/${lang}/guides`}
                className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors font-medium"
              >
                {content.viewAllGuides}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VisasHero; 