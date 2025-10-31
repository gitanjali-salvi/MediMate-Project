/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 */

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions.
   */

  networks: {
    // --- THIS IS THE SECTION FOR GANACHE ---
    // This 'development' network is configured to connect to your
    // Ganache GUI, which typically runs on port 7545.
    
    development: {
     host: "127.0.0.1",     // Localhost
     port: 7545,            // Standard Ganache GUI port
     network_id: "*",       // Any network
     gas: 6721975           // Manually set the gas limit
    },
    // --- End of Ganache Section ---
    
    // Example of another network (e.g., for Ganache-CLI if it's on 8545)
    // advanced: {
    //   port: 8545,             // Custom port
    //   network_id: 1337,       // Custom network
    //   gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    //   gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    //   from: <address>,        // Account to send txs from (default: accounts[0])
    //   websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (matches our smart contract)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the Solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      //  evmVersion: "byzantium"
      }
    }
  },

  // Truffle DB is currently in beta!
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "sqlite",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};