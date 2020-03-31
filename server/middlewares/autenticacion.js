const jwt = require('jsonwebtoken');
let verificaToken = (request, response, next) => {
  let token = request.get('token');
  jwt.verify(token, process.env.SEED, (error, resultado) => {
    if (error) {
      return response.status(401).json({
        ok: false,
        error
      });
    }
    request.usuario = resultado.usuario;
    next();
  });
};
let verificaRole = (request, response, next) => {
  let usuario = request.usuario;
  if (usuario.role === 'ROLE_ADMINISTRADOR') {
    next();
  } else {
    return response.status(403).json({
      ok: false,
      error: {
        message: 'El usuario no tiene privilegios para hacer esta operacion'
      }
    });
  }
};
module.exports = { verificaToken, verificaRole };
