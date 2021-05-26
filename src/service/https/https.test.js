jest.mock('axios');
const axios = require('axios');

const service = require('./https.service');

describe('Service - https', () => {
  let url;
  let headers;
  let getResponse;

  beforeEach(() => {
    url = 'https://reqres.in/api/products/3';
    headers = {};
    getResponse = {
      data: 'data'
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should be able to call dummy GET endpoint successfully', async () => {
    axios.request.mockResolvedValue({ data: getResponse });

    const { data } = await service.getRequest(url, headers);
    expect(data).toBeObject();
    expect(data).toEqual(getResponse);
  });

  it('Should throw error when fail to call dummy GET endpoint', (done) => {
    axios.request.mockRejectedValue(new Error('AXIOS_REQUEST_ERROR'));
    service.getRequest(url, headers).catch((error) => {
      expect(error).toBeObject();
      done();
    });
  });
});
