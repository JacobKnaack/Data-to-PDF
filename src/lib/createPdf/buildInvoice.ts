import { Invoice } from '../../templates';
import { TextOptions } from '../processText';
import { DocumentConfiguration } from './pdfConfig';
import { TableOptions, TableColumn, TableRow } from '../drawTable';

interface InvoiceContent extends TextOptions {
  text?: string;
  url?: string;
  table?: TableOptions;
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
  const columns: TableColumn[] = [
    { title: 'Description', x: 0, width: 200 },
    { title: 'Unit Price', x: 200, width: 100 },
    { title: 'Qty', x: 300, width: 50 },
    { title: 'Total', x: 350, width: 100},
  ];
  const rows: TableRow[] = invoice.line_items.map((item) => ({
    values: [
      item.name,
      `${item.price.toFixed(2)}`,
      item.quantity.toString(),
      `${item.total.toFixed(2)}`,
    ],
  }));
  const rowHeight = 24;
  const tableHeight = rowHeight * (rows.length + 1);
  invoiceContent.push({
    table: { page: config.page, startX: 50, startY: cursorY, rowHeight, columns, rows },
    font: config.font,
    fontSize: 12,
    width: 500,
    height: 500,
    startY: cursorY,
    margin: 4,
  });
  // advance cursorY for each table row
  cursorY -= tableHeight + 20;

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

