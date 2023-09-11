import * as Kilt from '@kiltprotocol/sdk-js';

export const PV_CTYPE = Kilt.CType.fromProperties('PV Power Asset', {
  country: {
    type: 'string',
  },
  nameplateCapacity: {
    type: 'integer',
  },
  technology: {
    type: 'string',
  },
  type: {
    type: 'string',
  },
  assetDID: {
    type: 'string',
  },
});
