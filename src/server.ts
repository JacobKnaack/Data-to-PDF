import express, { Request, Response } from "express";
import createPdf from './lib/createPdf';

const app = express();
app.use(express.json());

app.post('/pdf', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    next('Invalid request');
  }

  const pdf = await createPdf(text);

  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdf));
});

export default app;

