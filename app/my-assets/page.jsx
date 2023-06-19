"use client"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/navigation'

import {
  nftaddress, nftmarketaddress
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTmarket.sol/NFTmarket.json'

export default function MyAssets() {

    /**The 'MyAssets' component maintains state using the 'nfts' and 'loadingState' variables.
    * The 'nfts' state holds an array of NFT objects, while 'loadingState' tracks the
    *  loading status of the NFTs. */
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()

    //The 'useEffect' hook is used to load the NFTs when the component mounts. 
    useEffect(() => {
        loadNFTs()
    }, [])    

    // This asynchronous function will load the NFTs that are owned by the user within the marketplace
    async function loadNFTs() {
        //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()

        //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //It creates instances of the NFT and marketplace contracts using their addresses and ABIs.
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

        //It calls the fetchMarketItems function on the marketplace contract to retrieve the market items.
        const data = await marketContract.fetchMyNFTs()

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
                tokenUri
            }
            return item
        }))
        /**The resulting array of items is stored in the nfts state variable, and the loadingState is set to 'loaded'. */
        setNfts(items)
        setLoadingState('loaded') 
    }

    /**  The listNFT function will reroute the page to the re-list nft page along with the nfts data where the user 
     * will be able to re-list their NFT*/
    function listNFT(nft) {
        console.log('nft:', nft)
        router.push(`/resell-nft?id=${nft.tokenId}&tokenUri=${nft.tokenUri}`)

    }

    //If the loadingState is 'loaded' and there are no items in the nfts array...
    if (loadingState === 'loaded' && !nfts.length) return (
        <h1 className="px-20 py-10 text-3xl">No assets owned</h1>
    );

    return (
        <div>
            <section id="gallery">
                <div className="container">
                <div className="row">
                    {
                    nfts.map((nft, i) => (
                        <div key={i} className="col-4">
                        <div className="card" style={{ width: '18rem' }}>
                            <img src={nft.image} className="card-img-top" alt="..." />
                            <div className="card-body">
                            <p className="card-text">{nft.price}</p>
                            <button type="button" className="btn btn-dark" onClick={() => listNFT(nft)}>Re-List</button>
                            </div>
                        </div>                  
                        </div>
                    ))
                    }
                </div>
                </div>
            </section>
        </div>
    )
    
}