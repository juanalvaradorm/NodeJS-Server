const express = require('express');
const App = express();
let { CheckToken } = require('../middlewares/authentication');
const { VerificaAdminRole } = require('../middlewares/authentication');
let Categoria = require('../Models/Category');
let Item = require('../Models/Items');
let Articulo = require('../Models/Items');
const _ = require('underscore');

///==================================================
///Mostrar Todas las categorias
///==================================================
App.get('/Categorias', CheckToken, (req, res) => {

    let Desde = req.query.Desde || 0;
    Desde = Number(Desde);

    let Limit = req.query.Limit || 15;
    Limit = Number(Limit);

    Categoria.find({ Status: true }, 'Name Status').populate('UserAddId', 'name email').skip(Desde).limit(Limit).exec((err, CategoryBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Categoria.estimatedDocumentCount({ Status: true }, (err, Count) => {
            res.json({
                ok: true,
                CategoryBD,
                Total: Count
            });
        });
    });
});

///==================================================
///Mostrar categoria por ID
///==================================================
App.get('/Categorias/:Id', CheckToken, (req, res) => {
    let Id = req.params.Id;
    Categoria.findById(Id, (err, CategoryBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!CategoryBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            CategoryBD
        });

    });
})

///==================================================
///Crear categoria
///==================================================
App.post('/Categorias', CheckToken, (req, res) => {
    let Body = req.body;
    //console.log(Date.now());
    let Category = new Categoria({
        Name: Body.Name,
        Status: true,
        UserAdd: req.Usuario._id,
        DateAdd: Date.now()
    });
    Category.save((err, CategoryBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!CategoryBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            CategoryBD
        });

    });

});


///==================================================
///Modificar categoria
///==================================================
App.put('/Categoria/:Id', [CheckToken], (req, res) => {
    let Id = req.params.Id;
    let Body = _.pick(req.body, ['Name', 'Status']);
    Body.UserModify = req.Usuario._id;
    Body.DateModify = Date.now();

    Categoria.findByIdAndUpdate(Id, Body, { new: true, runValidators: true }, (err, CategoryBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!CategoryBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            CategoryBD
        });

    });
});


///==================================================
///Elimina categoria
///==================================================
App.delete('/Categoria/:Id', [CheckToken, VerificaAdminRole], (req, res) => {

    let Id = req.params.Id;

    let CambiaEstado = {
        status: false
    };

    Categoria.findById(Id, (err, CategoryBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!CategoryBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }

        Item.count({ CategoryId: CategoryBD.CategoryId }, (err, Count) => {
            if (Count === 0) {
                Categoria.findByIdAndRemove(Id, (err, CategoryBorrada) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'Id no exciste'
                            }
                        });
                    }

                    if (!CategoryBD) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        CategoryBorrada
                    });

                });
            }

            Categoria.findByIdAndUpdate(Id, CambiaEstado, { new: true }, (err, CategoryBorrada) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if (!CategoryBorrada) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Usuario No encontrado'
                        }

                    });
                }

                return res.json({
                    ok: true,
                    CategoryBorrada
                });
            });

        });


    });


    //Categoria.deleteOne({ _id: Id }, (err, CategoryBorrada) => {


    // Categoria.findByIdAndUpdate(Id, CambiaEstado, { new: true }, (err, CategoryBorrada) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!CategoryBorrada) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: 'Usuario No encontrado'
    //             }

    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         CategoryBorrada
    //     });
    // });


});





// App.delete('/Categoria/:Id', [CheckToken, VerificaAdminRole], (req, res) => {

//     let Id = req.params.Id;

//     let CambiaEstado = {
//         status: false
//     };

//     //Categoria.deleteOne({ _id: Id }, (err, CategoryBorrada) => {
//     Categoria.findByIdAndRemove(Id, (err, CategoryBorrada) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Id no exciste'
//                 }
//             });
//         }

//         if (!CategoryBD) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }


//         res.json({
//             ok: true,
//             CategoryBorrada
//         });

//     })

//     // Categoria.findByIdAndUpdate(Id, CambiaEstado, { new: true }, (err, CategoryBorrada) => {
//     //     if (err) {
//     //         return res.status(400).json({
//     //             ok: false,
//     //             err
//     //         });
//     //     }

//     //     if (!CategoryBorrada) {
//     //         return res.status(400).json({
//     //             ok: false,
//     //             error: {
//     //                 message: 'Usuario No encontrado'
//     //             }

//     //         });
//     //     }

//     //     res.json({
//     //         ok: true,
//     //         CategoryBorrada
//     //     });
//     // });


// });


module.exports = App;