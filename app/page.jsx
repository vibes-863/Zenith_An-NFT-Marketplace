"use client"

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
// below for Mumbai test network
rpcEndpoint = `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {
  

  /**The 'Home' component maintains state using the 'nfts' and 'loadingState' variables.
   * The 'nfts' state holds an array of NFT objects, while 'loadingState' tracks the
   *  loading status of the NFTs. */
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [buttonStates, setButtonStates] = useState([])
  const [loadingItems, setLoadingItems] = useState([]) // Track loading state for each NFT item

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
    setButtonStates(Array(items.length).fill(false));
  }



  //If the loadingState is 'loaded' and there are no items in the nfts array...
  if (loadingState === 'loaded' && !nfts.length)
    return (
      <>
        <section id="heroe">
          <div id="content">
            <div className="top">
              <div className="main-txt">
                <h1>Zenith</h1>
                <h3>An NFT Marketplace</h3>
              </div>
            </div>
          </div>
        </section>
        <h3 className="px-20 py-10 text-3xl">No items in marketplace</h3>
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
        <div className="container" style={{margin: 50,}}>
          <div className="row row-cols-auto">
            {
              nfts.map((nft, i) => (
                <div key={i} className="col">
                  <div className="card" style={{ width: '18rem' }}>
                    <div className='img-holder'>
                    <img src={nft.image} className="card-img-top" alt="..." />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{nft.name}</h5>
                      <p className="card-text">{nft.description}</p>
                      <p className="card-text">{nft.price} ETH</p>
                      <button
                      type="button"
                      className="btn btn-dark"
                      disabled={buttonStates[i]} // Disable the button if it's already loading or user is the owner
                      href={`/${i.tokenId}.js`}
                    >
                      {buttonStates[i] ? 'Loading...' : 'Buy'}
                    </button>
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
