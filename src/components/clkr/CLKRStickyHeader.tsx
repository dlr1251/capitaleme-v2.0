import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ShareIcon, 
  DocumentArrowDownIcon, 
  DocumentTextIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

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
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(lang === 'es' ? 'Error al generar el PDF' : 'Error generating PDF');
    }
  };

  const copyMarkdown = async () => {
    try {
      const mainContent = document.querySelector('.prose');
      if (mainContent) {
        // Simple markdown conversion
        let markdown = `# ${title}\n\n`;
        
        // Convert headings
        const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          const level = parseInt(heading.tagName.charAt(1));
          const prefix = '#'.repeat(level);
          markdown += `${prefix} ${heading.textContent}\n\n`;
        });

        // Convert paragraphs
        const paragraphs = mainContent.querySelectorAll('p');
        paragraphs.forEach(p => {
          if (!p.closest('h1, h2, h3, h4, h5, h6')) {
            markdown += `${p.textContent}\n\n`;
          }
        });

        await navigator.clipboard.writeText(markdown);
        alert(lang === 'es' ? 'Markdown copiado al portapapeles' : 'Markdown copied to clipboard');
      }
    } catch (error) {
      console.error('Error copying markdown:', error);
      alert(lang === 'es' ? 'Error al copiar markdown' : 'Error copying markdown');
    }
  };

  const shareContent = (platform: string) => {
    const url = window.location.href;
    const text = title;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Text content based on language
  const textContent = {
    en: {
      share: 'Share',
      download: 'Download PDF',
      copyMarkdown: 'Copy Markdown',
      twitter: 'Share on Twitter',
      linkedin: 'Share on LinkedIn',
      facebook: 'Share on Facebook',
      lastEdited: 'Last edited',
      readingTime: 'min read'
    },
    es: {
      share: 'Compartir',
      download: 'Descargar PDF',
      copyMarkdown: 'Copiar Markdown',
      twitter: 'Compartir en Twitter',
      linkedin: 'Compartir en LinkedIn',
      facebook: 'Compartir en Facebook',
      lastEdited: 'Última edición',
      readingTime: 'min de lectura'
    }
  };

  const content = textContent[lang as keyof typeof textContent] || textContent.en;

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Title and metadata */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {lastEdited && (
                <span>
                  {content.lastEdited}: {new Date(lastEdited).toLocaleDateString()}
                </span>
              )}
              {readingTime && (
                <span>
                  {readingTime} {content.readingTime}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            {/* Share button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ShareIcon className="w-4 h-4 mr-1" />
                {content.share}
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        shareContent('twitter');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mr-2">🐦</span>
                      {content.twitter}
                    </button>
                    <button
                      onClick={() => {
                        shareContent('linkedin');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mr-2">💼</span>
                      {content.linkedin}
                    </button>
                    <button
                      onClick={() => {
                        shareContent('facebook');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mr-2">📘</span>
                      {content.facebook}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Download PDF */}
            <button
              onClick={generatePDF}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              {content.download}
            </button>

            {/* Copy Markdown */}
            <button
              onClick={copyMarkdown}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <DocumentTextIcon className="w-4 h-4 mr-1" />
              {content.copyMarkdown}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLKRStickyHeader; 