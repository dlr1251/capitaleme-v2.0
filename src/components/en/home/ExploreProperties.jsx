import React from 'react';

const ExplorePropertiesSection = () => {
  return (
    <section className="bg-white py-8 px-8 border rounded-lg">
      <h2 className="text-3xl font-bold text-primary mb-8">Explore Properties</h2>
      <p className="text-primary mb-4">
        If you are looking to find a good property in Medellín or in Colombia to buy it, we have a good solution for you. We can assist you throughout the legal process of title search, HOA, property taxes and some common commercial practices.
      </p>
      <p className="text-primary mb-4">
        If you are looking to sell, we have sometimes interested clients asking for properties. However, we don't offer every kind of property and our service is exclusive.
      </p>
      <div className="container mx-auto flex max-w-screen-xl">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4 p-6 rounded-lg shadow-lg hidden">
          <div className="mb-4">
            <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
              <option value="">Barrio</option>
              <option value="medellin">Laureles</option>
              <option value="bogota">Envigado</option>
              <option value="antioquia">Antioquia</option>
              {/* Add more location options here */}
            </select>
          </div>
          <div className="mb-4">
            <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
              <option value="">Price Range</option>
              <option value="range1">$50,000 - $100,000</option>
              <option value="range2">$100,000 - $200,000</option>
              {/* Add more price range options here */}
            </select>
          </div>
          <div className="mb-4">
            <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
              <option value="">Area (m2)</option>
              <option value="area1">50 - 100 m²</option>
              <option value="area2">100- 150 m²</option>
              {/* Add more area options here */}
            </select>
          </div>
          <div className="mb-4">
            <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
              <option value=""># of Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              {/* Add more bedroom options here */}
            </select>
          </div>
          <div className="mb-4">
            <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
              <option value=""># of Bathrooms</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              {/* Add more bathroom options here */}
            </select>
          </div>
          <div className="flex flex-col space-y-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-secondary h-5 w-5" />
              <span className="ml-2 text-gray-700">Visa Eligible</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-secondary h-5 w-5" />
              <span className="ml-2 text-gray-700">Pool</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-secondary h-5 w-5" />
              <span className="ml-2 text-gray-700">Parking</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-secondary h-5 w-5" />
              <span className="ml-2 text-gray-700">24/7 Security</span>
            </label>
          </div>
        </div>

        {/* Cards Section */}
        <div className="w-full md:w-4/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <img
              src="/public/real_estate/cielo/vista_1.jpeg"
              alt="Property Image"
              className="rounded-sm mb-4"
            />
            <h3 className="text-xl font-bold mb-2 text-primary">Finca en Caldas</h3>
            <p className="text-sm text-gray-600">Location: Caldas</p>
            <p className="text-sm text-gray-600">Price: $4,300,000,000 COP</p>
            <p className="text-sm text-gray-600">Area: 89,696 m²</p>
            <p className="text-sm text-gray-600">Visa Eligible: Yes</p>
            <p className="text-sm text-gray-600">Amenities: Jacuzzi, Parking, 24/7 Security</p>
            <a href="/real-estate/properties/caldas" className="text-secondary hover:underline mt-4 block">
              View Details
            </a>
          </div>
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <img
              src="/public/real_estate/dakota/vista_1.jpeg"
              alt="Property Image"
              className="rounded-sm mb-4"
            />
            <h3 className="text-xl font-bold mb-2 text-primary">Ciudadela Campestre Norteamérica</h3>
            <p className="text-sm text-gray-600">Location: Bello</p>
            <p className="text-sm text-gray-600">Price: $639.000.000 COP</p>
            <p className="text-sm text-gray-600">HOA Monthly Fee: $603.000 COP</p>
            <p className="text-sm text-gray-600">Area: 2.329,61 m²</p>
            <p className="text-sm text-gray-600">Cadastral Appraisal: $285.020.000 COP</p>
            <p className="text-sm text-gray-600">Yearly property tax: $326.000 COP</p>
            <p className="text-sm text-gray-600">Visa Eligible: Yes</p>
            <p className="text-sm text-gray-600">Amenities: 24/7 Security</p>
            <a href="/real-estate/properties/dakota" className="text-secondary hover:underline mt-4 block">
              View Details
            </a>
          </div>
          {/* Add more property cards as needed */}
        </div>
      </div>
    </section>
  );
};

export default ExplorePropertiesSection;
