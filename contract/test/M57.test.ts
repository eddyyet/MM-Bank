describe("Given M57 Token", function () {
    it("Owner should get the initial supply", async function () {
      const [owner] = await ethers.getSigners();
      const M57 = await ethers.getContractFactory("MSBD5017Token");
      const M57 = await M57.deploy();
      await M57.deployed();
      const ownerBalance = await M57.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1000);
    });
  });