import { useState } from 'react';
import PropertySearchService from '../../features/real-estate/PropertySearchService.tsx';
import ExplorePropertiesSection from '../services/ExploreProperties.tsx';
import AccordionFAQ from '../../core/common/AccordionFAQ.jsx';

// Copy the Property interface from ExploreProperties.tsx
interface Property {
  id: string;
  data: {
    mainImage: string;
    title: string;
    location: string;
    price: {
      usd: number;
      cop: number;
    };
    area: {
      total: number;
      unit: string;
    };
    features?: string[];
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    status?: string;
  };
}

interface ProcessStep {
  title: string;
  content: string;
  icon: string;
  duration: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RealEstateSectionProps {
  properties?: Property[];
  lang?: 'en' | 'es';
}

const RealEstateSection = ({ properties = [], lang = 'es' }: RealEstateSectionProps) => {
  const [activeSection, setActiveSection] = useState('overview');

  // Define content based on language
  const content = lang === 'es' ? {
    serviceBadge: "🏠 Servicios Inmobiliarios",
    title: "Guía Inmobiliaria",
    subtitle: "Colombiana",
    description: "Navega el mercado inmobiliario único de Colombia con confianza. Desde la consulta inicial hasta el registro de la propiedad, te guiamos a través de cada paso del proceso con apoyo legal experto y conocimientos del mercado.",
    sections: [
      { id: 'overview', label: 'Resumen', icon: '🏠' },
      { id: 'process', label: 'El Proceso', icon: '📋' },
      { id: 'properties', label: 'Explorar Propiedades', icon: '🔍' },
      { id: 'search-service', label: 'Servicio de Búsqueda', icon: '🎯' },
      { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓' }
    ],
    whyColombia: {
      title: "¿Por qué Colombia?",
      points: [
        "Mercado inmobiliario en crecimiento con excelente ROI",
        "Tipos de cambio favorables para inversores extranjeros",
        "Clima favorable y calidad de vida excepcional",
        "Proceso legal transparente y bien regulado"
      ]
    },
    ourServices: {
      title: "Nuestros Servicios",
      points: [
        "Asesoría legal completa en transacciones inmobiliarias",
        "Búsqueda y selección de propiedades personalizada",
        "Negociación y preparación de contratos",
        "Gestión de trámites bancarios y registrales"
      ]
    }
  } : {
    serviceBadge: "🏠 Real Estate Services",
    title: "Colombian Real Estate",
    subtitle: "Guide",
    description: "Navigate Colombia's unique real estate market with confidence. From initial consultation to property registration, we guide you through every step of the process with expert legal support and market knowledge.",
    sections: [
      { id: 'overview', label: 'Overview', icon: '🏠' },
      { id: 'process', label: 'The Process', icon: '📋' },
      { id: 'properties', label: 'Explore Properties', icon: '🔍' },
      { id: 'search-service', label: 'Search Service', icon: '🎯' },
      { id: 'faq', label: 'FAQ', icon: '❓' }
    ],
    whyColombia: {
      title: "Why Colombia?",
      points: [
        "Growing real estate market with excellent ROI",
        "Favorable exchange rates for foreign investors",
        "Favorable climate and exceptional quality of life",
        "Transparent and well-regulated legal process"
      ]
    },
    ourServices: {
      title: "Our Services",
      points: [
        "Complete legal advice in real estate transactions",
        "Personalized property search and selection",
        "Negotiation and contract preparation",
        "Banking and registration procedures management"
      ]
    }
  };

  // Define steps based on language
  const STEPS_REAL_ESTATE: ProcessStep[] = lang === 'es' ? [
    {
      title: 'Consulta Inicial y Planificación',
      content: 'Comienza con una consulta integral para entender tus objetivos, presupuesto y cronograma. Te ayudaremos a navegar las regulaciones inmobiliarias colombianas, implicaciones fiscales y requisitos legales para compradores extranjeros.',
      icon: '🤝',
      duration: '1-2 semanas'
    },
    {
      title: 'Búsqueda y Selección de Propiedades',
      content: 'Nuestro equipo buscará propiedades que coincidan con tus criterios, organizará visitas y proporcionará análisis detallado del mercado. Te ayudaremos a entender las condiciones del mercado local y valores de propiedades.',
      icon: '🔍',
      duration: '2-4 semanas'
    },
    {
      title: 'Preparación Financiera y Bancaria',
      content: 'Una vez que hayas encontrado tu propiedad ideal, te ayudaremos a preparar fondos en Colombia y registrarlos en el Banco Central. Esto implica abrir una cuenta de corretaje y completar procedimientos de cambio de divisas.',
      icon: '💰',
      duration: '1 semana'
    },
    {
      title: 'Debida Diligencia y Revisión Legal',
      content: 'Realizamos búsquedas exhaustivas de títulos para identificar hipotecas, gravámenes o cargas legales. Esto incluye revisar certificados de propiedad, escrituras anteriores y regulaciones de la administración para asegurar una transferencia limpia.',
      icon: '📋',
      duration: '1-2 semanas'
    },
    {
      title: 'Negociación y Acuerdo de Compra',
      content: 'Negociaremos los mejores términos y prepararemos el contrato "Promesa de Compraventa", que establece el precio, estructura de pago, fecha de entrega y todos los términos esenciales de la transacción.',
      icon: '📝',
      duration: '1 semana'
    },
    {
      title: 'Cierre y Registro',
      content: 'Finaliza la transacción en una notaría donde se firma y registra la escritura. El notario manejará todas las formalidades legales y asegurará el registro adecuado en el registro nacional de propiedades.',
      icon: '✅',
      duration: '2-3 semanas'
    }
  ] : [
    {
      title: 'Initial Consultation and Planning',
      content: 'Start with a comprehensive consultation to understand your objectives, budget, and timeline. We will help you navigate Colombian real estate regulations, tax implications, and legal requirements for foreign buyers.',
      icon: '🤝',
      duration: '1-2 weeks'
    },
    {
      title: 'Property Search and Selection',
      content: 'Our team will search for properties that match your criteria, organize viewings, and provide detailed market analysis. We will help you understand local market conditions and property values.',
      icon: '🔍',
      duration: '2-4 weeks'
    },
    {
      title: 'Financial and Banking Preparation',
      content: 'Once you have found your ideal property, we will help you prepare funds in Colombia and register them with the Central Bank. This involves opening a brokerage account and completing currency exchange procedures.',
      icon: '💰',
      duration: '1 week'
    },
    {
      title: 'Due Diligence and Legal Review',
      content: 'We conduct exhaustive title searches to identify mortgages, liens, or legal encumbrances. This includes reviewing property certificates, previous deeds, and administration regulations to ensure a clean transfer.',
      icon: '📋',
      duration: '1-2 weeks'
    },
    {
      title: 'Negotiation and Purchase Agreement',
      content: 'We will negotiate the best terms and prepare the "Promesa de Compraventa" contract, which establishes the price, payment structure, delivery date, and all essential terms of the transaction.',
      icon: '📝',
      duration: '1 week'
    },
    {
      title: 'Closing and Registration',
      content: 'Finalize the transaction at a notary where the deed is signed and registered. The notary will handle all legal formalities and ensure proper registration in the national property registry.',
      icon: '✅',
      duration: '2-3 weeks'
    }
  ];

  // Define FAQ data based on language
  const FAQ_DATA: FAQItem[] = lang === 'es' ? [
    {
      question: '¿Cuánto cuesta?',
      answer: 'Dependiendo del tipo de propiedad y complejidad, nuestros servicios legales típicamente oscilan entre $1.5M y $5M COP. Proporcionamos precios transparentes y desgloses detallados de costos para cada transacción.'
    },
    {
      question: '¿Cuánto tiempo toma el proceso de compra de propiedades?',
      answer: 'El tiempo típico desde la oferta hasta el cierre es de 4-8 semanas, dependiendo de varios factores incluyendo el tipo de propiedad, financiamiento y cualquier complejidad legal. Nuestro proceso integral asegura eficiencia mientras mantiene el cumplimiento legal.'
    },
    {
      question: '¿Qué impuestos pagaré como extranjero comprando propiedades?',
      answer: 'Los compradores extranjeros enfrentan los mismos impuestos que los colombianos, incluyendo impuesto de transferencia de propiedad (~1.5%), tarifas de registro (~0.5%) y honorarios notariales. Los impuestos anuales de propiedad (predial) varían por municipio y valor de la propiedad. Proporcionamos planificación fiscal detallada y orientación.'
    },
    {
      question: '¿Pueden los extranjeros ser propietarios en Colombia?',
      answer: 'Sí, los extranjeros tienen los mismos derechos de propiedad que los colombianos, con algunas restricciones en áreas fronterizas o zonas protegidas específicas. Aseguramos el cumplimiento de todos los requisitos legales para la propiedad extranjera.'
    },
    {
      question: '¿Necesito una visa para comprar propiedades en Colombia?',
      answer: 'No, no necesitas una visa para comprar propiedades, aunque tener una cuenta bancaria colombiana (que puede requerir residencia) puede simplificar el proceso. Podemos ayudarte a navegar los requisitos bancarios y configurar las cuentas necesarias.'
    },
    {
      question: '¿Qué es una "Promesa de Compraventa"?',
      answer: 'Este es un acuerdo de compra vinculante que describe los términos de la venta incluyendo precio, cronograma de pagos, fecha de cierre y contingencias. Es un documento crucial en las transacciones inmobiliarias colombianas que te ayudamos a negociar y preparar.'
    }
  ] : [
    {
      question: 'How much does it cost?',
      answer: 'Depending on the type of property and complexity, our legal services typically range from $1.5M to $5M COP. We provide transparent pricing and detailed cost breakdowns for each transaction.'
    },
    {
      question: 'How long does the property purchase process take?',
      answer: 'The typical time from offer to closing is 4-8 weeks, depending on various factors including property type, financing, and any legal complexity. Our comprehensive process ensures efficiency while maintaining legal compliance.'
    },
    {
      question: 'What taxes will I pay as a foreigner buying properties?',
      answer: 'Foreign buyers face the same taxes as Colombians, including property transfer tax (~1.5%), registration fees (~0.5%), and notarial fees. Annual property taxes (predial) vary by municipality and property value. We provide detailed tax planning and guidance.'
    },
    {
      question: 'Can foreigners own property in Colombia?',
      answer: 'Yes, foreigners have the same property rights as Colombians, with some restrictions in border areas or specific protected zones. We ensure compliance with all legal requirements for foreign property ownership.'
    },
    {
      question: 'Do I need a visa to buy properties in Colombia?',
      answer: 'No, you do not need a visa to buy properties, although having a Colombian bank account (which may require residency) can simplify the process. We can help you navigate banking requirements and set up necessary accounts.'
    },
    {
      question: 'What is a "Promesa de Compraventa"?',
      answer: 'This is a binding purchase agreement that outlines the terms of sale including price, payment schedule, closing date, and contingencies. It is a crucial document in Colombian real estate transactions that we help you negotiate and prepare.'
    }
  ];

  // Process Step Component
  const ProcessStep = ({ number, title, content, icon, duration, isLast }: {
    number: number;
    title: string;
    content: string;
    icon: string;
    duration: string;
    isLast: boolean;
  }) => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {number}
        </div>
        {!isLast && (
          <div className="w-0.5 h-16 bg-gradient-to-b from-secondary to-primary mt-2"></div>
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {duration}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );

  // FAQ Item Component
  const FAQItem = ({ question, answer }: FAQItem) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">{question}</h4>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {content.serviceBadge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {content.title}
            <span className="block text-secondary">{content.subtitle}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {content.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{content.whyColombia.title}</h3>
                <div className="space-y-4">
                  {content.whyColombia.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{content.ourServices.title}</h3>
                <div className="space-y-4">
                  {content.ourServices.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Process Section */}
          {activeSection === 'process' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {lang === 'es' ? 'Nuestro Proceso Integral' : 'Our Comprehensive Process'}
              </h3>
              <div className="space-y-8">
                {STEPS_REAL_ESTATE.map((step, index) => (
                  <ProcessStep
                    key={index}
                    number={index + 1}
                    title={step.title}
                    content={step.content}
                    icon={step.icon}
                    duration={step.duration}
                    isLast={index === STEPS_REAL_ESTATE.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {activeSection === 'properties' && (
            <div>
              <ExplorePropertiesSection properties={properties} />
            </div>
          )}

          {/* Search Service Section */}
          {activeSection === 'search-service' && (
            <div>
              <PropertySearchService />
            </div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {FAQ_DATA.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RealEstateSection; 