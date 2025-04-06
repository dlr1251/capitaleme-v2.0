import React from 'react';

const RealEstateHero = () => {
  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {/* Background Image */}
      <img 
        src="/images/real-estate/colombia-property.jpg" 
        alt="Colombian Real Estate" 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/40 to-primary/90"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 sm:px-8">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Real Estate in Colombia
        </h1>
        <p className="text-white text-lg sm:text-xl mb-6 max-w-3xl mx-auto">
          Expert legal guidance for international buyers and sellers navigating the Colombian property market
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a 
            href="#services" 
            className="bg-white text-primary py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Our Services
          </a>
          <a 
            href="/en/contact" 
            className="bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default RealEstateHero; 