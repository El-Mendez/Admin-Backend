import express, { Express } from 'express';
import cors from 'cors';
import * as Security from './controllers/Security';

import { freeRouter } from './routes/free';
import { authRouter } from './routes/auth';
import { requestRouter } from './routes/request';

// Middlewares
const server: Express = express();
server.use(express.json());
server.use(cors());

// Las rutas principales de la aplicación
server.use('/free', freeRouter);
server.use('/auth', authRouter);
server.use('/request', requestRouter);

// El error 404 por si elige algo que no se existe.
server.use(Security.NotFound);

export default server;
