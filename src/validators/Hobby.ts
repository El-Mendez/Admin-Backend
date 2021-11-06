import { body } from 'express-validator';

export interface AssignHobbySchema {
    hobbiesId: number[]
}
export const assignHobby = [
  body('hobbiesId').isArray({ min: 1 }),
  body('hobbiesId.*').isInt({ min: -1 }).toInt(10),
];

export interface DeleteHobbySchema {
  hobbyId: number
}
export const deleteHobby = [
  body('hobbyId').isInt({ min: -1 }).toInt(10),
];
