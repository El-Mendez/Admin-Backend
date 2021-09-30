-- Vista para extraer los datos del usuario para mostrar en su perfile
CREATE OR REPLACE VIEW profile AS
SELECT u.carne, CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo, c.nombre AS carrera, u.correo,
       array_agg(DISTINCT (c2.nombre || ' → sección: ' || s.seccion)) cursos,
       array_agg(DISTINCT h.nombre) hobbies
FROM usuario u
         INNER JOIN carrera c on c.id = u.carrera_id
         INNER JOIN asiste_seccion "as" on u.carne = "as".usuario_carne
         INNER JOIN seccion s on s.id = "as".seccion_id
         INNER JOIN curso c2 on c2.id = s.curso_id
         INNER JOIN has_hobby hh on u.carne = hh.usuario_carne
         INNER JOIN hobby h on h.id = hh.hobby_id
GROUP BY u.carne, CONCAT(u.nombre, '', u.apellido), c.nombre, u.correo;

-- Requests recibidas
CREATE OR REPLACE VIEW received_requests AS
SELECT usuario_envia
FROM solicitud_amistad;

-- Requests hechas
CREATE OR REPLACE VIEW sent_requests AS
SELECT usuario_recibe
FROM solicitud_amistad;
