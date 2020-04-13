var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticaion');
// var SEED = require('../config/config').SEED;




var app = express();

var Medico = require('../models/medico');
// var SEED = require('../config/config').SEED;


// Obtener todos los medicos
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde)

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recibir coleccion de usuarios',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos,
                        total: conteo
                    });


                })


            }
        )
});

// crear medicos
app.post('/', (req, res) => {

    var body = req.body;

    var medico = Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        })

    })
});

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el medico con el ID: ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese Id' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.usuario._id;
        medico.hospital = body.hospital._id;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al crear medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })

        })

    })
})


app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error en el borrado',
                errors: err
            });
        }

        if (!medicoBorrado) {
            res.status(500).json({
                ok: false,
                mensaje: 'no existe medio con tal Id',
                errors: { message: 'no existe hospitalon talId' }
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        })
    })
})

module.exports = app;