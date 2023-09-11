const common = require("../dist/index");

const MNEMONIC =
  "agent letter subway captain inflict avoid evolve pen romance manage focus face";

async function waitForSetup() {
  await new Promise((r) => setTimeout(r, 2000));
}

describe("Common lib", () => {
  test("Should throw error if WASM environment is not ready", () => {
    expect(() => common.genAccountFromMnemonic(MNEMONIC)).toThrowError();
  });
  test("Should generate account from mnemonic", async () => {
    await waitForSetup();

    const account = common.genAccountFromMnemonic(MNEMONIC);

    expect(account.address).not.toBe("");
  });

  test("Should retrieve keypairings", async () => {
    await waitForSetup();

    const keyparing = common.generateKeypairs(MNEMONIC);

    expect(keyparing.authentication).not.toBeUndefined();
    expect(keyparing.keyAgreement).not.toBeUndefined();
    expect(keyparing.assertionMethod).not.toBeUndefined();
    expect(keyparing.capabilityDelegation).not.toBeUndefined();
  });
});
