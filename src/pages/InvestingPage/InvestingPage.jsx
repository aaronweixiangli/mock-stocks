import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import "./InvestingPage.css";
import * as usersAPI from "../../utilities/users-api";

export default function InvestingPage( { user, balance, setBalance, balanceOnHold, setBalanceOnHold  } ) {
    const [stocksHolding, setStocksHolding] = useState(0);
    const navigate = useNavigate();
    ChartJS.register(ArcElement, Tooltip, Legend);
    
    useEffect(() => {
        if (!user) return;
        async function getUserInfo() {
            const balance = await usersAPI.getBalance();
            setBalance(balance);
            const balanceOnHold = await usersAPI.getBalanceOnHold();
            setBalanceOnHold(balanceOnHold);
            const stocksHolding = await usersAPI.getStocksHolding();
            setStocksHolding(stocksHolding);
            console.log('balance', balance)
            console.log('balanceOnHold', balanceOnHold)
            console.log('stocksHolding', stocksHolding)
            console.log('stocksHolding type', typeof(stocksHolding))
        }
        getUserInfo(stocksHolding);
        }, [user])

    // if stocksHolding returns a string, there is network error due to API requests
    if (typeof(stocksHolding) === 'string') {
        return (
            <main className="InvestingPage">
                <section className='account-sub-nav-container'>
                    <h2 className='user-name'>{user.name}</h2>
                    <div className='account-sub-nav'>
                        <div className='sub-nav-link-container active'>
                            <Link to="/account/investing" className='sub-nav-link'>Investing</Link>
                        </div>
                        <div className='sub-nav-link-container'>
                            <Link to="/account/cryto" className='sub-nav-link'>Cryto</Link>
                        </div>
                        <div className='sub-nav-link-container'>
                            <Link to="/account/recurring" className='sub-nav-link'>Recurring</Link>
                        </div>
                        <div className='sub-nav-link-container'>
                            <Link to="/account/reports-statements" className='sub-nav-link'>Reports and statements</Link>
                        </div>
                        <div className='sub-nav-link-container'>
                            <Link to="/account/history" className='sub-nav-link'>History</Link>
                        </div>
                        <div className='sub-nav-link-container'>
                            <Link to="/account/settings" className='sub-nav-link'>Settings</Link>
                        </div>
                        <div className='sub-nav-link-container'>
                            <Link to="/account/help" className='sub-nav-link'>Help</Link>
                        </div>
                    </div>
                </section>
                <div className='account-line'></div>
                <section className='investing-container'>
                    <h2>Network Error. Try refreshing the page later.</h2>
                </section>
            </main>
        );
    }

    let stocks = null;
    if (typeof(stocksHolding) !== 'string' && Array.isArray(stocksHolding.stockOwn)) {
        stocks = stocksHolding.stockOwn.map((s, index) => 
            <tr key={index} onClick={() => navigate(`/stocks/${s.symbol}`)}>
                <td>{s.symbol}</td>
                <td>{s.qty}</td>
                <td>${stocksHolding.currentMarketPrices[s.symbol]}</td>
                <td>${s.avgCost}</td>
                <td> <div className='stock-total-return'><div className={((stocksHolding.currentMarketPrices[s.symbol] - s.avgCost) * s.qty) >= 0 ? 'return-indicator-up' : 'return-indicator-down'}></div>${Math.abs(((stocksHolding.currentMarketPrices[s.symbol] - s.avgCost) * s.qty)).toFixed(2)}</div></td>
                <td>${Number(s.qty * stocksHolding.currentMarketPrices[s.symbol]).toFixed(2)}</td>
            </tr>
        );
    }

    let portfolioData = null;
    let stocksData = null;
    if (typeof(stocksHolding) !== 'string' && Array.isArray(stocksHolding.stockOwn)) {
        portfolioData = {
            labels: ['Stocks & Options', 'Brokerage Cash'],
            datasets: [
                {
                    label: 'value',
                    data: [Number((stocksHolding.brokerageHolding).toFixed(2)), Number((Number(balance) + Number(balanceOnHold)).toFixed(2))],
                    backgroundColor: [
                        'coral',
                        '#8BC34A',
                    ],
                    borderWidth: 1,
                },
            ],
        };
        stocksData = {
            labels: stocksHolding.stockOwn.map((s) => s.symbol),
            datasets: [
                {
                    label: 'equity',
                    data: stocksHolding.stockOwn.map((s) => Number(s.qty * stocksHolding.currentMarketPrices[s.symbol]).toFixed(2)),
                    borderWidth: 1
                },
            ],
        };
    }

    return (
        <main className="InvestingPage">
            <section className='account-sub-nav-container'>
                <h2 className='user-name'>{user.name}</h2>
                <div className='account-sub-nav'>
                    <div className='sub-nav-link-container active'>
                        <Link to="/account/investing" className='sub-nav-link'>Investing</Link>
                    </div>
                    <div className='sub-nav-link-container'>
                        <Link to="/account/cryto" className='sub-nav-link'>Cryto</Link>
                    </div>
                    <div className='sub-nav-link-container'>
                        <Link to="/account/recurring" className='sub-nav-link'>Recurring</Link>
                    </div>
                    <div className='sub-nav-link-container'>
                        <Link to="/account/reports-statements" className='sub-nav-link'>Reports and statements</Link>
                    </div>
                    <div className='sub-nav-link-container'>
                        <Link to="/account/history" className='sub-nav-link'>History</Link>
                    </div>
                    <div className='sub-nav-link-container'>
                        <Link to="/account/settings" className='sub-nav-link'>Settings</Link>
                    </div>
                    <div className='sub-nav-link-container'>
                        <Link to="/account/help" className='sub-nav-link'>Help</Link>
                    </div>
                </div>
            </section>
            <div className='account-line'></div>
            <section className='investing-container'>
                <div className='investing-portfolio'>
                    <div className='total-portfolio-value'>Total Portfolio Value</div>
                    <div className='total-portfolio-value-amount bold'>${(Number(stocksHolding.brokerageHolding) + Number(balance) + Number(balanceOnHold)).toFixed(2)}</div>
                    <ul className='total-portfolio-categories'>
                        <li className='total-portfolio-category'>
                            <div className='category-title'>Stocks & Options</div>
                            <div className='category-value'>
                                <span className='gray-color'>{(100 * Number(stocksHolding.brokerageHolding) / (Number(stocksHolding.brokerageHolding) + Number(balance) + Number(balanceOnHold))).toFixed(2)}%</span>
                                <span>${(Number(stocksHolding.brokerageHolding)).toFixed(2)}</span>
                            </div>
                        </li>
                        <li className='total-portfolio-category'>
                            <div className='category-title'>Brokerage Cash</div>
                            <div className='category-value'>
                                <span className='gray-color'>{(100 * Number(balance + balanceOnHold) / (Number(stocksHolding.brokerageHolding) + Number(balance) + Number(balanceOnHold))).toFixed(2)}%</span>
                                <span>${(Number(balance) + Number(balanceOnHold)).toFixed(2)}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='investing-stocks-title'>Stocks</div>
                <table className='investing-stocks-table'>
                    <thead className='investing-stocks-header-container'>
                        <tr>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Price</th>
                            <th>Average Cost</th>
                            <th>Total Return</th>
                            <th>Equity</th>
                        </tr>
                    </thead>
                    <tbody className='investing-stocks-body-container'>
                        {stocks}
                    </tbody>
                </table>
            </section>
            {portfolioData ? <div className="portfolio-doughnut-chart"><Doughnut data={portfolioData}/></div>: null}
            {stocksData ? <div className="stocks-doughnut-chart"><Doughnut data={stocksData}/></div>: null}
        </main>
    );
}