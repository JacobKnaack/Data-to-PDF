import { PdfDocumentSettings } from '../lib/createPdf/pdfConfig';

export type PDFDocumentType = "text" | "invoice" | "form";

export interface Document {
  document_type: PDFDocumentType;
  document_settings?: PdfDocumentSettings;
}

export interface Text extends Document {
  text: string;
};

export type LineItemAdjustment = {
  description: string;
  amount: number;
}

export interface InvoiceLineItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  adjustments?: LineItemAdjustment[];
}

export interface PaymentMethod {
  type: string;
  details: {
    name: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    routing_number?: string;
    identifier?: string;
    uri?: string;
    note?: string;
  }
}

export interface Invoice extends Document {
  invoice_number?: string;
  date_issued?: string;
  date_due?: string;
  currency_char?: string;
  company: {
    name: string;
    address?: string;
    logo_url?: string;
  };
  client: {
    name: string;
    address?: string;
    email?: string;
  };
  line_items: InvoiceLineItem[];
  total: {
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    grand_total: number;
  };
  payment_methods?: PaymentMethod[];
  signature?: string;
};

export interface Form extends Document {

};

