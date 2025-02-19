import React from "react";
export default function InfoSection({ sections }) {
    return (
      <div className="p-4 rounded-lg border border-gray-200">
        {sections.map((section, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-8 gap-8 pb-8">
            {/* Title Section */}
            <div className="flex items-start group md:col-span-2 lg:col-span-2">
              <span className="bg-terciary size-10 flex justify-center items-center text-white rounded-full mr-4">{i+1}</span>
              <h3
                className={`
                    font-semibold 
                    pb-1 text-primary        
                    flex justify-center items-center
                    h-10          
                `}
              >
                {section.title}
              </h3>
            </div>
  
            {/* Content Section */}
            <div className="md:col-span-3 lg:col-span-6 overflow-hidden">
              <div className="flex flex-col gap-6 items-start mt-0">  
                <div className="prose text-lg font-light leading-relaxed prose-primary w-full">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }