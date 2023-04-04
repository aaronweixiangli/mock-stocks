import { useState } from "react";
import * as stocksAPI from "../../utilities/stocks-api";
import * as usersAPI from "../../utilities/users-api";

export default function StockOrder({
  symbol,
  marketPrice,
  user,
  sharesOwn,
  setSharesOwn,
  sharesOnHold,
  setSharesOnHold,
  balance,
  setBalance,
  balanceOnHold,
  setBalanceOnHold,
}) {
  // MARKET ORDER
  // const variables and functions for Market Order
  const [buyOrSell, setBuyOrSell] = useState("buy");
  const [orderType, setOrderType] = useState("market order");
  const [sharesOrDollars, setSharesOrDollars] = useState("shares");
  const [shares, setShares] = useState("");
  const [dollars, setDollars] = useState("");

  function handleBuyType() {
    if (buyOrSell === "sell") setBuyOrSell("buy");
    if (reviewDetail) setReviewDetail(null);
  }

  function handleSellType() {
    if (buyOrSell === "buy") setBuyOrSell("sell");
    if (reviewDetail) setReviewDetail(null);
  }

  function handleTypeChange(evt) {
    //set all form variables to be initial values
    setShares("");
    setDollars("");
    setSharesOrDollars("shares");
    setLimitPrice("");
    setExpires("good for day");
    setStopPrice("");
    setTrialType("percentage");
    setTrailPercent("");
    setTrailAmount("");
    setStarts(tomorrowDate());
    setAmount("");
    setFrequency("every market day");
    setReviewDetail(null);
    setOrderType(evt.target.value);
  }

  function handleSharesOrDollars(evt) {
    if (sharesOrDollars === "shares") setShares("");
    if (sharesOrDollars === "dollars") setDollars("");
    setReviewDetail(null);
    setSharesOrDollars(evt.target.value);
  }

  function handleSharesChange(evt) {
    setReviewDetail(null);
    setShares(evt.target.value);
  }

  // Once the user leaves the input field, round shares to 4 decimal digits
  function handleSharesBlur() {
    if (shares <= 0) {
      setShares("");
      return;
    }
    if (shares) setShares(parseFloat(shares).toFixed(4));
  }

  function handleDollarsChange(evt) {
    setReviewDetail(null);
    setDollars(evt.target.value);
  }

  function handleDollarsBlur() {
    if (dollars <= 0) {
      setDollars("");
      return;
    }
    if (dollars) setDollars(parseFloat(dollars).toFixed(2));
  }

  // LIMIT ORDER
  // const variables and functions for Limit Order. Note that Limit order also has variable 'shares'
  const [limitPrice, setLimitPrice] = useState("");
  const [expires, setExpires] = useState("good for day");

  function handleLimitPriceChange(evt) {
    setReviewDetail(null);
    setLimitPrice(evt.target.value);
  }

  function handleLimitPriceBlur() {
    if (limitPrice <= 0) {
      setLimitPrice("");
      return;
    }
    if (limitPrice) setLimitPrice(parseFloat(limitPrice).toFixed(2));
  }

  function handleExpiresChange(evt) {
    setReviewDetail(null);
    setExpires(evt.target.value);
  }

  // Once the user leaves the input field, round shares to integer
  function handleSharesBlurInteger() {
    if (shares <= 0) {
      setShares("");
      return;
    }
    if (shares) setShares(parseInt(shares));
  }

  // STOP LOSS ORDER
  // const variables and functions for Stop Loss Order. Note that Stop Loss Order also has variables shares & expires
  const [stopPrice, setStopPrice] = useState("");

  function handleStopPriceChange(evt) {
    setReviewDetail(null);
    setStopPrice(evt.target.value);
  }

  function handleStopPriceBlur() {
    if (stopPrice <= 0) {
      setStopPrice("");
      return;
    }
    if (stopPrice) setStopPrice(parseFloat(stopPrice).toFixed(2));
  }

  // STOP LIMIT ORDER
  // Note that Stop Limit Order also has variables stopPrice, limitPrice, shares, and expires

  // TRAILING STOP ORDER
  // const variables and functions for Trailing Stop Order. Note that Stop Loss Order also has variables shares & expires
  const [trailType, setTrialType] = useState("percentage");
  const [trailPercent, setTrailPercent] = useState("");
  const [trailAmount, setTrailAmount] = useState("");

  function handleTrailTypeChange(evt) {
    setReviewDetail(null);
    setTrialType(evt.target.value);
  }

  function handleTrailPercentChange(evt) {
    setReviewDetail(null);
    setTrailPercent(evt.target.value);
  }

  function handleTrailPercentBlur() {
    if (trailPercent <= 0) {
      setTrailPercent("");
      return;
    }
    if (trailPercent) setTrailPercent(parseInt(trailPercent));
  }

  function handleTrailAmountChange(evt) {
    setReviewDetail(null);
    setTrailAmount(evt.target.value);
  }

  function handleTrailAmountBlur() {
    if (trailAmount <= 0) {
      setTrailAmount("");
      return;
    }
    if (trailAmount) setTrailAmount(parseFloat(trailAmount).toFixed(2));
  }

  // RECURRING INVESTMENT
  // const variables and functions for recurring investment.
  const [starts, setStarts] = useState(tomorrowDate());
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("every market day");

  function tomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    // Convert to format YYYY-MM-DD
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  }

  function handleAmountChange(evt) {
    setReviewDetail(null);
    setAmount(evt.target.value);
  }

  function handleAmountBlur() {
    if (amount <= 0) {
      setAmount("");
      return;
    }
    if (amount) setAmount(parseFloat(amount).toFixed(2));
  }

  function handleFrequencyChange(evt) {
    setReviewDetail(null);
    setFrequency(evt.target.value);
  }

  function handleStartsChange(evt) {
    setReviewDetail(null);
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
    // Guard. Ensure input is greater than today's date. Specify timezone to be PDT
    const selectedDate = new Date(inputDate + "T00:00:00-07:00");
    const minimumDate = new Date(tomorrowDate());
    if (selectedDate < minimumDate) {
      setStarts(tomorrowDate());
      return;
    }
    // Adjust selected date to next Monday if it is a Saturday or Sunday
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) {
      selectedDate.setDate(selectedDate.getDate() + 1);
    } else if (dayOfWeek === 6) {
      selectedDate.setDate(selectedDate.getDate() + 2);
    }
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const nextMonday = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    setStarts(nextMonday);
  }

  // Define reviewDetail variable to store html elements that display review details for each order type form
  const [reviewDetail, setReviewDetail] = useState(null);
  // When the user clicks the review button, change the reviewDetail according to different order type
  function handleReviewDetail(evt) {
    evt.preventDefault();
    if (orderType === "market order") {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Summary</span>
          <span className="review-content">
            You are placing an market order to{" "}
            {buyOrSell === "buy" ? "buy" : "sell"}{" "}
            {sharesOrDollars === "shares"
              ? `${shares} shares of ${symbol} based on current market price of $${marketPrice}. You will pay approximately $${(
                  marketPrice * shares
                ).toFixed(2)}.`
              : `$${dollars} of ${symbol} based on the current market price of $${marketPrice}. You will receive approximately ${(
                  dollars / marketPrice
                ).toFixed(5)} shares.`}{" "}
          </span>
          <div className="order-summary-btn-container">
            <button className="order-summary-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button
              className="order-summary-btn order-edit-btn"
              onClick={handleCancel}
            >
              Edit
            </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
    if (orderType === "limit order") {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Summary</span>
          <span className="review-content">
            You are placing a {expires} limit order to{" "}
            {buyOrSell === "buy" ? "buy" : "sell"} {shares} shares of {symbol}.
            Your pending order, if executed, will execute at ${limitPrice} per
            share or {buyOrSell === "buy" ? "better" : "higher"}.
          </span>
          <div className="order-summary-btn-container">
            <button className="order-summary-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button
              className="order-summary-btn order-edit-btn"
              onClick={handleCancel}
            >
              Edit
            </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
    if (orderType === "stop loss order") {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Summary</span>
          <span className="review-content">
            You are placing a {expires} stop loss order to{" "}
            {buyOrSell === "buy" ? "buy" : "sell"} {shares} shares of {symbol}.
            When the price of {symbol}{" "}
            {buyOrSell === "buy" ? "reaches" : "drops to"} ${stopPrice}, your
            order will be converted to a market order.
          </span>
          <div className="order-summary-btn-container">
            <button className="order-summary-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button
              className="order-summary-btn order-edit-btn"
              onClick={handleCancel}
            >
              Edit
            </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
    if (orderType === "stop limit order") {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Summary</span>
          <span className="review-content">
            You are placing a {expires} stop limit order to{" "}
            {buyOrSell === "buy" ? "buy" : "sell"} {shares} shares of {symbol}.
            When the price of {symbol}{" "}
            {buyOrSell === "buy" ? "reaches" : "drops to"} ${stopPrice}, your
            order will be converted to a limit order at ${limitPrice} per share.
          </span>
          <div className="order-summary-btn-container">
            <button className="order-summary-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button
              className="order-summary-btn order-edit-btn"
              onClick={handleCancel}
            >
              Edit
            </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
    if (orderType === "trailing stop order") {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Summary</span>
          <span className="review-content">
            You are placing a {expires} trailing stop order to{" "}
            {buyOrSell === "buy" ? "buy" : "sell"} {shares} shares of {symbol}.
            When the price of {symbol}{" "}
            {buyOrSell === "buy"
              ? ` reaches ${
                  trailType === "percentage"
                    ? `$${(marketPrice * (1 + trailPercent / 100)).toFixed(
                        2
                      )} or higher`
                    : `$${(
                        parseFloat(marketPrice) + parseFloat(trailAmount)
                      ).toFixed(2)} or higher`
                }`
              : `drops to ${
                  trailType === "percentage"
                    ? `$${(marketPrice * (1 - trailPercent / 100)).toFixed(
                        2
                      )} or lower`
                    : `$${(
                        parseFloat(marketPrice) - parseFloat(trailAmount)
                      ).toFixed(2)}`
                } or lower`}
            , your order will be converted to a market order.
          </span>
          <div className="order-summary-btn-container">
            <button className="order-summary-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button
              className="order-summary-btn order-edit-btn"
              onClick={handleCancel}
            >
              Edit
            </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
    if (orderType === "recurring investment") {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Summary</span>
          {frequency === "every market day" && (
            <span className="review-content">
              You'll buy ${amount} of {symbol} every market day. Your first
              order will be placed on {starts} at 11:00 AM ET (8:00 AM PDT) in a
              batch order with other MockStocks recurring investment orders for{" "}
              {symbol}.
            </span>
          )}
          {frequency === "every week" && (
            <span className="review-content">
              You'll buy ${amount} of {symbol} every week on{" "}
              {new Date(starts + "T00:00:00-07:00").toLocaleString("en-US", {
                weekday: "long",
              })}
              . Your first order will be placed on {starts} at 11:00 AM ET (8:00
              AM PDT) in a batch order with other MockStocks recurring
              investment orders for {symbol}.
            </span>
          )}
          {frequency === "every two weeks" && (
            <span className="review-content">
              You'll buy ${amount} of {symbol} every two weeks on{" "}
              {new Date(starts + "T00:00:00-07:00").toLocaleString("en-US", {
                weekday: "long",
              })}
              . Your first order will be placed on {starts} at 11:00 AM ET (8:00
              AM PDT) in a batch order with other MockStocks recurring
              investment orders for {symbol}.
            </span>
          )}
          {frequency === "every month" && (
            <span className="review-content">
              You'll buy ${amount} of {symbol} every month on day{" "}
              {new Date(starts + "T00:00:00-07:00").toLocaleString("en-US", {
                day: "numeric",
              })}
              . Your first order will be placed on {starts} at 11:00 AM ET (8:00
              AM PDT) in a batch order with other MockStocks recurring
              investment orders for {symbol}.
            </span>
          )}
          <div className="order-summary-btn-container">
            <button className="order-summary-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button
              className="order-summary-btn order-edit-btn"
              onClick={handleCancel}
            >
              Edit
            </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
  }

  function handleCancel() {
    setReviewDetail(null);
  }

  function handleDone() {
    //set all form variables to be initial values
    setShares("");
    setDollars("");
    setSharesOrDollars("shares");
    setLimitPrice("");
    setExpires("good for day");
    setStopPrice("");
    setTrialType("percentage");
    setTrailPercent("");
    setTrailAmount("");
    setStarts(tomorrowDate());
    setAmount("");
    setFrequency("every market day");
    setReviewDetail(null);
  }

  // PlaceOrder Functions for each order type
  async function handlePlaceOrder(evt) {
    evt.preventDefault();
    let result;
    if (orderType === "market order") {
      result = await stocksAPI.marketOrder(
        symbol,
        buyOrSell,
        orderType,
        sharesOrDollars,
        shares,
        dollars
      );
    } else if (orderType === "limit order") {
      // if it's limit buy order, save the dollars on hold for this order
      const orderDollarsOnHold =
        buyOrSell === "buy" ? Number((limitPrice * shares).toFixed(2)) : 0;
      result = await stocksAPI.limitOrder(
        symbol,
        buyOrSell,
        orderType,
        limitPrice,
        shares,
        expires,
        orderDollarsOnHold
      );
    } else {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Fails</span>
          <span className="review-content">
            We apologize for the inconvenience, but only limit and market orders
            are currently available. Stop loss, stop limit, trailing stop, and
            recurring investment orders will be added in the future. Please
            check back for updates or choose one of the available order types.
          </span>
          <div className="review-order-container">
            <button onClick={handleDone}>Done </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    }
    if (result.failure) {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Fails</span>
          <span className="review-content">{result.failure}</span>
          <div className="review-order-container">
            <button onClick={handleDone}>Done </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
    } else {
      const reviewElement = (
        <div className="review-container">
          <span className="review-title">Order Succeeds</span>
          <span className="review-content">{result.success}</span>
          <div className="review-order-container">
            <button onClick={handleDone}>Done </button>
          </div>
        </div>
      );
      setReviewDetail(reviewElement);
      const userBalance = await usersAPI.getBalance();
      setBalance(userBalance);
      const userSharesOwn = await usersAPI.getSharesOwn(symbol);
      setSharesOwn(userSharesOwn);
      const userSharesOnHold = await usersAPI.getSharesOnHold(symbol);
      setSharesOnHold(userSharesOnHold);
    }
  }

  if (orderType === "market order") {
    return (
      <section className="stock-order-container">
        <form className="stock-order-form">
          <div className="order-title">
            <div
              className={`buy-order ${buyOrSell === "buy" ? "active" : ""}`}
              onClick={handleBuyType}
            >
              Buy {symbol}
            </div>
            <div
              className={`sell-order ${buyOrSell === "sell" ? "active" : ""}`}
              onClick={handleSellType}
            >
              Sell {symbol}
            </div>
            <select
              name="order-type"
              id="order-type"
              value={orderType}
              onChange={handleTypeChange}
            >
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
              <div className="order-detail-right order-type-title">
                <span>{orderType.toUpperCase()}</span>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>{buyOrSell === "buy" ? "Buy in" : "Sell in"}</span>
              <div className="order-detail-right">
                <select name="buy-in" onChange={handleSharesOrDollars}>
                  <option value="shares">Shares</option>
                  <option value="dollars">Dollars</option>
                </select>
              </div>
            </div>
            <div className="order-detail-content-container">
              {sharesOrDollars === "shares" ? (
                <>
                  <span>Shares</span>
                  <div className="order-detail-right">
                    <input
                      name="shares"
                      placeholder="0.0000"
                      type="number"
                      value={shares}
                      onChange={handleSharesChange}
                      onBlur={handleSharesBlur}
                    />
                  </div>
                </>
              ) : (
                <>
                  <span>Amount</span>
                  <div className="order-detail-right">
                    $ &nbsp;{" "}
                    <input
                      name="dollars"
                      type="number"
                      placeholder="0.00"
                      value={dollars}
                      onChange={handleDollarsChange}
                      onBlur={handleDollarsBlur}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="order-detail-content-container">
              <span>Market Price</span>
              <div className="order-detail-right">
                <span>${marketPrice}</span>
              </div>
            </div>
          </div>
          <div className="order-detail-overview">
            {sharesOrDollars === "shares" ? (
              <>
                <div className="order-detail-content-container">
                  <span>
                    {buyOrSell === "buy" ? "Est. Cost" : "Est. Credit"}
                  </span>
                  <div className="order-detail-right">
                    <span>${(marketPrice * shares).toFixed(2)}</span>
                  </div>
                </div>
                <div
                  className="review-order-container"
                  style={{ display: reviewDetail ? "none" : "flex" }}
                >
                  <button
                    disabled={
                      !shares ||
                      (buyOrSell === "buy"
                        ? !(
                            balance >= Number((marketPrice * shares).toFixed(2))
                          )
                        : !(sharesOwn - sharesOnHold >= shares))
                    }
                    onClick={handleReviewDetail}
                  >
                    Review Order
                  </button>
                </div>
                {reviewDetail}
              </>
            ) : (
              <>
                <div className="order-detail-content-container">
                  <span>Est. Quantity</span>
                  <div className="order-detail-right">
                    <span>{(dollars / marketPrice).toFixed(5)}</span>
                  </div>
                </div>
                <div
                  className="review-order-container"
                  style={{ display: reviewDetail ? "none" : "flex" }}
                >
                  <button
                    disabled={
                      !dollars ||
                      (buyOrSell === "buy"
                        ? !(balance >= dollars)
                        : !(
                            sharesOwn - sharesOnHold >=
                            Number((dollars / marketPrice).toFixed(5))
                          ))
                    }
                    onClick={handleReviewDetail}
                  >
                    Review Order
                  </button>
                </div>
                {reviewDetail}
              </>
            )}
          </div>
          <div className="order-last-row">
            {buyOrSell === "buy"
              ? `$${balance} buying power available`
              : `${sharesOwn - sharesOnHold} Shares Available`}
          </div>
        </form>
      </section>
    );
  }

  if (orderType === "limit order") {
    return (
      <section className="stock-order-container">
        <form className="stock-order-form">
          <div className="order-title">
            <div
              className={`buy-order ${buyOrSell === "buy" ? "active" : ""}`}
              onClick={handleBuyType}
            >
              Buy {symbol}
            </div>
            <div
              className={`sell-order ${buyOrSell === "sell" ? "active" : ""}`}
              onClick={handleSellType}
            >
              Sell {symbol}
            </div>
            <select
              name="order-type"
              id="order-type"
              value={orderType}
              onChange={handleTypeChange}
            >
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
              <div className="order-detail-right order-type-title">
                <span>{orderType.toUpperCase()}</span>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Limit Price</span>
              <div className="order-detail-right">
                $ &nbsp;{" "}
                <input
                  name="limit-price"
                  placeholder="$0.00"
                  type="number"
                  value={limitPrice}
                  onChange={handleLimitPriceChange}
                  onBlur={handleLimitPriceBlur}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Shares</span>
              <div className="order-detail-right">
                <input
                  name="shares"
                  placeholder="0"
                  type="number"
                  step="1"
                  value={shares}
                  onChange={handleSharesChange}
                  onBlur={handleSharesBlurInteger}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Expires</span>
              <div className="order-detail-right">
                <select
                  name="expires"
                  id="order-expires"
                  value={expires}
                  onChange={handleExpiresChange}
                >
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
              <span>{buyOrSell === "buy" ? "Est. Cost" : "Est. Credit"}</span>
              <div className="order-detail-right">
                <span>${(limitPrice * shares).toFixed(2)}</span>
              </div>
            </div>
            <div
              className="review-order-container"
              style={{ display: reviewDetail ? "none" : "flex" }}
            >
              <button
                disabled={
                  !limitPrice ||
                  !shares ||
                  !expires ||
                  (buyOrSell === "buy"
                    ? !(balance >= Number((limitPrice * shares).toFixed(2)))
                    : !(sharesOwn - sharesOnHold >= shares))
                }
                onClick={handleReviewDetail}
              >
                Review Order
              </button>
            </div>
            {reviewDetail}
          </div>
          <div className="order-last-row">
            {buyOrSell === "buy"
              ? `$${balance} buying power available`
              : `${sharesOwn - sharesOnHold} Shares Available`}
          </div>
        </form>
      </section>
    );
  }

  if (orderType === "stop loss order") {
    return (
      <section className="stock-order-container">
        <form className="stock-order-form">
          <div className="order-title">
            <div
              className={`buy-order ${buyOrSell === "buy" ? "active" : ""}`}
              onClick={handleBuyType}
            >
              Buy {symbol}
            </div>
            <div
              className={`sell-order ${buyOrSell === "sell" ? "active" : ""}`}
              onClick={handleSellType}
            >
              Sell {symbol}
            </div>
            <select
              name="order-type"
              id="order-type"
              value={orderType}
              onChange={handleTypeChange}
            >
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
              <div className="order-detail-right order-type-title">
                <span>{orderType.toUpperCase()}</span>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Stop Price</span>
              <div className="order-detail-right">
                $ &nbsp;{" "}
                <input
                  name="limit-price"
                  placeholder="$0.00"
                  type="number"
                  value={stopPrice}
                  onChange={handleStopPriceChange}
                  onBlur={handleStopPriceBlur}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Shares</span>
              <div className="order-detail-right">
                <input
                  name="shares"
                  placeholder="0"
                  type="number"
                  step="1"
                  value={shares}
                  onChange={handleSharesChange}
                  onBlur={handleSharesBlurInteger}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Expires</span>
              <div className="order-detail-right">
                <select
                  name="expires"
                  id="order-expires"
                  value={expires}
                  onChange={handleExpiresChange}
                >
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
              <span>{buyOrSell === "buy" ? "Est. Cost" : "Est. Credit"}</span>
              <div className="order-detail-right">
                <span>${(stopPrice * shares).toFixed(2)}</span>
              </div>
            </div>
            <div
              className="review-order-container"
              style={{ display: reviewDetail ? "none" : "flex" }}
            >
              <button
                disabled={
                  !stopPrice ||
                  !shares ||
                  !expires ||
                  (buyOrSell === "buy"
                    ? !(balance >= Number((stopPrice * shares).toFixed(2)))
                    : !(sharesOwn - sharesOnHold >= shares))
                }
                onClick={handleReviewDetail}
              >
                Review Order
              </button>
            </div>
            {reviewDetail}
          </div>
          <div className="order-last-row">
            {buyOrSell === "buy"
              ? `$${balance} buying power available`
              : `${sharesOwn - sharesOnHold} Shares Available`}
          </div>
        </form>
      </section>
    );
  }

  if (orderType === "stop limit order") {
    return (
      <section className="stock-order-container">
        <form className="stock-order-form">
          <div className="order-title">
            <div
              className={`buy-order ${buyOrSell === "buy" ? "active" : ""}`}
              onClick={handleBuyType}
            >
              Buy {symbol}
            </div>
            <div
              className={`sell-order ${buyOrSell === "sell" ? "active" : ""}`}
              onClick={handleSellType}
            >
              Sell {symbol}
            </div>
            <select
              name="order-type"
              id="order-type"
              value={orderType}
              onChange={handleTypeChange}
            >
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
              <div className="order-detail-right order-type-title">
                <span>{orderType.toUpperCase()}</span>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Stop Price</span>
              <div className="order-detail-right">
                $ &nbsp;{" "}
                <input
                  name="stop-price"
                  placeholder="$0.00"
                  type="number"
                  value={stopPrice}
                  onChange={handleStopPriceChange}
                  onBlur={handleStopPriceBlur}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Limit Price</span>
              <div className="order-detail-right">
                $ &nbsp;{" "}
                <input
                  name="limit-price"
                  placeholder="$0.00"
                  type="number"
                  value={limitPrice}
                  onChange={handleLimitPriceChange}
                  onBlur={handleLimitPriceBlur}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Shares</span>
              <div className="order-detail-right">
                <input
                  name="shares"
                  placeholder="0"
                  type="number"
                  step="1"
                  value={shares}
                  onChange={handleSharesChange}
                  onBlur={handleSharesBlurInteger}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Expires</span>
              <div className="order-detail-right">
                <select
                  name="expires"
                  id="order-expires"
                  value={expires}
                  onChange={handleExpiresChange}
                >
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
              <span>{buyOrSell === "buy" ? "Est. Cost" : "Est. Credit"}</span>
              <div className="order-detail-right">
                <span>${(limitPrice * shares).toFixed(2)}</span>
              </div>
            </div>
            <div
              className="review-order-container"
              style={{ display: reviewDetail ? "none" : "flex" }}
            >
              <button
                disabled={
                  !stopPrice ||
                  !limitPrice ||
                  !shares ||
                  !expires ||
                  (buyOrSell === "buy"
                    ? !(balance >= Number((limitPrice * shares).toFixed(2)))
                    : !(sharesOwn - sharesOnHold >= shares))
                }
                onClick={handleReviewDetail}
              >
                Review Order
              </button>
            </div>
            {reviewDetail}
          </div>
          <div className="order-last-row">
            {buyOrSell === "buy"
              ? `$${balance} buying power available`
              : `${sharesOwn - sharesOnHold} Shares Available`}
          </div>
        </form>
      </section>
    );
  }

  if (orderType === "trailing stop order") {
    return (
      <section className="stock-order-container">
        <form className="stock-order-form">
          <div className="order-title">
            <div
              className={`buy-order ${buyOrSell === "buy" ? "active" : ""}`}
              onClick={handleBuyType}
            >
              Buy {symbol}
            </div>
            <div
              className={`sell-order ${buyOrSell === "sell" ? "active" : ""}`}
              onClick={handleSellType}
            >
              Sell {symbol}
            </div>
            <select
              name="order-type"
              id="order-type"
              value={orderType}
              onChange={handleTypeChange}
            >
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
              <div className="order-detail-right order-type-title">
                <span>{orderType.toUpperCase()}</span>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Trail Type</span>
              <div className="order-detail-right">
                <select
                  name="trail-type"
                  value={trailType}
                  onChange={handleTrailTypeChange}
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>
                {trailType === "percentage" ? "Trail(%)" : "Trail($)"}
              </span>
              <div className="order-detail-right">
                {trailType === "percentage" ? (
                  <>
                    <input
                      name="trail-percent"
                      placeholder="0%"
                      type="number"
                      value={trailPercent}
                      onChange={handleTrailPercentChange}
                      onBlur={handleTrailPercentBlur}
                    />
                  </>
                ) : (
                  <>
                    $ &nbsp;{" "}
                    <input
                      name="trail-amount"
                      placeholder="$0.00"
                      type="number"
                      value={trailAmount}
                      onChange={handleTrailAmountChange}
                      onBlur={handleTrailAmountBlur}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Shares</span>
              <div className="order-detail-right">
                <input
                  name="shares"
                  placeholder="0"
                  type="number"
                  step="1"
                  value={shares}
                  onChange={handleSharesChange}
                  onBlur={handleSharesBlurInteger}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Expires</span>
              <div className="order-detail-right">
                <select
                  name="expires"
                  id="order-expires"
                  value={expires}
                  onChange={handleExpiresChange}
                >
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
              {buyOrSell === "buy" ? (
                <>
                  {trailType === "percentage" ? (
                    <>
                      <div className="order-detail-right">
                        <span>
                          {trailPercent ? (
                            <>
                              $
                              {(marketPrice * (1 + trailPercent / 100)).toFixed(
                                2
                              )}
                            </>
                          ) : (
                            <>---</>
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-detail-right">
                        <span>
                          {trailAmount ? (
                            <>
                              $
                              {(
                                parseFloat(marketPrice) +
                                parseFloat(trailAmount)
                              ).toFixed(2)}
                            </>
                          ) : (
                            <>---</>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {trailType === "percentage" ? (
                    <>
                      <div className="order-detail-right">
                        <span>
                          {trailPercent ? (
                            <>
                              $
                              {(marketPrice * (1 - trailPercent / 100)).toFixed(
                                2
                              )}
                            </>
                          ) : (
                            <>---</>
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-detail-right">
                        <span>
                          {trailAmount ? (
                            <>
                              $
                              {(marketPrice - parseFloat(trailAmount)).toFixed(
                                2
                              )}
                            </>
                          ) : (
                            <>---</>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div
              className="review-order-container"
              style={{ display: reviewDetail ? "none" : "flex" }}
            >
              <button
                disabled={
                  !shares ||
                  !expires ||
                  (trailType === "percentage" ? !trailPercent : !trailAmount) ||
                  (buyOrSell === "buy"
                    ? trailType === "percentage"
                      ? !(
                          balance >=
                          Number(
                            (marketPrice * (1 + trailPercent / 100)).toFixed(2)
                          ) *
                            shares
                        )
                      : !(
                          balance >=
                          Number(
                            (
                              parseFloat(marketPrice) + parseFloat(trailAmount)
                            ).toFixed(2)
                          ) *
                            shares
                        )
                    : !(sharesOwn - sharesOnHold >= shares))
                }
                onClick={handleReviewDetail}
              >
                Review Order
              </button>
            </div>
            {reviewDetail}
          </div>
          <div className="order-last-row">
            {buyOrSell === "buy"
              ? `$${balance} buying power available`
              : `${sharesOwn - sharesOnHold} Shares Available`}
          </div>
        </form>
      </section>
    );
  }

  if (orderType === "recurring investment") {
    return (
      <section className="stock-order-container">
        <form className="stock-order-form">
          <div className="order-title">
            <div className="buy-order">{symbol} recurring investment</div>
            <select
              name="order-type"
              id="order-type"
              value={orderType}
              onChange={handleTypeChange}
            >
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
              <div className="order-detail-right order-type-title">
                <span>{orderType.toUpperCase()}</span>
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Amount</span>
              <div className="order-detail-right">
                $ &nbsp;{" "}
                <input
                  name="amount"
                  placeholder="$0.00"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Starts</span>
              <div className="order-detail-right">
                <input
                  type="date"
                  value={starts}
                  min={tomorrowDate()}
                  onChange={handleStartsChange}
                  onBlur={handleStartsBlur}
                />
              </div>
            </div>
            <div className="order-detail-content-container">
              <span>Frequency</span>
              <div className="order-detail-right">
                <select
                  name="expires"
                  id="order-expires"
                  value={frequency}
                  onChange={handleFrequencyChange}
                >
                  <option value="every market day">
                    Every market day (Monday to Friday)
                  </option>
                  <option value="every week">Every week</option>
                  <option value="every two weeks">Every two weeks</option>
                  <option value="every month">Every Month</option>
                </select>
              </div>
            </div>
          </div>
          <div className="order-detail-overview">
            <div
              className="review-order-container"
              style={{ display: reviewDetail ? "none" : "flex" }}
            >
              <button
                disabled={
                  !amount || !starts || !frequency || !(balance >= amount)
                }
                onClick={handleReviewDetail}
              >
                Review Order
              </button>
            </div>
            {reviewDetail}
          </div>
          <div className="order-last-row">
            {`$${balance} buying power available`}
          </div>
        </form>
      </section>
    );
  }
}
