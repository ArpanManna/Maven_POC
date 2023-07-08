const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });


async function main() {

  // deploy Blog contract
  const mavenContract = await ethers.getContractFactory("Maven");
  const deployedMavenContract = await mavenContract.deploy();
  await deployedMavenContract.deployed();
  console.log('Maven contract address : ', deployedMavenContract.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});