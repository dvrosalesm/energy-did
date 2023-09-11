"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAccountFromMnemonic = exports.generateKeypairs = void 0;
const Kilt = require("@kiltprotocol/sdk-js");
const util_crypto_1 = require("@polkadot/util-crypto");
function generateKeyAgreement(mnemonic) {
    const secretKeyPair = (0, util_crypto_1.sr25519PairFromSeed)((0, util_crypto_1.mnemonicToMiniSecret)(mnemonic));
    const { path } = (0, util_crypto_1.keyExtractPath)("//did//keyAgreement//0");
    const { secretKey } = (0, util_crypto_1.keyFromPath)(secretKeyPair, path, "sr25519");
    return Kilt.Utils.Crypto.makeEncryptionKeypairFromSeed((0, util_crypto_1.blake2AsU8a)(secretKey));
}
function generateKeypairs(mnemonic = (0, util_crypto_1.mnemonicGenerate)()) {
    const account = Kilt.Utils.Crypto.makeKeypairFromSeed((0, util_crypto_1.mnemonicToMiniSecret)(mnemonic), "sr25519");
    const authentication = Object.assign(Object.assign({}, account.derive("//did//0")), { type: "sr25519" });
    const assertionMethod = Object.assign(Object.assign({}, account.derive("//did//assertion//0")), { type: "sr25519" });
    const capabilityDelegation = Object.assign(Object.assign({}, account.derive("//did//delegation//0")), { type: "sr25519" });
    const keyAgreement = generateKeyAgreement(mnemonic);
    return {
        authentication: authentication,
        keyAgreement: keyAgreement,
        assertionMethod: assertionMethod,
        capabilityDelegation: capabilityDelegation,
    };
}
exports.generateKeypairs = generateKeypairs;
function genAccountFromMnemonic(mnemonic) {
    const keyring = new Kilt.Utils.Keyring({
        ss58Format: 38,
        type: "sr25519",
    });
    const account = keyring.addFromMnemonic(mnemonic);
    return account;
}
exports.genAccountFromMnemonic = genAccountFromMnemonic;
//# sourceMappingURL=index.js.map