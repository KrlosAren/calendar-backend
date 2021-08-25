const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req = request, resp = response, next) => {
  /// x-torkn
  const token = req.header('x-token');

  if (!token) {
    return resp.status(401).json({
      ok: false,
      msg: 'No hay un token en la peticion',
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_KEY);

    req.uid = uid;
    req.name = name;
  } catch (error) {
    return resp.status(401).json({
      ok: false,
      msg: 'Token is not valid.',
    });
  }

  next();
};
module.exports = {
  validateJWT,
};
