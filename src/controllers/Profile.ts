import { Request, Response } from 'express';
import { connection } from '../services/connection';
import * as Schema from '../validators/Authorization';

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

export const userProfile = (req: Request<{}, {}, Schema.profileSchema>, res: Response): void => {
  const userId: number = req.body.carne;
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
