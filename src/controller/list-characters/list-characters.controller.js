const { apiResponse } = require('../../utils/helper/helper.utils');
const { listCharacters: listCharactersService } = require('../../service/marvel/marvel.service');

// eslint-disable-next-line consistent-return
const listCharacters = async (req, res, next) => {
  try {
    const result = await listCharactersService();
    return apiResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCharacters
};
