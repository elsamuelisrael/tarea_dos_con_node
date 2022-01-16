## tarea1aplicacionweb
tarea #2 para la materia Ingeniería y Desarrollo en la Web se uso nodejs, express y mongodb

### Author : Samuel Israel Azcarraga Velazquez

### `MongoDB configuración`
la configiracion de la DB esta en  `config/db.config.js`

Para ejecutar el proyecto:

### `npm install`

Esto instalara las dependencias `node_modules`

### `node server.js` o `nodemon start` o `npm start`

la aplicacion de ejecutar en el puerto 5050 (http://localhost:5050) o REMOTO en (https://cuatroymedio.net:5050/)

#########################################################################

Pagina de la API

  https://cuatroymedio.net:5050/

Aplicación (cliente) desplegada en un servidor externo de AWS 

  https://cuatroymedio.net/test/maestria/ingydesweb/tarea2/cliente/

Pruebas para obtener datos de la API con CURL

    ### generar TOKEN
    curl -k -L -X POST 'https://cuatroymedio.net:5050/api/personas/autenticar' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "usuario": "unir",
        "contrasena": "unir33?"
    }'

    ### insertar datos
    curl -k -L -X POST 'https://cuatroymedio.net:5050/api/personas/' -H 'authorization: TOKEN' -H 'Content-Type: application/json' --data-raw '{
        "nombre": "xxxxxxxxx",
        "ap": "yyyyyyyyyyy",
        "am": "zzzzzzzzz",
        "email": "xxxyyzzz@me.com",
        "status": true,
        "nombrepuesto": "- No Tiene",
        "idpuesto": "61b9640b25bd06b4942e9a33"
    }'

    ### recuperar lista de personas
    curl -k -L -X POST 'https://cuatroymedio.net:5050/api/personas/paginacion/' \
    -H 'authorization: TOKEN' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "epp": 0
    }'
    

    ### recuperar lista de puestos
    curl -k -L -X GET 'https://cuatroymedio.net:5050/api/personas/puestos' \
    -H 'authorization: TOKEN'


Lista con los vídeos tutoriales de como usar el cliente (habilitar los subtítulos)

  https://www.youtube.com/watch?v=SpvZtwqHxcg&list=PLsHTh4h2CZ0-l58FOMO6dUcHD5p1ypZcX



## Project setup
```
npm install
```

### Run
```
npm start
```
