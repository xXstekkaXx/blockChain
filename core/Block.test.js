const Block = require('./Block');
const {DIFFICULTY, MINE_RATE} = require('../config.js');

describe('Block', () => {
    let data, lastBlock, block;
    
    beforeEach( () => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });
    
    it('sets the `data` to match the input', () => {
        expect(block.getData()).toEqual(data);
    });
    
    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.getLastHash()).toEqual(lastBlock.getHash());
    });
    
    /*it('Generates a HASH that matches this difficulty', () => {
         expect(block.mineBlock(lastBlock, []).substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY)) ;
         console.log(block.toString());
    });*/

    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDiffculty(block, block.getTimestamp()+360000))
        .toEqual(block.getDifficulty() - 1);
    });

    
    it('Raises the difficulty for quickly mined blocks', () => {
        expect(Block.adjustDiffculty(block, block.getTimestamp()+1))
        .toEqual(block.getDifficulty() + 1);
    });
})