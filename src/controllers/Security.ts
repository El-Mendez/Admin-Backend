import { Request, Response } from 'express';

export const NotFound = (req: Request, res: Response): void => {
  res.status(404).json({ err: 'The method you are trying to access does not exist. Did you use the correct URI and Method?' });
};
