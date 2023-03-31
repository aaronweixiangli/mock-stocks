const Twelve_Data_API_Key = process.env.Twelve_Data_API_Key;
const Alpha_Vantage_API_Key = process.env.Alpha_Vantage_API_Key;
const Order = require('../../models/order');
const StockOwn = require('../../models/stockOwn');
const Notification = require('../../models/notification');
const History = require('../../models/history');

module.exports = {
    getStock,
    getStockInfo,
    placeMarketOrder,
};

async function getStock(req, res) {
    try {
        const symbol = req.params.symbol;
        const interval = req.body.interval;
        const startDate = req.body.startDate;
        const stock = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=${interval}&format=JSON&timezone=America/Los_Angeles&symbol=${symbol}&start_date=${startDate}&dp=2`)
        .then(res => res.json());
        res.json(stock);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getStockInfo(req, res) {
    try {
        const symbol = req.params.symbol;
        const stockInfo = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${Alpha_Vantage_API_Key}`).then(res => res.json());
        res.json(stockInfo);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function placeMarketOrder(req, res) {
    console.log('placemarketorder hits');
    const symbol = req.body.symbol;
    const stockOwn = await StockOwn.findOne({ user: req.user._id, symbol });
    const buyOrSell = req.body.buyOrSell;
    const orderType = req.body.orderType;
    const sharesOrDollars = req.body.sharesOrDollars;
    const shares = Number(req.body.shares);
    const dollars = Number(req.body.dollars);
    let isMarketOpen = true;

    // check for date and time
    const now = new Date();
    const day = now.getDay();
    // if it's either Sunday or Saturday, set isMarketOpen to be false
    if (day === 0 || day === 6) isMarketOpen = false;
    // if it's not in between 6:30am to 1:00pm PDT, set isMarketOpen to be false
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    if (hours < 13 || hours > 20)  isMarketOpen = false;
    if (hours === 13 && minutes < 30)  isMarketOpen = false;

    if (isMarketOpen) {
        // if market is open and it's a buy order and buy in shares
        if (buyOrSell === 'buy' && sharesOrDollars === "shares") {
            try {
                const stockData = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
                const currentMarketPrice = Number(stockData.values[0].open);
                const cost = (shares * currentMarketPrice).toFixed(2);
                // if user's balance is greater than or equal to the cost, execute the order
                if (req.user.balance - cost >= 0) {
                    // if user already owns this stock, increase qty
                    if (stockOwn) {
                        // New total cost = (current average cost per share * current number of shares) + (number of new shares * purchase price per share)
                        const newTotalCost = (stockOwn.avgCost * stockOwn.qty + shares * currentMarketPrice);
                        // New total number of shares = current number of shares + number of new shares
                        const newQuantity = stockOwn.qty + shares;
                        // New average cost per share = New total cost / New total number of shares
                        const newAvgCost = newTotalCost / newQuantity;
                        stockOwn.qty = newQuantity;
                        stockOwn.avgCost = newAvgCost;
                        await stockOwn.save();
                        // create history instance
                        await History.create({
                            symbol,
                            type: 'stock',
                            category: 'buy',
                            marketPrice: currentMarketPrice,
                            qty: shares,
                            user: req.user._id
                        });
                        // Succesfully place the order, update user's balance
                        req.user.balance -= cost;
                        await req.user.save();
                        return res.json({success: "Market order (buy in shares) successfully executed"})
                    } else {
                        // if user does not own this stock yet, create a stockOwn instance
                        await StockOwn.create({
                            symbol: symbol,
                            qty: shares,
                            avgCost: (cost / shares),
                            user: req.user._id
                        });
                        // Succesfully place the order, update user's balance
                        req.user.balance -= cost;
                        await req.user.save();
                        return res.json({success: "Market order (buy in shares) successfully executed"})
                    };
                    
                } else {
                    // If user's balance is less than the cost
                    // create a notification instance for this user
                    await Notification.create({
                        text: "Your market order (buy in shares) has not been placed successfully due to insufficient funds.",
                        read: false,
                        user: req.user._id
                    });
                    return res.json({failure: "Insufficient funds"});
                }
            } catch {
                // Something went wrong. Probably because of the API limit
                return res.json({failure: "Network Error. Please try again later."});
            }
        } else if ( buyOrSell === 'buy' && sharesOrDollars === "dollars" ) {
        // if market is open and it's a buy order and buy in dollars
            try {
                const stockData = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
                const currentMarketPrice = Number(stockData.values[0].open);
                const buyInQuantity = (dollars / currentMarketPrice).toFixed(5);
                
                // if user's balance is greater than buy in dollars, execute the order
                if (req.user.balance - dollars >= 0) {
                    // if user already owns this stock, increase qty
                    if (stockOwn) {
                        // New total cost = (current average cost per share * current number of shares) + (number of new shares * purchase price per share)
                        const newTotalCost = (stockOwn.avgCost * stockOwn.qty + buyInQuantity * currentMarketPrice);
                        // New total number of shares = current number of shares + number of new shares
                        const newQuantity = stockOwn.qty + buyInQuantity;
                        // New average cost per share = New total cost / New total number of shares
                        const newAvgCost = newTotalCost / newQuantity;
                        stockOwn.qty = newQuantity;
                        stockOwn.avgCost = newAvgCost
                        await stockOwn.save();
                        // create history instance
                        await History.create({
                            symbol,
                            type: 'stock',
                            category: 'buy',
                            marketPrice: currentMarketPrice,
                            qty: buyInQuantity,
                            user: req.user._id
                        });
                        // Succesfully place the order, update user's balance
                        req.user.balance -= dollars;
                        await req.user.save();
                        return res.json({success: "Market order (buy in dollars) successfully executed"})
                    } else {
                        // Otherwise, create a stockOwn instance
                        // Average cost per share = total cost of buying shares / number of shares bought
                        await StockOwn.create({
                            symbol: symbol,
                            qty: buyInQuantity,
                            avgCost: (dollars / buyInQuantity),
                            user: req.user._id
                        });
                        // Succesfully place the order, update user's balance
                        req.user.balance -= dollars;
                        await req.user.save();
                        return res.json({success: "Market order (buy in dollars) successfully executed"})
                    }
                    // If user's balance is less than buy in dollars
                } else {
                    // create a notification instance for this user
                    await Notification.create({
                        text: "Your market order (buy in dollars) has not been placed successfully due to insufficient funds.",
                        read: false,
                        user: req.user._id
                    });
                    return res.json({failure: "Insufficient funds"});
                }
            } catch {
                // Something went wrong. Probably because of the API limit
                return res.json({failure: "Network Error. Please try again later."});
            }
        } else if (buyOrSell === 'sell' && sharesOrDollars === "shares") {
            // if market is open and it's a sell order and sell in shares
            try {
                const stockData = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
                const currentMarketPrice = Number(stockData.values[0].open);
                // if user owns the stock and the stock shares are greater than or equal to the sell in shares, execute the order
                if (stockOwn && stockOwn.qty - shares >= 0) {
                    // if user already owns this stock, decrease qty
                    // New total cost = (avg cost per share before selling * shares held before selling - shares sold * selling price per share)
                    const newTotalCost = (stockOwn.avgCost * stockOwn.qty - shares * currentMarketPrice);
                    // New total number of shares = current number of shares - number of shares sold
                    const newQuantity = stockOwn.qty - shares;
                    // New average cost per share = New total cost / New total number of shares
                    const newAvgCost = newTotalCost / newQuantity;
                    stockOwn.qty = newQuantity;
                    stockOwn.avgCost = newAvgCost;
                    await stockOwn.save();
                    // create history instance
                    await History.create({
                        symbol,
                        type: 'stock',
                        category: 'sell',
                        marketPrice: currentMarketPrice,
                        qty: shares,
                        user: req.user._id
                    });
                    // Succesfully place the order, update user's balance
                    req.user.balance += shares * currentMarketPrice;
                    await req.user.save();
                    // if the stockOwn's qty is 0, delete the stockOwn instance
                    if (stockOwn.qty === 0) {
                        await stockOwn.deleteOne();
                    };
                    return res.json({success: "Market order (sell in shares) successfully executed"})
                // If user does not own the stock or does not have enought shares to sell, create notification instance
                } else {
                    await Notification.create({
                        text: "Your market order (sell in shares) has not been placed successfully due to insufficient shares.",
                        read: false,
                        user: req.user._id
                    });
                    return res.json({failure: "Insufficient shares."});
                }
            } catch {
                // Something went wrong. Probably because of the API limit
                return res.json({failure: "Network Error. Please try again later."});
            }
        } else if (buyOrSell === 'sell' && sharesOrDollars === "dollars") {
            // if market is open and it's a sell order and sell in dollars
            try {
                const stockData = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
                const currentMarketPrice = Number(stockData.values[0].open);
                const sellInQuantity = (dollars / currentMarketPrice).toFixed(5);
                // if user owns the stock and the stock shares are greater than or equal to the sell in shares, execute the order
                if (stockOwn && stockOwn.qty - sellInQuantity >= 0) {
                    // if user already owns this stock, decrease qty
                    // New total cost = (avg cost per share before selling * shares held before selling - shares sold * selling price per share)
                    const newTotalCost = (stockOwn.avgCost * stockOwn.qty - sellInQuantity * currentMarketPrice);
                    // New total number of shares = current number of shares - number of shares sold
                    const newQuantity = stockOwn.qty - sellInQuantity;
                    // New average cost per share = New total cost / New total number of shares
                    const newAvgCost = newTotalCost / newQuantity;
                    stockOwn.qty = newQuantity;
                    stockOwn.avgCost = newAvgCost;
                    await stockOwn.save();
                    // create history instance
                    await History.create({
                        symbol,
                        type: 'stock',
                        category: 'sell',
                        marketPrice: currentMarketPrice,
                        qty: sellInQuantity,
                        user: req.user._id
                    });
                    // Succesfully place the order, update user's balance
                    req.user.balance += sellInQuantity * currentMarketPrice;
                    await req.user.save();
                    // if the stockOwn's qty is 0, delete the stockOwn instance
                    if (stockOwn.qty === 0) {
                        await stockOwn.deleteOne();
                    };
                    return res.json({success: "Market order (sell in dollars) successfully executed"})
                // If user does not own the stock or does not have enought shares to sell, create notification instance
                } else {
                    await Notification.create({
                        text: "Your market order (sell in dollars) has not been placed successfully due to insufficient shares.",
                        read: false,
                        user: req.user._id
                    });
                    return res.json({failure: "Insufficient shares."});
                }
            } catch {
                // Something went wrong. Probably because of the API limit
                return res.json({failure: "Network Error. Please try again later."});
            }
        }

    // if market is closed
    } else {
        // if market is closed and it's a buy order and buy in shares
        if (buyOrSell === 'buy' && sharesOrDollars === "shares") {
            try {
                const stockData = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
                const currentMarketPrice = Number(stockData.values[0].open);
                const cost = (shares * currentMarketPrice).toFixed(2);
                // if user's balance is greater than or equal to the cost, create the order but do not execute. set status to be active
                if (req.user.balance - cost >= 0) {
                    await Order.create({
                        user: req.user._id,
                        symbol: symbol,
                        type: 'stock',
                        status: 'active',
                        buyOrSell: 'buy',
                        orderType,
                        sharesOrDollars,
                        shares,
                        dollars,
                    })
                    await Notification.create({
                        text: "Your market order (buy in shares) has been placed successfully. If this order isn't filled by the end of market hours (4:00pm ET) on the next trading day, it will expire.",
                        read: false,
                        user: req.user._id
                    });
                } else {
                    // If user's balance is less than the cost
                    // create a notification instance for this user
                    await Notification.create({
                        text: "Your market order (buy in shares) has not been placed successfully due to insufficient funds.",
                        read: false,
                        user: req.user._id
                    });
                    return res.json({failure: "Insufficient funds."});
                }
            } catch {
                // Something went wrong. Probably because of the API limit
                return res.json({failure: "Network Error. Please try again later."});
            }
        }
    }
}