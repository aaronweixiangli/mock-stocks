import { useNavigate } from 'react-router-dom';

export default function WatchList( {stockWatchList} ) {
    const navigate = useNavigate();
    let stocksWatch = null;
    if (Array.isArray(stockWatchList)) {
        stocksWatch = stockWatchList.map((s) => 
        <li key={s._id} onClick={() => navigate(`/stocks/${s.symbol}`)}>{s.symbol}</li>
        )
    }

    return (
        <section className="watchlist">
            <ul>
                <li className="watchlist-title">Watch List</li>
                <li className="stock-watchlist">Stocks</li>
                <li>
                    <ul className="watchlist-content">
                        {stocksWatch}
                    </ul>
                </li>
                <li className="crypto-watchlist">Crypto</li>
                <li>
                    <ul className="watchlist-content">
                        <li>BTC</li>
                        <li>ETH</li>
                        <li>SOL</li>
                        <li>DOGE</li>
                    </ul>
                </li>
            </ul>
        </section>
    )
}