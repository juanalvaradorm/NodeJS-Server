const express = require('express')
const app = express()
const Bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../Models/Usuario');
const { CheckToken } = require('../middlewares/authentication');
const { VerificaAdminRole } = require('../middlewares/authentication');

app.get('/Usuario', CheckToken, function(req, res) {


    // return res.json({
    //     usuario: req.Usuario,
    //     nombre: req.Usuario.name,
    //     email: req.Usuario.email
    // });

    let Desde = req.query.Desde || 0;
    Desde = Number(Desde);

    let Limit = req.query.Limit || 5;
    Limit = Number(Limit);

    Usuario.find({ status: true }, 'name edad email role status google').skip(Desde).limit(Limit).exec((err, UsuariosBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.estimatedDocumentCount({ status: true }, (err, Count) => {
            res.json({
                ok: true,
                usuarios: UsuariosBD,
                Total: Count
            });
        });

    });
});

app.post('/Usuario', [CheckToken], (req, res) => {
    let Body = req.body;

    let usuario = new Usuario({
        name: Body.name,
        email: Body.email,
        password: Bcrypt.hashSync(Body.password, 10),
        role: Body.role,
        edad: Body.edad
    });

    usuario.save((err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // UsuarioDB.password = null;

        res.json({
            ok: true,
            usuario: UsuarioDB
        });

    });

});

app.put('/Usuario/:Id', [CheckToken, VerificaAdminRole], (req, res) => {

    let Id = req.params.Id;
    let Body = _.pick(req.body, ['name', 'edad', 'email', 'img', 'role', 'status']);

    Usuario.findByIdAndUpdate(Id, Body, { new: true, runValidators: true }, (err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: UsuarioDB
        });
    });

});

app.delete('/Usuario/:Id', [CheckToken, VerificaAdminRole], (req, res) => {
    let Id = req.params.Id;

    //Usuario.findByIdAndRemove(Id, (err, UsuarioBorrado) => { Borrar de la BD

    let CambiaEstado = {
        status: false
    };

    Usuario.findByIdAndUpdate(Id, CambiaEstado, { new: true }, (err, UsuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!UsuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario No encontrado'
                }

            });
        }

        res.json({
            ok: true,
            Usuario: UsuarioBorrado
        });
    });
    //res.json('Delete Usuario');
});

module.exports = app;