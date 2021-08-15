import { Router } from "express";
import * as Testing from '../../controllers/Testing';
import * as Authorization from '../../controllers/Authorization';
import * as Hobby from '../../controllers/Hobby';
import * as Careers from '../../controllers/Career';

export const freeRouter = Router();

// Testing
freeRouter.get('/ping', Testing.ping);

// Autenticación
freeRouter.post('/login', Authorization.logIn);
freeRouter.post('/signup', Authorization.signUp);

// Búsqueda según el nombre
freeRouter.get('/carrera/:nombre?', Careers.findByName);
freeRouter.get('/hobby/:nombre?', Hobby.findByName);
// freeRouter.get('/curso/:nombre?', CoursesAndSections.findByName);

export default freeRouter;
