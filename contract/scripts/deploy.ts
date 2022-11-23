import { ethers } from "hardhat";

declare global {
  interface Window{
    ethereum?:any
  }
}

async function main() {
  const Contract = await ethers.getContractFactory("MMDToken");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  const value = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance:", value.toString());

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  await contractWithSigner.buy({value: ethers.utils.parseEther("1.0")});

  const value2 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after buy:", value2.toString());

  await contractWithSigner.sell(ethers.utils.parseEther("0.5"));
  const value3 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after sell:", value3.toString());

  await contractWithSigner.deposit(ethers.utils.parseEther("100.0"));
  const value4 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after deposit:", value4.toString());

  await contractWithSigner.withdraw(ethers.utils.parseEther("50.0"));
  const value5 = await contract.balanceOf('0x2Efe371AA24D1276B91F8C50C86c2e2D163e966d');
  console.log("Contract balance after withdraw:", value5.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
