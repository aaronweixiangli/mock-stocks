const { parentPort } = require('worker_threads');

const Twelve_Data_API_Key = process.env.Twelve_Data_API_Key;

console.log(Twelve_Data_API_Key);

(async function () {
    await require('./config/database');
    const Order = require('./models/order');
    const orders = await Order.find({status: 'active'});
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
            const price = stock.values[0].open;
            console.log(price);
            prices[symbol] = price;
        } catch (e) {
            // if fetch error for any symbol, break the for of loop
            console.log(e);
            break;
        }
    }
    // for (let order of orders) {
    //     if (order.typeOrder === 'market order') {

    //     }
    // }
})();


