import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, UserIcon, PaperClipIcon, ChatBubbleLeftRightIcon, ListBulletIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface ContactFormProps {
  lang?: 'en' | 'es';
  compact?: boolean;
}

export default function ContactForm({ lang = 'en', compact = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    accepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

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
        label: "Teléfono",
        placeholder: "+57 300 123 4567",
        error: "Por favor ingresa tu número de teléfono"
      },
      service: {
        label: "Servicio de interés",
        placeholder: "Selecciona un servicio"
      },
      message: {
        label: "Tu mensaje",
        placeholder: "Cuéntanos sobre tu situación legal...",
        error: "Por favor ingresa tu mensaje"
      },
      attachments: {
        label: "Adjuntar archivos (opcional)",
        help: "PDF, JPG, PNG, hasta 10MB total"
      },
      terms: {
        label: "Confirmo que acepto los términos y condiciones",
        error: "Debes aceptar los términos y condiciones"
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
        label: "Phone",
        placeholder: "+1 234 567 8900",
        error: "Please enter your phone number"
      },
      service: {
        label: "Service of interest",
        placeholder: "Select a service"
      },
      message: {
        label: "Your Message",
        placeholder: "Tell us about your legal situation...",
        error: "Please enter your message"
      },
      attachments: {
        label: "Attach files (optional)",
        help: "PDF, JPG, PNG, up to 10MB total"
      },
      terms: {
        label: "I confirm that I accept the terms and conditions",
        error: "You must accept the terms and conditions"
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
    
    if (!formData.phone.trim()) {
      newErrors.phone = content.fields.phone.error;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = content.fields.message.error;
    }
    
    if (!formData.accepted) {
      newErrors.accepted = content.fields.terms.error;
    }

    if (attachments && attachments.length > 0) {
      const totalBytes = attachments.reduce((sum, f) => sum + f.size, 0);
      const maxBytes = 10 * 1024 * 1024;
      if (totalBytes > maxBytes) {
        newErrors.attachments = lang === 'es' ? 'El tamaño total de los archivos no debe exceder 10MB' : 'Total attachment size must not exceed 10MB';
      }
      const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
      const invalid = attachments.find(f => !allowed.includes(f.type));
      if (invalid) {
        newErrors.attachments = lang === 'es' ? 'Solo se permiten PDF, JPG y PNG' : 'Only PDF, JPG, and PNG are allowed';
      }
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
    setSubmitError(null);
    
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('phone', formData.phone);
      form.append('service', formData.service);
      form.append('message', formData.message);
      form.append('accepted', formData.accepted ? 'true' : 'false');
      attachments.forEach((file) => {
        form.append('files', file, file.name);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Request failed');
      }
      setSubmitSuccess(true);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error?.message || content.error);
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments(files);
    if (errors.attachments) {
      setErrors(prev => ({
        ...prev,
        attachments: ''
      }));
    }
  };

  if (submitSuccess) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-8 border-b border-gray-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-gray-600">{content.subtitle}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 lg:p-8" encType="multipart/form-data">
          <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-1'}`}>
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {content.fields.name.label} *
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={content.fields.name.placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 ${
                      errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {content.fields.email.label} *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={content.fields.email.placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 ${
                      errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {content.fields.phone.label} *
                </label>
                <div className="relative">
                  <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={content.fields.phone.placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 ${
                      errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className={`space-y-6 ${compact ? 'mt-6' : ''}`}>
              {/* Service Field */}
              <div className="space-y-2">
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                  {content.fields.service.label}
                </label>
                <div className="relative">
                  <ListBulletIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  >
                    <option value="">{content.fields.service.placeholder}</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {content.fields.message.label} *
                </label>
                <div className="relative">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={content.fields.message.placeholder}
                    rows={6}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder-gray-400 resize-none ${
                      errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                  {content.fields.attachments.label}
                </label>
                <div className="relative">
                  <PaperClipIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="files"
                    name="files"
                    type="file"
                    multiple
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500">{content.fields.attachments.help}</p>
                {errors.attachments && (
                  <p className="text-red-500 text-sm mt-1">{errors.attachments}</p>
                )}
              </div>

              {/* Terms */}
              <div className="space-y-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="accepted"
                    checked={formData.accepted}
                    onChange={handleCheckboxChange}
                    className={`mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${errors.accepted ? 'border-red-300' : ''}`}
                  />
                  <span className="text-sm text-gray-700">
                    {content.fields.terms.label} *
                    {' '}
                    <a
                      href={lang === 'es' ? '/es/terms' : '/en/terms'}
                      className="underline text-primary hover:text-primary/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lang === 'es' ? 'Términos' : 'Terms'}
                    </a>
                    {' '}&
                    {' '}
                    <a
                      href={lang === 'es' ? '/es/privacy' : '/en/privacy'}
                      className="underline text-primary hover:text-primary/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lang === 'es' ? 'Privacidad' : 'Privacy Policy'}
                    </a>
                  </span>
                </label>
                {errors.accepted && (
                  <p className="text-red-500 text-sm mt-1">{errors.accepted}</p>
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
            {submitError && (
              <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
                {content.error}
              </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-3">
              {content.privacy}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 