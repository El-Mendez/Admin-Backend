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
|   Método   | POST                 | 400             | No se pasaron todos los parámetros. |
| Parámetros | `carne`, `password`  | 403             | Contraseña o usuario incorrecto.    |
| Devuelve   | `token`              |                 |                                     |

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

### Obtener información del usuario
Permite conocer la información de perfil de cualquier usuario por medio del carné. 

| Ruta       | /free/profile/:carne                                                     | Código de error | Significado                                       |
|------------|--------------------------------------------------------------------------|-----------------|---------------------------------------------------|
| Método     | GET                                                                      |  400            | No se pasaron parámetros válidos                  |
| Parámetros | `carne` (en URI)                                                         |  403            | El usuario no está asignado a ningún curso hobbie |
| Devuelve   | `[carne`, `nombre_completo`,`carrera`, `correo`, `[cursos]`,`[hobbies]]` |                 |                                                   |

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

### Asignarse a Hobbies
Si una persona ya está loggeada, se puede asignar a algunos hobbies si conoce el código del hobby.

|    Ruta    | /auth/hobby/ | Código de error | Significado                                          |
|:----------:|--------------|----------------:|------------------------------------------------------|
|   Método   | POST         |             400 | No se pasaron todos los parámetros.                  |
| Parámetros | `hobbiesId`  |             401 | Token vencido o no mandó token.                      |
| Devuelve   |              |             403 | Ya estaba asignado a ese hobby o no existe el hobby. |

### Ver cursos asignados
Devuelve todos los cursos asignados por el estudiante.

|    Ruta    | /auth/seccion/                                                      | Código de error | Significado                                          |
|:----------:|-------------------------------------------------------------------|----------------:|------------------------------------------------------|
|   Método   | GET                                                               |             401 | Token vencido o no mandó token.                      |
| Parámetros |                                                                   |                 |                                                      |
| Devuelve   | [`cursoId`, `cursoNombre`, `secciones: [seccion, seccionId]`]     |                 |                                                      |

### Cambiar Contraseña
Para cambiar la contraseña, se necesita tener un token de autorización y también la contraseña anterior.

|    Ruta    | /auth/password               | Código de error | Significado                     |
|:----------:|------------------------------|----------------:|---------------------------------|
|   Método   | POST                         |             400 | No mandó todos los parámetros.  |
| Parámetros | `newPassword`, `oldPassword` |             401 | Token Vencido o no mandó token. |
| Devuelve   |                              |             403 | Contraseña antigua incorrecta.  |

### Obtener información del usuario
Permite conocer la información de perfil del usuario actualmente loggeado.

| Ruta       | /auth/profile                                                            | Código de error | Significado                                        |
|------------|--------------------------------------------------------------------------|-----------------|----------------------------------------------------|
| Método     | GET                                                                      | 403             | El usuario no está asignado a ningún curso o hobby |
| Parámetros |                                                                          | 401             | Token Vencido o no mandó token.                    |
| Devuelve   | `[carne`, `nombre_completo`,`carrera`, `correo`, `[cursos]`,`[hobbies]]` |                 |                                                    |

### Reportar un usuario
Permite lanzar una solicitud para reportar un usuario.

| Ruta       | /auth/report         | Código de error | Significado                       |
|------------|----------------------|-----------------|-----------------------------------|
| Método     | POST                 | 400             | No se mandó todos los parámetros. |
| Parámetros | `reported`, `reason` | 401             | Token vencido o no mandó token.   |
| Devuelve   |                      | 403             | El usuario a reportar no existe.  |

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


### Según hobbies en común

|    Ruta    | /auth/suggestions/hobbies                | Código de error | Significado                     |
|:----------:|------------------------------------------|----------------:|---------------------------------|
|   Método   | GET                                      |             401 | Token Vencido o no mandó token. |
| Parámetros |                                          |                 |                                 |
| Devuelve   | [`carne`, `nombre`, `apellido`, `count`] |                 |                                 |

## Amistades
Se encargan del manejo de amigos. Son rutas que trabajan con Auth, sin embargo, ya que es un módulo de gran valor para los 
usuarios, se colocó de manera separada.

### Enviar solicitud de amistad
El usuario actualmente loggeado envía una solicitud de amistad al usuario seleccionado.

| Ruta       | /auth/friends/sendRequest            | Código de error | Significado                                     |
|------------|--------------------------------------|-----------------|-------------------------------------------------|
| Método     | POST                                 | 401             | Token vencido o no mandó token.                 |
| Parámetros | `carne` (usuario que recibe request) | 403             | Solicitud de amistad ya existente o los carnets |
| Devuelve   |                                      |                 |                                                 |

### Aceptar solicitud de amistad
El usuario actualmente loggeado acepta una solicitud de amistad del usuario seleccionado.

| Ruta       | /auth/friends/acceptRequest              | Código de error | Significado                                              |
|------------|------------------------------------------|-----------------|----------------------------------------------------------|
| Método     | POST                                     | 401             | Token vencido o no mandó token.                          |
| Parámetros | `carne` (usuario que envió la solicitud) | 403             | La solicitud de amistad no existe o la amistad ya existe |
| Devuelve   |                                          |                 |                                                          |

### Cancelar o rechazar solicitud de amistad
El usuario actualmente loggeado rechaza una solicitud de amistad recibida, o bien, cancela una solicitud de amistad enviada.

| Ruta       | /auth/friends/cancelRequest                      | Código de error | Significado                                                    |
|------------|--------------------------------------------------|-----------------|----------------------------------------------------------------|
| Método     | POST                                             | 401             | Token vencido o no mandó token.                                |
| Parámetros | `carne` (usuario que envió/recibió al solicitud) | 403             | La solicitud de amistad no existe o los carnets son los mismos |
| Devuelve   |                                                  |                 |                                                                |

### Obtener amigos
Obtiene los amigos del usuario actualmente loggeado.

| Ruta       | /auth/friends/getFriends      | Código de error | Significado                     |
|------------|-------------------------------|-----------------|---------------------------------|
| Método     | GET                           | 401             | Token vencido o no mandó token. |
| Parámetros |                               |                 |                                 |
| Devuelve   | [`nombre`, `carne`, `correo`] |                 |                                 |

### Solicitudes de amistad recibidas
Obtiene las solicitudes de amistad recibidas por el usuario loggeado.

| Ruta       | /auth/friends/receivedRequests                           | Código de error | Significado                     |
|------------|----------------------------------------------------------|-----------------|---------------------------------|
| Método     | GET                                                      | 401             | Token vencido o no mandó token. |
| Parámetros |                                                          |                 |                                 |
| Devuelve   | [`usuario_envia`] (carne de usuario que envía solicitud) |                 |                                 |

### Solicitudes de amistad enviadas
Obtiene las solicitudes de amistad enviadas por el usuario loggeado.

| Ruta       | /auth/friends/sentRequests                                | Código de error | Significado                     |
|------------|-----------------------------------------------------------|-----------------|---------------------------------|
| Método     | GET                                                       | 401             | Token vencido o no mandó token. |
| Parámetros |                                                           |                 |                                 |
| Devuelve   | [`usuario_recibe`] (carne de usuario que envía solicitud) |                 |                                 |

# Request: Especiales por correo
Aquí van las request que realmente necesitan o generan tokens no regulares.

### Hacer un Request de Sign Up
Permite crear una cuenta. Al igual que el resto de funciones, el token se devuelve en un correo. Vale la pena mencionar 
el token que devuelve es masivo. Tipo, min 200 caracteres.

|    Ruta    | /request/signup                                                   | Código de error | Significado                                |
|:----------:|-------------------------------------------------------------------|----------------:|--------------------------------------------|
|   Método   | POST                                                              |             400 | No se pasaron todos los parámetros.        |
| Parámetros | `carne`, `nombre`, `apellido`, `carreraId`, `password`, `correo`  |             403 | Carné ya utilizado o la carrera no existe. |
| Devuelve   | `token`                                                           |                 |                                            |


### Aceptar un Request de Sign Up
El token debe ser enviado usando un encabezado Authorization con formato Bearer. Asimismo, el token se vence en 20 
minutos como máximo. Igualmente, el token que devuelve es el token regular para las rutas auth. Igualmente, siempre 
existe la probabilidad de que usen el token dos veces o alguien más registró el correo (error 403).

| Ruta      | /request/acceptSignUp | Código de Error | Significado                             |
|-----------|-----------------------|-----------------|-----------------------------------------|
| Método    | POST                  | 401             | El token está vencido o no mandó token. |
| Parámetro | `token`               | 403             | Ya hay una cuenta con ese carné.        |
| Devuelve  | `token`               |                 |                                         |


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
Este request reinicia la contraseña del usuario. Necesita de un Header Authorization de formato Bearer con un token 
que se vence en 15 minutos desde que se generó el request de generar la contraseña.

|    Ruta    | /request/acceptPasswordReset | Código de error | Significado                    |
|:----------:|------------------------------|----------------:|--------------------------------|
|   Método   | POST                         |             400 | No mandó todos los parámetros. |
| Parámetros | `newPassword`                |             401 | Token vencido o no mandó token |
| Devuelve   |                              |                 |                                |
