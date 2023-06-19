require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString
const apiKey = "1c04d8dd403749a4b007a8fef3e15142";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },

    mumbai: {
      // Infura
      url: `https://polygon-mumbai.infura.io/v3/${apiKey}`,
      accounts: [privateKey],
    },
    matic: {
      // Infura
      url: `https://polygon-mainnet.infura.io/v3/${apiKey}`,
      accounts: [privateKey],
    },
  },

  solidity: "0.8.18",
};
