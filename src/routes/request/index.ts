import { Router } from 'express';
import * as Requests from '../../controllers/Requests';
import * as RequestsSchema from '../../validators/Request';
import validate from '../../validators/validate';

export const requestRouter = Router();

// Para resetear la contraseña
requestRouter.post('/passwordReset', RequestsSchema.resetPasswordRequest, validate, Requests.resetPasswordRequest);
requestRouter.post('/acceptPasswordReset', RequestsSchema.acceptPasswordRequest, validate, Requests.acceptPasswordReset);

// Para crear una nueva cuenta
requestRouter.post('/signup', RequestsSchema.SignUp, validate, Requests.SignUp);
requestRouter.post('/acceptSignUp', Requests.AcceptSignUp);

export default requestRouter;
