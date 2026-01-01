import { StandardFonts, PDFDocument, PageSizes } from 'pdf-lib';

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

export async function configure(settings: PdfDocumentSettings): Promise<PDFDocument> {

  const doc = await PDFDocument.create();

  await doc.embedFont(settings.font_family as string);
  doc.setTitle(settings.file_name);

  const size = PageSizes[settings.page_size];
  const page = doc.addPage(size);

  // TODO: need to use use margin to prevent overflow
  const { width, height } = page.getSize();
  const contentWidth = width - settings.margin.left - settings.margin.right;
  const contentHeight = height - settings.margin.top - settings.margin.bottom;

  return doc;
};

