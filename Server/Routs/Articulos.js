const express = require('express');
const App = express();
const _ = require('underscore');

const { CheckToken } = require('../middlewares/authentication');
const { VerificaAdminRole } = require('../middlewares/authentication');

let Item = require('../Models/Items');

///==================================================
///Mostrar Todas las Articulos
///==================================================
App.get('/Items', CheckToken, (req, res) => {

    let Desde = req.query.Desde || 0;
    Desde = Number(Desde);

    let Limit = req.query.Limit || 15;
    Limit = Number(Limit);

    Item.find({ Avaliable: true }, 'Name UnitPrice Description Avaliable').populate('UserIdAdd', 'name email').populate('CategoryId', 'Name Status').skip(Desde).limit(Limit).exec((err, ItemsBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ItemsBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No hay articulos en la BD'
                }
            });
        }

        Item.estimatedDocumentCount({ Avaliable: true }, (err, Count) => {
            res.json({
                ok: true,
                ItemsBD,
                Total: Count
            });
        });
    });

});


///==================================================
///Mostrar Articulos por ID
///==================================================
App.get('/Items/:Id', CheckToken, (req, res) => {
    let Id = req.params.Id;
    Item.findById(Id, (err, ItemsBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ItemsBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            ItemsBD
        });

    });
});

///==================================================
///Buscar Productos
///==================================================
App.get('/Items/Buscar/:Searching', CheckToken, (req, res) => {

    let Searching = req.params.Searching;

    let RegEx = new RegExp(Searching, 'i');

    Item.find({ Name: RegEx }).populate('CategoryId', 'Name Status')
        .exec((err, ItemsBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ItemsBD
            });

        });
});




///==================================================
///Alta de Articulos
///==================================================
App.post('/Items', CheckToken, (req, res) => {
    let Body = req.body;
    let Items = new Item({
        Name: Body.Name,
        Description: Body.Description,
        UnitPrice: Body.UnitPrice,
        Avaliable: true,
        CategoryId: Body.CategoryId,
        UserIdAdd: req.Usuario._id,
        DateAdd: Date.now()
    });

    Items.save((err, ItemsBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ItemsBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ItemsBD
        });

    });
});


///==================================================
///Modificación de Articulos
///==================================================
App.put('/Items/:Id', [CheckToken], (req, res) => {
    let Id = req.params.Id;
    let Body = _.pick(req.body, ['Name', 'Description', 'UnitPrice', 'CategoryId', 'Avaliable']);
    Body.DateModify = Date.now();
    Body.UserIdModify = req.Usuario._id;
    Item.findOneAndUpdate(Id, Body, { new: true, runValidators: true }, (err, ItemsBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ItemsBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            ItemsBD
        });

    });
});


///==================================================
///Borrar Articulos
///==================================================
App.delete('/Items/:Id', [CheckToken, VerificaAdminRole], (req, res) => {
    let Id = req.params.Id;

    let CambiaEstado = {
        status: false,
        UserIdDelete: req.Usuario._id,
        DateDelete: Date.now()
    };

    //Categoria.deleteOne({ _id: Id }, (err, CategoryBorrada) => {
    Item.findByIdAndRemove(Id, (err, ItemsBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no exciste'
                }
            });
        }

        if (!ItemsBorrada) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ItemsBorrada
        });

    })
});


module.exports = App;