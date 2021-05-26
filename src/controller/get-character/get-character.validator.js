const Joi = require('joi');

module.exports = {
  name: 'getCharacter',
  description: 'Get details of a character',
  path: '/api/characters/{characterId}',
  type: 'get',
  joiSchema: {
    params: Joi.object({
      characterId: Joi.string()
        .trim()
        .regex(/^[0-9]+$/)
        .required()
    }).unknown(false)
  }
};
