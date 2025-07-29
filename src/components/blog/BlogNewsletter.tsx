import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface BlogNewsletterProps {
  lang?: 'en' | 'es';
}

const BlogNewsletter: React.FC<BlogNewsletterProps> = ({
  lang = 'en'
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const textContent = {
    en: {
      title: 'Stay Updated',
      subtitle: 'Get the latest legal insights and updates delivered to your inbox.',
      description: 'Join our community of readers and never miss important updates about immigration, business, and legal matters in Colombia.',
      placeholder: 'Enter your email address',
      button: 'Subscribe',
      buttonLoading: 'Subscribing...',
      success: 'Successfully subscribed!',
      error: 'Something went wrong. Please try again.',
      privacy: 'We respect your privacy. Unsubscribe at any time.',
      features: [
        'Weekly legal insights',
        'Immigration updates',
        'Business tips',
        'Exclusive content'
      ]
    },
    es: {
      title: 'Mantente Actualizado',
      subtitle: 'Recibe las últimas perspectivas legales y actualizaciones en tu bandeja de entrada.',
      description: 'Únete a nuestra comunidad de lectores y nunca te pierdas actualizaciones importantes sobre inmigración, negocios y asuntos legales en Colombia.',
      placeholder: 'Ingresa tu dirección de email',
      button: 'Suscribirse',
      buttonLoading: 'Suscribiendo...',
      success: '¡Suscrito exitosamente!',
      error: 'Algo salió mal. Por favor intenta de nuevo.',
      privacy: 'Respetamos tu privacidad. Cancela la suscripción en cualquier momento.',
      features: [
        'Perspectivas legales semanales',
        'Actualizaciones de inmigración',
        'Consejos de negocios',
        'Contenido exclusivo'
      ]
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 1500);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 opacity-30"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <EnvelopeIcon className="w-4 h-4 mr-2" />
            {lang === 'es' ? 'Newsletter' : 'Newsletter'}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {content.subtitle}
          </p>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        {/* Newsletter Form */}
        <div className={`bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder={content.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  status === 'loading' || !email
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                }`}
              >
                {status === 'loading' ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {content.buttonLoading}
                  </div>
                ) : (
                  content.button
                )}
              </button>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <CheckIcon className="w-5 h-5 mr-2" />
                {content.success}
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                {content.error}
              </div>
            )}

            <p className="text-sm text-gray-500 text-center">
              {content.privacy}
            </p>
          </form>
        </div>

        {/* Features Grid */}
        <div className={`mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {content.features.map((feature, index) => (
            <div
              key={feature}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease-out ${index * 100}ms`
              }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletter; 