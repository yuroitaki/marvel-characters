require('dotenv-safe').config();

module.exports = {
  port: process.env.PORT,
  serviceName: 'marvelCharacters',
  https: {
    timeout: 5000
  },
  marvelConfig: {
    domain: 'https://gateway.marvel.com:443',
    publicKey: process.env.MARVEL_PUBLIC_KEY,
    privateKey: process.env.MARVEL_PRIVATE_KEY,
    charactersEndpoint: '/v1/public/characters',
    characterLimit: 100
  },
  redisConfig: {
    port: process.env.REDIS_PORT,
    cacheKey: 'cached-characters'
  }
};
