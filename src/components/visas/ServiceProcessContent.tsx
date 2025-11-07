import { useState } from 'react';
import CalendlyModal from './CalendlyModal.tsx';

interface ServiceProcessContentProps {
  lang?: 'en' | 'es';
}

const ServiceProcessContent = ({ lang = 'en' }: ServiceProcessContentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const content = lang === 'es' ? {
    subtitle: "Nuestro proceso optimizado asegura que tu solicitud de visa sea manejada de manera eficiente y profesional de principio a fin.",
    buttonText: "Solicitar Consulta",
    buttonSubtext: "Reserva tu consulta inicial de 45 minutos",
    steps: [
      {
        iconKey: "consultation",
        title: "Consulta Inicial",
        description: "Reserva una consulta de 45 minutos donde evaluaremos tu situación y recomendaremos la mejor opción de visa para ti.",
        features: ["Evaluación personalizada", "Recomendación de categoría de visa", "Planificación de cronograma"]
      },
      {
        iconKey: "documents",
        title: "Preparación de Documentos",
        description: "Te guiaremos en la recopilación de todos los documentos necesarios y nos aseguraremos de que todo esté correctamente preparado.",
        features: ["Lista de verificación de documentos", "Servicios de traducción", "Soporte de notarización"]
      },
      {
        iconKey: "application",
        title: "Solicitud y Seguimiento",
        description: "Manejamos todo el proceso de solicitud y te mantenemos actualizado sobre su progreso hasta la aprobación.",
        features: ["Presentación de solicitud", "Seguimiento de progreso", "Enlace con el gobierno"]
      },
      {
        iconKey: "completion",
        title: "Conclusión del Servicio y Servicios Futuros",
        description: "Recibe tu visa aprobada y orientación para futuras necesidades legales o migratorias. Permanecemos disponibles para cualquier seguimiento o servicios adicionales.",
        features: ["Entrega y revisión de visa", "Orientación post-aprobación", "Descuentos para clientes recurrentes"]
      }
    ]
  } : {
    subtitle: "Our streamlined process ensures your visa application is handled efficiently and professionally from start to finish.",
    buttonText: "Request Consultation",
    buttonSubtext: "Book your initial 45-minute consultation",
    steps: [
      {
        iconKey: "consultation",
        title: "Initial Consultation",
        description: "Book a 45-minute consultation where we'll assess your situation and recommend the best visa option for you.",
        features: ["Personalized assessment", "Visa category recommendation", "Timeline planning"]
      },
      {
        iconKey: "documents",
        title: "Document Preparation",
        description: "We'll guide you through gathering all necessary documents and ensure everything is properly prepared.",
        features: ["Document checklist", "Translation services", "Notarization support"]
      },
      {
        iconKey: "application",
        title: "Application & Follow-up",
        description: "We handle the entire application process and keep you updated on its progress until approval.",
        features: ["Application submission", "Progress tracking", "Government liaison"]
      },
      {
        iconKey: "completion",
        title: "Service Conclusion & Future Services",
        description: "Receive your approved visa and guidance for future legal or migration needs. We remain available for any follow-up or additional services.",
        features: ["Visa delivery & review", "Post-approval guidance", "Discounts for returning clients"]
      }
    ]
  };

  return (
    <div>
      <div className="mb-12">
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 transform -translate-y-1/2 z-0"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
          {content.steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 flex-shrink-0">
                  {step.iconKey === 'consultation' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  )}
                  {step.iconKey === 'documents' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  )}
                  {step.iconKey === 'application' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                  {step.iconKey === 'completion' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                  )}
                </div>
                {/* Content */}
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {step.description}
                </p>
                {/* Features */}
                <ul className="space-y-2 mt-auto">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Arrow (except for last item) */}
              {index < content.steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Consultation CTA Button */}
      <div className="mt-16 text-center">
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-primary mb-2">
            {lang === 'es' ? '¿Listo para comenzar?' : 'Ready to get started?'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {content.buttonSubtext}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {content.buttonText}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendly Modal */}
      <CalendlyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};

export default ServiceProcessContent;

