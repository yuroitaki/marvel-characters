const axios = require('axios');
const { https } = require('../../config/vars');

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
      error,
      url,
      method,
      headers
    });
    throw error;
  }
};

module.exports = {
  getRequest
};
