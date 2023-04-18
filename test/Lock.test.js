const { expect } = require("chai");
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { bigInt } = require('snarkjs');

describe("Lock", function () {
  it("Should set the right unlockTime", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    const [owner, otherAccount] = await ethers.getSigners();
    // deploy a lock contract where funds can be withdrawn
    // one year in the future
    const Hash = await hre.ethers.getContractFactory("Mimc2");
    const hash = await Hash.deploy();
    //await Hash.deployed();

    const Verifier = await hre.ethers.getContractFactory("SpendVerifier");
    const verifier = await Verifier.deploy();
    //await Verifier.deployed();

    const CreditOracle = await hre.ethers.getContractFactory("CreditOracle");
    const creditOracle = await CreditOracle.deploy(verifier.address,hash.address,4);
    //await CreditOracle.deployed();
    const gg = await creditOracle.connect(owner).deposit("17404102807816602374793720496511774185300157846553191908893116882975962743167");
    console.log(gg);
    expect(await creditOracle.haveCommitment("17404102807816602374793720496511774185300157846553191908893116882975962743167")).to.equal(true);

    
    // assert that the value is correct
  });
});