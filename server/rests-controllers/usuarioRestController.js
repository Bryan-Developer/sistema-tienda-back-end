const Usuario = require('../entidades/usuario');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
app.get('/usuario', (request, response) => {
  let desde = request.query.desde || 0;
  desde = Number(desde);
  let limite = request.query.limite || 5;
  limite = Number(limite);
  Usuario.find({ estado: true }, 'nombres apellidos email dni')
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          error
        });
      }
      Usuario.countDocuments({ estado: true }, (error, conteo) => {
        if (error) {
          return response.status(400).json({
            ok: false,
            error
          });
        }
        response.json({
          ok: true,
          cuantos: conteo,
          usuarios
        });
      });
    });
});
app.get('/usuario/:id', (request, response) => {
  let id = request.params.id;
  Usuario.findById(id, (error, usuario) => {
    if (error) {
      return response.status(404).json({ ok: false, error });
    }
    response.json({
      ok: true,
      usuario
    });
  });
});
app.post('/usuario', (request, response) => {
  let body = request.body;
  let usuario = new Usuario({
    dni: body.dni,
    nombres: body.nombres,
    apellidos: body.apellidos,
    email: body.email,
    contraseña: bcrypt.hashSync(body.contraseña, 10)
  });
  usuario.save((error, usuarioRegistrado) => {
    if (error) {
      return response.status(400).json({
        ok: false,
        error
      });
    }
    response.json({ ok: true, usuario: usuarioRegistrado });
  });
});
app.put('/usuario/:id', (request, response) => {
  let id = request.params.id;
  let body = _.pick(request.body, [
    'dni',
    'estado',
    'nombres',
    'apellidos',
    'email'
  ]);
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: 'query' },
    (error, usuarioDB) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          error
        });
      }
      response.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  );
});
app.delete('/usuario/:id', (request, response) => {
  let id = request.params.id;
  let estadoO = { estado: false };
  Usuario.findByIdAndUpdate(id, estadoO, { new: true }, (error, resultado) => {
    if (error) return response.status(400).json({ ok: false, error });
    if (!resultado) {
      return response
        .status(400)
        .json({ ok: false, error: { message: 'Usuario no encontrado' } });
    }
    response.json({
      ok: true,
      usuario: resultado
    });
  });
});
module.exports = app;
