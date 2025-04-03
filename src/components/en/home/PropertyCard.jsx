import React from 'react';

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
  link
}) => {
  return (
    <div className="bg-white rounded-sm border border-gray-200 p-4">
      <img
        src={image}
        alt={title}
        className="rounded-sm mb-4 w-full h-48 object-cover"
      />
      <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
      
      <div className="space-y-1">
        <p className="text-sm text-gray-600">Location: {location}</p>
        <p className="text-sm text-gray-600">Price: {price}</p>
        {hoaFee && (
          <p className="text-sm text-gray-600">HOA Monthly Fee: {hoaFee}</p>
        )}
        <p className="text-sm text-gray-600">Area: {area}</p>
        {cadastralAppraisal && (
          <p className="text-sm text-gray-600">Cadastral Appraisal: {cadastralAppraisal}</p>
        )}
        {propertyTax && (
          <p className="text-sm text-gray-600">Yearly property tax: {propertyTax}</p>
        )}
        <p className="text-sm text-gray-600">Visa Eligible: {visaEligible ? 'Yes' : 'No'}</p>
        <p className="text-sm text-gray-600">Amenities: {amenities.join(', ')}</p>
      </div>

      <a 
        href={link} 
        className="text-secondary hover:underline mt-4 block"
      >
        View Details
      </a>
    </div>
  );
};

export default PropertyCard; 