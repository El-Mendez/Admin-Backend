import { body } from 'express-validator';
import { carne } from './general';

export interface LogInSchema {
    carne: number,
    password: string,
}
export const logIn = [
  carne,
  body('password').isString().notEmpty(),
];

export interface ChangePasswordSchema {
    newPassword: string,
    oldPassword: string,
}
export const changePassword = [
  body('newPassword').isString().isLength({ min: 8 }),
  body('oldPassword').isString().notEmpty(),
];

export interface profileSchema {
    carne: number,
}
