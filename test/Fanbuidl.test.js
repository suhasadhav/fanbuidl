const { balance, BN, constants, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner;
let addr1;
let addr2;
let fb;
let Fanbuidl;

beforeEach(async function () {
  [owner, addr1, addr2] = await ethers.getSigners();
  Fanbuidl = await ethers.getContractFactory("Fanbuidl");
  fb = await Fanbuidl.deploy();
});

describe("Fanbuidl Deploy", function () {
  it("Should set and return the Owner address", async function () {  
    // Check address is equal to owner who deployed it
    expect(await fb.getOwner()).to.equal(owner.address);
  });
});


describe("Fanbuidl Creator", function () {
  describe("SUCCESS", function () {
    it("Should create the Creator", async function () {
      // Create creator
      await fb.createCreator("Suhas", "This is description for the creator and his/her content and can be long", 2, 10);
      acc = await fb.getCreator(owner.address);
  
      // Check all data in creator array
      expect(acc).to.have.deep.property("accountName", "Suhas");
      expect(acc).to.have.deep.property("desription", "This is description for the creator and his/her content and can be long");
      expect(acc).to.have.deep.property("subDays").to.equal(2);
      expect(acc).to.have.deep.property("subFee").to.equal(10);    
      expect(acc).to.have.deep.property("balance").to.equal(0);
    });
    
    it('Should updateCreator(single field) if exists and activated', async function () {
      await fb.createCreator("Suhas", "This is description", 2, 10);
      await fb.updateCreator("Suhas2", "", 0, 0);
      acc = await fb.getCreator(owner.address);
      expect(acc).to.have.deep.property("accountName", "Suhas2");
      expect(acc).to.have.deep.property("desription", "This is description");
      expect(acc).to.have.deep.property("subDays").to.equal(2);
      expect(acc).to.have.deep.property("subFee").to.equal(10);
    });

    it('Should updateCreator(multiple fields) if exists and activated', async function () {
      await fb.createCreator("Suhas", "This is description", 2, 10);
      await fb.updateCreator("Suhas2", "", 0, 20);
      acc = await fb.getCreator(owner.address);
      expect(acc).to.have.deep.property("accountName", "Suhas2");
      expect(acc).to.have.deep.property("desription", "This is description");
      expect(acc).to.have.deep.property("subDays").to.equal(2);
      expect(acc).to.have.deep.property("subFee").to.equal(20);
    });

    it('Should updateCreator(all fields) if exists and activated', async function () {
      await fb.createCreator("Suhas", "This is description", 2, 10);
      await fb.updateCreator("Suhas2", "desc2", 1, 20);
      acc = await fb.getCreator(owner.address);
      expect(acc).to.have.deep.property("accountName", "Suhas2");
      expect(acc).to.have.deep.property("desription", "desc2");
      expect(acc).to.have.deep.property("subDays").to.equal(1);
      expect(acc).to.have.deep.property("subFee").to.equal(20);
    });

    it('Should activateCreator if exists and deactivated', async function () {
      await fb.createCreator("Suhas", "This is description", 2, 10);
      await (fb.deactivateCreator());
      await (fb.activateCreator());
      acc = await fb.getCreator(owner.address);
      await expect(acc).to.have.deep.property("active", true);
    });

    it('Should deactivateCreator if exists, activated', async function () {
      await fb.createCreator("Suhas", "This is description", 2, 10);
      await (fb.deactivateCreator());
      acc = await fb.getCreator(owner.address);
      await expect(acc).to.have.deep.property("active", false);
    });

  });
  
  describe("FAILURE", function() {
    it("Should revert createCreator for already existing creator", async function () {
      // Create creator
      await fb.createCreator("Suhas", "desc", 2, 10);
      await expect(fb.createCreator("Suhas2", "This is desc", 2, 100)).to.revertedWith("Creator already exists");
    });
  
    it('Should revert getCreator for non existing Creator', async function () {
      await expect(fb.getCreator(addr1.address)).to.revertedWith("Creator does not exists");
    });

    it('Should revert updateCreator for non existing Creator', async function () {
      await expect(fb.connect(addr1).updateCreator("Suhas2", "desc2", 1, 20)).to.revertedWith("Creator does not exists");
    });

    it('Should revert updateCreator for deactivated Creator', async function () {
      await fb.createCreator("Suhas", "desc", 2, 10);
      await (fb.deactivateCreator());
      await expect(fb.connect(owner).updateCreator("Suhas2", "desc2", 1, 20)).to.revertedWith("Your creator account is deactivated");
    });

    it('Should revert updateCreator if nothing updated', async function () {
      await fb.createCreator("Suhas", "desc", 2, 10);
      await expect(fb.connect(owner).updateCreator("Suhas", "desc", 2, 10)).to.revertedWith("Nothing updated");
    });
  })

  
  describe("EVENTS", function () {
    it('Should emit creatorCreated', async function () {
      await expect(fb.createCreator("Suhas", "This is desc", 2, 10)).to
      .emit(fb, 'creatorCreated')
      .withArgs(owner.address, "Suhas");
    });

    it('Should emit creatorActivated', async function () {
      await fb.createCreator("Suhas", "This is desc", 2, 10);
      await (fb.deactivateCreator());
      await expect(fb.activateCreator()).to
      .emit(fb, 'creatorActivated')
      .withArgs(owner.address, "Suhas");
    });

    it('Should emit creatorDeactivated', async function () {
      await fb.createCreator("Suhas", "This is desc", 2, 10);
      await expect(fb.deactivateCreator()).to
      .emit(fb, 'creatorDeactivated')
      .withArgs(owner.address, "Suhas");
    });

    it('Should emit creatorUpdated', async function () {
      await fb.createCreator("Suhas", "desc", 2, 10);
      await expect(fb.updateCreator("Suhas2", "desc2", 1, 20)).to
      .emit(fb, 'creatorUpdated')
      .withArgs(owner.address, "Suhas2");
    });
    
  });
});

describe("Fanbuidl Subscription", function() {
  describe("SUCCESS", function () {
    it("Should have balance added to creator account & Contract", async function(){
      await fb.createCreator("Suhas", "desc", 30, 1000);
      await fb.connect(addr1).subscribeMe(owner.address, {value: 1000});
      acc = await fb.getCreator(owner.address);
      
      expect(acc).to.have.deep.property("balance").to.equal(900);
      // 10% charge
      expect(await fb.collectedFee()).to.equal(100);
      const balance = await fb.getBalance();
      expect(balance).to.equal(1000);
    });

    it("Should have subscription in the list", async function(){
      await fb.createCreator("Suhas", "desc", 30, 1000);
      await fb.connect(addr2).createCreator("Adhav", "desc", 10, 2000);

      await fb.connect(addr1).subscribeMe(owner.address, {value: 1000});
      await fb.connect(addr1).subscribeMe(addr2.address, {value: 2000});
      x = await fb.getActiveSubscriptions(addr1.address);
      expect(x[0].creator).to.equal(owner.address);
      expect(x[1].creator).to.equal(addr2.address);
      expect(await fb.getBalance()).to.equal(3000);
      expect(await fb.getCreator(owner.address)).to.have.deep.property("balance").to.equal(900);
      expect(await fb.getCreator(addr2.address)).to.have.deep.property("balance").to.equal(1800);
      expect(await fb.collectedFee()).to.equal(300);
    });

    it("Should have correct Subscription enddate", async function(){
      await fb.createCreator("Suhas", "desc", 30, 1000);
      await fb.connect(addr2).createCreator("Adhav", "desc", 10, 2000);

      await fb.connect(addr1).subscribeMe(owner.address, {value: 1000});
      await fb.connect(addr1).subscribeMe(addr2.address, {value: 2000});

      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;

      x = await fb.getActiveSubscriptions(addr1.address);
      //expect timestamp to be less than 1 as owner subscription happened earlier
      // 1 block previously, with 30 days subscription
      expect(x[0].endDate).to.equal(timestampBefore + 30*60*60*24 - 1 );

      //expect timestamp to be exactly equal with 10 days subscription
      expect(x[1].endDate).to.equal(timestampBefore + 10*60*60*24);
    });

  });

  describe("FAILURE", function () {    
    it("Should revert subscribeMe for own account", async function(){
      await fb.createCreator("Suhas", "desc", 2, 10);
      await expect(fb.subscribeMe(owner.address))
        .to.revertedWith("No need to subscribe to own content!");
    });

    it("Should revert subscribeMe for insufficient balance", async function(){
      const balance = await addr1.getBalance();
      await fb.createCreator("Suhas", "desc", 2, balance+200);
      await expect(fb.connect(addr1).subscribeMe(owner.address))
        .to.revertedWith("Insufficient Balance");
    });

    it("Should revert subscribeMe for wrong Subscription Fee", async function(){
      await fb.createCreator("Suhas", "desc", 2, 500);
      await expect(fb.connect(addr1).subscribeMe(owner.address, {value: 501}))
        .to.revertedWith("Send Subscription fee");
    });

    it("Should revert subscribeMe for non existing Creator", async function(){
      await expect(fb.connect(addr1).subscribeMe(owner.address))
        .to.revertedWith("Creator does not exists");
    });
    
    it("Should revert subscribeMe for deactivated Creator", async function(){
      await fb.createCreator("Suhas", "This is description", 2, 1000);
      await (fb.deactivateCreator());
      await expect(fb.connect(addr1).subscribeMe(owner.address, {value: 1000}))
        .to.revertedWith("Creator account is deactivated");
    });

    it("Should revert subscribeMe for duplicate subscription", async function(){
      await fb.createCreator("Suhas", "This is description", 2, 1000);
      await fb.connect(addr1).subscribeMe(owner.address, {value: 1000});
      await expect(fb.connect(addr1).subscribeMe(owner.address, {value: 1000}))
        .to.revertedWith("Already subscribed to this creator");
    });

  });

  describe("EVENTS", function () {
    it('Should emit gotSubscribed', async function () {
      await fb.createCreator("Suhas", "desc", 30, 1000);
      //await fb.connect(addr1).subscribeMe(owner.address, {value: 1000});

      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp + 1;

      await expect(fb.connect(addr1).subscribeMe(owner.address, {value: 1000})).to
      .emit(fb, 'gotSubscribed')
      .withArgs(addr1.address, owner.address, timestampBefore, timestampBefore+30*60*60*24, 1000)
      ;
    });
    
  });
});