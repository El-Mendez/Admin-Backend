import { Request, Response } from 'express';
import { connection } from '../services/connection';
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
    res.sendStatus(403);
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
