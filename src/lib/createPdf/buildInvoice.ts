import { Invoice } from '../../templates';
import { TextOptions } from '../processText';
import { DocumentConfiguration } from './pdfConfig';

export default function buildInvoice(
  invoice: Invoice,
  config: DocumentConfiguration,
): TextOptions[] {
  const invoiceText: TextOptions[] = [];

  // TODO: create our invoice text options here.


  return invoiceText;
}

