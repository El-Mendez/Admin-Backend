import { Router } from "express";
import * as Testing from '../../controllers/Testing';
import * as Authorization from '../../controllers/Authorization';
import * as AuthorizationSchema from '../../validators/Authorization';
import * as Hobby from '../../controllers/Hobby';
import * as Careers from '../../controllers/Career';
import * as CoursesAndSections from '../../controllers/CoursesAndSections'
import validate from "../../validators/validate";
export const freeRouter = Router();

// Testing
freeRouter.get('/ping', Testing.ping);

// Autenticación
freeRouter.post('/login', AuthorizationSchema.LogInValidator, validate, Authorization.logIn);
freeRouter.post('/signup', AuthorizationSchema.SignUpValidator, validate, Authorization.signUp);

// Búsqueda según el nombre
freeRouter.get('/carrera/:nombre?', Careers.findByName);
freeRouter.get('/hobby/:nombre?', Hobby.findByName);
freeRouter.get('/curso/:nombre?', CoursesAndSections.findByName);

export default freeRouter;
