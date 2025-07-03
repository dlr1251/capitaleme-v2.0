import { useState } from 'react';

interface CLKRConsultationFormProps {
  topic?: string;
  category?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  service: string;
  topic: string;
  urgency: string;
  budget: string;
  timeline: string;
  description: string;
  accept_terms: boolean;
  accept_marketing: boolean;
}

export default function CLKRConsultationForm({ topic, category }: CLKRConsultationFormProps) {
  const [formData, setFormData] = useState<FormData>({
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let checked = false;
    if ('checked' in e.target) {
      checked = e.target.checked;
    }
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
      
      alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ¡Formulario enviado exitosamente!
        </h3>
        <p className="text-green-700 mb-4">
          Gracias por tu consulta. Estamos abriendo Calendly para que puedas agendar tu cita.
        </p>
        <div className="text-sm text-green-600">
          Si no se abre automáticamente, haz clic en el enlace de abajo.
        </div>
        <a 
          href="https://calendly.com/capital-m-law/initial-consultation-with-capital-m"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="mr-2">📅</span>
          Agendar Cita en Calendly
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">📞</span>
          <div>
            <h3 className="text-white font-semibold text-lg">Consulta Personalizada</h3>
            <p className="text-blue-100 text-sm">Completa el formulario y agenda tu cita</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+57 300 123 4567"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona tu país</option>
                <option value="Colombia">Colombia</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Canadá">Canadá</option>
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Perú">Perú</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu ciudad"
              />
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🛂</span>
            Información del Servicio
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona el servicio</option>
                <option value="Visas">Visas</option>
                <option value="Bienes Raíces">Bienes Raíces</option>
                <option value="Trámites Legales">Trámites Legales</option>
                <option value="Consultoría Legal">Consultoría Legal</option>
                <option value="Apostilla">Apostilla</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Tema Específico
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Visa de trabajo, Compra de propiedad, etc."
              />
            </div>
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                Urgencia
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baja">Baja - Sin prisa</option>
                <option value="normal">Normal - En las próximas semanas</option>
                <option value="alta">Alta - En los próximos días</option>
                <option value="urgente">Urgente - Inmediato</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Timeline Esperado
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona timeline</option>
                <option value="1-2 semanas">1-2 semanas</option>
                <option value="1 mes">1 mes</option>
                <option value="2-3 meses">2-3 meses</option>
                <option value="3-6 meses">3-6 meses</option>
                <option value="6+ meses">6+ meses</option>
                <option value="No definido">No definido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Presupuesto Aproximado (USD)
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona presupuesto</option>
            <option value="Menos de $500">Menos de $500</option>
            <option value="$500 - $1,000">$500 - $1,000</option>
            <option value="$1,000 - $2,000">$1,000 - $2,000</option>
            <option value="$2,000 - $5,000">$2,000 - $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="Más de $10,000">Más de $10,000</option>
            <option value="Por discutir">Por discutir</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Detallada *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cuéntanos más sobre tu situación específica, necesidades y cualquier detalle relevante que nos ayude a preparar mejor la consulta..."
            required
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              id="accept_terms"
              name="accept_terms"
              type="checkbox"
              checked={formData.accept_terms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="accept_terms" className="ml-3 text-sm text-gray-700">
              He leído y acepto los{' '}
              <a href="/es/terms" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                Términos y Condiciones
              </a>{' '}
              y la{' '}
              <a href="/es/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                Política de Privacidad
              </a>
              *
            </label>
          </div>
          
          <div className="flex items-start">
            <input
              id="accept_marketing"
              name="accept_marketing"
              type="checkbox"
              checked={formData.accept_marketing}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="accept_marketing" className="ml-3 text-sm text-gray-700">
              Acepto recibir información sobre servicios legales y actualizaciones (opcional)
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center px-6 py-4 text-white font-semibold rounded-lg transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <span className="mr-2">📅</span>
                Enviar Consulta y Agendar Cita
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Después de enviar el formulario, serás redirigido a Calendly para agendar tu cita.</p>
        </div>
      </form>
    </div>
  );
} 