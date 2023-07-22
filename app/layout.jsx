"use client"

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

import { useState } from "react";
import { ethers } from "ethers";

export const metadata = {
  title: "Zenith",
  description: "An NFT Marketplace",
};

function RootLayout({ children }) {
  const [account, setAccount] = useState(null)
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
  }
  return (
    <>
      <html lang="en">
        <head>
          <title>Zenith</title>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Prompt&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
            rel="stylesheet"
          ></link>
        </head>

        <body>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <Link className="navbar-brand" href="/">
                Zenith
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active link hover-2"
                      aria-current="page"
                      href="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link link hover-2" href="/create-nft">
                      Sell Digital Assets
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link link hover-2" href="/my-assets">
                      My Digital Assets
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link link hover-2" href="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link link hover-2" href="/tutorial">
                      Tutorial
                    </Link>
                  </li>
                  <li className="nav-item">
                    {account ? (
                      <Link
                        className="nav-link link hover-2"
                        href={`https://etherscan.io/address/${account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button type="button" className="btn btn-dark">
                          {account.slice(0, 5) + "..." + account.slice(38, 42)}
                        </button>
                      </Link>
                    ) : (
                      <button type="button" className="btn btn-dark" onClick={web3Handler}>Connect Wallet</button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <main>{children}</main>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
            crossOrigin="anonymous"
            async
          ></script>
          <script
            src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"
            async
          ></script>
        </body>
      </html>
    </>
  );
}

export default RootLayout;
