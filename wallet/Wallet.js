const {INITIAL_BALANCE} = require("../config");
const ChainUtil = require("../chain-util");
const Transaction = require('./Transaction');

class Wallet{

    constructor()
    {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString()
    {
        return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance.toString()}`;
    }

    sign(dataHash){

        //call a method of the keyPair that sign the data passed
        //with the key
        return this.keyPair.sign(dataHash)
    }

    createTransaction(recipient, amount, transactionPool)
    {
        if (amount > this.balance)
        {
            console.log(`Amount ${amount} exceeds the current balance ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction)
        {
            transaction.update(this, recipient, amount);
        }else{
            transaction = Transaction.newTransaction(this, recipient, amount);

            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    //region getters and setters

    getBalance()
    {
        return this.balance;
    }

    getPublicKey()
    {
        return this.publicKey;
    }

    //endregion
}

module.exports = Wallet;