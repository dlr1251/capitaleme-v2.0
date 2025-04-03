import React from 'react';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';

const PROPERTIES = [
  {
    id: 'caldas',
    image: '/public/real_estate/cielo/vista_1.jpeg',
    title: 'Finca en Caldas',
    location: 'Caldas',
    price: '4,300,000,000 COP',
    area: '89,696 m²',
    visaEligible: true,
    amenities: ['Jacuzzi', 'Parking', '24/7 Security'],
    link: '/real-estate/properties/caldas'
  },
  {
    id: 'dakota',
    image: '/public/real_estate/dakota/vista_1.jpeg',
    title: 'Ciudadela Campestre Norteamérica',
    location: 'Bello',
    price: '639,000,000 COP',
    hoaFee: '603,000 COP',
    area: '2,329.61 m²',
    cadastralAppraisal: '285,020,000 COP',
    propertyTax: '326,000 COP',
    visaEligible: true,
    amenities: ['24/7 Security'],
    link: '/real-estate/properties/dakota'
  }
];

const ExplorePropertiesSection = () => {
  return (
    <section className="bg-white p-4 md:p-8 border rounded-lg">
      <h2 className="md:text-3xl font-bold text-primary mb-4 md:mb-8">
        Explore Properties
      </h2>
      
      <div className="space-y-4 mb-8">
        <p className="text-primary">
          If you are looking to find a good property in Medellín or in Colombia to buy it, 
          we have a good solution for you. We can assist you throughout the legal process 
          of title search, HOA, property taxes and some common commercial practices.
        </p>
        <p className="text-primary">
          If you are looking to sell, we have sometimes interested clients asking for 
          properties. However, we don't offer every kind of property and our service 
          is exclusive.
        </p>
      </div>

      <div className="container mx-auto flex max-w-screen-xl">
        {/* Filters - Hidden for now but kept for future use */}
        <PropertyFilters className="w-full md:w-1/4 p-6 rounded-lg shadow-lg hidden" />

        {/* Property Cards Grid */}
        <div className="w-full h-screen overflow-y-auto md:w-4/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
          {PROPERTIES.map(property => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorePropertiesSection;
