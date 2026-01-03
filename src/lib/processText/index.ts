import { PDFFont, PDFPage } from 'pdf-lib';
import { PdfDocumentSettings } from '../createPdf/pdfConfig';

export type TextLine = {
  chars: string;
  x: number;
  y: number;
  size: number;
};

export interface TextOptions {
  width: number,
  height: number,
  font: PDFFont,
  fontSize: number,
  startY: number,
  margin: number,
};

export const buildTextOptions = (page: PDFPage, settings: PdfDocumentSettings, font: PDFFont): TextOptions => {
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


function processText(
  text: string,
  options: TextOptions,
): Array<TextLine> {
  const lines: string[] = [];
  const words = text.trim().split(/\s+/);
  const {
    width,
    height,
    font,
    fontSize,
    startY,
    margin,
  } = options;

  let current = '';

  const fits = (candidate: string) => Boolean(font.widthOfTextAtSize(candidate, fontSize) <= width);

  for (const word of words) {
    const next: string = current.length === 0 ? word : `${current} ${word}`;

    if (fits(next)) {
      current = next;
    } else {
      if (current.length > 0) {
        lines.push(current);
      }
      current = word;
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines.map((chars, index) => ({
    chars,
    x: margin,
    y: startY - index * height,
    size: fontSize,
  }));
}

export default processText;

