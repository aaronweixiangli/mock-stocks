import { useState } from "react";

export default function StockOrder( {symbol, marketPrice, user} ) {
    // MARKET ORDER
    // const variables and functions for Market Order
    const [buyOrSell, setBuyOrSell] = useState('buy');
    const [orderType, setOrderType] = useState('market order');
    const [sharesOrDollars, setSharesOrDollars] = useState('shares');
    const [shares, setShares] = useState('');
    const [dollars, setDollars] = useState('');
    
    function handleBuyType() {
        if (buyOrSell === 'sell') setBuyOrSell('buy');
    }

    function handleSellType() {
        if (buyOrSell === 'buy') setBuyOrSell('sell');
    }

    function handleTypeChange(evt) {
        //set all form variables to be initial values
        setShares('');
        setDollars('');
        setSharesOrDollars('shares');
        setLimitPrice('');
        setExpires('good for day');
        setStopPrice('');
        setTrialType('percentage');
        setTrailPercent('');
        setTrailAmount('');
        setStarts(tomorrowDate());
        setAmount('');
        setFrequency('every market day');
        setOrderType(evt.target.value);
    }

    function handleSharesOrDollars(evt) {
        if (sharesOrDollars === 'shares') setShares('');
        if (sharesOrDollars === 'dollars') setDollars('');
        setSharesOrDollars(evt.target.value);
    }

    function handleSharesChange(evt) {
        setShares(evt.target.value);
    }

    // Once the user leaves the input field, round shares to 4 decimal digits
    function handleSharesBlur() {
        if (shares <= 0) {
            setShares('');
            return;
        }
        if (shares) setShares(parseFloat(shares).toFixed(4));
    }

    function handleDollarsChange(evt) {
        setDollars(evt.target.value);
    }

    function handleDollarsBlur() {
        if (dollars <= 0) {
            setDollars('');
            return;
        }
        if (dollars) setDollars(parseFloat(dollars).toFixed(2))
    }

    // LIMIT ORDER
    // const variables and functions for Limit Order. Note that Limit order also has variable 'shares'
    const [limitPrice, setLimitPrice] = useState('');
    const [expires, setExpires] = useState('good for day');

    function handleLimitPriceChange(evt) {
        setLimitPrice(evt.target.value);
    }

    function handleLimitPriceBlur() {
        if (limitPrice <= 0) {
            setLimitPrice('');
            return;
        }
        if (limitPrice) setLimitPrice(parseFloat(limitPrice).toFixed(2));
    }

    function handleExpiresChange(evt) {
        setExpires(evt.target.value);
    }

    // Once the user leaves the input field, round shares to integer
    function handleSharesBlurInteger() {
        if (shares <= 0) {
            setShares('');
            return;
        }
        if (shares) setShares(parseInt(shares));
    }

    // STOP LOSS ORDER
    // const variables and functions for Stop Loss Order. Note that Stop Loss Order also has variables shares & expires
    const [stopPrice, setStopPrice] = useState('');

    function handleStopPriceChange(evt) {
        setStopPrice(evt.target.value);
    }

    function handleStopPriceBlur() {
        if (stopPrice <= 0) {
            setStopPrice('');
            return;
        }
        if (stopPrice) setStopPrice(parseFloat(stopPrice).toFixed(2));
    }

    // STOP LIMIT ORDER
    // Note that Stop Limit Order also has variables stopPrice, limitPrice, shares, and expires

    // TRAILING STOP ORDER
    // const variables and functions for Trailing Stop Order. Note that Stop Loss Order also has variables shares & expires
    const [trailType, setTrialType] = useState('percentage');
    const [trailPercent, setTrailPercent] = useState('');
    const [trailAmount, setTrailAmount] = useState('');

    function handleTrailTypeChange(evt) {
        setTrialType(evt.target.value);
    }

    function handleTrailPercentChange(evt) {
        setTrailPercent(evt.target.value);
    }

    function handleTrailPercentBlur() {
        if (trailPercent <= 0) {
            setTrailPercent('');
            return;
        }
        if (trailPercent) setTrailPercent(parseInt(trailPercent));
    }
    
    function handleTrailAmountChange(evt) {
        setTrailAmount(evt.target.value);
    }

    function handleTrailAmountBlur() {
        if (trailAmount <= 0) {
            setTrailAmount('');
            return;
        }
        if (trailAmount) setTrailAmount(parseFloat(trailAmount).toFixed(2));
    }

    // RECURRING INVESTMENT
    // const variables and functions for recurring investment.
    const [starts, setStarts] = useState(tomorrowDate());
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('every market day');
    
    function tomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = tomorrow.getMonth() + 1;
        const day = tomorrow.getDate();
        // Convert to format YYYY-MM-DD
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }

    function handleAmountChange(evt) {
        setAmount(evt.target.value);
    }

    function handleAmountBlur() {
        if (amount <= 0) {
            setAmount('');
            return;
        }
        if (amount) setAmount(parseFloat(amount).toFixed(2));
    }

    function handleFrequencyChange(evt) {
        setFrequency(evt.target.value);
    }

    function handleStartsChange(evt) {
        setStarts(evt.target.value);
    }

    function handleStartsBlur(evt) {
        const inputDate = evt.target.value;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        // Guard. Ensure input is in format: YYYY-MM-DD
        if (!regex.test(inputDate)) {
            setStarts(tomorrowDate());
            return;
        }
        const selectedDate = new Date(inputDate);
        const minimumDate = new Date(tomorrowDate());
        if (selectedDate < minimumDate) {
            setStarts(tomorrowDate());
        }
    }


    // Define reviewDetail variable to store html elements that display review details for each order type form
    const [reviewDetail, setReviewDetail] = useState(<>
        <span className="review-title">Order Summary</span>
        <span className="review-content">You are placing an order .......</span>
    </>);
    // When the user clicks the review button, change the reviewDetail according to different order type
    function handleReviewDetail(evt) {
        evt.preventDefault();
        if (orderType === 'market order') {
            const reviewElement = (
                <>
                    <span className="review-title">Order Summary</span>
                    <span className="review-content">You are placing an market order .......</span>
                </>
            );
            setReviewDetail(reviewElement);
        }
        if (orderType === 'limit order') {
            const reviewElement = (
                <>
                    <span className="review-title">Order Summary</span>
                    <span className="review-content">You are placing a limit order .......</span>
                </>
            );
            setReviewDetail(reviewElement);
        }
    }


    if (orderType === 'market order') {
        return (
            <section className="stock-order-container">
                <form className="stock-order-form">
                    <div className="order-title">
                        <div className={`buy-order ${ buyOrSell === 'buy' ? 'active' : ''}`} onClick={handleBuyType}>
                            Buy {symbol}
                        </div>
                        <div className={`sell-order ${ buyOrSell === 'sell' ? 'active' : ''}`} onClick={handleSellType}>
                            Sell {symbol}
                        </div>
                        <select name="order-type" id="order-type" onChange={handleTypeChange}>
                            <option value="market order">Market Order</option>
                            <option value="limit order">Limit Order</option>
                            <option value="stop loss order">Stop Loss Order</option>
                            <option value="stop limit order">Stop Limit Order</option>
                            <option value="trailing stop order">Trailing Stop Order</option>
                            <option value="recurring investment">Recurring Investment</option>
                        </select>
                        </div>
                    <div className="order-detail-container">
                        <div className="order-detail-content-container">
                            <span>Order Type</span>
                            <div className="order-detail-right order-type-title"><span>{orderType.toUpperCase()}</span></div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>{ buyOrSell === 'buy' ? 'Buy in' : 'Sell in' }</span>
                            <div className="order-detail-right">
                                <select name="buy-in" onChange={handleSharesOrDollars}>
                                    <option value="shares">Shares</option>
                                    <option value="dollars">Dollars</option>
                                </select>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            { 
                            sharesOrDollars === 'shares' ?
                            <>
                                <span>Shares</span>
                                <div className="order-detail-right">
                                    <input name="shares" placeholder="0.0000" type="number" value={shares} onChange={handleSharesChange} onBlur={handleSharesBlur}/>
                                </div>
                            </>
                            :
                            <>
                                <span>Amount</span>
                                <div className="order-detail-right">
                                    $ &nbsp; <input name="dollars" type="number" placeholder="0.00" value={dollars} onChange={handleDollarsChange} onBlur={handleDollarsBlur}/>
                                </div>
                            </>
                            }
                        </div>
                        <div className="order-detail-content-container">
                            <span>Market Price</span>
                            <div className="order-detail-right">
                                <span>${marketPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-overview">
                        {
                        sharesOrDollars === 'shares' ?
                        <>
                            <div className="order-detail-content-container">
                                <span>Est. Cost</span>
                                <div className="order-detail-right">
                                    <span>${(marketPrice * shares).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="review-order-container">
                                <button disabled={!shares} onClick={handleReviewDetail}>Review Order</button>
                                {reviewDetail}
                            </div>
                        </>
                        :
                        <>
                            <div className="order-detail-content-container">
                                <span>Est. Quantity</span>
                                <div className="order-detail-right">
                                    <span>{(dollars / marketPrice).toFixed(5)}</span>
                                </div>
                            </div>
                            <div className="review-order-container">
                                <button disabled={!dollars}  onClick={handleReviewDetail}>Review Order</button>
                            </div>
                            {reviewDetail}
                        </>
                        }
                    </div>
                    <div className="order-last-row">
                        {
                        buyOrSell === 'buy' ?
                        `$${user.balance} buying power available`
                        :
                        `(user.own.stocksymbol) Shares Available`
                     }
                    </div>
                </form>            
            </section>
        )
    }

    if (orderType === 'limit order') {
        return (
            <section className="stock-order-container">
                <form className="stock-order-form">
                    <div className="order-title">
                        <div className={`buy-order ${ buyOrSell === 'buy' ? 'active' : ''}`} onClick={handleBuyType}>
                            Buy {symbol}
                        </div>
                        <div className={`sell-order ${ buyOrSell === 'sell' ? 'active' : ''}`} onClick={handleSellType}>
                            Sell {symbol}
                        </div>
                        <select name="order-type" id="order-type" onChange={handleTypeChange}>
                            <option value="market order">Market Order</option>
                            <option value="limit order">Limit Order</option>
                            <option value="stop loss order">Stop Loss Order</option>
                            <option value="stop limit order">Stop Limit Order</option>
                            <option value="trailing stop order">Trailing Stop Order</option>
                            <option value="recurring investment">Recurring Investment</option>
                        </select>
                    </div>
                    <div className="order-detail-container">
                        <div className="order-detail-content-container">
                            <span>Order Type</span>
                            <div className="order-detail-right order-type-title"><span>{orderType.toUpperCase()}</span></div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Limit Price</span>
                            <div className="order-detail-right">
                                $ &nbsp; <input name="limit-price" placeholder="$0.00" type="number" value={limitPrice} onChange={handleLimitPriceChange} onBlur={handleLimitPriceBlur}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Shares</span>
                            <div className="order-detail-right">
                                <input name="shares" placeholder="0" type="number" step='1' value={shares} onChange={handleSharesChange} onBlur={handleSharesBlurInteger}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Expires</span>
                            <div className="order-detail-right">
                                <select name="expires" id="order-expires" value={expires} onChange={handleExpiresChange}>
                                    <option value="good for day">Good for Day</option>
                                    <option value="good till canceled">Good till Canceled</option>
                                </select>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Market Price</span>
                            <div className="order-detail-right">
                                <span>${marketPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-overview">
                        <div className="order-detail-content-container">
                            <span>{ buyOrSell === 'buy' ? 'Est. Cost' : 'Est. Credit' }</span>
                            <div className="order-detail-right">
                                <span>${(limitPrice * shares).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="review-order-container">
                            <button disabled={true} >Review Order</button>
                        </div>
                    </div>
                    <div className="order-last-row">
                    {
                        buyOrSell === 'buy' ?
                        `$${user.balance} buying power available`
                        :
                        `(user.own.stocksymbol) Shares Available`
                     }
                    </div>
                </form>            
            </section>
        )
    }

    
    if (orderType === 'stop loss order') {
        return (
            <section className="stock-order-container">
                <form className="stock-order-form">
                    <div className="order-title">
                        <div className={`buy-order ${ buyOrSell === 'buy' ? 'active' : ''}`} onClick={handleBuyType}>
                            Buy {symbol}
                        </div>
                        <div className={`sell-order ${ buyOrSell === 'sell' ? 'active' : ''}`} onClick={handleSellType}>
                            Sell {symbol}
                        </div>
                        <select name="order-type" id="order-type" onChange={handleTypeChange}>
                            <option value="market order">Market Order</option>
                            <option value="limit order">Limit Order</option>
                            <option value="stop loss order">Stop Loss Order</option>
                            <option value="stop limit order">Stop Limit Order</option>
                            <option value="trailing stop order">Trailing Stop Order</option>
                            <option value="recurring investment">Recurring Investment</option>
                        </select>
                    </div>
                    <div className="order-detail-container">
                        <div className="order-detail-content-container">
                            <span>Order Type</span>
                            <div className="order-detail-right order-type-title"><span>{orderType.toUpperCase()}</span></div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Stop Price</span>
                            <div className="order-detail-right">
                                $ &nbsp; <input name="limit-price" placeholder="$0.00" type="number" value={stopPrice} onChange={handleStopPriceChange} onBlur={handleStopPriceBlur}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Shares</span>
                            <div className="order-detail-right">
                                <input name="shares" placeholder="0" type="number" step='1' value={shares} onChange={handleSharesChange} onBlur={handleSharesBlurInteger}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Expires</span>
                            <div className="order-detail-right">
                                <select name="expires" id="order-expires" value={expires} onChange={handleExpiresChange}>
                                    <option value="good for day">Good for Day</option>
                                    <option value="good till canceled">Good till Canceled</option>
                                </select>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Market Price</span>
                            <div className="order-detail-right">
                                <span>${marketPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-overview">
                        <div className="order-detail-content-container">
                            <span>{ buyOrSell === 'buy' ? 'Est. Cost' : 'Est. Credit' }</span>
                            <div className="order-detail-right">
                                <span>${(stopPrice * shares).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="review-order-container">
                            <button disabled={true} >Review Order</button>
                        </div>
                    </div>
                    <div className="order-last-row">
                    {
                        buyOrSell === 'buy' ?
                        `$${user.balance} buying power available`
                        :
                        `(user.own.stocksymbol) Shares Available`
                     }
                    </div>
                </form>            
            </section>
        )
    }


    if (orderType === 'stop limit order') {
        return (
            <section className="stock-order-container">
                <form className="stock-order-form">
                    <div className="order-title">
                        <div className={`buy-order ${ buyOrSell === 'buy' ? 'active' : ''}`} onClick={handleBuyType}>
                            Buy {symbol}
                        </div>
                        <div className={`sell-order ${ buyOrSell === 'sell' ? 'active' : ''}`} onClick={handleSellType}>
                            Sell {symbol}
                        </div>
                        <select name="order-type" id="order-type" onChange={handleTypeChange}>
                            <option value="market order">Market Order</option>
                            <option value="limit order">Limit Order</option>
                            <option value="stop loss order">Stop Loss Order</option>
                            <option value="stop limit order">Stop Limit Order</option>
                            <option value="trailing stop order">Trailing Stop Order</option>
                            <option value="recurring investment">Recurring Investment</option>
                        </select>
                    </div>
                    <div className="order-detail-container">
                        <div className="order-detail-content-container">
                            <span>Order Type</span>
                            <div className="order-detail-right order-type-title"><span>{orderType.toUpperCase()}</span></div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Stop Price</span>
                            <div className="order-detail-right">
                                $ &nbsp; <input name="stop-price" placeholder="$0.00" type="number" value={stopPrice} onChange={handleStopPriceChange} onBlur={handleStopPriceBlur}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Limit Price</span>
                            <div className="order-detail-right">
                                $ &nbsp; <input name="limit-price" placeholder="$0.00" type="number" value={limitPrice} onChange={handleLimitPriceChange} onBlur={handleLimitPriceBlur}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Shares</span>
                            <div className="order-detail-right">
                                <input name="shares" placeholder="0" type="number" step='1' value={shares} onChange={handleSharesChange} onBlur={handleSharesBlurInteger}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Expires</span>
                            <div className="order-detail-right">
                                <select name="expires" id="order-expires" value={expires} onChange={handleExpiresChange}>
                                    <option value="good for day">Good for Day</option>
                                    <option value="good till canceled">Good till Canceled</option>
                                </select>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Market Price</span>
                            <div className="order-detail-right">
                                <span>${marketPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-overview">
                        <div className="order-detail-content-container">
                            <span>{ buyOrSell === 'buy' ? 'Est. Cost' : 'Est. Credit' }</span>
                            <div className="order-detail-right">
                                <span>${(limitPrice * shares).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="review-order-container">
                            <button disabled={true} >Review Order</button>
                        </div>
                    </div>
                    <div className="order-last-row">
                    {
                        buyOrSell === 'buy' ?
                        `$${user.balance} buying power available`
                        :
                        `(user.own.stocksymbol) Shares Available`
                     }
                    </div>
                </form>            
            </section>
        )
    }

    if (orderType === 'trailing stop order') {
        return (
            <section className="stock-order-container">
                <form className="stock-order-form">
                    <div className="order-title">
                        <div className={`buy-order ${ buyOrSell === 'buy' ? 'active' : ''}`} onClick={handleBuyType}>
                            Buy {symbol}
                        </div>
                        <div className={`sell-order ${ buyOrSell === 'sell' ? 'active' : ''}`} onClick={handleSellType}>
                            Sell {symbol}
                        </div>
                        <select name="order-type" id="order-type" onChange={handleTypeChange}>
                            <option value="market order">Market Order</option>
                            <option value="limit order">Limit Order</option>
                            <option value="stop loss order">Stop Loss Order</option>
                            <option value="stop limit order">Stop Limit Order</option>
                            <option value="trailing stop order">Trailing Stop Order</option>
                            <option value="recurring investment">Recurring Investment</option>
                        </select>
                    </div>
                    <div className="order-detail-container">
                        <div className="order-detail-content-container">
                            <span>Order Type</span>
                            <div className="order-detail-right order-type-title"><span>{orderType.toUpperCase()}</span></div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Trail Type</span>
                            <div className="order-detail-right">
                                <select name="trail-type" value={trailType} onChange={handleTrailTypeChange}>
                                    <option value="percentage">Percentage</option>
                                    <option value="amount">Amount</option>
                                </select>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>{ trailType === 'percentage' ? 'Trail(%)' : 'Trail($)' }</span>
                            <div className="order-detail-right">
                                { trailType === 'percentage' ?
                                <>
                                    <input name="trail-percent" placeholder="0%" type="number" value={trailPercent} onChange={handleTrailPercentChange} onBlur={handleTrailPercentBlur}/>
                                </>
                                 :
                                <>
                                    $ &nbsp; <input name="trail-amount" placeholder="$0.00" type="number" value={trailAmount} onChange={handleTrailAmountChange} onBlur={handleTrailAmountBlur}/>
                                </>
                                }
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Shares</span>
                            <div className="order-detail-right">
                                <input name="shares" placeholder="0" type="number" step='1' value={shares} onChange={handleSharesChange} onBlur={handleSharesBlurInteger}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Expires</span>
                            <div className="order-detail-right">
                                <select name="expires" id="order-expires" value={expires} onChange={handleExpiresChange}>
                                    <option value="good for day">Good for Day</option>
                                    <option value="good till canceled">Good till Canceled</option>
                                </select>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Market Price</span>
                            <div className="order-detail-right">
                                <span>${marketPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-overview">
                        <div className="order-detail-content-container">
                            <span className="initial-stop-price">Initial Stop Price</span>
                            { buyOrSell === 'buy' ?
                                <>
                                    { trailType === 'percentage' ?
                                    <>
                                        <div className="order-detail-right">
                                            <span>
                                                { trailPercent ?
                                                <>
                                                    ${(marketPrice * (1 + trailPercent/100)).toFixed(2)}
                                                </>
                                                :
                                                <>
                                                    ---
                                                </>}
                                            </span>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="order-detail-right">
                                            <span>
                                                { trailAmount ?
                                                <>
                                                    ${(parseFloat(marketPrice) + parseFloat(trailAmount)).toFixed(2)}
                                                </>
                                                :
                                                <>
                                                    ---
                                                </>}
                                            </span>
                                        </div>
                                    </>
                                    }
                                </>
                                :
                                <>
                                    { trailType === 'percentage' ?
                                        <>
                                            <div className="order-detail-right">
                                                <span>
                                                    { trailPercent ?
                                                    <>
                                                        ${(marketPrice * (1 - trailPercent/100)).toFixed(2)}
                                                    </>
                                                    :
                                                    <>
                                                        ---
                                                    </>}
                                                </span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="order-detail-right">
                                                <span>
                                                    { trailAmount ?
                                                    <>
                                                        ${(marketPrice - parseFloat(trailAmount)).toFixed(2)}
                                                    </>
                                                    :
                                                    <>
                                                        ---
                                                    </>}
                                                </span>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                        </div>
                        <div className="review-order-container">
                            <button disabled={true} >Review Order</button>
                        </div>
                    </div>
                    <div className="order-last-row">
                    {
                        buyOrSell === 'buy' ?
                        `$${user.balance} buying power available`
                        :
                        `(user.own.stocksymbol) Shares Available`
                     }
                    </div>
                </form>            
            </section>
        )
    }


    if (orderType === 'recurring investment') {
        return (
            <section className="stock-order-container">
                <form className="stock-order-form">
                    <div className="order-title">
                        <div className="buy-order">
                            {symbol} recurring investment
                        </div>
                        <select name="order-type" id="order-type" onChange={handleTypeChange}>
                            <option value="market order">Market Order</option>
                            <option value="limit order">Limit Order</option>
                            <option value="stop loss order">Stop Loss Order</option>
                            <option value="stop limit order">Stop Limit Order</option>
                            <option value="trailing stop order">Trailing Stop Order</option>
                            <option value="recurring investment">Recurring Investment</option>
                        </select>
                    </div>
                    <div className="order-detail-container">
                        <div className="order-detail-content-container">
                            <span>Order Type</span>
                            <div className="order-detail-right order-type-title"><span>{orderType.toUpperCase()}</span></div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Amount</span>
                            <div className="order-detail-right">
                                $ &nbsp; <input name="amount" placeholder="$0.00" type="number" value={amount} onChange={handleAmountChange} onBlur={handleAmountBlur}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Starts</span>
                            <div className="order-detail-right">
                                <input type="date" value={starts} min={starts} onChange={handleStartsChange} onBlur={handleStartsBlur}/>
                            </div>
                        </div>
                        <div className="order-detail-content-container">
                            <span>Frequency</span>
                            <div className="order-detail-right">
                                <select name="expires" id="order-expires" value={frequency} onChange={handleFrequencyChange}>
                                    <option value="every market day">Every market day (Monday to Friday)</option>
                                    <option value="every week">Every week</option>
                                    <option value="every two weeks">Every two weeks</option>
                                    <option value="every month">Every Month</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-overview">
                        <div className="review-order-container">
                            <button disabled={true} >Review Order</button>
                        </div>
                    </div>
                    <div className="order-last-row">
                    {
                        buyOrSell === 'buy' ?
                        `$${user.balance} buying power available`
                        :
                        `(user.own.stocksymbol) Shares Available`
                     }
                    </div>
                </form>            
            </section>
        )
    }
}


