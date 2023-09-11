import { task } from "hardhat/config";

task("mint:power-asset", "Mint a power asset")
  .addParam("contractAddress", "Address of the Power Asset contract")
  .addParam("to", "Address of the receiver")
  .setAction(async (args, { ethers }) => {
    if (args.contractAddress && args.to) {
      const contract = await ethers.getContractAt(
        "PowerAsset",
        args.contractAddress
      );

      const id = await contract.tokensCount();
      const tx = await contract.mintPowerAsset(args.to);
      const receipt = await tx.wait();

      console.log("Finished minting asset");
      console.log(`Asset Id: ${id}`);
      console.log(`AssetDID: did:asset:erc721:${id}:${args.contractAddress}`);
    } else {
      console.log("Missing parameters, exiting...");
    }
  });
