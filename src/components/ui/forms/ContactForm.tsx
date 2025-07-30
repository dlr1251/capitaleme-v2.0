import React, { useState } from 'react';

interface ContactFormProps {
  lang?: 'en' | 'es';
}

export default function ContactForm({ lang = 'en' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const content = lang === 'es' ? {
    title: "Hablemos de tu caso",
    subtitle: "Cuéntanos sobre tu situación y te responderemos en menos de 24 horas",
    fields: {
      name: {
        label: "Nombre completo",
        placeholder: "Tu nombre completo",
        error: "Por favor ingresa tu nombre completo"
      },
      email: {
        label: "Correo electrónico", 
        placeholder: "tu@email.com",
        error: "Por favor ingresa un correo electrónico válido"
      },
      phone: {
        label: "Teléfono (opcional)",
        placeholder: "+57 300 123 4567"
      },
      service: {
        label: "Servicio de interés",
        placeholder: "Selecciona un servicio"
      },
      message: {
        label: "Tu mensaje",
        placeholder: "Cuéntanos sobre tu situación legal...",
        error: "Por favor ingresa tu mensaje"
      }
    },
    submit: "Enviar mensaje",
    submitting: "Enviando...",
    success: "¡Mensaje enviado exitosamente!",
    error: "Hubo un error al enviar el mensaje. Por favor intenta de nuevo.",
    privacy: "Al enviar este formulario, aceptas nuestra política de privacidad"
  } : {
    title: "Let's talk about your case",
    subtitle: "Tell us about your situation and we'll get back to you within 24 hours",
    fields: {
      name: {
        label: "Full Name",
        placeholder: "Your full name",
        error: "Please enter your full name"
      },
      email: {
        label: "Email Address",
        placeholder: "your@email.com",
        error: "Please enter a valid email address"
      },
      phone: {
        label: "Phone (optional)",
        placeholder: "+1 234 567 8900"
      },
      service: {
        label: "Service of interest",
        placeholder: "Select a service"
      },
      message: {
        label: "Your Message",
        placeholder: "Tell us about your legal situation...",
        error: "Please enter your message"
      }
    },
    submit: "Send Message",
    submitting: "Sending...",
    success: "Message sent successfully!",
    error: "There was an error sending the message. Please try again.",
    privacy: "By submitting this form, you agree to our privacy policy"
  };

  const services = lang === 'es' ? [
    "Visas e Inmigración",
    "Transacciones Inmobiliarias",
    "Asesoría Legal",
    "Protección Empresarial",
    "Otro"
  ] : [
    "Visas & Immigration",
    "Real Estate Transactions", 
    "Legal Consultation",
    "Business Protection",
    "Other"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = content.fields.name.error;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = content.fields.email.error;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = content.fields.email.error;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = content.fields.message.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (submitSuccess) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 border-b border-gray-100">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">✓ {content.success}</h3>
              <p className="text-green-100">{content.subtitle}</p>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-600">
                {lang === 'es' 
                  ? 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.'
                  : 'Thank you for contacting us. We will get back to you soon.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-8 border-b border-gray-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-gray-600">{content.subtitle}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {content.fields.name.label} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={content.fields.name.placeholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {content.fields.email.label} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={content.fields.email.placeholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {content.fields.phone.label}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={content.fields.phone.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Service Field */}
              <div className="space-y-2">
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                  {content.fields.service.label}
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                >
                  <option value="">{content.fields.service.placeholder}</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {content.fields.message.label} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={content.fields.message.placeholder}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 resize-none ${
                    errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? content.submitting : content.submit}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              {content.privacy}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 