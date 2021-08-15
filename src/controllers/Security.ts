import { Request, Response, NextFunction } from 'express';

export const antiSQLInjection = (req: Request, res: Response, next: NextFunction): void => {
  // FIXME esto no sirve
  const regex = /^((?!('"\$\\—%;)).)*$/;
  if (regex.test(Object.values(req.body).join())) {
    next();
  } else {
    res.sendStatus(400);
  }
};

export const NotFound = (req: Request, res: Response): void => { res.sendStatus(404); };
