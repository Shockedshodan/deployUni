import 'hardhat-typechain'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import "hardhat-deploy";
import "./src/type-extensions";
import "@tenderly/hardhat-tenderly";

import dotenv from "dotenv";

import Table from "cli-table3";
import { task } from "hardhat/config";
import { UniswapV3Deployer } from "./src/deployer/UniswapV3Deployer";
import { HttpNetworkUserConfig } from 'hardhat/types';


dotenv.config();
const { INFURA_API_KEY, MNEMONIC, PK, REPORT_GAS, MOCHA_CONF, NODE_URL } =
  process.env;
task("deploy-uniswap", "Deploys Uniswap V3 contracts", async (args, hre) => {
  const [deployer] = await hre.ethers.getSigners();
  const bal = await deployer.getBalance()
  console.log(deployer.address)
  const contracts = await UniswapV3Deployer.deploy(deployer);

  const table = new Table({
    head: ["Contract", "Address"],
    style: { border: [] },
  });
  for (const item of Object.keys(contracts)) {
    table.push([item, contracts[item].address]);
  }
  console.info(table.toString());
});


const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  sharedNetworkConfig.accounts = [PK];
}
export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      ...sharedNetworkConfig,
      chainId: 4
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      ...sharedNetworkConfig,
      chainId: 4
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    version: '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        // do not include the metadata hash, since this is machine dependent
        // and we want all generated code to be deterministic
        // https://docs.soliditylang.org/en/v0.7.6/metadata.html
        bytecodeHash: 'none',
      },
    },
  },
}
