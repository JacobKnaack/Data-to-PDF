import { PDFDocument, PDFPage, PDFImage } from 'pdf-lib';

interface ImageOptions {
  page: PDFPage,
  pdf: PDFDocument,
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export default async function processImage(
  url: string,
  options: ImageOptions,
): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const imageBytes = new Uint8Array(buffer);

  const contentType = response.headers.get('content-type') || '';

  let embeddedImage: PDFImage;
  if (contentType.includes('png')) {
    embeddedImage = await options.pdf.embedPng(imageBytes);
  } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
    embeddedImage = await options.pdf.embedJpg(imageBytes);
  } else {
    try {
      embeddedImage = await options.pdf.embedPng(imageBytes);
    } catch(e) {
      embeddedImage = await options.pdf.embedJpg(imageBytes);
    }
  }

  const imgWidth = options.width || embeddedImage.width;
  const imgHeight = options.height || embeddedImage.height;

  options.page.drawImage(embeddedImage, {
    x: options.x,
    y: options.y,
    width: imgWidth,
    height: imgHeight,
  });
}

