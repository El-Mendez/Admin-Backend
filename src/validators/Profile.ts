import { body, param } from 'express-validator';

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

export interface SearchByHobbiesSchema {
  hobbiesId: number[]
}
export const searchByHobbies = [
  body('hobbiesId').isArray({ min: 1 }),
  body('hobbiesId.*').isInt({ min: -1 }).toInt(10),
];
