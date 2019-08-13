require('./Config/Config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(require('./Routs/Usuario'));
// app.use(require('./Routs/Login'));
app.use(require('./Routs/Index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLine');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})


//https://mlab.com/login/
//https://cloud.mongodb.com/v2/5d4b0002d5ec13757afbb4c0#security/database/users
//https://gist.github.com/klerith/44ee5349fa13699d9c5f1e82b3be040e
//https://www.npmjs.com/package/jsonwebtoken