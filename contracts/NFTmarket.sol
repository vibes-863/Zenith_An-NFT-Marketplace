// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

// The 'NFTMarket' contract is defined and it inherits from the 'ReentrancyGuard' contract.
contract NFTmarket is ReentrancyGuard{

    /*The Counters library is used to create two counter variables: _itemIds and _itemsSold.
    These counters will be used to keep track of the total number of items and the number of items
    that have been sold in the marketplace.*/
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    //The 'owner' variable is an address that represents the owner of the contract.
    address payable owner;

    //The 'listingPrice' variable represents the price it costs to list an item in the marketplace.
    uint256 listingPrice = 0.025 ether;

    //The constructor initializes the 'owner' variable with the address of the contract deployer.
    constructor() {
      owner = payable(msg.sender);
    }

    /*The MarketItem struct represents an item listed in the marketplace. It includes properties
     such as itemId, nftContract (address of the NFT contract), tokenId (unique identifier of the NFT),
     seller, owner, price, and sold status.*/
    struct MarketItem {
      uint itemId;
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }

}