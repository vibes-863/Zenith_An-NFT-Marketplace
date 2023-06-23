const { expect } = require("chai");


describe("NFTMarketplace", async function () {
    // deployer is the account address for the marketplace(the deployer), used to collect listing fee etc.
    let deployer, addr1, addr2;
    let nft, market, marketAddress, nftContractAddress

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
        //it("Should track the owner and listing price of the marketplace", async function () {
          //expect(await market.owner).to.equal(deployer.address);
          //expect(await market.listingPrice).to.equal(ethers.utils.parseEther("0.025"));
        //});
    })

    
})
