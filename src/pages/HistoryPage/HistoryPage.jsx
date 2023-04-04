import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as usersAPI from "../../utilities/users-api";
import "./HistoryPage.css";

export default function HistoryPage({ user }) {
    const [history, setHistory] = useState(null);
    const [pendingOrder, setPendingOrder] = useState(null);

    useEffect(() => {
        if (!user) return;
        async function getHistoryAndPendingOrders() {
            const history = await usersAPI.getHistory();
            const pendingOrder = await usersAPI.getPendingOrder();
            setHistory(history);
            setPendingOrder(pendingOrder);
        }
        getHistoryAndPendingOrders();
    }, [user]);

    function toggleOrderDetails(evt) {
        // Get the clicked element and its parent container
        const clickedEl = evt.target;
        const parentContainer = clickedEl.closest('.order-all-container');
        // Get the child container
        const childContainer = parentContainer.querySelector('.order-detail-container');
        // Toggle the child container's display style
        if (childContainer.style.display === 'flex') {
            childContainer.style.display = 'none';
            parentContainer.style.backgroundColor = 'transparent';
        } else {
            childContainer.style.display = 'flex';
            parentContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    }

    async function handleCancelOrder(id) {
        const updatedPendingOrder = await usersAPI.cancelOrder(id);
        setPendingOrder(updatedPendingOrder);
    }

    let pending = null;
    if (pendingOrder && Array.isArray(pendingOrder)) {
        pending = pendingOrder.map((order) => 
            <section className="order-all-container" onClick={toggleOrderDetails} key={order._id}>
                <div className="order-content">
                    <div className="order-left">
                        <div className="order-type bold">{order.symbol} {order.orderType === 'market order' ? 'Market' : 'Limit'} {order.buyOrSell === 'buy' ? 'Buy' : 'Sell'}</div>
                        <div className="order-date">{(new Date(order.createdAt)).toLocaleString("en-US", {
                            timeZone: "America/Los_Angeles",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                        </div>
                    </div>
                    <div className="order-right">
                        <div className="pending-order bold">Queued</div>
                    </div>
                </div>
                <div className="order-detail-container">
                    <div className="order-detail-grid">
                        <div className="order-detail-card">
                            <span className="order-detail-title">Symbol</span>
                            <span className="order-detail-content green bold">{order.symbol}</span>
                        </div>
                        <div className="order-detail-card">
                            <span className="order-detail-title">Type</span>
                            <span className="order-detail-content">{order.orderType === 'market order' ? 'Market' : 'Limit'} {order.buyOrSell === 'buy' ? 'Buy' : 'Sell'}</span>
                        </div>
                        <div className="order-detail-card">
                            <span className="order-detail-title">Time in Force</span>
                            <span className="order-detail-content">{order.orderType === 'market order' ? 'Good for day' : order.expires === 'good for day' ? 'Good for day' : 'Good till cancaled'}</span>
                        </div>
                        <div className="order-detail-card">
                            <span className="order-detail-title">Submitted</span>
                            <span className="order-detail-content">{(new Date(order.createdAt)).toLocaleString("en-US", {
                                timeZone: "America/Los_Angeles",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}</span>
                        </div>
                        <div className="order-detail-card">
                            <span className="order-detail-title">Status</span>
                            <span className="order-detail-content">Queued</span>
                        </div>
                        {order.orderType === 'market order' ?
                        (
                        order.sharesOrDollars === 'shares' ?
                        <div className="order-detail-card">
                            <span className="order-detail-title">Entered Shares</span>
                            <span className="order-detail-content">{order.shares}</span>
                        </div>
                        :
                        <div className="order-detail-card">
                            <span className="order-detail-title">Entered Amount</span>
                            <span className="order-detail-content">{order.dollars}</span>
                        </div>
                        )
                        :
                        <>
                        <div className="order-detail-card">
                            <span className="order-detail-title">Limit Price</span>
                            <span className="order-detail-content">{order.limitPrice}</span>
                        </div>
                        <div className="order-detail-card">
                            <span className="order-detail-title">Entered Quantity</span>
                            <span className="order-detail-content">{order.shares}</span>
                        </div>
                        </>
                        }
                    </div>
                    <button className="cancel-order green" onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
                </div>
            </section>
        )
    }

    let transaction = null;
    if (history && Array.isArray(history)) {
        transaction = history.map((h) => 
            <div className="order-content" key={h._id}>
                <div className="order-left">
                    <div className="order-type bold">{h.category === 'buy' ? `${h.symbol} ${h.orderType === 'market order' ? 'Market' : 'Limit'} Buy` : h.category === 'sell' ? `${h.symbol} ${h.orderType === 'market order' ? 'Market' : 'Limit'} Sell` : 'Deposit to brokerage account'}</div>
                    <div className="order-date">{(new Date(h.createdAt)).toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                    </div>
                </div>
                <div className="order-right">
                    <div className="order-info">
                        {h.category === 'deposit' ? 
                        <div className="order-deposit bold">+${h.deposit}</div>
                        :
                        <>
                            <div className="order-price bold">${Number(h.marketPrice * h.qty).toFixed(2)}</div>
                            <div className="order-qty">{h.qty} shares at ${h.marketPrice} </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        ) 
    }

    return (
        <main className="HistoryPage">
            <section className="account-sub-nav-container">
                <h2 className="user-name">{user.name}</h2>
                <div className="account-sub-nav">
                <div className="sub-nav-link-container">
                    <Link to="/account/investing" className="sub-nav-link">
                    Investing
                    </Link>
                </div>
                <div className="sub-nav-link-container">
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
                <div className="sub-nav-link-container active">
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
            {(pendingOrder && pendingOrder.length) ?
                <section className="pending-order-container">
                    <div className="orders-container">
                        <div className="pending">Pending</div>
                        {pending}
                    </div>
                </section>
                :
                <section className="pending-order-container">
                    <div className="orders-container">
                        <div className="pending">Pending</div>
                        <p className="no-pending">No pending orders yet.</p>
                    </div>
                </section>
            }
            {(history && history.length) ?
                <section className="transaction-container">
                    <div className="orders-container">
                        <div className="pending">Recent</div>
                        {transaction}
                    </div>
                </section>
                :
                <section className="transaction-container">
                    <div className="orders-container">
                        <div className="pending">Recent</div>
                        <p className="no-pending">No transactions nor deposits yet.</p>
                    </div>
                </section>
            }
        </main>
    );
}
