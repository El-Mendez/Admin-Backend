import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { UPLOAD_DIRECTORY } from '../constants';
import { connection } from '../services/Postgres/connection';
import * as Schema from '../validators/Profile';

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
  if (!req.files?.file) { res.status(400).json({ err: 'No file uploaded' }); return; }

  const file = req.files.file as UploadedFile;
  const reqPath = path.join(UPLOAD_DIRECTORY, `${req.carne}.png`);

  file.mv(reqPath)
    .then(() => { res.sendStatus(201); })
    .catch(() => { res.status(405).json({ err: 'Could not upload file' }); });
};

export const searchByName = (
  req: Request<{ name: string }, {}, {}>,
  res: Response,
): void => {
  const userName = req.params.name;

  connection
    .query(`
      select 
        carne, 
        concat(u.nombre, ' ', u.apellido) as nombre,
        correo,
        c.nombre as carrera,
        carrera_id as carreraId
      from usuario u
      inner join carrera c on u.carrera_id = c.id
      where concat(u.nombre, ' ', u.apellido) ilike $1;
    `, [`%${userName}%`])
    .then((response) => { res.json(response.rows); });
};

export const searchByHobbies = (
  req: Request<{}, {}, Schema.SearchByHobbiesSchema>,
  res: Response,
): void => {
  const { hobbiesId } = req.body;

  connection
    .query(`
      select u.carne,
        concat(u.nombre, ' ', u.apellido) as nombre,
        u.correo,
        c.nombre                          as carrera,
        u.carrera_id                      as carreraId
      from usuario u
        inner join carrera c on u.carrera_id = c.id
        inner join has_hobby hh on u.carne = hh.usuario_carne
      where hh.hobby_id in ( ${hobbiesId.map((_, index) => `$${index + 2}`).join()} )
      group by u.carne, u.nombre, u.apellido, u.correo, c.nombre, u.carrera_id
      having count(*) = $1
    `, [hobbiesId.length, ...hobbiesId])
    .then((response) => { res.json(response.rows); })
    .catch(() => { res.sendStatus(500); });
};

export const searchBySections = (
  req: Request<{}, {}, Schema.SearchBySectionsSchema>,
  res: Response,
): void => {
  const { seccionesId } = req.body;

  connection
    .query(`
      select u.carne,
        concat(u.nombre, ' ', u.apellido) as nombre,
        u.correo,
        c.nombre                          as carrera,
        u.carrera_id                      as carreraId
      from usuario u
        inner join carrera c on u.carrera_id = c.id
        inner join asiste_seccion a on u.carne = a.usuario_carne
      where a.seccion_id in ( ${seccionesId.map((_, index) => `$${index + 2}`).join()} )
      group by u.carne, u.nombre, u.apellido, u.correo, c.nombre, u.carrera_id
      having count(*) = $1;
    `, [seccionesId.length, ...seccionesId])
    .then((response) => { res.json(response.rows); })
    .catch(() => { res.sendStatus(500); });
};
