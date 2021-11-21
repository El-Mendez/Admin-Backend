import { body } from 'express-validator';
import { carne } from './general';
import { EMAIL_RECEIVER_DOMAIN } from '../constants';

export interface ResetPasswordSchema {
    carne: number
}
export const resetPasswordRequest = [
  carne,
];

export interface AcceptPasswordResetSchema {
    newPassword: string
}
export const acceptPasswordRequest = [
  body('newPassword').isString().isLength({ min: 8 }),
];

export interface SignUpRequestSchema {
  carne: number,
  nombre: string,
  apellido: string,
  carreraId: number,
  password: string,
  correo: string,
}
export const SignUp = [
  carne,
  body('nombre').isString().trim().notEmpty()
    .escape(),
  body('apellido').isString().trim().notEmpty()
    .escape(),
  body('carreraId').isInt({ min: -1 }).toInt(10),
  body('password').isString().isLength({ min: 8 }),
  body('correo').isEmail().matches(/uvg\.edu\.gt$/).withMessage(`Debe tener un correo terminando en ${EMAIL_RECEIVER_DOMAIN}.`),
];

export interface ReportUserSchema {
  reported: number,
  reason: string,
}
export const ReportUser = [
  body('reported').isInt({ min: -1, max: 2299999 }).toInt(10),
  body('reason').isString().isLength({ min: 10 }).escape(),
];

export interface HelpMailSchema {
  message: string,
}
export const HelpMail = [
  body('message').isString().isLength({ min: 10 }).escape(),
];
