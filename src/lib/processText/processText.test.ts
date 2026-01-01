import { describe, it, expect, beforeAll } from 'vitest';
import { StandardFonts, PDFFont, PDFDocument } from 'pdf-lib';
import processText from './index';

let testFont: PDFFont;

describe('processText', () => {
  beforeAll(async () => {
    const pdf = await PDFDocument.create();
    testFont = await pdf.embedFont(StandardFonts.Helvetica);
  });

  it('should process a small text string', async () => {
    const text = 'Hello World';
    const options = {
      width: 50,
      height: 12,
      font: testFont,
      fontSize: 1,
      startY: 100,
      margin: 10,
    };

    const result = processText(text, options);
    expect(result).toHaveLength(1);
    expect(result[0].chars).toBe(text);
    expect(result[0].y).toBe(100);
  });

  it('should process text into multiple lines', () => {
    const text = 'Hello World again';

    const options = {
      width: 7,
      height: 10,
      font: testFont,
      fontSize: 1,
      startY: 100,
      margin: 10
    };

    const result = processText(text, options);

    expect(result).toHaveLength(2);
    expect(result[0].chars).toBe('Hello World');
    expect(result[1].chars).toBe('again');
    expect(result[1].y).toBe(100 - 10);
  });
});

