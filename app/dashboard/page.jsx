"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { css, Badge } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { nftaddress, nftmarketaddress } from "../../config";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTmarket.sol/NFTmarket.json";

export default function Dashboard() {
  /** We have two arrays which can be set using the useState function. The
   * 'nfts' array will store the nfts that we have created (sold and unsold)
   */
  const [nfts, setNfts] = useState([]);

  //'loadingState' tracks the loading status of the NFTs.
  const [loadingState, setLoadingState] = useState("not-loaded");

  const router = useRouter();

  //The 'useEffect' hook is used to load the NFTs when the component mounts.
  useEffect(() => {
    loadNFTs();
  }, []);

  // This asynchronous function will load the NFTs that are owned by the user within the marketplace
  async function loadNFTs() {
    //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //It creates instances of the NFT and marketplace contracts using their addresses and ABIs.
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

    //It calls the fetchMarketItems function on the marketplace contract to retrieve the market items.
    const data = await marketContract.fetchItemsCreated();

    /**It then maps over the retrieved data to create an array of item objects
     * by fetching additional metadata for each item using the NFT contract. */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          itemId: i.itemId.toNumber(),
          price,
          tokenId: i.tokenId.toNumber(),
          creator: i.creator,
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
          name: meta.data.name,
        };
        return item;
      })
    );

    /**The resulting array of items is stored in the'nfts' state variable, and the loadingState is set to 'loaded'. */
    setNfts(items);
    setLoadingState("loaded");
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

  return (
    <div style={{ padding: 65 }}>
      <section id="allItems">
        <h1 className="create-title">Items Created</h1>
        {!nfts.length ? (
          <div>
            <h3 className="px-20 py-10 text-3xl">
              You have not created any NFTs. Go to &apos;Create NFT&apos; to
              mint your first NFT
            </h3>
          </div>
        ) : (
          <div></div>
        )}
        <div className="container" style={{ margin: 50 }}>
          <div className="row row-cols-auto">
            {nfts.map((nft, i) => (
              <div key={i} className="col">
                <div className="card" style={{ width: "18rem" }}>
                  <div className="img-holder">
                    <img
                      src={nft.image}
                      className="card-img-top"
                      alt="NFT image"
                    />
                  </div>
                  <div className="card-body" style={{ position: "relative" }}>
                    <h5 className="card-title">{nft.name}</h5>
                    <p className="card-text">
                      <span style={{ color: "darkgray", fontSize: 17 }}>
                        MATIC
                      </span>{" "}
                      {nft.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark create-btn"
                    // style={{ position: "absolute", right: "25px", top: 55 }}
                    onClick={() => router.push(`/${nft.itemId}`)}
                  ></button>
                  {nft.sold ? (
                    <div className="badge">
                      <Badge variant="flat" d color="error" size="xl">
                        SOLD
                      </Badge>
                    </div>
                  ) : nft.creator == nft.seller ? (
                    <div className="badge">
                      <Badge auto css={{display: '$block'}} variant="flat" d color="primary" size="xl">
                        YOU LISTED
                      </Badge>
                    </div>
                  ) : (
                    <div className="badge">
                      <Badge variant="flat" d color="success" size="xl">
                        AVAILABLE
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
