# Schema de la base de datos
![Schema](Schema.png)
---
### Curso
- *id*
- nombre

### Carrera
- *id*
- nombre

### Usuario
- *id*
- nombre
- apellido
- apodo: puede ser null
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