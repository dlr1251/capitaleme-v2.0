import React, { useState } from 'react';

interface RealEstateMegaMenuProps {
  lang?: string;
  menuData?: any;
}

const RealEstateMegaMenu: React.FC<RealEstateMegaMenuProps> = ({ lang, menuData = {} }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const featuredProperty = menuData.featuredProperty || {
    title: 'Finca en Caldas',
    href: lang === 'en' ? '/en/real-estate/properties/cielo' : '/es/real-estate/properties/cielo',
    images: [
      '/images/real-estate/cielo/vista_1.jpeg',
      '/images/real-estate/cielo/vista_2.jpeg',
      '/images/real-estate/cielo/vista_3.jpeg',
      '/images/real-estate/cielo/vista_4.jpeg',
      '/images/real-estate/cielo/vista_5.jpeg',
      '/images/real-estate/cielo/vista_6.jpeg',
      '/images/real-estate/cielo/vista_7.jpeg',
      '/images/real-estate/cielo/vista_8.jpeg'
    ],
    price: '$180,000 USD',
    pricePerM2: '$1,500 USD/m²',
    location: 'Medellín, Colombia',
    area: '120m²',
  };

  const realEstateArticles = menuData.realEstateArticles || [
    { title: lang === 'en' ? 'Real Estate vs Business Visa' : 'Inmobiliario vs Visa de Negocios', href: lang === 'en' ? '/en/clkr/real-estate-vs-business-visa' : '/es/clkr/real-estate-vs-business-visa' },
    { title: lang === 'en' ? 'Realtors in Colombia' : 'Agentes Inmobiliarios en Colombia', href: lang === 'en' ? '/en/clkr/realtors-in-colombia' : '/es/clkr/realtors-in-colombia' },
    { title: lang === 'en' ? 'Property Investment Guide' : 'Guía de Inversión Inmobiliaria', href: lang === 'en' ? '/en/clkr/property-investment-guide' : '/es/clkr/property-investment-guide' },
    { title: lang === 'en' ? 'Legal Requirements for Foreign Buyers' : 'Requisitos Legales para Compradores Extranjeros', href: lang === 'en' ? '/en/clkr/legal-requirements-foreign-buyers' : '/es/clkr/legal-requirements-foreign-buyers' },
    { title: lang === 'en' ? 'Tax Implications of Real Estate Investment' : 'Implicaciones Fiscales de la Inversión Inmobiliaria', href: lang === 'en' ? '/en/clkr/tax-implications-real-estate' : '/es/clkr/tax-implications-real-estate' },
    { title: lang === 'en' ? 'Due Diligence Process' : 'Proceso de Debida Diligencia', href: lang === 'en' ? '/en/clkr/due-diligence-process' : '/es/clkr/due-diligence-process' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (featuredProperty.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (featuredProperty.images?.length || 1) - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Featured Property with Carousel */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {lang === 'en' ? 'Featured Property' : 'Propiedad Destacada'}
          </h3>
          <div className="flex-1 flex flex-col">
            {featuredProperty ? (
              <div className="group flex-1 flex flex-col">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <div className="relative h-48">
                    <img 
                      src={featuredProperty.images?.[currentImageIndex] || featuredProperty.image} 
                      alt={featuredProperty.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={prevImage}
                        className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <button 
                        onClick={nextImage}
                        className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {(featuredProperty.images || [featuredProperty.image]).map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {featuredProperty.title}
                    </h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-secondary to-primary text-white shadow-sm">
                      🏷️ {lang === 'en' ? 'For Sale' : 'En Venta'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">💰 {featuredProperty.price}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center">
                        📐 {featuredProperty.area || '120m²'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        📊 {lang === 'en' ? 'Price per m²:' : 'Precio por m²:'} {featuredProperty.pricePerM2}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 flex items-center">
                      📍 {featuredProperty.location}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <a href="https://calendly.com/capital-m-law/programmed-initial-consultation?back=1&month=2025-07" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {lang === 'en' ? 'Visit Now' : 'Visitar Ahora'}
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm p-3 flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  {lang === 'en' ? 'No featured properties available at the moment.' : 'No hay propiedades destacadas disponibles en este momento.'}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Column 2: Real Estate Practice Information */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {lang === 'en' ? 'Our Real Estate Practice' : 'Nuestra Práctica Inmobiliaria'}
          </h3>
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">⚖️</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">
                    {lang === 'en' ? 'Legal Expertise' : 'Experiencia Legal'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'en' ? 'We are lawyers specializing in real estate law, title studies, and contract negotiation.' : 'Somos abogados especializados en derecho inmobiliario, estudio de títulos y negociación de contratos.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🏠</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">
                    {lang === 'en' ? 'Property Sales' : 'Venta de Propiedades'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'en' ? 'We help clients sell their properties through our professional platform.' : 'Ayudamos a nuestros clientes a vender sus propiedades a través de nuestra plataforma profesional.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">💼</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">
                    {lang === 'en' ? 'International Transfers' : 'Transferencias Internacionales'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'en' ? 'Expert guidance on international money transfers and financial transactions.' : 'Orientación experta en transferencias internacionales y transacciones financieras.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                {lang === 'en' ? 'List Your Property' : 'Lista Tu Propiedad'}
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                {lang === 'en' ? 'Let us help you sell your property with our professional services.' : 'Déjanos ayudarte a vender tu propiedad con nuestros servicios profesionales.'}
              </p>
              <a href={lang === 'en' ? '/en/contact' : '/es/contact'} className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-xs font-medium">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                {lang === 'en' ? 'Contact Us' : 'Contáctanos'}
              </a>
            </div>
          </div>
        </div>
        
        {/* Column 3: CLKR Articles/Resources */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            {lang === 'en' ? 'Real Estate Resources' : 'Recursos Inmobiliarios'}
          </h3>
          <div className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
              {realEstateArticles.length > 0 ? (
                realEstateArticles.map((article: any, index: number) => (
                  <a key={article.href} href={article.href} className="block group p-3 rounded-lg hover:bg-gray-50 border border-gray-100 hover:border-secondary transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary text-sm line-clamp-2 transition-colors duration-200">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            5 min read
                          </span>      
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-gray-500 text-sm p-4 text-center flex-1 flex items-center justify-center">
                  {lang === 'en' ? 'No real estate articles available at the moment.' : 'No hay artículos inmobiliarios disponibles en este momento.'}
                </div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <a href={lang === 'en' ? '/en/real-estate' : '/es/real-estate'} className="inline-flex items-center justify-center w-full bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary text-sm font-medium transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                </svg>
                {lang === 'en' ? 'Learn more about Real Estate' : 'Más información sobre Inmobiliario'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateMegaMenu; 