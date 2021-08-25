// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//import "hardhat/console.sol";

abstract contract ContextMixin {
    function msgSender()
        internal
        view
        returns (address payable sender)
    {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            sender = payable(msg.sender);
        }
        return sender;
    }
}

contract NFTFactory is ERC721, ERC721URIStorage, ContextMixin, Ownable {
    using Counters for Counters.Counter;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    Counters.Counter private _tokenIds;
    EnumerableMap.UintToAddressMap private _tokenCreators;

    constructor() public ERC721("NiFTi", "NIFTI") {}
    receive() external payable {}

    function mintNFT(address recipient, string memory userTokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, userTokenURI);
        _tokenCreators.set(newItemId, _msgSender());
        return newItemId;
    }

    function burnNFT(uint256 tokenId) public {
        //require(_exists(tokenId), "NiFTi: token does not exist");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NiFTi: can't burn token not owned");
        _burn(tokenId);
        _tokenCreators.remove(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(tokenId);
    }

    function getTokenCreator(uint256 tokenId) public view returns (address) {
        return _tokenCreators.get(tokenId);
    }

    function isApprovedForAll(address _owner, address _operator) public override view returns (bool isOperator) {
      // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }
        // otherwise, use the default ERC721.isApprovedForAll()
        return super.isApprovedForAll(_owner, _operator);
    }

    function _burn(uint256 tokenId) internal override (ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _msgSender() internal override view returns (address sender) {
        return ContextMixin.msgSender();
    }
}
