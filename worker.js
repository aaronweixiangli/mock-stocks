// import moment from "moment";
const moment = require('moment');
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
    const history = await History.find({})
    const notification = await Notification.find({}) 
    console.log('history', history)
    console.log('notification', notification)
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
    console.log('prices,', prices)

    for (let order of orders) {
        // Guard. If there is a fetch error, which means that there is no current market price for this stock, then skip this order, continue the loop
        const currentMarketPrice = prices[order.symbol];
        if (!currentMarketPrice) {
            console.log(`No price data available for symbol ${order.symbol}`);
            continue; // move on to the next order
        }
        if (order.orderType === 'market order') {
            // get the current balance of the order's buyer/seller
            const user = await User.findById(order.user);
            const balance = user.balance;
            const symbol = order.symbol;
            const stockOwn = await StockOwn.findOne({ user: user._id, symbol });
            const buyOrSell = order.buyOrSell;
            const sharesOrDollars = order.sharesOrDollars;
            const shares = order.shares;
            const dollars = order.dollars;

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
                // Create notification for user that the order has expired
                await Notification.create({
                    text: `Your market order to ${buyOrSell === 'buy' ? 'buy' : 'sell'} ${shares ? `${shares} shares` : `$${dollars}`} of ${symbol} placed on ${(new Date(order.createdAt)).toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    })} PDT has expired`,
                    read: false,
                    user: user._id
                });
                continue; // delete order and move on to the next order
            } else if ( orderDay !== 5 && orderDay !== 6 && dayDiff > 1 ) {
                await Order.findByIdAndDelete(order._id);
                // Create notification for user that the order has expired
                await Notification.create({
                    text: `Your market order to ${buyOrSell === 'buy' ? 'buy' : 'sell'} ${shares ? `${shares} shares` : `$${dollars}`} of ${symbol} placed on ${(new Date(order.createdAt)).toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    })} PDT has expired`,
                    read: false,
                    user: user._id
                });
                continue; // delete order and move on to the next order
            }

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
                        stockOwn.avgCost = Number(newAvgCost.toFixed(2));
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
                        // Succesfully execute the order, update user's balance
                        user.balance = Number((user.balance - cost).toFixed(2));
                        await user.save();
                        // order has been executed, delete it
                        // await order.deleteOne();
                        // console.log(`Buy order for ${shares} shares of ${symbol} executed and deleted.`);
                        order.status = "inactive";
                        await order.save();
                        continue;
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
                        user.balance = Number((user.balance - cost).toFixed(2));
                        await user.save();
                        // order has been executed, delete it
                        // await order.deleteOne();
                        // console.log(`Buy order for ${shares} shares of ${symbol} executed and deleted.`);
                        order.status = "inactive";
                        await order.save();
                        continue;
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
                        stockOwn.avgCost = Number(newAvgCost.toFixed(2));
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
                        // Succesfully execute the order, update user's balance
                        user.balance = Number((user.balance - dollars).toFixed(2));
                        await user.save();
                        // order has been executed, delete it
                        // await order.deleteOne();
                        // console.log(`Buy order for $${dollars} of ${symbol} executed and deleted.`);
                        order.status = "inactive";
                        await order.save();
                        continue;
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
                    stockOwn.avgCost = Number(newAvgCost.toFixed(2));
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
                    // Succesfully execute the order, update user's balance
                    user.balance = Number((user.balance + shares * currentMarketPrice).toFixed(2));
                    await user.save();
                    // if the stockOwn's qty is 0, delete the stockOwn instance
                    if (stockOwn.qty === 0) {
                        await StockOwn.deleteOne({ _id: stockOwn._id });
                    };
                    // order has been executed, delete it
                    // await order.deleteOne();
                    // console.log(`Sell order for ${shares} shares of ${symbol} executed and deleted.`);
                    order.status = "inactive";
                    await order.save();
                    continue;
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
                    stockOwn.avgCost = Number(newAvgCost.toFixed(2));
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
                    // Succesfully execute the order, update user's balance
                    user.balance = Number((user.balance + dollars).toFixed(2));
                    await user.save();
                    // if the stockOwn's qty is 0, delete the stockOwn instance
                    if (stockOwn.qty === 0) {
                        await StockOwn.deleteOne({ _id: stockOwn._id });
                    };
                    // order has been executed, delete it
                    // await order.deleteOne();
                    // console.log(`Sell order for $${dollars} of ${symbol} executed and deleted.`);
                    order.status = "inactive";
                    await order.save();
                    continue;
                };
            }
        // if order is limit order
        } else if (order.orderType === 'limit order') {
            const user = await User.findById(order.user);
            const balance = user.balance;
            const symbol = order.symbol;
            const stockOwn = await StockOwn.findOne({ user: user._id, symbol });
            const buyOrSell = order.buyOrSell;
            const limitPrice = order.limitPrice;
            const shares = order.shares;
            const expires = order.expires;
            const orderDollarsOnHold = order.orderDollarsOnHold;
            const isMarketOpen = order.isMarketOpen;

            // check if the limit order has expired
            const today = moment().day();
            const orderDay = moment(order.createdAt).day();
            const dayDiff = Math.abs(today - orderDay);
            let orderExpired = false;
            if ( expires === 'good for day' ) {
                if (isMarketOpen) {
                    // if limit order (good for day) placed at market open (Mon-Fri), then delete the order if dayDiff > 1
                    if (dayDiff > 1) {
                        orderExpired = true;
                    }
                } else {
                    // if limit order (good for day) placed on Friday at market closed, then delete the order if today is Tuesday. dayDiff > 3
                    // if limit order (good for day) placed on Saturday at market closed, then delete the order if today is Tuesday. daDiff > 2
                    if ( (orderDay === 5 && dayDiff > 3) || ( orderDay === 6 && dayDiff > 2) ) {
                        orderExpired = true;
                    // for all limit orders (good for day) placed on other days at market closed, delete the order if dayDiff > 1
                    } else if ( orderDay !== 5 && orderDay !== 6 && dayDiff > 1 ) {
                        orderExpired = true;
                    }
                }
            } else {
                // for limit order (good till canceled), delete the order if dayDiff > 90
                if (dayDiff > 90) {
                    orderExpired = true;
                }
            }
            if ( orderExpired ) {
                // if it's a limit buy order, it has a hold on the estimated cost of the order, which is "orderDollarsOnHold".
                // Hence before we delete the order, we need to update user's balanceOnHold (for pending orders) and balance (buying power)
                if (buyOrSell === 'buy') {
                    user.balanceOnHold = Number((user.balanceOnHold - orderDollarsOnHold).toFixed(2));
                    user.balance = Number((user.balance + orderDollarsOnHold).toFixed(2));
                    await user.save();
                } else {
                    // if it's a limit sell order, it has a hold on the selling amount of shares, which is "shares"
                    // Hence before deleting the order, we need to update stockOwn's sharesOnHold, decrease it by shares on hold
                    stockOwn.sharesOnHold -= shares;
                    await stockOwn.save();
                }
                // delete order that's expired
                await Order.findByIdAndDelete(order._id);
                // Create notification for user that the order has expired
                await Notification.create({
                    text: `Your limit order to ${buyOrSell === 'buy' ? 'buy' : 'sell'} ${shares ? `${shares} shares` : `$${dollars}`} of ${symbol} at ${buyOrSell === 'buy' ? 'maximum' : 'minimum'} $${limitPrice} per share placed on ${(new Date(order.createdAt)).toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    })} PDT has expired.`,
                    read: false,
                    user: user._id
                });
                continue; // delete order and move on to the next order
            }
            // For a limit buy order, the order will execute when the user's available balance >= the number of shares being purchased multiplied by the current market price
            // and the current market price is less than or equal to the limit price.
            // Note that balance is the user's buying power and for limit buy order, there is already a reserved orderDollarsOnHold when the order is placed.
            // Hence we want balance + orderDollarsOnHold >= cost
            if ( buyOrSell === 'buy' && ( currentMarketPrice <= limitPrice ) && ( balance + orderDollarsOnHold >= Number((shares * currentMarketPrice).toFixed(2)) ) ) {
                // New total cost = (current average cost per share * current number of shares) + (number of new shares * purchase price per share)
                const newTotalCost = (stockOwn.avgCost * stockOwn.qty + shares * currentMarketPrice);
                // New total number of shares = current number of shares + number of new shares
                const newQuantity = Number((stockOwn.qty + shares).toFixed(5));
                // New average cost per share = New total cost / New total number of shares
                const newAvgCost = newTotalCost / newQuantity;
                stockOwn.qty = newQuantity;
                stockOwn.avgCost = Number(newAvgCost.toFixed(2));
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
                    text: `Your limit order to buy ${shares} shares of ${symbol} at maximum $${limitPrice} has been successfully executed at $${currentMarketPrice} per share.`,
                    read: false,
                    user: user._id
                });
                // Succesfully execute the order, update user's balance. Note that we need to add back the orderDollarsOnHold back to user's buying power
                user.balance = Number((user.balance + orderDollarsOnHold - shares * currentMarketPrice).toFixed(2));
                // also need to decrease user's balanceOnHold (for pending orders)
                user.balanceOnHold = Number((user.balanceOnHold - orderDollarsOnHold).toFixed(2));
                await user.save();
                // order has been executed, delete it
                // await order.deleteOne();
                // console.log(`Buy order for ${shares} shares of ${symbol} executed and deleted.`);
                order.status = "inactive";
                order.orderDollarsOnHold = 0;
                await order.save();
                continue;
            //For a limit sell order, the order will execute when the user's number of shares owned of that stock >= the number of shares being sold 
            //and the current market price is greater than or equal to the limit price.
            } else if ( buyOrSell === 'sell' && stockOwn && ( currentMarketPrice >= limitPrice ) && ( stockOwn.qty - shares >= 0 ) ) {
                // New total cost = (avg cost per share before selling * shares held before selling - shares sold * selling price per share)
                const newTotalCost = (stockOwn.avgCost * stockOwn.qty - shares * currentMarketPrice);
                // New total number of shares = current number of shares - number of shares sold
                const newQuantity = Number((stockOwn.qty - shares).toFixed(5));
                // New average cost per share = New total cost / New total number of shares
                const newAvgCost = newTotalCost / newQuantity;
                stockOwn.qty = newQuantity;
                stockOwn.avgCost = Number(newAvgCost.toFixed(2));
                // Note that when limit sell order is placed, the stockOwn's sharesOnHold is increased by the selling shares
                // user's shares available for sell = stockOwn.qty - stockOwn.sharesOnHold
                // Hence when the limit sell order is executed, sharesOnHold should be decreased by selling shares
                stockOwn.sharesOnHold -= shares;
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
                    text: `Your limit order to sell ${shares} shares of ${symbol} at minimum $${limitPrice} has been successfully executed at $${currentMarketPrice} per share.`,
                    read: false,
                    user: user._id
                });
                // Succesfully execute the order, update user's balance
                user.balance = Number((user.balance + shares * currentMarketPrice).toFixed(2));
                await user.save();
                // if the stockOwn's qty is 0, delete the stockOwn instance
                if (stockOwn.qty === 0) {
                    await StockOwn.deleteOne({ _id: stockOwn._id });
                };
                // order has been executed, delete it
                // await order.deleteOne();
                // console.log(`Sell order for ${shares} shares of ${symbol} executed and deleted.`);
                order.status = "inactive";
                await order.save();
                continue;
            }
        }
    }
})();


