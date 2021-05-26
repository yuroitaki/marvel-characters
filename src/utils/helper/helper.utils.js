const md5 = require('md5');
const httpStatus = require('http-status');

const md5Hash = data => md5(data);

const apiResponse = (res, response, status = httpStatus.OK) => res.status(status).json(response);

module.exports = {
  md5Hash,
  apiResponse
};
