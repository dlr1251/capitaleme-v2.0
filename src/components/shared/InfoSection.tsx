interface Section {
  title: string;
  image?: string;
  alt?: string;
  content: string;
}

interface InfoSectionProps {
  sections: Section[];
}

export default function InfoSection({ sections }: InfoSectionProps) {
    return (
      <div className="space-y-8">
        {sections.map((section: Section, i: number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-b-2 pb-4">
            {/* Title Section */}
            <div className="flex items-start justify-between group">
              <h3
                className={`
                  text-lg
                  md:text-2xl font-semibold transition-colors duration-300
                  relative pb-1 text-primary
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:bg-primary 
                  after:h-[2px] after:w-full
                  after:transition-all after:duration-300 after:ease-in-out
                `}
              >
                {section.title}
              </h3>
            </div>
  
            {/* Content Section */}
            <div className="md:col-span-2 overflow-hidden">
              <div className="flex flex-col gap-6 items-start mt-2">
                {section.image && (
                  <div className="w-full">
                    <img
                      src={section.image}
                      alt={section.alt || 'Section Image'}
                      className="rounded-xl w-full object-cover shadow-md transition-opacity duration-700"
                    />
                  </div>
                )}
                <div className="prose text-md md:text-xl font-light leading-relaxed prose-primary w-full">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }