const { Router } = require('express');
const Authorization = require('../../controllers/Authorization');
const Careers = require('../../controllers/Career');
const Hobby = require('../../controllers/Hobby');
const CoursesAndSections = require('../../controllers/CoursesAndSections');
const Testing = require('../../controllers/Testing');

const freeRouter = Router();

freeRouter.get('/ping', Testing.ping);
freeRouter.post('/login', Authorization.logIn);
freeRouter.post('/signup', Authorization.signUp);

// Búsqueda según el nombre
freeRouter.get('/carrera/:nombre?', Careers.findByName);
freeRouter.get('/hobby/:nombre?', Hobby.findByName);
freeRouter.get('/curso/:nombre?', CoursesAndSections.findByName);

module.exports = { freeRouter };
