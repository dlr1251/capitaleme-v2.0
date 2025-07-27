// React import removed - not needed in React 17+
import { useState } from 'react';

interface ValuesSectionProps {
  lang: 'en' | 'es';
}

const ValuesSection: React.FC<ValuesSectionProps> = ({ lang }) => {
  const [activeValue, setActiveValue] = useState(0);

  const values = lang === 'es' ? [
    {
      title: "Excelencia",
      description: "Nos esforzamos por la excelencia en todo lo que hacemos, desde la atención al cliente hasta la calidad de nuestros servicios legales.",
      icon: "🏆"
    },
    {
      title: "Integridad",
      description: "Actuamos con honestidad y transparencia en todas nuestras relaciones comerciales y legales.",
      icon: "🤝"
    },
    {
      title: "Innovación",
      description: "Buscamos constantemente nuevas formas de mejorar nuestros servicios y adaptarnos a las necesidades cambiantes de nuestros clientes.",
      icon: "💡"
    },
    {
      title: "Compromiso",
      description: "Estamos comprometidos con el éxito de nuestros clientes y trabajamos incansablemente para lograr sus objetivos.",
      icon: "🎯"
    }
  ] : [
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from customer service to the quality of our legal services.",
      icon: "🏆"
    },
    {
      title: "Integrity",
      description: "We act with honesty and transparency in all our business and legal relationships.",
      icon: "🤝"
    },
    {
      title: "Innovation",
      description: "We constantly seek new ways to improve our services and adapt to the changing needs of our clients.",
      icon: "💡"
    },
    {
      title: "Commitment",
      description: "We are committed to our clients' success and work tirelessly to achieve their goals.",
      icon: "🎯"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {lang === 'es' ? 'Nuestros Valores' : 'Our Values'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {lang === 'es' 
              ? 'Los principios que guían nuestro trabajo y nuestra relación con los clientes.'
              : 'The principles that guide our work and our relationship with clients.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                activeValue === index
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-900 hover:bg-blue-50 hover:shadow-md'
              }`}
              onClick={() => setActiveValue(index)}
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className={`text-sm leading-relaxed ${
                activeValue === index ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection; 