import React, { useState, useEffect } from 'react';
import GuidesArticlesDrawer from './GuidesArticlesDrawer.tsx';
import { Bars3Icon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Guide {
  slug: string;
  title: string;
  description?: string;
  url: string;
}

interface GuidesMobileNavigationProps {
  guides: Guide[];
  currentSlug: string | undefined;
  headings: Heading[];
  lang?: string;
}

const GuidesMobileNavigation = ({
  guides,
  currentSlug,
  headings,
  lang = 'en'
}: GuidesMobileNavigationProps) => {
  // Improved heading validation and type conversion
  const typedHeadings: Heading[] = React.useMemo(() => {
    if (!Array.isArray(headings) || headings.length === 0) {
      return [];
    }
    
    return headings
      .filter((heading: any) => 
        heading && 
        typeof heading === 'object' && 
        'id' in heading && 
        'text' in heading && 
        ('level' in heading || 'depth' in heading)
      )
      .map((heading: any) => ({
        id: heading.id,
        text: heading.text,
        level: heading.level || heading.depth || 1
      }));
  }, [headings]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  // Debug: Log headings on mount
  useEffect(() => {
    console.log('GuidesMobileNavigation - Headings received:', headings);
    console.log('GuidesMobileNavigation - Typed headings:', typedHeadings);
  }, [headings, typedHeadings]);

  // Update current section as user scrolls
  useEffect(() => {
    if (typedHeadings.length === 0) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for sticky nav
      let closestHeading: Heading | null = null;
      let minDistance = Infinity;
      
      typedHeadings.forEach((heading) => {
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
        closestHeading?.text || typedHeadings[0]?.text || ''
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
      guides: 'Guides',
      close: 'Close',
      tableOfContents: 'Table of Contents'
    },
    es: {
      section: 'Sección',
      guides: 'Guías',
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
        {/* Right: Guides Drawer */}
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-700 focus:outline-none"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Bars3Icon className="w-5 h-5 text-blue-600" />
          <span>{content.guides}</span>
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
              {typedHeadings.length > 0 ? (
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
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-gray-500 text-sm">
                    {lang === 'es' ? 'No hay secciones disponibles' : 'No sections available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guides Drawer */}
      <GuidesArticlesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        guides={guides}
        currentSlug={currentSlug}
        lang={lang}
      />
    </>
  );
};

export default GuidesMobileNavigation;
