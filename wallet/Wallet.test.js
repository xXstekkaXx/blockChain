const Wallet = require('./Wallet');
const TransactionPool = require('./TransactionPool');
const Blockchain = require('../core/Blockchain');


describe('Wallet', () => {
    let wallet, tp, bc;
  
    beforeEach(() => {
      wallet = new Wallet();
      tp = new TransactionPool();
      bc = new Blockchain();
    });
  
    describe('creating a transaction', () => {
      let transaction, sendAmount, recipient;
  
      beforeEach(() => {
        sendAmount = 50;
        recipient = 'r4nd0m-4ddr355';
        transaction = wallet.createTransaction(recipient, sendAmount, tp);
      });
  
      describe('and doing the same transaction', () => {
        beforeEach(() => {
          wallet.createTransaction(recipient, sendAmount, tp);
        });
  
        it('doubles the `sendAmount` subtracted from the wallet balance', () => {
          expect(transaction.outputs.find(output => output.address === wallet.getPublicKey()).amount)
            .toEqual(wallet.balance - sendAmount * 2);
        });


        it('clones the sendAmount for the recipient', () => {
            expect(transaction.outputs.filter(output => output.address === recipient)
            .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
        })

      });
  });

});