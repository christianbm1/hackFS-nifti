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
        let token1 = await nft.mintNFT(addr2.address, "aaaa");
        console.log(token1);
        console.log(`${addr2.address} minted token1 with ID: ${token1}`);
        let token2 = await nft.mintNFT(addr1.address, "abcd");
        console.log(`${addr1.address} minted token2 with ID: ${token2}`);


        console.log(`Owner of token1: ${await nft.ownerOf(1)}`);
        console.log(`Owner of token2: ${await nft.ownerOf(2)}`);
    });

    it('Testing the TransferFrom method', async function(){
      let ans = await nft.transferFrom(addr1.address, addr2.address, 1);
      console.log(`The response was ${ans}`)
    });



    /*it('all owners function', async function(){
        let z = await nft.allOwnersLength();
        console.log(parseInt(z));
        //let z = await nft.allOwners();
        for(var i = 0; i < parseInt(z); i++){
            addss = await nft.allOwners(i);
            deet = await nft.Data(i + 1, addss);
            console.log(`Owner ${i}: ${addss}`);
            console.log(deet);
        }
    });*/
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