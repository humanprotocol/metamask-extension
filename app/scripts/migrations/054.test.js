import { strict as assert } from 'assert';
import migration54 from './054';

describe('migration #54', function () {
  it('should update the version metadata', async function () {
    const oldStorage = {
      meta: {
        version: 53,
      },
      data: {},
    };

    const newStorage = await migration54.migrate(oldStorage);
    assert.deepEqual(newStorage.meta, {
      version: 54,
    });
  });

  it('should retype instance of 0 decimal values to numbers', async function () {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          tokens: [
            {
              address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
              decimals: '0',
              symbol: 'CK',
            },
            {
              address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
              decimals: 18,
              symbol: 'BAT',
            },
            {
              address: '0x514910771af9ca656af840dff83e8264ecf986ca',
              decimals: 18,
              symbol: 'LINK',
            },
            {
              address: '0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205',
              decimals: '0',
              symbol: 'SOR',
            },
          ],
        },
      },
    };

    const newStorage = await migration54.migrate(oldStorage);
    assert.deepEqual(newStorage.data, {
      PreferencesController: {
        tokens: [
          {
            address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
            decimals: 0,
            symbol: 'CK',
          },
          {
            address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
            decimals: 18,
            symbol: 'BAT',
          },
          {
            address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            decimals: 18,
            symbol: 'LINK',
          },
          {
            address: '0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205',
            decimals: 0,
            symbol: 'SOR',
          },
        ],
      },
    });
  });

  it('should do nothing if all decimal value typings are correct', async function () {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          tokens: [
            {
              address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
              decimals: 0,
              symbol: 'CK',
            },
            {
              address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
              decimals: 18,
              symbol: 'BAT',
            },
            {
              address: '0x514910771af9ca656af840dff83e8264ecf986ca',
              decimals: 18,
              symbol: 'LINK',
            },
            {
              address: '0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205',
              decimals: 0,
              symbol: 'SOR',
            },
          ],
        },
      },
    };

    const newStorage = await migration54.migrate(oldStorage);
    assert.deepEqual(newStorage.data, {
      PreferencesController: {
        tokens: [
          {
            address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
            decimals: 0,
            symbol: 'CK',
          },
          {
            address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
            decimals: 18,
            symbol: 'BAT',
          },
          {
            address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            decimals: 18,
            symbol: 'LINK',
          },
          {
            address: '0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205',
            decimals: 0,
            symbol: 'SOR',
          },
        ],
      },
    });
  });
});
