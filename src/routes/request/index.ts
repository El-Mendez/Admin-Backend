import { Router } from 'express';
import * as Requests from '../../controllers/Requests';

export const requestRouter = Router();

// Para resetear la contraseña
requestRouter.post('/passwordReset', Requests.resetPasswordRequest);
requestRouter.post('/acceptPasswordReset', Requests.acceptPasswordReset);

export default requestRouter;
