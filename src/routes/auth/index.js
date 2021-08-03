const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');

const authRouter = Router();

authRouter.use(Authorization.verifyAuth);

authRouter.get('/ping', (req, res) => {
  res.json({ response: 'pong' });
});

module.exports = { authRouter };
