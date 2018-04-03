const Blockchain = require('./BlockChain');
const Block = require('./Block');

describe('BlockChain', () => {
    let bc,bc2;
    
    beforeEach( () => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });
    
    it ('starts with genesis block', () => {
        expect(bc.getChain()[0]).toEqual(Block.genesis());
    });
    
    it ('adds a new block', () => {
        bc.addBlock('foo');
        
        expect(bc.getChain()[bc.getChain().length-1].getData()).toEqual('foo');
    } );
    
    it ('Validates a valid chain', () => {
        bc2.addBlock('foo');
        
        expect(bc.isValidChain(bc2.getChain())).toBe(true);
    });
    
    it('Invalidates a chain with a corrupt genesis block', () => {
        bc2.getChain()[0].setData('corrupted');
        
        expect(bc.isValidChain(bc2.getChain())).toBe(false);
    });
    
    it('Invalidates a corrupt chain', () => {
       bc2.addBlock('foo') ;
       bc2.getChain()[bc2.getChain().length-1].setData('corrupted');
       
       expect(bc.isValidChain(bc2.getChain())).toBe(false);
    });
    
    it('Replaces the chain with a valid chain', () => {
       bc2.addBlock('goo');
       bc.replaceChain(bc2.getChain());
        
       expect(bc.getChain()).toEqual(bc2.getChain());
    });
    
    it('Not replace the chain with one of less than or equal to length', () => {
        bc.addBlock('ei');
        bc2.addBlock('saw');
        
        bc.replaceChain(bc2.getChain());
        
        expect(bc.getChain()).not.toEqual(bc2.getChain());
    })
})