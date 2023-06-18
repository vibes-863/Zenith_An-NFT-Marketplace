"use client"
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/navigation'
import Web3Modal from 'web3modal'

// This will be used to store the NFTs data
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftaddress, nftmarketaddress
} from '../../config'

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTmarket.sol/NFTmarket.json";

export default function CreateNFT() {   
    /** fileUrl would be the url for the file that the user can upload to the IPFS
     *  the formInput will allow the user to input the price, name, and description of the NFT
     */
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    // The onChange function will be used to create and update the file url. The function will be invoked with an event 'e'
    async function onChange(e) {
        // the array will only contain one item, and so we take the first item
        const file = e.target.files[0]

        try {
            // we wait for the file to get uploaded.
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            // after the file is uploaded, we can identify the url of the file.
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            // we then set the url of the NFT to the url above
            setFileUrl(url)
        } catch (e) {
            console.log(e)
        }
    }

    // the following function is used to create and saving it to ipfs
    async function createNFT() {
        console.log('Done')
        // we destructure the name, description, and price from the form input
        const { name, description, price } = formInput
        // we then check to see if all the required values have been entered.
        if (!name || !description || !price || !fileUrl) return
        
        // We then stringify the name, description, and image into a variable called data
        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        // we then save the data to ipfs using try and catch.
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log('Done')
            // adter file is uploaded to IPFS, pass the URL to save it on the blockchain network
            createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }


    /**  the following function lists the NFT on Zenith by saving it onto the blockchain network.
    * It dpes this by making the owner of the NFT, Zenith */
    async function createSale() {
        //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()

        //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //An instance of the nft contract is created using the nftaddress, ABI, and signer.
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        // We then create the token and then wait for the transaction to complete.
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        // We then want the itemId to return from the transaction
        let event = tx.events[0]
        let value = event.args[2]
        let itemId = value.toNumber

        // we then need to find the price the user wants to sell the NFT for.
        const price = ethers.utils.parseUnits(formInput.price, "ether")

        // An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
        // We get the listing price and then turn that listing price into a string.
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        // We then wait for the NFT to be listed into the marketplace
        transaction = await contract.createMarketItem(nftaddress, itemId, price, { value: listingPrice }
        )
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
                    placeholder="Asset Name"
                    onChange={(e) =>
                    updateFormInput({ ...formInput, name: e.target.value })
                    }
                />
            </div>

            <div class="mb-3">
                <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Asset Description"
                    onChange={(e) =>
                    updateFormInput({ ...formInput, description: e.target.value })
                    }
                ></textarea>
            </div>

            <div className="mb-3">
                <input
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Asset Price in Matic"
                    onChange={(e) =>
                    updateFormInput({ ...formInput, price: e.target.value })
                    }
                />
            </div>

            <div class="mb-3">
                <input class="form-control" type="file" id="formFile" onChange={onChange}/>
            </div>

            {
                fileUrl && ( 
                    <img className="rounded mt-4" width="350" src={fileUrl} />
                )
            }
            
            <button class="btn btn-dark" onClick={createNFT}>
            Create Digital Asset
            </button>
        </div>
    );
}