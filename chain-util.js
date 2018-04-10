const EC = require("elliptic").ec;
const uuidV1 = require("uuid/v1");
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');



class ChainUtil {

    static genKeyPair()
    {
        return ec.genKeyPair();
    }

    //return method
    static id()
    {
        return uuidV1();
    }

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }



                         //publicKey is used to verification
                         //signature is the thing we are going to verify
                         //dataHash is the data we want find decypring itself with the signature
    static verifySignature(publicKey, signature, dataHash){

        //ritorna un valore true o false se la verifica è andata a buon fine o meno
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
    }
}


module.exports = ChainUtil;