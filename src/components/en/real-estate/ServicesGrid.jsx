import React from 'react';

const ServicesGrid = () => {
  const services = [
    {
      title: "Looking to sell?",
      description: "List with Us",
      link: "/en/contact?service=sell",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      linkColor: "text-blue-800 hover:text-blue-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      )
    },
    {
      title: "Looking to buy?",
      description: "Property Finding Assistance Service",
      link: "/en/contact?service=buy",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      linkColor: "text-green-800 hover:text-green-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
        </svg>
      )
    },
    {
      title: "Need Advice?",
      description: (
        <>
          Resources: 
          <a href="/en/resources/hoa" className="ml-1 text-yellow-800 underline hover:text-yellow-500">HOA</a>, 
          <a href="/en/resources/predial" className="ml-1 text-yellow-800 underline hover:text-yellow-500">Predial</a>, 
          <a href="/en/resources/promesa-de-compraventa" className="ml-1 text-yellow-800 underline hover:text-yellow-500">Promesa de Compraventa</a>, 
          <a href="/en/resources/arrendamiento" className="ml-1 text-yellow-800 underline hover:text-yellow-500">Arrendamiento</a>.
        </>
      ),
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      linkColor: "text-yellow-800 hover:text-yellow-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto mb-4 mt-12 gap-4">
      {services.map((service, index) => (
        <div key={index} className={`p-4 ${service.bgColor} border ${service.borderColor} rounded-md shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={service.textColor}>
              {service.icon}
            </div>
            <h3 className={`text-lg font-semibold ${service.textColor}`}>{service.title}</h3>
          </div>
          <p className={`text-sm ${service.textColor.replace("700", "600")}`}>
            {typeof service.description === "string" ? (
              <a href={service.link} className={service.linkColor}>
                {service.description}
              </a>
            ) : service.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid; 