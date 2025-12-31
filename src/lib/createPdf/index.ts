import { PDFDocument, StandardFonts, rgb, PDFFont, PageSizes } from 'pdf-lib';
import { PdfDocumentSettings } from './pdfConfig';
import processText, { TextLine } from '../processText';

export interface createPdfOptions extends PdfDocumentSettings {
  text?: string;
}

export const defaultOptions: PdfDocumentSettings = {
  page_size: 'A4',
  margin: { top: 73, bottom: 72, left: 72, right: 72 },
  font_family: 'Courier',
  file_name: 'my-document'
};

const addPage = (pdf: PDFDocument, pageSize: [number, number], margin: number) => {
  const page = pdf.addPage(pageSize);
  return {
    page,
    currentY: page.getSize().height - margin,
    usableWidth: page.getSize().width - margin,
    bottomTreshold: margin,
  };
};

// TODO: multipage support / Images & Logos / Colors & Styling

// TODO: Process Page Title, Author, Subject, and Keywords
const processMetadata = () => {}

async function createPdf(
  options: createPdfOptions,
): Promise<Uint8Array> {
  try {
    const {
      page_size = defaultOptions.page_size,
      margin = defaultOptions.margin,
      font_family = defaultOptions.font_family,
      file_name = defaultOptions.file_name,
    } = options;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage(PageSizes[page_size]);
    const { width, height } = page.getSize();

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const textWidth = width - (margin.left * 2);
    const yPosition = height - margin.top;

    // process text to create text lines
    if (options.text) {
      const lines = processText(options.text, textWidth, 14, font, 12, yPosition, margin.top);

      lines.forEach((line: TextLine) => {
        page.drawText(line.chars, {
          x: line.x,
          y: line.y,
          size: line.size,
          font: line.font,
        });
      });
    }
    const bytes = await pdf.save();
    return bytes;
  } catch (e) {
    throw new Error('Unable to Create PDF Document');
  }
}

export default createPdf;

