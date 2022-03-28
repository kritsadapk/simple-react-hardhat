// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import fs from "fs";
import hre from "hardhat";
import { ethers, artifacts } from "hardhat";
import { Greeter } from "../typechain-types/Greeter";
import { MyBank } from "../typechain-types/MyBank";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  const MyBank = await hre.ethers.getContractFactory("MyBank");
  const mybank = await MyBank.deploy("NUTX", 500);

  await greeter.deployed();
  saveContract(greeter as Greeter);

  await mybank.deployed();
  saveMybankContract(mybank as MyBank);

  console.log("Greeter deployed to:", greeter.address);
}

const saveMybankContract = (mybank: MyBank) => {
  const path = __dirname + "/../frontend/src/contracts/MyBank";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(
    `${path}/myBankaddress.json`,
    JSON.stringify(
      {
        address: mybank.address,
      },
      undefined,
      2
    )
  );
  fs.writeFileSync(
    `${path}/myBankabi.json`,
    JSON.stringify(artifacts.readArtifactSync("MyBank"), undefined, 2)
  );
};

const saveContract = (greeter: Greeter) => {
  const path = __dirname + "/../frontend/src/contracts";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(
    `${path}/address.json`,
    JSON.stringify(
      {
        address: greeter.address,
      },
      undefined,
      2
    )
  );
  fs.writeFileSync(
    `${path}/abi.json`,
    JSON.stringify(artifacts.readArtifactSync("Greeter"), undefined, 2)
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
