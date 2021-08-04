// Aquí van todas las rutas necesitan estar loggeados para verlas.

const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');
const Careers = require('../../controllers/Career');

const freeRouter = Router();

freeRouter.post('/login', Authorization.logIn);
freeRouter.post('/signup', Authorization.signUp);
freeRouter.get('/carrera/:nombre', Careers.findByName);

module.exports = { freeRouter };
