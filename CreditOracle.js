// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //                  
//const Web3 = require('web3'); 

//const { addABI } = require("abi-decoder");

// sets up web3.js
//const fs = require('fs')
//const assert = require('assert')
//const { bigInt } = require('snarkjs')
//const crypto = require('crypto')
//const Web3 = require('web3')
//const { toWei } = require('web3-utils')
const web3 = new Web3("ws://127.0.0.1:8545/");
//const mimc = require("./src/mimc");
//const compute_spend_input = require("./src/compute_spend_inputs");

const exchange_name = "Credit Oracle"; // TODO: fill in the name of your exchange

const netId = 6;

let give_code = "underfi";
            // TODO: replace with symbol for your token

var BN = web3.utils.BN;


// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================
// TODO: Paste your token contract address and ABI here:
const CreditOracle_address = '0x4826533B4897376654Bb4d4AD88B7faFD0C98528';                   
const CreditOracle_abi = [
  {
    "inputs": [
      {
        "internalType": "contract IVerifier",
        "name": "_verifier",
        "type": "address"
      },
      {
        "internalType": "contract IHasher",
        "name": "_hasher",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "_merkleTreeHeight",
        "type": "uint32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "leafIndex",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "FIELD_SIZE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ROOT_HISTORY_SIZE",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "s",
        "type": "string"
      }
    ],
    "name": "StringToUint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ZERO_VALUE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "commitments",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "commitments_chose",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentRootIndex",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_commitment",
        "type": "string"
      }
    ],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "filledSubtrees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastRoot",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "hasher",
    "outputs": [
      {
        "internalType": "contract IHasher",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      }
    ],
    "name": "haveCommitment",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_root",
        "type": "uint256"
      }
    ],
    "name": "isKnownRoot",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "levels",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextIndex",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "nullifierHashes",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "roots",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verifier",
    "outputs": [
      {
        "internalType": "contract IVerifier",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "p",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "digest",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "amount",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "balance",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "liquidition",
        "type": "string"
      },
      {
        "internalType": "uint256[]",
        "name": "op",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "i",
        "type": "uint256"
      }
    ],
    "name": "zeros",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
] ;             
const CreditOracle_contract = new web3.eth.Contract(CreditOracle_abi, CreditOracle_address);

var defaultAccount;

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

const rbigint = (Max) => Math.floor(Math.random() * Max) + 1;
// res = BigInt(0);
//   console.log(rbigint(31));

//  byte[] by


// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

const save = {};

async function Real_Time() {
  const today = new Date();

// ⚠️ JS returns the value in miliseconds
const mseconds = today.getTime();

// divided to get the just seconds
const seconds = Math.floor(mseconds / 1000);

// single liner
const dateInSecs = await Math.floor(new Date().getTime() / 1000);

return dateInSecs;
}

async function deposit(amount, balance, liquidation,op1,op2,op3) {
  const _deposit = await createDeposit(amount, balance, liquidation,op1,op2,op3,rbigint(1000));
 
  const have_commitment = await CreditOracle_contract.methods.haveCommitment(_deposit.commitment.toString()).call({from:web3.eth.defaultAccount});;
  
   if (have_commitment == true) await deposit(amount, balance, liquidation,op1,op2,op3);
   //console.log(await CreditOracle_contract.methods.haveCommitment(`"${_deposit.commitment}"`).call({from:web3.eth.defaultAccount}));
  // console.log(_deposit.commitment);
   _deposit.note  = `creditoracle-dex-${_deposit.amount}-${_deposit.balance}-${_deposit.liquidation}-${_deposit.op1}-${_deposit.op2}-${_deposit.op3}-${_deposit.nonce}`; 
   
   return _deposit
}

async function aa () {
  const events = await CreditOracle_contract.getPastEvents('Withdrawal', { fromBlock: 0, toBlock: 'latest' })
  
  
    console.log(events);
}
aa();
ffg
async function createDeposit(amount, balance, liquidation,op1,op2,op3,nonce) {
  let deposit = { amount, balance, liquidation,op1,op2,op3,nonce }
  
  const commitment1 = mimc2(deposit.amount,deposit.balance);
  const commitment2 = mimc2(commitment1,deposit.liquidation);
  const commitment3 = mimc2(commitment2,op1);
  const commitment4 = mimc2(commitment3,op2);
  const commitment5 = mimc2(commitment4,op3);
  const commitment6 = mimc2(commitment5,nonce);
  deposit.commitment = commitment6;
  
  //console.log(await deposit.time);
  return deposit;
}

async function DepositRank(amount, balance, liquidation,op1,op2,op3) {
  /** TODO: ADD YOUR CODE HERE **/
  const _deposit = await deposit(amount, balance, liquidation,op1,op2,op3);
 // console.log(_deposit.time);
  const tt= await CreditOracle_contract.methods.deposit(_deposit.commitment.toString()).send({from : web3.eth.defaultAccount });
  //console.log(await CreditOracle_contract.methods.haveCommitment(_deposit.commitment.toString()).call({from:web3.eth.defaultAccount }));
 
  give_code = _deposit.note;
}


//3205135046957827396433263229003174327607794027970218938062433571586909524134
async function parseNote(noteString) {
  const noteRegex = /creditoracle-dex-(?<amount>[\d.]+)-(?<balance>[\d.]+)-(?<liquidation>[\d.]+)-(?<op1>[\d.]+)-(?<op2>[\d.]+)-(?<op3>[\d.]+)-(?<nonce>\w+)/g; 
  const match = noteRegex.exec(noteString)
  //console.log(match.groups.netId);
  //console.log(match.rank);
  //console.log(rank);
  // const match = noteRegex.exec(noteString)

  // // we are ignoring `currency`, `amount`, and `netId` for this minimal example
  // const buf = Buffer.from(match.groups.note, 'hex')
   const amount = match.groups.amount;
   const balance = match.groups.balance;
   const liquidation = match.groups.liquidation;
   const nonce = match.groups.nonce;
   const op1 = match.groups.op1;
   const op2 = match.groups.op2;
   const op3 = match.groups.op3;
   return createDeposit(amount, balance, liquidation,op1,op2,op3,nonce);
}

async function generateMerkleProof(deposit) {
  console.log('Getting contract state...')
  const events = await CreditOracle_contract.getPastEvents('Deposit', { fromBlock: 0, toBlock: 'latest' })
  //console.log(events);
  const leaves = events
    .sort((a, b) => a.returnValues.leafIndex - b.returnValues.leafIndex) // Sort events in chronological order
    .map((e) => e.returnValues.commitment)
   //console.log(leaves);
    const snark_input = await  computeInput(4,leaves,deposit.amount,deposit.balance,deposit.liquidation,deposit.op1,deposit.op2,deposit.op3,deposit.nonce);

  // Find current commitment in the tree
  return snark_input;
}

/**
 * Generate SNARK proof for withdrawal
 * @param deposit Deposit object
 * @param recipient Funds recipient
 */
async function withdraw(note) {
  const deposit = await parseNote(note);
  //console.log(deposit);
  // Compute merkle proof of our commitment
  const input = await generateMerkleProof(deposit)
  //console.log(input);

  // Prepare circuit inpu

  if (input == null) await CreditOracle_contract.methods.notificationError();

  const {proof , publicSignals } = await snarkjs.groth16.fullProve(
    input, 
    `\\circom\\spend_js\\spend.wasm`,
    `\\circom\\spend_final.zkey`,
    );

    const proofData = proof ;

    proofData.publicSignals = publicSignals;

    console.log('Sending withdrawal transaction...')

    const proofInputToSolidity = toSolidityInput(proofData);
    
    const p = [];
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_a"][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_a"][1]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][0][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][0][1]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][1][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][1][1]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_c"][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_c"][1]));
    const op = [];
    op.push(input.op1);
    op.push(input.op2);
    op.push(input.op3);
  //  // console.log(web3.eth.abi.decodeParameter('uint[][]',proofInputToSolidity["pi_b"]));
 
  //   //console.log(await web3.utils.hexToNumber(proofInputToSolidity.publicSignals[1]));
 
    const tx = await CreditOracle_contract.methods.withdraw( 
     p,input.digest,input.amount,input.balance,input.liquidition,op,deposit.commitment).send({from:web3.eth.defaultAccount});
   }

async function Computer_Input(rank,time, nonce) {
  //const deposit = createDeposit(rank,secret);
  const transcript = await CreditOracle_contract.rallyCommitment().call({from : web3.eth.defaultAccount});
  const snark_input = await  computeInput(4,transcript,rank,time,nonce);
  return snark_input;
}
/*** SWAP ***/

function stringifyBigInts(o) {
  if ((typeof(o) == "bigint") || o.isZero !== undefined)  {
      return o.toString(10);
  } else if (Array.isArray(o)) {
      return o.map(stringifyBigInts);
  } else if (typeof o == "object") {
      const res = {};
      for (let k in o) {
          res[k] = stringifyBigInts(o[k]);
      }
      return res;
  } else {
      return o;
  }
}

function unstringifyBigInts(o) {
  if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
      return bigInt(o);
  } else if (Array.isArray(o)) {
      return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
      const res = {};
      for (let k in o) {
          res[k] = unstringifyBigInts(o[k]);
      }
      return res;
  } else {
      return o;
  }
}

function hexifyBigInts(o) {
  if (typeof (o) === "bigInt" || (o instanceof bigInt)) {
      let str = o.toString(16);
      while (str.length < 64) str = "0" + str;
      str = "0x" + str;
      return str;
  } else if (Array.isArray(o)) {
      return o.map(hexifyBigInts);
  } else if (typeof o == "object") {
      const res = {};
      for (let k in o) {
          res[k] = hexifyBigInts(o[k]);
      }
      return res;
  } else {
      return o;
  }
}


function toSolidityInput(proof) {
  const result = {
      pi_a: [proof.pi_a[0], proof.pi_a[1]],
      pi_b: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
      pi_c: [proof.pi_c[0], proof.pi_c[1]],
  };
  if (proof.publicSignals) {
      result.publicSignals = proof.publicSignals;
  }
  return hexifyBigInts(unstringifyBigInts(result));
}



// =============================================================================
//                           	UI (DO NOT MOFIDY)
// =============================================================================




//Allows switching between accounts in 'My Account'
web3.eth.getAccounts().then((response)=>{
    var opts = response.map(function (a) { return '<option value="'+
            a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
    $(".account").html(opts);
});



//This runs the 'swapETHForTokens' function when you click the button
$("#request-rank").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  DepositRank($("#amount-of-account").val(),$("#balance-of-account").val(),$("#liquidition-of-account").val(),$("#op1-of-account").val(),$("#op2-of-account").val(),$("#op3-of-account").val()).then((response)=>{
    $("#give-code").html(give_code);
    const myTimeout = setTimeout(myGreeting, 100000);
    //window.location.reload(true); 
        //$("#give-code").html(give_code);// refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

$("#withdraw").click(function() {
  web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  withdraw($("#note").val()).then((response)=>{
  $("#give-code").html(give_code);
  const myTimeout = setTimeout(myGreeting, 100000);
  //window.location.reload(true); 
      //$("#give-code").html(give_code);// refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

function myGreeting() {
  window.location.reload(true);
}

// Fills in relevant parts of UI with your token and exchange name info:
$("#request-rank").html("Request rank");

$("#title").html(exchange_name); 

//$("#give-code").html(give_code);


