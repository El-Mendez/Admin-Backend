const { Router } = require('express');
const Requests = require('../../controllers/Requests');

const requestRouter = Router();

// Para resetear la contraseña
requestRouter.post('/passwordReset', Requests.resetPasswordRequest);
requestRouter.post('/acceptPasswordReset', Requests.acceptPasswordReset);

module.exports = { requestRouter };
