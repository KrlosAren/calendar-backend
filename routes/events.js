const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validateJWT');
const {
  eventGet,
  eventGetAll,
  eventPost,
  eventPut,
  eventDelete,
} = require('../controllers/events');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { isDate } = require('../helpers/isDate');

// middlewares in router
router.use(validateJWT);

// routes
router.get('/', eventGetAll);
router.get('/:id', eventGet);
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    fieldValidators,
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de fin es obligatoria').custom(isDate),
    fieldValidators,
  ],
  eventPost
);
router.put(
  '/:id',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    fieldValidators,
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de fin es obligatoria').custom(isDate),
    fieldValidators,
  ],
  eventPut
);
router.delete('/:id', eventDelete);

module.exports = router;
