import { useState } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  lang?: 'en' | 'es';
}

const FAQAccordion = ({ faqs, lang = 'en' }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 ${
              isOpen 
                ? 'border-secondary shadow-lg shadow-secondary/5' 
                : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded-xl transition-all duration-200 ${
                isOpen ? 'bg-secondary/5' : 'hover:bg-gray-50'
              }`}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`flex-shrink-0 mt-0.5 transition-colors duration-200 ${
                  isOpen ? 'text-secondary' : 'text-gray-400'
                }`}>
                  <QuestionMarkCircleIcon className="w-6 h-6" />
                </div>
                <h4 className={`text-lg font-semibold pr-4 transition-colors duration-200 ${
                  isOpen ? 'text-secondary' : 'text-gray-900'
                }`}>
                  {faq.question}
                </h4>
              </div>
              <div className="flex-shrink-0">
                <ChevronDownIcon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isOpen 
                      ? 'transform rotate-180 text-secondary' 
                      : 'text-gray-400'
                  }`}
                />
              </div>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pl-14">
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;

