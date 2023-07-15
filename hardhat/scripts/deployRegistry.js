const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });


async function main() {

  // deploy Blog contract
  const registryContract = await ethers.getContractFactory("Registry");
  const deployedRegistryContract = await registryContract.deploy();
  await deployedRegistryContract.deployed();
  console.log('Maven contract address : ', deployedRegistryContract.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});