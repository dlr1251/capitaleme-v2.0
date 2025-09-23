import React, { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { generatePDF, showPDFConfirmation, showMarkdownConfirmation } from '../../../utils/pdfUtils.js';
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
      pdf: 'PDF',
      md: 'MD',
      contact: 'Contact',
      whatsapp: 'WhatsApp',
      shareOn: 'Share on',
      copyLink: 'Copy Link',
      downloadPDF: 'Download PDF',
      copyMarkdown: 'Copy Markdown',
      contactUs: 'Contact Us',
      bookConsultation: 'Book Consultation',
      contactForm: 'Contact Form',
      close: 'Close',
      facebook: 'Facebook',
      twitter: 'X (Twitter)',
      threads: 'Threads',
      linkedin: 'LinkedIn',
      whatsappShare: 'WhatsApp',
      bookNow: 'Book Now',
      sendMessage: 'Send Message'
    },
    es: {
      share: 'Compartir',
      pdf: 'PDF',
      md: 'MD',
      contact: 'Contacto',
      whatsapp: 'WhatsApp',
      shareOn: 'Compartir en',
      copyLink: 'Copiar Enlace',
      downloadPDF: 'Descargar PDF',
      copyMarkdown: 'Copiar Markdown',
      contactUs: 'Contáctanos',
      bookConsultation: 'Reservar Consulta',
      contactForm: 'Formulario de Contacto',
      close: 'Cerrar',
      facebook: 'Facebook',
      twitter: 'X (Twitter)',
      threads: 'Threads',
      linkedin: 'LinkedIn',
      whatsappShare: 'WhatsApp',
      bookNow: 'Reservar Ahora',
      sendMessage: 'Enviar Mensaje'
    }
  };

  const contentData = textContent[lang as keyof typeof textContent] || textContent.en;

  // Social media icons as SVG components
  const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const ThreadsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.518.85-6.372 2.495-8.423C5.845 1.205 8.598.024 12.179 0h.007c3.581.024 6.334 1.205 8.184 3.509C22.35 5.56 23.5 8.414 23.5 11.932c0 3.518-1.15 6.372-3.13 8.423C18.655 22.795 15.767 24 12.186 24zM12.179 1.5c-3.085.02-5.447.955-6.994 2.744C3.74 5.91 2.996 8.592 2.996 12.068c0 3.476.744 6.158 2.189 7.824 1.547 1.789 3.909 2.724 6.994 2.744h.007c3.085-.02 5.447-.955 6.994-2.744 1.445-1.666 2.189-4.348 2.189-7.824 0-3.476-.744-6.158-2.189-7.824C17.626 2.455 15.264 1.52 12.179 1.5z"/>
      <path d="M12.186 6.75c-2.906 0-5.25 2.344-5.25 5.25s2.344 5.25 5.25 5.25 5.25-2.344 5.25-5.25-2.344-5.25-5.25-5.25zm0 9c-2.069 0-3.75-1.681-3.75-3.75s1.681-3.75 3.75-3.75 3.75 1.681 3.75 3.75-1.681 3.75-3.75 3.75z"/>
    </svg>
  );

  const LinkedInIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.86 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  );

  // Share functionality
  const shareContent = (platform: 'facebook' | 'twitter' | 'threads' | 'linkedin' | 'whatsapp' | 'copy') => {
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
      case 'threads':
        shareUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${text} ${url}`)}`;
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

  // PDF download functionality
  const handlePDFDownload = async () => {
    try {
      const confirmed = await showPDFConfirmation(title || 'Content', lang);
      if (!confirmed) return;
      
      const articleContent = typeof document !== 'undefined' ? 
        (document.querySelector('article') || document.querySelector('main') || document.querySelector('.prose')) : 
        null;
      if (!articleContent) {
        throw new Error('No content found to generate PDF');
      }
      
      const contentWithTitle = `
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #1f2937;">${title || 'Content'}</h1>
        ${articleContent.innerHTML}
      `;
      
      await generatePDF({
        title: title || 'Content',
        content: contentWithTitle,
        lang,
        filename: title
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Markdown copy functionality
  const handleMarkdownCopy = async () => {
    try {
      const confirmed = await showMarkdownConfirmation(title || 'Content', lang);
      if (!confirmed) return;
      
      const articleContent = typeof document !== 'undefined' ? 
        (document.querySelector('article') || document.querySelector('main') || document.querySelector('.prose')) : 
        null;
      if (!articleContent) {
        throw new Error('No content found to copy');
      }
      
      // Convert HTML to Markdown (simplified)
      let markdown = `# ${title || 'Content'}\n\n`;
      markdown += articleContent.textContent || articleContent.innerText;
      
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(markdown);
      }
    } catch (error) {
      console.error('Error copying markdown:', error);
    }
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
              <div className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  {contentData.shareOn}
                </div>
                <button
                  onClick={() => shareContent('facebook')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3 text-blue-600">
                    <FacebookIcon />
                  </div>
                  {contentData.facebook}
                </button>
                <button
                  onClick={() => shareContent('twitter')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3 text-gray-900">
                    <TwitterIcon />
                  </div>
                  {contentData.twitter}
                </button>
                <button
                  onClick={() => shareContent('threads')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3 text-gray-900">
                    <ThreadsIcon />
                  </div>
                  {contentData.threads}
                </button>
                <button
                  onClick={() => shareContent('linkedin')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3 text-blue-700">
                    <LinkedInIcon />
                  </div>
                  {contentData.linkedin}
                </button>
                <button
                  onClick={() => shareContent('whatsapp')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3 text-green-600">
                    <WhatsAppIcon />
                  </div>
                  {contentData.whatsappShare}
                </button>
                <button
                  onClick={() => shareContent('copy')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3 text-gray-600">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  {contentData.copyLink}
                </button>
              </div>
            )}
          </div>

          {/* PDF Download Button */}
          <button
            onClick={handlePDFDownload}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-red-600 hover:bg-red-50"
            aria-label={contentData.downloadPDF}
          >
            <DocumentArrowDownIcon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{contentData.pdf}</span>
          </button>

          {/* Markdown Copy Button */}
          <button
            onClick={handleMarkdownCopy}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-green-600 hover:bg-green-50"
            aria-label={contentData.copyMarkdown}
          >
            <DocumentTextIcon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{contentData.md}</span>
          </button>

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
