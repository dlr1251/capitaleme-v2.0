import PropertyCard from '../../ui/cards/PropertyCard.tsx';
import PropertyFilters from '../../ui/forms/PropertyFilters.tsx';

interface Property {
  id: string;
  data: {
    mainImage: string;
    title: string;
    location: string;
    price: {
      usd: number;
      cop: number;
    };
    area: {
      total: number;
      unit: string;
    };
    features?: string[];
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    status?: string;
  };
}

interface ExplorePropertiesSectionProps {
  properties: Property[];
}

const ExplorePropertiesSection = ({ properties = [] }: ExplorePropertiesSectionProps) => {
  // Transform properties from content collection to match PropertyCard props
  const transformedProperties = (properties || []).map((property: Property) => ({
    id: property.id,
    image: property.data.mainImage,
    title: property.data.title,
    location: property.data.location,
    price: {
      usd: property.data.price.usd,
      cop: property.data.price.cop,
    },
    area: `${property.data.area.total} ${property.data.area.unit}`,
    visaEligible: true, // Default to true for now
    amenities: property.data.features || [],
    link: `/es/real-estate/properties/${property.id}`,
    bedrooms: property.data.bedrooms,
    bathrooms: property.data.bathrooms,
    propertyType: property.data.propertyType,
    status: (typeof property.data.status === 'string' && ['available', 'sold', 'pending'].includes(property.data.status)
      ? property.data.status
      : 'available') as 'available' | 'sold' | 'pending',
  }));

  return (
    <section className="bg-white p-4 md:p-8 border rounded-lg">
      <h2 className="md:text-3xl font-bold text-primary mb-4 md:mb-8">
        Explorar Propiedades
      </h2>
      
      <div className="space-y-4 mb-8">
        <p className="text-primary">
          Si estás buscando encontrar una buena propiedad en Medellín o en Colombia para comprarla, 
          tenemos una buena solución para ti. Podemos asistirte durante todo el proceso legal 
          de búsqueda de títulos, administración, impuestos de propiedad y algunas prácticas comerciales comunes.
        </p>
        <p className="text-primary">
          Si estás buscando vender, a veces tenemos clientes interesados preguntando por 
          propiedades. Sin embargo, no ofrecemos todo tipo de propiedades y nuestro servicio 
          es exclusivo.
        </p>
      </div>

      <div className="container mx-auto flex max-w-screen-xl">
        {/* Filters - Hidden for now but kept for future use */}
        <PropertyFilters className="w-full md:w-1/4 p-6 rounded-lg shadow-lg hidden" />

        {/* Property Cards Grid */}
        <div className="w-full h-screen overflow-y-auto md:w-4/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
          {transformedProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorePropertiesSection; 