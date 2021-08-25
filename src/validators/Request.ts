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
  body('newPassword').isString().isLength({ min: 8 }).withMessage('newPassword debe tener al menos 8 caracteres.'),
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
    .withMessage('nombre debe ser un string no vacío')
    .escape(),
  body('apellido').isString().trim().notEmpty()
    .withMessage('apellido debe ser un string no vacío')
    .escape(),
  body('carreraId').isInt({ min: 0 }).withMessage('carreraId debe ser un int no negativo.').toInt(10),
  body('password').isString().isLength({ min: 8 }).withMessage('password debe tener al menos 8 caracteres y un número.'),
  body('correo').isEmail().matches(/uvg\.edu\.gt$/).withMessage(`Debe tener un correo terminando en ${EMAIL_RECEIVER_DOMAIN}.`),
];
