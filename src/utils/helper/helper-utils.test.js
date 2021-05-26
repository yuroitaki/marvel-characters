const utils = require('./helper.utils');

describe('Utils - helper', () => {
  it('Should be able to construct md5 digest of data', () => {
    const data = '1abcd1234';
    const expectedHash = 'ffd275c5130566a2916217b101f26150';

    const hash = utils.md5Hash(data);
    expect(hash).toEqual(expectedHash);
  });
});
