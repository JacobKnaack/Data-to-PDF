import { PDFDocument, StandardFonts, rgb, PDFFont, PageSizes } from 'pdf-lib';

export interface PdfOptions {
  fontSize?: number;
  color?: [number, number, number];
  margin?: number;
  lineHeight?: number;
  maxWidth?: number;
  pageSize?: [number, number];
}

type TextLine = {
  chars: string;
  x: number;
  y: number;
  size: number;
  font: PDFFont;
};

const processText = (
  text: string,
  textWidth: number,
  textHeight: number,
  font: PDFFont,
  fontSize: number,
  yPosition: number,
  margin: number,
): Array<TextLine> => {
  const lines: Array<TextLine> = [];
  const words = text.split(' ');
  let line = '';

  for (const word of words) {
    const tempLine = line + word + ' ';
    const tempLineWidth = font.widthOfTextAtSize(tempLine, fontSize);

    if (tempLineWidth > textWidth && line.length > 0) {
      lines.push({ chars: line, x: margin, y: yPosition, size: fontSize, font });
      line = word + ' ';
      yPosition -= textHeight;
    } else {
      line = tempLine;
    }
  }
  lines.push({ chars: line, x: margin, y: yPosition, size: fontSize, font });
  return lines;
}

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
  text: string,
  options: PdfOptions = {},
): Promise<Uint8Array> {
  const { fontSize = 12, color = [0,0,0], margin = 50, lineHeight = 14, pageSize = PageSizes.A4 } = options;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage(pageSize);
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const textWidth = width - (margin * 2);
  const yPosition = height - margin;

  // process text to create text lines
  const lines = processText(text, textWidth, lineHeight, font, fontSize, yPosition, margin);

  lines.forEach((line: TextLine) => {
    page.drawText(line.chars, {
      x: line.x,
      y: line.y,
      size: line.size,
      font: line.font,
    });
  });

  const bytes = await pdf.save();
  return bytes;
}

export default createPdf;

