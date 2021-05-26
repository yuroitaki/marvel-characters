jest.mock('../https/https.service');
const { getRequest } = require('../https/https.service');

const service = require('./marvel.service');

describe('Service - marvel', () => {
  let listCharactersResp;

  beforeEach(() => {
    listCharactersResp = {
      data: {
        total: 1000,
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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should be able to list marvel character ids, count and total', async () => {
    getRequest.mockResolvedValue({ data: listCharactersResp });

    const result = await service.listCharacters();
    expect(result).toBeObject();
    expect(result.total).toEqual(listCharactersResp.data.total);
    expect(result.count).toEqual(listCharactersResp.data.count);
    expect(result.characters).toBeArrayOfSize(listCharactersResp.data.results.length);
  });

  it('Should fail to list marvel character ids, count and total if external api fails', (done) => {
    getRequest.mockRejectedValue(new Error('LIST_MARVEL_CHARACTERS_FAILED'));

    service.listCharacters().catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });

  it('Should fail to list marvel character ids, count and total if external api returns invalid response', (done) => {
    getRequest.mockResolvedValue({ data: {} });

    service.listCharacters().catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });
});
