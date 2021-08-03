require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Security = require('./controllers/Security');
const { freeRouter } = require('./routes/free');
const { authRouter } = require('./routes/auth');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(Security.antiSQLInjection);

// Las rutas principales de la aplicación
app.use('/free', freeRouter);
app.use('/auth', authRouter);

// El error 404 por si elige algo que no se existe.
app.use(Security.NotFound);

app.listen(3000);
