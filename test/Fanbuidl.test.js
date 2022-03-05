const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fanbuidl", function () {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const Fanbuidl = await ethers.getContractFactory("Fanbuidl");
  const fb = await Fanbuidl.deploy();

  it("Should return the Owner address", async function () {  
    // Check address is equal to owner who deployed it
    expect(await fb.getOwner()).to.equal(owner.address);
  });

  it("Should create the Creator", async function () {

    x = await fb.createCreator("Suhas", "This is desc", 0, 10);

    // Check address is equal to owner who deployed it
    expect(x).to.have.deep.property('accountName');
  });
});