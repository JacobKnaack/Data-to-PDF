import { StandardFonts, PDFDocument, PageSizes, PDFFont, PDFPage } from 'pdf-lib';

export type PdfPageSize = 'A4' | 'Letter' | 'Legal';

export interface PdfDocumentSettings {
  page_size: PdfPageSize;
  margin: {
    top: number,
    bottom: number,
    left: number,
    right: number,
  },
  font_family: string;
  font_size: number;
  file_name: string;
}

export interface DocumentConfiguration {
  pdf: PDFDocument;
  font: PDFFont,
  page: PDFPage,
  content: {
    width: number;
    height: number;
    startX: number;
    startY: number;
  };
}

export async function configure(settings: PdfDocumentSettings): Promise<DocumentConfiguration> {

  const pdf = await PDFDocument.create();

  const font = await pdf.embedFont(settings.font_family as string);
  pdf.setTitle(settings.file_name);

  const page = pdf.addPage(PageSizes[settings.page_size]);
  const { width, height } = page.getSize();

  const contentWidth = width - settings.margin.left - settings.margin.right;
  const contentHeight = height - settings.margin.top - settings.margin.bottom;

  return {
    pdf,
    font,
    page,
    content: {
      width: contentWidth,
      height: contentHeight,
      startX: settings.margin.left,
      startY: height - settings.margin.top,
    }
  };
};

