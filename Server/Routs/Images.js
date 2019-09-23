const Express = require('express');
const FS = require('fs');
const App = Express();
const Path = require('path');
const { CheckTokenIMG } = require('../middlewares/authentication');

App.get('/DownloadImage/:Type/:Img', [CheckTokenIMG], (req, res) => {


    let StrType = '';
    let Type = req.params.Type;
    let Img = req.params.Img;

    if (Type === 1) {
        StrType = 'User';
    } else {
        StrType = 'Items';
    }

    //let PathUrl = `./Uploads/${StrType}/${Img}`;
    let PathUrl = Path.resolve(__dirname, `../../Uploads/${StrType}/${Img}`);

    let NoImg = Path.resolve(__dirname, '../Assets/ImgFija.png');
    if (!FS.existsSync(PathUrl)) {
        res.sendFile(NoImg);
    } else {
        res.sendFile(PathUrl);
    }


});



module.exports = App;