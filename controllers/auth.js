/**
 *
 * register user
 */

const { response, request } = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../helpers/jwt');

const authRegister = async (req = request, resp = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return resp.status(400).json({
        msg: 'a user already exists',
        ok: false,
      });
    }
    user = new User(req.body);

    // bcrypt
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id, user.name);

    resp.status(201).json({
      msg: 'usuario registrado',
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    resp.status(500).json({
      msg: 'por favor hablar con el administrador',
      ok: false,
    });
  }
};

const authLogin = async (req, resp) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        msg: 'a user not exists',
        ok: false,
      });
    }

    // match password

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return resp.status(400).json({
        msg: 'Datos de login incorrectos',
        ok: false,
      });
    }

    // generate JWT
    const token = await generateJWT(user.id, user.name);

    resp.status(200).json({
      msg: 'login success',
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      msg: 'por favor hablar con el administrador',
      ok: false,
    });
  }
};

const authTokenRenew = async (req, resp) => {
  const token = await generateJWT(req.uid, req.name);

  resp.json({
    ok: true,
    msg: 'refresh token',
    token,
    uid: req.uid,
    name: req.name,
  });
};

module.exports = {
  authRegister,
  authLogin,
  authTokenRenew,
};
