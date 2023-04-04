import { useState, useEffect } from "react";
import "./ProfilePage.css";
import * as usersAPI from "../../utilities/users-api";

export default function ProfilePage({
  user,
  balance,
  setBalance,
  balanceOnHold,
  setBalanceOnHold,
}) {
  const [brokerageHolding, setBrokerageHolding] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function getUserBalance() {
      const balance = await usersAPI.getBalance();
      setBalance(balance);
      const balanceOnHold = await usersAPI.getBalanceOnHold();
      setBalanceOnHold(balanceOnHold);
      const brokerageHolding = await usersAPI.getBrokerageHolding();
      setBrokerageHolding(brokerageHolding);
    }
    getUserBalance();
  }, [user]);

  return (
    <main className="ProfilePage">
      <section className="profile-container">
        <div className="profile-user-container">
          <div className="profile-logo">
            <img
              src="https://i.imgur.com/mSyRgSe.png"
              alt="mockstocklogo2"
              className="mockstock-logo2"
            />
          </div>
          <div className="profile-user-content">
            <p>{user.name}</p>
            <p>
              {user.email} •{" "}
              <span className="profile-join-year">
                Joined{" "}
                {new Date(user.createdAt).toLocaleString("en-US", {
                  timeZone: "America/Los_Angeles",
                  year: "numeric",
                })}
              </span>{" "}
            </p>
          </div>
        </div>
        <div className="total-in-mockstocks">
          <p>
            {" "}
            {String(brokerageHolding).startsWith("Unable")
              ? `$${(balance + balanceOnHold).toFixed(
                  2
                )}. (Brokerage holdings are currently not being considered. Please refresh the page at a later time.)`
              : `$${(balance + balanceOnHold + brokerageHolding).toFixed(
                  2
                )}`}{" "}
          </p>
          <span>Total in MockStocks</span>
        </div>
        <h3 className="profile-investing-title">Investing</h3>
        <div className="profile-investing-container">
          <div className="profile-investing-content">
            <p>Total Investing value</p>
            <p className="bold">
              {String(brokerageHolding).startsWith("Unable")
                ? `$${(balance + balanceOnHold).toFixed(2)}`
                : `$${(balance + balanceOnHold + brokerageHolding).toFixed(
                    2
                  )}`}{" "}
            </p>
          </div>
          <div className="profile-investing-content">
            <span>Brokerage holdings</span>
            <span className="profile-investing-amount">
              ${brokerageHolding}
            </span>
          </div>
          <div className="profile-investing-content">
            <span>Brokerage cash</span>
            <span className="profile-investing-amount">
              ${(balance + balanceOnHold).toFixed(2)}
            </span>
          </div>
          <div className="profile-investing-content">
            <span>Crypto holdings</span>
            <span className="profile-investing-amount">$0.00</span>
          </div>
        </div>
        <h4 className="profile-brokerage-cash">Brokerage Cash</h4>
        <div className="profile-investing-container">
          <div className="profile-investing-content">
            <p>Brokerage cash</p>
            <p className="bold">${(balance + balanceOnHold).toFixed(2)}</p>
          </div>
          <div className="profile-investing-content">
            <span>Pending orders</span>
            <span className="profile-investing-amount">-${balanceOnHold}</span>
          </div>
          <div className="profile-investing-content">
            <span>Buying power</span>
            <span className="profile-investing-amount">${balance}</span>
          </div>
        </div>
      </section>
      <></>
    </main>
  );
}
