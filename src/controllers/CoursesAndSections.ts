import { Request, Response } from "express";
import connection from "../connection";
import areValid, {isValid} from "../utils/areValid";
import toInt from "../utils/toInt";
import toNonEmptyString from "../utils/toNonEmptyString";
import * as Parser from '../parsers'


export const findByName = (req: Request, res: Response): void => {
  const nombre = toNonEmptyString(req.params.nombre);

  if (nombre) {
    connection
      .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            where c.nombre ilike $1 or c.id ilike $1
            order by c.id;`, ['%' + nombre +'%'])
      .then((response) => { console.log(nombre); res.json(Parser.CoursesAndSections(response.rows)); })
  } else {
    connection
      .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
            from curso c inner join seccion s on c.id = s.curso_id
            order by c.id;`)
      .then((response) => { res.json(Parser.CoursesAndSections(response.rows)); });
  }
};

export const assignSection = async (req: Request, res: Response) => {
  const carne = toInt(req.carne);
  if (!isValid(carne)) { res.sendStatus(500); return; }

  if (!Array.isArray(req.body.seccionesId)) { res.sendStatus(400); return; }
  const seccionesId: number[] = req.body.seccionesId.map((element: any) => toInt(element));

  if(!areValid(seccionesId) || seccionesId.length < 1) { res.sendStatus(400); return; }

  try {
    for (let i = 0; i < seccionesId.length; i++) {
      await connection.query('insert into asiste_seccion values ($1, $2)', [seccionesId[i], carne]);
    }
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(403);
  }
};

export const checkAssigned = async (req: Request, res: Response) => {
  const carne = toInt(req.carne);
  if (!isValid(carne)) { res.sendStatus(500); return; }

  connection
    .query(`select c.id as curso_id, c.nombre as curso_nombre, s.id as seccion_id, s.seccion as seccion
        from curso c inner join seccion s on c.id = s.curso_id
        inner join asiste_seccion a on a.seccion_id = s.id
        where a.usuario_carne = $1;`, [req.carne])
    .then((response) => {
      res.json(Parser.CoursesAndSections(response.rows));
    });
};
