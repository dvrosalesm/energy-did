"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClaims = exports.attestClaim = void 0;
const kilt_common_1 = require("kilt-common");
const fetch = require("node-fetch");
async function attestClaim(claimdId) {
    const challenge = await signPublicChallenge();
    console.log("Sending attestation approval");
    const res = await fetch("http://127.0.0.1:3434/attestClaim", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            id: claimdId,
            signedChallenge: challenge,
        }),
    });
    if (res.status === 201)
        console.log("Attested claim correctly");
    else
        console.log("Failed while attesting the claim, try again later...");
}
exports.attestClaim = attestClaim;
async function getAllClaims() {
    var _a, _b;
    const claimsRaw = await fetch("http://127.0.0.1:3434/getAllAttestations");
    const claims = await claimsRaw.json();
    let pendingClaims = claims.filter((x) => x.status === "PENDING");
    if (pendingClaims.length === 0) {
        console.log("No pending claims");
        return;
    }
    console.log("Listing all pending claims...");
    for (const [i, claim] of pendingClaims.entries()) {
        console.log(`${i + 1}. Claim: ${claim.id} status: ${claim.status} Details: ${Object.values(((_b = (_a = claim.credential) === null || _a === void 0 ? void 0 : _a.claim) === null || _b === void 0 ? void 0 : _b.contents) || {}).join("-")} `);
    }
}
exports.getAllClaims = getAllClaims;
async function signPublicChallenge() {
    const dataRaw = await fetch.default("http://127.0.0.1:3434/getChallenge");
    const challenge = await dataRaw.json();
    const account = (0, kilt_common_1.genAccountFromMnemonic)(process.env.MNEMONIC || "");
    return Buffer.from(account.sign(challenge).buffer).toString();
}
//# sourceMappingURL=attestation.js.map