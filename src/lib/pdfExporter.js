import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportTripToPDF(containerId, filename = 'trip.pdf', onProgress) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found.`);
  }

  // Find all page-break/section wrapper divs inside the container
  const pages = Array.from(container.querySelectorAll('.mobile-pdf-page'));
  if (pages.length === 0) {
    throw new Error('No pages found with class ".mobile-pdf-page".');
  }

  let pdf = null;

  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      onProgress(i + 1, pages.length);
    }

    const pageEl = pages[i];
    
    // Capture the element as a high-resolution canvas
    const canvas = await html2canvas(pageEl, {
      scale: 2.5, // Upscale canvas size for crisp text and images
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#07101F' // Set dark theme background or fallback
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pageWidth = pageEl.offsetWidth;
    const pageHeight = pageEl.offsetHeight;

    if (i === 0) {
      // Initialize PDF with the size of the first page (usually CoverPage)
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pageWidth, pageHeight],
        compress: true
      });
    } else {
      // Add page with matching dimensions for subsequent sections
      pdf.addPage([pageWidth, pageHeight], 'portrait');
    }

    // Place the canvas image in the PDF page (coordinates 0, 0, width, height)
    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  if (pdf) {
    pdf.save(filename);
  }
}
