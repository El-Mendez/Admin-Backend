import connection from "../connection";
import { Request, Response } from "express";
import toNonEmptyString from "../utils/toNonEmptyString";

export const findByName = (req: Request, res: Response): void => {
  const nombre = toNonEmptyString(req.params.nombre);
  if (nombre) {
    connection
      .query('select * from carrera where nombre ilike $1;', ['%' + nombre + '%'])
      .then((response) => { res.json(response.rows); });
  } else {
    connection
      .query('select * from carrera;')
      .then((response) => { res.json(response.rows); });
  }
};
