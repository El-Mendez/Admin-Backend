import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AUTH_TOKEN_KEY } from '../constants';
import { connection } from '../services/connection';
import verifyTokenHeader from '../utils/verifyTokenHeader';
import * as Schema from '../validators/Authorization';

export const logIn = (req: Request<{}, {}, Schema.LogInSchema>, res: Response): void => {
  const userData: [number, string] = [req.body.carne, req.body.password];

  connection
    .query('select exists(select 1 from usuario where carne = $1 and password = crypt($2, password)) as logged;', userData)
    .then((response) => {
      // Si no logró iniciar sesión
      if (!response.rows[0].logged) { res.status(403).json({ err: 'Incorrect password or carne.' }); return; }

      // Si logró iniciar sesión
      const token = jwt.sign({ carne: userData[0] }, AUTH_TOKEN_KEY, { expiresIn: '1 day' });
      res.json({ token });
    });
};

export const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const carne = verifyTokenHeader(AUTH_TOKEN_KEY, req.headers.authorization);
  if (carne == null) { res.status(401).json({ err: 'The authorization token is invalid, missing or expired.' }); return; }
  req.carne = carne;
  next();
};

export const changePassword = (
  req: Request<{}, {}, Schema.ChangePasswordSchema>,
  res: Response,
): void => {
  const parameters = [req.carne, req.body.newPassword, req.body.oldPassword];

  connection
    .query(`
        update usuario set password = crypt($2, gen_salt('bf')) 
        where carne = $1 and password = crypt($3, password);`, parameters)
    .then((rows) => {
      if (rows.rowCount === 0) { res.status(403).json({ err: 'Incorrect old password.' }); return; }
      res.sendStatus(201);
    });
};
