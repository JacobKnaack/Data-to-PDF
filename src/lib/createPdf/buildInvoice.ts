import { Invoice } from '../../templates';
import { TextOptions } from '../processText';
import { DocumentConfiguration } from './pdfConfig';

interface InvoiceText extends TextOptions {
  text: string;
}

export default function buildInvoice(
  invoice: Invoice,
  config: DocumentConfiguration,
): InvoiceText[] {
  const invoiceText: InvoiceText[] = [];
  const { font, content } = config;
  const { width, height, startX, startY } = content;

  let cursorY = startY;

  const addText = (text: string, fontSize: number, margin: number = 12): void => {
    const textValues = {
      text,
      width,
      height,
      font,
      fontSize,
      startY: cursorY,
      margin,
    }
    invoiceText.push(textValues);
    cursorY -= fontSize + margin;
  }
  addText(invoice.company.name, 14);
  if (invoice.company.address) addText(invoice.company.address, 12);
  // TODO: need utility to handle images
  // if (invoice.company.logo_url) {}
  addText(invoice.client.name, 14);
  if (invoice.client.address) addText(invoice.client.address, 12);
  if (invoice.client.email) addText(invoice.client.email, 12);

  invoice.line_items.forEach((item) => {
    addText(`${item.name} - ${item.description}, Quantity : ${item.quantity} - ${item.total}`, 12, 8);
  });

  addText(`Totals: ${invoice.total.subtotal}`, 14);
  addText(`Tax: ${invoice.total.tax_rate}`, 14);
  addText(`GrandTotal: ${invoice.total.grand_total}`, 14);

  if (invoice.payment_methods) {
    invoice.payment_methods.forEach((method) => {
      const note: string = method.details.note ? `- ${method.details.note}` : '';
      addText(`${method.details.name}${note}`, 12, 10);
    });
  }

  return invoiceText;
}

