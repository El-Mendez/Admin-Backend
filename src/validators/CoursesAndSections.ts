import { body } from 'express-validator';

export interface AssignSectionSchema {
    seccionesId: number[]
}
export const assignSection = [
  body('seccionesId').isArray({ min: 1 }),
  body('seccionesId.*').isInt({ min: -1 }).toInt(10),
];

export interface DeleteSectionSchema {
  seccionId: number
}
export const deleteSection = [
  body('seccionId').isInt({ min: -1 }).toInt(10),
];
