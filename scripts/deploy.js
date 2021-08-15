/*********** RUN COMMAND ************/
//npx hardhat run scripts/deploy.js --network kovan
/***********************************/
const hre = require("hardhat");

async function main() {
  const [deployer, addr1] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());
    
  const NFT = await hre.ethers.getContractFactory("NFTFactory");

  const nft = await NFT.deploy();
  await nft.deployed();

  console.log(`The NFT Contract Owner is: ${await nft.owner()}`);

  console.log("NFT Contract deployed to:", nft.address);
  
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
