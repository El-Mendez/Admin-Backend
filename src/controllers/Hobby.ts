import { Request, Response } from "express";
import connection from "../connection";
import areValid, {isValid} from "../utils/areValid";
import toNonEmptyString from "../utils/toNonEmptyString";
import toInt from "../utils/toInt";

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

export const assignHobby = (req: Request, res: Response): void => {
  const carne = toInt(req.carne);
  if (!isValid(carne)) { res.sendStatus(500); return; }

  const hobbyId = toInt(req.carne)
  if (!isValid(hobbyId)) { res.sendStatus(400); return; }

  connection
    .query('insert into has_hobby values ($1, $2)', [hobbyId, carne])
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.sendStatus(403); });
};
