# Backend
El backend de nuestro proyecto utiliza el framework de Django y neo4j. No entraré mucho a detalle de cómo hacer el neo4j, pero sí del Django.

## Setup
Se tienen que seguir los siguientes pasos:
1. Instalar neo4j
2. Instalar Python
3. Clonar el repo
4. Crear un virtual environment
5. Instalar las dependencias
6. Conseguir credentials.py
7. Correr el api

Por razones obvias, no entraré a detalles de muchas de las cosas anteriores.

### Virtual Environment
El virtual environment de Python nos permite asegurarnos de que no hay una tercera dependencia que afecte cómo funciona el proyecto.
```bash
python3 -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
```

### Dependencias
Por el momento, todas las dependencias están en dependencies.txt.
```bash
pip install -r dependencies.txt
```

### Credentials
Por razones obvias, no subimos las credenciales a la base de datos al repo. Pero el formato en que la tenemos escrita es algo así:
```python
import os
ENVIRONMENT = 'local'

if ENVIRONMENT == 'local':
    DATABASE_URL = os.environ.get('NEO4J_BOLT_URL', 'bolt://username:contraseña@localhost:puerto')
    IS_DEBUGGING = True
else:
    DATABASE_URL = os.environ.get('NEO4J_BOLT_URL', 'bolt://username:constraseña@dominio:puerto')
    IS_DEBUGGING = False


SECRET_KEY_CREDENTIAL = 'un string aleatorio largo para cifrar cosas'
```

### Correr el Api
Para correr el api solo se tiene que dar:
```bash
python manage.py runserver
```
### Si no corre
Tal vez necesites correr los siguientes comandos:
```bash
python manage.py migrate
python manage.py install_labels
```

### Parar al api
* Si está corriendo en primer plano solo usas `Ctrl+C`
* Si está corriendo en segundo plano:
```bash
ps auxw | grep runserver # Devuelve el PID de Django
kill 1234 # Cambiar 1234 por el PID
```