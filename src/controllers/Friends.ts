import { Request, Response } from 'express';
import { connection } from '../services/Postgres/connection';
import * as Schema from '../validators/Authorization';

export const sendRequest = async (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
) => {
  const possibleFriend: Number = req.body.carne;

  try {
    await connection.query('select send_request($1, $2) ', [req.carne, possibleFriend]);
    res.sendStatus(200);
  } catch (e) {
    res.status(403).json({ err: 'The friendship request already exist or the users credentials are the same.' });
  }
};

export const acceptRequest = async (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
) => {
  const possibleFriend:Number = req.body.carne;

  try {
    await connection.query('select accept_request($1, $2) ', [req.carne, possibleFriend]);
    res.sendStatus(200);
  } catch (e) {
    res.status(403).json({ err: 'The friendship request does not exist or the friendship already exist.' });
  }
};

export const cancelRequest = async (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
) => {
  const possibleFriend:Number = req.body.carne;

  try {
    await connection.query('select cancel_reject_request($1, $2) ', [req.carne, possibleFriend]);
    res.sendStatus(200);
  } catch (e) {
    res.status(403).json({ err: 'The friendship request does not exist or the users credentials are the same' });
  }
};

export const getFriends = (
  req: Request,
  res: Response,
) : void => {
  connection
    .query(`
            SELECT * 
            FROM get_friends($1);`, [req.carne])
    .then((response) => {
      res.json(response.rows);
    });
};

export const receivedRequests = (
  req: Request,
  res: Response,
) : void => {
  connection
    .query(`
            SELECT usuario_envia
            FROM solicitud_amistad
            WHERE usuario_recibe = $1;`, [req.carne])
    .then((response) => {
      res.json(response.rows);
    });
};

export const sentRequests = (
  req: Request,
  res: Response,
) : void => {
  connection
    .query(`
            SELECT usuario_recibe
            FROM solicitud_amistad
            WHERE usuario_envia = $1;`, [req.carne])
    .then((response) => {
      res.json(response.rows);
    });
};
