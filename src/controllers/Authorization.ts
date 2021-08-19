import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AUTH_TOKEN_KEY } from '../constants';
import { connection } from '../services/connection';
import verifyTokenHeader from '../utils/verifyTokenHeader';
import * as Schema from '../validators/Authorization';

export const logIn = (req: Request<{}, {}, Schema.LogInSchema>, res: Response): void => {
  const userData: [number, string] = [req.body.carne, req.body.password];

  connection
    .query('select count(*) = 1 as logged from usuario where carne = $1 and password = crypt($2, password) limit 1;', userData)
    .then((response) => {
      // Si no logró iniciar sesión
      if (!response.rows[0].logged) { res.sendStatus(403); return; }

      // Si logró iniciar sesión
      const token = jwt.sign({ carne: userData[0] }, AUTH_TOKEN_KEY, { expiresIn: '1 day' });
      res.json({ token });
    });
};

export const signUp = (req: Request<{}, {}, Schema.SignUpSchema>, res: Response) => {
  const newUserData = [
    req.body.carne, // $1
    req.body.nombre, // $2
    req.body.apellido, // $3
    req.body.carreraId, // $4
    req.body.password, // $5
    req.body.correo, // $6
  ];

  connection
    .query('insert into usuario values ($1, $2, $3, $4, crypt($5, gen_salt(\'bf\')), $6)', newUserData)
    .then(() => {
      const token = jwt.sign({ carne: newUserData[0] }, AUTH_TOKEN_KEY, { expiresIn: '1 day' });
      res.status(201).json({ token });
    })
    .catch(() => { res.sendStatus(403); });
};

export const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const carne = verifyTokenHeader(AUTH_TOKEN_KEY, req.headers.authorization);
  if (carne == null) { res.sendStatus(401); return; }
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
      if (rows.rowCount === 0) { res.sendStatus(403); return; }
      res.sendStatus(201);
    });
};
