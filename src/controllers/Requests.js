const jwt = require('jsonwebtoken');
const CONSTANTS = require('../CONSTANTS');
const pool = require('../connection');
const verifyTokenHeader = require('../utils/verifyTokenHeader');
const Email = require('./Email');

exports.resetPasswordRequest = async (req, res) => {
  const usuario = parseInt(req.body.carne, 10);

  if (Number.isNaN(usuario)) { res.sendStatus(400); return; }
  res.sendStatus(202);

  pool
    .query('select carne, nombre, apellido from usuario where carne = $1', [usuario])
    .then((response) => {
      if (response.rows.length === 0) { return; }
      const userData = response.rows[0];
      const token = jwt.sign({ carne: userData.carne }, CONSTANTS.resetPasswordTokenKey, { expiresIn: '10min' });

      Email.sendRecoveryPasswordEmail(
        `${userData.nombre} ${userData.apellido}`,
        `${userData.apellido.substring(0, 3).toLowerCase()}${userData.carne}${CONSTANTS.receiverDomain}`,
        token,
      );
    });
};

exports.acceptPasswordReset = async (req, res) => {
  const values = verifyTokenHeader(req.headers.authorization, CONSTANTS.resetPasswordTokenKey);
  if (values === null) { res.sendStatus(401); return; }

  const { newPassword } = req.body;
  if (newPassword === undefined || newPassword === null) { res.sendStatus(400); return; }

  pool
    .query(`
      update usuario set password = crypt($2, gen_salt('bf')) 
      where carne = $1;`, [values.carne, newPassword])
    .then(() => { res.sendStatus(201); });
};
