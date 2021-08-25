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

describe("Minting NFTs", function(){
    it('Able to mint tokens', async function(){
        let token1 = await nft.mintNFT(addr2.address, "aaaa");
        //console.log(token1);
        console.log(`${addr2.address} minted token1 with ID: ${token1}`);
        let token2 = await nft.mintNFT(addr1.address, "abcd");
        console.log(`${addr1.address} minted token2 with ID: ${token2}`);


        console.log(`Owner of token1: ${await nft.ownerOf(1)}`);
        console.log(`Owner of token2: ${await nft.ownerOf(2)}`);
    });

    it('Read token URI', async function(){
      expect(await nft.tokenURI(2)).to.equal('abcd');
    });
});

describe("Transferring NFTs", function(){
    it('Not able to transfer existing token from non approved address: deployer', async function(){
      await expect(nft.transferFrom(addr1.address, addr2.address, 1)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it('Not able to transfer existing token from non approved address: addr3', async function(){
      await expect(nft.connect(addr3).transferFrom(addr1.address, addr2.address, 1)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it('Not able to transfer of non approved address and non-existent token: addr3', async function(){
      await expect(nft.connect(addr3).transferFrom(addr1.address, addr2.address, 9)).to.be.revertedWith("ERC721: operator query for nonexistent token");
    });

    it('Not able to transfer of non-existent token', async function(){
      await expect(nft.connect(addr1).transferFrom(addr1.address, addr2.address, 9)).to.be.revertedWith("ERC721: operator query for nonexistent token");
    });

    it('Transfer of token', async function(){
      expect(await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 2)).to.be.an('object');
    });

    it('Transfer of token 2', async function(){
      expect(await nft.connect(addr2).transferFrom(addr2.address, addr1.address, 2)).to.be.an('object');
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

describe("Burning NFTs", async function(){
  it('Not able to burn a non existant NFT', async function(){
    await expect(nft.burnNFT(9)).to.be.revertedWith("ERC721: operator query for nonexistent token");
  });
  it('Not able to burn a non ownable NFT', async function(){
    await expect(nft.burnNFT(1)).to.be.revertedWith("NiFTi: can't burn token not owned");
  });

  it('Burn token: remove from _owners', async function(){
    await nft.connect(addr1).burnNFT(2);
    await expect(nft.ownerOf(2)).to.be.revertedWith("ERC721: owner query for nonexistent token");
  });

  it('Burn token: remove from _tokenCreators', async function(){
    await expect(nft.getTokenCreator(2)).to.be.revertedWith("EnumerableMap: nonexistent key");
  });
});
