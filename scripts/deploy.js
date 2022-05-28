async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Fanbuidl = await ethers.getContractFactory("Fanbuidl");
  const contract = await Fanbuidl.deploy();
  await contract.deployed();

  console.log("Token address:", contract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(contract);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Fanbuidl: contract.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync("Fanbuidl");

  fs.writeFileSync(
    contractsDir + "/Fanbuidl.json",
    JSON.stringify(ContractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
