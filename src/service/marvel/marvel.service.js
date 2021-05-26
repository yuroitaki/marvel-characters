const _ = require('lodash');
const { getRequest } = require('../https/https.service');
const { md5Hash, hasNullOrUndefinedItem } = require('../../utils/helper/helper.utils');
const { marvelConfig } = require('../../config/vars');

const constructAuthentication = () => {
  const now = Date.now();
  const hash = md5Hash(`${now}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
  return `ts=${now}&apikey=${marvelConfig.publicKey}&hash=${hash}`;
};

const processListCharacters = (data) => {
  try {
    const processedData = {
      count: data.data.count,
      total: data.data.total
    };
    const characterIds = data.data.results.map(character => character.id);
    if (hasNullOrUndefinedItem(Object.values(processedData))) {
      throw new Error('INVALID_RESPONSE_LIST_MARVEL_CHARACTERS');
    }
    if (hasNullOrUndefinedItem(characterIds)) {
      throw new Error('INVALID_RESPONSE_LIST_MARVEL_CHARACTERS');
    }
    return { characters: characterIds, ...processedData };
  } catch (error) {
    console.error('INVALID_RESPONSE_LIST_MARVEL_CHARACTERS', { data });
    throw error;
  }
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
    return processListCharacters(data);
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
