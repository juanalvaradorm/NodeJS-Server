const express = require('express')
const app = express()
const Bcrypt = require('bcrypt');
var JWT = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

///==================================================
///Configuración de Google
///==================================================

async function verify(Token) {
    const ticket = await client.verifyIdToken({
        idToken: Token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    //console.log(1);
    const payload = ticket.getPayload();
    // //const userid = payload['sub'];
    // // If request specified a G Suite domain:
    // //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        google: true
    }

}

app.post('/Google', async(req, res) => {
    let Token = req.body.idtoken;

    let googleUser = await verify(Token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });


    Usuario.findOne({ email: googleUser.email }, (err, UsuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };



        if (UsuarioBD) {

            if (UsuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {

                let token = JWT.sign({
                    usuario: UsuarioBD
                }, process.env.SeedAuth, { expiresIn: process.env.EndToken });


                return res.json({
                    ok: true,
                    usuario: UsuarioBD,
                    token,
                });

            }

            // if (UsuarioBD.google === false) {
            //     return res.status(400).json({
            //         ok: false,
            //         err: {
            //             message: 'Favor de autenticarse con usuario y password'
            //         }
            //     });
            // };


            // let TokenN = JWT.sign({
            //     Usuario: UsuarioBD
            // }, process.env.SeedAuth, { expiresIn: process.env.EndToken });

            // return res.json({
            //     ok: true,
            //     Usuario: UsuarioBD,
            //     token: TokenN
            // });

        } else if (!UsuarioBD) {
            // Si el usuario no existe en nuestra BD
            let Usuarios = new Usuario();
            Usuarios.name = googleUser.nombre;
            Usuarios.email = googleUser.email;
            Usuarios.google = true;
            Usuarios.password = '1qazxsw2$';
            Usuarios.edad = 47;

            Usuarios.save((err, UsuarioBD) => {
                console.log(err);
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                }

                let Token = JWT.sign({
                    Usuario: UsuarioBD
                }, process.env.SeedAuth, { expiresIn: process.env.EndToken });

                return res.json({
                    ok: true,
                    Usuario: UsuarioBD,
                    token: Token
                });
            });

        };
    });
    // res.json({
    //     usuario: googleUser
    // })
});

module.exports = app;