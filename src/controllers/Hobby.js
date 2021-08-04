const pool = require('../connection');

exports.findByName = async (req, res) => {
  const { nombre } = req.params;

  pool
    .query('select * from hobby where nombre ilike $1;', [`%${nombre}%`])
    .then((response) => { res.json(response.rows); });
};
