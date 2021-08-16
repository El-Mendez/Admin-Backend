import express, { Express } from 'express';
import cors from 'cors';
import * as Security from './controllers/Security';

import freeRouter from "./routes/free";
import authRouter from "./routes/auth";
import requestRouter from "./routes/request";

// Middlewares
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(Security.antiSQLInjection);

// Las rutas principales de la aplicación
app.use('/free', freeRouter);
app.use('/auth', authRouter);
app.use('/request', requestRouter);

// El error 404 por si elige algo que no se existe.
app.use(Security.NotFound);

app.listen(3000);
