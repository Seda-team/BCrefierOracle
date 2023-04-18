const Web3 = require('web3')
const fs = require('fs')
const hasherJson = fs.readFileSync('Hasher.json')
const hasherData = JSON.parse(hasherJson)
const abi = hasherData.abi
const bytecode = hasherData.bytecode
console.log(abi)