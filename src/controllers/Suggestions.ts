import connection from "../services/connection";
import { Request, Response } from "express";
import toInt from "../utils/toInt";
import { isValid } from "../utils/areValid";

export const bySections = (req: Request, res: Response): void => {
  const carne = toInt(req.carne);
  if (!isValid(carne)) { res.sendStatus(500); return; }

  connection
    .query(`
      select u.carne, u.apellido, u.nombre, count(*) as count
      from asiste_seccion pool
          inner join asiste_seccion a on pool.seccion_id = a.seccion_id and a.usuario_carne != $1
          inner join usuario u on a.usuario_carne = u.carne
      where pool.usuario_carne = $1
      group by u.carne
      order by count(*) desc
      limit 10;`, [carne])
    .then((response) => { res.json(response.rows); });
};
