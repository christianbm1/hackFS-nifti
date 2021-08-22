// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

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

contract NFTFactory is ERC721URIStorage, ContextMixin, Ownable  {
    using Counters for Counters.Counter;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _tokenIds;
    Counters.Counter private _billboardIds;

    EnumerableMap.UintToAddressMap private _tokenCreators;
    EnumerableMap.UintToAddressMap private _billboardRentees;
    EnumerableSet.UintSet private _billboard;

    struct Revenues {
        uint256 totalRevenue;
        uint256 runningRevenue;
    }

    mapping(uint256 => Revenues) private billboardRevenue;

    constructor() public ERC721("NiFTi", "NIFTI") {}
    
    receive() external payable {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenCreators.set(newItemId, msg.sender);
        return newItemId;
    }

    function assignBillBoardSpace(address recipient, string memory tokenURI) public returns (uint256){
        _billboardIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _billboardRentees.set(newItemId, msg.sender);
        _billboard.add(newItemId);
        return newItemId;
    }

    function setBillboardRevenues(uint256 billBoardId, uint256 totalFlow, uint256 runningFlow) private returns (Revenues storage) {
        billboardRevenue[billBoardId].totalRevenue = totalFlow;
        billboardRevenue[billBoardId].runningRevenue = runningFlow;
        return billboardRevenue[billBoardId];
    }

    function removeBillboardSpace(address recipient, uint256 billboardId) private {
        _billboard.remove(billboardId);
        delete billboardRevenue[billboardId];
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
      // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }
        
        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721.isApprovedForAll(_owner, _operator);
    }

    function transferNFT(address from, address to, uint256 tokenId) public {
        return ERC721.safeTransferFrom(from, to, tokenId);
    }
}
