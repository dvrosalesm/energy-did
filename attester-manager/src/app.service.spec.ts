import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import * as Kilt from '@kiltprotocol/sdk-js';

async function waitForSetup() {
  await new Promise((r) => setTimeout(r, 4000));
}

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    appService = new AppService();

    await waitForSetup();
  });

  describe('KILT Services', () => {
    it('should register CTypes', async () => {
      process.env.WSS_ADDRESS = 'wss://peregrine.kilt.io';
      process.env.MNEMONIC =
        'flower kick limb near paper strike stumble hazard void picnic scatter leisure';
      expect(async () => await appService.registerCTypes()).not.toThrowError();
    });

    it('should retrive attestations', async () => {
      expect(
        async () => await appService.getAllAttestations(),
      ).not.toThrowError();
    });

    it('should add requestAttestation', async () => {
      expect(
        async () =>
          await appService.requestAttestation(
            {} as Kilt.ICredential,
            'INVALIDURI' as Kilt.DidUri,
          ),
      ).not.toThrowError();
    });

    it('should attest credential', async () => {
      process.env.WSS_ADDRESS = 'wss://peregrine.kilt.io';
      process.env.MNEMONIC =
        'flower kick limb near paper strike stumble hazard void picnic scatter leisure';
      expect(
        async () =>
          await appService.attestCredential(
            '0x7ab42810b86c6a8b94856c9b34cd584215cc16d27ca15d32038cf74cd40a2997',
            '',
          ),
      ).not.toThrowError();
    });
  });
});
