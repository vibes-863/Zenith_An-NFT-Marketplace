# Zenith - an NFT Marketplace

## Getting Started with Zenith's Development Environment

### Requirements
- Our project requires you to have node.js and npm to be installed in your device. If you don't have it installed, you can do so from https://nodejs.org/en/download
  - Node.js v18.14.2 or later
  - npm 9.5.0 or later
- You will also need to install Git in order to clone our repository. To install Git follow the steps in https://github.com/git-guides/install-git
- You would also need to install the MetaMask cryptocurrency wallet chrome extension. You should also setup an account with it. Follow steps provided in https://medium.com/publicaio/how-to-create-a-metamask-account-e6d0ef156176 to do so

### 1. Getting the project files
1. Download and extract the project files from the zip file give here https://drive.google.com/drive/folders/1sqxhblc4vwuMWal2svYXz-oX3OAw-a0G?usp=sharing

### 2. Running the Development Server
- We have already deployed our Smart Contracts into the Polygon Mumbai Testnet so all you will have to do is run the development server.
- Before doing this, you will have to install the dependencies to do this:
    1. Navigate into the project folder by typing the following command
       ```
       cd TokenTitans-Orbital23
       ``` 
    2. Run the install command
       ```
       npm install
       ```
- Now you can run the Development Server by running the following command
  ```
  npm run dev
  ```
  Open http://localhost:3000 with your browser to see the result.

### 3. Adding custom network into MetaMask
- The Polygon Mumbai Testnet does not come by default as a network in the MetaMask wallet, thus we will have to add it as a cutom network.
- Head over to https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC to see the steps to add a custom network. For the details enter the following:
  - Network name: Mumbai
  - New RPC URL: https://polygon-mumbai.infura.io/v3/1c04d8dd403749a4b007a8fef3e15142
  - Chain ID: 80001
  - Currency symbol: MATIC
- After adding the network, make sure to switch to the nework you just added (Mumbai).

### 4. Getting Test MATIC
- Now that you have the Development Server up and running, as well as the MetaMask wallet setup, you are almost ready to start testing the marketplace. You will now need to get some Test MATIC in order to conduct transactions. In order to do so follow the steps below:
  1. Go to https://mumbaifaucet.com/
  2. Copy the address of your account and paste it into the 'Enter Your Wallet Address (0x...)' field. 
  3. Click on the 'Send Me MATIC' button. You should see MATIC arrive into your account soon.
Note: The site limits to only providing 0.5 MATIC per day to an ip address, hence if you are considering to list an NFT and then buy it, make sure to consider your balance while listing the price.
- You can also split your MATIC into various accounts by transfering between them.
  - Here's a link on how to create a new account https://support.metamask.io/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-wallet
  - Heres's a link on how to transfer MATIC between your accounts https://support.metamask.io/hc/en-us/articles/360015488931-How-to-send-tokens-from-your-MetaMask-wallet

With that you have completed all the steps to setup Zenith's Development Environment. You can now test and conduct transactions on Zenith.

### 5. (Optional) Deploying the Smart Contracts on local network
WARNING: The local network is not as optimized as the Polygon Mumbai Testnet and so you would face some errors ,for example, related to gas optimization. So if something does not work, make sure to open console log on the browser. You might have to restart the whole process below if there is an error related to gas optimization. If there is an error resulting in transaction failed due to nonce difference, then try using a different acccount.

It is recommended to watch our project video before continuing.

Follow the following steps to run your own blockchain network:
1. In a terminal within the project files directory and run the command
    ```
    npx harhat node
    ```
    Wait for the command to run and the node to start
2. When you scroll up, you will see that 20 accounts have been created for you to use. All these 20 accounts will have 10000ETH each (plenty!). Pay close attention to the warning provided at the end.
3. Copy the private key of any of the 19 accounts (excluding the first account as it is used to deploy the Smart Contracts later) and import the account into your MetaMask wallet by following the steps given here https://support.metamask.io/hc/en-us/articles/360015489331-How-to-import-an-account#:~:text=From%20your%20homepage%2C%20tap%20on,supported%20by%20the%20other%20wallet.
     - Note: Sometimes transactions will fail by giving the error relater to nonce data. If this happens, import another account and try using that.
5. Now lets deploy the contracts. Open another new terminal within the project files directory and run the command
    ```
    npx hardhat run scripts/deploy.js --network localhost
    ```
    This will now deploy the Smart Contracts into your local network
6. Now you will need to edit some files so that the development server will fetch data from the right network.
     1. In ./config.js, comment lines 2 & 3, and uncomment line 6 & 7
     2. In ./app/page.jsx, comment line 18
     3. Save both the files.
7. Now you can run the Development Server
    ```
    npm run dev
    ```
    Open http://localhost:3000 with your browser to see the result. Remember to always connect to the imported account before conducting any transactions.

With that, you have now run the Development Server with the Smart Contracts deployed on your local blockchain network.    

## Running the Automated System Testing of Smart Contracts
To ensure comprehensive testing of the smart contract, we have developed an extensive testing suite containing numerous test cases. We utilized the Waffle testing framework, which is provided by hardhat, to facilitate the testing process. Additionally, we incorporated the Chai Assertion Library to enhance the readability and effectiveness of our tests. 

- You can take a look at the test script by navigating to TokenTitans-Orbital23/test/waffleContractTesting.test.js
- To run the test, in you terminal navigate to the project directory (TokenTitans-Orbital23) and type the following command
  ```
  npx hardhat test
  ```
  You should see the test cases being run automatically.



       


    
   
   


