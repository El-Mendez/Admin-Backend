import { body } from 'express-validator';
import { carne } from './general';

export interface LogInSchema {
    carne: number,
    password: string,
}
export const logIn = [
  carne,
  body('password').isString().notEmpty().withMessage('password debe ser una cadena de texto no vacía.'),
];

export interface ChangePasswordSchema {
    newPassword: string,
    oldPassword: string,
}
export const changePassword = [
  body('newPassword').isString().isLength({ min: 8 }).withMessage('newPassword debe de tener al menos 8 caracteres.'),
  body('oldPassword').isString().notEmpty().withMessage('oldPassword debe ser un string no vacío.'),
];
