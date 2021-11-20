import { Router } from 'express';
import * as Testing from '../../controllers/Testing';
import * as Auth from '../../controllers/Authorization';
import * as AuthSchema from '../../validators/Authorization';
import * as ProfileSchema from '../../validators/Profile';
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
freeRouter.get('/profile/:carne', ProfileSchema.getProfileRequest, validate, Profile.userProfile);
freeRouter.get('/profile/name/:name', ProfileSchema.searchByName, validate, Profile.searchByName);
freeRouter.post('/profile/hobbies', ProfileSchema.searchByHobbies, validate, Profile.searchByHobbies);
freeRouter.post('/profile/secciones', ProfileSchema.searchBySections, validate, Profile.searchBySections);

export default freeRouter;
