const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC("secp256k1");
const SHA256 = require('crypto-js/sha256');


// const ec = new EC('secp256k1');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {};

for ( let i = 0; i < 3 ; i++){
  const key = ec.genKeyPair();
  // console.log(key);
  const publicKey = key.getPublic().encode("hex");

  balances[publicKey] = 100;

  console.log(`Public key --> ${publicKey} --> Private key --> ${key.getPrivate().toString(16)}`)
}

console.log(balances);

// let publicKeys = [];
// let privateKeys = [];
// let publicAndPrivateKey = [];

// for (let i = 0 ; i < 3 ; i++){
//   let privateKeyOne = secp.utils.randomPrivateKey();

// privateKeyOne  = Buffer.from(privateKeyOne).toString("hex");

// privateKeys.push(privateKeyOne);

// let publicKeyOne = secp.getPublicKey(privateKeyOne);

// publicKeyOne = Buffer.from(publicKeyOne).toString("hex");

// publicKeys.push("0x" + publicKeyOne.slice(publicKeyOne.length - 40));

// }

// console.log(publicKeys);
// console.log(privateKeys);

// for (let i  =0 ; i < publicKeys.length; i ++){
//   publicAndPrivateKey.push(publicKeys[i] + ":" + privateKeys[i])
// }

// console.log(publicAndPrivateKey);

// const balances = {
//   [publicKeys[0]]: 100,
//   [publicKeys[1]]: 50,
//   [publicKeys[2]]: 75,
// }

// console.log(balances);

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address.toLocaleLowerCase()] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {transaction, signature, publicKey} = req.body;
  console.log("watch" + transaction);
  console.log(signature);

  const key = ec.keyFromPublic(publicKey, "hex");

  const hash = SHA256(JSON.stringify(transaction).toString()); 

  if(key.verify(hash, signature)){
    balances[publicKey] -= transaction.amount;
    balances[transaction.recipient] = (balances[transaction.recipient] || 0) + +transaction.amount;
    res.send({ balance: balances[publicKey]});
  } else{
    res.sendStatus(400);
  }
 
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
