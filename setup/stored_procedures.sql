-- Funciones

-- Envía una solicitud de amistad
CREATE OR REPLACE function send_request(integer, integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist boolean;
BEGIN
    SELECT
        EXISTS(SELECT *
               FROM solicitud_amistad
               WHERE usuario_envia = $1 and usuario_recibe = $2
                  or usuario_envia = $2 and usuario_recibe = $1)
    INTO exist;

    IF NOT exist
    THEN
        IF $1 != $2
        THEN
            INSERT INTO solicitud_amistad VALUES ($1, $2);
        ELSE
            RAISE EXCEPTION
                SQLSTATE '90000'
                USING MESSAGE = 'The users credentials are the same';
        END IF;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90001'
            USING MESSAGE = 'The friendship request already exist';
    END IF;
END
$BODY$
    LANGUAGE 'plpgsql';

SELECT send_request(19943, 19943);

-- ur → usuario que recibe
-- ue → usuario que envía
-- Acepta una solicitud de amistad → en este caso el orden sí importa
CREATE OR REPLACE function accept_request(ur integer, ue integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist boolean;
    exist_request boolean;
BEGIN
    -- Busca por una relación de amigos ya existente
    SELECT
        EXISTS(SELECT *
               FROM amistad
               WHERE amigo1_carne = ur and amigo2_carne = ue
                  or amigo1_carne = ue and amigo2_carne = ur)
    INTO exist;

    -- Busca que la solicitud de amistad exista
    SELECT
        EXISTS(SELECT *
               FROM solicitud_amistad
               WHERE usuario_recibe = ur and usuario_envia = ue)
    INTO exist_request;

    -- Valida que exista la solicitud de amistad
    IF exist_request
    THEN
        -- Valida que no existe la relación de amistad
        IF NOT exist
        THEN
            -- Valida que no se ingrese el mismo carné
            IF ur != ue
            THEN
                -- Inserta la relación a amistad y la elimina de solicitud
                INSERT INTO amistad VALUES (ur, ue);
                -- Solo se elimina una opción, ya que no se pueden tener ambas combinaciones
                DELETE FROM solicitud_amistad WHERE usuario_recibe = ur and usuario_envia= ue;
            ELSE
                RAISE EXCEPTION
                    SQLSTATE '90000'
                    USING MESSAGE = 'The users credentials are the same';
            END IF;
        ELSE
            RAISE EXCEPTION
                SQLSTATE '90001'
                USING MESSAGE = 'The friendship already exist';
        END IF;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90002'
            USING MESSAGE = 'The friendship request does not exist';
    END IF;
END
$BODY$
    LANGUAGE 'plpgsql';

SELECT accept_request(0, 191025);

-- Obtiene los amigos para un usuario específico
CREATE OR REPLACE function get_friends(integer)
    RETURNS TABLE(nombre_completo varchar, credencial int, email varchar) AS
$BODY$
DECLARE
    friends1 numeric[];
    friends2 numeric[];
    friends numeric[];
    fren numeric;
BEGIN
    IF NOT EXISTS(SELECT carne FROM usuario WHERE carne = $1)
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
                SELECT CONCAT(nombre, ' ', apellido)::VARCHAR, carne, correo
                FROM usuario
                WHERE carne = fren;
        END LOOP;

END
$BODY$
    LANGUAGE 'plpgsql';

SELECT get_friends(19943);

-- Cancela o rechaza una solicitud de amistad
CREATE OR REPLACE function cancel_reject_request(integer, integer)
    RETURNS VOID AS
$BODY$
DECLARE
    exist boolean;
BEGIN
    -- Busca que la solicitud de amistad exista
    SELECT
        EXISTS(SELECT *
               FROM solicitud_amistad
               WHERE usuario_envia = $1 and usuario_envia = $2
                  or usuario_envia = $2 and usuario_recibe = $1)
    INTO exist;

    -- Valida que existe la solicitud de amistad
    IF exist
    THEN
        -- Valida que no se ingrese el mismo carné
        IF $2 != $1
        THEN
            -- Elimina la relación
            DELETE FROM solicitud_amistad WHERE usuario_recibe = $2 and usuario_envia= $1
                                             or usuario_envia = $2 and usuario_recibe= $1;
        ELSE
            RAISE EXCEPTION
                SQLSTATE '90000'
                USING MESSAGE = 'The users credentials are the same';
        END IF;
    ELSE
        RAISE EXCEPTION
            SQLSTATE '90001'
            USING MESSAGE = 'The friendship request does not exist';
    END IF;

END;
$BODY$
    LANGUAGE 'plpgsql';

SELECT cancel_reject_request(191025, 0);
