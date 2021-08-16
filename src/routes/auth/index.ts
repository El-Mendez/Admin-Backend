import { Router } from "express";
import * as Authorization from '../../controllers/Authorization';
import * as Testing from '../../controllers/Testing';
import * as CoursesAndSections from '../../controllers/CoursesAndSections';
import * as Hobby from '../../controllers/Hobby';
import * as Suggestions from '../../controllers/Suggestions';

export const authRouter = Router();

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

export default authRouter;
