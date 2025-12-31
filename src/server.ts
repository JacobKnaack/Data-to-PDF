import express, { Request, Response, NextFunction } from 'express';
import handleParamValidation from './middleware/handleParamValidation';
import createPdf from './lib/createPdf';

const app = express();
app.use(express.json());

app.post('/pdf', handleParamValidation, async (req: Request, res: Response, next: NextFunction) => {
  const pdf = await createPdf(req.body);

  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdf));
});

export default app;

