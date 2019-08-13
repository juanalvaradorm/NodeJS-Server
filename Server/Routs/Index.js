const express = require('express')
const app = express()


app.use(require('./Usuario'));
app.use(require('./Login'));

module.exports = app;