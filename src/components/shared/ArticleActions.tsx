import React, { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  DocumentArrowDownIcon, 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { generatePDF, showPDFConfirmation, showMarkdownConfirmation } from '../../utils/pdfUtils.js';
import ContactForm from '../ui/forms/ContactForm.tsx';

interface ArticleActionsProps {
  title: string;
  content: string;
  lang?: 'en' | 'es';
  type?: 'guide' | 'visa' | 'clkr' | 'blog';
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  title,
  content,
  lang = 'en',
  type = 'guide'
}) => {
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.article-actions-dropdown') && !target.closest('.article-actions-container')) {
        setIsShareDropdownOpen(false);
        setIsContactDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Social sharing functions
  const shareContent = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = title || document.title;
    
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
        navigator.clipboard.writeText(url);
        // Show success notification
        showNotification(
          lang === 'es' ? 'Enlace copiado al portapapeles' : 'Link copied to clipboard',
          'success'
        );
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setIsShareDropdownOpen(false);
  };

  // PDF download function
  const downloadPDF = async () => {
    try {
      const confirmed = await showPDFConfirmation(title, lang);
      if (!confirmed) return;
      
      const articleContent = document.querySelector('.prose') || document.querySelector('article') || document.querySelector('main');
      if (!articleContent) {
        throw new Error('No content found to generate PDF');
      }
      
      const contentWithTitle = `
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #1f2937;">${title}</h1>
        ${articleContent.innerHTML}
      `;
      
      await generatePDF({
        title: title,
        content: contentWithTitle,
        lang,
        filename: title
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification(
        lang === 'es' ? 'Error al generar PDF' : 'Error generating PDF',
        'error'
      );
    }
  };

  // Markdown copy function
  const copyMarkdown = async () => {
    if (!content) return;
    
    try {
      const confirmed = await showMarkdownConfirmation(title, lang);
      if (!confirmed) return;
      
      await navigator.clipboard.writeText(content);
      showNotification(
        lang === 'es' ? 'Markdown copiado al portapapeles' : 'Markdown copied to clipboard',
        'success'
      );
    } catch (err) {
      console.error('Failed to copy markdown:', err);
      showNotification(
        lang === 'es' ? 'Error al copiar Markdown' : 'Error copying Markdown',
        'error'
      );
    }
  };

  // Notification function
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Calendly modal function
  const openCalendlyModal = () => {
    const modal = document.createElement('div');
    modal.id = 'calendly-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    
    const closeText = lang === 'es' ? 'Cerrar' : 'Close';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            ${lang === 'es' ? 'Reservar Consulta' : 'Book Consultation'}
          </h3>
          <button onclick="closeCalendlyModal()" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="h-[600px]">
          <div id="calendly-inline-widget" class="w-full h-full"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.Calendly) {
        // @ts-ignore
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/capitalm/30min',
          parentElement: document.getElementById('calendly-inline-widget'),
          prefill: {},
          utm: {}
        });
      }
    };
    document.head.appendChild(script);
  };

  // Global functions for modal close
  useEffect(() => {
    // @ts-ignore
    window.closeCalendlyModal = () => {
      const modal = document.getElementById('calendly-modal');
      if (modal) {
        modal.remove();
      }
    };
  }, []);

  // Text content based on language
  const textContent = {
    en: {
      share: 'Share',
      download: 'PDF',
      copy: 'MD',
      contact: 'Contact',
      shareOn: 'Share on',
      copyLink: 'Copy Link',
      downloadPDF: 'Download PDF',
      copyMarkdown: 'Copy Markdown',
      contactUs: 'Contact Us',
      bookConsultation: 'Book Consultation',
      whatsapp: 'WhatsApp',
      contactForm: 'Contact Form'
    },
    es: {
      share: 'Compartir',
      download: 'PDF',
      copy: 'MD',
      contact: 'Contacto',
      shareOn: 'Compartir en',
      copyLink: 'Copiar Enlace',
      downloadPDF: 'Descargar PDF',
      copyMarkdown: 'Copiar Markdown',
      contactUs: 'Contáctanos',
      bookConsultation: 'Reservar Consulta',
      whatsapp: 'WhatsApp',
      contactForm: 'Formulario de Contacto'
    }
  };

  const textContentData = textContent[lang as keyof typeof textContent] || textContent.en;

  return (
    <>
      {/* Main Action Buttons */}
      <div className="article-actions-container fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
            title={textContentData.share}
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          
          {/* Share Dropdown */}
          {isShareDropdownOpen && (
            <div className="article-actions-dropdown absolute bottom-14 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]">
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">{textContentData.shareOn}</span>
              </div>
              
              <button
                onClick={() => shareContent('facebook')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3 text-blue-600">📘</span>
                Facebook
              </button>
              
              <button
                onClick={() => shareContent('twitter')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3 text-blue-400">🐦</span>
                Twitter
              </button>
              
              <button
                onClick={() => shareContent('linkedin')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3 text-blue-700">💼</span>
                LinkedIn
              </button>
              
              <button
                onClick={() => shareContent('whatsapp')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3 text-green-600">📱</span>
                WhatsApp
              </button>
              
              <button
                onClick={() => shareContent('copy')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3 text-gray-600">🔗</span>
                {textContentData.copyLink}
              </button>
            </div>
          )}
        </div>

        {/* PDF Download Button */}
        <button
          onClick={downloadPDF}
          className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-105"
          title={textContentData.downloadPDF}
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
        </button>

        {/* Markdown Copy Button */}
        <button
          onClick={copyMarkdown}
          className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
          title={textContentData.copyMarkdown}
        >
          <DocumentTextIcon className="w-5 h-5" />
        </button>

        {/* Contact Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
            className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105"
            title={textContentData.contact}
          >
            {isContactDropdownOpen ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            )}
          </button>
          
          {/* Contact Dropdown */}
          {isContactDropdownOpen && (
            <div className="article-actions-dropdown absolute bottom-14 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] animate-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">{textContentData.contactUs}</span>
              </div>
              
              <button
                onClick={() => {
                  window.open('https://wa.me/573146022411?text=Hola,%20necesito%20información%20sobre%20servicios%20legales', '_blank', 'noopener,noreferrer');
                  setIsContactDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {textContentData.whatsapp}
              </button>
              
              <button
                onClick={() => {
                  setShowContactModal(true);
                  setIsContactDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {textContentData.contactForm}
              </button>
              
              <button
                onClick={() => {
                  openCalendlyModal();
                  setIsContactDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <CalendarIcon className="w-5 h-5 mr-3 text-purple-600" />
                {textContentData.bookConsultation}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {lang === 'es' ? 'Envíanos un mensaje' : 'Send us a message'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {lang === 'es' ? 'Te responderemos en menos de 24 horas' : "We'll get back to you within 24 hours"}
                  </p>
                </div>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <ContactForm lang={lang} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleActions;
