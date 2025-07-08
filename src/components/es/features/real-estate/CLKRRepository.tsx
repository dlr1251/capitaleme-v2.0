import { useState, useEffect } from 'react';
import { BookOpenIcon, FunnelIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

interface CLKRService {
  title: string;
  href: string;
  description: string;
  module: ModuleName;
}

type ModuleName =
  | 'Bienes Raíces y Urbanismo'
  | 'Servicios de Inmigración'
  | 'Servicios Legales'
  | 'Servicios Empresariales'
  | 'Servicios Fiscales';

interface CLKRRepositoryProps {
  lang?: string;
}

const CLKRRepository = ({ lang = 'es' }: CLKRRepositoryProps) => {
  const [clkrServices, setClkrServices] = useState<CLKRService[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('Todos');
  const [modules, setModules] = useState<ModuleName[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCLKRData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/clkr-services?lang=${lang}`);
        const data = await response.json();
        if (data.entries) {
          setClkrServices(data.entries as CLKRService[]);
          setModules((data.modules || []) as ModuleName[]);
        }
      } catch (error) {
        // Fallback data
        setClkrServices([
          {
            title: 'Visa de Bienes Raíces vs Visa de Negocios',
            href: `/${lang}/clkr/real-estate-vs-business-visa`,
            description: 'Entendiendo las diferencias entre los requisitos de visa de bienes raíces y visa de negocios',
            module: 'Bienes Raíces y Urbanismo',
          },
          {
            title: 'Proceso de Registro de Propiedades',
            href: `/${lang}/clkr/property-registration-process`,
            description: 'Guía paso a paso para registrar propiedades en Colombia',
            module: 'Bienes Raíces y Urbanismo',
          },
          {
            title: 'Inversión Extranjera en Bienes Raíces',
            href: `/${lang}/clkr/foreign-investment-real-estate`,
            description: 'Marco legal para inversión extranjera en bienes raíces colombianos',
            module: 'Bienes Raíces y Urbanismo',
          },
          {
            title: 'Cédula de Extranjería',
            href: `/${lang}/clkr/cedula-extranjeria`,
            description: 'Proceso y requisitos para la cédula de extranjería',
            module: 'Servicios de Inmigración',
          },
          {
            title: 'Salvoconducto',
            href: `/${lang}/clkr/salvoconducto`,
            description: 'Permiso de salvoconducto para extranjeros en Colombia',
            module: 'Servicios de Inmigración',
          },
          {
            title: 'Visa de Beneficiario',
            href: `/${lang}/clkr/beneficiary-visa`,
            description: 'Proceso de visa para familiares de residentes',
            module: 'Servicios de Inmigración',
          },
        ]);
        setModules([
          'Bienes Raíces y Urbanismo',
          'Servicios de Inmigración',
          'Servicios Legales',
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCLKRData();
  }, [lang]);

  const filteredServices =
    selectedModule === 'Todos'
      ? clkrServices
      : clkrServices.filter((service: CLKRService) => service.module === selectedModule);

  const getModuleColor = (module: ModuleName): string => {
    const colors: Record<ModuleName, string> = {
      'Bienes Raíces y Urbanismo': 'emerald',
      'Servicios de Inmigración': 'blue',
      'Servicios Legales': 'purple',
      'Servicios Empresariales': 'orange',
      'Servicios Fiscales': 'red',
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
            Repositorio CLKR
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Repositorio de
            <span className="block text-purple-600">Conocimiento Legal</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accede a nuestra colección integral de recursos legales, guías y perspectivas expertas 
            sobre bienes raíces colombianos, inmigración y servicios legales.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedModule('Todos')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedModule === 'Todos'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            Todos los Módulos
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
                  Leer Más
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron recursos</h3>
            <p className="text-gray-500">Intenta ajustar los filtros para ver más contenido.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CLKRRepository; 