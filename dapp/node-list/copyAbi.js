const althea = require('./dist/contracts/Althea.json')
const msig = require('./dist/contracts/MultiSigWallet.json')
const fs = require('fs')

fs.writeFile(
  'app/contracts/althea.json',
  JSON.stringify(althea.abiDefinition),
  err => {
    if (err) throw err
    console.log('The file has been saved!')
  },
)

fs.writeFile(
  'app/contracts/multisig.json',
  JSON.stringify(msig.abiDefinition),
  err => {
    if (err) throw err
    console.log('The file has been saved!')
  },
)
