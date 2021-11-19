import { param } from 'express-validator';

export interface getProfileParamsSchema {
  carne: string
}
export const getProfileRequest = [
  param('carne').isInt({ min: -1 }),
];

export interface searchByNameSchema {
  name: string
}
export const searchByName = [
  param('name')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .escape(),
];
