import { Router } from 'express';
import * as Auth from '../../controllers/Authorization';
import * as AuthSchema from '../../validators/Authorization';
import * as GenSchema from '../../validators/general';
import * as Testing from '../../controllers/Testing';
import * as Courses from '../../controllers/CoursesAndSections';
import * as CoursesSchema from '../../validators/CoursesAndSections';
import * as Hobby from '../../controllers/Hobby';
import * as HobbySchema from '../../validators/Hobby';
import * as Suggestions from '../../controllers/Suggestions';
import * as Profile from '../../controllers/Profile';
import * as Friends from '../../controllers/Friends';
import * as Request from '../../controllers/Requests';
import * as RequestSchema from '../../validators/Request';
import validate from '../../validators/validate';
import { rateLimit } from '../../controllers/Security';

export const authRouter = Router();

authRouter.use(rateLimit);

// Middleware para asegurarme que estoy loggeado y conseguir el carnet.
authRouter.use(Auth.verifyAuth);

// Rutas principales
authRouter.get('/ping', Testing.ping);

// Rutas para asignaciones de secciones
authRouter.post('/seccion', CoursesSchema.assignSection, validate, Courses.assignSection);
authRouter.get('/seccion', Courses.checkAssigned);
authRouter.delete('/seccion', CoursesSchema.deleteSection, validate, Courses.deleteSection);

// Rutas para hobbies
authRouter.post('/hobby', HobbySchema.assignHobby, validate, Hobby.assignHobby);
authRouter.delete('/hobby', HobbySchema.deleteHobby, validate, Hobby.deleteHobby);

// Rutas para las recomendaciones
authRouter.get('/suggestions/courses', Suggestions.bySections);
authRouter.get('/suggestions/hobbies', Suggestions.byHobbies);
authRouter.get('/suggestions/friends', Suggestions.byFriends);

// Para el resto
authRouter.post('/password', AuthSchema.changePassword, validate, Auth.changePassword);

// Información de perfil
authRouter.get('/profile', Profile.personalProfile);
authRouter.post('/profile/image', Profile.profileImage);

// Report User
authRouter.post('/report', RequestSchema.ReportUser, validate, Request.ReportUser);

// Help Email
authRouter.post('/help', RequestSchema.HelpMail, validate, Request.HelpMail);

// Rutas que tienen que ver con amigos
authRouter.post('/friends/sendRequest', GenSchema.carne, validate, Friends.sendRequest);
authRouter.post('/friends/acceptRequest', GenSchema.carne, validate, Friends.acceptRequest);
authRouter.post('/friends/cancelRequest', GenSchema.carne, validate, Friends.cancelRequest);
authRouter.post('/friends/deleteFriend', GenSchema.carne, validate, Friends.deleteFriend);
authRouter.get('/friends/getFriends', Friends.getFriends);
authRouter.get('/friends/receivedRequests', Friends.receivedRequests);
authRouter.get('/friends/sentRequests', Friends.sentRequests);

export default authRouter;
