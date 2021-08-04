const pool = require('../connection');
const contains = require('../utils/contains');

exports.findByName = async (req, res) => {
  const { nombre } = req.params;

  pool
    .query('select * from hobby where nombre ilike $1;', [`%${nombre}%`])
    .then((response) => { res.json(response.rows); });
};

exports.assignHobby = async (req, res) => {
  const newAssignationData = [req.body.hobbyId, req.carne];

  if (contains(newAssignationData, undefined)) { res.sendStatus(400); return; }

  pool
    .query('insert into has_hobby values ($1, $2)', newAssignationData)
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.sendStatus(403); });
};
