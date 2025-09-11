import { useEffect } from 'react';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface AnalyticsScriptsProps {
  measurementId?: string;
  pageTitle?: string;
  pagePath?: string;
}

const AnalyticsScripts: React.FC<AnalyticsScriptsProps> = ({
  measurementId = 'G-2M6FN1YGCD',
  pageTitle,
  pagePath
}) => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Initialize Google Analytics
    const initializeGA = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      
      // Make gtag available globally
      (window as any).gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', measurementId, {
        page_title: pageTitle || document.title,
        page_location: window.location.href,
        page_path: pagePath || window.location.pathname
      });
    };

    // Track page view
    const trackPageView = () => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: pageTitle || document.title,
          page_location: window.location.href,
          page_path: pagePath || window.location.pathname
        });
      }
    };

    // Initialize GA
    initializeGA();
    
    // Track initial page view
    trackPageView();

    // Track page views on route changes (for SPA-like behavior)
    const handleRouteChange = () => {
      trackPageView();
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [measurementId, pageTitle, pagePath]);

  return null; // This component doesn't render anything
};

export default AnalyticsScripts;
