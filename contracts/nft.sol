// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";


contract NFTFactory is ERC721URIStorage, Ownable  {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
 

    constructor() public ERC721("MyNFT", "NFT") {}
    
    struct Deets {
        address owner;
        int lat;
        int long;
    }

    //mapping(address => Deets) public Data;
    mapping(uint => mapping(address => Deets)) public Data;
    
    // protect against people saving shit on top of the same GPS coords
    mapping(int => mapping(int => Deets)) public location;

    

    address[] public allOwners;
    uint256 public allOwnersLength;

    //event CoordinateSets(address finalOwner, address tokenAddress, uint timestamp);

    function mintNFT(address recipient, string memory tokenURI, int x, int y)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        console.log('newItemId', newItemId);

        Data[newItemId][recipient].owner = recipient; 
        Data[newItemId][recipient].lat = x;
        Data[newItemId][recipient].long = y;

        location[x][y] = Data[newItemId][recipient];

        allOwners.push(recipient);
        allOwnersLength = newItemId;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
//

//