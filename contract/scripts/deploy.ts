import { ethers } from "hardhat";

async function main() {
  const MMDContract = await ethers.getContractFactory("MMDToken");
  const MMDcontract = await MMDContract.deploy();
  await MMDcontract.deployed();

  const MMDaddress = MMDcontract.address;
  console.log("MMD Contract deployed to:", MMDaddress);

  const CMMDContract = await ethers.getContractFactory("CMMDToken");
  const CMMDcontract = await CMMDContract.deploy(MMDaddress);
  await CMMDcontract.deployed();

  const CMMDAddress = await CMMDcontract.address;
  console.log("CMMD Contract deployed to:", CMMDAddress);

  await MMDcontract.setCMMDAddress(CMMDAddress);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
