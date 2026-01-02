import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage, PageSizes } from 'pdf-lib';
import { Document, Text, Invoice } from '../../templates';
import { PdfDocumentSettings } from './pdfConfig';
import buildInvoice from './buildInvoice';
import processText, { TextLine, TextOptions } from '../processText';

export interface createPdfOptions extends Document {}

export const defaultSettings: PdfDocumentSettings = {
  page_size: 'A4',
  margin: { top: 72, bottom: 72, left: 72, right: 72 },
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

const buildTextOptions = (page: PDFPage, settings: PdfDocumentSettings, font: PDFFont): TextOptions => {
  const { margin } = settings;
  const { width, height } = page.getSize();

  const usableWidth: number = width - margin.left - margin.right;
  const startY: number = height - margin.top;
  const fontSize: number = settings.font_size || settings.font_size;
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

const createTextDocument = (document: Text, options: TextOptions, page: PDFPage, font: PDFFont): void => {
  try {
    const lines = processText(document.text, options);

    lines.forEach((line: TextLine) => {
      page.drawText(line.chars, {
        x: line.x,
        y: line.y,
        size: line.size,
        font,
      });
    });
  } catch {
    throw new Error('Invalid Text Options');
  }
}

async function createPdf(
  options: createPdfOptions,
): Promise<Uint8Array> {
  try {
    const documentSettings: PdfDocumentSettings = { ...defaultSettings, ...options.document_settings };
    const {
      page_size,
      margin,
      font_family,
      font_size,
      file_name,
    } = documentSettings;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage(PageSizes[page_size]);
    const { width, height } = page.getSize();

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const textWidth = width - (margin.left * 2);
    const startY = height - margin.top;
    const textOptions = buildTextOptions(page, documentSettings, font);

    if (options.document_type === 'invoice')  {
      console.log('Creating Invoice');
    }

    if (options.document_type === 'text') {
      createTextDocument(options as Text, textOptions, page, font);
    }
    const bytes = await pdf.save();
    return bytes;
  } catch (e) {
    console.log('createPDF error: ', e);
    throw new Error('Unable to Create PDF Document');
  }
}

export default createPdf;

