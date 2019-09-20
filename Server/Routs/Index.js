const express = require('express')
const app = express()


app.use(require('./Usuario'));
app.use(require('./Login'));
app.use(require('./Categorias'));
app.use(require('./Articulos'));
app.use(require('./Upload'));

module.exports = app;