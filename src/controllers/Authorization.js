const jwt = require('jsonwebtoken');
const CONSTANTS = require('../CONSTANTS');
const pool = require('../connection');

exports.logIn = async (req, res) => {
  const { carne, password } = req.body;

  const response = await pool.query(`
      select count(*) = 1 as logged
      from usuario
      where carne = $1
        and password = crypt($2, password)
      limit 1;`, [carne, password]);

  if (response.rows[0] && response.rows[0].logged) {
    // Si sí logró iniciar sesión
    const token = jwt.sign({ carne }, CONSTANTS.tokenKey, { expiresIn: '1 day' });
    res.json({ token });
    return;
  }

  res.sendStatus(403);
};

exports.signUp = (req, res) => {
  // Sign up
};

exports.verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null || token === undefined) {
    // No mandó el token
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, CONSTANTS.tokenKey, (error, values) => {
    if (error) {
      res.sendStatus(403);
    } else {
      req.carne = values.carne;
      next();
    }
  });
};
