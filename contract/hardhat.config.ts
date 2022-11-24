import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    etherdata: {
      url: "http://rpc.debugchain.net",
      accounts: process.env.PK !== undefined ? [process.env.PK] : [],
      // gas: 21000000,
      // gasPrice: 8000000000,
    },
  },
};

export default config;