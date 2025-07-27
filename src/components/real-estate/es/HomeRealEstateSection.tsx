import { HomeModernIcon, BuildingStorefrontIcon, ArrowTrendingUpIcon, KeyIcon, UsersIcon } from '@heroicons/react/24/solid';
import PropertyCard from '../../ui/cards/PropertyCard.tsx';
import { useEffect, useState } from 'react';

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
  featuredProperty: any;
  features: RealEstateFeature[];
  lang?: 'en' | 'es';
}

const HomeRealEstateSection = ({ featuredProperty, features = [], lang = 'en' }: HomeRealEstateSectionProps) => {
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

  // Carousel state for featured property gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const gallery = featuredProperty?.gallery || (featuredProperty?.image ? [featuredProperty.image] : []);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative py-32 bg-gradient-to-br from-primary via-primary/90 to-secondary/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/30"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Hero Content and Features */}
          <div>
            {/* Hero Content */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                  <HomeModernIcon className="w-8 h-8 text-white" />
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Real Estate
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
                We assist you through your property search, negotiation, title search and legal due diligence with compliance with local regulations.
              </p>
              <div className="flex justify-center items-center">
                <a 
                  href={lang === 'es' ? '/es/real-estate' : '/en/real-estate'} 
                  className="inline-block px-10 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 transform"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Property */}
          {featuredProperty && (
            <div>
              {/* Image Carousel replaces PropertyCard image */}
              <PropertyCard
                image={gallery[currentImageIndex]}
                title={featuredProperty.title}
                location={featuredProperty.location}
                price={featuredProperty.price}
                area={featuredProperty.area || ''}
                link={featuredProperty.href}
                status={'available'}
                gallery={gallery}
              />
            </div>
          )}
        </div>

        {/* Services Section - 4 columns at the bottom */}
        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center bg-white/10 rounded-xl p-6 border border-white/20">
              <KeyIcon className="w-8 h-8 text-white mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">Buying Property</h4>
              <p className="text-white/80 text-center">Guidance through thezx entire purchase process, from search to closing.</p>
            </div>
            <div className="flex flex-col items-center bg-white/10 rounded-xl p-6 border border-white/20">
              <ArrowTrendingUpIcon className="w-8 h-8 text-white mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">Selling Property</h4>
              <p className="text-white/80 text-center">Professional support to market and sell your property efficiently.</p>
            </div>
            <div className="flex flex-col items-center bg-white/10 rounded-xl p-6 border border-white/20">
              <BuildingStorefrontIcon className="w-8 h-8 text-white mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">Renting Property</h4>
              <p className="text-white/80 text-center">Legal and practical assistance for property rentals and tenant management.</p>
            </div>
            <div className="flex flex-col items-center bg-white/10 rounded-xl p-6 border border-white/20">
              <UsersIcon className="w-8 h-8 text-white mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">HOA Representation</h4>
              <p className="text-white/80 text-center">Expert legal representation for Homeowners Associations (HOA).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeRealEstateSection; 