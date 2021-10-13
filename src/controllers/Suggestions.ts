import { Request, Response } from 'express';
import { connection } from '../services/Postgres/connection';

export const bySections = (
  req: Request,
  res: Response,
): void => {
  connection
    .query(`
      select * from sections_suggestions($1);`, [req.carne])
    .then((response) => { res.json(response.rows); });
};

export const byHobbies = (
  req: Request,
  res: Response,
): void => {
  connection
    .query(`
      select * from hobbies_suggestions($1);`, [req.carne])
    .then((response) => { res.json(response.rows); });
};
