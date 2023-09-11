import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/mint";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.API_KEY,
      accounts: [
        "19e52ab6350e585d82bc520a7496bddfdbfed552eed09ab8322e1445f3f5b22e",
      ],
    },
  },
};

export default config;
