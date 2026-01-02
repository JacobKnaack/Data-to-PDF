import { PdfDocumentSettings } from './pdfConfig';
import { Invoice } from '../../templates';

export type InvoiceText = {
  content: string;
  fontSize?: number;
  margin?: number;
}

export default function buildInvoice(invoice: Invoice, documentOptions: PdfDocumentSettings): InvoiceText[] {
  const invoiceText: InvoiceText[] = [];

  // TODO: create our invoice text options here.

  return invoiceText;
}

