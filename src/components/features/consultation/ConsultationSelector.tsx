import React, { useState } from 'react';

interface ConsultationOption {
  key: string;
  label: string;
  price: string;
  title: string;
  description: string;
  calendly: string;
  icon: JSX.Element;
}

const CONSULTATION_OPTIONS: ConsultationOption[] = [
  {
    key: 'asap',
    label: 'Rush',
    price: '$90',
    title: 'Rush Consultation',
    description: 'Book as soon as 4 hours • Emergency legal matters',
    calendly: 'https://calendly.com/capital-m-law/rush-consultation?back=1&month=2025-07',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path>
      </svg>
    ),
  },
  {
    key: 'soon',
    label: 'Standard',
    price: '$55',
    title: 'Standard Consultation',
    description: 'Book as soon as 3 days • Regular legal guidance',
    calendly: 'https://calendly.com/capital-m-law/standard-initial-consultation?back=1&month=2025-07',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
      </svg>
    ),
  },
  {
    key: 'noHurry',
    label: 'Programmed',
    price: '$45',
    title: 'Programmed Consultation',
    description: 'Book within 7 days • Planned legal services',
    calendly: 'https://calendly.com/capital-m-law/programmed-consultation?back=1&month=2025-07',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
      </svg>
    ),
  },
];

export default function ConsultationSelector() {
  const [selected, setSelected] = useState<string>('soon');
  const option = CONSULTATION_OPTIONS.find(opt => opt.key === selected);

  if (!option) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      {/* Urgency Selection Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
        {CONSULTATION_OPTIONS.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSelected(opt.key)}
            className={`
              group p-3 rounded-lg transition-all duration-200 border focus:outline-none focus:ring-1
              ${selected === opt.key
                ? 'bg-secondary text-white border-secondary shadow-sm scale-105'
                : 'bg-white text-primary border-gray-200 hover:bg-gray-50 hover:border-primary'
              }
              ${selected === opt.key ? 'focus:ring-secondary' : 'focus:ring-primary'}
              ${opt.key === 'soon' ? 'lg:flex-col lg:items-center lg:justify-center lg:gap-2' : 'lg:flex-col lg:items-center lg:justify-center lg:gap-2'}
              ${opt.key !== 'soon' ? 'flex items-center justify-between w-full lg:flex-col lg:items-center lg:justify-center lg:gap-2' : 'flex items-center justify-between w-full lg:flex-col lg:items-center lg:justify-center lg:gap-2'}
            `}
            style={selected === opt.key ? { boxShadow: '0 2px 8px -2px rgba(0, 170, 129, 0.2)' } : {}}
          >
            {/* Mobile Layout */}
            <div className="flex items-center gap-3 lg:hidden">
              <div className={
                selected === opt.key
                  ? 'w-8 h-8 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0'
                  : 'w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0'
              }>
                {React.cloneElement(opt.icon, {
                  className: selected === opt.key ? 'w-4 h-4 text-white' : 'w-4 h-4 text-primary',
                })}
              </div>
              <div className="text-left">
                <div className={selected === opt.key ? 'font-medium text-sm text-white' : 'font-medium text-sm text-primary'}>
                  {opt.label} Consultation
                </div>
                <div className={selected === opt.key ? 'text-xs text-white/80' : 'text-xs text-gray-500'}>
                  {opt.key === 'asap' ? '4 hours • Emergency' : opt.key === 'soon' ? '3 days • Regular guidance' : '7 days • Planned services'}
                </div>
              </div>
            </div>
            <span className={`font-bold text-sm lg:hidden ${selected === opt.key ? 'text-white' : 'text-primary'}`}>{opt.price}</span>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className={
                selected === opt.key
                  ? 'w-8 h-8 bg-white/20 rounded-md flex items-center justify-center mx-auto'
                  : 'w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mx-auto'
              }>
                {React.cloneElement(opt.icon, {
                  className: selected === opt.key ? 'w-4 h-4 text-white' : 'w-4 h-4 text-primary',
                })}
              </div>
              <div className="text-center mt-2">
                <div className={selected === opt.key ? 'font-medium text-xs text-white' : 'font-medium text-xs text-primary'}>{opt.label}</div>
                <div className={selected === opt.key ? 'font-bold text-sm text-white' : 'font-bold text-sm text-primary'}>{opt.price}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Consultation Display */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => window.open(option.calendly, '_blank')}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-lg p-4 lg:p-5 border border-transparent shadow-sm transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="flex items-center justify-center gap-4 lg:gap-5">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {React.cloneElement(option.icon, { className: 'w-6 h-6 lg:w-7 lg:h-7 text-white' })}
            </div>
            <div className="text-center">
              <span className="text-base lg:text-lg font-semibold text-white block">{option.title}</span>
              <div className="text-sm lg:text-base text-white/90">{option.description}</div>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-lg font-bold text-white">{option.price}</span>
                <span className="text-sm text-white/80">•</span>
                <span className="text-sm text-white/80">Book Now</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
} 