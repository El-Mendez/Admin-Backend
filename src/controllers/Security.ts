import { Request, Response } from 'express';

export const NotFound = (req: Request, res: Response): void => { res.sendStatus(404); };
