const md5 = require('md5');
const httpStatus = require('http-status');

const md5Hash = data => md5(data);

const apiResponse = (res, response, status = httpStatus.OK) => {
  res.status(status);
  return res.json(response);
};

const hasNullOrUndefinedItem = arr => arr.length !== arr.filter(
  item => item !== undefined && item !== null
).length;

module.exports = {
  md5Hash,
  apiResponse,
  hasNullOrUndefinedItem
};
