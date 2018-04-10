const ChainUtil = require("../chain-util");

class Transaction{

    constructor()
    {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    //region methods

    //aggiunge un ulteriore transazione ad una già esistente
    update(senderWallet, recipient, amount){
        const senderOutput = this.outputs.find(output => output.address === senderWallet.getPublicKey());

        if (amount > senderOutput.amount)
        {
            console.log(`Amount ${amount} exceeds balance`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;

        //invalidate the transaction verify
        this.outputs.push({amount, address: recipient});

        Transaction.signTransactions(this, senderWallet);

        return this;
    }





    //return a transcation an initialized transaction object
    static newTransaction(senderWallet, recipient, amount)
    {
        

        //controlla se la transazione richiede un importo maggiore
        //al totale del conto
        if (amount > senderWallet.getBalance())
        {
            console.log(`Amount: ${amount} exceeds balance`);
            return;
        }

        const transaction = new this();

        //mette due dati dentro l'array outputs 
        //il primo dato continete amount e address, amount è il totale rimanente 
        //nel conto del mittente dei coin, address invece è l'indirizzo del wallet del mittente
        //indicato dall publickey

        //il secondo dato contiene amount e address, amount qui invece è il totale dei coin inviati 
        //al destinatario, address è il l'indirizzo del wallet del destinatario
        //indicato dalla publicKey
        transaction.outputs.push(...[
            {amount: senderWallet.getBalance() - amount, address: senderWallet.getPublicKey()},
            {amount, address: recipient}
        ]);

        //segna la transazione univocamente in modo tale da poter essere verificata
        Transaction.signTransactions(transaction, senderWallet);

        //ritorna la transazione inizializzata
        return transaction;
    }

    //segna una transazione 
    static signTransactions(transaction, senderWallet)
    {
        //popola l'array input dentro l'oggetto passato transaction
        //timestamp = ora in cui viene effettuata la transazioni
        //amount = totale coin del mittente
        //address = indirizzo del mittente indicato con la publicKey
        //signature = ritorna un valore segnato univocamente con il keyPair del wallet
        //(segna gli output dell'oggetto passato transaction)
        //(gli output passati vengono criptati per avere un valore fisso
        // e non avere differenze di calcolo della signature)
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.getBalance(),
            address: senderWallet.getPublicKey(),
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    //verifica i dati della transazione 
    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
    //endregion
}

module.exports = Transaction;