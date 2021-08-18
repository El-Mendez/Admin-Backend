import { body } from "express-validator";

export interface AssignHobbySchema {
    hobbyId: number
}
export const AssignHobbyValidator = [
    body('hobbyId').isInt({ min: 0}).withMessage('hobbyId debe ser un int no negativo.').toInt(10)
]