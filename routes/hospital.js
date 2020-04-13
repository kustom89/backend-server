var express = require('express');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken')


var mdAutenticacion = require('../middlewares/autenticaion');
// var SEED = require('../config/config').SEED;


var app = express();

var Hospital = require('../models/hospital');

//nuevo Hospital
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde)

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar hospitales',
                        errors: err
                    })
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospital,
                        total: conteo
                    });



                })


            }
        )
});

// crear nuevo Hospital

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario._id
    });

    hospital.save((err, hospitaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitaGuardado,
            usuarioToken: req.usuario
        })
    })

});

//Actualizar Hospital


app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con ID: ' + id + 'no existe',
                errors: { message: 'no existeun hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = body.usuario;

        hospital.save((err, hospitaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'error al actualizar Hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitaGuardado,
                usuarioToken: req.usuario
            })
        })




    })
})


app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, mdAutenticacion.verificaToken, (err, hospitalBorrado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error en el borrado',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            res.status(500).json({
                ok: false,
                mensaje: 'no existe hospital con tal id',
                errors: { message: 'no existe hospital con tal id' }

            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
            usuario: usuarioBorrado
        });
    })

})


module.exports = app;