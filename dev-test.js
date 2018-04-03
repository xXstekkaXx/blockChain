const BlockChain = require('./core/Blockchain');

const bc = new BlockChain();

for (let i = 0; i < 10; i++)
{
    console.log(bc.addBlock(`foo ${i}`).toString());
}
