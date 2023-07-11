"use client"

import React from 'react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router';


function NFTDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [nftDetails, setNFTDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState([]) // Track loading state for each NFT item
  useEffect(() => {
    // Fetch NFT details based on the provided ID
    const fetchNFTDetails = async () => {
      try {
        // Make an API call or access your storage to retrieve the NFT details
        const response = await axios.get(`/api/nfts/${id}`); // Replace with your actual API endpoint or data source

        setNFTDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching NFT details:', error);
        setLoading(false);
      }
    };

    fetchNFTDetails();
  }, [id]);



  async function buyNft(nft, index) {
    setLoadingItems((prevLoadingItems) => [...prevLoadingItems, index]) // Update loading state for the item
    setButtonStates((prevButtonStates) => {
      const newButtonStates = [...prevButtonStates];
      newButtonStates[index] = true; // Disable the button
      return newButtonStates;
    });


    //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()

    //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    //An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    //The price of the NFT is parsed from a string to a BigNumber using ethers.utils.parseUnits.
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    
    try{
    //The createMarketSale function is called on the contract to execute the transaction and buy the NFT.
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })

    // After the transaction is successfully completed, the loadNFTs function is called to refresh the list of NFTs.
    await transaction.wait()
  }catch (error){
    console.error('Error buying NFT:', error)
    setButtonStates((prevButtonStates) => {
      const newButtonStates = [...prevButtonStates];
      newButtonStates[index] = false; // Enable the button
      return newButtonStates;
    })
    setLoadingItems((prevLoadingItems) => prevLoadingItems.filter((_, idx) => idx !== index));
  } finally {
    setLoadingItems((prevLoadingItems) => prevLoadingItems.filter((_, idx) => idx !== index)) // Remove item from loading state
  }
}

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!nftDetails) {
    return <p>NFT details not found.</p>;
  }

  return (
    <div>
      <h1>NFT Details</h1>
      <p>NFT ID: {id}</p>
      <h2>{nftDetails.name}</h2>
      <img src={nftDetails.image} alt={nftDetails.name} />
      <p>Description: {nftDetails.description}</p>
      <p>Price: {nftDetails.price} ETH</p>
    </div>
  );
}

export default NFTDetails;
