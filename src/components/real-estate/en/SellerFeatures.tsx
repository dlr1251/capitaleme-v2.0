import { GlobeAltIcon, CurrencyDollarIcon, ScaleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

const SellerFeatures = () => {
  const features = [
    {
      title: "Global Exposure",
      description: "Market your property to qualified international buyers and investors actively seeking opportunities in Colombia.",
      icon: <GlobeAltIcon className="w-8 h-8 text-blue-600" />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Strategic Pricing",
      description: "Set a competitive price based on local trends, global demand, and expert valuation.",
      icon: <CurrencyDollarIcon className="w-8 h-8 text-green-600" />,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Expert Legal Support",
      description: "Navigate Colombian real estate laws with confidence as our team handles all legal complexities.",
      icon: <ScaleIcon className="w-8 h-8 text-yellow-600" />,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Seamless Process",
      description: "From listing to closing, we manage every step, ensuring a smooth and stress-free experience.",
      icon: <CheckBadgeIcon className="w-8 h-8 text-purple-600" />,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 lg:px-12 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Sell Your Property with Confidence and Reach an International Market
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            At <span className="font-semibold text-gray-800">Capital M Law</span>, we specialize in connecting property owners with an international network of buyers. Our expert legal team ensures a seamless and rewarding sales process.
          </p>
        </div>
      
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
              <div className={`flex items-center justify-center h-16 w-16 rounded-full ${feature.bgColor} ${feature.iconColor} mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 text-center">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      
        {/* Call to Action */}
        <div className="text-center">
          <a 
            href="/en/contact" 
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            List Your Property Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default SellerFeatures; 