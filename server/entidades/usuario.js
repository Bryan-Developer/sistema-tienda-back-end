const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
  dni: {
    type: String,
    unique: true,
    required: [true, 'El DNI es obligatorio']
  },
  nombres: {
    type: String,
    required: [true, 'Ingrese sus nombres']
  },
  apellidos: {
    type: String,
    required: [true, 'Ingrese sus apellidos']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Ingrese su email']
  },
  contraseña: {
    type: String,
    required: [true, 'Ingrese su contraseña']
  },
  estado: {
    type: Boolean,
    default: true,
    required: false
  }
});
usuarioSchema.methods.toJSON = function() {
  let usuario = this;
  let usuarioO = usuario.toObject();
  delete usuarioO.estado;
  delete usuarioO.contraseña;
  return usuarioO;
};
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);
