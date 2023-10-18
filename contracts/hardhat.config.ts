import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/mint";
import * as dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.API_KEY,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY || ""],
    },
  },
};

export default config;
