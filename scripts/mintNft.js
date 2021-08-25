/*********** RUN COMMAND ************/
//npx hardhat run scripts/deploy.js --network kovan
/***********************************/
//Interacting w/ contract : 0x110245385d5d5C2A789Aafb26F8dd3aF5badc9Dc
const hre = require("hardhat");

async function main() {
  const deployedAddress = "0x110245385d5d5C2A789Aafb26F8dd3aF5badc9Dc";
  const [deployer, addr1] = await ethers.getSigners();

  console.log(
    "Interacting contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());
    
  const NFT = await hre.ethers.getContractFactory("NFTFactory");
  const nft = NFT.attach(ethers.utils.getAddress(deployedAddress));

  await nft.mintNFT(deployer.address, "aaaa")
  
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
