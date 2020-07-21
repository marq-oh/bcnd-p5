const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "<INFURA KEY>";
const mnemonic = "<METAMASK SEED WORDS>";

module.exports = {
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/6c514bb87a464ed5b7748f32e5656015`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // version: "0.6.2",
	  version: "0.5.11",

    }
  }
};