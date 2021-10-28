import { param } from 'express-validator';

export interface getProfileParamsSchema {
  carne: string
}
export const getProfileRequest = [
  param('carne').isInt({ min: -1 }),
];
