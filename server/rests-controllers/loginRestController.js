const Usuario = require('../entidades/usuario');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);
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
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENTID
  });
  const payload = ticket.getPayload();
  return {
    nombre: payload.name,
    email: payload.email,
    google: true
  };
}
app.post('/google', async (request, response) => {
  let token = request.body.idtoken;
  let googleUser = await verify(token).catch(error => {
    return response.status(403).json({ ok: false, error });
  });
  Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return response.status(400).json({
          ok: false,
          error: {
            message: 'Debe de usar su cuenta y contraseña'
          }
        });
      } else {
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });
        return response.json({ ok: true, usuario: usuarioDB, token });
      }
    } else {
      let usuario = new Usuario();
      usuario.nombres = googleUser.nombre;
      usuario.apellidos = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.google = googleUser.google;
      let dni = Math.round(Math.random() * 100000000).toString() + '00000000';
      usuario.dni = dni.slice(-16, 8);
      usuario.contraseña = ':)';
      usuario.save((error, usuarioSave) => {
        if (error) {
          return response.status(500).json({
            ok: false,
            error
          });
        }
        let token = jwt.sign({ usuario: usuarioSave }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });
        return response.json({ ok: true, usuario: usuarioSave, token });
      });
    }
  });
});
module.exports = app;
