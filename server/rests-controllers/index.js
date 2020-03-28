const express = require('express');
const app = express();
app.use(require('./loginRestController'));
app.use(require('./usuarioRestController'));
module.exports = app;
