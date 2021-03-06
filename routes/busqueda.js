var express = require('express');

var app = express();
var Hospital = require('../models/hospital')
var Usuario = require('../models/usuario')
var Medico = require('../models/medico')


//Busqueda por coleccion
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son : usuario, medico, hospitales',
                error: { message: 'Tipo de tabla no valida' }
            });
    }
    promesa.then(data => {
            res.status(200).json({
                ok: true,
                [tabla]: data
            });
        }

    )


})


// busqueda general
app.get('/todo/:busqueda', (req, resp, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            resp.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });
});



function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar Hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });

    })



}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });

    })



}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Erroral argar los usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })


    })



}
module.exports = app;