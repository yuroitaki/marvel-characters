const { apiResponse } = require('../../utils/helper/helper.utils');
const { listCharacters: listCharactersService } = require('../../service/marvel/marvel.service');

const listCharacters = async (req, res, next) => {
  const result = await listCharactersService();
  return apiResponse(res, result);
};

module.exports = {
  listCharacters
};
