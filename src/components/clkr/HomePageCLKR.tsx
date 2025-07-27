import * as React from 'react';
import { BookOpenIcon, UsersIcon, BriefcaseIcon, HomeIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface HomePageCLKRProps {
  lang?: 'en' | 'es';
  clkrServices?: any[];
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; lang?: 'en' | 'es' },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {this.props.lang === 'es' ? 'Algo salió mal' : 'Something went wrong'}
          </h3>
          <p className="text-gray-600">
            {this.props.lang === 'es' ? 'Por favor, intenta refrescar la página' : 'Please try refreshing the page'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const HomePageCLKR: React.FC<HomePageCLKRProps> = ({ lang = 'en', clkrServices = [] }) => {
  const content = lang === 'es' ? {
    title: "Repositorio Legal Colombiano",
    subtitle: "Acceso directo a la legislación y jurisprudencia colombiana",
    description: "Nuestro repositorio legal integral ofrece acceso a leyes, decretos, sentencias y jurisprudencia actualizada del sistema legal colombiano.",
    features: [
      {
        icon: BookOpenIcon,
        title: "Legislación Actualizada",
        description: "Leyes, decretos y reglamentos vigentes"
      },
      {
        icon: UsersIcon,
        title: "Jurisprudencia",
        description: "Sentencias y precedentes judiciales"
      },
      {
        icon: BriefcaseIcon,
        title: "Doctrina Legal",
        description: "Análisis y comentarios especializados"
      }
    ],
    exploreButton: "Explorar Repositorio",
    learnMore: "Conoce más"
  } : {
    title: "Colombian Legal Repository",
    subtitle: "Direct access to Colombian legislation and jurisprudence",
    description: "Our comprehensive legal repository provides access to laws, decrees, rulings, and updated jurisprudence from the Colombian legal system.",
    features: [
      {
        icon: BookOpenIcon,
        title: "Updated Legislation",
        description: "Current laws, decrees and regulations"
      },
      {
        icon: UsersIcon,
        title: "Jurisprudence",
        description: "Rulings and judicial precedents"
      },
      {
        icon: BriefcaseIcon,
        title: "Legal Doctrine",
        description: "Specialized analysis and comments"
      }
    ],
    exploreButton: "Explore Repository",
    learnMore: "Learn More"
  };

  return (
    <ErrorBoundary lang={lang}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              {content.subtitle}
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {content.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {content.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={`/${lang}/clkr`}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              {content.exploreButton}
            </a>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomePageCLKR; 