const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let rolesValidos = {
  values: ['ROLE_ADMINISTRADOR', 'ROLE_USUARIO'],
  message: '{VALUE} no es un role valido'
};
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
  },
  role: {
    type: String,
    default: 'ROLE_USUARIO',
    enum: rolesValidos
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
