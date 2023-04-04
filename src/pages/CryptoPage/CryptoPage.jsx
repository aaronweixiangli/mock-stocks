import { Link } from "react-router-dom";

export default function CryptoPage({ user }) {
  return (
    <main className="CryptoPage">
      <section className="account-sub-nav-container">
        <h2 className="user-name">{user.name}</h2>
        <div className="account-sub-nav">
          <div className="sub-nav-link-container">
            <Link to="/account/investing" className="sub-nav-link">
              Investing
            </Link>
          </div>
          <div className="sub-nav-link-container active">
            <Link to="/account/crypto" className="sub-nav-link">
              Crypto
            </Link>
          </div>
          <div className="sub-nav-link-container">
            <Link to="/account/recurring" className="sub-nav-link">
              Recurring
            </Link>
          </div>
          <div className="sub-nav-link-container">
            <Link to="/account/reports-statements" className="sub-nav-link">
              Reports and statements
            </Link>
          </div>
          <div className="sub-nav-link-container">
            <Link to="/account/history" className="sub-nav-link">
              History
            </Link>
          </div>
          <div className="sub-nav-link-container">
            <Link to="/account/settings" className="sub-nav-link">
              Settings
            </Link>
          </div>
          <div className="sub-nav-link-container">
            <Link to="/account/help" className="sub-nav-link">
              Help
            </Link>
          </div>
        </div>
      </section>
      <div className="account-line"></div>
      <h3 style={{ padding: "18vmin 50vmin 0 42vmin", fontSize: "2.4vmin" }}>
        Sorry, this feature is not available at the moment. We will have it
        available in the future.
      </h3>
    </main>
  );
}
