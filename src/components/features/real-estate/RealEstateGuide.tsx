import { useState } from 'react';
import PropertyListing from './PropertyListing.tsx';
import PropertySearchService from './PropertySearchService.tsx';

// Type definitions
interface Property {
  id: string;
  data?: {
    title?: string;
    mainImage?: string;
    status?: string;
    propertyType?: string;
    location?: string;
    price?: {
      usd?: number;
      cop?: number;
    };
    area?: {
      total?: number;
      unit?: string;
    };
    features?: string[];
    bedrooms?: number;
    bathrooms?: number;
  };
  [key: string]: any;
}

interface RealEstateGuideProps {
  properties: Property[];
}

interface Step {
  title: string;
  content: string;
  icon: string;
  duration: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const STEPS_REAL_ESTATE = [
  {
    title: 'Initial Consultation & Planning',
    content: 'Start with a comprehensive consultation to understand your goals, budget, and timeline. We\'ll help you navigate Colombian real estate regulations, tax implications, and legal requirements for foreign buyers.',
    icon: '🤝',
    duration: '1-2 weeks'
  },
  {
    title: 'Property Search & Selection',
    content: 'Our team will search for properties that match your criteria, arrange viewings, and provide detailed market analysis. We\'ll help you understand local market conditions and property values.',
    icon: '🔍',
    duration: '2-4 weeks'
  },
  {
    title: 'Financial Preparation & Banking',
    content: 'Once you\'ve found your dream property, we\'ll help you prepare funds in Colombia and register them with the Central Bank. This involves opening a brokerage account and completing currency exchange procedures.',
    icon: '💰',
    duration: '1 week'
  },
  {
    title: 'Due Diligence & Legal Review',
    content: 'We conduct thorough title searches to identify any mortgages, liens, or legal encumbrances. This includes reviewing ownership certificates, previous deeds, and HOA regulations to ensure a clean transfer.',
    icon: '📋',
    duration: '1-2 weeks'
  },
  {
    title: 'Negotiation & Purchase Agreement',
    content: 'We\'ll negotiate the best terms and prepare the "Promesa de Compraventa" contract, which sets the price, payment structure, delivery date, and all essential terms of the transaction.',
    icon: '📝',
    duration: '1 week'
  },
  {
    title: 'Closing & Registration',
    content: 'Finalize the transaction at a notary office where the deed is signed and registered. The notary will handle all legal formalities and ensure proper registration in the national property registry.',
    icon: '✅',
    duration: '2-3 weeks'
  }
];

const FAQ_DATA = [
  {
    question: 'Can foreigners buy property in Colombia?',
    answer: 'Yes, foreigners can buy property in Colombia with the same rights as Colombian citizens. However, there are specific requirements for registering foreign investment and complying with currency exchange regulations.'
  },
  {
    question: 'What are the typical closing costs?',
    answer: 'Closing costs typically range from 3-5% of the property value and include notary fees, registration taxes, legal fees, and transfer taxes. We provide detailed cost breakdowns for each transaction.'
  },
  {
    question: 'Do I need a Colombian bank account?',
    answer: 'While not mandatory, having a Colombian bank account is highly recommended for property transactions. We can help you open an account and navigate the banking requirements.'
  },
  {
    question: 'How long does the buying process take?',
    answer: 'The complete process typically takes 2-3 months from initial search to closing, depending on property availability, financing arrangements, and legal requirements.'
  },
  {
    question: 'What documents do I need as a foreign buyer?',
    answer: 'You\'ll need a valid passport, proof of income, bank statements, and potentially a Colombian tax ID (RUT). We\'ll guide you through all required documentation.'
  },
  {
    question: 'Are there restrictions on property types for foreigners?',
    answer: 'Foreigners can purchase most types of property including apartments, houses, and land. However, there are restrictions on purchasing properties in border areas and certain strategic locations.'
  }
];

const ProcessStep = ({ number, title, content, icon, duration, isLast }: { number: number; title: string; content: string; icon: string; duration: string; isLast: boolean }) => (
  <div className="relative">
    {/* Connecting line */}
    {!isLast && (
      <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-secondary to-primary/30"></div>
    )}
    
    <div className="flex items-start gap-6 group">
      {/* Icon and number circle */}
      <div className="flex-shrink-0 relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow bg-white rounded-xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xl font-bold text-primary">{title}</h4>
          <span className="text-sm text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full">
            {duration}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: FAQ) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span className="font-semibold text-primary">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const RealEstateGuide = ({ properties }: RealEstateGuideProps) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'process', label: 'The Process', icon: '📋' },
    { id: 'properties', label: 'Explore Properties', icon: '🔍' },
    { id: 'search-service', label: 'Property Search Service', icon: '🎯' },
    { id: 'faq', label: 'FAQ', icon: '❓' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🏠 Real Estate Services
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Colombian Real Estate
            <span className="block text-secondary">Guide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Navigate Colombia's unique real estate market with confidence. From initial consultation to property registration, 
            we guide you through every step of the process with expert legal support and market insights.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="min-h-[600px]">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">🇨🇴</div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Why Colombia?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Growing real estate market with excellent ROI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Favorable exchange rates for foreign investors
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Diverse property options from city to countryside
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Stable legal framework for foreign ownership
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Legal Framework</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Foreigners have equal property rights
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Notarial system ensures legal security
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Central Bank registration required
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Title insurance available
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Our comprehensive real estate services start from <span className="font-bold">$812,500 COP</span>
                </p>
                <a
                  href="/en/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-secondary font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                >
                  Book a Consultation
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* Process Section */}
          {activeSection === 'process' && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">The Complete Process</h2>
                <p className="text-xl text-gray-600">
                  From initial consultation to property registration, we guide you through every step
                </p>
              </div>
              
              <div className="space-y-8">
                {STEPS_REAL_ESTATE.map((step, index) => (
                  <ProcessStep
                    key={step.title}
                    number={index + 1}
                    title={step.title}
                    content={step.content}
                    icon={step.icon}
                    duration={step.duration}
                    isLast={index === STEPS_REAL_ESTATE.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {activeSection === 'properties' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Featured Properties</h2>
                <p className="text-xl text-gray-600">
                  Discover our curated selection of premium properties across Colombia
                </p>
              </div>
              <PropertyListing properties={properties} />
            </div>
          )}

          {/* Property Search Service Section */}
          {activeSection === 'search-service' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Property Search Service</h2>
                <p className="text-xl text-gray-600">
                  Let us find your perfect property with our comprehensive search service
                </p>
              </div>
              <PropertySearchService />
            </div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">
                  Everything you need to know about buying property in Colombia
                </p>
              </div>
              
              <div className="space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <a
                  href="/en/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/80 transition-colors shadow-md"
                >
                  Contact Our Team
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RealEstateGuide; 