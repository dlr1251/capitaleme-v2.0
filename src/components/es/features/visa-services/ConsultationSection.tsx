// React import removed - not needed in React 17+
// import { HiCalendar, HiClock, HiUser, HiCheckCircle } from 'react-icons/hi';

const ConsultationSection = () => {
  const benefits = [
    {
      icon: <div className="w-6 h-6" />,
      title: "Evaluación Personalizada",
      description: "Obtén una estrategia de visa personalizada basada en tu situación específica"
    },
    {
      icon: <div className="w-6 h-6" />,
      title: "Sesión de 45 Minutos",
      description: "Consulta integral para responder todas tus preguntas"
    },
    {
      icon: <div className="w-6 h-6" />,
      title: "Orientación Experta",
      description: "Asesoramiento profesional de abogados de inmigración experimentados"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium">
              {/* <HiCalendar className="w-4 h-4 mr-2" /> */}
              Consulta Inicial Gratuita
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Comienza tu Viaje de Visa Hoy
            </h2>
            
            <p className="text-xl text-blue-100/80 leading-relaxed">
              Reserva una consulta gratuita de 45 minutos con nuestros expertos en inmigración. Evaluaremos tu situación, recomendaremos las mejores opciones de visa y crearemos una estrategia personalizada para tus objetivos de inmigración colombiana.
            </p>
            
            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-300">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-blue-200/80">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                {/* <HiCalendar className="w-5 h-5 mr-2" /> */}
                Reservar Consulta Gratuita
              </button>
              <button className="border border-blue-400/30 hover:bg-blue-600/20 text-blue-200 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
                Saber Más
              </button>
            </div>
          </div>
          
          {/* Right Column: Calendly Widget */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto">
                {/* <HiCalendar className="w-8 h-8 text-blue-300" /> */}
              </div>
              <h3 className="text-xl font-semibold text-white">
                Programa tu Consulta
              </h3>
              <p className="text-blue-100/80">
                Elige un horario que te funcione. Nuestro equipo está disponible de lunes a viernes, de 9 AM a 6 PM hora de Colombia.
              </p>
              
              {/* Placeholder for Calendly widget */}
              <div className="bg-white/20 rounded-lg p-8 text-center">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* <HiCalendar className="w-6 h-6 text-white" /> */}
                </div>
                <p className="text-blue-200 text-sm">
                  El widget de Calendly se integrará aquí
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection; 