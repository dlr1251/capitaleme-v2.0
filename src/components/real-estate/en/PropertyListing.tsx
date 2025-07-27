import { useState } from 'react';

// Type definitions
interface Property {
  id: string;
  data?: {
    title?: string;
    mainImage?: string;
    status?: string;
    propertyType?: string;
    location?: string;
    price?: {
      usd?: number;
      cop?: number;
    };
    area?: {
      total?: number;
      unit?: string;
    };
    features?: string[];
    bedrooms?: number;
    bathrooms?: number;
  };
  [key: string]: any;
}

interface PropertyListingProps {
  properties: Property[];
}

const PropertyCard = ({ property }: { property: Property }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceCOP = (price: number | undefined) => {
    if (!price) return 'Precio no disponible';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle both Astro collection structure and serialized structure
  const propertyData = property.data || property;
  const propertyId = property.id;

  // Safe access to nested properties
  const price = propertyData?.price || {};
  const area = propertyData?.area || {};
  const features = propertyData?.features || [];

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={propertyData?.mainImage || '/images/placeholder.jpg'}
          alt={propertyData?.title || 'Property'}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            propertyData?.status === 'available' 
              ? 'bg-green-500 text-white' 
              : propertyData?.status === 'sold' 
                ? 'bg-red-500 text-white' 
                : 'bg-yellow-500 text-white'
          }`}>
            {propertyData?.status === 'available' ? 'Available' : 
             propertyData?.status === 'sold' ? 'Sold' : 'Pending'}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
            {propertyData?.propertyType || 'Property'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{propertyData?.title || 'Property Title'}</h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {propertyData?.location || 'Location not specified'}
        </p>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-primary">{formatPrice(price.usd)}</div>
          <div className="text-sm text-gray-600">{formatPriceCOP(price.cop)}</div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-primary">{area.total || 'N/A'} {area.unit || 'm²'}</div>
            <div className="text-gray-600">Area</div>
          </div>
          {propertyData?.bedrooms && (
            <div className="text-center">
              <div className="font-semibold text-primary">{propertyData.bedrooms}</div>
              <div className="text-gray-600">Bedrooms</div>
            </div>
          )}
          {propertyData?.bathrooms && (
            <div className="text-center">
              <div className="font-semibold text-primary">{propertyData.bathrooms}</div>
              <div className="text-gray-600">Bathrooms</div>
            </div>
          )}
        </div>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 3).map((feature: string, index: number) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <a
          href={`/en/real-estate/properties/${propertyId}`}
          className="block w-full bg-secondary text-white text-center py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

const PropertyListing = ({ properties }: PropertyListingProps) => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-low');

  const filteredProperties = properties.filter(property => {
    const propertyData = property.data || property;
    if (filter === 'all') return true;
    if (filter === 'available') return propertyData?.status === 'available';
    if (filter === 'sold') return propertyData?.status === 'sold';
    if (filter === 'pending') return propertyData?.status === 'pending';
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aData = a.data || a;
    const bData = b.data || b;
    
    const aPrice = aData?.price?.usd || 0;
    const bPrice = bData?.price?.usd || 0;
    const aArea = aData?.area?.total || 0;
    const bArea = bData?.area?.total || 0;
    
    switch (sortBy) {
      case 'price-low':
        return aPrice - bPrice;
      case 'price-high':
        return bPrice - aPrice;
      case 'area-low':
        return aArea - bArea;
      case 'area-high':
        return bArea - aArea;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Filters and Sort */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'available' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'sold' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sold
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="area-low">Area: Low to High</option>
          <option value="area-high">Area: High to Low</option>
        </select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProperties.map((property) => (
          <PropertyCard key={property.id || Math.random()} property={property} />
        ))}
      </div>

      {sortedProperties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more properties.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListing; 