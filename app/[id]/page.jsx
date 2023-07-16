"use client"

import React from 'react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router';

import {
  nftaddress, nftmarketaddress
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTmarket.sol/NFTmarket.json'


let rpcEndpoint = null
// below for Mumbai test network
rpcEndpoint = `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

function NFTDetails({params, searchParams}) {
  
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  //The 'useEffect' hook is used to load the NFTs when the component mounts. 
  useEffect(() => {
    loadNFTs()
  }, [])

  /**The loadNFTs function is an asynchronous function responsible for fetching and
   *  processing NFT data from the marketplace.*/
  async function loadNFTs() {  
    
    //It creates an instance of JsonRpcProvider from ethers library using the rpcEndpoint.
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)

    //It creates instances of the NFT and marketplace contracts using their addresses and ABIs.
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)

    //It calls the fetchMarketItems function on the marketplace contract to retrieve the market items.
    const data = await marketContract.fetchNFT(params.id)
    
    /**It then maps over the retrieved data to create an array of item objects
     * by fetching additional metadata for each item using the NFT contract. */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      
      let item = {
        tokenId: i.tokenId.toString(),
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    /**The resulting array of items is stored in the nfts state variable, and the loadingState is set to 'loaded'. */
    setNfts(items)
    setLoadingState('loaded') 
    setButtonStates(Array(items.length).fill(false));
  }

  if (!nfts) {
    return <div>Loading...</div>;
  }

  // Render the NFT details on the page
  return (
    <>
    {
      nfts.map((nft , i) => (
        <div>
      <h1>NFT Details</h1>
      <p>Token ID: {params.id}</p>
      <p>Seller: {nft.seller}</p>
      <p>Owner: {nft.owner}</p>
      <p>Price: {nft.price}</p>
      
    </div>
      ))
    }
    </>
  );





//   async function buyNft(nft, index) {
//     setLoadingItems((prevLoadingItems) => [...prevLoadingItems, index]) // Update loading state for the item
//     setButtonStates((prevButtonStates) => {
//       const newButtonStates = [...prevButtonStates];
//       newButtonStates[index] = true; // Disable the button
//       return newButtonStates;
//     });


//     //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
//     const web3Modal = new Web3Modal()
//     const connection = await web3Modal.connect()

//     //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
//     const provider = new ethers.providers.Web3Provider(connection)
//     const signer = provider.getSigner()

//     //An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
//     const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

//     //The price of the NFT is parsed from a string to a BigNumber using ethers.utils.parseUnits.
//     const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    
//     try{
//     //The createMarketSale function is called on the contract to execute the transaction and buy the NFT.
//     const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
//       value: price
//     })

//     // After the transaction is successfully completed, the loadNFTs function is called to refresh the list of NFTs.
//     await transaction.wait()
//   }catch (error){
//     console.error('Error buying NFT:', error)
//     setButtonStates((prevButtonStates) => {
//       const newButtonStates = [...prevButtonStates];
//       newButtonStates[index] = false; // Enable the button
//       return newButtonStates;
//     })
//     setLoadingItems((prevLoadingItems) => prevLoadingItems.filter((_, idx) => idx !== index));
//   } finally {
//     setLoadingItems((prevLoadingItems) => prevLoadingItems.filter((_, idx) => idx !== index)) // Remove item from loading state
//   }
// }

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!nftDetails) {
//     return <p>NFT details not found.</p>;
//   }

  // return (
  //   <div>
  //     <h1>NFT Details</h1>
  //     <p>NFT ID: {params.id}</p>
  //     {/* <h2>{nftDetails.name}</h2>
  //     <img src={nftDetails.image} alt={nftDetails.name} />
  //     <p>Description: {nftDetails.description}</p>
  //     <p>Price: {nftDetails.price} ETH</p> */}
  //   </div>
  // );
}

export default NFTDetails;
