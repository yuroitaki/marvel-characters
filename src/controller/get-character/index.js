const express = require('express');
const { validate } = require('express-validation');
const controller = require('./get-character.controller');
const validator = require('./get-character.validator');

const router = express.Router();

router.route('/:characterId').get(
  validate(validator.joiSchema),
  controller.getCharacter
);

module.exports = router;
