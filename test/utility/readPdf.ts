import { PDFParse } from 'pdf-parse';

export const fromBuffer = async (buffer: Buffer) => {
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();
  const { info } = await parser.getInfo();

  return {
    text,
    info,
  }
}

export default {
  fromBuffer,
}
