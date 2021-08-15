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
    it('Able to mint tokens', async function(){
        let token1 = await nft.mintNFT(addr2.address, "aaaa");
        console.log(token1);
        console.log(`${addr2.address} minted token1 with ID: ${token1}`);
        let token2 = await nft.mintNFT(addr1.address, "abcd");
        console.log(`${addr1.address} minted token2 with ID: ${token2}`);


        console.log(`Owner of token1: ${await nft.ownerOf(1)}`);
        console.log(`Owner of token2: ${await nft.ownerOf(2)}`);
    });

    it('TransferFrom non approved address', async function(){
      await expect(nft.transferFrom(addr1.address, addr2.address, 1)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');
    });

    it('Transfer of Non-existent token', async function(){
      await expect(nft.connect(addr1).transferNFT(addr1.address, addr2.address, 9)).to.be.revertedWith('ERC721: operator query for nonexistent token');
    });

    it('Transfer of token', async function(){
      expect(await nft.connect(addr1).transferNFT(addr1.address, addr2.address, 2)).to.be.an('object');
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
