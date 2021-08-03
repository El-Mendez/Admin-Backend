# API
El API cuenta con dos rutas principales.
- **Free**: No necesita estar loggeado.
- **Auth**: Debe de estar loggeado para funcionar

**Algo importante de mencionar, es la diferencia entre Devuelve `algo` y [`algo`]. Una es solo un valor y la segunda 
es una lista.**

## Free: Cualquiera puede ver
Todos los request de esta sección deben de estar precedidos por un /free.

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
| Parámetros | `carne`, `nombre`, `apellido`, `carreraId`, `password`  |             403 | Correo ya utilizado.                |
| Devuelve   | `token`                                                 |                 |                                     |

### Buscar una Carrera por el nombre
Este método busca una carrera de acuerdo al nombre que se ingrese. Ignora mayúsculas y funciona aún si es solo parte 
del nombre. **El atributo *nombre* va en la ruta del query, no en el body.** De esa manera hacemos que el método sea GET
(para que se cachee) con parámetros.

|    Ruta    | /free/carrera/:nombre    |
|:----------:|--------------------------|
|   Método   | GET                      |
| Parámetros | `nombre*`                |
| Devuelve   | [`id`, `nombre`]         |


# Auth: Necesita estar loggeado.
Para cualquier de estos request se necesita estar poner un JWT válido en el header `authorization` del request en 
formato 'Bearer *token*'.
