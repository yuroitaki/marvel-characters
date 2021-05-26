const { apiResponse } = require('../../utils/helper/helper.utils');
const { listCharactersWrapper } = require('../../service/marvel/marvel.service');

// eslint-disable-next-line consistent-return
const listCharacters = async (req, res, next) => {
  try {
    const result = await listCharactersWrapper();
    return apiResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCharacters
};
