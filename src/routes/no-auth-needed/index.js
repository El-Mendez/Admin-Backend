const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');

const freeRouter = Router();

freeRouter.post('/login', Authorization.logIn);

module.exports = { freeRouter };
