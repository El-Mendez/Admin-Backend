import { Request, Response } from 'express';
import limiter from 'express-rate-limit';

export const NotFound = (req: Request, res: Response): void => {
  res.status(404).json({ err: 'The method you are trying to access does not exist. Did you use the correct URI and Method?' });
};

export const rateLimit = limiter({
  windowMs: 5 * 60 * 1000, // tiempo en milis
  max: 100,
  message: 'Too many requests',
  statusCode: 429,
});
