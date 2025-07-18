// React import removed - not needed in React 17+
import {
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

interface ValuesSectionProps {
  messages: string[];
  lang?: 'en' | 'es';
}

const ValuesSection = ({ messages, lang = 'en' }: ValuesSectionProps) => {
  const getIcon = (index: number) => {
    const iconClasses = "w-6 h-6";
    
    switch (index) {
      case 0:
        return <UserGroupIcon className={`${iconClasses} text-blue-600`} />;
      case 1:
        return <GlobeAltIcon className={`${iconClasses} text-green-600`} />;
      case 2:
        return <ShieldCheckIcon className={`${iconClasses} text-purple-600`} />;
      case 3:
        return <DocumentTextIcon className={`${iconClasses} text-indigo-600`} />;
      case 4:
        return <HeartIcon className={`${iconClasses} text-teal-600`} />;
      case 5:
        return <SparklesIcon className={`${iconClasses} text-pink-600`} />;
      default:
        return <SparklesIcon className={`${iconClasses} text-gray-600`} />;
    }
  };

  const getBgColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-blue-100';
      case 1: return 'bg-green-100';
      case 2: return 'bg-purple-100';
      case 3: return 'bg-indigo-100';
      case 4: return 'bg-teal-100';
      case 5: return 'bg-pink-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {lang === 'es' ? 'Nuestros Valores Fundamentales y Misión' : 'Our Core Values & Mission'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'es'
              ? 'Creemos en hacer los servicios legales colombianos accesibles, transparentes y efectivos para clientes internacionales.'
              : 'We believe in making Colombian legal services accessible, transparent, and effective for international clients.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {messages.map((message: string, index: number) => (
            <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-bl-full"></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div className={`w-12 h-12 ${getBgColor(index)} rounded-lg flex items-center justify-center`}>
                  {getIcon(index)}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <p className="text-gray-700 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection; 