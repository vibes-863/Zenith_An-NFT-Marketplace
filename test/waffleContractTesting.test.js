const { expect } = require("chai");
const exp = require("constants");
const { ethers } = require("hardhat");

// toWei converts ether to wei
const toWei = (num) => ethers.utils.parseEther(num.toString());
// fromWei converts wei to ether
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketplace", async function () {
  // deployer is the account address for the marketplace(the deployer), used to collect listing fee etc.
  let deployer, addr1, addr2;
  let nft, market, marketAddress, nftContractAddress, listingPrice;
  let URI = "Sample URI";

  // This beforeEach hook will run these functions at the beginning of every test.
  beforeEach(async function () {
    // Get contract factories
    const NFT = await ethers.getContractFactory("NFT");
    const Market = await ethers.getContractFactory("NFTmarket");
    // Get signers. Signers are basically the account addresses, we get them from the hardhat node.
    [deployer, addr1, addr2] = await ethers.getSigners();

    // Deploy NFTmarket contract and get the market address
    market = await Market.deploy();
    await market.deployed();
    marketAddress = market.address;

    // Deploy NFT contract by passing the market address. Then get the nftContractAddress
    nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    nftContractAddress = nft.address;
  });

  describe("Deployment", function () {
    it("Should track name and symbol of the nft collection", async function () {
      expect(await nft.name()).to.equal("Zenith Tokens");
      expect(await nft.symbol()).to.equal("ZET");
    });
    it("Should track the owner and listing price of the marketplace", async function () {
      expect(await market.owner()).to.equal(deployer.address);
      expect(await market.listingPrice()).to.equal(toWei("0.025"));
    });
  });

  describe("Minting NFTs", function () {
    it("Should track each minted NFT", async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      expect(await nft._tokenIds()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      // addr2 mints an nft
      await nft.connect(addr2).createToken(URI);
      expect(await nft._tokenIds()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Retrieve Listing Price", function () {
    it("The frontend should be able to retrieve the Listing Price from the Marketplace Contract", async function () {
      expect(await market.getListingPrice()).to.equal(toWei("0.025"));
    });
  });

  describe("Making marketplace items", function () {
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
    });

    it("Should track newly created item, transfer NFT from seller to marketplace and emit MarketItemCreated event", async function () {
      // addr1 offers their nft at a price of 1 ether
      await expect(
        market
          .connect(addr1)
          .createMarketItem(nftContractAddress, 1, toWei(1), {
            value: listingPrice,
          })
      )
        .to.emit(market, "MarketItemCreated")
        .withArgs(
          1,
          nftContractAddress,
          1,
          addr1.address,
          addr1.address,
          "0x0000000000000000000000000000000000000000",
          toWei(1),
          false,
          false
        );
      // Owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketAddress);
      // Item count (IDs) should now equal 1
      expect(await market._itemIds()).to.equal(1);
      // Get item from idToMarketItem mapping then check fields to ensure they are correct
      const item = await market.idToMarketItem(1);
      expect(item.itemId).to.equal(1);
      expect(item.nftContract).to.equal(nftContractAddress);
      expect(item.tokenId).to.equal(1);
      expect(item.creator).to.equal(addr1.address);
      expect(item.seller).to.equal(addr1.address);
      expect(item.owner).to.equal("0x0000000000000000000000000000000000000000");
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
      expect(item.relisted).to.equal(false);
    });

    it("Should fail if price is set to zero", async function () {
      await expect(
        market
          .connect(addr1)
          .createMarketItem(nftContractAddress, 1, 0, { value: listingPrice })
      ).to.be.revertedWith("Price must be at least 1 wei");
    });

    it("Should fail if listing fee paid by user does not equal listing price", async function () {
      await expect(
        market
          .connect(addr1)
          .createMarketItem(nftContractAddress, 1, toWei(1), {
            value: 0,
          })
      ).to.be.revertedWith("Value paid must be equal to listing price");
    });
  });

  describe("Purchasing marketplace items", function () {
    let price = 2;
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      // addr1 makes their nft a marketplace item
      await market
        .connect(addr1)
        .createMarketItem(nftContractAddress, 1, toWei(price), {
          value: listingPrice,
        });
      // fetch the listing price from the NFTmarket contract
      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
    });

    it("Should pay seller, transfer NFT to buyer, update item owner to buyer, update item as sold, increase count of sold items and transfer listing fee to contract owner (deployer)", async function () {
      const sellerInitalEthBal = await addr1.getBalance();
      const deployerInitialEthBal = await deployer.getBalance();
      // fetch the item's price to be paid by the buyer to the owner of the NFT
      console.log();
      // addr2 purchases item
      await market
        .connect(addr2)
        .createMarketSale(nftContractAddress, 1, { value: toWei(price) });
      // Get item from idToMarketItem mapping then check fields to ensure they are correct
      const item = await market.idToMarketItem(1);
      expect(item.itemId).to.equal(1);
      expect(item.nftContract).to.equal(nftContractAddress);
      expect(item.tokenId).to.equal(1);
      expect(item.creator).to.equal(addr1.address);
      expect(item.seller).to.equal(addr1.address);
      expect(item.owner).to.equal(addr2.address);
      expect(item.price).to.equal(toWei(price));
      expect(item.sold).to.equal(true);
      expect(item.relisted).to.equal(false);

      const sellerFinalEthBal = await addr1.getBalance();
      const deployerFinalEthBal = await deployer.getBalance();
      // Seller should receive payment for the price of the NFT sold.
      expect(+fromWei(sellerFinalEthBal)).to.equal(
        +price + +fromWei(sellerInitalEthBal)
      );
      //expect(+fromWei(deployerFinalEthBal) - +fromWei(deployerInitialEthBal)).to.equal(
      //+fromWei(listingPrice) 
      //);
      // The buyer should now own the nft
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should fail for invalid item IDs", async function () {
      // Fails for invalid item IDs
      await expect(
        market
          .connect(addr2)
          .createMarketSale(nftContractAddress, 2, { value: toWei(price) })
      ).to.be.revertedWith("Item doesn't exist");
      await expect(
        market
          .connect(addr2)
          .createMarketSale(nftContractAddress, 0, { value: toWei(price) })
      ).to.be.revertedWith("Item doesn't exist");
    });

    it("Should fail when not enough ether is paid", async function () {
      // Fails when not enough ether is paid with the transaction.
      await expect(
        market
          .connect(addr2)
          .createMarketSale(nftContractAddress, 1, { value: toWei(price - 1) })
      ).to.be.revertedWith(
        "Please submit the asking price in order to complete the purchase"
      );
    });

    it("Should fail for sold items", async function () {
      // addr2 purchases item 1
      await expect(
        market
          .connect(addr2)
          .createMarketSale(nftContractAddress, 1, { value: toWei(price) })
      );
      // deployer tries purchasing item 1 after its been sold
      await expect(
        market
          .connect(deployer)
          .createMarketSale(nftContractAddress, 1, { value: toWei(price) })
      ).to.be.revertedWith("Item already sold");
    });
  });

  describe("Fetching market items", function () {
    beforeEach(async function () {
      // fetch the listing price from the NFTmarket contract
      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
      // addr1 mints first nft
      await nft.connect(addr1).createToken(URI);
      // addr1 makes their first nft a marketplace item
      await market
        .connect(addr1)
        .createMarketItem(nftContractAddress, 1, toWei(1), {
          value: listingPrice,
        });
      // addr1 mints second nft
      await nft.connect(addr1).createToken(URI);
      // addr1 makes their second nft a marketplace item
      await market
        .connect(addr1)
        .createMarketItem(nftContractAddress, 2, toWei(2), {
          value: listingPrice,
        });
      // addr2 mints first nft
      await nft.connect(addr2).createToken(URI);
      // addr2 makes their first nft a marketplace item
      await market
        .connect(addr2)
        .createMarketItem(nftContractAddress, 3, toWei(3), {
          value: listingPrice,
        });
      // addr2 mints second nft
      await nft.connect(addr2).createToken(URI);
      // addr2 makes their second nft a marketplace item
      await market
        .connect(addr2)
        .createMarketItem(nftContractAddress, 4, toWei(4), {
          value: listingPrice,
        });
    });

    it("Should fetch all unsold market items using the fetchMarketItems() function and store it in an array", async function () {
      // fetch the array of unsold items
      const items = await market.fetchMarketItems();
      // check the number of items is correct
      expect(items.length).to.equal(4);

      // verify all the item's values are correct.
      // item index 0 (itemId=1)
      let item0 = items[0];
      expect(item0.itemId).to.equal(1);
      expect(item0.nftContract).to.equal(nftContractAddress);
      expect(item0.tokenId).to.equal(1);
      expect(item0.seller).to.equal(addr1.address);
      expect(item0.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item0.price).to.equal(toWei(1));
      expect(item0.sold).to.equal(false);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);

      // item index 1 (itemId=2)
      let item1 = items[1];
      expect(item1.itemId).to.equal(2);
      expect(item1.nftContract).to.equal(nftContractAddress);
      expect(item1.tokenId).to.equal(2);
      expect(item1.seller).to.equal(addr1.address);
      expect(item1.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item1.price).to.equal(toWei(2));
      expect(item1.sold).to.equal(false);
      expect(await nft.tokenURI(item1.tokenId)).to.equal(URI);

      // item index 2 (itemId=3)
      let item2 = items[2];
      expect(item2.itemId).to.equal(3);
      expect(item2.nftContract).to.equal(nftContractAddress);
      expect(item2.tokenId).to.equal(3);
      expect(item2.seller).to.equal(addr2.address);
      expect(item2.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item2.price).to.equal(toWei(3));
      expect(item2.sold).to.equal(false);
      expect(await nft.tokenURI(item2.tokenId)).to.equal(URI);

      // item index 3 (itemId=4)
      let item3 = items[3];
      expect(item3.itemId).to.equal(4);
      expect(item3.nftContract).to.equal(nftContractAddress);
      expect(item3.tokenId).to.equal(4);
      expect(item3.seller).to.equal(addr2.address);
      expect(item3.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item3.price).to.equal(toWei(4));
      expect(item3.sold).to.equal(false);
      expect(await nft.tokenURI(item3.tokenId)).to.equal(URI);
    });

    it("If an item is sold, it should not fetch it", async function () {
      // addr1 purchases item 3 (itemId=3)
      await market
        .connect(addr1)
        .createMarketSale(nftContractAddress, 3, { value: toWei(3) });
      // fetch the array of unsold items
      const items = await market.fetchMarketItems();
      // check the number of items is correct
      expect(items.length).to.equal(3);
    });

    it("Should fetch all the items owned by the caller using the fetchMyNFTs() function and store it in an array", async function () {
      // addr1 purchases item 4 (itemId=3)
      await market
        .connect(addr1)
        .createMarketSale(nftContractAddress, 3, { value: toWei(3) });
      // addr1 purchases item 4 (itemId=4)
      await market
        .connect(addr1)
        .createMarketSale(nftContractAddress, 4, { value: toWei(4) });
      // fetch the array of items purchased by addr1
      const items = await market.connect(addr1).fetchMyNFTs();
      // check the number of items is correct
      expect(items.length).to.equal(2);

      // verify all the item's values are correct.
      // item index 0 (itemId=3)
      let item0 = items[0];
      expect(item0.itemId).to.equal(3);
      expect(item0.nftContract).to.equal(nftContractAddress);
      expect(item0.tokenId).to.equal(3);
      expect(item0.seller).to.equal(addr2.address);
      expect(item0.owner).to.equal(addr1.address);
      expect(item0.price).to.equal(toWei(3));
      expect(item0.sold).to.equal(true);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);

      // item index 1 (itemId=4)
      let item1 = items[1];
      expect(item1.itemId).to.equal(4);
      expect(item1.nftContract).to.equal(nftContractAddress);
      expect(item1.tokenId).to.equal(4);
      expect(item1.seller).to.equal(addr2.address);
      expect(item1.owner).to.equal(addr1.address);
      expect(item1.price).to.equal(toWei(4));
      expect(item1.sold).to.equal(true);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);
    });

    it("Should fetch all the items created by the caller", async function () {
      // fetch array of items created by addr1
      const items_addr1 = await market.connect(addr1).fetchItemsCreated();
      // check the number of items is correct
      expect(items_addr1.length).to.equal(2);

      // verify all the item's values are correct.
      // item index 0 (itemId=1)
      let item0 = items_addr1[0];
      expect(item0.itemId).to.equal(1);
      expect(item0.nftContract).to.equal(nftContractAddress);
      expect(item0.tokenId).to.equal(1);
      expect(item0.seller).to.equal(addr1.address);
      expect(item0.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item0.price).to.equal(toWei(1));
      expect(item0.sold).to.equal(false);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);

      // item index 1 (itemId=2)
      let item1 = items_addr1[1];
      expect(item1.itemId).to.equal(2);
      expect(item1.nftContract).to.equal(nftContractAddress);
      expect(item1.tokenId).to.equal(2);
      expect(item1.seller).to.equal(addr1.address);
      expect(item1.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item1.price).to.equal(toWei(2));
      expect(item1.sold).to.equal(false);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);

      // fetch array of items created by addr2
      const items_addr2 = await market.connect(addr2).fetchItemsCreated();
      // check the number of items is correct
      expect(items_addr2.length).to.equal(2);

      // verify all the item's values are correct.
      // item index 0 (itemId=3)
      item0 = items_addr2[0];
      expect(item0.itemId).to.equal(3);
      expect(item0.nftContract).to.equal(nftContractAddress);
      expect(item0.tokenId).to.equal(3);
      expect(item0.seller).to.equal(addr2.address);
      expect(item0.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item0.price).to.equal(toWei(3));
      expect(item0.sold).to.equal(false);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);

      // item index 1 (itemId=4)
      item1 = items_addr2[1];
      expect(item1.itemId).to.equal(4);
      expect(item1.nftContract).to.equal(nftContractAddress);
      expect(item1.tokenId).to.equal(4);
      expect(item1.seller).to.equal(addr2.address);
      expect(item1.owner).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(item1.price).to.equal(toWei(4));
      expect(item1.sold).to.equal(false);
      expect(await nft.tokenURI(item0.tokenId)).to.equal(URI);
    });
  });

  describe("Transfering token", function () {
    let price = 2;
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      // addr1 makes their nft a marketplace item
      await market
        .connect(addr1)
        .createMarketItem(nftContractAddress, 1, toWei(price), {
          value: listingPrice,
        });
      // fetch the listing price from the NFTmarket contract
      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
      // addr2 purchases item
      await market
        .connect(addr2)
        .createMarketSale(nftContractAddress, 1, { value: toWei(price) });
    });

    it("Should transfer the token to other account", async function () {
      let item = await market.idToMarketItem(1);
      // owner of token should be addr2
      expect(item.owner).to.equal(addr2.address);
      // addr2 transfers the token to addr1
      await nft.connect(addr2).transferToken(addr2.address, addr1.address, 1);
    });

    it("Should fail when caller is not the owner of the token", async function () {
      let item = await market.idToMarketItem(1);
      // owner of token should be addr2
      expect(item.owner).to.equal(addr2.address);
      // addr1 tries to transfer token
      await expect(
        nft.connect(addr1).transferToken(addr1.address, addr2.address, 1)
      ).to.be.revertedWith("From address must be token owner");
    });
  });

  describe("Relisting Token", function () {
    let price = 2;
    let newPrice = 5;
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      // addr1 makes their nft a marketplace item
      await market
        .connect(addr1)
        .createMarketItem(nftContractAddress, 1, toWei(price), {
          value: listingPrice,
        });
      // fetch the listing price from the NFTmarket contract
      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
      // addr2 purchases item
      await market
        .connect(addr2)
        .createMarketSale(nftContractAddress, 1, { value: toWei(price) });
    });

    it("Should relist the NFT into the marketplace", async function () {
      // addr2 relists their nft to the marketplace at the price of 5 ether
      await expect(
        market.connect(addr2).relistToken(nftContractAddress, 1, newPrice, {
          value: listingPrice,
        })
      )
        .to.emit(market, "ProductListed")
        .withArgs(1);

      // Get item from idToMarketItem mapping then check fields to ensure they are correct
      const item = await market.idToMarketItem(1);
      expect(item.owner).to.equal("0x0000000000000000000000000000000000000000");
      expect(item.seller).to.equal(addr2.address);
      expect(item.price).to.equal(newPrice);
      expect(item.sold).to.equal(false);
      expect(await market._itemsSold()).to.equal(0);
    });

    it("Should fail if new price given is less than 1 wei", async function () {
      // addr2 relists their nft to the marketplace at the price of 0 ether
      await expect(
        market.connect(addr2).relistToken(nftContractAddress, 1, 0, {
          value: listingPrice,
        })
      ).to.be.revertedWith("Price must be at least 1 wei");
    });

    it("Should fail if listing fee paid by user does not equal listing price", async function () {
      // addr2 relists their nft to the marketplace by paying 0 listing fee
      await expect(
        market.connect(addr2).relistToken(nftContractAddress, 1, 1, {
          value: 0,
        })
      ).to.be.revertedWith("Price must be equal to listing price");
    });

    it("Should fail if the caller is not the owner of the NFT", async function () {
      // addr1 tries to relist addr2's NFT
      await expect(
        market.connect(addr1).relistToken(nftContractAddress, 1, newPrice, {
          value: listingPrice,
        })
      ).to.be.revertedWith("Only product owner can do this operation");
    });
  });

  describe("Fetching single NFT Details", function () {
    beforeEach(async function () {
      // fetch the listing price from the NFTmarket contract
      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
      // addr1 mints first nft
      await nft.connect(addr1).createToken(URI);
      // addr1 makes their first nft a marketplace item
      await market
        .connect(addr1)
        .createMarketItem(nftContractAddress, 1, toWei(1), {
          value: listingPrice,
        });
    });

    it("Should fetch the details of the NFT using fetchNFTDetails and store it in a struct called 'item'", async function () {
      // retrieve the market item
      const item = await market.fetchNFTDetails(1);

      // verify all the item's values are correct
      expect(item.itemId).to.equal(1);
      expect(item.nftContract).to.equal(nftContractAddress);
      expect(item.tokenId).to.equal(1);
      expect(item.creator).to.equal(addr1.address);
      expect(item.seller).to.equal(addr1.address);
      expect(item.owner).to.equal("0x0000000000000000000000000000000000000000");
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
      expect(item.relisted).to.equal(false);
      expect(await nft.tokenURI(item.tokenId)).to.equal(URI);
    });
  });
});
