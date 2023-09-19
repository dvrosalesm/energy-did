import { genAccountFromMnemonic } from "./kilt.helper";
import * as Kilt from "@kiltprotocol/sdk-js";

const fetch = require("node-fetch");

export async function requestVerification(claimdId: string) {
  console.log("Sending verification request");

  const res = await fetch("http://127.0.0.1:3434/requestVerification", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      id: claimdId,
      challenge: Kilt.Utils.UUID.generate(),
      verifier: process.env.VERIFIER || "",
    }),
  });

  if (res.status === 201) console.log("Request verification correctly");
  else {
    console.log(res);
    console.log("Failed while requesting verification, try again later...");
  }
}

export async function getAllClaims() {
  const claimsRaw = await fetch("http://127.0.0.1:3434/getAllAttestations");
  const claims = await claimsRaw.json();

  let pendingClaims = claims.filter((x) => x.status !== "PENDING");

  if (pendingClaims.length === 0) {
    console.log("No pending claims");
    return;
  }

  console.log("Listing all credentials...");
  for (const [i, claim] of pendingClaims.entries()) {
    console.log(
      `${i + 1}. Claim: ${claim.id} status: ${
        claim.status
      } Details: ${Object.values(claim.credential.claim.contents).join("-")} `
    );
  }
}
