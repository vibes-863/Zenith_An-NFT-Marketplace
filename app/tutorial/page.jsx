import Script from './script.jsx';
//import icon from './meta.png';

export default function tutorial(){
    return(
<>

  
  
  {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"/> */}
  
  {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/> */}
  


  <div id='body'>
  <div class="jumbotron">
    <h1 class="display-4 slide-up">NFT Marketplace Tutorial</h1>
    <p class="lead slide-up">Learn how to use our professional NFT marketplace</p>
  </div>



  <div className="container1">
    <div className="column">
      <div className="u-aspect-16-9 slide-up" style={{ width:'fit-content', margin:'auto', }}><iframe className="u-aspect-16-9__inner"
          width="560" height="315" src="https://www.youtube-nocookie.com/embed/l44z35vabvA" frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
      </div>
    </div>
    <div className="column">
      <div className="left-right-col left-right-col--2" style={{ textAlign:"center", }}>
        <h2 className="left-right-col__title t-title-2 t-bold a-fade-up slide-up" style={{ fontSize:50, }}>What Exactly is Web 3.0?
        </h2>
        <p className="left-right-col__subtitle t-title-2 t-bold t-light-gray a-fade-up slide-up" style={{ transitionDelay:"100ms", }}>
          Juan Benet</p>
        <p className="left-right-col__content t-sm a-fade-up slide-up" style={{ transitionDelay:"200ms", margin:"0 auto", }}>Juan Benet,
          founder and
          chief executive of Protocol Labs, talks about the Web 3.0 vision and how it relates to humanity going from a
          pre-computing civilization to a post-computing civilization.</p>
      </div>
    </div>
  </div>

  <div className="holder">
    <h2 className='slide-up'>What is an NFT?</h2>
    <p className='slide-up'>An NFT, or non-fungible token, is a type of digital asset that represents ownership or proof of authenticity of a
      unique item or piece of content. Unlike cryptocurrencies such as Bitcoin or Ethereum, which are fungible and can
      be exchanged on a one-to-one basis, NFTs are distinct and cannot be exchanged on an equal basis. The ownership of
      an NFT is recorded on the blockchain, providing a permanent and immutable
      record of ownership. This feature has attracted investors and collectors who see NFTs as a way to invest in unique
      digital assets that can appreciate in value over time.
      The uniqueness of an NFT is made possible by utilizing blockchain technology, which is a decentralized digital
      ledger that records transactions securely and transparently. This means that the ownership and history of an NFT
      can be verified and traced back to its original creator.</p>
    <p className='slide-up' style={{marginBottom: 60,}}>One of the key features of NFTs is that they allow creators and artists to monetize their digital works directly,
      without relying on traditional intermediaries like galleries, publishers, orcrossorigin record labels. When someone purchases
      an NFT, they gain ownership of that specific digital item, and the ownership record is stored on the blockchain.
      The value and desirability of an NFT can vary based on factors like the creator&apos;s reputation, scarcity, historical
      significance, or the demand from collectors. Some NFTs have sold for significant amounts of money, capturing
      headlines in the media.</p>
  </div>
  <div className="container">
    <div className="embed-responsive embed-responsive-16by9 slide-up" style={{ width:"fit-content", margin:"auto", }}>
      <iframe width="600" height="338" src="https://www.youtube.com/embed/H3TABd_nBJU"
        title="NFTs and the $13B marketplace, explained" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </div>
  </div>
  <div className="holder">
    <h2 className='slide-up'>What is an NFT Marketplace?</h2>
    <p className='slide-up'>An NFT marketplace is an online platform or website where users can buy, sell, and trade non-fungible tokens
      (NFTs). These marketplaces serve as digital marketplaces specifically designed for the exchange of unique digital
      assets.</p>
    <p className='slide-up'>Here&apos;s how an NFT marketplace typically functions:</p>
    <ol style={{fontSize: 20}}>
      <li className='slide-up'>
        <p>Listing and Discovery: Artists or creators upload their NFTs to the marketplace, providing details about the
          item, such as images, descriptions, and additional information. Users can browse through the marketplace to
          discover and explore the available NFTs.</p>
      </li>
      <li className='slide-up'>
        <p>Buying and Selling: Interested buyers can purchase NFTs directly from the marketplace. The transaction
          usually involves paying with a supported cryptocurrency, such as Ethereum. The marketplace facilitates the
          transaction and ensures the secure transfer of ownership from the seller to the buyer.</p>
      </li>
      <li className='slide-up'>
        <p>Secondary Market: NFT marketplaces often include a secondary market where users can resell their purchased
          NFTs. This allows collectors and investors to buy NFTs from other owners who are willing to sell. The
          marketplace facilitates these secondary sales, and the original creator may receive a percentage of the sale
          price as a royalty if the smart contract is programmed to include that feature.</p>
      </li>
      <li className='slide-up'>
        <p>Wallet Integration: NFT marketplaces typically integrate with digital wallets that store the user&apos;s NFTs and
          cryptocurrency. This integration allows users to connect their wallets to the marketplace, view their owned
          NFTs, and facilitate transactions directly from their wallets.</p>
      </li>
      <li className='slide-up' style={{marginBottom: 80}}>
        <p>Community and Engagement: NFT marketplaces often foster a sense of community by providing features for users
          to interact, comment, and engage with the NFTs and creators. This can include features like likes, comments,
          and sharing on social media platforms.</p>
      </li>
    </ol>
  </div>

  <div id="carouselExampleInterval" className="carousel slide slide-up" data-bs-ride="carousel">
    <div className="carousel-inner">
      <div className="carousel-item active" data-bs-interval="10000">
        <h2 className="carousel-head" style={{ color:"#F0F5F9", }}>If you are a Creator...</h2>
        <ul style={{ color:"#F0F5F9", }}>
          <li>
            <p>The value of an NFT lies in its uniqueness. As a creator, focus on producing original, high-quality
              content that appeals to your target audience. This can include digital artwork, music, videos, virtual
              real estate, or even virtual items for games.</p>
          </li>
          <li>
            <p>Ensure that you have the rights to the content you create or use for your NFTs. Respect copyright laws
              and obtain necessary licenses or permissions for any copyrighted material. Also, consider licensing
              options for your own NFTs to specify how they can be used and monetized.</p>
          </li>
          <li>
            <p>NFTs contain metadata that provides information about the asset, such as its title, description, and
              provenance. Pay attention to these details and make them informative and engaging for potential buyers.
              Consider adding additional value, like limited editions, unlockable content, or utility features to
              enhance the appeal of your NFTs.</p>
          </li>
          <li>
            <p>Building an audience and promoting your NFTs is crucial for success. Utilize social media, online
              communities, and platforms dedicated to NFTs to showcase your work and engage with potential buyers.
              Collaborate with other creators, participate in auctions, and leverage influencers to expand your reach.
            </p>
          </li>
        </ul>
        <a className="link hover-1" style={{ color:"#F0F5F9", fontSize:"30px", }}
          href="https://influencermarketinghub.com/creators-nfts/">Influencer Marketing Hub - 8 Things Creators Must
          Consider About NFTs</a>
        <a className="link hover-1" style={{ color:"#F0F5F9", fontSize:"30px", }}
          href="https://www.socialmediaexaminer.com/nfts-for-creators-everything-you-need-to-know/">NFTs for Creators:
          Everything You Need to Know</a>
      </div>
      <div className="carousel-item" data-bs-interval="4000">
        <h2 className="carousel-head" style={{ color:"#F0F5F9", }}>If you are a Collector...</h2>
        <ul style={{ color:"#F0F5F9", }}>
          <li>
            <p>Before purchasing an NFT, conduct thorough research about the artist, their previous work, and their
              reputation in the community. Verify the authenticity of the NFT and ensure that the artist is the rightful
              creator of the artwork or content.</p>
          </li>
          <li>
            <p>NFTs derive value from their scarcity and uniqueness. Assess the rarity of the NFT you&apos;re interested in
              by understanding edition sizes, whether it&apos;s part of a limited series, or if it has special attributes or
              features. Rarity can contribute to the long-term value of an NFT.</p>
          </li>
          <li>
            <p>Some NFTs have utility beyond their artistic or collectible value. They may grant access to exclusive
              content, experiences, or communities. Additionally, consider the rights associated with the NFT, such as
              the ability to resell or license it.</p>
          </li>
          <li>
            <p>NFTs are stored in digital wallets, typically using a cryptocurrency wallet that supports the blockchain
              on which the NFT was created. Ensure that you set up a secure wallet and follow best practices for
              protecting your private keys and seed phrases to prevent unauthorized access.</p>
          </li>
        </ul>
        <a className="link hover-1" style={{ color:"#F0F5F9", fontSize:"30px", }}
          href="https://www.nftgators.com/nft-collections/">NFTGATORS</a>

      </div>
      <div className="carousel-item" data-bs-interval="4000">
        <h2 className="carousel-head" style={{ color:"#F0F5F9", }}>If you are an Investor...</h2>
        <ul style={{ color:"#F0F5F9", }}>
          <li>
            <p>Just like with any investment, diversification is important in NFTs. Consider investing in a variety of
              NFTs, including different artists, styles, and genres. Diversification helps spread risk and potentially
              increases the chances of finding successful investments.</p>
          </li>
          <li>
            <p>Assess the credibility, reputation, and track record of the artist whose NFT you are considering.
              Research their previous sales, popularity, and contributions to the art community. Evaluate their
              potential for long-term success and whether their work aligns with your investment strategy.</p>
          </li>
          <li>
            <p>Determine your investment budget and allocate funds accordingly. NFT investing can involve high
              volatility and risks, so it&apos;s crucial to set clear financial boundaries and be prepared for potential
              losses. Avoid investing more than you can afford to lose.</p>
          </li>
          <li>
            <p>Protect your NFT investments by using secure digital wallets and implementing strong security measures
              for your private keys and seed phrases. Be cautious of potential scams and phishing attempts in the NFT
              ecosystem.</p>
          </li>
        </ul>
        <a className="link hover-1" style={{ color:"#F0F5F9", fontSize:"30px", }}
          href="https://influencermarketinghub.com/creators-nfts/">Influencer Marketing Hub - 8 Things Creators Must
          Consider About NFTs</a>
        <a className="link hover-1" style={{ color:"#F0F5F9", fontSize:"30px", }}
          href="https://www.socialmediaexaminer.com/nfts-for-creators-everything-you-need-to-know/">NFTs for Creators:
          Everything You Need to Know</a>
      </div>
    </div>
    <button style={{ width:"70px", }} className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval"
      data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button style={{ width:"70px", }} className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval"
      data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>

  <div className="holder slide-up">
    <h2 style={{ display:"inline", fontSize:"60px", }}>Creating a Metamask Wallet</h2>
    <a href="https://metamask.io/" type="button" className="btn btn-outline-warning" style={{position: 'absolute',
    right: 150,
    top: 65,}} ><img alt="Metamask Icon" src="/meta.png" style={{ width:"25px", }}/> Metamask
    </a>
    <ol style={{fontSize: 20}}>
      <li className='slide-up'>
        <p>Secure your seed phrase: During the wallet creation process, MetaMask provides you with a unique seed phrase
          (or recovery phrase) consisting of 12 or 24 words. This phrase is crucial for restoring access to your wallet
          if you ever lose your password or need to reinstall MetaMask. Safely store your seed phrase offline in a
          secure location and never share it with anyone.</p>
      </li>
      <li className='slide-up'>
        <p>Set a strong password: Choose a strong password for your MetaMask wallet to protect it from unauthorized
          access. Use a combination of uppercase and lowercase letters, numbers, and symbols. Avoid using common or
          easily guessable passwords.</p>
      </li>
      <li className='slide-up'>
        <p>Enable two-factor authentication (2FA): MetaMask supports 2FA through Google Authenticator or other similar
          applications. Enabling 2FA adds an extra layer of security to your wallet, making it more resistant to
          unauthorized access.</p>
      </li>
      <li className='slide-up'>
        <p>Verify the authenticity of transactions: Before confirming any transactions through MetaMask, review the
          details carefully. Check the recipient address, the amount being sent, and any associated fees. It&apos;s crucial
          to verify the accuracy of the transaction before proceeding to prevent accidental or fraudulent transfers.</p>
      </li>
      <li className='slide-up'>
        <p>Backup and restore your wallet: Regularly back up your MetaMask wallet to ensure you can recover your funds
          in case of loss or device failure. MetaMask allows you to export your wallet information, including the seed
          phrase and private key. Store these backups securely offline or on a separate device.</p>
      </li>
      <li className='slide-up'>
        <p>Be mindful of gas fees: When sending transactions or interacting with decentralized applications (dApps)
          through MetaMask, be aware of the associated gas fees. Gas fees cover the computational resources required to
          execute transactions on the blockchain. Consider the current network congestion and gas prices to optimize
          your transactions and avoid excessive costs.</p>
      </li>
      <li className='slide-up'>
        <p>Utilize network options: MetaMask supports different blockchain networks. Make sure you are connected to the
          appropriate network for your intended actions. For example, if you&apos;re interacting with Ethereum-based NFTs,
          ensure you are connected to the Ethereum Mainnet or the appropriate testnet for experimentation</p>
      </li>
    </ol>
  </div>
  </div>
  <Script/>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" async ></script>

  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" async ></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossOrigin="anonymous" async ></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" async ></script>
  <script src="./script.js" async ></script>

</>
    )
}