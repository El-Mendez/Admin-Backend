const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');
const Testing = require('../../controllers/Testing');
const CoursesAndSections = require('../../controllers/CoursesAndSections');

const authRouter = Router();

// Middleware para asegurarme que estoy loggeado y conseguir el carnet.
authRouter.use(Authorization.verifyAuth);

// Rutas principales
authRouter.get('/ping', Testing.ping);
authRouter.get('/seccion', CoursesAndSections.assignSection);

module.exports = { authRouter };
