import * as Kilt from '@kiltprotocol/sdk-js';

export const WIND_GENERATOR_CTYPE = Kilt.CType.fromProperties(
  'Wind Generator Power Asset',
  {
    country: {
      type: 'string',
    },
    nameplateCapacity: {
      type: 'integer',
    },
    technology: {
      type: 'string',
    },
    assetDID: {
      type: 'string',
    },
  },
);
