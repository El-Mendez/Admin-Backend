import { Router } from 'express';
import * as Testing from '../../controllers/Testing';
import * as Auth from '../../controllers/Authorization';
import * as AuthSchema from '../../validators/Authorization';
import * as GenSchema from '../../validators/general';
import * as Hobby from '../../controllers/Hobby';
import * as Careers from '../../controllers/Career';
import * as Courses from '../../controllers/CoursesAndSections';
import * as Profile from '../../controllers/Profile';
import validate from '../../validators/validate';

export const freeRouter = Router();

// Testing
freeRouter.get('/ping', Testing.ping);

// Autenticación
freeRouter.post('/login', AuthSchema.logIn, validate, Auth.logIn);

// Búsqueda según el nombre
freeRouter.get('/carrera/:nombre?', Careers.findByName);
freeRouter.get('/hobby/:nombre?', Hobby.findByName);
freeRouter.get('/curso/:nombre?', Courses.findByName);

// Información de usuario
freeRouter.post('/profile', GenSchema.carne , validate, Profile.userProfile);

export default freeRouter;
