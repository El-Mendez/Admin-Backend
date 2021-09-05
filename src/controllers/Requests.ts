import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_KEY, RESET_PASSWORD_TOKEN_KEY, VERIFY_TOKEN_KEY } from '../constants';
import { connection } from '../services/connection';
import verifyTokenHeader from '../utils/verifyTokenHeader';
import * as Email from '../services/Email';
import * as Schema from '../validators/Request';

export const resetPasswordRequest = (
  req: Request<{}, {}, Schema.ResetPasswordSchema>,
  res: Response,
): void => {
  res.sendStatus(202);

  connection
    .query('select carne, nombre, apellido, correo from usuario where carne = $1', [req.body.carne])
    .then((response) => {
      if (response.rows.length === 0) { return; }
      const {
        carne, nombre, apellido, correo,
      } = response.rows[0];
      const token = jwt.sign({ carne }, RESET_PASSWORD_TOKEN_KEY, { expiresIn: '10min' });

      Email.sendRecoveryPasswordEmail(
        `${nombre} ${apellido}`,
        correo,
        token,
      );
    });
};

export const acceptPasswordReset = (
  req: Request<{}, {}, Schema.AcceptPasswordResetSchema>,
  res: Response,
): void => {
  const carne = verifyTokenHeader(RESET_PASSWORD_TOKEN_KEY, req.headers.authorization);
  if (carne == null) { res.sendStatus(401); return; }

  connection
    .query(`
      update usuario set password = crypt($2, gen_salt('bf'))
       where carne = $1;`, [carne, req.body.newPassword])
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.sendStatus(500); });
};

export const SignUp = (
  req: Request<{}, {}, Schema.SignUpRequestSchema>,
  res: Response,
): void => {
  connection
    .query(`select 
       not exists(select 1 from usuario where carne = $1) and 
       exists(select 1 from carrera where id = $2) as valid;`, [req.body.carne, req.body.carreraId])
    .then((response) => {
      if (!response.rows[0].valid) { res.sendStatus(403); return; }
      res.sendStatus(202);

      const token = jwt.sign({
        carne: req.body.carne,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        carreraId: req.body.carreraId,
        password: req.body.password,
        correo: req.body.correo,
      }, VERIFY_TOKEN_KEY, { expiresIn: '20min' });

      Email.sendVerifyAccountEmail(`${req.body.nombre} ${req.body.apellido}`, req.body.correo, token);
    });
};

export const AcceptSignUp = (req: Request, res: Response): void => {
  const authToken = req.headers?.authorization?.split(' ')[1];
  if (!authToken) { res.sendStatus(401); return; }

  let tokenData: any;

  try {
    tokenData = jwt.verify(authToken, VERIFY_TOKEN_KEY);
  } catch (e) {
    res.sendStatus(401);
    return;
  }

  const newUserData = [
    tokenData.carne, // $1
    tokenData.nombre, // $2
    tokenData.apellido, // $3
    tokenData.carreraId, // $4
    tokenData.password, // $5
    tokenData.correo, // $6
  ];

  connection
    .query(`insert into usuario(carne, nombre, apellido, carrera_id, password, correo)
        values ($1, $2, $3, $4, crypt($5, gen_salt('bf')), $6)`, newUserData)
    .then(() => {
      const token = jwt.sign({ carne: newUserData[0] }, AUTH_TOKEN_KEY, { expiresIn: '1 day' });
      res.status(201).json({ token });
    })
    .catch(() => { res.sendStatus(403); });
};
