import * as Kilt from "@kiltprotocol/sdk-js";
export declare function generateKeypairs(mnemonic?: string): {
    authentication: Kilt.KiltKeyringPair & {
        type: "sr25519";
    };
    keyAgreement: Kilt.KiltEncryptionKeypair;
    assertionMethod: Kilt.KiltKeyringPair;
    capabilityDelegation: Kilt.KiltKeyringPair;
};
export declare function genAccountFromMnemonic(mnemonic: string): Kilt.KeyringPair;
