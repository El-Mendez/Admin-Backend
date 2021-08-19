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

export interface SignUpSchema {
    carne: number,
    nombre: string,
    apellido: string,
    carreraId: number,
    password: string,
}
export const signUp = [
  carne,
  body('nombre').isString().trim().notEmpty()
    .withMessage('nombre debe ser un string no vacío')
    .escape(),
  body('apellido').isString().trim().notEmpty()
    .withMessage('apellido debe ser un string no vacío')
    .escape(),
  body('carreraId').isInt({ min: 0 }).withMessage('carreraId debe ser un int no negativo.').toInt(10),
  body('password').isString().isLength({ min: 8 }).withMessage('password debe tener al menos 8 caracteres.'),
];

export interface ChangePasswordSchema {
    newPassword: string,
    oldPassword: string,
}
export const changePassword = [
  body('newPassword').isString().isLength({ min: 8 }).withMessage('newPassword debe de tener al menos 8 caracteres.'),
  body('oldPasssword').isString().notEmpty().withMessage('oldPassword debe ser un string no vacío.'),
];
