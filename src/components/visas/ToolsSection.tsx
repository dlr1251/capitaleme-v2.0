import { useState } from 'react';
import VisasSectionFilterSearch from './VisasSectionFilterSearch.tsx';
import ColombiaStayCalculator from './ColombiaStayCalculator.tsx';

interface ToolsSectionProps {
  visas: any[];
  lang?: 'en' | 'es';
}

const ToolsSection = ({ visas, lang = 'en' }: ToolsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'calculator'>('explorer');

  const tabs = lang === 'es' ? {
    explorer: 'Explorador de Visas',
    calculator: 'Calculadora de Días'
  } : {
    explorer: 'Visa Explorer',
    calculator: 'Days Calculator'
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {lang === 'es' ? 'Herramientas' : 'Tools'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            {lang === 'es' 
              ? 'Utiliza nuestras herramientas para explorar visas y calcular tus días de estadía en Colombia.'
              : 'Use our tools to explore visas and calculate your stay days in Colombia.'}
          </p>
        </div>

        {/* Tabs Navigation - Desktop */}
        <div className="hidden md:block border-b border-gray-200 mb-8">
          <nav className="flex space-x-8" aria-label="Tools tabs">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'explorer'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeTab === 'explorer'}
              role="tab"
            >
              {tabs.explorer}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'calculator'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeTab === 'calculator'}
              role="tab"
            >
              {tabs.calculator}
            </button>
          </nav>
        </div>

        {/* Mobile Tabs - Select dropdown */}
        <div className="md:hidden mb-8">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'explorer' | 'calculator')}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-base font-medium text-gray-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            aria-label="Select tool"
          >
            <option value="explorer">{tabs.explorer}</option>
            <option value="calculator">{tabs.calculator}</option>
          </select>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'explorer' && (
            <div role="tabpanel" aria-labelledby="explorer-tab">
              <VisasSectionFilterSearch visas={visas} lang={lang} intro={false} />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div role="tabpanel" aria-labelledby="calculator-tab">
              <ColombiaStayCalculator />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;

