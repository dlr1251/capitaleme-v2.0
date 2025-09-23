import React, { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CalendarDaysIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import ContactForm from '../../ui/forms/ContactForm.tsx';

interface MobileBottomNavigationProps {
  lang?: 'en' | 'es';
  title?: string;
  content?: string;
  pathname?: string;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  lang = 'en',
  title = '',
  content = '',
  pathname = ''
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isContactDialerOpen, setIsContactDialerOpen] = useState(false);
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [calendlyScriptLoaded, setCalendlyScriptLoaded] = useState(false);

  // Text content based on language
  const textContent = {
    en: {
      share: 'Share',
      contact: 'Contact',
      whatsapp: 'WhatsApp',
      shareOn: 'Share on',
      copyLink: 'Copy Link',
      contactUs: 'Contact Us',
      bookConsultation: 'Book Consultation',
      contactForm: 'Contact Form',
      close: 'Close',
      facebook: 'Facebook',
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      whatsappShare: 'WhatsApp',
      bookNow: 'Book Now',
      sendMessage: 'Send Message'
    },
    es: {
      share: 'Compartir',
      contact: 'Contacto',
      whatsapp: 'WhatsApp',
      shareOn: 'Compartir en',
      copyLink: 'Copiar Enlace',
      contactUs: 'Contáctanos',
      bookConsultation: 'Reservar Consulta',
      contactForm: 'Formulario de Contacto',
      close: 'Cerrar',
      facebook: 'Facebook',
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      whatsappShare: 'WhatsApp',
      bookNow: 'Reservar Ahora',
      sendMessage: 'Enviar Mensaje'
    }
  };

  const contentData = textContent[lang as keyof typeof textContent] || textContent.en;

  // Share functionality
  const shareContent = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = title || (typeof document !== 'undefined' ? document.title : '');
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'copy':
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(url);
        }
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setIsShareOpen(false);
  };

  // Calendly modal functionality
  const openCalendlyModal = () => {
    setIsCalendlyModalOpen(true);
    setIsContactDialerOpen(false);
    
    // Load Calendly script if not already loaded
    if (!calendlyScriptLoaded && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setCalendlyScriptLoaded(true);
        // Initialize Calendly widget after script loads
        if ((window as any).Calendly) {
          (window as any).Calendly.initInlineWidget({
            url: 'https://calendly.com/capitalmlaw/standard-consultation',
            parentElement: document.querySelector('.calendly-inline-widget'),
            prefill: {},
            utm: {}
          });
        }
      };
      document.head.appendChild(script);
    }
  };

  const closeCalendlyModal = () => {
    setIsCalendlyModalOpen(false);
  };

  // Contact form modal functionality
  const openContactForm = () => {
    setIsContactOpen(true);
    setIsContactDialerOpen(false);
  };

  const closeContactForm = () => {
    setIsContactOpen(false);
  };

  // Close modals on escape key and click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsShareOpen(false);
        setIsContactDialerOpen(false);
        setIsCalendlyModalOpen(false);
        setIsContactOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Close share popup if clicking outside
      if (isShareOpen && !target.closest('[data-share-container]')) {
        setIsShareOpen(false);
      }
      
      // Close contact dialer if clicking outside
      if (isContactDialerOpen && !target.closest('[data-contact-container]')) {
        setIsContactDialerOpen(false);
      }
      
      // Close contact form modal if clicking outside
      if (isContactOpen && !target.closest('[data-contact-modal]')) {
        setIsContactOpen(false);
      }
      
      // Close Calendly modal if clicking outside
      if (isCalendlyModalOpen && !target.closest('[data-calendly-modal]')) {
        setIsCalendlyModalOpen(false);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isShareOpen, isContactDialerOpen, isContactOpen, isCalendlyModalOpen]);

  // Initialize Calendly widget when modal opens and script is loaded
  useEffect(() => {
    if (isCalendlyModalOpen && calendlyScriptLoaded && typeof window !== 'undefined') {
      const widget = document.querySelector('.calendly-inline-widget');
      if (widget && (window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: 'https://calendly.com/capitalmlaw/standard-consultation',
          parentElement: widget,
          prefill: {},
          utm: {}
        });
      }
    }
  }, [isCalendlyModalOpen, calendlyScriptLoaded]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-4 py-2">
          {/* Share Button */}
          <div className="relative" data-share-container>
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              aria-label={contentData.share}
            >
              <ShareIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{contentData.share}</span>
            </button>

            {/* Share Dropdown */}
            {isShareOpen && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  {contentData.shareOn}
                </div>
                <button
                  onClick={() => shareContent('facebook')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-3 text-blue-600">📘</span>
                  {contentData.facebook}
                </button>
                <button
                  onClick={() => shareContent('twitter')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-3 text-gray-900">🐦</span>
                  {contentData.twitter}
                </button>
                <button
                  onClick={() => shareContent('linkedin')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-3 text-blue-700">💼</span>
                  {contentData.linkedin}
                </button>
                <button
                  onClick={() => shareContent('whatsapp')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-3 text-green-600">📱</span>
                  {contentData.whatsappShare}
                </button>
                <button
                  onClick={() => shareContent('copy')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-3 text-gray-600">🔗</span>
                  {contentData.copyLink}
                </button>
              </div>
            )}
          </div>

          {/* Contact Button with Dialer */}
          <div className="relative" data-contact-container>
            <button
              onClick={() => setIsContactDialerOpen(!isContactDialerOpen)}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              aria-label={contentData.contact}
            >
              <EnvelopeIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{contentData.contact}</span>
            </button>

            {/* Contact Dialer */}
            {isContactDialerOpen && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-10">
                <div className="px-4 py-2 text-sm font-medium text-gray-900 text-center border-b border-gray-100">
                  {contentData.contactUs}
                </div>
                <div className="space-y-2 px-2">
                  <button
                    onClick={openContactForm}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-3 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">{contentData.contactForm}</div>
                      <div className="text-xs text-gray-500">{contentData.sendMessage}</div>
                    </div>
                  </button>
                  <button
                    onClick={openCalendlyModal}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    <CalendarDaysIcon className="w-5 h-5 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">{contentData.bookConsultation}</div>
                      <div className="text-xs text-gray-500">{contentData.bookNow}</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Button - Always visible */}
          <a
            href={`https://wa.me/573146022411?text=${encodeURIComponent(`Hello! I want to inquire about: ${title || 'this content'}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${
              isContactDialerOpen || isShareOpen 
                ? 'text-green-600 bg-green-50 scale-95' 
                : 'text-green-600 hover:text-green-700 hover:bg-green-50 hover:scale-105'
            }`}
            aria-label={contentData.whatsapp}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{contentData.whatsapp}</span>
          </a>
        </div>
      </div>

      {/* Contact Form Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={closeContactForm}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-contact-modal onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {contentData.contactForm}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {lang === 'es' ? 'Te responderemos en menos de 24 horas' : "We'll get back to you within 24 hours"}
                  </p>
                </div>
                <button
                  onClick={closeContactForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <ContactForm lang={lang} compact={true} />
            </div>
          </div>
        </div>
      )}

      {/* Calendly Modal */}
      {isCalendlyModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={closeCalendlyModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-calendly-modal onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {contentData.bookConsultation}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {lang === 'es' ? 'Elige el horario que mejor te convenga' : 'Choose the time that works best for you'}
                  </p>
                </div>
                <button
                  onClick={closeCalendlyModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/capitalmlaw/standard-consultation" 
                style={{ minWidth: '320px', height: '600px' }}
              />
            </div>
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={closeCalendlyModal}
                className="w-full bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                {contentData.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default MobileBottomNavigation;
