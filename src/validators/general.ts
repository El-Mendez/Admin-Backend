import { body } from 'express-validator';

export const carne = body('carne')
  .isInt({ min: -1, max: 2299999 }).toInt(10);

export const password = body('password')
  .isString().isLength({ min: 8 });
