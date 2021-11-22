-- Vista para extraer los datos del usuario para mostrar en su perfile
CREATE OR REPLACE VIEW profile AS
SELECT u.carne, CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo, c.nombre AS carrera, u.correo,
       array_agg(DISTINCT (c2.nombre || ' → sección: ' || s.seccion)) cursos,
       array_agg(DISTINCT h.nombre) hobbies,
       array_agg(DISTINCT (ps.nombre || ': ' || rs.perfil)) redes_sociales
FROM usuario u
         LEFT JOIN carrera c on c.id = u.carrera_id
         LEFT JOIN asiste_seccion "as" on u.carne = "as".usuario_carne
         LEFT JOIN seccion s on s.id = "as".seccion_id
         LEFT JOIN curso c2 on c2.id = s.curso_id
         LEFT JOIN has_hobby hh on u.carne = hh.usuario_carne
         LEFT JOIN hobby h on h.id = hh.hobby_id
         LEFT JOIN red_social rs on u.carne = rs.usuario_carne
         LEFT JOIN plataforma_social ps on rs.plataforma_id = ps.id
GROUP BY u.carne, CONCAT(u.nombre, '', u.apellido), c.nombre, u.correo;

-- Vista para mostrar las solicitudes de amistad recibidas
CREATE OR REPLACE VIEW received_requests AS
SELECT usuario_recibe, usuario_envia as carne, CONCAT(u.nombre, ' ', u.apellido) as nombre, u.correo, c.nombre as carrera
FROM solicitud_amistad
         INNER JOIN usuario u on u.carne = solicitud_amistad.usuario_envia
         INNER JOIN carrera c on c.id = u.carrera_id;


-- Vista para mostrar las solicitudes de amistad enviadas
CREATE OR REPLACE VIEW sent_requests AS
SELECT  usuario_envia, usuario_recibe AS carne, CONCAT(u.nombre, ' ', u.apellido) AS nombre, u.correo, c.nombre as carrera
FROM solicitud_amistad
         INNER JOIN usuario u on u.carne = solicitud_amistad.usuario_recibe
         INNER JOIN carrera c on c.id = u.carrera_id;

