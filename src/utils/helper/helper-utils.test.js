const utils = require('./helper.utils');

describe('Utils - helper', () => {
  it('Should be able to construct md5 digest of data', () => {
    const data = '1abcd1234';
    const expectedHash = 'ffd275c5130566a2916217b101f26150';

    const hash = utils.md5Hash(data);
    expect(hash).toEqual(expectedHash);
  });

  it('should return true if there is null or undefined item in array', () => {
    const arr = { charId: null, charYear: 1236, charItem: { id: 1 } };
    const mustHaveData = [arr.charId, arr.charYear, arr.charItem.id.randomKey];
    expect(utils.hasNullOrUndefinedItem(mustHaveData)).toBeTrue();
  });

  it('should return false if there is no null or undefined item in array', () => {
    const arr = { charId: 2, charYear: 1458, charItem: { id: 1 } };
    const mustHaveData = [arr.charId, arr.charYear, arr.charItem.id];
    expect(utils.hasNullOrUndefinedItem(mustHaveData)).toBeFalse();
  });
});
