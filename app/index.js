const Express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../core/Blockchain');
const P2PServer = require('./p2p-server');
const WebSocket = require('ws');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = Express();
const bc = new Blockchain();
const p2pServer = new P2PServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.getChain());
});

app.post('/mine', (req,res) => {
   const block = bc.addBlock(req.body.data);
   console.log(`New block added:${block.toString()}`);

   const socket = new WebSocket("ws://localhost:5001");
   
   socket.on('open', () => {})

   p2pServer.sendChain();
    
   res.redirect("./blocks");
});


app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();