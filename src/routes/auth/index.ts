import { Router } from 'express';
import * as Auth from '../../controllers/Authorization';
import * as AuthSchema from '../../validators/Authorization';
import * as Testing from '../../controllers/Testing';
import * as Courses from '../../controllers/CoursesAndSections';
import * as CoursesSchema from '../../validators/CoursesAndSections';
import * as Hobby from '../../controllers/Hobby';
import * as HobbySchema from '../../validators/Hobby';
import * as Suggestions from '../../controllers/Suggestions';
import * as Profile from '../../controllers/Profile';
import validate from '../../validators/validate';

export const authRouter = Router();

// Middleware para asegurarme que estoy loggeado y conseguir el carnet.
authRouter.use(Auth.verifyAuth);

// Rutas principales
authRouter.get('/ping', Testing.ping);

// Rutas para asignaciones de cosas
authRouter.post('/seccion', CoursesSchema.assignSection, validate, Courses.assignSection);
authRouter.get('/seccion', Courses.checkAssigned);
authRouter.post('/hobby', HobbySchema.assignHobby, validate, Hobby.assignHobby);

// Rutas para las recomendaciones
authRouter.get('/suggestions/courses', Suggestions.bySections);
authRouter.get('/suggestions/hobbies', Suggestions.byHobbies);

// Para el resto
authRouter.post('/password', AuthSchema.changePassword, validate, Auth.changePassword);

// Información de perfil
authRouter.post('/profile', Profile.personalProfile);

export default authRouter;
