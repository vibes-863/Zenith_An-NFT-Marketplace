require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: __dirname + "/.env.local" });

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },

    mumbai: {
      // Infura
      url: `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
    matic: {
      // Infura
      url: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },

  solidity: "0.8.18",
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test",
  },
};
