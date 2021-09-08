import { body } from 'express-validator';

export interface AssignHobbySchema {
    hobbiesId: number[]
}
export const assignHobby = [
  body('hobbiesId').isArray({ min: 1 }),
  body('hobbiesId.*').isInt({ min: 0 }).toInt(10),
];
