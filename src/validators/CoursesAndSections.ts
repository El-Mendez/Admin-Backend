import { body } from "express-validator";

export interface AssignSectionSchema {
    seccionesId: number[]
}
export const assignSection = [
    body('seccionesId').isArray({ min: 1 }).withMessage('seccionesId debe ser un array.'),
    body('seccionesId.*').isInt({ min: 0 }).withMessage('Cada id en seccionesId debe ser un int no negativo.').toInt(10)
]
