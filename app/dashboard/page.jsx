"use client"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftaddress, nftmarketaddress
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTmarket.sol/NFTmarket.json'

export default function Dashboard() {

    /** We have two arrays which can be set using the useState function. The 
     * 'nfts' array will store the nfts that we have created (sold and unsold)
     * 'sold' array will store the nfts that we have created which have been sold.
     */
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])

    //'loadingState' tracks the loading status of the NFTs.
    const [loadingState, setLoadingState] = useState('not-loaded')

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
        const data = await marketContract.fetchItemsCreated()

        /**It then maps over the retrieved data to create an array of item objects
        * by fetching additional metadata for each item using the NFT contract. */
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
            }
            return item
        }))

        // We filter the items above by checking if it is sold and then store those
        // items into an new array 'soldItems'
        const soldItems = items.filter(i => i.sold)

        /**The resulting array of items is stored in the 'sold' and 'nfts' state variables, and the loadingState is set to 'loaded'. */
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }

    return (
        <div>
            <section id="allItems">
                <h3 className='text-2xl py-2'>Items Created</h3>
                <div className="container" style={{margin: 50,}}>
                    <div className="row row-cols-auto">
                        {
                            nfts.map((nft, i) => (
                                <div key={i} className="col">
                                    <div className="card" style={{ width: '18rem' }}>
                                    <div className='img-holder'>
                                        <img src={nft.image} className="card-img-top" alt="..." />
                                        </div><div className="card-body">
                                        <h5 className="card-title">{nft.name}</h5>
                                            <p className="card-text">{nft.description}</p>
                                            <p className="card-text">Price - {nft.price} ETH</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            <section id="soldItems">
                {
                    Boolean(sold.length) && (
                        <div>
                            <h3 className='text-2xl py-2'>Items sold</h3>
                            <div className="container" style={{margin: 50,}}>
                                <div className="row row-cols-auto">
                                    {
                                        sold.map((nft, i) => (
                                            <div key={i} className="col">
                                                <div className="card" style={{ width: '18rem' }}>
                                                    <div className='img-holder'>
                                                        <img src={nft.image} className="card-img-top" alt="..." />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{nft.name}</h5>
                                                        <p className="card-text">{nft.description}</p>
                                                        <p className="card-text">Price - {nft.price} ETH</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>
        </div>
    )
}