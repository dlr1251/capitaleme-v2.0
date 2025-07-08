import { useState } from 'react';
import PropertyListing from '../features/real-estate/PropertyListing.tsx';
import PropertySearchService from '../features/real-estate/PropertySearchService.tsx';

interface Step {
  title: string;
  content: string;
  icon: string;
  duration: string;
}

interface FAQItemData {
  question: string;
  answer: string;
}

interface RealEstateGuideProps {
  properties: any[]; // TODO: Replace any with a Property[] type if available
}

const STEPS_REAL_ESTATE: Step[] = [
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
    content: 'Una vez que hayas encontrado la propiedad de tus sueños, te ayudaremos a preparar los fondos en Colombia y registrarlos ante el Banco Central. Esto implica abrir una cuenta de corretaje y completar los procedimientos de cambio de divisas.',
    icon: '💰',
    duration: '1 semana'
  },
  {
    title: 'Debida Diligencia y Revisión Legal',
    content: 'Realizamos búsquedas exhaustivas de títulos para identificar hipotecas, gravámenes o impedimentos legales. Esto incluye revisar certificados de propiedad, escrituras anteriores y regulaciones de la comunidad.',
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
];

const FAQ_DATA: FAQItemData[] = [
  {
    question: '¿Pueden los extranjeros comprar propiedades en Colombia?',
    answer: 'Sí, los extranjeros pueden comprar propiedades en Colombia con los mismos derechos que los ciudadanos colombianos. Sin embargo, hay requisitos específicos para registrar inversión extranjera y cumplir con las regulaciones de cambio de divisas.'
  },
  {
    question: '¿Cuáles son los costos típicos de cierre?',
    answer: 'Los costos de cierre típicamente oscilan entre 3-5% del valor de la propiedad e incluyen honorarios notariales, impuestos de registro, honorarios legales e impuestos de transferencia. Proporcionamos desgloses detallados de costos para cada transacción.'
  },
  {
    question: '¿Necesito una cuenta bancaria colombiana?',
    answer: 'Aunque no es obligatorio, tener una cuenta bancaria colombiana es altamente recomendado para transacciones inmobiliarias. Podemos ayudarte a abrir una cuenta y navegar los requisitos bancarios.'
  },
  {
    question: '¿Cuánto tiempo toma el proceso de compra?',
    answer: 'El proceso completo típicamente toma 2-3 meses desde la búsqueda inicial hasta el cierre, dependiendo de la disponibilidad de propiedades, arreglos de financiamiento y requisitos legales.'
  },
  {
    question: '¿Qué documentos necesito como comprador extranjero?',
    answer: 'Necesitarás un pasaporte válido, comprobante de ingresos, estados de cuenta bancarios y potencialmente un ID fiscal colombiano (RUT). Te guiaremos a través de toda la documentación requerida.'
  },
  {
    question: '¿Hay restricciones en tipos de propiedades para extranjeros?',
    answer: 'Los extranjeros pueden comprar la mayoría de tipos de propiedades incluyendo apartamentos, casas y terrenos. Sin embargo, hay restricciones para comprar propiedades en áreas fronterizas y ciertas ubicaciones estratégicas.'
  }
];

interface ProcessStepProps extends Step {
  number: number;
  isLast: boolean;
}

const ProcessStep = ({ number, title, content, icon, duration, isLast }: ProcessStepProps) => (
  <div className="relative">
    {/* Connecting line */}
    {!isLast && (
      <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-secondary to-primary/30"></div>
    )}
    
    <div className="flex items-start gap-6 group">
      {/* Icon and number circle */}
      <div className="flex-shrink-0 relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow bg-white rounded-xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xl font-bold text-primary">{title}</h4>
          <span className="text-sm text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full">
            {duration}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  </div>
);

interface FAQItemProps extends FAQItemData {}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span className="font-semibold text-primary">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const RealEstateGuide = ({ properties }: RealEstateGuideProps) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', label: 'Resumen', icon: '🏠' },
    { id: 'process', label: 'El Proceso', icon: '📋' },
    { id: 'properties', label: 'Explorar Propiedades', icon: '🔍' },
    { id: 'search-service', label: 'Servicio de Búsqueda', icon: '🎯' },
    { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🏠 Servicios Inmobiliarios
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Guía de Bienes Raíces
            <span className="block text-secondary">en Colombia</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Navega el mercado inmobiliario único de Colombia con confianza. Desde la consulta inicial hasta el registro de la propiedad, 
            te guiamos a través de cada paso del proceso con apoyo legal experto y conocimientos del mercado.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
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
        <div className="min-h-[600px]">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">🇨🇴</div>
                  <h3 className="text-2xl font-bold text-primary mb-4">¿Por qué Colombia?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Mercado inmobiliario en crecimiento con excelente ROI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Tipos de cambio favorables para inversores extranjeros
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Diversas opciones de propiedades de ciudad a campo
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Marco legal estable para propiedad extranjera
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Marco Legal</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Los extranjeros tienen iguales derechos de propiedad
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Sistema notarial asegura seguridad legal
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Registro en Banco Central requerido
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Seguro de título disponible
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">¿Listo para Comenzar tu Viaje?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Nuestros servicios inmobiliarios integrales comienzan desde <span className="font-bold">$812.500 COP</span>
                </p>
                <a
                  href="/es/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-secondary font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                >
                  Reserva una Consulta
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* Process Section */}
          {activeSection === 'process' && (
            <div className="space-y-12 max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">El Proceso Completo</h2>
                <p className="text-xl text-gray-600">
                  Desde la consulta inicial hasta el registro de la propiedad, te guiamos a través de cada paso
                </p>
              </div>
              
              {STEPS_REAL_ESTATE.map((step: Step, idx: number) => (
                <ProcessStep
                  key={idx}
                  number={idx + 1}
                  isLast={idx === STEPS_REAL_ESTATE.length - 1}
                  {...step}
                />
              ))}
            </div>
          )}

          {/* Properties Section */}
          {activeSection === 'properties' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Propiedades Destacadas</h2>
                <p className="text-xl text-gray-600">
                  Descubre nuestra selección curada de propiedades premium en Colombia
                </p>
              </div>
              <PropertyListing properties={properties} />
            </div>
          )}

          {/* Property Search Service Section */}
          {activeSection === 'search-service' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Servicio de Búsqueda de Propiedades</h2>
                <p className="text-xl text-gray-600">
                  Déjanos encontrar tu propiedad perfecta con nuestro servicio de búsqueda integral
                </p>
              </div>
              <PropertySearchService />
            </div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Preguntas Frecuentes</h2>
                <p className="text-xl text-gray-600">
                  Todo lo que necesitas saber sobre comprar propiedades en Colombia
                </p>
              </div>
              
              {FAQ_DATA.map((faq: FAQItemData, idx: number) => (
                <FAQItem key={idx} {...faq} />
              ))}
              
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">¿Aún tienes preguntas?</p>
                <a
                  href="/es/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/80 transition-colors shadow-md"
                >
                  Contacta Nuestro Equipo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RealEstateGuide; 