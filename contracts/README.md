# Contracts

<b>Important</b> Change the configuration to use an actual Infure node in the `hardhat.config.ts` file.

Contains the Smart Contracts required to tie the Power Assets to the blockchain (Currently on Sepolia)

## Available commands:

Deploy the contract

```
npx hardhat run ./scripts/deploy.ts --network sepolia
```

Mint a Power Asset

```
npx hardhat mint:power-asset --contract-address <contract-address> --to <asset-owner>
```
