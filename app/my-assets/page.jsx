"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/navigation";
import { Badge } from "@nextui-org/react";

import { nftaddress, nftmarketaddress } from "../../config";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTmarket.sol/NFTmarket.json";

export default function MyAssets() {
  /**The 'MyAssets' component maintains state using the 'nfts' and 'loadingState' variables.
   * The 'nfts' state holds an array of NFT objects, while 'loadingState' tracks the
   *  loading status of the NFTs. */
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [buttonStates, setButtonStates] = useState([]);

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
    const data = await marketContract.fetchMyNFTs();

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
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          relisted: i.relisted,
          tokenUri,
        };
        return item;
      })
    );
    /**The resulting array of items is stored in the nfts state variable, and the loadingState is set to 'loaded'. */
    setNfts(items);
    setLoadingState("loaded");
    setButtonStates(Array(items.length).fill(false));
  }

  /**  The listNFT function will reroute the page to the re-list nft page along with the nfts data where the user
   * will be able to re-list their NFT*/
  function listNFT(nft) {
    setButtonStates(true); // Disable the button
    router.push(`/my-assets/relist-nft?id=${nft.itemId}&tokenUri=${nft.tokenUri}`);
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

  //If the loadingState is 'loaded' and there are no items in the nfts array...
  if (loadingState === "loaded" && !nfts.length)
    return (
      <div
        style={{
          display: "table-cell",
          verticalAlign: "middle",
          textAlign: "center",
          height: 700,
        }}
      >
        <h1 className="create-title">
          &quot;Oops, you&apos;ve got an empty digital museum - Time to get some
          virtual masterpieces!&quot;
        </h1>
      </div>
    );

  return (
    <div>
      <section id="gallery">
        <div className="container">
          <h1 className="create-title">Owned Items</h1>
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
                    
                    {
                      nft.relisted ? (
                        <div>
                          <Badge
                            variant="flat"
                            color="error"
                            size="xl"
                          >
                            RE-LISTED
                          </Badge>
                        </div>                        
                      ) : (
                        <button
                          style={{ position: "absolute", right: "25px", top: 55 }}
                          type="button"
                          className="btn btn-dark"
                          disabled={buttonStates[i]} // Disable the button if it's already loading or user is the owner
                          onClick={() => listNFT(nft)}
                        >
                          {buttonStates[i] ? "Loading..." : "Re-List"}
                        </button> 
                      )
                    }

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
