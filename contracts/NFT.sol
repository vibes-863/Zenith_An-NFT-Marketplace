// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// The 'NFT'contract is defined and it inherits from the 'ERC721URIStorage' contract.
contract NFT is ERC721URIStorage {
    /* The Counters library is used to create a counter variable, _tokenIds. This variable will be used to provide a 
    unique identifier for each token.*/
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    // The variable 'contractAddress' is an address of the marketplace that we want the NFT to be able to interact with.
    address contractAddress;

    /* The constructor initializes the 'contractAddress' variable with the address of the Marketplace. Note: as the 
    address of the marketplace is needed, we will first deploy the NFTMarketplace contract and then this contract*/
    constructor(address marketplaceAddress) ERC721("Zenith Tokens", "ZET") {
        contractAddress = marketplaceAddress;
    }

    // Function to mint new tokens (NFT)
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment(); // Incrementing the unique token ID for each NFT
        uint256 newItemId = _tokenIds.current(); // Getting the current token ID

        // This mints the token.
        _mint(msg.sender, newItemId); // msg.sender will be the creator and newItemId the token ID
        _setTokenURI(newItemId, tokenURI); // This sets the token URI to the token ID
        setApprovalForAll(contractAddress, true); // This provides the approval to the marketplace to transact this token
        return newItemId; // For frontend use
    }

    // Function to transfer token from one address to another address
    function transferToken(address from, address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == from, "From address must be token owner");
        _transfer(from, to, tokenId);
    }

    // The receive function is executed on a call to the contract with empty calldata. This is the function that is executed on plain Ether transfers.
    receive() external payable {} // to support receiving ETH by default

    // The fallback function is executed on a call to the contract if none of the other functions match the given function signature, or if no data was supplied at all.
    fallback() external payable {}
}
