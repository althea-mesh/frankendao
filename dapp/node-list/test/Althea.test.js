/* global contract, config, it, assert*/
const Althea = require('Embark/contracts/Althea.sol');
const MultiSigWallet = require('Embark/contracts/MultiSigWallet');
const { reverting } = require('./helpers/shouldFail.js');
const { summation } = require('./helpers/summation.js');

require('chai').should();

const toBN = web3.utils.toBN;
const expectEvent = require('./helpers/expectEvent.js');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.htm  l
config({
  deployment: {
    accounts: [
      {
        mnemonic: 'cook mango twist then skin sort option civil have still rather guilt',
        addressIndex: '0',
        hdpath: `m/44'/60'/0'/0/`
      },
      {
        'nodeAccounts': true
      }
    ]
  },
  contracts: {
    'MultiSigWallet': {
      args: [['$accounts[0]'], 1]
    },
    'Althea': {
      args: ['$MultiSigWallet']
    }
  }
}, (_err, web3Accounts) => {
  accounts = web3Accounts;
});

const ZERO = '0x0000000000000000000000000000000000000000';

async function mineBlocks(count, cb) {
  let i = 0;
  while (i < count) {
    web3.currentProvider.send({
      method:"evm_mine"
    }, (error, result) => {
      if(error) {
        console.log('error', error)
      }
      return
    })
    i++;
  }
}

contract('Althea', function() {
  this.timeout(0);

  let althea, wallet;
  const required = 2;
  // the per block fee is .50 usd a day at 200usd ETH
  const perBlockFee = toBN(web3.utils.toWei('0.000000405'))

  context.only('Owners', async function() {
    let ipv6 = web3.utils.padRight('0xc0a8010ac0a8010a', 32)
    let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)
    it('Reverts when not an owner', async function() {
      console.log('Bob', web3.utils.padRight(
        web3.utils.toHex('Bob\'s Internet Shop'), 32
      ))
      
      console.log('Deborah', web3.utils.padRight(
        web3.utils.toHex('Deborah'), 32)
      )
      console.log('Sebas', web3.utils.padRight(
        web3.utils.toHex('Sebas'), 32
      ))
      const owners = [accounts[1], accounts[2], accounts[3]]
      const root = owners[0]
      await Althea.methods.initialize(root)
      await Althea.methods.setPerBlockFee(perBlockFee, {from:root})
      await reverting(althea.addMember(accounts[1], ipv6, nick))
    })
  })
  context('Node List', function() {
    let ipv6 = web3.utils.padRight('0xc0a8010ac0a8010a', 32)
    let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)

    it('Adds a new member to the list', async function() {
      await althea.addMember(accounts[1], ipv6, nick, {from:owners[0]})
      let values = await althea.userMapping(ipv6)
      assert.equal(values.ethAddr, accounts[1])
      assert.equal(values.nick, nick)
    })

    it('Should have a NewMember event', async function() {
      const receipt = await althea.addMember(
        accounts[1], ipv6, nick, {from:root}
      )
      await expectEvent.inLogs(receipt.logs, 'NewMember', {
        ethAddress: accounts[1],
        ipAddress: ipv6,
        nickname: nick
      })
    })

    it('Reverts when adding an existing member to the list', async function() {
      await althea.addMember(
        accounts[1], ipv6, nick, {from: root}
      )
      await reverting(
        althea.addMember(accounts[1], ipv6, nick, {from: root})
      )
    })

    it('Removes member from list', async function() {
      await althea.addMember(accounts[1], ipv6, nick, {from:root})
      let value = await althea.userMapping(ipv6)
      assert.equal(value.ethAddr, accounts[1])

      await althea.deleteMember(ipv6, {from:root})
      let value2 = await althea.userMapping(ipv6)
      assert.equal(value2.ethAddr, ZERO)
      assert.equal(value2.nick, web3.utils.padRight('0x', 32))
    })

    it('Should have a MemberRemoved event', async function() {
      await althea.addMember(
        accounts[1], ipv6, nick, {from:root}
      )
      const receipt = await althea.deleteMember(ipv6, {from:root})
      await expectEvent.inLogs(receipt.logs, 'MemberRemoved', {
        ethAddress: accounts[1],
        ipAddress: ipv6,
        nickname: nick
      })
    })
  })

  context('addBill', function() {
    it('Revert when no value is sent', async function() {
      await reverting(althea.methods['addBill()']({from:root}))
    })

    it('Adds a new bill to mapping', async function() {

      let amount = toBN(2).mul(perBlockFee)
      const receipt = await althea.methods['addBill()']({value: amount})
      await expectEvent.inLogs(receipt.logs, 'NewBill', { 
        payer: accounts[0],
        collector: wallet.address
      })
    })

    it('Contract ether balance should increase', async function() {
      let balance = toBN(10).mul(perBlockFee)
      await althea.methods['addBill()']({value: balance})
      let altheaBalance = await web3.eth.getBalance(althea.address)
      altheaBalance.should.eql(web3.utils.toBN(balance).toString())
    })

    it('Increase bill when more amount is sent', async function() {
      let amount = toBN(2).mul(perBlockFee)
      await althea.methods['addBill()']({value: amount})
      await althea.methods['addBill()']({value: amount})
      let total = amount.mul(toBN(2))
      let bill = await althea.billMapping(accounts[0])
      assert(bill.balance.eq(total))
    })
  })

  context('fallback', function() {
    it('Revert when no value is sent', async function() {
      await reverting(althea.sendTransaction())
    })

    it('Adds a new bill to mapping', async function() {
      let amount = toBN(2).mul(perBlockFee)
      const receipt = await althea.sendTransaction({
        from: accounts[1], value: amount
      })

      await expectEvent.inLogs(receipt.logs, 'NewBill', { 
        payer: accounts[1],
        collector: wallet.address
      })

      it('Increase bill when more amount is sent', async function() {
        let amount = toBN(2).mul(perBlockFee)
        await althea.methods['addBill()']({value: amount})
        await althea.methods['addBill()']({value: amount})
        let total = amount.mul(toBN(2))
        let bill = await althea.billMapping(accounts[0])
        assert(bill.balance.eq(total))
      })
    })

    it('Contract ether balance should increase', async function() {
      let balance = toBN(10).mul(perBlockFee)
      await althea.sendTransaction({value: balance})
      let altheaBalance = await web3.eth.getBalance(althea.address)
      altheaBalance.should.eql(web3.utils.toBN(balance).toString())
    })

    it('Increase bill by corresponding amount', async function() {
      let amount = toBN(2).mul(perBlockFee)
      await althea.sendTransaction({value: amount})
      await althea.sendTransaction({value: amount})
      let total = amount.mul(toBN(2))
      let bill = await althea.billMapping(accounts[0])
      assert(bill.balance.eq(total))
    })
  })

  context('getCountOfSubscribers', function() {

    let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)

    it('Should have the right length', async function() {

      let min = Math.ceil(7)
      let max = Math.floor(2)
      let subnetDAOUsers = Math.floor(Math.random() * (max - min)) + min
      let value = toBN(2).mul(perBlockFee)

      let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)

      for (let i = 0; i < subnetDAOUsers; i++) {
        let ipv6 = web3.utils.randomHex(32)
        await althea.addMember(accounts[0], ipv6, nick, {from:root})
      }
      let subscribers = await althea.getCountOfSubscribers()
      subscribers.toNumber().should.eql(subnetDAOUsers)
    })
  })

  context('setPerBlockFee', function() {

    it('Should set a new perBlockFee', async function() {
      let newFee = 10**7
      await althea.setPerBlockFee(newFee, {from:root})
      nn = await althea.perBlockFee()
      nn.toNumber().should.eql(newFee)
    })
  })

  context('collectBills', function() {

    let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)

    it('Bill lastUpdated should equal current block number', async function() {
      let amount = toBN(2).mul(perBlockFee)
      await althea.addMember(
        accounts[0], web3.utils.randomHex(32), nick, {from:root}
      )
      await althea.methods['addBill()']({value: amount})
      await althea.collectBills()
      let bill = await althea.billMapping(accounts[0])
      let blockNumber = toBN(await web3.eth.getBlockNumber())
      bill.lastUpdated.toString().should.eql(blockNumber.toString())
    })

    it('Payment address should have increased in balance', async function() {

      let amount = toBN(5).mul(perBlockFee)
      let billBlock = (await althea.methods['addBill()']({value: amount}))
        .receipt.blockNumber
      // we need to add member to add it to the subnetSubscribers
      await althea.addMember(
        accounts[0], web3.utils.randomHex(32), nick, {from:root}
      )
      let previousBalance = toBN(await web3.eth.getBalance(wallet.address))

      let lastBlock = (await althea.collectBills()).receipt.blockNumber

      let expectedBalance = previousBalance
        .add(toBN(lastBlock - billBlock).mul(perBlockFee))

      assert.equal(
        toBN(await web3.eth.getBalance(wallet.address)),
        expectedBalance.toString()
      )
    })

    it('Collect from multiple bills', async function() {

      let balanceOne = perBlockFee.mul(toBN(20))
      let subscribersCount = 6
      for (var i = 0; i < subscribersCount; i++) {
        await althea.addMember(
          accounts[i], web3.utils.randomHex(32), nick, {from:root}
        )
      }
      for (var i = 0; i < subscribersCount; i++) {
        await althea.methods['addBill()']({from: accounts[i], value: balanceOne})
      }

      const billCount = toBN(summation(subscribersCount))
      let expectedBalance = perBlockFee.mul(billCount)
        .add(toBN(await web3.eth.getBalance(wallet.address)))

      await althea.collectBills()

      let currentBalance = toBN(await web3.eth.getBalance(wallet.address))
      currentBalance.eq(expectedBalance).should.eql(true)
    })

    it('Set bill account to zero', async function() {

      let balanceOne = perBlockFee.mul(toBN(2))
      await althea.methods['addBill()']({value: balanceOne})
      await althea.addMember(
        accounts[0], web3.utils.randomHex(32), nick, {from:root}
      )

      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      await althea.collectBills()
    })

    it(`Reverts when transfer value is zero`, async function() {

      await althea.addMember(
        accounts[0], web3.utils.randomHex(32), nick, {from:root}
      )
      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }
      await reverting(althea.collectBills())
    })

    it('Collect bills from bills that has no value and a bill with value', async function() {

      let balanceOne = perBlockFee.mul(toBN(2))
      await althea.methods['addBill()']({from: accounts[1], value: balanceOne})
      await althea.addMember(
        accounts[0], web3.utils.randomHex(32), nick, {from:root}
      )
      await althea.addMember(
        accounts[1], web3.utils.randomHex(32), nick, {from:root}
      )
      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }
      await althea.collectBills()
    })
  })

  context('payMyBills', function() {
    it('Bill should have lastUpdated with same blockNumber', async function() {

      let balanceOne = perBlockFee.mul(toBN(2))
      await althea.methods['addBill()']({value: balanceOne})
      await althea.payMyBills()
      let bill = await althea.billMapping(accounts[0])
      assert(bill.lastUpdated.eq(toBN(await web3.eth.getBlockNumber())))
    })

    it('Payment address should have increased balance', async function() {

      let balanceOne = perBlockFee.mul(toBN(10))
      const receipt= await althea.methods['addBill()']({value: balanceOne})

      // extra txns to run up the counter
      let blockCount = 5
      for (var i = 0; i < blockCount; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      // the +1 is for the payMyBills txn block number
      let expectedBalance = perBlockFee
        .mul(toBN(blockCount + 1))
        .add(toBN(await web3.eth.getBalance(wallet.address)))

      let txn = await althea.payMyBills()
      let currentBalance = toBN(await web3.eth.getBalance(wallet.address))
      console.log('expectedBalance', expectedBalance.toString())
      console.log('currentBalance', currentBalance.toString())
      currentBalance.eq(expectedBalance).should.eql(true)
    })

    it('Account of bill should be zero when it runs out', async function() {

      // the two is the amount of blocks to pass
      let balanceOne = toBN(2).mul(perBlockFee)
      await althea.methods['addBill()']({value: balanceOne})

      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      await althea.payMyBills()
      let bill = await althea.billMapping(accounts[0])
      bill.balance.toString().should.eql('0')
    })
  })

  context('withdrawFromBill', function() {
    it('Increases the balance of the subscriber', async function() {

      const A = accounts[8]
      let deposit = 10
      let value = toBN(deposit).mul(perBlockFee)

      // For some reason truffle isn't recognizing the function overload
      await althea.methods['addBill()']({from: A, value})
      let blockCount = 5
      await mineBlocks(blockCount)

      const oldBalance = toBN(await web3.eth.getBalance(A))
      let receipt = await althea.withdrawFromBill({from: A})
      let txn = await web3.eth.getTransaction(receipt.tx)
      let cost = toBN(receipt.receipt.gasUsed*txn.gasPrice)
     
      let expectedBalance = oldBalance
        // The total deposit at the beggining
        .add(value)
        // the amount of blocks that have passed times the perBlcok fee
        .sub(perBlockFee.mul(toBN(blockCount + 1)))
        // txn cost
        .sub(cost)

      const current = toBN(await web3.eth.getBalance(A))
      expectedBalance.eq(current).should.eql(true)
    })
    
    it('It reverts (saves gas) when the account has 0', async function() {

      let balanceOne = toBN(2).mul(perBlockFee)
      await althea.methods['addBill()']({from: accounts[1], value: balanceOne})

      // extra txns to run up the counter
      for (var i = 0; i < 10; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }
      await reverting(althea.withdrawFromBill({from: accounts[1]}))
    })
  })
})
