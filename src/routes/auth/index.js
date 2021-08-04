const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');
const Testing = require('../../controllers/Testing');
const CoursesAndSections = require('../../controllers/CoursesAndSections');
const Hobby = require('../../controllers/Hobby');

const authRouter = Router();

// Middleware para asegurarme que estoy loggeado y conseguir el carnet.
authRouter.use(Authorization.verifyAuth);

// Rutas principales
authRouter.get('/ping', Testing.ping);

// Rutas para asignaciones de cosas
authRouter.post('/seccion', CoursesAndSections.assignSection);
authRouter.post('/hobby', Hobby.assignHobby);

module.exports = { authRouter };
