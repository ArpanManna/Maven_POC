const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });


async function main() {

  // deploy Blog contract
  const accountContract = await ethers.getContractFactory("ERC6551Account");
  const deployedAccountContract = await accountContract.deploy();
  await deployedAccountContract.deployed();
  console.log('Maven contract address : ', deployedAccountContract.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});