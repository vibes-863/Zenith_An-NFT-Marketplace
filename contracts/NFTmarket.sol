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
    Counters.Counter public _itemIds;
    Counters.Counter public _itemsSold;

    //The 'owner' variable is an address that represents the owner of the contract.
    address payable public owner;

    //The 'listingPrice' variable represents the price it costs to list an item in the marketplace.
    uint256 public listingPrice = 0.025 ether;

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

    /*The idToMarketItem mapping is used to map each itemId to its corresponding MarketItem.*/
    mapping(uint256 => MarketItem) public idToMarketItem;

    /*The MarketItemCreated event is emitted when a new item is listed in the marketplace.*/
    event MarketItemCreated (
      uint indexed itemId,
      address indexed nftContract,
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    // Function to create a new market item
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei"); // Checking if the price is greater than 0
    require(msg.value == listingPrice, "Value paid must be equal to listing price"); // Checking if the sent value is equal to the listing price

    _itemIds.increment(); // Incrementing the item ID counter
    uint256 itemId = _itemIds.current(); // Getting the current item ID

    // Creating a new MarketItem struct
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    // Transferring the NFT from the seller to the contract
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    // Emitting a MarketItemCreated event
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  // Function to create a market sale
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price; // Getting the price of the item
    uint tokenId = idToMarketItem[itemId].tokenId; // Getting the token ID of the item
    require(itemId > 0 && itemId <= _itemIds.current(), "Item doesn't exist"); // Checks if the itemID is valid
    require(msg.value == price, "Please submit the asking price in order to complete the purchase"); // Checking if the sent value is equal to the item price
    require(!idToMarketItem[itemId].sold, "Item already sold"); // Checks if the item is already sold

    // Transferring the payment to the seller
    idToMarketItem[itemId].seller.transfer(msg.value);

    // Transferring the NFT from the contract to the buyer
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

    // Updating the owner and sold status of the item
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;

    _itemsSold.increment(); // Incrementing the items sold counter

    payable(owner).transfer(listingPrice); // Transferring the listing fee to the contract owner
  }

  // Function to fetch all unsold market items
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current(); // Getting the total number of items
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current(); // Calculating the number of unsold items
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);

    // Looping through all items and adding unsold items to the array
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items; // Returning the array of unsold items
  }

  // Function to fetch all NFTs owned by the caller
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current(); // Getting the total number of items
    uint itemCount = 0;
    uint currentIndex = 0;

    // Counting the number of items owned by the caller
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    // Adding the items owned by the caller to the array
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items; // Returning the array of items owned by the caller
  }

  // Function to fetch all items created by the caller
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current(); // Getting the total number of items
    uint itemCount = 0;
    uint currentIndex = 0;

    // Counting the number of items created by the caller
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    // Adding the items created by the caller to the array
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items; // Returning the array of items created by the caller
  }

  function fetchNFT(uint256 Id) public view returns (MarketItem[] memory) {
  
    MarketItem[] memory items = new MarketItem[](1);

    // Looping through all items and adding unsold items to the array
    for (uint i = 0; i < _itemIds.current(); i++) {
      if (idToMarketItem[i + 1].owner == address(0) && idToMarketItem[i + 1].tokenId == Id) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[0] = currentItem;
        return items;
      }
    }

    return items;
    }
}