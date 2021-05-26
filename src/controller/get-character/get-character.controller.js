const { apiResponse } = require('../../utils/helper/helper.utils');
const { getCharacter: getCharacterService } = require('../../service/marvel/marvel.service');

// eslint-disable-next-line consistent-return
const getCharacter = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const result = await getCharacterService(characterId);
    return apiResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCharacter
};
