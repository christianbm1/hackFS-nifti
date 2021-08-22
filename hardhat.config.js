require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("env", "Check if there is a .env file", async function(){
  process.env.MAINNET_API ? console.log(process.env.MAINNET_API) : console.log(false);
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const mnemonic = process.env.BSC_NMEMONIC;
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },   
  }, 
  defaultNetwork: "hardhat",
  networks: {
    /*hardhat: {
      forking: {
        url: process.env.KOVAN_API,
      }
    },*/
    /*
    mainnet:{
      url: process.env.MAINNET_API,
      accounts: [process.env.MAINNET_KEY]
    },*/
    ropsten: {
      url: process.env.ROPSTEN_API.valueOf(),
      accounts: [`${process.env.ROPSTEN_KEY_1}`, `${process.env.ROPSTEN_KEY_2}`, `${process.env.ROPSTEN_KEY_3}`],
    },
    kovan: {
      url: process.env.KOVAN_API,
      accounts: [`${process.env.KOVAN_KEY_1}`, `${process.env.KOVAN_KEY_2}`],
      gas: `auto`
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: mnemonic}
    },
    mumbai: {
      url: process.env.POLYGON_TEST,
      accounts: [`${process.env.POLYGON_TEST_KEY}`, `${process.env.KOVAN_KEY_2}`],
    },
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
    coinmarketcap: '36042fb7-4d94-4d4b-88e9-b6833d055aee',
    showTimeSpent: true
  },
};

