import React from 'react';

interface HomePageCLKRProps {
  lang: 'en' | 'es';
  clkrServices?: any[];
}

const HomePageCLKR: React.FC<HomePageCLKRProps> = ({ lang, clkrServices = [] }) => {
  const title = lang === 'es' ? 'Centro de Recursos Legales' : 'Legal Resource Center';
  const subtitle = lang === 'es' 
    ? 'Accede a información legal especializada y recursos para tu caso'
    : 'Access specialized legal information and resources for your case';
  const ctaText = lang === 'es' ? 'Explorar Recursos' : 'Explore Resources';
  const ctaLink = lang === 'es' ? '/es/clkr' : '/en/clkr';

  // Get first 3 CLKR services for preview
  const previewServices = clkrServices.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {previewServices.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {service.title || `Service ${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {lang === 'es' ? 'Recurso Legal' : 'Legal Resource'}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {service.description || (lang === 'es' 
                  ? 'Información legal especializada para tu caso.'
                  : 'Specialized legal information for your case.'
                )}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {lang === 'es' ? 'Tiempo de lectura' : 'Reading time'}: {service.readingTime || '5 min'}
                </span>
                <span className="text-blue-600 text-sm font-medium">
                  {lang === 'es' ? 'Ver más' : 'Read more'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={ctaLink}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            {ctaText}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePageCLKR; 