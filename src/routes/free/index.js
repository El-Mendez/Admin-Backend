// Aquí van todas las rutas necesitan estar loggeados para verlas.

const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');
const Careers = require('../../controllers/Career');
const Hobby = require('../../controllers/Hobby');
const CoursesAndSections = require('../../controllers/CoursesAndSections');

const freeRouter = Router();

freeRouter.post('/login', Authorization.logIn);
freeRouter.post('/signup', Authorization.signUp);

// Búsqueda según el nombre
freeRouter.get('/carrera/:nombre?', Careers.findByName);
freeRouter.get('/hobby/:nombre?', Hobby.findByName);
freeRouter.get('/curso/:nombre?', CoursesAndSections.findByName);

module.exports = { freeRouter };
