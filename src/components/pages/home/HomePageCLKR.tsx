import * as React from 'react';
import { BookOpenIcon, UsersIcon, BriefcaseIcon, HomeIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import AlgoliaInstantSearch from '../../shared/AlgoliaInstantSearch.jsx';

interface HomePageCLKRProps {
  lang?: 'en' | 'es';
}

// Error boundary for AlgoliaAutocomplete
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-center my-4">Search is temporarily unavailable. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const funFacts = [
  {
    icon: <InformationCircleIcon className="text-primary text-2xl mb-2" />,
    text: "Colombia's Constitution guarantees due process in Article 29.",
  },
  {
    icon: <BookOpenIcon className="text-primary text-2xl mb-2" />,
    text: "Restorative justice is a core principle in Colombian plea bargaining.",
  },
  {
    icon: <UsersIcon className="text-primary text-2xl mb-2" />,
    text: "The Special Jurisdiction for Peace (JEP) is unique in Latin America.",
  },
];

const categories = [
  { icon: <BriefcaseIcon className="text-primary text-2xl mb-2" />, name: "Criminal Law", count: 12 },
  { icon: <UsersIcon className="text-primary text-2xl mb-2" />, name: "Family Law", count: 8 },
  { icon: <BookOpenIcon className="text-primary text-2xl mb-2" />, name: "Tax Law", count: 7 },
  { icon: <HomeIcon className="text-primary text-2xl mb-2" />, name: "Real Estate", count: 5 },
];

const HomePageCLKR = ({ lang = 'es' }: HomePageCLKRProps) => {
  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-10 md:gap-16">
        {/* Unified Header and Featured Article */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Colombian Legal Knowledge Repository
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            Explore the depth of Colombian law, in English and Spanish.
          </p>
          <p className="text-base md:text-lg text-gray-500 mb-8">
            A modern, bilingual legal resource for expats, lawyers, and the curious. Free, in-depth, and always growing.
          </p>
          {/* AlgoliaAutocomplete with error boundary */}
          <ErrorBoundary>
            <AlgoliaInstantSearch lang={lang} />
          </ErrorBoundary>
          <div className="bg-white border-l-8 border-primary rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 mx-auto max-w-2xl mt-8">
            <BookOpenIcon className="text-primary text-4xl flex-shrink-0 mb-2 md:mb-0" />
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
        </div>

        {/* Fun Facts and Categories in a single grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fun Facts */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
              Did You Know?
            </h3>
            <div className="flex flex-col gap-4">
              {funFacts.map((fact, i) => (
                <div
                  key={i}
                  className="bg-white border border-blue-200 rounded-lg shadow p-4 flex items-center gap-4"
                >
                  {fact.icon}
                  <p className="text-gray-700 text-sm">{fact.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Categories */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
              Explore by Category
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="bg-white border border-blue-200 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
                >
                  {cat.icon}
                  <h4 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{cat.name}</h4>
                  <span className="text-xs text-gray-500">{cat.count} articles</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Highlights and CTA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <ul className="space-y-3 text-base md:text-lg text-gray-700 flex-1">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="text-primary" /> Learn about Colombian law in English, for free.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="text-primary" /> Compare Colombian law to the US, UK, and Europe.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="text-primary" /> Understand legal terms with our glossary.
            </li>
          </ul>
          <div className="text-center md:text-right flex-shrink-0">
            <a
              href="/en/clkr"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold text-base md:text-lg mr-2 hover:bg-blue-700 transition"
            >
              Start Exploring
            </a>     
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageCLKR; 