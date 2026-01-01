import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage, PageSizes } from 'pdf-lib';
import { PdfDocumentSettings } from './pdfConfig';
import processText, { TextLine, TextOptions } from '../processText';

export interface createPdfOptions extends PdfDocumentSettings {
  text?: string;
}

export const defaultOptions: PdfDocumentSettings = {
  page_size: 'A4',
  margin: { top: 73, bottom: 72, left: 72, right: 72 },
  font_family: 'Courier',
  font_size: 14,
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

const buildTextOptions = (page: PDFPage, settings: PdfDocumentSettings, font: PDFFont): TextOptions => {
  const { margin } = settings;
  const { width, height } = page.getSize();

  const usableWidth: number = width - margin.left - margin.right;
  const startY: number = height - margin.top;
  const fontSize: number = settings.font_size || defaultOptions.font_size;
  const lineHeight: number = Math.round(fontSize * 1.2);

  return {
    width: usableWidth,
    height: lineHeight,
    font,
    fontSize,
    startY,
    margin: margin.left,
  }
}

async function createPdf(
  options: createPdfOptions,
): Promise<Uint8Array> {
  try {
    const {
      page_size = defaultOptions.page_size,
      margin = defaultOptions.margin,
      font_family = defaultOptions.font_family,
      font_size = defaultOptions.font_size,
      file_name = defaultOptions.file_name,
    } = options;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage(PageSizes[page_size]);
    const { width, height } = page.getSize();

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const textWidth = width - (margin.left * 2);
    const startY = height - margin.top;

    // process text to create text lines
    if (options.text) {
      const textOptions = buildTextOptions(page, options, font);
      const lines = processText(options.text, textOptions);

      lines.forEach((line: TextLine) => {
        page.drawText(line.chars, {
          x: line.x,
          y: line.y,
          size: line.size,
          font,
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

