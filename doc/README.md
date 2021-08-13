# API
El API cuenta con dos rutas principales.
- **Free**: No necesita estar loggeado.
- **Auth**: Debe de estar loggeado para funcionar
- **Request:** Son para cosas especiales. Necesitan de tokens que serán enviados por correo.

**Algo importante de mencionar, es la diferencia entre Devuelve `algo` y [`algo`]. Una es solo un valor y la segunda 
es una lista.**

## Free: Cualquiera puede ver
Todos los request de esta sección deben de estar precedidos por un /free.

### Ping
Únicamente para intenciones de testing. Únicamente devuelve el mensaje pong.

|    Ruta    | /auth/ping/    |
|:----------:|----------------|
|   Método   | GET            |
| Parámetros |                |
| Devuelve   | `response`     |

### Login
Es la clásica función para el login. Devuelve un JSON Web Token (JWT) que expira en un día. 
El token es necesario para poder usar todas las funciones de auth.

|    Ruta    | /free/login          | Código de error | Significado                         |
|:----------:|----------------------|----------------:|-------------------------------------|
|   Método   | GET                  | 400             | No se pasaron todos los parámetros. |
| Parámetros | `carne`, `password`  | 403             | Contraseña o usuario incorrecto.    |
| Devuelve   | `token`              |                 |                                     |

### Sign Up
Permite crear una cuenta.

|    Ruta    | /free/signup                                            | Código de error | Significado                         |
|:----------:|---------------------------------------------------------|----------------:|-------------------------------------|
|   Método   | POST                                                    |             400 | No se pasaron todos los parámetros. |
| Parámetros | `carne`, `nombre`, `apellido`, `carreraId`, `password`  |             403 | Carné ya utilizado.                 |
| Devuelve   | `token`                                                 |                 |                                     |

### Buscar una Carrera por el nombre
Este método busca una carrera de acuerdo al nombre que se ingrese. Ignora mayúsculas y funciona aún si es solo parte 
del nombre. **El atributo *nombre* va en la ruta del query, no en el body.** De esa manera hacemos que el método sea GET
(para que se cachee) con parámetros.

|    Ruta    | /free/carrera/:nombre    |
|:----------:|--------------------------|
|   Método   | GET                      |
| Parámetros | `nombre*` (opcional)     |
| Devuelve   | [`id`, `nombre`]         |

### Buscar un Hobby por el nombre
Al igual que el anterior, el parámetro nombre tiene que ir en la URL de búsqueda. Esto es para garantizar un método 
GET que tiene parámetros.

|    Ruta    | /free/hobby/:nombre             |
|:----------:|---------------------------------|
|   Método   | GET                             |
| Parámetros | `nombre*` (opcional)            |
| Devuelve   | [`id`, `nombre`, `description`] |

### Buscar un curso por el nombre
Este query te devuelve la lista de cursos con sus secciones respectivas. Como parámetro de nombre acepta el nombre del 
curso o el código del curso. No tiene que estar completo e ignora mayúsculas.

|    Ruta    | /free/curso/:nombre                                               |
|:----------:|-------------------------------------------------------------------|
|   Método   | GET                                                               |
| Parámetros | `nombre*` (opcional)                                              |
| Devuelve   | [`cursoId`, `cursoNombre`, `secciones: [seccion, seccionId]`]     |


# Auth: Necesita estar loggeado.
Para cualquier de estos request se necesita estar poner un JWT válido en el header `authorization` del request en 
formato 'Bearer *token*'.

### Ping
Únicamente para intenciones de testing. Únicamente devuelve el mensaje pong.

|    Ruta    | /auth/ping/    | Código de error | Significado                         |
|:----------:|----------------|----------------:|-------------------------------------|
|   Método   | GET            |             401 | Token vencido o no mandó token.     |
| Parámetros |                |                 |                                     |
| Devuelve   | `response`     |                 |                                     |

### Asignarse a una sección o más
Dado que una persona ya está loggeada, se puede colocar en el backend a que asiste una sección de un curso en 
específico.

|    Ruta    | /auth/seccion/ | Código de error | Significado                                              |
|:----------:|----------------|----------------:|----------------------------------------------------------|
|   Método   | POST           |             400 | No se pasaron todos los parámetros.                      |
| Parámetros | `seccionesId`  |             401 | Token vencido o no mandó token.                          |
| Devuelve   |                |             403 | Ya estaba asignado a esa sección o no existe la sección. |

### Asignarse a un Hobby
Si una persona ya está loggeada, se puede asignar un hobby si conoce el código del hobby.

|    Ruta    | /auth/hobby/ | Código de error | Significado                                          |
|:----------:|--------------|----------------:|------------------------------------------------------|
|   Método   | POST         |             400 | No se pasaron todos los parámetros.                  |
| Parámetros | `hobbyId`    |             401 | Token vencido o no mandó token.                      |
| Devuelve   |              |             403 | Ya estaba asignado a ese hobby o no existe el hobby. |

### Ver cursos asignados
Devuelve todos los cursos asignados por el estudiante.

|    Ruta    | /auth/curso/                                                      | Código de error | Significado                                          |
|:----------:|-------------------------------------------------------------------|----------------:|------------------------------------------------------|
|   Método   | GET                                                               |             401 | Token vencido o no mandó token.                      |
| Parámetros |                                                                   |             403 | Ya estaba asignado a ese hobby o no existe el hobby. |
| Devuelve   | [`cursoId`, `cursoNombre`, `secciones: [seccion, seccionId]`]     |                 |                                                      |

### Cambiar Contraseña
Para cambiar la contraseña, se necesita tener un token de autorización y también la contraseña anterior.

|    Ruta    | /auth/password               | Código de error | Significado                     |
|:----------:|------------------------------|----------------:|---------------------------------|
|   Método   | POST                         |             400 | No mandó todos los parámetros.  |
| Parámetros | `newPassword`, `oldPassword` |             401 | Token Vencido o no mandó token. |
| Devuelve   |                              |             403 | Contraseña antigua incorrecta.  |

## Recomendaciones
Realmente son exactamente idénticas al auth, pero lo puse separado porque realmente nuestro proyecto está basado en 
esto.

### Según secciones en común
Cuenta la cantidad de cursos que se tienen en común y devuelve un máximo de las 10 personas que tienen más secciones en 
común.

|    Ruta    | /auth/suggestions/courses                | Código de error | Significado                     |
|:----------:|------------------------------------------|----------------:|---------------------------------|
|   Método   | GET                                      |             401 | Token Vencido o no mandó token. |
| Parámetros |                                          |                 |                                 |
| Devuelve   | [`carne`, `nombre`, `apellido`, `count`] |                 |                                 |






# Request: Especiales por correo
Aquí van las request que realmente necesitan o generan tokens no regulares.

### Generar un request de resetear contraseña
Este request no devuelve nada en sí, pero enviará un correo donde se enviará un link con el código para
aceptar el cambio de contraseña. El link se vence en 15 minutos. La cuenta será enviada al correo de la persona con 
el carné y si no existe no hará nada.

|    Ruta    | /request/passwordReset | Código de error | Significado                    |
|:----------:|------------------------|----------------:|--------------------------------|
|   Método   | POST                   |             400 | No mandó todos los parámetros. |
| Parámetros | `carne`                |                 |                                |
| Devuelve   |                        |                 |                                |


### Aceptar un request de resetear contraseña
Este request reinicia la contraseña del usuario. Necesita de un Header Authorization con un token que se vence en 15 
minutos.

