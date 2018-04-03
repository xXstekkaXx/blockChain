const ChainUtil = reuqire("../chain-util");

class Transaction{

    constructor()
    {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    static newTransaction(senderWallet, recipient, amount)
    {
        const transaction = new this();

        if (amount > senderWallet.getBalance())
        {
            console.log(`Amount: ${amount} exceeds balance`);
            return;
        }

        transaction.outputs.push(...[
            {amount: senderWallet.getBalance() - amount, address: senderWallet.getPublicKey()}
        ])
    }
}