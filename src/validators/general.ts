import { body } from 'express-validator';

export const carne = body('carne')
  .isInt({ min: 0 }).withMessage('El carné debe ser un número entero positivo.').toInt(10);

export const password = body('password')
  .isString().isLength({ min: 8 }).withMessage('Password debe de tener al menos 8 caracteres.');
