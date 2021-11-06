import { Request, Response } from 'express';
import { connection } from '../services/Postgres/connection';
import toNonEmptyString from '../utils/toNonEmptyString';
import * as Schema from '../validators/Hobby';

export const findByName = (req: Request, res: Response) => {
  const nombre = toNonEmptyString(req.params.nombre);
  if (nombre) {
    connection
      .query('select * from hobby where nombre ilike $1;', [`%${nombre}%`])
      .then((response) => { res.json(response.rows); });
  } else {
    connection
      .query('select * from hobby;')
      .then((response) => { res.json(response.rows); });
  }
};

export const assignHobby = async (
  req: Request<{}, {}, Schema.AssignHobbySchema>,
  res: Response,
): Promise<void> => {
  const { hobbiesId } = req.body;

  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < hobbiesId.length; i++) {
      await connection.query('insert into has_hobby values ($1, $2)', [hobbiesId[i], req.carne]);
    }
    res.sendStatus(201);
  } catch (e) {
    res.status(403).json({ err: 'The hobby did not exist or the user was already assigned to that hobby.' });
  }
};

export const deleteHobby = async (
  req: Request<{}, {}, Schema.DeleteHobbySchema>,
  res: Response,
): Promise<void> => {
  const { hobbyId } = req.body;
  connection.query('delete from has_hobby where usuario_carne = $1 and hobby_id = $2', [req.carne, hobbyId])
    .then((response) => {
      if (response.rowCount > 0) {
        res.sendStatus(200);
      } else {
        res.status(403).json({ err: 'The hobby did not exist or the user was not assigned to it.' });
      }
    });
};
