import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RESET_PASSWORD_TOKEN_KEY, EMAIL_RECEIVER_DOMAIN } from '../constants';
import connection from '../connection';
import verifyTokenHeader from '../utils/verifyTokenHeader';
import { isValid } from "../utils/areValid";
import * as Email from './Email';
import toInt from "../utils/toInt";
import toNonEmptyString from "../utils/toNonEmptyString";

export const resetPasswordRequest = (req: Request, res: Response): void => {
  const usuario = toInt(req.body.carne);
  if (!isValid(usuario)) { res.sendStatus(400); return; }
  res.sendStatus(202);

  connection
    .query('select carne, nombre, apellido from usuario where carne = $1', [usuario])
    .then((response) => {
      if (response.rows.length === 0) { return; }
      const { carne, nombre, apellido } = response.rows[0];
      const token = jwt.sign({ carne }, RESET_PASSWORD_TOKEN_KEY, { expiresIn: '10min' });

      // TODO agregar el correo al esquema para evitar este desastre
      Email.sendRecoveryPasswordEmail(
        `${nombre} ${apellido}`,
        `${apellido.substring(0, 3).toLowerCase()}${carne}${EMAIL_RECEIVER_DOMAIN}`,
        token,
      );
    });
};

export const acceptPasswordReset = (req: Request, res: Response): void => {
  const carne = verifyTokenHeader(RESET_PASSWORD_TOKEN_KEY, req.headers.authorization);
  if (carne == null) { res.sendStatus(500); return; }

  const newPassword = toNonEmptyString(req.body.newPassword);
  if (!isValid(newPassword)) { res.sendStatus(400); return; }

  connection
    .query(`
      update usuario set password = crypt($2, gen_salt('bf'))
       where carne = $1;`, [carne, newPassword])
     .then(() => { res.sendStatus(201); })
     .catch(() => { res.sendStatus(500); });
};
