const express = require('express');
const {dbConnection} = require('./db/config');
const cors = require('cors');
//Utilizar variables de entorno como definir un puerto al servidor
require('dotenv').config();


console.log(process.env)

//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();
//CORS

app.use(cors())
//Directorio publico //use = funcion que se ejecuta cuando alguien hace una petición al servidor
app.use(express.static('public'));

//Lectura y pareso del body, las peticiones que vengan en formato json las procesará ahí y extraerá su contenido
app.use(express.json());

//Rutas Auth = Crear,login,renew
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
//CRUD:Eventos


//Escuchar peticiones

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});
