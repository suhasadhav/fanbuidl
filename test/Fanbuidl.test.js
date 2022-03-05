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
  it("Should create the Creator", async function () {
    // Create creator
    x = await fb.createCreator("Suhas", "This is description for the creator and his/her content and can be long", 2, 10);
    acc = await fb.getCreator(owner.address);

    // Check all data in creator array
    expect(acc).to.have.deep.property("accountName", "Suhas");
    expect(acc).to.have.deep.property("desription", "This is description for the creator and his/her content and can be long");
    expect(acc).to.have.deep.property("subType", 2);
    expect(acc).to.have.deep.property("subFee", ethers.BigNumber.from(10));    
    expect(acc).to.have.deep.property("balance", ethers.BigNumber.from(0));
  });
  
});