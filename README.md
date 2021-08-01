# Backend
El proyecto utiliza un backend de Node y postgresql.

## Setup
1. Instalar Postgresql (o SQLite) y Node
2. npm install
3. Conseguir el .env
4. Correr el api


### 2. Dependencias
Al estar hecho en Node, podemos aprovecharnos de npm para usar todas las dependencias.
```bash
npm install
```

### 3. Conseguir el .env
El archivo .env contiene las claves de la base de datos y todo. **No debe estar en el repositorio.**
Puse el env oficial en el Discord, pero si quieren probar en su máquina local, la estructura es así:
```bash
USE_POSTGRESQL=False
DATABASE_NAME=ISW
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### 4. Correr el api
Dependiendo del entorno donde lo estemos corriendo se utiliza:
```bash
# En testing, una máquina local.
npm run run

# Para producción se utiliza este
npm run start
```

## Schema de la base de datos
![Schema](Schema.png)
---
### Curso
- *id*
- nombre

### Sección
- curso_id: FK a Curso
- usuario_id: FK a Usuario
- número de sección

### Carrera
- *id*
- nombre

### Usuario
- *id*
- nombre
- apellido
- carrera_id 

### Amistad
- *id*
- amigo1_id: FK a Usuario
- amigo2_id: FK a Usuario

### Hobby
- *id*
- nombre
- descripción

### Plataforma Social
- *id*
- nombre
- base_link: i.e. facebook.com
- profile_link: i.e. facebook.com/{username}

### Red Social
- *id*
- plataforma_id: FK a plataforma social
- usuario_id: FK al usuario que pertenece
