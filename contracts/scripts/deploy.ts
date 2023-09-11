import { ethers } from "hardhat";

async function main() {
  const powerAssetContract = await ethers.deployContract("PowerAsset");

  await powerAssetContract.waitForDeployment();

  console.log(
    `Power Asset contract with  deployed to ${powerAssetContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
