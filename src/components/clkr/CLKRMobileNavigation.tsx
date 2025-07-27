import React, { useState, useEffect } from 'react';
import CLKRArticlesDrawer from './CLKRArticlesDrawer.tsx';
import { Bars3Icon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Article {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface CLKRMobileNavigationProps {
  articlesByModule: Record<string, Article[]>;
  currentSlug: string | undefined;
  headings: Heading[];
  lang?: string;
}

const CLKRMobileNavigation = ({
  articlesByModule,
  currentSlug,
  headings,
  lang = 'en'
}: CLKRMobileNavigationProps) => {
  const typedHeadings: Heading[] = Array.isArray(headings) && (headings.length === 0 || (headings[0] && typeof headings[0] === 'object' && 'id' in headings[0] && 'text' in headings[0] && 'level' in headings[0])) ? (headings as Heading[]) : [];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  // Update current section as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for sticky nav
      let closestHeading: Heading | null = null;
      let minDistance = Infinity;
      (typedHeadings).forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) {
          const distance = Math.abs(el.offsetTop - scrollPosition);
          if (distance < minDistance) {
            minDistance = distance;
            closestHeading = heading;
          }
        }
      });
      // Handle case where closestHeading could be null
      setCurrentSection(
        closestHeading
          ? (closestHeading as Heading).text
          : (typedHeadings[0] as Heading | undefined)?.text || ''
      );
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [typedHeadings]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100, // Offset for sticky nav
        behavior: 'smooth',
      });
      setIsTOCOpen(false);
    }
  };

  // Text content based on language
  const textContent = {
    en: {
      section: 'Section',
      articles: 'Articles',
      close: 'Close',
      tableOfContents: 'Table of Contents'
    },
    es: {
      section: 'Sección',
      articles: 'Artículos',
      close: 'Cerrar',
      tableOfContents: 'Tabla de Contenidos'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  return (
    <>
      {/* Sticky Bar */}
      <div className="fixed top-[56px] left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 h-12 md:hidden">
        {/* Left: TOC Selector */}
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-700 focus:outline-none"
          onClick={() => setIsTOCOpen(true)}
        >
          <ListBulletIcon className="w-5 h-5 text-blue-600" />
          <span className="truncate max-w-[120px]">{currentSection || content.section}</span>
        </button>
        {/* Right: Articles Drawer */}
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-700 focus:outline-none"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Bars3Icon className="w-5 h-5 text-blue-600" />
          <span>{content.articles}</span>
        </button>
      </div>

      {/* TOC Modal */}
      {isTOCOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{content.tableOfContents}</h3>
              <button
                onClick={() => setIsTOCOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <nav className="space-y-2">
                {typedHeadings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      heading.text === currentSection
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{ paddingLeft: `${(heading.level - 1) * 16 + 12}px` }}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Articles Drawer */}
      <CLKRArticlesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        articlesByModule={articlesByModule}
        currentSlug={currentSlug}
        lang={lang}
      />
    </>
  );
};

export default CLKRMobileNavigation; 