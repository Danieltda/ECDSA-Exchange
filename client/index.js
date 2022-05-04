import "./index.scss";
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC("secp256k1");


const server = "http://localhost:3042";

//Test
document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  const privatekey = document.getElementById("privatekey").value;

const transaction = {amount, recipient} 

const key = ec.keyFromPrivate(privatekey, "hex");

const publicKey = key.getPublic().encode("hex");

const signature = key.sign(SHA256(JSON.stringify(transaction).toString())); 

console.log(signature);

  const body = JSON.stringify({
    transaction , signature, publicKey
  });



  

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance}) => {
    document.getElementById("balance").innerHTML = balance;
  });
});
