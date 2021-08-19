import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RESET_PASSWORD_TOKEN_KEY } from '../constants';
import { connection } from '../services/connection';
import verifyTokenHeader from '../utils/verifyTokenHeader';
import * as Email from '../utils/Email';
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
