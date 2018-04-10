const TransactionPool = require('./TransactionPool');
const Transaction = require('./Transaction');
const Wallet = require('./Wallet');


describe('Transcationpool', () => {
    let tp, wallet, transaction;

    beforeEach( () => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
        tp.updateOrAddTransaction(transaction)
    });

    it('adds a transaction to the pool', () => {
        expect(tp.getTransactions().find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);

        const newTranscation = transaction.update(wallet, 's3c0nd-4dr355', 50);

        tp.updateOrAddTransaction(newTranscation);

        expect(JSON.stringify(tp.getTransactions().find(t => t.id === newTranscation.id))).not.toEqual(oldTransaction);
        
    })
});
