var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


// inicializar variables
var app = express();

// Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Conexion a la BD 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;

    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' online');

})

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// escuchar peticiones
app.listen(3000, () => {
    console.log('express server en el puerto 3000:\x1b[32m%s\x1b[0m', ' online');
});