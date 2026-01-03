import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage, PageSizes } from 'pdf-lib';
import { Document, Text, Invoice } from '../../templates';
import { PdfDocumentSettings, configure, DocumentConfiguration } from './pdfConfig';
import buildInvoice from './buildInvoice';
import processText, { TextLine, TextOptions, buildTextOptions } from '../processText';

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

const createTextLines = (text: string, options: TextOptions, config: DocumentConfiguration): void => {
  try {
    const lines = processText(text, options);

    lines.forEach((line: TextLine) => {
      config.page.drawText(line.chars, {
        x: line.x,
        y: line.y,
        size: line.size,
        font: config.font,
      });
    });
  } catch {
    throw new Error('Invalid Text Options');
  }
}

async function createPdf(options: createPdfOptions): Promise<Uint8Array> {
  try {
    const documentSettings: PdfDocumentSettings = { ...defaultSettings, ...options.document_settings };
    const config = await configure(documentSettings);

    const textOptions = buildTextOptions(config.page, documentSettings, config.font);

    if (options.document_type === 'invoice')  {
      const invoiceText = buildInvoice(options as Invoice, config);
      console.log('Creating Invoice Text', invoiceText);
    }

    if (options.document_type === 'text') {
      const { text } = options as Text;
      createTextLines(text, textOptions, config);
    }
    const bytes = await config.pdf.save();
    return bytes;
  } catch (e) {
    console.log('createPDF error: ', e);
    throw new Error('Unable to Create PDF Document');
  }
}

export default createPdf;

