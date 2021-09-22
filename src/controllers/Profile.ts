import { Request, Response } from 'express';
import { connection } from '../services/Postgres/connection';

export const personalProfile = (
  req: Request,
  res: Response,
): void => {
  connection
    .query(`
            select * 
            from profile 
            where carne = $1;`, [req.carne])
    .then((response) => {
      if (!response.rows[0]) { res.status(403).json({ err: 'User without courses or hobbies.' }); return; }

      res.json(response.rows);
    });
};

export const userProfile = (
  req: Request<{ carne: string }, {}, {}>,
  res: Response,
): void => {
  const userId = parseInt(req.params.carne, 10);
  connection
    .query(`
            select * 
            from profile 
            where carne = $1;`, [userId])
    .then((response) => {
      if (!response.rows[0]) { res.status(403).json({ err: 'User without courses or hobbies.' }); return; }

      res.json(response.rows);
    });
};
