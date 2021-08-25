const { Router } = require('express');
const {
  authRegister,
  authTokenRenew,
  authLogin,
} = require('../controllers/auth');
const router = Router();

const { check } = require('express-validator');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { validateJWT } = require('../middlewares/validateJWT');

// routes
router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El debe de ser mayor a 6 caracteres').isLength({
      min: 6,
    }),
    fieldValidators,
  ],
  authRegister
);

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail().not().isEmpty(),
    check('password', 'El password es obligatorio')
      .isLength({
        min: 6,
      })
      .not()
      .isEmpty(),
    fieldValidators,
  ],
  authLogin
);

router.get('/renew', validateJWT, authTokenRenew);

module.exports = router;
