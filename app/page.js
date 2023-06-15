"use client"
import './globals.css'
import React from 'react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTmarket.sol/NFTmarket.json'

let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {

  /**The 'Home' component maintains state using the 'nfts' and 'loadingState' variables.
   * The 'nfts' state holds an array of NFT objects, while 'loadingState' tracks the
   *  loading status of the NFTs. */
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
    const data = await marketContract.fetchMarketItems()
    
    /**It then maps over the retrieved data to create an array of item objects
     * by fetching additional metadata for each item using the NFT contract. */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
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
  }

  /**The buyNft function is an asynchronous function responsible for buying an NFT from the marketplace.*/
  async function buyNft(nft) {

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
    
    //The createMarketSale function is called on the contract to execute the transaction and buy the NFT.
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })

    // After the transaction is successfully completed, the loadNFTs function is called to refresh the list of NFTs.
    await transaction.wait()
    loadNFTs()
  }

  //If the loadingState is 'loaded' and there are no items in the nfts array...
  if (loadingState === 'loaded' && !nfts.length)
    return (
      <>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        ></link>

        <section id="heroe">
          <div id="content">
            <div className="top">
              <div className="main-txt">
                <h1>Zenith</h1>
                <h4>An NFT Marketplace</h4>
              </div>
            </div>
          </div>
        </section>
        <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
      </>
    );
  
  return (
    <>
      <section id="heroe">
        <div id="content">
          <div className="top">
            <div className="main-txt">
              <h1>Zenith</h1>
              <h4>An NFT Marketplace</h4>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="container">
          <div className="row">
            {
              nfts.map((nft, i) => (
                <div key={i} className="col-4">
                  <div className="card" style="width: 18rem;">
                    <img src={nft.image} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{nft.name}</h5>
                      <p className="card-text">{nft.description}</p>
                      <p className="card-text">{nft.price}</p>
                      <button type="button" className="btn btn-dark" onClick={() => buyNft(nft)}>Buy</button>
                    </div>
                  </div>                  
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  );
}
