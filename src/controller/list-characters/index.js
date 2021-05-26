const express = require('express');
const controller = require('./list-characters.controller');

const router = express.Router();

router.route('/').get(controller.listCharacters);

module.exports = router;
