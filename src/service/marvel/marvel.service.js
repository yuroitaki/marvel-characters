const _ = require('lodash');
const { getRequest } = require('../https/https.service');
const { md5Hash, hasNullOrUndefinedItem } = require('../../utils/helper/helper.utils');
const { marvelConfig, redisConfig } = require('../../config/vars');
const { fetchCachedItem, cacheItem } = require('../redis/redis.service');

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

const calculateOffsets = (total) => {
  const offsets = [];

  if (total < marvelConfig.characterLimit) {
    return offsets;
  }
  let noBatch = _.floor(total / marvelConfig.characterLimit);
  const lastBatchSize = total % marvelConfig.characterLimit;
  if (lastBatchSize === 0) {
    noBatch -= 1;
  }
  let offset = marvelConfig.characterLimit;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < noBatch; i++) {
    offsets.push(offset);
    offset += marvelConfig.characterLimit;
  }
  return offsets;
};

const listCharactersIterator = async (timestamp = null) => {
  const { total, characters: newCharacters } = await listCharacters(0, timestamp);
  const offsets = calculateOffsets(total);
  const newChars = await Promise.all(
    offsets.map(async (offset) => {
      const { characters: chars } = await listCharacters(offset, timestamp);
      return chars;
    })
  );
  return _.flatten(_.concat(newCharacters, newChars));
};

const listCharactersWrapper = async () => {
  let characters;
  try {
    const { timestamp, characters: chars } = await fetchCachedItem(redisConfig.cacheKey);
    if (!_.isNil(timestamp)) {
      const newChars = await listCharactersIterator(timestamp);
      characters = _.union(chars, newChars);
    } else {
      characters = await listCharactersIterator();
    }
    await cacheItem(characters, 'characters', redisConfig.cacheKey);
    return characters;
  } catch (error) {
    if (!_.isEmpty(characters)) {
      return characters;
    }
    throw error;
  }
};

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
