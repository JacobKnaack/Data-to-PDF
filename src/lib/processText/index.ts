import { PDFFont } from 'pdf-lib';

export type TextLine = {
  chars: string;
  x: number;
  y: number;
  size: number;
  font: PDFFont;
};

function processText(
  text: string,
  textWidth: number,
  textHeight: number,
  font: PDFFont,
  fontSize: number,
  yPosition: number,
  margin: number,
): Array<TextLine> {
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

export default processText;

