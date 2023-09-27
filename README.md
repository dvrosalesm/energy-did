# Energy-DID

## Introduction

Monorepo to showcase the usage of the KILT protocol to create decentralized identities (DID), claims, verified credentials, attest credentials and verify credentials.

![image](https://github.com/dvrosalesm/energy-did/assets/11451856/accf73cc-fa5d-4a53-9ae3-ef848b50e4bf)

## Features

Each package includes a set of features that pertain each target user:

- Power asset owner (React app):
  - Create an account using a 12 word (BIP39 mnemonic)
  - Query address, balance and full DID if applicable. (The current implementation doesn't support light DIDs, **only full DIDs**)
  - Create a Full DID tied to the KILT blockchain.
  - Generate claims and request attestation
  - Check status of claim - credential.
  - Sign challenges to prove ownership of the credentials.
- Attester (attester-cli / attester-manager):
  - Aggregate attestation requests.
  - Attest claims - generate credentials
- Verifier (verifier-cli / attester-manager)
  - Aggregate verify requests.
  - Store verification challenges.
  - Verify credential using a challenge.

## About

This monorepo includes:

- asset-manager: React app to manage a users assets (Deploying a full DID, create claims, credentials and verifying attested credentials)
- attester-cli: CLI to be used as an atester tied to the attester-manager, enables an attester to list pending requests and approve attestation requests.
- attester-manager: Node / NestJS services to manage attestation requests, attestation confirmations, verification requests and verification completions.
- contracts: Set of Smart Contracts to tie Power Assets to the ethereum blockchain (currently tested on Sepolia)
- kilt-common: Shared KILT logic to be used in the multiple projects in this monorepo.
- verifier-cli: CLI to be used as a verifier, enables a verifier to list attested credentials and request verifications from the claimer.



## Installation & running the project

**(Node >= 16 required)**

- Clone the repo and run `yarn`
- Run the `asset-manager`:

```
yarn --cwd ./asset-manager dev
```

- Run the `attester-manager`:

```
yarn --cwd ./attester-manager start:dev
```

## Usage

### Create a `Full DID`

The purpose of the system is to use the advantages of the decentralized identifiers (DID) to create a virtual abstraction of an identity (person, accounts, assets), in order to do this we are using Full DIDs for all interactions sinceit provides all the capabilities of generating claims, credentials, request attestations and verify credentials while also being tied to a blockchain (the KILT blockchain in this case). 

The current implementation supports a very basic usage of this, utilizing accounts by themselves without any extra attributes tied to them.

- Go to http://127.0.0.1:5173
- Enter a mnemonic (i.e. `sail three flush occur fiction shoulder slender happy live holiday rule very`) and click on search
- If the balance shows 0, go to the KILT faucet to get PILT native tokens (https://faucet.peregrine.kilt.io)
- If the faucet was needed, wait 1 minute and then click on search again, it should show 100000000000000000 PILT, if not try again after 1 minute.
- Now a `Create full DID` button should show in the screen, click it to create a Full DID, if it doen't show it means the the account already has a full DID associated.
- After creating the Full DID, the `Has full DID ` field should be set to `Yes`, if not try refreshing by pressing the "Search" button again.

![Screen recording Full DID](https://github.com/dvrosalesm/energy-did/assets/11451856/4e407d52-89d9-4a90-a871-9e1abe70a69b)

### Request attestation

In this scenario a power asset owner wants to attest a power asset as a KILT asset, this can be done creating a claim and requesting an attestation to turn it into a credential. For this you should:

- Mint the NFT that will identify the asset. (See Minting a power asset) and obtain the AssetDID. **You can skip this step by using an existing AssetDID, for example: did:asset:erc721:0:0xD766E2F41e6f3f4321469F57b458D98198b188c0)**
- Go to http://127.0.0.1:5173
- Enter a mnemonic (i.e. `sail three flush occur fiction shoulder slender happy live holiday rule very`) and click on search
- Wait for the information to show up and fill the attestation request form using your power asset information.
- Submit your request and wait for an attestator to verify it and attest it.

### Attest claim

In this scenario an attester wants to see all the attestation requests, verify the information and attest the power asset, use `NPX` to avoid global installation of the CLI.

- Navigate to the `attester-cli` directory in the terminal.
- To list the pending attestation requests run: `npx . list-pending`.
- To attest a claim run: `npx . attest <claim-id>`, if it fails try again, there is a current bug where the KILT connections gets dropped)
- The terminal should display: `Attested claim correctly` and the user should be able to see the credential generated in the React app.

### Verify a credential

In this scenario a verifier wants to verify that a credential is valid, to do this you can:

- Navigate to the `verifier-cli` directory in the terminal
- To list all credentials run: `npx . list-verify`
- To request a verification from the user to prove ownership run: `npx . request-verify <claim-id>`.
- The user musts go to the React app and refresh the information, then go to the requests history and a verification requests should show.
- The user now musts click on verify to prove that it is the owner of the credential.

**This is the full flow for now, for future improvement there should be a command to show the result of the verification, for now it just shows as verified when the information is correct and the challenge was signed correctly by the owner of the credential**

### Minting a Power Asset

To mint a power asset you must deploy the smart contract that will track the asset and then mint the power asset.

- Navigate to the `contracts` directory in the terminal.
- Make sure Hardhat is configured and correctly installed:
  - Run `yarn`
  - Configure all the `Contracts config` environment variables on the main .env file. (API_KEY and ACCOUNT_PRIVATE_KEY are required)
- Deploy the contract by running: `npx hardhat run ./scripts/deploy.ts --network sepolia`, copy the contract address
- Mint the NFT using the copied contract address and a ethereum account: `npx hardhat mint:power-asset --contract-address <contract-address> --to <asset-owner> --network sepolia`
- You should see your formatted AssetDID that was minted.
