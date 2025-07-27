import React from 'react';
import CLKRConsultationForm from '../clkr/CLKRConsultationForm.tsx';

interface ConsultationSectionProps {
  lang?: 'en' | 'es';
}

const ConsultationSection: React.FC<ConsultationSectionProps> = ({ lang = 'en' }) => {
  // Content based on language
  const content = lang === 'es' ? {
    title: "Obtén Consultoría Profesional de Visas",
    subtitle: "¿Necesitas asesoría personalizada para tu solicitud de visa? Nuestros expertos legales están aquí para ayudarte a navegar el proceso con confianza.",
    topic: "Servicios de Visa",
    category: "visa-consultation"
  } : {
    title: "Get Professional Visa Consultation",
    subtitle: "Need personalized advice for your visa application? Our legal experts are here to help you navigate the process with confidence.",
    topic: "Visa Services",
    category: "visa-consultation"
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <CLKRConsultationForm
            topic={content.topic}
            category={content.category}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection; 