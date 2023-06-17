import './globals.css'
import Link from 'next/link'
import Script from 'next/script'


export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Zenith</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        ></link>
      </head>

      <body>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand nav-txt" href="#">
            Zenith
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link nav-txt" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-txt" href="/create-nft">
                  Sell Digital Assets
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link nav-txt" href="/my-assets">
                  My Digital Assets
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-txt" href="/dashboard">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}

export default RootLayout