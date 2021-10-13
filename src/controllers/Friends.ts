import { Request, Response } from 'express';
import { connection } from '../services/Postgres/connection';
import * as Schema from '../validators/Authorization';

export const sendRequest = (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
): void => {
  const possibleFriend: Number = req.body.carne;
  connection
    .query('select send_request($1, $2) ', [req.carne, possibleFriend])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      if (e.code === '90002') {
        res.status(403).json({ err: 'The users credentials are the same' });
      } else if (e.code === '90001') {
        res.status(405).json({ err: 'The friendship request already exist.' });
      } else {
        res.status(407).json({ err: 'The friendship already exist.' });
      }
    });
};

export const acceptRequest = (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
) : void => {
  const possibleFriend:Number = req.body.carne;

  connection
    .query('select accept_request($1, $2) ', [req.carne, possibleFriend])
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.status(403).json({ err: 'The friendship request does not exist' });
    });
};

export const cancelRequest = (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
) : void => {
  const possibleFriend:Number = req.body.carne;

  connection
    .query('select cancel_reject_request($1, $2) ', [req.carne, possibleFriend])
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.status(403).json({ err: 'The friendship request does not exist' });
    });
};

export const deleteFriend = (
  req: Request<{}, {}, Schema.friendSchema>,
  res: Response,
) : void => {
  const friend:Number = req.body.carne;

  connection
    .query('select delete_friend($1, $2) ', [req.carne, friend])
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.status(403).json({ err: 'The friendship does not exist' });
    });
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
            SELECT carne, nombre, correo
            FROM received_requests
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
            SELECT carne, nombre, correo
            FROM sent_requests
            WHERE usuario_envia = $1;`, [req.carne])
    .then((response) => {
      res.json(response.rows);
    });
};
