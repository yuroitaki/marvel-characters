const md5 = require('md5');
const httpStatus = require('http-status');

/**
 * Generate md5 hash
 * @param {String} data
 * @returns {String} hash
 */
const md5Hash = data => md5(data);

/**
 * Generate standard API response object
 * @param {Response} res
 * @param {Object} response
 * @param {Number} status
 * @returns {Object} response
 */
const apiResponse = (res, response, status = httpStatus.OK) => {
  res.status(status);
  return res.json(response);
};

/**
 * To check if there is null or undefined item in the array
 * @param {Array} arr
 * @returns {Boolean} result
 */
const hasNullOrUndefinedItem = arr => arr.length !== arr.filter(
  item => item !== undefined && item !== null
).length;

module.exports = {
  md5Hash,
  apiResponse,
  hasNullOrUndefinedItem
};
