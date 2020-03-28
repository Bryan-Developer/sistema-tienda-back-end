const Usuario = require('../entidades/usuario');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
app.post('/login', (request, response) => {
  response.json({
    ok: true
  });
});
module.exports = app;
