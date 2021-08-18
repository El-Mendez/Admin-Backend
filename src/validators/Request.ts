import { body } from "express-validator";
import {carne} from "./general";

export interface ResetPasswordSchema {
    carne: number
}
export const ResetPasswordValidator = [
    carne
]


export interface AcceptPasswordResetSchema {
    newPassword: string
}
export const AcceptPasswordResetValidator = [
    body('newPassword').isString().trim().isLength({ min: 8 }).withMessage('newPassword debe tener al menos 8 caracteres.')
]
