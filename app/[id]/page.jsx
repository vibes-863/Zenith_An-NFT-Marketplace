"use client";

import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/navigation";

import { nftaddress, nftmarketaddress } from "../../config";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTmarket.sol/NFTmarket.json";

let rpcEndpoint = null;
// below for Mumbai test network
rpcEndpoint = `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL;
}

export default function NFTDetails({ params, searchParams }) {
  const [nft, setNft] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [buttonState, setButtonStates] = useState([]);

  const router = useRouter();

  //The 'useEffect' hook is used to load the NFTs when the component mounts.
  useEffect(() => {
    loadNFT();
  }, []);

  /**The loadNFTs function is an asynchronous function responsible for fetching and
   *  processing NFT data from the marketplace.*/
  async function loadNFT() {
    // It creates an instance of JsonRpcProvider from ethers library using the rpcEndpoint.
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);

    // It creates instances of the NFT and marketplace contracts using their addresses and ABIs.
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );

    // It calls the fetchNFTDetailsfunction on the marketplace contract to retrieve the market item.
    const data = await marketContract.fetchNFTDetails(params.id);
    
    // Fetching additional metadata for each item using the NFT contract
    const tokenUri = await tokenContract.tokenURI(data.tokenId);
    const meta = await axios.get(tokenUri);
    let price = ethers.utils.formatUnits(data.price.toString(), "ether");

    let item = {
      tokenId: data.tokenId.toString(),
      price,
      itemId: data.itemId.toNumber(),
      seller: data.seller,
      owner: data.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    };

    // The resulting item is stored in the nft state variable, and the loadingState is set to 'loaded'. The buttonState is set to false.
    setNft(item);
    setLoadingState("loaded");
    setButtonStates(false);
  }

  async function buyNft(nft) {
    setButtonStates(true); // Disable the button

    //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    //The price of the NFT is parsed from a string to a BigNumber using ethers.utils.parseUnits.
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    try {
      //The createMarketSale function is called on the contract to execute the transaction and buy the NFT.
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.itemId,
        {
          value: price,
        }
      );
      // After the transaction is successfully completed, the user is redirected to the home page.
      await transaction.wait();
      router.push("/");
    } catch (error) {
      console.error("Error buying NFT:", error);
      setButtonStates(false); // Enable the button
    }
  }



    if (loadingState !== "loaded") {
      return (
        <div className="loadingDiv">
          <span class="loader">
            <span class="loader-inner"></span>
          </span>
        </div>
      );
    }
    

  // Render the NFT details on the page
  return (
    <>

      <div className="container" style={{padding: '0px 145px'}}>
        <h1 className="create-title">NFT Details</h1>
        <div style={{ position: 'relative', marginBottom: 70 }}>
          <div>
           <img className="rounded mt-4" width="350" src={nft.image} />
          </div>

          <div class="description">
            <h2 style={{ paddingBottom: 36, fontSize: 50 }}>#{nft.tokenId} - {nft.name}</h2>
            <span id="Price" style={{marginBottom: 50}}>
              <h5>Current Price</h5>
              <h3 style={{fontSize: 30}}><span style={{color: 'darkgray', fontSize: 23}}>MATIC</span> {nft.price}</h3>
            </span>
            <h5>Description</h5>
            <p style={{ width: 525 }}>{nft.description}</p>
          </div>
        </div>
        {/* <h1>NFT Details</h1>
        <p>Token ID: {nft.tokenId}</p>
        <p>Name: {nft.name}</p>
        <p>Description: {nft.description}</p>
        <p>Seller address: {nft.seller}</p>
        <p>Price: {nft.price}</p>
        <img src={nft.image} className="card-img-top" alt="NFT image" /> */}
        <button
        style={{display: 'block'}}
          type="button"
          className="btn btn-dark"
          disabled={buttonState} // Disable the button if it's already loading or user is the owner
          onClick={() => buyNft(nft)}
        >
          {buttonState ? "Loading..." : "Buy"}
        </button>
      </div>
    </>
  );
}
