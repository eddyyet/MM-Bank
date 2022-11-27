import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("MMDToken");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  const value = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance:", value.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
