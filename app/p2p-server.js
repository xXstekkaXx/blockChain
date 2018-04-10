const WebSocket = require("ws");
const express = require('express');
const Blockchain = require('../core/Blockchain');


const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer
{
    //region constructor
    constructor(blockchain){
        this.blockchain = blockchain;
        this.socketArray = [];
    }
    
    //endregion

    //region methods
    listen()
    {
        //istanzia l'oggetto server
        const server = new WebSocket.Server({ port : P2P_PORT });

        
        
        //event handler dell'ascolto e se si collega un socket 
        //passa l'url del socket al metodo connectSocket che lo aggiunge alla lista
        //dei socket attivi (SERVER PART)
        server.on('connection', socket => this.connectSocket(socket));
    
        //controlla i peer(gli altri dispositivi) nella lista delle connessioni 
        //e si collega ad ognuno di essi (CLIENT PART)
        this.connectToPeers();
        
        
        //log server aperto ai peers
        console.log(`Listening for P2P connections on:${P2P_PORT}`);
    }

    //(CLIENT PART)
    connectToPeers(){
        //prende la variabile peers che contiene tutti i gli indirizzi 
        //url dei peers e si collega ad ognuno di essi
        peers.forEach( peer => {
        //crea un oggetto websocket prendendo come paramatro l'url            
        const socket  = new WebSocket(peer);
        
        //invoca il metodo connecSocket per ogni url socket nella lista
        socket.on('open', () => this.connectSocket(socket));
      });
    }
    
    //(CLIENT PART and SERVER PART)
    connectSocket(socket){
        //aggiunge l'url passato come parametro alla lista dei socket attivi 
        this.socketArray.push(socket);
        console.log('socket connected');

        //event handler of messages (SERVER PART)
        this.messageHandler(socket);
        
        this.sendChain(socket);
    }


    messageHandler(socket) {

        console.log("message handler => socket readyState: " + socket.readyState);

        socket.on('message', message => {
            //legge il messaggio
            console.log("message handler triggered");
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
        });

        console.log("message listening")
    }

    
    sendChain(socket){

        
        console.log("sendchain => socket readyState: " + socket.readyState);

        socket.send(JSON.stringify(this.blockchain.getChain()));
        
        console.log("sended?")

        //invia la blockchain al socket passato come parametro 
        //(CLIENT PART)
    }
    
    
    syncChains()
    {
        
        //invia a tutti i peers connessi la blockChain aggiornata
        this.socketArray.forEach( clientSocket => {

            console.log(clientSocket.readyState);
            this.sendChain(clientSocket);
            //this.sendChain(socket);
        });
    }

    //endregion
}

module.exports = P2PServer;