const pool = require('../connection');

exports.findByName = async (req, res) => {
  const nombre = req.params;

  pool
    .query('select * from carrera where nombre ilike $1;', [`%${nombre}%`])
    .then((response) => { res.status(200).json(response.rows); });
};
