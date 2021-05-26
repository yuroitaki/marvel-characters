const express = require('express');

const router = express.Router();
const listCharactersRoute = require('./list-characters');
const getCharacterRoute = require('./get-character');

router.use('/characters', listCharactersRoute);
router.use('/characters', getCharacterRoute);

module.exports = router;
