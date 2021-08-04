const jwt = require('jsonwebtoken');
const CONSTANTS = require('../CONSTANTS');
const pool = require('../connection');
const contains = require('../utils/contains');

exports.logIn = async (req, res) => {
  const userData = [req.body.carne, req.body.password];

  if (contains(userData, undefined)) { res.sendStatus(400); return; }

  pool
    .query('select count(*) = 1 as logged from usuario where carne = $1 and password = crypt($2, password) limit 1;', userData)
    .then((response) => {
      // Si no logró iniciar sesión
      if (!response.rows[0].logged) { res.sendStatus(403); return; }

      // Si logró iniciar sesión
      const token = jwt.sign({ carne: userData[0] }, CONSTANTS.tokenKey, { expiresIn: '1 day' });
      res.json({ token });
    });
};

exports.signUp = (req, res) => {
  const newUserData = [
    req.body.carne, // $1
    req.body.nombre, // $2
    req.body.apellido, // $3
    req.body.carreraId, // $4
    req.body.password, // $5
  ];

  if (contains(newUserData, undefined)) { res.sendStatus(400); return; }

  pool
    .query('insert into usuario values ($1, $2, $3, $4, crypt($5, gen_salt(\'bf\')))', newUserData)
    .then(() => {
      const token = jwt.sign({ carne: newUserData[0] }, CONSTANTS.tokenKey, { expiresIn: '1 day' });
      res.json({ token });
    })
    .catch(() => { res.sendStatus(403); });
};

exports.verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null || token === undefined) { res.sendStatus(401); return; }

  jwt.verify(token, CONSTANTS.tokenKey, (error, values) => {
    if (error) { res.sendStatus(401); return; }

    req.carne = values.carne;
    next();
  });
};
