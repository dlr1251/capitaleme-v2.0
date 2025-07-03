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
  status: string;
}

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
  amenities = [],
  link,
  bedrooms,
  bathrooms,
  propertyType,
  status
}: PropertyCardProps) => {
  const getStatusColor = (status: string): string => {
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

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'sold':
        return 'Vendida';
      case 'pending':
        return 'Pendiente';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="rounded-lg mb-4 w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
          {getStatusText(status)}
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
              {bedrooms} hab
            </span>
          )}
          {bathrooms && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🚿</span>
              {bathrooms} baño
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
              <span className="text-xs text-gray-500">+{amenities.length - 3} más</span>
            )}
          </div>
        )}
      </div>

      <a 
        href={link} 
        className="block w-full text-center bg-secondary text-white py-2 px-4 rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
      >
        Ver Detalles
      </a>
    </div>
  );
};

export default PropertyCard; 