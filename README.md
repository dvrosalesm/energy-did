# Energy-DID

Example usage of the KILT protocol.

This monorepo includes:

- asset-manager: React app to manage a users assets (Deploying a full DID, create claims, credentials and verifying attested credentials)
- attester-cli: CLI to be used as an atester tied to the attester-manager, enables an attester to list pending requests and approve attestation requests.
- attester-manager: Node / NestJS services to manage attestation requests, attestation confirmations, verification requests and verification completions.
- contracts: Set of Smart Contracts to tie Power Assets to the ethereum blockchain (currently tested on Sepolia)
- kilt-common: Shared KILT logic to be used in the multiple projects in this monorepo.
- verifier-cli: CLI to be used as a verifier, enables a verifier to list attested credentials and request verifications from the claimer.
