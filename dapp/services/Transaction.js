(
  function(){
    angular
    .module('multiSigWeb')
    .service('Transaction', function(Wallet, $rootScope){
      var factory = {
        transactions: JSON.parse(localStorage.getItem("transactions")) || {}
      };

      factory.add = function(tx){
        factory.transactions[tx.txHash] = tx;
        tx.date = new Date();
        localStorage.setItem("transactions", JSON.stringify(factory.transactions));
        try{
          $rootScope.$digest();
        }
        catch(e){

        }
      }

      factory.remove = function(txHash){
        delete factory.transactions[txHash];
        localStorage.setItem("transactions", JSON.stringify(factory.transactions));
        try{
          $rootScope.$digest();
        }
        catch(e){

        }
      }

      factory.removeAll = function(){
        factory.transactions = {};
        localStorage.removeItem("transactions");
        try{
          $rootScope.$digest();
        }
        catch(e){

        }
      }

      factory.send = function(tx, cb){
        Wallet.web3.eth.sendTransaction(tx, function(e, txHash){
          if(e){
            cb(e);
          }
          else{
            factory.add({txHash: txHash, callback: function(receipt){cb(null, receipt)}});
            cb(null, txHash);
          }
        });
      }

      factory.signOffline = function(tx, cb){

        // Create transaction object
        var txInfo = {
          to: tx.to,
          value: EthJS.Util.intToHex(tx.value),
          gasPrice: '0x' + Wallet.txParams.gasPrice.toNumber(16),
          gasLimit: EthJS.Util.intToHex(Wallet.txParams.gasLimit),
          nonce: EthJS.Util.intToHex(tx.nonce)
        }

        var tx = new EthJS.Tx(txInfo);

        // Get transaction hash
        var txHash = EthJS.Util.bufferToHex(tx.hash(false));

        // Sign transaction hash
        Wallet.web3.eth.sign(Wallet.coinbase, txHash, function(e, signature){
          if(e){
            cb(e);
          }
          var signature = EthJS.Util.fromRpcSig(signature);
          tx.v = EthJS.Util.intToHex(signature.v);
          tx.r = EthJS.Util.bufferToHex(signature.r);
          tx.s = EthJS.Util.bufferToHex(signature.s);

          // Return raw transaction as hex string
          cb(null, EthJS.Util.bufferToHex(tx.serialize()));
        });
      }

      factory.signMethodOffline = function(tx, abi, method, params, cb){

        // Get data
        var instance = Wallet.web3.eth.contract(abi).at(tx.to);

        var data = instance[method].getData.apply(this, params);

        // Create transaction object
        var txInfo = {
          to: tx.to,
          value: EthJS.Util.intToHex(tx.value||0),
          gasPrice: '0x' + Wallet.txParams.gasPrice.toNumber(16),
          gasLimit: EthJS.Util.intToHex(Wallet.txParams.gasLimit),
          nonce: EthJS.Util.intToHex(tx.nonce),
          data: data
        }

        var tx = new EthJS.Tx(txInfo);

        // Get transaction hash
        var txHash = EthJS.Util.bufferToHex(tx.hash(false));

        // Sign transaction hash
        Wallet.web3.eth.sign(Wallet.coinbase, txHash, function(e, signature){
          if(e){
            cb(e);
          }
          var signature = EthJS.Util.fromRpcSig(signature);
          tx.v = EthJS.Util.intToHex(signature.v);
          tx.r = EthJS.Util.bufferToHex(signature.r);
          tx.s = EthJS.Util.bufferToHex(signature.s);

          // Return raw transaction as hex string
          cb(null, EthJS.Util.bufferToHex(tx.serialize()));
        });
      }

      factory.sendMethod = function(tx, abi, method, params, cb){
        // Instance contract
        var instance = Wallet.web3.eth.contract(abi).at(tx.to);
        var transactionParams = params.slice();

        // sendTransction takes (param1, param2, ..., paramN, txObject, cb)
        transactionParams.push({
          to: tx.to?tx.to:null,
          value: tx.value?tx.value:null,
          data: tx.data?tx.data:null,
          nonce: tx.nonce          
        });
        transactionParams.push(function(e, txHash){
          if(e){
            cb(e);
          }
          else{
              // Add transaction
              factory.add({txHash: txHash, callback: function(receipt){cb(null, receipt)}});
              cb(null, txHash);
          }
        });
        instance[method].sendTransaction.apply(this, transactionParams);

      }

      // Transaction loop, checking transaction receipts
      factory.checkReceipts = function(){
        // Create batch object
        var batch = Wallet.web3.createBatch();

        // Add transactions without receipt to batch request
        var txHashes = Object.keys(factory.transactions);

        for(var i=0; i<txHashes.length; i++){
          var tx = factory.transactions[txHashes[i]];
          if(tx && !tx.receipt){
            batch.add(
              Wallet.web3.eth.getTransactionReceipt.request(txHashes[i], function(e, receipt){
                if(!e && receipt){
                  factory.transactions[receipt.transactionHash].receipt = receipt;
                  // call callback if it has
                  if(factory.transactions[receipt.transactionHash].callback){
                    factory.transactions[receipt.transactionHash].callback(receipt);
                  };

                  // update transactions
                  localStorage.setItem("transactions", JSON.stringify(factory.transactions));
                  try{
                    $rootScope.$digest();
                  }
                  catch(e){

                  }
                }
              })
            );
          }
        }

        batch.execute();
        setTimeout(factory.checkReceipts, 15000);
      }

      factory.checkReceipts();

      return factory;
    });
  }
)();