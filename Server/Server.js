require('./Config/Config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/Usuario', function(req, res) {
    res.json('Get Usuario')
});

app.post('/Usuario', (req, res) => {
    let Body = req.body;

    if (Body.Nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Información faltante'
        });
    } else {
        res.json({
            Persona: Body
        });
    }

});

app.put('/Usuario/:Id', (req, res) => {

    let Id = req.params.Id;

    res.json({
        Id
    });
});

app.delete('/Usuario', (req, res) => {
    res.json('Delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})