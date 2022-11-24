import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("MMDToken");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  const value = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance:", value.toString());

  // const provider = new ethers.providers.JsonRpcProvider('https://rpc.debugchain.net');
  // const signer = provider.getSigner();
  // const contractWithSigner = contract.connect(accounts);
  await contract.buy({value: ethers.utils.parseEther("1.0")});
  const value2 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after buy:", value2.toString());

  await contract.sell(ethers.utils.parseEther("500"));
  const value3 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after sell:", value3.toString());

  await contract.deposit(ethers.utils.parseEther("80"));
  const value4 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  const value5 = await contract.vaultBalanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after deposit:", value4.toString());
  console.log("Vault balance after deposit:", value5.toString());

  await contract.withdraw(ethers.utils.parseEther("40"));
  const value6 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  const value7 = await contract.vaultBalanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after withdraw:", value6.toString());
  console.log("Vault balance after withdraw:", value7.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
