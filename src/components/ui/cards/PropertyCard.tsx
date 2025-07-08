// Type definitions
interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  hoaFee?: string;
  area: string;
  cadastralAppraisal?: string;
  propertyTax?: string;
  visaEligible?: boolean;
  amenities?: string[];
  link: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  status: 'available' | 'sold' | 'pending';
  gallery?: string[];
}

import { useState } from 'react';

const PropertyCard = ({
  image,
  title,
  location,
  price,
  hoaFee,
  area,
  cadastralAppraisal,
  propertyTax,
  visaEligible,
  amenities,
  link,
  bedrooms,
  bathrooms,
  propertyType,
  status,
  gallery = []
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasGallery = Array.isArray(gallery) && gallery.length > 0;
  const images = hasGallery ? gallery : [image];
  const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToImage = (index: number) => setCurrentImageIndex(index);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'sold':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Gallery Carousel */}
        <div className="relative mb-4">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="rounded-lg w-full h-48 object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                {images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <span className="text-gray-400">📍</span>
          {location}
        </p>
        <p className="text-lg font-semibold text-secondary">{price}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {bedrooms && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🛏️</span>
              {bedrooms} bed
            </span>
          )}
          {bathrooms && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🚿</span>
              {bathrooms} bath
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="text-gray-400">📐</span>
            {area}
          </span>
        </div>
        {propertyType && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <span className="text-gray-400">🏠</span>
            {propertyType}
          </p>
        )}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity: string, index: number) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{amenities.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      <a 
        href={link} 
        className="block w-full text-center bg-secondary text-white py-2 px-4 rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
      >
        View Details
      </a>
    </div>
  );
};

export default PropertyCard; 