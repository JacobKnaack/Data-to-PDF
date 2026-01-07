import { Invoice } from '../../templates';
import { TextOptions } from '../processText';
import { DocumentConfiguration } from './pdfConfig';

interface InvoiceContent extends TextOptions {
  text?: string;
  url?: string;
}

export default function buildInvoice(
  invoice: Invoice,
  config: DocumentConfiguration,
): InvoiceContent[] {
  const invoiceContent: InvoiceContent[] = [];
  const { font, content } = config;
  const { width, height, startX, startY } = content;

  let cursorY = startY;
  const addImage = (url: string, margin: number = 12) => {
    const imageValues = {
      url,
      width,
      font,
      fontSize: 0,
      height,
      startY: cursorY,
      margin,
    }
    invoiceContent.push(imageValues);
    cursorY -= margin;
  };
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
    invoiceContent.push(textValues);
    cursorY -= fontSize + margin;
  }

  // Title
  addText('Invoice', 18, 20);

  // Company Section
  if (invoice.company.logo_url) {
    addImage(invoice.company.logo_url, 20);
  }
  addText(invoice.company.name, 18, 6);
  if (invoice.company.address) addText(invoice.company.address, 12, 4);

  // Client Section
  addText('Bill To:', 14, 12);
  addText(invoice.client.name, 14, 4);
  if (invoice.client.address) addText(invoice.client.address, 12, 4);
  if (invoice.client.email) addText(invoice.client.email, 12, 4);

  // Line Items
  addText('Line Items', 14, 16);
  invoice.line_items.forEach((item) => {
    addText(`${item.name} - ${item.description}`, 12, 2);
    addText(`Qty: ${item.quantity} | Total: ${item.total.toFixed(2)}`, 12, 8);
  });

  // Totals
  addText('Totals', 14, 16);
  addText(`Subtotal: ${invoice.total.subtotal.toFixed(2)}`, 12, 4);
  addText(`Tax: ${invoice.total.tax_rate * 100}%: ${invoice.total.tax_amount.toFixed(2)}`, 12, 4);
  addText(`GrandTotal: ${invoice.total.grand_total.toFixed(2)}`, 14, 12);

  if (invoice.payment_methods) {
    addText('Payment Methods:', 14, 16);
    invoice.payment_methods.forEach((method) => {
      const note: string = method.details.note ? `- ${method.details.note}` : '';
      addText(`${method.details.name}${note}`, 12, 6);
    });
  }

  return invoiceContent;
}

