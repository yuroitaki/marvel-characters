const axios = require('axios');
const { https } = require('../../config/vars');

/**
 * Axios method to make GET request
 * @param {String} url
 * @param {Object} headers
 * @param {Number} timeout
 * @returns {Object} result
 */
const getRequest = async (url, headers, timeout = https.timeout) => {
  const method = 'GET';
  try {
    const result = await axios.request({
      method,
      url,
      headers,
      timeout
    });
    console.log('GET_REQUEST_SUCCESS', {
      url,
      method,
      headers
    });
    return result;
  } catch (error) {
    console.log('GET_REQUEST_FAILED', {
      message: error.message,
      responseData: error.response.data,
      response: error.response
    });
    throw error;
  }
};

module.exports = {
  getRequest
};
