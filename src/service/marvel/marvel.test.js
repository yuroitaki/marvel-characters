jest.mock('../https/https.service');
const { getRequest } = require('../https/https.service');

jest.mock('../redis/redis.service');
const { fetchCachedItem, cacheItem } = require('../redis/redis.service');

const service = require('./marvel.service');

describe('Service - marvel', () => {
  let listCharactersResp;
  let emptyListCharacterResp;
  let cachedItem;

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
});
