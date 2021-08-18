import { Request, Response } from "express";
import connection from "../services/connection";
import toNonEmptyString from "../utils/toNonEmptyString";
import * as Schema from '../validators/Hobby';

export const findByName = (req: Request, res: Response): void => {
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

export const assignHobby = (req: Request<{}, {}, Schema.AssignHobbySchema>, res: Response): void => {
  connection
    .query('insert into has_hobby values ($1, $2)', [req.body.hobbyId, req.carne])
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.sendStatus(403); });
};
