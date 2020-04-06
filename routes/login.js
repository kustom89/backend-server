var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var app = express();

var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales Incorrectas - email',
                errors: err
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });
        }

        // crear token
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuarioDB }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            Usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    })



})





module.exports = app;