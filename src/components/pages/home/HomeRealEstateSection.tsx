
// Property type
interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  image?: string;
  featured?: boolean;
}

// Real estate features type
interface RealEstateFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface HomeRealEstateSectionProps {
  properties: Property[];
  features: RealEstateFeature[];
  lang?: 'en' | 'es';
}

const HomeRealEstateSection = ({ properties = [], features = [], lang = 'en' }: HomeRealEstateSectionProps) => {
  // Get featured property
  const featuredProperty = properties.find(p => p.featured) || properties[0];

  // Section content
  const content = lang === 'es' ? {
    title: 'Inversión Inmobiliaria',
    subtitle: 'Tu puerta de entrada al mercado inmobiliario colombiano',
    cta: 'Explorar propiedades',
    description: 'Te ayudamos a encontrar la propiedad perfecta en Colombia. Desde apartamentos en Bogotá hasta casas en Medellín, tenemos las mejores opciones para inversores extranjeros.',
    features: 'Nuestros Servicios',
    featuredProperty: 'Propiedad Destacada',
    viewProperty: 'Ver propiedad',
    viewAll: 'Ver todas',
    details: 'Ver detalles',
    price: 'Precio',
    location: 'Ubicación',
    bedrooms: 'Habitaciones',
    bathrooms: 'Baños',
    area: 'Área',
    contactUs: 'Contáctanos',
  } : {
    title: 'Real Estate Investment',
    subtitle: 'Your gateway to the Colombian real estate market',
    cta: 'Explore properties',
    description: 'We help you find the perfect property in Colombia. From apartments in Bogotá to houses in Medellín, we have the best options for foreign investors.',
    features: 'Our Services',
    featuredProperty: 'Featured Property',
    viewProperty: 'View property',
    viewAll: 'View all',
    details: 'View details',
    price: 'Price',
    location: 'Location',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    area: 'Area',
    contactUs: 'Contact us',
  };

  // Default features if none provided
  const defaultFeatures: RealEstateFeature[] = [
    {
      id: '1',
      title: lang === 'es' ? 'Asesoría Legal' : 'Legal Advisory',
      description: lang === 'es' ? 'Asesoría completa en trámites legales para extranjeros' : 'Complete legal advisory for foreign investors',
      icon: '⚖️'
    },
    {
      id: '2',
      title: lang === 'es' ? 'Gestión de Inversión' : 'Investment Management',
      description: lang === 'es' ? 'Gestión integral de tu inversión inmobiliaria' : 'Comprehensive real estate investment management',
      icon: '📈'
    },
    {
      id: '3',
      title: lang === 'es' ? 'Financiamiento' : 'Financing',
      description: lang === 'es' ? 'Opciones de financiamiento para extranjeros' : 'Financing options for foreign investors',
      icon: '💰'
    },
    {
      id: '4',
      title: lang === 'es' ? 'Gestión de Propiedades' : 'Property Management',
      description: lang === 'es' ? 'Gestión completa de propiedades en alquiler' : 'Complete property management for rentals',
      icon: '🏠'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section className="relative py-32 bg-gradient-to-br from-primary via-primary/90 to-secondary/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/30"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Hero Content and Features */}
          <div className="lg:col-span-2">
            {/* Hero Content */}
            <div className="text-center mb-20">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4 9-4" />
                      <path d="M12 11l9-4M12 11v10M12 11L3 7" />
                    </svg>
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-white/10 blur-xl animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {content.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                {content.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href={lang === 'es' ? '/es/real-estate' : '/en/real-estate'} 
                  className="inline-block px-10 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 transform"
                >
                  {content.cta}
                </a>
                <a 
                  href={lang === 'es' ? '/es/contact' : '/en/contact'} 
                  className="inline-block px-10 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  {content.contactUs}
                </a>
              </div>
            </div>

            {/* Features Section */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">{content.features}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayFeatures.map((feature, idx) => (
                  <div key={feature.id} className="group bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 flex flex-col hover:bg-white/20 hover:scale-105 transition-all duration-300 transform">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl">{feature.icon}</span>
                      <h4 className="text-xl font-bold text-white">{feature.title}</h4>
                    </div>
                    <p className="text-white/80 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Featured Property */}
          {featuredProperty && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">{content.featuredProperty}</h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
                  <div className="space-y-4">
                    {/* Property Image */}
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-white/20 to-white/10">
                      {featuredProperty.image ? (
                        <img 
                          src={featuredProperty.image} 
                          alt={featuredProperty.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">🏠</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                          ⭐ {lang === 'es' ? 'Destacada' : 'Featured'}
                        </span>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-white line-clamp-2">{featuredProperty.title}</h4>
                      <p className="text-white/80 text-sm line-clamp-2">{featuredProperty.description}</p>
                      
                      {/* Property Details */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {featuredProperty.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-white/60">{content.price}:</span>
                            <span className="text-white font-semibold">{featuredProperty.price}</span>
                          </div>
                        )}
                        {featuredProperty.location && (
                          <div className="flex items-center gap-2">
                            <span className="text-white/60">{content.location}:</span>
                            <span className="text-white font-semibold">{featuredProperty.location}</span>
                          </div>
                        )}
                        {featuredProperty.bedrooms && (
                          <div className="flex items-center gap-2">
                            <span className="text-white/60">{content.bedrooms}:</span>
                            <span className="text-white font-semibold">{featuredProperty.bedrooms}</span>
                          </div>
                        )}
                        {featuredProperty.bathrooms && (
                          <div className="flex items-center gap-2">
                            <span className="text-white/60">{content.bathrooms}:</span>
                            <span className="text-white font-semibold">{featuredProperty.bathrooms}</span>
                          </div>
                        )}
                        {featuredProperty.area && (
                          <div className="flex items-center gap-2 col-span-2">
                            <span className="text-white/60">{content.area}:</span>
                            <span className="text-white font-semibold">{featuredProperty.area}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-2">
                        <a 
                          href={`/${lang}/real-estate/properties/${featuredProperty.slug}`} 
                          className="inline-block px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 text-sm font-semibold backdrop-blur-sm text-center"
                        >
                          {content.viewProperty}
                        </a>
                        <a 
                          href={`/${lang}/real-estate`} 
                          className="inline-block px-4 py-2 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all duration-300 text-sm font-medium text-center"
                        >
                          {content.viewAll}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeRealEstateSection; 