jest.mock('../https/https.service');
const { getRequest } = require('../https/https.service');

jest.mock('../redis/redis.service');
const { fetchCachedItem, cacheItem } = require('../redis/redis.service');

const service = require('./marvel.service');

describe('Service - marvel', () => {
  let listCharactersResp;
  let emptyListCharacterResp;
  let cachedItem;
  let getCharacterResp;

  beforeEach(() => {
    listCharactersResp = {
      data: {
        total: 100,
        count: 100,
        results: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      }
    };
    emptyListCharacterResp = { data: { total: 0, count: 0, results: [] } };
    cachedItem = {
      characters: [1, 2],
      timestamp: '2021-05-26'
    };
    getCharacterResp = {
      data: {
        results: [
          {
            id: 1,
            name: 'Abomination (Emil Blonsky)',
            description: 'Formerly known as Emil Blonsky, a spy of Soviet Yugoslavian origin working for the KGB, the Abomination gained his powers after receiving a dose of gamma radiation similar to that which transformed Bruce Banner into the incredible Hulk.'
          }
        ]
      }
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should be able to list marvel character ids when there is no cache', async () => {
    fetchCachedItem.mockResolvedValue(false);
    getRequest.mockResolvedValue({ data: listCharactersResp });
    cacheItem.mockResolvedValue(true);

    const result = await service.listCharactersWrapper();
    expect(result).toBeArrayOfSize(listCharactersResp.data.results.length);
  });

  it('Should fail to list marvel character ids if external api fails and there is no cache', (done) => {
    fetchCachedItem.mockResolvedValue(false);
    getRequest.mockRejectedValue(new Error('LIST_MARVEL_CHARACTERS_FAILED'));

    service.listCharactersWrapper().catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });

  it('Should fail to list marvel character ids if external api returns invalid response and there is no cache', (done) => {
    fetchCachedItem.mockResolvedValue(false);
    getRequest.mockResolvedValue({ data: {} });

    service.listCharactersWrapper().catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });

  it('Should be able to return cached marvel character ids although external api fails', async () => {
    fetchCachedItem.mockResolvedValue(cachedItem);
    getRequest.mockResolvedValue({ data: emptyListCharacterResp });
    cacheItem.mockResolvedValue(true);

    const result = await service.listCharactersWrapper();
    expect(result).toBeArrayOfSize(cachedItem.characters.length);
  });

  it('Should be able to return marvel character details ', async () => {
    getRequest.mockResolvedValue({ data: getCharacterResp });

    const result = await service.getCharacter();
    expect(result).toBeObject();
    expect(result.id).toEqual(getCharacterResp.data.results[0].id);
    expect(result.name).toEqual(getCharacterResp.data.results[0].name);
    expect(result.description).toEqual(getCharacterResp.data.results[0].description);
  });

  it('Should fail to get marvel character details if external api fails', (done) => {
    getRequest.mockRejectedValue(new Error('GET_MARVEL_CHARACTER_FAILED'));

    service.getCharacter().catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });

  it('Should fail to get marvel character ids if external api returns invalid response', (done) => {
    getRequest.mockResolvedValue({ data: {} });

    service.getCharacter().catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });
});
