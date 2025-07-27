import { useState, useEffect } from 'react';
import { BookOpenIcon, FunnelIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

// Type definitions
interface CLKRService {
  title: string;
  href: string;
  description: string;
  module: string;
}

interface CLKRRepositoryProps {
  clkrServices: any[];
  modules: string[];
  loading?: boolean;
  lang?: string;
}

const CLKRRepository = ({ clkrServices, modules, loading = false, lang = 'en' }: CLKRRepositoryProps) => {
  const [selectedModule, setSelectedModule] = useState('All');
  const isLoading = loading;

  useEffect(() => {
    if (!clkrServices && !isLoading) {
      // loadCLKRData(lang as 'en' | 'es'); // This line was removed as per the edit hint
    }
  }, [clkrServices, isLoading, lang]); // This line was updated as per the edit hint

  const filteredServices = selectedModule === 'All' 
    ? clkrServices 
    : clkrServices.filter(service => service.module === selectedModule);

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      'Real Estate & Urbanism': 'emerald',
      'Immigration Services': 'blue',
      'Legal Services': 'purple',
      'Business Services': 'orange',
      'Tax Services': 'red'
    };
    return colors[module] || 'gray';
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 border border-purple-200 rounded-full text-purple-800 text-sm font-medium mb-6">
            <BookOpenIcon className="w-4 h-4 mr-2" />
            CLKR Repository
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Legal Knowledge
            <span className="block text-purple-600">Repository</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive collection of legal resources, guides, and expert insights 
            on Colombian real estate, immigration, and legal services.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedModule('All')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedModule === 'All'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            All Modules
          </button>
          {modules.map((module) => (
            <button
              key={module}
              onClick={() => setSelectedModule(module)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedModule === module
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {module}
            </button>
          ))}
        </div>

        {/* CLKR Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const moduleColor = getModuleColor(service.module);
            return (
              <a
                key={index}
                href={service.href}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${moduleColor}-100 rounded-lg flex items-center justify-center group-hover:bg-${moduleColor}-200 transition-colors duration-300`}>
                      <DocumentTextIcon className={`w-5 h-5 text-${moduleColor}-600`} />
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${moduleColor}-100 text-${moduleColor}-800`}>
                        {service.module}
                      </span>
                    </div>
                  </div>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                  {service.title}
                </h3>
                
                {service.description && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {service.description}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-purple-600 font-medium group-hover:text-purple-700 transition-colors duration-300">
                  Read More
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
            <p className="text-gray-500">No CLKR content found for the selected module.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need More Legal Information?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Explore our complete CLKR repository for comprehensive legal resources, 
              expert guides, and detailed information on Colombian legal services.
            </p>
            <a
              href={`/${lang}/clkr`}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Full Repository
              <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CLKRRepository; 