import { expect } from "chai";
import { ethers } from "hardhat";
import {expect, jest, test} from '@jest/globals';

describe("MMD Test", function () {
  // before(async function () {
  //   const [owner] = await ethers.getSigners();
  //   const MMD = await ethers.getContractFactory("MMDToken");
  //   const MMDContract = await MMD.deploy();
  //   await MMDContract.deployed();

    // const CMMD = await ethers.getContractFactory("CMMDToken");
    // const CMMDContract = await CMMD.deploy(MMDContract.address);
    // await CMMDContract.deployed();
  // });

  // beforeEach("deploy contract for each tesst", async function () {
  //   const [owner] = await ethers.getSigners();
  //   const MMD = await ethers.getContractFactory("MMDToken");
  //   const MMDContract = await MMD.deploy();
  //   await MMDContract.deployed();

  //   const CMMD = await ethers.getContractFactory("CMMDToken");
  //   const CMMDContract = await CMMD.deploy(MMDContract);
  //   await CMMDContract.deployed();
  // });

  it("Deploy MMD and CMMD", async function () {
    const [owner] = await ethers.getSigners();
      const MMD = await ethers.getContractFactory("MMDToken");
      const MMDContract = await MMD.deploy();
      await MMDContract.deployed();
      const MMDaddress = await MMDContract.address;

      const CMMD = await ethers.getContractFactory("CMMDToken");
      const CMMDContract = await CMMD.deploy(MMDaddress);//(MMDContract.address);
      await CMMDContract.deployed();
      const CMMDaddress = await CMMDContract.address;

      await MMDContract.setCMMDAddress(CMMDaddress);
      const CMMDaddressInMMD = await MMDContract.CMMDAddress();
      expect(CMMDaddressInMMD).to.equal(CMMDaddress);
  });


  it("Token name is the same as declared in the constrcutor function", async function () {
    
      const [owner] = await ethers.getSigners();
      const MMD = await ethers.getContractFactory("MMDToken");
      const MMDContract = await MMD.deploy();
      await MMDContract.deployed();
    const name = await MMDContract.name();
    expect(name).to.equal("Meta Merchant Dot");
  });

  it("Token symbol is the same as declared in the constrcutor function", async function () {
    
      const [owner] = await ethers.getSigners();
      const MMD = await ethers.getContractFactory("MMDToken");
      const MMDContract = await MMD.deploy();
      await MMDContract.deployed();
    const symbol = await MMDContract.symbol();
    expect(symbol).to.equal("MMD");
  });

  it("Owner should get the initial supply", async function () {
   
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const ownerBalance = await MMDContract.balanceOf(owner.address);
    expect(ownerBalance).to.equal(25000000000000000000000n);
  });

  it("Buy 1000 MMD with 1 Ether", async function () {
    
      const [owner] = await ethers.getSigners();
      const MMD = await ethers.getContractFactory("MMDToken");
      const MMDContract = await MMD.deploy();
      await MMDContract.deployed();
    await MMDContract.buy({value: ethers.utils.parseEther('1')});
    const balanceAfterBuy = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterBuy).to.equal(26000000000000000000000n);
  });

  it("Sell 500 MMD", async function () {
   
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    await MMDContract.buy({value: ethers.utils.parseEther('1')});
    await MMDContract.sell(ethers.utils.parseEther('500'));
    const balanceAfterSell = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterSell).to.equal(25500000000000000000000n);
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
    const MMDAddress = await MMDContract.address;

    const CMMD = await ethers.getContractFactory("CMMDToken");
    const CMMDContract = await CMMD.deploy(MMDAddress);
    await CMMDContract.deployed();
    const CMMDAddress = await CMMDContract.address;

    await MMDContract.setCMMDAddress(CMMDAddress);
    
    await MMDContract.deposit(ethers.utils.parseEther('800'));
    await MMDContract.withdraw(ethers.utils.parseEther('400'));
    const balanceAfterWithdraw = await MMDContract.balanceOf(owner.address);
    expect(balanceAfterWithdraw).to.equal(24600000000000000000000n);
  });

  it("Borrow 1000 CMMD", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const MMDAddress = await MMDContract.address;

    const CMMD = await ethers.getContractFactory("CMMDToken");
    const CMMDContract = await CMMD.deploy(MMDAddress);
    await CMMDContract.deployed();
    const CMMDAddress = await CMMDContract.address;

    await MMDContract.setCMMDAddress(CMMDAddress);

    await MMDContract.deposit(ethers.utils.parseEther('800'));
    await MMDContract.withdraw(ethers.utils.parseEther('700'));
    await CMMDContract.borrow(ethers.utils.parseEther('1000'));

    const finalMMDBalance = await MMDContract.balanceOf(owner.address);
    const finalMMDVaultBalance = await MMDContract.vaultBalanceOf(owner.address);
    const finalCMMDBalance = await CMMDContract.balanceOf(owner.address);
    const finalCMMDVaultBalance = await CMMDContract.vaultBalanceOf(owner.address);
    expect(finalMMDBalance).to.equal(ethers.utils.parseEther('24700'));
    expect(finalMMDVaultBalance).to.equal(ethers.utils.parseEther('300'));
    expect(finalCMMDBalance).to.equal(ethers.utils.parseEther('1000'));
    expect(finalCMMDVaultBalance).to.equal(ethers.utils.parseEther('-1000'));
  });

  it("Repay 500 CMMD (before repay, collateral is lower than 150%", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const MMDAddress = await MMDContract.address;

    const CMMD = await ethers.getContractFactory("CMMDToken");
    const CMMDContract = await CMMD.deploy(MMDAddress);
    await CMMDContract.deployed();
    const CMMDAddress = await CMMDContract.address;

    await MMDContract.setCMMDAddress(CMMDAddress);

    await MMDContract.deposit(ethers.utils.parseEther('800'));
    await MMDContract.withdraw(ethers.utils.parseEther('700'));
    await CMMDContract.borrow(ethers.utils.parseEther('1000'));
    await MMDContract.withdraw(ethers.utils.parseEther('50'));
    await CMMDContract.repay(ethers.utils.parseEther('500'));

    const finalMMDBalance = await MMDContract.balanceOf(owner.address);
    const finalMMDVaultBalance = await MMDContract.vaultBalanceOf(owner.address);
    const finalCMMDBalance = await CMMDContract.balanceOf(owner.address);
    const finalCMMDVaultBalance = await CMMDContract.vaultBalanceOf(owner.address);
    expect(finalMMDBalance).to.equal(ethers.utils.parseEther('24850'));
    expect(finalMMDVaultBalance).to.equal(ethers.utils.parseEther('150'));
    expect(finalCMMDBalance).to.equal(ethers.utils.parseEther('500'));
    expect(finalCMMDVaultBalance).to.equal(ethers.utils.parseEther('-500'));
  });

  it("Repay 500 CMMD (before repay, collateral is higher than 150%", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const MMDAddress = await MMDContract.address;

    const CMMD = await ethers.getContractFactory("CMMDToken");
    const CMMDContract = await CMMD.deploy(MMDAddress);
    await CMMDContract.deployed();
    const CMMDAddress = await CMMDContract.address;

    await MMDContract.setCMMDAddress(CMMDAddress);

    await MMDContract.deposit(ethers.utils.parseEther('800'));
    await MMDContract.withdraw(ethers.utils.parseEther('700'));
    await CMMDContract.borrow(ethers.utils.parseEther('1000'));
    await MMDContract.deposit(ethers.utils.parseEther('4700'));
    await CMMDContract.repay(ethers.utils.parseEther('500'));

    const finalMMDBalance = await MMDContract.balanceOf(owner.address);
    const finalMMDVaultBalance = await MMDContract.vaultBalanceOf(owner.address);
    const finalCMMDBalance = await CMMDContract.balanceOf(owner.address);
    const finalCMMDVaultBalance = await CMMDContract.vaultBalanceOf(owner.address);
    expect(finalMMDBalance).to.equal(ethers.utils.parseEther('20150'));
    expect(finalMMDVaultBalance).to.equal(ethers.utils.parseEther('4850'));
    expect(finalCMMDBalance).to.equal(ethers.utils.parseEther('500'));
    expect(finalCMMDVaultBalance).to.equal(ethers.utils.parseEther('-500'));
  });

  it("Liquidate (Withdraw 81 from 300 MMD Colletaral when 220 is required (1000 CMMD Credired)", async function () {
    const [owner] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const MMDAddress = await MMDContract.address;

    const CMMD = await ethers.getContractFactory("CMMDToken");
    const CMMDContract = await CMMD.deploy(MMDAddress);
    await CMMDContract.deployed();
    const CMMDAddress = await CMMDContract.address;

    await MMDContract.setCMMDAddress(CMMDAddress);

    await CMMDContract.borrow(ethers.utils.parseEther('1000'));
    await MMDContract.withdraw(ethers.utils.parseEther('81'));

    const finalMMDBalance = await MMDContract.balanceOf(owner.address);
    const finalMMDVaultBalance = await MMDContract.vaultBalanceOf(owner.address);
    const finalCMMDBalance = await CMMDContract.balanceOf(owner.address);
    const finalCMMDVaultBalance = await CMMDContract.vaultBalanceOf(owner.address);
    expect(finalMMDBalance).to.equal(ethers.utils.parseEther('24990'));
    expect(finalMMDVaultBalance).to.equal(ethers.utils.parseEther('0'));
    expect(finalCMMDBalance).to.equal(ethers.utils.parseEther('0'));
    expect(finalCMMDVaultBalance).to.equal(ethers.utils.parseEther('0'));
  });
});