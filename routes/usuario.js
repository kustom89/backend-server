var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticaion');
// var SEED = require('../config/config').SEED;




var app = express();

var Usuario = require('../models/usuario');
// var SEED = require('../config/config').SEED;


// Obtener todos los usuarios
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde)

    Usuario.find({}, 'nombre email role img')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recibir coleccion de usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios,
                        total: conteo
                    });
                })


            }
        )
})

// crear nuevo usuario
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear usuario',
                errors: err
            });
        }



        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });


    })



});

// Actualizar usuario

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { message: 'no existe un usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                res.status(400).json({
                    ok: true,
                    mensaje: 'error al actualizar usuario',
                    error: err
                });
            }

            usuarioGuardado.password = ':-D';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            })
        });
    });


});

// Eliminar registros por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario',
                errrors: err
            });
        }

        if (!usuarioBorrado) {
            res.status(500).json({
                ok: false,
                mensaje: 'no existe usuario con tal id',
                errors: { message: 'No existe usuario con tal id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    })
})







module.exports = app;