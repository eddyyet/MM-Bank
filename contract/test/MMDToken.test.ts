import { expect } from "chai";
import { ethers } from "hardhat";

describe("MMD Test", function () {
  var testInstance: any;

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
    await MMDContract.buy({value: ethers.utils.parseEther('1')});
    await MMDContract.sell(ethers.utils.parseEther('500'));
    const balanceAfterSell = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterSell).to.equal(25500000000000000000000n);
  });

  it("Deposit 800 MMD (then way)", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    return MMDContract.deployed()
      .then ((instance) => {testInstance = instance;})
      .then (() => testInstance.deposit(ethers.utils.parseEther('800'), {from: owner.address}))
      .then (() => testInstance.balanceOf(owner.address))
      .then ((val) => expect(val).to.equal(24200000000000000000000n));
  });

  it("Deposit 800 MMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.deposit(ethers.utils.parseEther('800'));
    const balanceAfterDeposit = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterDeposit).to.equal(24200000000000000000000n);
  });

  it("Withdraw 400 MMD after deposit 800 MMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.deposit(ethers.utils.parseEther('800'));
    await MMDContract.withdraw(ethers.utils.parseEther('400'));
    const balanceAfterWithdraw = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterWithdraw).to.equal(24600000000000000000000n);
  });
});
