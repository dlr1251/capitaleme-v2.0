import * as React from 'react';
import { BookOpenIcon, UsersIcon, BriefcaseIcon, HomeIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface HomePageCLKRProps {
  lang?: string;
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
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
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const HomePageCLKR: React.FC<HomePageCLKRProps> = ({ lang = 'en' }) => {
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
    ]
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
    ]
  };

  return (
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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {content.features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <ErrorBoundary>
            <div className="bg-white border-l-8 border-primary rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 mx-auto max-w-2xl mt-8">
              <BookOpenIcon className="text-primary w-6 h-6 flex-shrink-0 mb-2 md:mb-0" />
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                  Featured Article: Plea Bargaining in Colombia
                </h2>
                <p className="text-gray-600 mb-3 text-sm md:text-base">
                  Plea bargaining in Colombia allows negotiated resolutions in criminal cases, balancing justice and efficiency...
                </p>
                <a
                  href="/en/clkr/plea-bargaining-colombia"
                  className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm md:text-base"
                >
                  Read More
                </a>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default HomePageCLKR; 