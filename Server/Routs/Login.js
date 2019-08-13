const express = require('express')
const app = express()
const Bcrypt = require('bcrypt');
var JWT = require('jsonwebtoken');
const Usuario = require('../Models/Usuario');

app.post('/Login', (req, res) => {

    let Body = req.body;

    Usuario.findOne({ email: Body.email }, (err, UsuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!UsuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Password incorrecto' + Body.email
                }
            });
        }

        if (!Bcrypt.compareSync(req.body.password, UsuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Password incorrecto ' + Body.email
                }
            });
        }


        // console.log(process.env.SeedAuth);

        let Token = JWT.sign({
            Usuario: UsuarioBD
        }, process.env.SeedAuth, { expiresIn: process.env.EndToken });

        res.json({
            ok: true,
            Usuario: UsuarioBD,
            token: Token
        });

    });

});

module.exports = app;