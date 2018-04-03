const SHA256 = require('crypto-js/sha256');
const {DIFFICULTY, MINE_RATE} = require('../config.js');

class Block
{
    //region constructor

    // dati richiesti per la creazione di un qualsiasi blocco
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        
        //data in millisecondi di quando è stato creato
        this.timestamp = timestamp;
        
        //valore hash del blocco precedente
        this.lastHash = lastHash;
        
        //valore hash del blocco corrente
        this.hash = hash;
        
        //dati che il blocco trasporta (transazioni, valori ecc)
        this.data = data;
        
        //proof of work zeroes 
        this.nonce = nonce;

        //difficulty of proof of work
        this.difficulty = difficulty || DIFFICULTY;
    }
    
    //endregion

    //region methods

    //Creazione del blocco di genesi
    static genesis()
    {
        //il lastHash è vuoto poichè non esiste un blocco antecedente
        return new this('genesis Time', '-----', 'firstHash', [], 0, DIFFICULTY);
    }
    
    toString()
    {
        //gli hash sono ridotti a 10 cifre
        return `Block -
                TimeStamp : ${this.timestamp}
                Last Hash : ${this.lastHash.substring(0,10)}
                Hash      : ${this.hash.substring(0,10)}
                Nonce     : ${this.nonce}
                difficulty: ${this.difficulty}
                Data      : ${this.data}`;       
    }
    
    //ritorna l'hash del blocco corrente calcolandolo
    static hash(timestamp,lastHash, data, nonce, difficulty)
    {
        //metodo per ottenere il valore hash 
        //da una serie di informazioni 
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }
    
    //aggiunge un blocco che non sia il primo
    static mineBlock(lastBlock, data)
    {
        let hash, timestamp;

        //prende l'hash dell'ultimo blocco
        const lastHash = lastBlock.getHash();
        
        let {difficulty} = lastBlock;

        let nonce = 0;
        
        do{
            timestamp = Date.now();
            nonce++;
            difficulty = Block.adjustDiffculty(lastBlock, timestamp);
            hash = Block.hash(timestamp,lastHash, data, nonce, difficulty);
        }while(hash.substring(0, difficulty) !== '0'.repeat(difficulty) );
        
        //ritorna il nuovo blocck aggiunto
        return new this(timestamp, lastHash , hash, data, nonce, difficulty);
    }

    static adjustDiffculty(lastBlock, currentTime)
    {
        let { difficulty } = lastBlock;
        difficulty = (lastBlock.getTimestamp() + MINE_RATE) > currentTime ? difficulty + 1 : difficulty - 1; 
        return difficulty;
    }
    
    static blockHash(block){
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        
        return Block.hash(timestamp, lastHash, data, nonce, difficulty)
    }

    //endregion

    //region getters and setters

      getTimestamp()
      {
          return this.timestamp;
      }
      setTimeStamp(value)
      {
          this.timeStamp = value;
      }
      getLastHash()
      {
          return this.lastHash;
      }
      setLastHash(value)
      {
          this.lastHash = value;
      }
      getHash()
      {
          return this.hash;
      }
      setHash(value)
      {
          this.hash = value;
      }
      getData()
      {
          return this.data;
      }
      setData(value)
      {
          this.data = value;
      }
      getNonce(){
          return this.nonce;
      }

      setDifficulty(value)
      {
          this.difficulty = value;
      }

      getDifficulty()
      {
          return this.difficulty;
      }
      
      //endregion
}

module.exports = Block;