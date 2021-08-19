import { body } from 'express-validator';

export interface AssignHobbySchema {
    hobbiesId: number[]
}
export const assignHobby = [
  body('hobbiesId').isArray({ min: 1 }).withMessage('hobbiesId debe ser un array.'),
  body('hobbiesId.*').isInt({ min: 0 }).withMessage('Cada id en hobbiesId debe ser un int no negativo.').toInt(10),
];
