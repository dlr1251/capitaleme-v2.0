import { useState } from 'react';

interface CLKRConsultationFormProps {
  topic: string;
  category: string;
  lang?: string;
}

export default function CLKRConsultationForm({ topic, category, lang = 'en' }: CLKRConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    service: category || '',
    topic: topic || '',
    urgency: 'normal',
    budget: '',
    timeline: '',
    description: '',
    accept_terms: false,
    accept_marketing: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formcarry.com/s/oe6f89XVhFy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'CLKR Consultation',
          page: window.location.href,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Redirect to Calendly after a short delay
        setTimeout(() => {
          window.open('https://calendly.com/capital-m-law/initial-consultation-with-capital-m', '_blank');
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      alert(lang === 'es' ? 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.' : 'There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Text content based on language
  const textContent = {
    en: {
      title: 'Get Legal Consultation',
      subtitle: 'Fill out the form below and we\'ll get back to you within 24 hours.',
      name: 'Full Name *',
      email: 'Email Address *',
      phone: 'Phone Number',
      country: 'Country',
      city: 'City',
      service: 'Service Type',
      topic: 'Topic',
      urgency: 'Urgency Level',
      budget: 'Budget Range',
      timeline: 'Timeline',
      description: 'Description of your legal needs *',
      acceptTerms: 'I accept the terms and conditions *',
      acceptMarketing: 'I agree to receive marketing communications',
      submit: 'Submit Consultation Request',
      submitting: 'Submitting...',
      successTitle: 'Form submitted successfully!',
      successMessage: 'Thank you for your inquiry. We are opening Calendly so you can schedule your appointment.',
      successNote: 'If it doesn\'t open automatically, click the link below.',
      scheduleButton: 'Schedule Appointment on Calendly',
      urgencyOptions: {
        low: 'Low - No immediate action needed',
        normal: 'Normal - Standard processing time',
        high: 'High - Urgent matter',
        critical: 'Critical - Immediate attention required'
      },
      budgetOptions: {
        '': 'Select budget range',
        'under-5k': 'Under $5,000',
        '5k-10k': '$5,000 - $10,000',
        '10k-25k': '$10,000 - $25,000',
        '25k-50k': '$25,000 - $50,000',
        'over-50k': 'Over $50,000'
      },
      timelineOptions: {
        '': 'Select timeline',
        'immediate': 'Immediate (1-2 weeks)',
        'short': 'Short term (1-3 months)',
        'medium': 'Medium term (3-6 months)',
        'long': 'Long term (6+ months)'
      }
    },
    es: {
      title: 'Obtén Consulta Legal',
      subtitle: 'Completa el formulario a continuación y te responderemos en 24 horas.',
      name: 'Nombre Completo *',
      email: 'Correo Electrónico *',
      phone: 'Número de Teléfono',
      country: 'País',
      city: 'Ciudad',
      service: 'Tipo de Servicio',
      topic: 'Tema',
      urgency: 'Nivel de Urgencia',
      budget: 'Rango de Presupuesto',
      timeline: 'Cronograma',
      description: 'Descripción de tus necesidades legales *',
      acceptTerms: 'Acepto los términos y condiciones *',
      acceptMarketing: 'Acepto recibir comunicaciones de marketing',
      submit: 'Enviar Solicitud de Consulta',
      submitting: 'Enviando...',
      successTitle: '¡Formulario enviado exitosamente!',
      successMessage: 'Gracias por tu consulta. Estamos abriendo Calendly para que puedas programar tu cita.',
      successNote: 'Si no se abre automáticamente, haz clic en el enlace de abajo.',
      scheduleButton: 'Programar Cita en Calendly',
      urgencyOptions: {
        low: 'Baja - No se necesita acción inmediata',
        normal: 'Normal - Tiempo de procesamiento estándar',
        high: 'Alta - Asunto urgente',
        critical: 'Crítica - Atención inmediata requerida'
      },
      budgetOptions: {
        '': 'Seleccionar rango de presupuesto',
        'under-5k': 'Menos de $5,000',
        '5k-10k': '$5,000 - $10,000',
        '10k-25k': '$10,000 - $25,000',
        '25k-50k': '$25,000 - $50,000',
        'over-50k': 'Más de $50,000'
      },
      timelineOptions: {
        '': 'Seleccionar cronograma',
        'immediate': 'Inmediato (1-2 semanas)',
        'short': 'Corto plazo (1-3 meses)',
        'medium': 'Mediano plazo (3-6 meses)',
        'long': 'Largo plazo (6+ meses)'
      }
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {content.successTitle}
        </h3>
        <p className="text-green-700 mb-4">
          {content.successMessage}
        </p>
        <div className="text-sm text-green-600">
          {content.successNote}
        </div>
        <a 
          href="https://calendly.com/capital-m-law/initial-consultation-with-capital-m"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="mr-2">📅</span>
          {content.scheduleButton}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-semibold text-white">{content.title}</h3>
        <p className="text-blue-100 text-sm mt-1">{content.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.name}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.phone}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.country}
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.city}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Service Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.service}
            </label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.topic}
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.urgency}
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(content.urgencyOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.budget}
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(content.budgetOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {content.timeline}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(content.timelineOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {content.description}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={lang === 'es' ? 'Describe tus necesidades legales específicas...' : 'Describe your specific legal needs...'}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accept_terms"
              checked={formData.accept_terms}
              onChange={handleInputChange}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{content.acceptTerms}</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="accept_marketing"
              checked={formData.accept_marketing}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{content.acceptMarketing}</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? content.submitting : content.submit}
        </button>
      </form>
    </div>
  );
} 