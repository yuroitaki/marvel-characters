const _ = require('lodash');
const { getRequest } = require('../https/https.service');
const { md5Hash, hasNullOrUndefinedItem } = require('../../utils/helper/helper.utils');
const { marvelConfig, redisConfig } = require('../../config/vars');
const { fetchCachedItem, cacheItem } = require('../redis/redis.service');

/**
 * Construct the auth url parameters for Marvel's API
 * @returns {String} authString
 */
const constructAuthentication = () => {
  const now = Date.now();
  const hash = md5Hash(`${now}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
  return `ts=${now}&apikey=${marvelConfig.publicKey}&hash=${hash}`;
};

/**
 * Post-processing of response data returned from listCharacters
 * @param {Object} data
 * @returns {Object} processedData
 */
const processListCharacters = (data) => {
  try {
    const processedData = {
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

/**
 * Call Marvel's characters endpoint to fetch list of character ids
 * @param {Number} offset pagination index
 * @param {String} modifiedSince last modified date
 * @param {Number} limit no of result
 * @returns {Object} processedData
 */
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

/**
 * Compute the list of offsets to be used for subsequent calls given total no of results
 * @param {Number} total
 * @returns {Array} offsets
 */
const calculateOffsets = (total) => {
  const offsets = [];

  // Case 1: All results fetched in first call - no need to call anymore
  if (total < marvelConfig.characterLimit) {
    return offsets;
  }
  let noBatch = _.floor(total / marvelConfig.characterLimit);
  const lastBatchSize = total % marvelConfig.characterLimit;
  // Case 2: When total is multiple of characterLimit (100)
  // e.g. when total = 200, noBatch = 2, it should be deducted by 1
  // as only 1 more call/offset is needed
  if (lastBatchSize === 0) {
    noBatch -= 1;
  }
  let offset = marvelConfig.characterLimit;
  // Case 3: When total is more than characterLimit (100)
  // e.g. when total = 255, we will append 100, 200 into offsets
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < noBatch; i++) {
    offsets.push(offset);
    offset += marvelConfig.characterLimit;
  }
  return offsets;
};

/**
 * Iterator to make concurrent paginated calls to fetch all character ids
 * @param {String} timestamp cached date
 * @returns {Array} characters
 */
const listCharactersIterator = async (timestamp = null) => {
  // get the total from the first API call
  const { total, characters: newCharacters } = await listCharacters(0, timestamp);
  // calculate all subsequent offsets required
  const offsets = calculateOffsets(total);
  // make concurrent calls to each offset
  const newChars = await Promise.all(
    offsets.map(async (offset) => {
      const { characters: chars } = await listCharacters(offset, timestamp);
      return chars;
    })
  );
  return _.flatten(_.concat(newCharacters, newChars));
};

/**
 * Wrapper to fetch all character ids from cache and/or Marvel API
 * @returns {Array} characters
 */
const listCharactersWrapper = async () => {
  let characters;
  try {
    const { timestamp, characters: chars } = await fetchCachedItem(redisConfig.cacheKey);
    // Case 1: when there is cached item
    if (!_.isNil(timestamp)) {
      const newChars = await listCharactersIterator(timestamp);
      // combine the additional characters with cached characters
      characters = _.union(chars, newChars);
      // Case 2: no cached item
    } else {
      characters = await listCharactersIterator();
    }
    await cacheItem(characters, 'characters', redisConfig.cacheKey);
    return characters;
  } catch (error) {
    // if only either caching or API operation fails, still return to client
    //  as long as characters have values
    if (!_.isEmpty(characters)) {
      return characters;
    }
    throw error;
  }
};

/**
 * Post-processing of get character API response
 * @param {Object} data
 * @returns {Object} processedData
 */
const processGetCharacter = (data) => {
  try {
    const character = data.data.results[0];
    const processedData = {
      id: character.id,
      name: character.name,
      description: character.description
    };
    if (hasNullOrUndefinedItem(Object.values(processedData))) {
      throw new Error('INVALID_RESPONSE_GET_MARVEL_CHARACTERS');
    }
    return processedData;
  } catch (error) {
    console.error('INVALID_RESPONSE_GET_MARVEL_CHARACTERS', { data });
    throw error;
  }
};

/**
 * Call Marvel API to fetch details of a character
 * @param {Number} characterId
 * @returns {Object} processedData
 */
const getCharacter = async (characterId) => {
  const authString = constructAuthentication();
  let requestUrl = `${marvelConfig.domain}${marvelConfig.charactersEndpoint}`;
  requestUrl += `/${characterId}?${authString}`;
  try {
    console.log('GET_MARVEL_CHARACTER_REQUEST', { requestUrl });
    const { data } = await getRequest(requestUrl);
    console.log('GET_MARVEL_CHARACTER_RESPONSE', data);
    return processGetCharacter(data);
  } catch (error) {
    console.error('GET_MARVEL_CHARACTER_FAILED', { error, characterId });
    throw error;
  }
};

module.exports = {
  listCharactersWrapper,
  getCharacter
};
