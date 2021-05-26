const redis = require('redis');
const _ = require('lodash');
const { promisify } = require('util');
const { redisConfig } = require('../../config/vars');

const redisClient = redis.createClient({
  port: redisConfig.port
});

try {
  redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
  redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
} catch (error) {
  console.error('REDIS_PROMOSIFYING_METHOD_FAILED', { error });
}

/**
 * Fetch cached item from cache
 * @param {String} cacheKey
 * @returns {Object} item
 */
const fetchCachedItem = async (cacheKey) => {
  try {
    const cachedData = await redisClient.getAsync(cacheKey);
    if (_.isNil(cachedData)) {
      console.log('NO_CACHED_ITEM_FOUND');
      return false;
    }
    console.log('FETCH_CACHED_ITEM_RESPONSE', { cachedData });
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('FETCH_CACHED_ITEM_FAILED', { error });
    return false;
  }
};

/**
 * Store item in cache
 * @param {Object} item
 * @param {String} itemKey
 * @param {String} cacheKey
 * @returns {Boolean} result
 */
const cacheItem = async (item, itemKey, cacheKey) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    console.log('CACHE_ITEM', { item, itemKey, cacheKey });
    const load = {};
    load[itemKey] = item;
    await redisClient.setAsync(cacheKey, JSON.stringify(
      { ...load, timestamp: today }
    ));
    return true;
  } catch (error) {
    console.error('CACHE_ITEM_FAILED', { error });
    return false;
  }
};

module.exports = {
  fetchCachedItem,
  cacheItem
};
