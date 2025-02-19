import { useState } from 'react';

export default function Accordion({ sections }) {
  const [openSections, setOpenSections] = useState([]);

  function toggleSection(index) {
    setOpenSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // Quita la sección si ya está abierta
        : [...prev, index] // Agrega la sección si no está abierta
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section, i) => {
        const isOpen = openSections.includes(i);
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna Izquierda: 1/3 del ancho */}
            <div 
              className="cursor-pointer flex items-start justify-between group"
              onClick={() => toggleSection(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' ? toggleSection(i) : null}
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <h3 
                className={`
                  text-2xl font-semibold transition-colors duration-300
                  relative pb-1
                  ${isOpen ? 'text-primary' : 'text-primary/80 group-hover:text-primary'}
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:bg-primary after:h-[2px] after:w-0
                  group-hover:after:w-full after:transition-all after:duration-300 after:ease-in-out
                `}
              >
                {section.title}
              </h3>
              <div className={`ml-4 transform transition-transform duration-300 text-primary/80 ${isOpen ? 'rotate-180 text-primary' : 'hover:text-primary'}`}>
                {/* Ícono Flecha */}
                <svg xmlns="http://www.w3.org/2000/svg" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     strokeWidth="1.5" 
                     stroke="currentColor" 
                     className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            {/* Columna Derecha: 2/3 del ancho */}
            <div 
              className={
                `md:col-span-2 overflow-hidden transition-[max-height] duration-500 ease-in-out 
                 ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`
              } 
              aria-hidden={!isOpen}
            >
              <div className="flex flex-col gap-6 items-start mt-2">
                {section.image && (
                  <div className="w-full">
                    <img 
                      src={section.image} 
                      alt="Team" 
                      className="rounded-xl w-full object-cover shadow-md transition-opacity duration-700"
                    />
                  </div>
                )}

                <div className="prose text-xl font-light leading-relaxed prose-primary w-full">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}