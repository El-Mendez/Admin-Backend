import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { UPLOAD_DIRECTORY } from '../constants';
import { connection } from '../services/Postgres/connection';

export const personalProfile = (
  req: Request,
  res: Response,
): void => {
  connection
    .query(`
            select * 
            from profile 
            where carne = $1;`, [req.carne])
    .then((response) => {
      if (!response.rows[0]) { res.status(403).json({ err: 'User without courses or hobbies.' }); return; }

      res.json(response.rows);
    });
};

export const userProfile = (
  req: Request<{ carne: string }, {}, {}>,
  res: Response,
): void => {
  const userId = parseInt(req.params.carne, 10);
  connection
    .query(`
            select * 
            from profile 
            where carne = $1;`, [userId])
    .then((response) => {
      if (!response.rows[0]) { res.status(403).json({ err: 'User without courses or hobbies.' }); return; }

      res.json(response.rows);
    });
};

// Actualizar o cambiar imagen de perfil
export const profileImage = (
  req: Request,
  res: Response,
): void => {
  if (!req.files?.file) { res.status(403).json({ err: 'No file uploaded' }); return; }

  const file = req.files.file as UploadedFile;
  const reqPath = path.join(`${UPLOAD_DIRECTORY}/${req.carne}.png`);

  file.mv(reqPath)
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.status(405).json({ err: 'Could not upload file' }); });
};
