import { expect } from "chai";
import { ethers } from "hardhat";

describe("MMD Test", function () {
  it("Owner should get the initial supply", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const ownerBalance = await MMDContract.balanceOf(owner.address);
    expect(ownerBalance).to.equal(25000000000000000000000n);
  });

  it("Buy 1000 MMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.buy({value: 1000000000000000000n});
    const balanceAfterBuy = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterBuy).to.equal(26000000000000000000000n);
  });

  it("Sell 500 MMD after buying 1000 MMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.buy({value: 1000000000000000000n});
    await MMDContract.sell(500000000000000000000n);
    const balanceAfterSell = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterSell).to.equal(25500000000000000000000n);
  });

  it("Deposit 800 MMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.deposit(800000000000000000000n);
    const balanceAfterDeposit = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterDeposit).to.equal(24700000000000000000000n);
  });

  it("Withdraw 400 MMD after deposit 800 MMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.deposit(800000000000000000000n);
    await MMDContract.withdraw(400000000000000000000n);
    const balanceAfterWithdraw = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterWithdraw).to.equal(25100000000000000000000n);
  });
});
