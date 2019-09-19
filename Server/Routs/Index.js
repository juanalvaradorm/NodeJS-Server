const express = require('express')
const app = express()


app.use(require('./Usuario'));
app.use(require('./Login'));
app.use(require('./Categorias'));
app.use(require('./Articulos'));

module.exports = app;