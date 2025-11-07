import { useState } from 'react';
import ServiceProcessContent from './ServiceProcessContent.tsx';
import AdditionalServicesSection from './AdditionalServicesSection.tsx';
import FAQAccordion from './FAQAccordion.tsx';

interface ServicesSectionProps {
  lang?: 'en' | 'es';
}

const ServicesSection = ({ lang = 'en' }: ServicesSectionProps) => {
  const [activeTab, setActiveTab] = useState<'service' | 'additional' | 'faq'>('service');

  const tabs = lang === 'es' ? {
    service: 'Nuestro Servicio',
    additional: 'Servicios Adicionales',
    faq: 'Preguntas Frecuentes'
  } : {
    service: 'Our Service',
    additional: 'Additional Services',
    faq: 'Frequently Asked Questions'
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {lang === 'es' ? 'Nuestros Servicios' : 'Our Services'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            {lang === 'es' 
              ? 'Todo lo que necesitas saber sobre nuestros servicios de visa y asesoría legal.'
              : 'Everything you need to know about our visa services and legal advice.'}
          </p>
        </div>

        {/* Tabs Navigation - Desktop */}
        <div className="hidden md:block border-b border-gray-200 mb-8">
          <nav className="flex space-x-8" aria-label="Services tabs">
            <button
              onClick={() => setActiveTab('service')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'service'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeTab === 'service'}
              role="tab"
            >
              {tabs.service}
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'additional'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeTab === 'additional'}
              role="tab"
            >
              {tabs.additional}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'faq'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeTab === 'faq'}
              role="tab"
            >
              {tabs.faq}
            </button>
          </nav>
        </div>

        {/* Mobile Tabs - Horizontal buttons */}
        <div className="md:hidden mb-8">
          <nav
            className="flex gap-3 overflow-x-auto pb-2"
            aria-label="Services tabs mobile"
            role="tablist"
          >
            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg text-sm font-semibold transition-colors border ${
                activeTab === 'service'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary'
              }`}
              aria-selected={activeTab === 'service'}
              role="tab"
            >
              {tabs.service}
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg text-sm font-semibold transition-colors border ${
                activeTab === 'additional'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary'
              }`}
              aria-selected={activeTab === 'additional'}
              role="tab"
            >
              {tabs.additional}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg text-sm font-semibold transition-colors border ${
                activeTab === 'faq'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary'
              }`}
              aria-selected={activeTab === 'faq'}
              role="tab"
            >
              {tabs.faq}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'service' && (
            <div role="tabpanel" aria-labelledby="service-tab">
              <ServiceProcessContent lang={lang} />
            </div>
          )}

          {activeTab === 'additional' && (
            <div role="tabpanel" aria-labelledby="additional-tab">
              <AdditionalServicesSection lang={lang} showHeader={false} />
            </div>
          )}

          {activeTab === 'faq' && (
            <div role="tabpanel" aria-labelledby="faq-tab">
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  {lang === 'es' 
                    ? 'Respuestas a las preguntas más comunes sobre nuestros servicios de visa.'
                    : 'Answers to the most common questions about our visa services.'}
                </p>
              </div>
              <FAQAccordion 
                faqs={lang === 'es' ? [
                  {
                    question: "¿Cuánto tiempo toma el proceso de visa?",
                    answer: "Los tiempos de procesamiento varían según el tipo de visa y la carga de trabajo del gobierno, pero la mayoría de las solicitudes se procesan dentro de 2-6 semanas después de la presentación."
                  },
                  {
                    question: "¿Qué documentos necesito proporcionar?",
                    answer: "Los documentos requeridos dependen de tu tipo de visa, pero típicamente incluyen tu pasaporte, formularios de solicitud, comprobante de ingresos y documentos de respaldo. Proporcionamos una lista de verificación personalizada durante el proceso."
                  },
                  {
                    question: "¿Pueden ayudar si mi visa es denegada?",
                    answer: "Sí, ofrecemos soporte para apelaciones y re-solicitudes, analizando las razones de la denegación y ayudándote a fortalecer tu caso."
                  },
                  {
                    question: "¿Ofrecen servicios después de recibir mi visa?",
                    answer: "¡Absolutamente! Proporcionamos soporte legal continuo, renovaciones y asistencia con otras necesidades migratorias o legales en Colombia."
                  }
                ] : [
                  {
                    question: "How long does the visa process take?",
                    answer: "Processing times vary by visa type and government workload, but most applications are processed within 2-6 weeks after submission."
                  },
                  {
                    question: "What documents do I need to provide?",
                    answer: "Required documents depend on your visa type, but typically include your passport, application forms, proof of income, and supporting documents. We provide a personalized checklist during the process."
                  },
                  {
                    question: "Can you help if my visa is denied?",
                    answer: "Yes, we offer support for appeals and re-applications, analyzing the reasons for denial and helping you strengthen your case."
                  },
                  {
                    question: "Do you offer services after I receive my visa?",
                    answer: "Absolutely! We provide ongoing legal support, renewals, and assistance with other migration or legal needs in Colombia."
                  }
                ]}
                lang={lang}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

