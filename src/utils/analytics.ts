// Analytics utility functions

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (pageTitle?: string, pagePath?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      page_path: pagePath || window.location.pathname
    });
  }
};

/**
 * Track a conversion event
 */
export const trackConversion = (conversionId: string, value?: number, currency?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency || 'USD'
    });
  }
};

/**
 * Track a custom conversion for contact form submissions
 */
export const trackContactFormSubmission = (formType: string = 'contact') => {
  trackEvent('form_submit', {
    form_type: formType,
    page_location: window.location.href
  });
};

/**
 * Track a custom conversion for consultation bookings
 */
export const trackConsultationBooking = (consultationType: string = 'initial') => {
  trackEvent('consultation_booking', {
    consultation_type: consultationType,
    page_location: window.location.href
  });
};

/**
 * Track a custom conversion for PDF downloads
 */
export const trackPDFDownload = (documentTitle: string, documentType: string = 'article') => {
  trackEvent('file_download', {
    file_name: documentTitle,
    file_type: 'pdf',
    document_type: documentType,
    page_location: window.location.href
  });
};
