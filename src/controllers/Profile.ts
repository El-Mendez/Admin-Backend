import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
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
export const updateImage = (
  req: Request,
  res: Response,
): void => {
  try {
    if (!req.files) { res.status(403).json({ err: 'No file uploaded' }); return; }

    const file = req.files?.file as UploadedFile;
    // TODO revisar si la ruta del servidor es la misma
    const reqPath = path.join(__dirname, '../../../', `ISW_Frontend/public/assets/${req.carne}.png`);
    file.mv(reqPath, (e) => {
      if (e) { res.status(407).json({ err: 'Error while moving the image.' }); return; }
      res.sendStatus(200);
    });
  } catch (err) {
    res.json({ Error: 'Error while uploading file.' });
  }
};

// Añadir imagen de perfil
export const profileImage = (
  req: Request,
  res: Response,
): void => {
  try {
    if (!req.files) { res.status(403).json({ err: 'No file uploaded' }); return; }

    const file = req.files?.file as UploadedFile;
    const reqPath = path.join(__dirname, '../../../', `ISW_Frontend/public/assets/${req.body.carne}.png`);
    file.mv(reqPath, (e) => {
      if (e) { res.status(407).json({ err: 'Error while moving the image' }); return; }
      res.sendStatus(200);
    });
  } catch (err) {
    res.json({ Error: 'Error while uploading file.' });
  }
};
