const pool = require('../connection');
const Parser = require('../parsers');
const contains = require('../utils/contains');

exports.findByName = async (req, res) => {
  const { nombre } = req.params;

  pool
    .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            where c.nombre ilike $1 or c.id ilike $1
            order by c.id;`, [`%${nombre}%`])
    .then((response) => { res.json(Parser.CoursesAndSections(response.rows)); });
};

exports.assignSection = async (req, res) => {
  const newAssignationData = [req.body.seccionId, req.carne];

  if (contains(newAssignationData, undefined)) { res.sendStatus(400); return; }

  pool
    .query('insert into asiste_seccion values ($1, $2)', newAssignationData)
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.sendStatus(403); });
};
