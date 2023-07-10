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

export default function RelistNFT() {
    // A formInput state variable is declared with two properites: price, and image.
    const [formInput, updateFormInput] = useState({ price: '', image: '' })
    const router = useRouter()

    // The 'id' and 'tokenUri' is extracted from the 'query' property of the router object using object destructuring.
    const { id, tokenUri } = router.query
    // The 'image' and 'price' is extracted from the formInput uing object destructuring.
    const { image, price } = formInput

    // The 'useEffect' hook is used to load the NFT when the component mounts.
    useEffect(() => {
        fetchNFT()
    }, [id])

    // This asynchronous function will load the NFT the user wishes to re-list into the marketplace
    async function fetchNFT() {
        // If there is no 'tokenUri' the function is returned
        if (!tokenUri) return

        // The tokens meta data is retrived from the IPFS using axios
        const meta = await axios.get(tokenUri)
        // From the meta data, the image state variable is updated with the url to the image.
        updateFormInput(state => ({ ...state, image: meta.data.image }))
    }

    // The following function re-lists the NFT onto Zenith marketplace.
    async function listNFTForSale() {
        // If the user doesn't enter a price, then the function is returned.
        if (!price) return

        // It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()

        // It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        // The price entered by the user is formatted as an ether.
        const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')

        // An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
        // We get the listing price and then turn that listing price into a string.
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

         // We then wait for the NFT to be listed into the marketplace
        transaction = await contract.relistToken(id, priceFormatted, { value: listingPrice })
        await transaction.wait()

        // We then reroute the user to the home page.
        router.push('/')
    }

    return (
        <div className="container">
            <div className="mb-3">
                <input
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Asset Price in ETH"
                    onChange={(e) =>
                    updateFormInput({ ...formInput, price: e.target.value })
                    }
                />
            </div>

            <div>
                {
                    image && (
                        <img className="rounded mt-4" width="350" src={image} />
                    )
                }
            </div>

            <div>
                <button className="btn btn-dark" onClick={listNFTForSale}>
                List NFT
                </button>
            </div>

        </div>
    )
}