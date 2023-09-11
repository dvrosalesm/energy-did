import { AccountInfo } from "./dto/accountInfo";
import {
  genAccountFromMnemonic,
  generateKeypairs,
} from "kilt-common/src/index";
import * as Kilt from "@kiltprotocol/sdk-js";

export const KILTService = {
  async getAccountInfo(mnemonic: string): Promise<AccountInfo> {
    try {
      const { address } = genAccountFromMnemonic(mnemonic);
      const api = await Kilt.connect(
        import.meta.env.VITE_WSS_ADDRESS || "wss://peregrine.kilt.io"
      );
      const balance = (await api.query.system.account(address)).data.free;
      const pairingKeys = generateKeypairs(mnemonic);
      const didUri = Kilt.Did.getFullDidUriFromKey(pairingKeys.authentication);
      const encodedFullDid = await api.call.did.query(Kilt.Did.toChain(didUri));
      const { document } = !encodedFullDid.isEmpty
        ? Kilt.Did.linkedInfoFromChain(encodedFullDid)
        : { document: undefined };

      await api.disconnect();

      return {
        account: {
          address,
          didUri,
          hasDocument: !!document,
          document,
          balance: Kilt.BalanceUtils.balanceNumberToString(balance),
        },
        error: false,
      };
    } catch (e: unknown) {
      return {
        account: null,
        error: true,
        reason: (e as Error).message,
      };
    }
  },

  async createFullDID(mnemonic: string): Promise<AccountInfo> {
    await Kilt.connect(
      import.meta.env.VITE_WSS_ADDRESS || "wss://peregrine.kilt.io"
    );
    const account = genAccountFromMnemonic(mnemonic);
    const {
      authentication,
      keyAgreement,
      assertionMethod,
      capabilityDelegation,
    } = generateKeypairs(mnemonic);

    const fullDidCreationTx = await Kilt.Did.getStoreTx(
      {
        authentication: [authentication],
        keyAgreement: [keyAgreement],
        assertionMethod: [assertionMethod],
        capabilityDelegation: [capabilityDelegation],
      },
      account.address as `4${string}`,
      async ({ data }) => ({
        signature: authentication.sign(data),
        keyType: authentication.type,
      })
    );

    try {
      await Kilt.Blockchain.signAndSubmitTx(fullDidCreationTx, account);
    } catch (e) {
      console.log("DID already exists, skipping...", e);
    }

    return this.getAccountInfo(mnemonic);
  },
  createClaim(
    ctype: Kilt.ICType,
    content: Kilt.IClaim["contents"],
    claimer: Kilt.DidUri
  ): Kilt.IClaim {
    const claim = Kilt.Claim.fromCTypeAndClaimContents(ctype, content, claimer);

    return claim;
  },
  async generateClaim(
    mnemonic: string,
    claimAttributes: Kilt.IClaim["contents"],
    ctypeSchema: "PV" | "WG"
  ): Promise<{ credential: Kilt.ICredential; claimer: Kilt.DidUri }> {
    const pairingKeys = generateKeypairs(mnemonic);
    const didUri = Kilt.Did.getFullDidUriFromKey(pairingKeys.authentication);
    const ctypeDetails =
      ctypeSchema === "PV"
        ? await this.fetchCType(import.meta.env.VITE_PV_CTYPE_ID)
        : await this.fetchCType(import.meta.env.VITE_WP_CTYPE_ID);

    const claim = this.createClaim(ctypeDetails.cType, claimAttributes, didUri);

    return {
      credential: Kilt.Credential.fromClaim(claim),
      claimer: didUri,
    };
  },
  async fetchCType(
    ctypeId: Kilt.ICType["$id"]
  ): Promise<Kilt.CType.ICTypeDetails> {
    await Kilt.connect(
      import.meta.env.VITE_WSS_ADDRESS || "wss://peregrine.kilt.io"
    );
    return Kilt.CType.fetchFromChain(ctypeId);
    Kilt.disconnect();
  },
  async generatePresentation(
    mnemonic: string,
    credential: Kilt.ICredential,
    challenge: string
  ) {
    const accountInfo = await this.getAccountInfo(mnemonic);
    const pairingKeys = generateKeypairs(mnemonic);
    const didUri = Kilt.Did.getFullDidUriFromKey(pairingKeys.authentication);

    return Kilt.Credential.createPresentation({
      credential,
      signCallback: async ({ data }) => ({
        signature: pairingKeys.authentication.sign(data),
        keyType: pairingKeys.authentication.type,
        keyUri: `${didUri}${
          accountInfo.account!.document!.authentication[0].id
        }`,
      }),
      challenge,
    });
  },
};
