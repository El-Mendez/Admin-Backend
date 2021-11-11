import { Request, Response } from 'express';
import { connection } from '../services/Postgres/connection';
import toNonEmptyString from '../utils/toNonEmptyString';
import * as Parser from '../parsers';
import * as Schema from '../validators/CoursesAndSections';

export const findByName = (req: Request, res: Response): void => {
  const nombre = toNonEmptyString(req.params.nombre);

  if (nombre) {
    connection
      .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            where c.nombre ilike $1 or c.id ilike $1
            order by c.id;`, [`%${nombre}%`])
      .then((response) => { res.json(Parser.CoursesAndSections(response.rows)); });
  } else {
    connection
      .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            order by c.id;`)
      .then((response) => { res.json(Parser.CoursesAndSections(response.rows)); });
  }
};

export const assignSection = async (
  req: Request<{}, {}, Schema.AssignSectionSchema>,
  res: Response,
) => {
  const { seccionesId } = req.body;

  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < seccionesId.length; i++) {
      await connection.query('insert into asiste_seccion values ($1, $2)', [seccionesId[i], req.carne]);
    }
    res.sendStatus(201);
  } catch (e) {
    res.status(403).json({ err: 'A section did not exist or the user was already assigned to that section.' });
  }
};

export const checkAssigned = async (req: Request, res: Response) => {
  connection
    .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
        from curso c inner join seccion s on c.id = s.curso_id
        inner join asiste_seccion a on a.seccion_id = s.id
        where a.usuario_carne = $1;`, [req.carne])
    .then((response) => {
      res.json(Parser.CoursesAndSections(response.rows));
    });
};

export const deleteSection = async (
  req: Request<{}, {}, Schema.DeleteSectionSchema>,
  res: Response,
) => {
  const { seccionesId } = req.body;
  for (let i = 0; i < seccionesId.length; i++) {
    const result = await connection.query('delete from asiste_seccion where usuario_carne = $1 and seccion_id = $2', [req.carne, seccionesId[i]])
    if (result.rowCount <= 0) {
      res.status(403).json({ err: 'The section did not exist or the user was not assigned to it.' });
      return;
    }
  }
  res.sendStatus(200);
};
