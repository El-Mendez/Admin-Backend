-- Funciones

-- Envía una solicitud de amistad

CREATE OR REPLACE function send_request(integer, integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist        boolean;
    exist_friend boolean;
BEGIN
    SELECT EXISTS(SELECT *
                  FROM solicitud_amistad
                  WHERE usuario_envia = $1 and usuario_recibe = $2
                     or usuario_envia = $2 and usuario_recibe = $1)
    INTO exist;

    SELECT EXISTS(SELECT *
                  FROM amistad
                  WHERE amigo1_carne = $1 and amigo2_carne = $2
                     or amigo1_carne = $2 and amigo2_carne = $1)
    INTO exist_friend;

    -- Valida que no sean amigos
    IF NOT exist_friend
    THEN
        -- Valida que no exista ya una solicitud de amistad
        IF NOT exist
        THEN
            IF $1 != $2
            THEN
                INSERT INTO solicitud_amistad VALUES ($1, $2);
            ELSE
                RAISE EXCEPTION
                    SQLSTATE '90002'
                    USING MESSAGE = 'The users credentials are the same';
            END IF;
        ELSE
            RAISE EXCEPTION
                SQLSTATE '90001'
                USING MESSAGE = 'The friendship request already exist';
        END IF;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90000'
            USING MESSAGE = 'The friendship already exist';
    END IF;
END
$BODY$
    LANGUAGE 'plpgsql';


-- ur → usuario que recibe
-- ue → usuario que envía
-- Acepta una solicitud de amistad → en este caso el orden sí importa

CREATE OR REPLACE function accept_request(ur integer, ue integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist         boolean;
    exist_request boolean;
BEGIN
    -- Busca que la solicitud de amistad exista
    SELECT EXISTS(SELECT *
                  FROM solicitud_amistad
                  WHERE usuario_recibe = ur
                    and usuario_envia = ue)
    INTO exist_request;

    -- Valida que exista la solicitud de amistad
    IF exist_request
    THEN
        -- Inserta la relación a amistad y la elimina de solicitud
        INSERT INTO amistad VALUES (ur, ue);
        -- Solo se elimina una opción, ya que no se pueden tener ambas combinaciones
        DELETE FROM solicitud_amistad WHERE usuario_recibe = ur and usuario_envia = ue;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90000'
            USING MESSAGE = 'The friendship request does not exist';
    END IF;
END
$BODY$
    LANGUAGE 'plpgsql';

-- Obtiene los amigos para un usuario específico

CREATE OR REPLACE function get_friends(integer)
    RETURNS TABLE(nombre varchar, carne int, correo varchar) AS
$BODY$
DECLARE
    friends1 numeric[];
    friends2 numeric[];
    friends numeric[];
    fren numeric;
BEGIN
    IF NOT EXISTS(SELECT u.carne FROM usuario u WHERE u.carne = $1)
    THEN
        RAISE EXCEPTION
            SQLSTATE '80000'
            USING MESSAGE = 'The user does not exist';
    END IF;

    -- Revisa los amigos como amigo 2
    SELECT ARRAY(SELECT amigo2_carne FROM amistad WHERE amigo1_carne = $1) INTO friends1;

    -- Revisa los amigos como amigo 1
    SELECT ARRAY(SELECT amigo1_carne FROM amistad WHERE amigo2_carne = $1) INTO friends2;

    friends := friends1 || friends2;

    FOREACH fren in array friends LOOP
            RETURN QUERY
                SELECT CONCAT(u.nombre, ' ', apellido)::VARCHAR as nombre_completo, u.carne, u.correo
                FROM usuario u
                WHERE u.carne = fren;
        END LOOP;

END
$BODY$
    LANGUAGE 'plpgsql';

-- Cancela o rechaza una solicitud de amistad

CREATE OR REPLACE function cancel_reject_request(integer, integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist boolean;
BEGIN
    -- Busca que la solicitud de amistad exista
    SELECT EXISTS(SELECT *
                  FROM solicitud_amistad
                  WHERE usuario_envia = $1 and usuario_recibe = $2
                     or usuario_envia = $2 and usuario_recibe = $1)
    INTO exist;

    -- Valida que existe la solicitud de amistad
    IF exist
    THEN
        -- Elimina la relación
        DELETE
        FROM solicitud_amistad
        WHERE usuario_recibe = $2 and usuario_envia = $1
           or usuario_envia = $2 and usuario_recibe = $1;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90000'
            USING MESSAGE = 'The friendship request does not exist';
    END IF;

END;
$BODY$
    LANGUAGE 'plpgsql';

-- Elimina un amigo

CREATE OR REPLACE function delete_friend(integer, integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist boolean;
BEGIN
    -- Busca por una relación de amigos ya existente
    SELECT EXISTS(SELECT *
                  FROM amistad
                  WHERE amigo1_carne = $1 and amigo2_carne = $2
                     or amigo1_carne = $2 and amigo2_carne = $1)
    INTO exist;

    -- Valida que exista la amistad
    IF exist
    THEN
        DELETE
        FROM amistad
        WHERE amigo1_carne = $2 and amigo2_carne = $1
           or amigo2_carne = $2 and amigo1_carne = $1;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90000'
            USING MESSAGE = 'The friendship does not exist';
    END IF;
END
$BODY$
    LANGUAGE 'plpgsql';

-- Recomendaciones
CREATE OR REPLACE function sections_suggestions(integer)
    RETURNS TABLE(carne integer, nombre varchar, correo varchar) AS
$BODY$
BEGIN
    RETURN QUERY
        SELECT u.carne, (CONCAT(u.nombre, ' ', u.apellido))::VARCHAR, u.correo
        FROM asiste_seccion pool
                 INNER JOIN asiste_seccion a on pool.seccion_id = a.seccion_id and a.usuario_carne != $1
                 INNER JOIN usuario u on a.usuario_carne = u.carne
        WHERE pool.usuario_carne = $1
          AND u.carne NOT IN(SELECT amigo2_carne FROM amistad WHERE amigo1_carne = $1)
          AND u.carne NOT IN(SELECT amigo1_carne FROM amistad WHERE amigo2_carne = $1)
          AND u.carne NOT IN(SELECT usuario_envia FROM solicitud_amistad WHERE usuario_recibe = $1)
          AND u.carne NOT IN(SELECT usuario_recibe FROM solicitud_amistad WHERE usuario_envia = $1)
        GROUP BY u.carne
        ORDER BY COUNT(*) DESC
        LIMIT 10;
END
$BODY$
    LANGUAGE 'plpgsql';

CREATE OR REPLACE function hobbies_suggestions(integer)
    RETURNS TABLE(carne integer, nombre varchar, correo varchar) AS
$BODY$
BEGIN
    RETURN QUERY
        SELECT u.carne, (CONCAT(u.nombre, ' ', u.apellido))::VARCHAR, u.correo
        FROM has_hobby pool
                 INNER JOIN has_hobby a ON pool.hobby_id = a.hobby_id AND a.usuario_carne != $1
                 INNER JOIN usuario u ON a.usuario_carne = u.carne
        WHERE pool.usuario_carne = $1
          AND u.carne NOT IN(SELECT amigo2_carne FROM amistad WHERE amigo1_carne = $1)
          AND u.carne NOT IN(SELECT amigo1_carne FROM amistad WHERE amigo2_carne = $1)
          AND u.carne NOT IN(SELECT usuario_envia FROM solicitud_amistad WHERE usuario_recibe = $1)
          AND u.carne NOT IN(SELECT usuario_recibe FROM solicitud_amistad WHERE usuario_envia = $1)
        GROUP BY u.carne
        ORDER BY COUNT(*) DESC
        LIMIT 10;
END
$BODY$
    LANGUAGE 'plpgsql';


-- Recomendación de amigos por mis amigos
CREATE OR REPLACE function friends_base_suggestions(integer)
    RETURNS TABLE
            (
                nombre varchar,
                carne  int,
                correo varchar
            )
AS
$BODY$
DECLARE
    friends     integer[];
    frends      integer[];
    temp_frends integer[];
    friend      integer;
    frend       integer;
BEGIN
    -- Primero, busca los amigos de usuario
    SELECT ARRAY(SELECT CASE
                            WHEN amigo1_carne = $1 THEN amigo2_carne
                            WHEN amigo2_carne = $1 THEN amigo1_carne
                            ELSE
                                -1
                            END
                 FROM amistad)
    INTO friends;


    FOREACH friend in array friends
        LOOP
            raise info 'information message %', friend;
            -- Obtiene los amigos de los amigos del ususario
            SELECT ARRAY(SELECT DISTINCT CASE
                                             WHEN amigo1_carne = friend THEN amigo2_carne
                                             WHEN amigo2_carne = friend THEN amigo1_carne
                                             ELSE
                                                 -1
                                             END
                         FROM amistad
                              -- Valido que no retorne a quienes son mis amigos
                         WHERE (amigo1_carne != ALL (friends || $1) OR (amigo2_carne != ALL (friends || $1))))
            INTO temp_frends;

            frends := frends || temp_frends;

            SELECT ARRAY(SELECT DISTINCT UNNEST(frends::integer[])) INTO frends;

        END LOOP;


    FOREACH frend in array frends
        LOOP
            IF frend != -1
            THEN
                RETURN QUERY
                    SELECT CONCAT(u.nombre, ' ', apellido)::VARCHAR as nombre_completo, u.carne, u.correo
                    FROM usuario u
                    WHERE u.carne = frend;
            END IF;
        END LOOP;

    raise info 'information message %', frends;
END
$BODY$
    LANGUAGE 'plpgsql';

