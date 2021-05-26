require('dotenv-safe').config();

module.exports = {
  port: process.env.PORT,
  serviceName: 'marvelCharacters',
  https: {
    timeout: 5000,
    responseType: 'json',
    responseEncoding: 'utf8'
  }
};
