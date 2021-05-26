const _ = require('lodash');
const { getRequest } = require('../https/https.service');
const { md5Hash } = require('../../utils/helper/helper.utils');
const { marvelConfig } = require('../../config/vars');

const constructAuthentication = () => {
  const now = Date.now();
  const hash = md5Hash(`${now}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
  return `ts=${now}&apikey=${marvelConfig.publicKey}&hash=${hash}`;
};

const listCharacters = async (offset = 0, modifiedSince = null, limit = 100) => {
  const authString = constructAuthentication();
  let requestUrl = `${marvelConfig.domain}${marvelConfig.charactersEndpoint}?${authString}`;
  requestUrl += `&offset=${offset}&limit=${limit}`;
  if (!_.isNil(modifiedSince)) {
    requestUrl += `&modifiedSince=${modifiedSince}`;
  }
  try {
    console.log('LIST_MARVEL_CHARACTERS_REQUEST', {
      requestUrl,
      offset,
      modifiedSince,
      limit
    });
    const { data } = await getRequest(requestUrl);
    console.log('LIST_MARVEL_CHARACTERS_RESPONSE', data);
    return data;
  } catch (error) {
    console.error('LIST_MARVEL_CHARACTERS_FAILED', {
      requestUrl,
      offset,
      modifiedSince,
      limit
    });
    throw error;
  }
};

module.exports = {
  listCharacters
};
