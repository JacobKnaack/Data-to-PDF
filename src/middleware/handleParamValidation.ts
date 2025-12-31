import { Request, Response, NextFunction } from 'express';


export default function handleRequestBody(req: Request, res: Response, next: NextFunction): void {
  if (!req.body.document_type) {
    next('Invalid PDF Template');
  }
  if (req.body.document_type === 'text' && !req.body.text) {
    next('Invalid Text Document');
  }

  next();
};


