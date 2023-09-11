import { Injectable, NotFoundException } from '@nestjs/common';
import { genAccountFromMnemonic, generateKeypairs } from 'kilt-common';
import * as Kilt from '@kiltprotocol/sdk-js';
import { PV_CTYPE } from './ctype/pv.ctype';
import { WIND_GENERATOR_CTYPE } from './ctype/wind-generator.ctype';
import db from './db/loki';

@Injectable()
export class AppService {
  async registerCTypes() {
    const accountInfo = await this.getAttesterAccount();

    const api = await Kilt.connect(
      process.env.WSS_ADDRESS || 'wss://peregrine.kilt.io',
    );

    console.log(
      `Using attester: ${accountInfo.didUri} with address ${accountInfo.account.address}`,
    );

    for (const ctype of [PV_CTYPE, WIND_GENERATOR_CTYPE]) {
      try {
        await Kilt.CType.verifyStored(ctype);
        console.log('CType already stored, ID: ' + ctype.$id);
        console.log(ctype.title);
      } catch {
        console.log('Ctype not present. Creating it now...');
        try {
          const encodedCtype = Kilt.CType.toChain(ctype);
          const ctypeCreationTx = api.tx.ctype.add(encodedCtype);
          const authorizedCtypeCreationTx = await Kilt.Did.authorizeTx(
            accountInfo.didUri,
            ctypeCreationTx,
            async ({ data }) => ({
              signature: accountInfo.pairingKeys.assertionMethod.sign(data),
              keyType: accountInfo.pairingKeys.assertionMethod.type,
            }),
            accountInfo.account.address as `4${string}`,
          );
          await Kilt.Blockchain.signAndSubmitTx(
            authorizedCtypeCreationTx,
            accountInfo.account,
          );
          console.log('CType stored, ID: ' + ctype.$id);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  requestAttestation(credential: Kilt.ICredential, claimer: Kilt.DidUri) {
    db.getCollection('requests').insert({
      id: Kilt.Utils.UUID.generate(),
      claimer: claimer,
      credential: credential,
      status: 'PENDING',
    });
  }

  async attestCredential(
    id: string,
    signedChallenge: string,
  ): Promise<boolean> {
    if (!this.verifySender(signedChallenge)) return null;

    const request = db.getCollection('requests').findOne({ id });

    if (!request) throw new NotFoundException('Claim not found');

    const api = await Kilt.connect(
      process.env.WSS_ADDRESS || 'wss://peregrine.kilt.io',
    );

    const account = genAccountFromMnemonic(process.env.MNEMONIC || '');
    const pairingKeys = generateKeypairs(process.env.MNEMONIC);
    const attester = Kilt.Did.getFullDidUriFromKey(pairingKeys.authentication);

    const { cTypeHash, claimHash, delegationId } =
      Kilt.Attestation.fromCredentialAndDid(request.credential, attester);

    // Write the attestation info on the chain.
    const attestationTx = api.tx.attestation.add(
      claimHash,
      cTypeHash,
      delegationId,
    );
    const authorizedAttestationTx = await Kilt.Did.authorizeTx(
      attester,
      attestationTx,
      async ({ data }) => ({
        signature: pairingKeys.assertionMethod.sign(data),
        keyType: pairingKeys.assertionMethod.type,
      }),
      account.address as `4${string}`,
    );

    console.log('All good, sending attestation to blockchain');

    try {
      await Kilt.Blockchain.signAndSubmitTx(authorizedAttestationTx, account);
    } catch (e) {
      console.log('Warning: ', (e as any).docs.join(' '));
    }

    console.log('Finished sending attestation');

    request.status = 'COMPLETED';
    request.attester = account.address;
    db.getCollection('requests').update(request);

    Kilt.disconnect();

    return true;
  }

  getAllAttestations() {
    return db.getCollection('requests').find({});
  }

  getAttestations(claimer: Kilt.DidUri) {
    return db.getCollection('requests').find({
      claimer,
    });
  }

  getPublicChallenge(): string {
    return process.env.CHALLENGE || '';
  }

  async requestVerification(id: string, challenge: string, verifier: string) {
    const request = db.getCollection('requests').findOne({ id });
    if (!request) throw new NotFoundException('Claim not found');

    if (request.challenges === undefined || request.challenges.length === 0) {
      request.challenges = [
        {
          challenge,
          verifier,
        },
      ];
    } else {
      request.challenges.push({
        challenge,
        verifier,
      });
    }

    db.getCollection('requests').update(request);
  }

  async submitVerification(
    id: Kilt.DidUri,
    presentation: Kilt.ICredentialPresentation,
    challenge: string,
  ): Promise<string> {
    const request = db.getCollection('requests').findOne({ id });
    if (!request) throw new NotFoundException('Claim not found');

    const api = await Kilt.connect(
      process.env.WSS_ADDRESS || 'wss://peregrine.kilt.io',
    );

    try {
      const { revoked, attester } = await Kilt.Credential.verifyPresentation(
        presentation,
        { challenge },
      );

      if (revoked) {
        return '';
      }

      try {
        if (request.challenges) {
          request.challenges = request.challenges
            .filter((x) => x !== null)
            .map((c) => {
              if (c.challenge === challenge) {
                c.presentation = presentation;
                c.verified = true;
              }
              return c;
            });

          db.getCollection('requests').update(request);
        }
      } catch (e) {
        console.log(e);
      }

      await Kilt.disconnect();

      console.log(revoked, attester);

      return attester;
    } catch {
      await Kilt.disconnect();
      return '';
    }
  }

  private async getAttesterAccount() {
    const account = genAccountFromMnemonic(process.env.MNEMONIC || '');
    const api = await Kilt.connect(
      process.env.WSS_ADDRESS || 'wss://peregrine.kilt.io',
    );
    const pairingKeys = generateKeypairs(process.env.MNEMONIC);
    const didUri = Kilt.Did.getFullDidUriFromKey(pairingKeys.authentication);
    const encodedFullDid = await api.call.did.query(Kilt.Did.toChain(didUri));
    const { document } = !encodedFullDid.isEmpty
      ? Kilt.Did.linkedInfoFromChain(encodedFullDid)
      : { document: undefined };

    await api.disconnect();

    return {
      account,
      didUri,
      pairingKeys,
      encodedFullDid,
      document,
    };
  }

  private async verifySender(signedMessage: string): Promise<boolean> {
    const accountInfo = await this.getAttesterAccount();

    const internalSignature = Buffer.from(
      accountInfo.account.sign(process.env.CHALLENGE || '').buffer,
    ).toString();

    return internalSignature === signedMessage;
  }
}
