var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos  de colecciones
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es valida',
            errors: { message: 'tipo de coleccion no es valida' }
        })

    }

    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombrecortado = archivo.name.split('.');
    var extensionArchivo = nombrecortado[nombrecortado.length - 1];

    // Extensiones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.lastIndexOf(extensionArchivo) < 0) {
        resp.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Debe de Seleccionar una inagen con las extensiones: ' + extensionesValidas }
        })
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id} - ${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover Archivo de un temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            resp.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        }
        subirPorTipo(tipo, id, nombreArchivo, res)

    })




});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo == 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe Elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, () => {});
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':-D'

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });
            })

        });


    }

    if (tipo == 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // si existe Elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, () => {});
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del medico actualizado',
                    medico: medicoActualizado
                });
            })

        });
    }

    if (tipo == 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe Elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, () => {});
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {



                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del medico actualizado',
                    hospital: hospitalActualizado
                });
            })

        });
    }

}

module.exports = app;