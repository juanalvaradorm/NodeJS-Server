const Express = require('express');
const FileUpload = require('express-fileupload');
const App = Express();
const Usuario = require('../Models/Usuario');
const FS = require('fs');
const Path = require('path');
const Item = require('../Models/Items');

// default options
App.use(FileUpload());

App.put('/Upload/:Type/:Id', function(req, res) {

    let StrType = '';
    let Type = req.params.Type;
    let Id = req.params.Id;
    if (Type === 1) {
        StrType = 'User';
    } else {
        StrType = 'Items';
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Seleccione almenos un archivo'
            }
        });;
    }

    //Validar Tipo 1 = Usuarios, 2 = Items

    let ValidateTyps = ['1', '2'];

    if (ValidateTyps.lastIndexOf(Type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        });;
    }

    let UploadFile = req.files.UploadFile;

    let FileNameShort = UploadFile.name.split('.');
    let FileExtension = FileNameShort[FileNameShort.length - 1];

    //Extenciones permitidas

    let Extensions_Valid = ['png', 'jpg', 'gif', 'jpge']

    if (Extensions_Valid.lastIndexOf(FileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extención no valida'
            }
        });;
    }

    //Renombrar archivo
    let FileName = `${Id}-${ new Date().getMilliseconds() }.${FileExtension}`;

    UploadFile.mv(`./Uploads/${StrType}/${FileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (Type === "1") {
            ImageUser(Id, res, FileName);
        } else {
            ImageItems(Id, res, FileName);
        }

        // res.json({
        //     ok: true,
        //     message: 'Archivo cargado correctamente'
        // });
    });

});

function ImageUser(Id, res, FileName) {
    Usuario.findById(Id, (err, UserBD) => {

        if (err) {
            DeleteFile(FileName, 'User')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!UserBD) {
            DeleteFile(FileName, 'User')
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario No encontrado'
                }

            });
        }

        // let PathUrl = Path.resolve(__dirname, `../../Uploads/User/${UserBD.img}`);

        // if (FS.existsSync(PathUrl)) {
        //     FS.unlinkSync(PathUrl);
        // }

        DeleteFile(UserBD.img, 'User')

        UserBD.img = FileName;
        UserBD.save((err, UserModify) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                UserModify,
                img: FileName
            });

        });
    });
}

function ImageItems(Id, res, FileName) {
    Item.findById(Id, (err, ItemsBD) => {

        if (err) {
            DeleteFile(FileName, 'Items')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ItemsBD) {
            DeleteFile(FileName, 'Items')
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Artículo No encontrado'
                }

            });
        }

        DeleteFile(ItemsBD.img, 'Items')

        ItemsBD.img = FileName;
        ItemsBD.save((err, ItemModify) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                ItemModify,
                img: FileName
            });

        });
    });
}

function DeleteFile(Img, Type) {
    let PathUrl = Path.resolve(__dirname, `../../Uploads/${Type}/${Img}`);

    if (FS.existsSync(PathUrl)) {
        FS.unlinkSync(PathUrl);
    }
}

module.exports = App;