const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require("@noble/secp256k1")

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

let privateKeyOne = secp.utils.randomPrivateKey();

privateKeyOne  = Buffer.from(privateKeyOne).toString("hex");

console.log(privateKeyOne);

let publicKeyOne = secp.getPublicKey(privateKeyOne);

publicKeyOne = Buffer.from(publicKeyOne).toString("hex");

publicKeyOne = "0x" + publicKeyOne.slice(publicKeyOne.length - 40);

console.log(publicKeyOne)


const balances = {
  [publicKeyOne]: 100,
  "2": 50,
  "3": 75,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
