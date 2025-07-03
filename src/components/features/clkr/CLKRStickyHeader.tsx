import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CLKRStickyHeaderProps {
  title: string;
  lastEdited?: string;
  readingTime?: number;
  lang?: string;
  showBreadcrumb?: boolean;
  currentSlug?: string;
}

const CLKRStickyHeader: React.FC<CLKRStickyHeaderProps> = ({
  title,
  lastEdited,
  readingTime,
  lang = 'en',
  showBreadcrumb = false,
  currentSlug
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show header when scrolling past the main header (approximately 200px)
      const scrollThreshold = 200;
      const shouldBeVisible = window.scrollY > scrollThreshold;
      
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
        
        // Toggle navbar shadow based on sticky header visibility
        const navbar = document.querySelector('#sticky-header');
        if (navbar) {
          if (shouldBeVisible) {
            // Remove shadow from navbar when sticky header appears
            navbar.classList.remove('shadow-lg');
            navbar.classList.add('shadow-none');
          } else {
            // Restore shadow to navbar when sticky header disappears
            navbar.classList.remove('shadow-none');
            navbar.classList.add('shadow-lg');
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generatePDF = async () => {
    try {
      // Create a temporary container with the content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.padding = '40px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.6';
      tempContainer.style.color = '#333';

      // Get the main content
      const mainContent = document.querySelector('.prose');
      if (mainContent) {
        tempContainer.innerHTML = `
          <h1 style="font-size: 24px; margin-bottom: 20px; color: #1f2937;">${title}</h1>
          ${mainContent.innerHTML}
        `;
      }

      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (error) {
      
    }
  };

  const copyMarkdown = async () => {
    try {
      const mainContent = document.querySelector('.prose');
      if (!mainContent) return;

      // Convert HTML to markdown (simplified version)
      let markdown = `# ${title}\n\n`;
      
      // Convert headings
      const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const prefix = '#'.repeat(level);
        markdown += `${prefix} ${heading.textContent}\n\n`;
      });

      // Convert paragraphs
      const paragraphs = mainContent.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent?.trim()) {
          markdown += `${p.textContent}\n\n`;
        }
      });

      await navigator.clipboard.writeText(markdown);
      
      // Show success feedback
      const button = document.querySelector('[data-action="markdown"]') as HTMLElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = lang === 'es' ? '¡Copiado!' : 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      
    }
  };

  const shareContent = (platform: string) => {
    const url = window.location.href;
    const text = title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // Show success feedback
        const button = document.querySelector('[data-action="copy-link"]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = lang === 'es' ? '¡Enlace copiado!' : 'Link copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-[100px] z-40 bg-white border-b border-gray-200 shadow-lg transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left side - Title and breadcrumb */}
          <div className="flex-1 min-w-0">
            {showBreadcrumb && (
              <nav className="mb-1" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-xs text-gray-500">
                  <li><a href={`/${lang}`} className="hover:text-gray-700">{lang === 'es' ? 'Inicio' : 'Home'}</a></li>
                  <li className="flex items-center">
                    <span className="mx-2">/</span>
                    <a href={`/${lang}/clkr`} className="hover:text-gray-700">CLKR</a>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate">{title}</span>
                  </li>
                </ol>
              </nav>
            )}
            <h1 className="text-lg font-medium text-gray-900 truncate">{title}</h1>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {/* PDF Download */}
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              title={lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>

            {/* Markdown Copy */}
            <button
              onClick={copyMarkdown}
              data-action="markdown"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              title={lang === 'es' ? 'Copiar Markdown' : 'Copy Markdown'}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {lang === 'es' ? 'Markdown' : 'Markdown'}
            </button>

            {/* Share Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title={lang === 'es' ? 'Compartir' : 'Share'}
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                {lang === 'es' ? 'Compartir' : 'Share'}
                <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => shareContent('facebook')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button
                      onClick={() => shareContent('twitter')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      X (Twitter)
                    </button>
                    <button
                      onClick={() => shareContent('copy')}
                      data-action="copy-link"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLKRStickyHeader; 