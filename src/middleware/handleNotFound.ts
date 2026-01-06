import { Request, Response } from 'express';

export default function handleNotFound(req: Request, res: Response) {
  res.status(404).json({
    error: 'Resource Not Found',
    message: `We are unable to find ${req.originalUrl}.`,
  });
}

