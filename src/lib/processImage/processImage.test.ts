import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import processImage from './index';

describe('processImage', () => {
  it('should add a PNG image to a PDF Document', async () => {
    const pdf = await PDFDocument.create();
    const page = await pdf.addPage([600, 800]);

    await processImage('https://placehold.co/400.png', {
      pdf,
      page,
      x: 200,
      y: 200,
    });

    const bytes = await pdf.save();

    const pdfString = Buffer.from(bytes).toString('latin1');
    expect(pdfString).toMatch(/\/XObject/);
    expect(pdfString).toMatch(/\/Image/);
  });

  it('should add a JPG image to a PDF Document', async () => {
    const pdf = await PDFDocument.create();
    const page = await pdf.addPage([600, 800]);

    await processImage('https://placehold.co/400.jpg', {
      pdf,
      page,
      x: 200,
      y: 200,
    });

    const bytes = await pdf.save();

    const pdfString = Buffer.from(bytes).toString('latin1');
    expect(pdfString).toMatch(/\/XObject/);
    expect(pdfString).toMatch(/\/Image/);
  });
});

