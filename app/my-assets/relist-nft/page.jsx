"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Modal, Text, Loading } from "@nextui-org/react";

import { nftaddress, nftmarketaddress } from "../../../config";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTmarket.sol/NFTmarket.json";

export default function RelistNFT() {
  const [loadingState, setLoadingState] = useState("not-loaded");

  // A formInput state variable is declared with two properites: price, and image.
  const [formInput, updateFormInput] = useState({
    price: "",
    image: "",
    name: "",
    description: "",
  });
  const [buttonState, setButtonStates] = useState([]);

  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  // The 'id' and 'tokenUri' is extracted from the 'query' property of the router object using object destructuring.
  const id = searchParams.get("id");
  const tokenUri = searchParams.get("tokenUri");
  // The 'image' and 'price' is extracted from the formInput uing object destructuring.
  const { image, price, name, description } = formInput;

  // The 'useEffect' hook is used to load the NFT when the component mounts.
  useEffect(() => {
    fetchNFT();
  }, [id]);

  // This asynchronous function will load the NFT the user wishes to re-list into the marketplace
  async function fetchNFT() {
    // If there is no 'tokenUri' the function is returned
    if (!tokenUri) return;

    // The tokens meta data is retrived from the IPFS using axios
    const meta = await axios.get(tokenUri);
    setLoadingState("loaded");
    setButtonStates(false);
    // From the meta data, the image state variable is updated with the url to the image.
    updateFormInput((state) => ({
      ...state,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    }));
  }

  // The following function re-lists the NFT onto Zenith marketplace.
  async function listNFTForSale() {
    setButtonStates(true); // Disable the button
    await handler();
    // If the user doesn't enter a price, then the function is returned.
    if (!price) {
      await closeHandler();
      setButtonStates(false); // Enable the button
      return;
    }

    // It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    // It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // The price entered by the user is formatted as an ether.
    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");

    // An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // We get the listing price and then turn that listing price into a string.
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    try {
      // We then wait for the NFT to be listed into the marketplace
      let transaction = await contract.relistToken(
        nftaddress,
        id,
        priceFormatted,
        { value: listingPrice }
      );
      await transaction.wait();
      await closeHandler();

      // We then reroute the user to the home page.
      router.push("/my-assets");
    } catch (error) {
      console.error("Error buying NFT:", error);
      setButtonStates(false); // Enable the button
      await closeHandler();
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

  return (
    <div className="container">
      <h1 className="create-title">Your NFT is all set to be listed!</h1>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <div>
          {image && <img className="rounded mt-4" width="350" src={image} />}
        </div>

        <div class="description">
          <h2 style={{ paddingBottom: 100, fontSize: 50 }}>{name}</h2>
          <h5>Description</h5>
          <p style={{ width: 800 }}>{description}</p>
        </div>
      </div>

      <div className="mb-3">
        {/* <input
                    type="number"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Asset Price in MATIC"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                    }
                /> */}
        <input
          type="number"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Asset Price in MATIC"
          value={formInput.price}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value); // Parse the input value to a floating-point number
            const positiveValue = isNaN(newValue) ? "" : Math.max(0, newValue); // Make sure it's a positive number
            updateFormInput({ ...formInput, price: positiveValue.toString() });
          }}
          step="0.01" // This step attribute restricts the input to 2 decimal places (adjust as needed)
          min="0" // This sets the minimum allowed value to 0, so only positive decimals are accepted
        />
      </div>

      <div>
        <button
          className="btn btn-dark"
          style={{ margin: "24px auto 40px" }}
          disabled={buttonState} // Disable the button
          onClick={listNFTForSale}
        >
          {buttonState ? "Loading..." : "List NFT"}
        </button>

        <Modal
          preventClose
          blur
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" b size={25}>
              Transcation pending <Loading />
            </Text>
          </Modal.Header>

          <Modal.Body>
            <Text align="justify" size={17}>
              Please confirm the transaction to Re-list the NFT
            </Text>
            <Text align="center" b size={14}>
              Each transaction may take upto 20 seconds
            </Text>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
