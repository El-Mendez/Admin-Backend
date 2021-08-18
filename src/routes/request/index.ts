import { Router } from 'express';
import * as Requests from '../../controllers/Requests';
import * as RequestsSchema from '../../validators/Request';
import validate from "../../validators/validate";

export const requestRouter = Router();

// Para resetear la contraseña
requestRouter.post('/passwordReset', RequestsSchema.ResetPasswordValidator, validate, Requests.resetPasswordRequest);
requestRouter.post('/acceptPasswordReset', RequestsSchema.AcceptPasswordResetValidator, validate, Requests.acceptPasswordReset);

export default requestRouter;
