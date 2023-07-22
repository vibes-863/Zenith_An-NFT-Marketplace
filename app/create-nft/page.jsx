"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/navigation";
import Web3Modal from "web3modal";
import { Modal, Tooltip, Text, Loading } from "@nextui-org/react";

// This will be used to store the NFTs data
const auth =
  "Basic " +
  Buffer.from(
    process.env.NEXT_PUBLIC_IPFS_API_KEY +
      ":" +
      process.env.NEXT_PUBLIC_IPFS_API_SECRET_KEY
  ).toString("base64");
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

import { nftaddress, nftmarketaddress } from "../../config";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTmarket.sol/NFTmarket.json";

export default function CreateNFT() {
  /** fileUrl would be the url for the file that the user can upload to the IPFS
   *  the formInput will allow the user to input the price, name, and description of the NFT
   */
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  const router = useRouter();

  useEffect(() => {
    // Enable or disable the create button based on input validity
    const createButton = document.getElementById("CreateButton");
    createButton.disabled = !(
      formInput.name &&
      formInput.description &&
      formInput.price &&
      fileUrl
    );
  }, [formInput, fileUrl]);

  // The onChange function will be used to create and update the file url. The function will be invoked with an event 'e'
  async function onChange(e) {
    // the array will only contain one item, and so we take the first item
    const file = e.target.files[0];

    try {
      // we wait for the file to get uploaded.
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      // after the file is uploaded, we can identify the url of the file.
      const url = `https://zenith.infura-ipfs.io/ipfs/${added.path}`;
      // we then set the url of the NFT to the url above
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  // the following function is used to create and saving it to ipfs
  async function createNFT() {

    await handler();

    // we destructure the name, description, and price from the form input
    const { name, description, price } = formInput;
    // we then check to see if all the required values have been entered.
    if (!name || !description || !price || !fileUrl) return;

    // We then stringify the name, description, and image into a variable called data
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    // we then save the data to ipfs using try and catch.
    try {
      const added = await client.add(data);
      const url = `https://zenith.infura-ipfs.io/ipfs/${added.path}`;
      // adter file is uploaded to IPFS, pass the URL to save it on the blockchain network
      await createSale(url);
      setLoading(false);
      resetForm();
    } catch (error) {
      console.log("Error uploading file: ", error);
      setLoading(false);
      await closeHandler();
    }
  }

  /**  the following function lists the NFT on Zenith by saving it onto the blockchain network.
   * It dpes this by making the owner of the NFT, Zenith */
  async function createSale(url) {
    setLoading(true);

    //It creates an instance of Web3Modal and prompts the user to connect to their Ethereum wallet.
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    //It then creates a Web3Provider using the established connection and obtains the signer (account) for executing transactions.
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //An instance of the nft contract is created using the nftaddress, ABI, and signer.
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    // We then create the token and then wait for the transaction to complete.
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    // We then want the tokenId to return from the transaction
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    // we then need to find the price the user wants to sell the NFT for.
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    // An instance of the marketplace contract is created using the nftmarketaddress, ABI, and signer.
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // We get the listing price and then turn that listing price into a string.
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    // We then wait for the NFT to be listed into the marketplace
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    
    await closeHandler();
    // We then reroute the user to the home page.
    router.push("/");
  }

  function resetForm() {
    updateFormInput({ price: "", name: "", description: "" });
    setFileUrl(null);
  }

  // $("#CreateButton").one("click", createNFT);
  return (
    <div className="container">
      <header className="header">
        <h1 className="create-title" style={{ margin: "40px 0px 30px" }}>
          Create New Item
        </h1>
      </header>
      <h3
        style={{
          fontFamily: '"Poppins", sans-serif',
          fontSize: 15,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Image
      </h3>
      <Tooltip
        content={"Uploaded image will not be cropped"}
        color="invert"
        placement="right"
      >
        <div class="image-input">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="grey"
            class="bi bi-image"
            viewBox="0 0 16 16"
          >
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
          </svg>
          <input type="file" onChange={onChange} />
          {fileUrl && (
            <img
              className="nft-img rounded mt-4"
              style={{ minHeight: 300, minWidth: 400 }}
              src={fileUrl}
              alt="Preview not available"
            />
          )}
        </div>
      </Tooltip>

      <div className="mb-3">
        <input
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Asset Name"
          value={formInput.name}
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="Asset Description"
          value={formInput.description}
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        ></textarea>
      </div>

      <div className="mb-3">
        {/* <input
          type="number"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Asset Price in MATIC"
          value={formInput.price}
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

      <button
        className="btn btn-dark"
        style={{ display: "block", margin: "50px auto" }}
        id="CreateButton"
        disabled={loading}
        onClick={createNFT}
      >
        {loading ? "Creating..." : "Create Digital Asset"}
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
          <Text align="justify" size={17}>Please confirm BOTH the transactions in order to create and then list the Token.</Text>
          <Text align="center" b size={14}>Each transaction may take upto 20 seconds</Text>
        </Modal.Body>
      </Modal>
    </div>
  );
}
