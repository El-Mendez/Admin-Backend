import { body } from 'express-validator';

export interface AssignHobbySchema {
    hobbiesId: number[]
}
export const assignHobby = [
  body('hobbiesId').isArray({ min: 1 }),
  body('hobbiesId.*').isInt({ min: -1 }).toInt(10),
];

export interface DeleteHobbySchema {
  hobbiesId: number[]
}
export const deleteHobby = [
  body('hobbiesId').isArray({ min: 1 }),
  body('hobbiesId.*').isInt({ min: -1 }).toInt(10),
];
