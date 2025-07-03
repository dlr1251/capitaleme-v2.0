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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
        </svg>
      ),
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      ),
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
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