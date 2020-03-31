const Usuario = require('../entidades/usuario');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.post('/login', (request, response) => {
  let body = request.body;
  Usuario.findOne({ email: body.email }, (error, resultado) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }
    if (!resultado) {
      return response.status(400).json({
        ok: false,
        error: {
          message: '(Usuario) o contraseña incorrectos'
        }
      });
    }
    if (!bcrypt.compareSync(body.contraseña, resultado.contraseña)) {
      return response.status(400).json({
        ok: false,
        error: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      });
    }
    if (resultado.estado === false) {
      return response.status(403).json({
        ok: false,
        error: {
          message:
            'Usuario desactivado, contactese con el Centro de Atencion al Cliente: +51 980713830'
        }
      });
    }
    let token = jwt.sign(
      {
        usuario: resultado
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );
    response.json({
      ok: true,
      usuario: resultado,
      token
    });
  });
});
module.exports = app;
