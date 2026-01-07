import express, { Request, Response, NextFunction } from 'express';
import handleParamValidation from './middleware/handleParamValidation';
import handleNotFound from './middleware/handleNotFound';
import createPdf from './lib/createPdf';

const app = express();
app.use(express.json());

app.post('/pdf', handleParamValidation, async (req: Request, res: Response, next: NextFunction) => {
  const pdfBytes: Uint8Array = await createPdf(req.body);
  const pdfBuffer = Buffer.from(pdfBytes);
  const fileName = req.body.document_settings && req.body.document_settings.file_name
    ? req.body.document_settings.file_name
    : 'document';
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename:"${fileName}"`);
  res.end(pdfBuffer);
});

app.use(handleNotFound);

export default app;

