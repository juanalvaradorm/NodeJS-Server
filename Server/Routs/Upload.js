const Express = require('express');
const FileUpload = require('express-fileupload');
const App = Express();

// default options
App.use(FileUpload());

App.put('/Upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Seleccione almenos un archivo'
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

    UploadFile.mv(`./Uploads/${UploadFile.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Archivo cargado correctamente'
        });
    });

});

module.exports = App;