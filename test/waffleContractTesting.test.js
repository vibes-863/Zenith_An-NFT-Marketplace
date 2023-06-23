const { expect } = require("chai");

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
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
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
                "0x0000000000000000000000000000000000000000",
                toWei(1),
                false
              )
            // Owner of NFT should now be the marketplace
            expect(await nft.ownerOf(1)).to.equal(marketAddress);
            // Item count (IDs) should now equal 1
            expect(await market._itemIds()).to.equal(1);
            // Get item from idToMarketItem mapping then check fields to ensure they are correct
            const item = await market.idToMarketItem(1);
            expect(item.itemId).to.equal(1);
            expect(item.nftContract).to.equal(nftContractAddress);
            expect(item.tokenId).to.equal(1);
            expect(item.seller).to.equal(addr1.address);
            expect(item.owner).to.equal("0x0000000000000000000000000000000000000000");
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        });

        it("Should fail if price is set to zero", async function () {
            await expect(
                market.connect(addr1).createMarketItem(nftContractAddress, 1, 0, { value: listingPrice })
            ).to.be.revertedWith("Price must be at least 1 wei");
        });

        it("Should fail if listing fee paid by user does not equal listing price", async function () {
            await expect(
              market
                .connect(addr1)
                .createMarketItem(nftContractAddress, 1, toWei(1), {
                  value: 0,
                })
            ).to.be.revertedWith("Price must be equal to listing price");
        })
    });

    describe("Purchasing marketplace items", function () {
        let price = 2;
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).createToken(URI);
            // addr1 makes their nft a marketplace item
            await market.connect(addr1).createMarketItem(nftContractAddress, 1, toWei(price), { value: listingPrice });
            listingPrice = await market.getListingPrice();
            listingPrice = listingPrice.toString();
        });

        it("Should pay seller, transfer NFT to buyer, update item owner to buyer, update item as sold, increase count of sold items and transfer listing fee to contract owner (deployer)", async function () {
            const sellerInitalEthBal = await addr1.getBalance();
            const deployerInitialEthBal = await deployer.getBalance();
            // fetch the item's price to be paid by the buyer to the owner of the NFT
            console.log()
            // addr2 purchases item
            await market.connect(addr2).createMarketSale(nftContractAddress, 1, { value: toWei(price) });
            // Get item from idToMarketItem mapping then check fields to ensure they are correct
            const item = await market.idToMarketItem(1);
            expect(item.itemId).to.equal(1);
            expect(item.nftContract).to.equal(nftContractAddress);
            expect(item.tokenId).to.equal(1);
            expect(item.seller).to.equal(addr1.address);
            expect(item.owner).to.equal(addr2.address);
            expect(item.price).to.equal(toWei(price));
            expect(item.sold).to.equal(true);

            const sellerFinalEthBal = await addr1.getBalance();
            const deployerFinalEthBal = await deployer.getBalance();
            // Seller should receive payment for the price of the NFT sold.
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitalEthBal));
            expect(+fromWei(deployerFinalEthBal)).to.equal(+fromWei(listingPrice) + +fromWei(deployerInitialEthBal));
            // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
          
        });
    });
});
