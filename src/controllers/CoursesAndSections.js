const pool = require('../connection');
const Parser = require('../parsers');
const contains = require('../utils/contains');

exports.findByName = async (req, res) => {
  const { nombre } = req.params;

  if (nombre) {
    pool
      .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            where c.nombre ilike $1 or c.id ilike $1
            order by c.id;`, [`%${nombre}%`])
      .then((response) => { res.json(Parser.CoursesAndSections(response.rows)); });
  } else {
    pool
      .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            order by c.id;`)
      .then((response) => { res.json(Parser.CoursesAndSections(response.rows)); });
  }
};

exports.assignSection = async (req, res) => {
  const { carne } = req;
  const { seccionesId } = req.body;

  if (contains([...seccionesId, carne], undefined) || seccionesId.length < 1) {
    res.sendStatus(400);
    return;
  }

  try {
    for (let i = 0; i < seccionesId.length; i++) {
      await pool.query('insert into asiste_seccion values ($1, $2)', [seccionesId[i], carne]);
    }
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(403);
  }
};

exports.checkAssigned = async (req, res) => {
  pool
    .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
        from curso c inner join seccion s on c.id = s.curso_id
        inner join asiste_seccion a on a.seccion_id = s.id
        where a.usuario_carne = $1;`, [req.carne])
    .then((response) => {
      res.json(Parser.CoursesAndSections(response.rows));
    });
};
