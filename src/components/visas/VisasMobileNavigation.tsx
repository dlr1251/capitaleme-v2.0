import React, { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  ChevronUpIcon,
  PhoneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import type { Lang } from '../../context/LanguageContext.tsx';

interface VisasMobileNavigationProps {
  lang?: Lang;
  pathname?: string;
  title?: string;
}

const VisasMobileNavigation: React.FC<VisasMobileNavigationProps> = ({
  lang = 'en',
  pathname = '',
  title = ''
}) => {
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Set current URL on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareContent = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const text = title || document.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setIsShareDropdownOpen(false);
  };

  const downloadPDF = async () => {
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.padding = '40px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      
      const content = document.querySelector('article') || document.querySelector('main');
      if (content) {
        tempContainer.innerHTML = content.innerHTML;
        document.body.appendChild(tempContainer);
        
        const canvas = await html2canvas.default(tempContainer);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        pdf.save(`${(title || document.title).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Visas Mobile Navigation - Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Share Tab */}
          <div className="relative">
            <button
              onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                isShareDropdownOpen 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-label={lang === 'es' ? 'Compartir' : 'Share'}
            >
              <ShareIcon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium">{lang === 'es' ? 'Compartir' : 'Share'}</span>
            </button>

            {/* Share Dropdown */}
            {isShareDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => shareContent('facebook')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button
                    onClick={() => shareContent('twitter')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    X (Twitter)
                  </button>
                  <button
                    onClick={() => shareContent('whatsapp')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareContent('copy')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {lang === 'es' ? 'Copiar enlace' : 'Copy link'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Download */}
          <button
            onClick={downloadPDF}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            aria-label={lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
          >
            <DocumentArrowDownIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">PDF</span>
          </button>

          {/* Contact Button */}
          <a
            href={`/${lang}/contact`}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            aria-label={lang === 'es' ? 'Contacto' : 'Contact'}
          >
            <PhoneIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{lang === 'es' ? 'Contacto' : 'Contact'}</span>
          </a>

          {/* WhatsApp Inquiry */}
          <a
            href={`https://wa.me/573146022411?text=${encodeURIComponent(`Hello! I want to inquire about: ${title || document.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-green-600 hover:text-green-700 hover:bg-green-50"
            aria-label="WhatsApp"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40 flex flex-col space-y-2">
        {/* Go Up Button */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 bg-secondary text-white rounded-full shadow-lg hover:bg-primary transition-all duration-200 flex items-center justify-center hover:scale-105"
          aria-label={lang === 'es' ? 'Subir al inicio' : 'Scroll to top'}
        >
          <ChevronUpIcon className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default VisasMobileNavigation;
