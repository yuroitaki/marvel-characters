const express = require('express');

const router = express.Router();
const listCharactersRoute = require('./list-characters');

router.use('/characters', listCharactersRoute);

module.exports = router;
