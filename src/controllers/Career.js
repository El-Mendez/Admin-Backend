const pool = require('../connection');

exports.findByName = async (req, res) => {
  const { nombre } = req.params;
  if (nombre) {
    pool
      .query('select * from carrera where nombre ilike $1;', [`%${nombre}%`])
      .then((response) => { res.json(response.rows); });
  } else {
    pool
      .query('select * from carrera;')
      .then((response) => { res.json(response.rows); });
  }
};
