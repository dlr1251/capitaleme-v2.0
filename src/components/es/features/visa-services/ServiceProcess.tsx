// React import removed - not needed in React 17+
// import { 
//   HiChatAlt2, 
//   HiDocumentText, 
//   HiCheckCircle, 
//   HiArrowRight 
// } from 'react-icons/hi';

const ServiceProcess = () => {
  const steps = [
    {
      icon: <div className="w-8 h-8" />,
      title: "Consulta Inicial",
      description: "Reserva una consulta de 45 minutos donde evaluaremos tu situación y te recomendaremos la mejor opción de visa para ti.",
      features: ["Evaluación personalizada", "Recomendación de categoría de visa", "Planificación de cronograma"]
    },
    {
      icon: <div className="w-8 h-8" />,
      title: "Preparación de Documentos",
      description: "Te guiaremos en la recopilación de todos los documentos necesarios y nos aseguraremos de que todo esté correctamente preparado.",
      features: ["Lista de verificación de documentos", "Servicios de traducción", "Apoyo para notarización"]
    },
    {
      icon: <div className="w-8 h-8" />,
      title: "Solicitud y Seguimiento",
      description: "Manejamos todo el proceso de solicitud y te mantenemos informado sobre su progreso hasta la aprobación.",
      features: ["Presentación de solicitud", "Seguimiento del progreso", "Enlace con el gobierno"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Cómo Funciona Nuestro Servicio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro proceso optimizado asegura que tu solicitud de visa sea manejada de manera eficiente y profesional de principio a fin.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-20">
                  {index + 1}
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                      <div className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para Comenzar tu Viaje de Visa?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Reserva tu consulta inicial hoy y da el primer paso hacia tu visa colombiana.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              Reservar Consulta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProcess; 