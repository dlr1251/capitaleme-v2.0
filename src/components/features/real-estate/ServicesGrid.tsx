import { ArrowTrendingUpIcon, HomeModernIcon, BuildingStorefrontIcon, KeyIcon, UsersIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const ServicesGrid = () => {
  const services = [
    {
      title: "Looking to Buy?",
      subtitle: "Property Finding Assistance",
      description: "Let us help you find your dream property in Colombia with expert guidance and market insights.",
      link: "/en/contact?service=buy",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      linkColor: "text-emerald-800 hover:text-emerald-600",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      icon: <ArrowTrendingUpIcon className="w-8 h-8" />,
      features: ["Property Search", "Market Analysis", "Legal Support", "Negotiation"]
    },
    {
      title: "Looking to Sell?",
      subtitle: "Professional Listing Service",
      description: "Maximize your property value with our comprehensive selling service and market expertise.",
      link: "/en/contact?service=sell",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      linkColor: "text-blue-800 hover:text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: <HomeModernIcon className="w-8 h-8" />,
      features: ["Property Valuation", "Marketing Strategy", "Buyer Screening", "Closing Support"]
    },
    {
      title: "Need Legal Advice?",
      subtitle: "Real Estate Legal Services",
      description: "Get expert legal guidance for all your real estate transactions and compliance needs.",
      link: "/en/contact?service=legal",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      linkColor: "text-purple-800 hover:text-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: <BuildingStorefrontIcon className="w-8 h-8" />,
      features: ["Contract Review", "Due Diligence", "Tax Planning", "Compliance"]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {services.map((service, index) => (
        <div key={index} className={`group relative overflow-hidden rounded-2xl border ${service.borderColor} ${service.bgColor} p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          {/* Icon */}
          <div className={`w-16 h-16 ${service.bgColor.replace('50', '100')} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <div className={service.textColor}>
              {service.icon}
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className={`text-2xl font-bold ${service.textColor} mb-2`}>{service.title}</h3>
              <p className={`text-lg font-semibold ${service.textColor.replace('700', '600')} mb-3`}>{service.subtitle}</p>
              <p className={`text-sm ${service.textColor.replace('700', '600')} leading-relaxed`}>
                {service.description}
              </p>
            </div>
            
            {/* Features List */}
            <div className="space-y-2">
              {service.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-2">
                  <svg className={`w-4 h-4 ${service.textColor.replace('700', '500')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${service.textColor.replace('700', '600')}`}>{feature}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="pt-4">
              <a
                href={service.link}
                className={`inline-flex items-center justify-center px-6 py-3 ${service.buttonColor} text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Decorative Element */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${service.bgColor.replace('50', '100')} rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid; 