import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGenerationOptions {
  title: string;
  content: string;
  lang?: 'en' | 'es';
  filename?: string;
}

export const generatePDF = async (options: PDFGenerationOptions): Promise<void> => {
  const { title, content, lang = 'en', filename } = options;
  
  try {
    // Create a temporary container for PDF generation
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
    tempContainer.style.minHeight = 'auto';
    tempContainer.style.height = 'auto';
    tempContainer.innerHTML = content;
    
    // Append to body temporarily
    document.body.appendChild(tempContainer);
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate canvas from the content
    const canvas = await html2canvas(tempContainer, {
      scale: 1.2, // Balanced quality and performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: tempContainer.scrollHeight,
      width: tempContainer.scrollWidth,
      logging: false
    });
    
    // Create PDF
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40; // 20px margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add title to first page
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 20, 30);
    
    // Add a line under the title
    pdf.setLineWidth(1);
    pdf.line(20, 40, pageWidth - 20, 40);
    
    // Calculate available height for content (excluding title and footer)
    const availableHeight = pageHeight - 80; // Leave space for title (40px) and footer (40px)
    
    if (imgHeight <= availableHeight) {
      // Single page - add content directly
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 20, 60, imgWidth, imgHeight);
    } else {
      // Multiple pages - split the content
      const totalPages = Math.ceil(imgHeight / availableHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const sourceY = i * availableHeight;
        const sourceHeight = Math.min(availableHeight, imgHeight - sourceY);
        const targetY = i === 0 ? 60 : 20; // First page has title, others start at top
        
        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        if (pageCtx) {
          // Draw the specific slice of the original canvas
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
        }
        
        const scaledHeight = (sourceHeight * imgWidth) / canvas.width;
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 20, targetY, imgWidth, scaledHeight);
      }
    }
    
    // Add footer to each page
    const totalPages = Math.ceil(imgHeight / availableHeight) || 1;
    for (let i = 0; i < totalPages; i++) {
      pdf.setPage(i + 1);
      const footerY = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated from Capital M Law - ${new Date().toLocaleDateString()}`, 20, footerY);
      if (totalPages > 1) {
        pdf.text(`Page ${i + 1} of ${totalPages}`, pageWidth - 100, footerY);
      }
    }
    
    // Generate filename
    const safeTitle = (filename || title).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const finalFilename = `${safeTitle}.pdf`;
    
    // Save the PDF
    pdf.save(finalFilename);
    
    // Clean up
    document.body.removeChild(tempContainer);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(lang === 'es' ? 'Error al generar el PDF' : 'Error generating PDF');
  }
};

export const showPDFConfirmation = (title: string, lang: 'en' | 'es' = 'en'): Promise<boolean> => {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">
            ${lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
          </h3>
        </div>
        <p class="text-gray-600 mb-6">
          ${lang === 'es' 
            ? `¿Estás seguro de que quieres descargar "${title}" como PDF?` 
            : `Are you sure you want to download "${title}" as PDF?`
          }
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            id="pdf-cancel" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            ${lang === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button 
            id="pdf-confirm" 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            ${lang === 'es' ? 'Descargar' : 'Download'}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#pdf-cancel');
    const confirmBtn = modal.querySelector('#pdf-confirm');
    
    const cleanup = () => {
      document.body.removeChild(modal);
    };
    
    cancelBtn?.addEventListener('click', () => {
      cleanup();
      resolve(false);
    });
    
    confirmBtn?.addEventListener('click', () => {
      cleanup();
      resolve(true);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cleanup();
        resolve(false);
      }
    });
  });
};

export const showMarkdownConfirmation = (title: string, lang: 'en' | 'es' = 'en'): Promise<boolean> => {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">
            ${lang === 'es' ? 'Copiar Markdown' : 'Copy Markdown'}
          </h3>
        </div>
        <p class="text-gray-600 mb-6">
          ${lang === 'es' 
            ? `¿Estás seguro de que quieres copiar el contenido de "${title}" en formato Markdown?` 
            : `Are you sure you want to copy the content of "${title}" in Markdown format?`
          }
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            id="md-cancel" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            ${lang === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button 
            id="md-confirm" 
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            ${lang === 'es' ? 'Copiar' : 'Copy'}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#md-cancel');
    const confirmBtn = modal.querySelector('#md-confirm');
    
    const cleanup = () => {
      document.body.removeChild(modal);
    };
    
    cancelBtn?.addEventListener('click', () => {
      cleanup();
      resolve(false);
    });
    
    confirmBtn?.addEventListener('click', () => {
      cleanup();
      resolve(true);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cleanup();
        resolve(false);
      }
    });
  });
};
