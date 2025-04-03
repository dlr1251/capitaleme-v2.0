import { useEffect } from 'react';

const CalendlyButton = () => {
  useEffect(() => {
    // Load Calendly scripts dynamically
    const loadCalendlyScript = () => {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    };

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    loadCalendlyScript();

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      const link = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]');
      if (script) script.remove();
      if (link) link.remove();
    };
  }, []);

  const openCalendly = (e) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/danielluque/45-min-meeting?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=16345f'
      });
    }
  };

  return (
    <a 
      href="#"
      className="mt-4 inline-block bg-secondary text-white font-semibold text-sm md:text-lg px-5 py-2 shadow  md:px-8 md:py-3 rounded-lg hover:bg-primary transition"
      onClick={openCalendly}
    >
      Book now
    </a>
  );
};

export default CalendlyButton; 