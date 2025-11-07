import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'es';
  url?: string;
}

const CalendlyModal = ({ isOpen, onClose, lang = 'en', url = 'https://calendly.com/capitalmlaw/standard-consultation' }: CalendlyModalProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !scriptLoaded) {
      // Load Calendly script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.head.appendChild(script);

      // Load Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        // Cleanup on unmount
        const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
        const existingLink = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]');
        if (existingScript) existingScript.remove();
        if (existingLink) existingLink.remove();
      };
    }
  }, [isOpen, scriptLoaded]);

  useEffect(() => {
    // Initialize Calendly widget when modal opens and script is loaded
    if (isOpen && scriptLoaded && typeof window !== 'undefined') {
      const widget = document.querySelector('.calendly-inline-widget');
      if (widget && (window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: url,
          parentElement: widget,
          prefill: {},
          utm: {}
        });
      }
    }
  }, [isOpen, scriptLoaded, url]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = lang === 'es' ? {
    title: 'Reserva tu consulta',
    subtitle: 'Elige el horario que mejor te convenga',
    close: 'Cerrar'
  } : {
    title: 'Book your consultation',
    subtitle: 'Choose the time that works best for you',
    close: 'Close'
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
        data-calendly-modal
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {content.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {content.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label={content.close}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div 
            className="calendly-inline-widget" 
            data-url={url}
            style={{ minWidth: '320px', height: '600px' }}
          />
        </div>
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            {content.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendlyModal;

