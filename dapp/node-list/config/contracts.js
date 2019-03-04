module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: 'localhost', // Host of the blockchain node
      port: 8546, // Port of the blockchain node
      type: 'ws', // Type of connection (ws or rpc),
      // Accounts to use instead of the default account to populate your wallet
      // The order here corresponds to the order of `web3.eth.getAccounts`, so the first one is the `defaultAccount`
      accounts: [
        {
          mnemonic: 'cook mango twist then skin sort option civil have still rather guilt',
          addressIndex: '0', // Optionnal. The index to start getting the address
          numAddresses: "10", // Optional. The number of addresses to get
          hdpath: "m/44'/60'/0'/0/" // Optionnal. HD derivation path
        },
        {
          'nodeAccounts': true // Uses the Ethereum node's accounts
        }
      ]
    },
    // order of connections the dapp should connect to
    dappConnection: [
      '$WEB3', // uses pre existing web3 object if available (e.g in Mist)
      'ws://localhost:8546',
      'http://localhost:8545'
    ],

    // Automatically call `ethereum.enable` if true.
    // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
    // Default value is true.
    // dappAutoEnable: true,

    gas: 'auto',

    // Strategy for the deployment of the contracts:
    // - implicit will try to deploy all the contracts located inside the contracts directory
    //            or the directory configured for the location of the contracts. This is default one
    //            when not specified
    // - explicit will only attempt to deploy the contracts that are explicity specified inside the
    //            contracts section.
    // strategy: 'implicit',

    contracts: {
      SafeMath: {},
      MultiSigWallet: {
        args: [['$accounts[0]'], 1]
      },
      Althea: {
        args: ['$MultiSigWallet'],
        onDeploy: [
          `Althea.methods.addMember('$accounts[1]', '0x2001deadbeefbf0aa000000000000000', '0x09C4D1F918D3C02B390765C7EB9849842c8F7997').send()`,
          `Althea.methods.addMember('$accounts[2]', '0x2001deadbeefbf0d0000000000000000', '0x4465626f726168000000000000000000').send()`,
          `Althea.methods.addMember('$accounts[3]', '0x2001deadbeefbf0e0000000000000000', '0x53656261730000000000000000000000').send()`,
          `Althea.methods.addBill('$accounts[1]').send({"value": 1000000000000000000})`,
          `Althea.methods.addBill('$accounts[2]').send({"value": 1000000000000000000})`,
          `Althea.methods.addBill('$accounts[3]').send({"value": 1000000000000000000})`
        ]
      }
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      'ws://localhost:8546',
      'http://localhost:8545',
      '$WEB3' //  uses pre existing web3 object if available (e.g in Mist)
    ]
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  }

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  // custom_name: {
  // }
};
