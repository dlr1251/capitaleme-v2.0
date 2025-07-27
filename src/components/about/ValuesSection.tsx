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
  lang?: 'en' | 'es';
}

const ValuesSection = ({ lang = 'en' }: ValuesSectionProps) => {
  // Define messages based on language
  const messages = lang === 'es' ? [
    "Queremos ayudar a expatriados, nómadas y viajeros con sus procesos legales en Colombia porque sabemos lo que significa jugar lejos de casa.",
    "En última instancia, queremos enriquecer la cultura colombiana a través del intercambio cultural con expatriados, nómadas, viajeros y turistas. Entendemos que las diferencias culturales y las barreras del idioma pueden ralentizar algunos procesos legales [ya lentos].",
    "Somos abogados colombianos - abogados -. Entendemos la cultura, el idioma y las prácticas comunes del sistema legal colombiano.",
    "Hemos practicado la Ley en diferentes áreas obteniendo valiosas perspectivas para proteger tus intereses. Creemos que entender las regulaciones colombianas y operar bajo el sistema legal colombiano no debería ser difícil.",
    "Nuestra filosofía es simplificar las complejidades del mundo legal y priorizar la comunicación abierta, la confianza y el aspecto humano de todas nuestras interacciones.",
    "Amamos los gatos. Harry Potter. Kimetsu no Yaiba. Shakira. Bad Bunny. García Marquez. Hermann Hesse."
  ] : [
    "We want to help expats, nomads and travelers with their legal processes in Colombia because we know what it means to be playing away from home.",
    "Ultimately, we want to enrich Colombian culture through cultural exchange with expats, nomads, travelers, and tourists. We understand cultural differences and language barriers can slower down some [already slow] legal processes.",
    "We are Colombian attorneys - abogados -. We understand the culture, language and common practices of the Colombian legal system.",
    "We have practiced the Law across different areas gaining valuable insights to protect your interests. We believe that understanding Colombian regulations and operating under the Colombian legal system shouldn't be hard.",
    "Our philosophy is to simplify the complexities of the legal world and prioritize open communication, trust, and the human aspect of all our interactions.",
    "We love cats. Harry Potter. Kimetsu no Yaiba. Shakira. Bad Bunny. García Marquez. Hermann Hesse."
  ];

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