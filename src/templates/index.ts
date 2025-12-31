import { PdfDocumentSettings } from '../lib/createPdf/pdfConfig';

type PDFDocumentType = "text" | "invoice";

interface Document {
  document_type: PDFDocumentType;
  document_settings?: PdfDocumentSettings;
}

interface Text extends Document {
  text: string;
};

interface Invoice extends Document {

};

interface Form extends Document {

};

