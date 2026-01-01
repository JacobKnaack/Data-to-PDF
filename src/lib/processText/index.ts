import { PDFFont } from 'pdf-lib';

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

