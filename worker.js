import moment from "moment";
const { parentPort } = require('worker_threads');

const Twelve_Data_API_Key = process.env.Twelve_Data_API_Key;

console.log(Twelve_Data_API_Key);

(async function () {
    await require('./config/database');
    const Order = require('./models/order');
    const orders = await Order.find({status: 'active'});
    const User = require('./models/user');
    const StockOwn = require('./models/stockOwn');
    const History = require('./models/history');
    const Notification = require('./models/notification');
    console.log('orders', orders)
    // if no active orders, return
    if (!orders.length) return;
    let symbols = new Set();
    orders.forEach((order) => symbols.add(order.symbol));
    symbols = [...symbols];
    const prices = {};
    for (let symbol of symbols) {
        try {
            const stock = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
            const price = Number(stock.values[0].open);
            console.log(price);
            prices[symbol] = price;
        } catch (e) {
            // if fetch error for any symbol (probably due to API limit requests), set prices[symbol] to be null
            console.log(e);
            prices[symbol] = null;
        }
    }
    for (let order of orders) {
        // Guard. If there is a fetch error, which means that there is no current market price for this stock, then skip this order, continue the loop
        const currentMarketPrice = prices[order.symbol];
        if (!currentMarketPrice) {
            console.log(`No price data available for symbol ${order.symbol}`);
            continue; // move on to the next order
        }
        if (order.typeOrder === 'market order') {
            // For market order with status 'active' means that it's placed when market is closed
            // If such market order isn't filled by the end of market hours (4:00pm ET) on the next trading day, it will expire. 
            const today = moment().day();
            const orderDay = moment(order.createdAt).day();
            console.log(`today is ${today}`);
            console.log(`order created day is ${orderDay}`);
            const dayDiff = Math.abs(today - orderDay);
            // check if the order should be deleted based on its placement day and the current day
            // if order placed on Friday at market closed, then delete the order if today is Tuesday. Day difference is greater than 3
            // if order placed on Saturday at market closed, then delete the order if today is Tuesday. Day difference is greater than 2
            // for all other days, check if day difference is greater than 1
            if ( (orderDay === 5 && dayDiff > 3) || ( orderDay === 6 && dayDiff > 2) ) {
                await Order.findByIdAndDelete(order._id);
            } else if ( orderDay !== 5 && orderDay !== 6 && dayDiff > 1 ) {
                await Order.findByIdAndDelete(order._id);
            }

            // get the current balance of the order's buyer/seller
            const user = await User.findById(order.user);
            const balance = user.balance;
            const symbol = order.symbol;
            const stockOwn = await StockOwn.findOne({ user: user._id, symbol });
            const buyOrSell = order.buyOrSell;
            const sharesOrDollars = order.sharesOrDollars;
            const shares = order.shares;
            const dollars = order.dollars;

            if (buyOrSell === 'buy' && sharesOrDollars === "shares") {
                const cost = Number((shares * currentMarketPrice).toFixed(2));
                // only execute if user's current balance is greater or equal to the cost of this buy order
                if (balance - cost >= 0) {
                    // if user already owns this stock, increase qty
                    if (stockOwn) {
                        // New total cost = (current average cost per share * current number of shares) + (number of new shares * purchase price per share)
                        const newTotalCost = (stockOwn.avgCost * stockOwn.qty + shares * currentMarketPrice);
                        // New total number of shares = current number of shares + number of new shares
                        const newQuantity = Number((stockOwn.qty + shares).toFixed(5));
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
                            user: user._id
                        });
                        await Notification.create({
                            text: `Your market order (buy in shares) to buy ${shares} shares of ${symbol} has been successfully executed at $${currentMarketPrice} per share.`,
                            read: false,
                            user: user._id
                        });
                        // Succesfully place the order, update user's balance
                        user.balance -= cost;
                        await user.save();
                        // order has been executed, delete it
                        await order.deleteOne();
                        console.log(`Buy order for ${shares} shares of ${symbol} executed and deleted.`);
                    } else {
                        // if user does not own this stock yet, create a stockOwn instance
                        await StockOwn.create({
                            symbol,
                            qty: shares,
                            avgCost: (cost / shares),
                            user: user._id
                        });
                        await History.create({
                            symbol,
                            type: 'stock',
                            category: 'buy',
                            marketPrice: currentMarketPrice,
                            qty: shares,
                            user: user._id
                        });
                        await Notification.create({
                            text: `Your market order (buy in shares) to buy ${shares} shares of ${symbol} has been successfully executed at an average price of $${currentMarketPrice} per share.`,
                            read: false,
                            user: user._id
                        });
                        // Succesfully execute the order, update user's balance
                        user.balance -= cost;
                        await user.save();
                        // order has been executed, delete it
                        await order.deleteOne();
                        console.log(`Buy order for ${shares} shares of ${symbol} executed and deleted.`);
                    };
                };
            } else if ( buyOrSell === 'buy' && sharesOrDollars === "dollars" ) {
                const buyInQuantity = Number((dollars / currentMarketPrice).toFixed(5));
                // only execute the order if user's balance is greater than buy in dollars, 
                if (balance - dollars >= 0) {
                    // if user already owns this stock, increase qty
                    if (stockOwn) {
                        // New total cost = (current average cost per share * current number of shares) + (number of new shares * purchase price per share)
                        const newTotalCost = (stockOwn.avgCost * stockOwn.qty + buyInQuantity * currentMarketPrice);
                        // New total number of shares = current number of shares + number of new shares
                        const newQuantity = Number((stockOwn.qty + buyInQuantity).toFixed(5));
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
                            user: user._id
                        });
                        await Notification.create({
                            text: `Your market order (buy in dollars) to buy $${dollars} of ${symbol} is complete. You've received ${buyInQuantity} shares at an average price of $${currentMarketPrice} per share.`,
                            read: false,
                            user: user._id
                        });
                        // Succesfully place the order, update user's balance
                        user.balance -= dollars;
                        await user.save();
                        // order has been executed, delete it
                        await order.deleteOne();
                        console.log(`Buy order for $${dollars} of ${symbol} executed and deleted.`);
                    };
                };
            } else if (buyOrSell === 'sell' && sharesOrDollars === "shares") {
                // if user owns the stock and the stock shares are greater than or equal to the sell in shares, execute the order
                if (stockOwn && (stockOwn.qty - shares >= 0)) {
                    // if user already owns this stock, decrease qty
                    // New total cost = (avg cost per share before selling * shares held before selling - shares sold * selling price per share)
                    const newTotalCost = (stockOwn.avgCost * stockOwn.qty - shares * currentMarketPrice);
                    // New total number of shares = current number of shares - number of shares sold
                    const newQuantity = Number((stockOwn.qty - shares).toFixed(5));
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
                        user: user._id
                    });
                    await Notification.create({
                        text: `Your market order (sell in shares) to sell ${shares} shares of ${symbol} is complete at an average price of $${currentMarketPrice} per share.`,
                        read: false,
                        user: user._id
                    });
                    // Succesfully place the order, update user's balance
                    user.balance += shares * currentMarketPrice;
                    await user.save();
                    // if the stockOwn's qty is 0, delete the stockOwn instance
                    if (stockOwn.qty === 0) {
                        await StockOwn.deleteOne({ _id: stockOwn._id });
                    };
                    // order has been executed, delete it
                    await order.deleteOne();
                    console.log(`Sell order for ${shares} shares of ${symbol} executed and deleted.`);
                };
            } else if (buyOrSell === 'sell' && sharesOrDollars === "dollars") {
                const sellInQuantity = Number((dollars / currentMarketPrice).toFixed(5));
                // only execute the order if user owns the stock and the stock shares are greater than or equal to the sell in shares
                if (stockOwn && (stockOwn.qty - sellInQuantity >= 0)) {
                    // if user already owns this stock, decrease qty
                    // New total cost = (avg cost per share before selling * shares held before selling - shares sold * selling price per share)
                    const newTotalCost = (stockOwn.avgCost * stockOwn.qty - sellInQuantity * currentMarketPrice);
                    // New total number of shares = current number of shares - number of shares sold
                    const newQuantity = Number((stockOwn.qty - sellInQuantity).toFixed(5));
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
                        user: user._id
                    });
                    await Notification.create({
                        text: `Your market order (sell in dollars) to sell $${dollars} of ${symbol} is complete. You've sold ${sellInQuantity} shares at an average price of $${currentMarketPrice} per share.`,
                        read: false,
                        user: user._id
                    });
                    // Succesfully place the order, update user's balance
                    user.balance += dollars;
                    await user.save();
                    // if the stockOwn's qty is 0, delete the stockOwn instance
                    if (stockOwn.qty === 0) {
                        await StockOwn.deleteOne({ _id: stockOwn._id });
                    };
                    // order has been executed, delete it
                    await order.deleteOne();
                    console.log(`Sell order for $${dollars} of ${symbol} executed and deleted.`);
                };
            }
           

             
        } else if (order.typeOrder === 'limit order') {

        }
    }
})();


