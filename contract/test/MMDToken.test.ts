import { expect } from "chai";
import { ethers } from "hardhat";

describe("MMD and CMMD smart contract testing", function () {
  async function cleanDeploy() {
    const [owner, receiver] = await ethers.getSigners();
    const MMD = await ethers.getContractFactory("MMDToken");
    const MMDContract = await MMD.deploy();
    await MMDContract.deployed();
    const MMDaddress = await MMDContract.address;

    const CMMD = await ethers.getContractFactory("CMMDToken");
    const CMMDContract = await CMMD.deploy(MMDaddress);
    await CMMDContract.deployed();
    const CMMDaddress = await CMMDContract.address;

    await MMDContract.setCMMDAddress(CMMDaddress);

    return {owner, receiver, MMDContract, CMMDContract};
  }

  describe("Basic set up", function () {
    describe("Names and symbol", function () {
      it("MMD: Token name declared in constructor (Meta Merchant Dot)", async function () {
        const {MMDContract} = await cleanDeploy();
        const name = await MMDContract.name();
        expect(name).to.equal("Meta Merchant Dot");
      });

      it("CMMD: Token name declared in constructor (Consumer Meta Merchant Dot)", async function () {
        const {CMMDContract} = await cleanDeploy();
        
        const name = await CMMDContract.name();
        expect(name).to.equal("Consumer Meta Merchant Dot");
      });

      it("MMD: Token symbol declared in constructor (MMD)", async function () {
        const {MMDContract} = await cleanDeploy();
        
        const symbol = await MMDContract.symbol();
        expect(symbol).to.equal("MMD");
      });

      it("CMMD: Token symbol declared in constructor (CMMD)", async function () {
        const {CMMDContract} = await cleanDeploy();
        
        const symbol = await CMMDContract.symbol();
        expect(symbol).to.equal("CMMD");
      });
    });

    describe("Cross-contract relationship", function () {
      it("MMD: Contains CMMD contract address", async function () {
        const {MMDContract, CMMDContract} = await cleanDeploy();
        
        const CMMDAddressInMMD = await MMDContract.CMMDAddress();
        const CMMDAddress = await CMMDContract.address;
        expect(CMMDAddressInMMD).to.equal(CMMDAddress);
      });

      it("CMMD: Contains MMD contract address", async function () {
        const {MMDContract, CMMDContract} = await cleanDeploy();
        
        const MMDAddressInCMMD = await CMMDContract.MMDAddress();
        const MMDAddress = await MMDContract.address;
        expect(MMDAddressInCMMD).to.equal(MMDAddress);
      });
    });

    describe("Initial balances", function () {
      it("MMD: Owner's initial balance minted in constructor (25000)", async function () {
        const {owner, MMDContract} = await cleanDeploy();
        
        const ownerBalance = await MMDContract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseEther('25000'));
      });

      it("CMMD: Owner's initial balance minted in constructor (10000)", async function () {
        const {owner, CMMDContract} = await cleanDeploy();
        
        const ownerBalance = await CMMDContract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseEther('10000'));
      });

      it("MMD: Owner's initial vault balance is zero", async function () {
        const {owner, MMDContract} = await cleanDeploy();
        
        const ownerBalance = await MMDContract.vaultBalanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseEther('0'));
      });

      it("CMMD: Owner's initial vault balance is zero", async function () {
        const {owner, CMMDContract} = await cleanDeploy();
        
        const ownerBalance = await CMMDContract.vaultBalanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseEther('0'));
      });
    });
  });

  describe("MMD operations", function () {
    describe("Top Up MMD", function () {
      it("Top up 1000 MMD with 1 ETD", async function () {
        const {owner, MMDContract} = await cleanDeploy();

        await MMDContract.buy({value: ethers.utils.parseEther('1')});
        const balanceAfterBuy = await MMDContract.balanceOf(owner.address);
        expect(balanceAfterBuy).to.equal(ethers.utils.parseEther('26000'));
      });

      it("Error when topping up 999999 MMD with insufficient balance", async function () {
        const {owner, MMDContract} = await cleanDeploy();

        let erorr;
        try {await MMDContract.buy({value: ethers.utils.parseEther('999999')})}
        catch (e) {erorr = e};
        expect(erorr).to.not.be.undefined;
      });
    });

    describe("Deposit MMD", function () {
      it("Deposit 800 MMD", async function () {
        const {owner, MMDContract} = await cleanDeploy();

        await MMDContract.deposit(ethers.utils.parseEther('800'));
        const balanceAfterDeposit = await MMDContract.balanceOf(owner.address);
        const vaultBalanceAfterDeposit = await MMDContract.vaultBalanceOf(owner.address);
        expect(balanceAfterDeposit).to.equal(ethers.utils.parseEther('24200'));
        expect(vaultBalanceAfterDeposit).to.equal(ethers.utils.parseEther('800'));
      });

      it("Error when depositing 999999 MMD with insufficient balance", async function () {
        const {MMDContract} = await cleanDeploy();

        let erorr;
        try {await MMDContract.deposit(ethers.utils.parseEther('999999'))}
        catch (e) {erorr = e};
        expect(erorr).to.not.be.undefined;
      });
    });

    describe("Withdraw MMD", function () {
      it("Withdraw 400 MMD when there is 800 MMD deposited", async function () {
        const {owner, MMDContract} = await cleanDeploy();

        await MMDContract.deposit(ethers.utils.parseEther('800'));
        await MMDContract.withdraw(ethers.utils.parseEther('400'));
        const balanceAfterWithdraw = await MMDContract.balanceOf(owner.address);
        const vaultBalanceAfterWithdraw = await MMDContract.vaultBalanceOf(owner.address);
        expect(balanceAfterWithdraw).to.equal(ethers.utils.parseEther('24600'));
        expect(vaultBalanceAfterWithdraw).to.equal(ethers.utils.parseEther('400'));
      });

      it("Error when withdrawing up 999999 MMD with insufficient deposit", async function () {
        const {MMDContract} = await cleanDeploy();

        let erorr;
        try {
          await MMDContract.deposit(ethers.utils.parseEther('800'));
          await MMDContract.withdraw(ethers.utils.parseEther('999999'));
        }
        catch (e) {erorr = e};
        expect(erorr).to.not.be.undefined;
      });
    });
  });

  describe("CMMD operations", function () {
    describe("Transfer CMMD", function () {
      it("Transfer 6000 CMMD", async function () {
        const {owner, receiver, CMMDContract} = await cleanDeploy();

        await CMMDContract.transfer(receiver.address, ethers.utils.parseEther('6000'));
        const ownerCMMDbalance = await CMMDContract.balanceOf(owner.address);
        const receiverCMMDbalance = await CMMDContract.balanceOf(receiver.address);

        expect(ownerCMMDbalance).to.equal(ethers.utils.parseEther('4000'));
        expect(receiverCMMDbalance).to.equal(ethers.utils.parseEther('6000'));
      });

      it("Error when transferring 999999 CMMD with insufficient balance", async function () {
        const {owner, receiver, CMMDContract} = await cleanDeploy();

        let erorr;
        try { await CMMDContract.transfer(receiver.address, ethers.utils.parseEther('999999')); }
        catch (e) {erorr = e};
        expect(erorr).to.not.be.undefined;
      });
    });

    describe("Borrow CMMD", function () {
      it("Borrow 10000 CMMD (CMMD Credited amount adjusted and MMD Collateral deposited)", async function () {
        const {owner, MMDContract, CMMDContract} = await cleanDeploy();

        await CMMDContract.borrow(ethers.utils.parseEther('10000'));
        const MMDbalanceAfterBorrow = await MMDContract.balanceOf(owner.address);
        const MMDvaultBalanceAfterBorrow = await MMDContract.vaultBalanceOf(owner.address);
        const CMMDbalanceAfterBorrow = await CMMDContract.balanceOf(owner.address);
        const CMMDvaultBalanceAfterBorrow = await CMMDContract.vaultBalanceOf(owner.address);

        expect(MMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('22000'));
        expect(MMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('3000'));
        expect(CMMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('20000')); //initial 10000 + borrow 10000
        expect(CMMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('-10000'));
      });

      it("Error when borrowing 999999 CMMD with insufficient balance", async function () {
        const {CMMDContract} = await cleanDeploy();

        let erorr;
        try { await CMMDContract.borrow(ethers.utils.parseEther('999999')); }
        catch (e) {erorr = e};
        expect(erorr).to.not.be.undefined;
      });
    });

    describe("Repay CMMD", function () {
      it("Repay 5000 CMMD after borrowing 10000 (CMMD Credited amount adjusted and MMD Collateral deposited)", async function () {
        const {owner, MMDContract, CMMDContract} = await cleanDeploy();

        await CMMDContract.borrow(ethers.utils.parseEther('10000'));
        await CMMDContract.repay(ethers.utils.parseEther('5000'));
        const MMDbalanceAfterBorrow = await MMDContract.balanceOf(owner.address);
        const MMDvaultBalanceAfterBorrow = await MMDContract.vaultBalanceOf(owner.address);
        const CMMDbalanceAfterBorrow = await CMMDContract.balanceOf(owner.address);
        const CMMDvaultBalanceAfterBorrow = await CMMDContract.vaultBalanceOf(owner.address);

        expect(MMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('23500'));
        expect(MMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('1500'));
        expect(CMMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('15000')); //initial 10000 + borrow 10000 - repay 5000
        expect(CMMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('-5000'));
      });

      it("Error when repaying 999999 CMMD which exceeds borrowing", async function () {
        const {CMMDContract} = await cleanDeploy();

        let erorr;
        try { await CMMDContract.borrow(ethers.utils.parseEther('999999')); }
        catch (e) {erorr = e};
        expect(erorr).to.not.be.undefined;
      });
    });
  });

  describe("Liquidate CMMD", function () {
    it("Withdraw causing insufficient collateral: Liquidate all CMMD borrowing with discount charged from MMD in Wallet (all balances adjusted)", async function () {
      const {owner, MMDContract, CMMDContract} = await cleanDeploy();

      await CMMDContract.borrow(ethers.utils.parseEther('10000'));
      await MMDContract.withdraw(ethers.utils.parseEther('801'));
      const MMDbalanceAfterBorrow = await MMDContract.balanceOf(owner.address);
      const MMDvaultBalanceAfterBorrow = await MMDContract.vaultBalanceOf(owner.address);
      const CMMDbalanceAfterBorrow = await CMMDContract.balanceOf(owner.address);
      const CMMDvaultBalanceAfterBorrow = await CMMDContract.vaultBalanceOf(owner.address);

      expect(MMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('24900'));
      expect(MMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('0'));
      expect(CMMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('10000')); //initial 10000
      expect(CMMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('0'));
    });

    it("Withdraw but collateral still meet requirement: no liquidation, just a normal withdrawal (all balances adjusted)", async function () {
      const {owner, MMDContract, CMMDContract} = await cleanDeploy();

      await CMMDContract.borrow(ethers.utils.parseEther('10000'));
      await MMDContract.withdraw(ethers.utils.parseEther('800'));
      const MMDbalanceAfterBorrow = await MMDContract.balanceOf(owner.address);
      const MMDvaultBalanceAfterBorrow = await MMDContract.vaultBalanceOf(owner.address);
      const CMMDbalanceAfterBorrow = await CMMDContract.balanceOf(owner.address);
      const CMMDvaultBalanceAfterBorrow = await CMMDContract.vaultBalanceOf(owner.address);

      expect(MMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('22800'));
      expect(MMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('2200'));
      expect(CMMDbalanceAfterBorrow).to.equal(ethers.utils.parseEther('20000')); //initial 10000
      expect(CMMDvaultBalanceAfterBorrow).to.equal(ethers.utils.parseEther('-10000'));
    });
  });
});