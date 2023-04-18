const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  const Hash = await hre.ethers.getContractFactory("Mimc2");
  const hash = await Hash.deploy();
  hash.deployed();
  //await Hash.deployed();

  console.log(
    `Hash: ${hash.address}`
  );

  const Verifier = await hre.ethers.getContractFactory("SpendVerifier");
  const verifier = await Verifier.deploy();
  verifier.deployed();
  //await Verifier.deployed();
  console.log(
    `Verify: ${verifier.address}`
  );
  const CreditOracle = await hre.ethers.getContractFactory("CreditOracle");
  const creditOracle = await CreditOracle.deploy(verifier.address,hash.address,4);
  await creditOracle.deployed();
  
  console.log(
    `Address: ${creditOracle.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
