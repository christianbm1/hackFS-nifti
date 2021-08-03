const { expect } = require("chai");

let deployer, addr1, addr2, addr3, addrs; 
let nft;
// npx hardhat test './test/test.js'

before(async function(){
 [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    console.log(`Deployer Address: ${deployer.address}`);
    
    const NFT = await ethers.getContractFactory("NFTFactory");
    nft = await NFT.deploy();
    console.log(`addr1 Address: ${addr1.address}`);
    console.log(`nft Address: ${nft.address}`);
});

describe("Inital Test", function(){
    it('test', async function(){
        await nft.mintNFT(addr2.address, "aaaa", ethers.utils.parseUnits((-15255.021458756478121).toString(), 15), ethers.utils.parseUnits((1.021458756478121).toString(), 15));
        await nft.mintNFT(addr1.address, "abcd", ethers.utils.parseUnits((-15255.021458756478121).toString(), 15), ethers.utils.parseUnits((1.021458756478121).toString(), 15));
    });

    /*it('check nft created', async function(){
        let z = await nft.Data(addr2.address);
        console.log(ethers.utils.formatUnits(z.lat, 15));
        console.log(ethers.utils.formatUnits(z.long, 15));
    });*/

    it('all owners function', async function(){
        let z = await nft.allOwnersLength();
        console.log(parseInt(z));
        //let z = await nft.allOwners();
        for(var i = 0; i < parseInt(z); i++){
            addss = await nft.allOwners(i);
            deet = await nft.Data(i + 1, addss);
            console.log(`Owner ${i}: ${addss}`);
            console.log(deet);
        }
    });
});
/*
describe("Escrow Contract Deployment", function() {
    it("The owner of Escrow Contract should be the deployer address", async function() {
      expect(await escrowContract.owner()).to.equal(deployer.address);
    });
  
    it("The Escrow contract should be the holder of Token 1.", async function() {
      expect(await escrowContract.balanceOfVaultedToken(tokenContract1.address)).to.equal(await tokenContract1.totalSupply());
    });
  
    it("The Escrow contract should NOT be the holder of Token 2.", async function() {
      expect(await escrowContract.balanceOfVaultedToken(tokenContract2.address)).not.equal(await tokenContract2.totalSupply());
    });
  });
*/