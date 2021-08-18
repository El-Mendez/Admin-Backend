import { Request, Response } from "express";
import connection from "../services/connection";
import toNonEmptyString from "../utils/toNonEmptyString";
import * as Schema from '../validators/Hobby';

export const findByName = (req: Request, res: Response) => {
  const nombre = toNonEmptyString(req.params.nombre);
  if (nombre) {
    connection
      .query('select * from hobby where nombre ilike $1;', ['%' + nombre + '%'])
      .then((response) => { res.json(response.rows); });
  } else {
    connection
      .query('select * from hobby;')
      .then((response) => { res.json(response.rows); });
  }
};

export const assignHobby = async (req: Request<{}, {}, Schema.AssignHobbySchema>, res: Response): Promise<void> => {
  const hobbiesId: number[] = req.body.hobbiesId;

  try {
    for (let i = 0; i < hobbiesId.length; i++) {
      await connection.query('insert into has_hobby values ($1, $2)', [hobbiesId[i], req.carne])
    }
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(403);
  }
};
