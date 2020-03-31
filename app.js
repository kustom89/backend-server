var express = require('express');
const mongoose = require('mongoose');


// inicializar variablres

var app = express();

// Conexion a la BD ('localhost', 'hospitalDB', 27017, [opts]);

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;

    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' online');

})

// Rutas

app.get('/', (req, resp, next) => {

    resp.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    })
});


// escuchar peticiones

app.listen(3000, () => {
    console.log('express server en el puerto 3000:\x1b[32m%s\x1b[0m', ' online');
});