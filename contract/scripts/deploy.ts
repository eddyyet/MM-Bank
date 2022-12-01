import { ethers } from "hardhat";

async function main() {
  const MMDContract = await ethers.getContractFactory("MMDToken");
  const MMDcontract = await MMDContract.deploy();
  await MMDcontract.deployed();

  const MMDaddress = MMDcontract.address;
  console.log("MMD Contract deployed to:", MMDaddress);

  const MMDvalue = await MMDcontract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance:", MMDvalue.toString());

  const CMMDContract = await ethers.getContractFactory("CMMDToken");
  const CMMDcontract = await CMMDContract.deploy(MMDaddress);
  await CMMDcontract.deployed();

  const CMMDAddress = await CMMDcontract.address;
  console.log("CMMD Contract deployed to:", CMMDAddress);

  await MMDcontract.setCMMDAddress(CMMDAddress);

  const CMMDvalue = await CMMDcontract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance:", CMMDvalue.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

