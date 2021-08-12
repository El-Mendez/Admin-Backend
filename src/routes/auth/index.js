const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');
const Testing = require('../../controllers/Testing');
const CoursesAndSections = require('../../controllers/CoursesAndSections');
const Hobby = require('../../controllers/Hobby');
const Suggestions = require('../../controllers/Suggestions');

const authRouter = Router();

// Middleware para asegurarme que estoy loggeado y conseguir el carnet.
authRouter.use(Authorization.verifyAuth);

// Rutas principales
authRouter.get('/ping', Testing.ping);

// Rutas para asignaciones de cosas
authRouter.post('/seccion', CoursesAndSections.assignSection);
authRouter.get('/seccion', CoursesAndSections.checkAssigned);
authRouter.post('/hobby', Hobby.assignHobby);

// Rutas para las recomendaciones
authRouter.get('/suggestions/courses', Suggestions.bySections);

// Para el resto
authRouter.post('/password', Authorization.changePassword);

module.exports = { authRouter };
