const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const StockOwn = require('../../models/stockOwn');
const History = require('../../models/history');
const Order = require('../../models/order');
const Notification = require('../../models/notification');
const StockWatch = require('../../models/stockWatch');
const Twelve_Data_API_Key = process.env.Twelve_Data_API_Key;

module.exports = {
  create,
  login,
  deposit,
  getBalance,
  getBalanceOnHold,
  getSharesOwn,
  getSharesOnHold,
  getBrokerageHolding,
  getStocksHolding,
  getHistory,
  getPendingOrder,
  cancelOrder,
  getStockWatch,
  toggleStockWatch,
  getStockWatchList,
  getNotification,
  getShowMessage
};

async function getShowMessage(req, res) {
  console.log('getShowMessage controller hits')
  // get user's notification with specific id
  const message = await Notification.findOne({_id: req.params.id});
  // set read to be true
  message.read = true;
  await message.save();
  res.json(message);
}

async function getNotification(req, res) {
  console.log('getNotification controller hits')
  // get user's notication messages
  const notification = await Notification.find({user: req.user._id}).sort({createdAt: -1});
  res.json(notification);
}

async function getStockWatchList(req, res) {
  console.log('getStockWatchList controller hits')
  // get user's stock watch list
  const stockWatchList = await StockWatch.find({user: req.user._id});
  res.json(stockWatchList);
}

async function toggleStockWatch(req, res) {
  console.log('toggleStockWatch controller hits')
  // check if this stock is in user's stockWatch list
  const stockWatch = await StockWatch.findOne({user: req.user._id, symbol: req.params.symbol});
  // it this stock is already in user's stockWatch list, remove it form stockWatch list. Otherwise, add it.
  if (stockWatch) {
    await stockWatch.deleteOne();
  } else {
    await StockWatch.create({
      user: req.user._id,
      symbol: req.params.symbol
    })
  }
  // check if now the stock is still in user's stockWatch list
  const isStockWatch = await StockWatch.findOne({user: req.user._id, symbol: req.params.symbol});
  res.json(isStockWatch ? true : false);
}

async function getStockWatch(req, res) {
  console.log('getStockWatch controller hits')
  // check if this stock is in user's stockWatch list
  const stockWatch = await StockWatch.findOne({user: req.user._id, symbol: req.params.symbol});
  res.json(stockWatch ? true : false);
}

async function cancelOrder(req, res) {
  console.log('cancelOrder controller hits')
  // find the pending order with this id
  const deletedOrder = await Order.findOne({_id: req.params.id, user: req.user._id, status: 'active'});
  // create notification for user
  await Notification.create({
    text: `You have successfully canceled your ${deletedOrder.orderType} to ${deletedOrder.buyOrSell} ${deletedOrder.orderType === 'market order' ? 
    (deletedOrder.sharesOrDollars === 'shares' ? `${deletedOrder.shares} shares of ${deletedOrder.symbol}` : `$${deletedOrder.dollars} of ${deletedOrder.symbol}`) 
    : `${deletedOrder.shares} shares of ${deletedOrder.symbol} at ${deletedOrder.buyOrSell === 'buy' ? 'maximum' : 'minimum'} $${deletedOrder.limitPrice}.`}`,
    read: false,
    user: req.user._id
  })
  await deletedOrder.deleteOne();
  const updatedPendingOrder = await Order.find({user: req.user._id, status: 'active'}).sort({createdAt: -1});
  res.json(updatedPendingOrder);
}

async function getPendingOrder(req, res) {
  console.log('getPendingOrder controller hits')
  // get the user's pending orders and sort by created date in descending order
  const pendingOrder = await Order.find({user: req.user._id, status: 'active'}).sort({createdAt: -1});
  res.json(pendingOrder);
}

async function getHistory(req, res) {
  console.log('getHistory controller hits')
  // get the user's transaction history and deposit history and sort by created date in descending order
  const history = await History.find({user: req.user._id}).sort({createdAt: -1});
  res.json(history);
}

async function getStocksHolding(req, res) {
  console.log('getStocksHolding controller hits')
  // get the user's stocks holdings and stock's current market price
  const stockOwn = await StockOwn.find({user: req.user._id});
  let brokerageHolding = 0;
  let currentMarketPrices = {};
  try {
    for (let stock of stockOwn) {
      const symbol = stock.symbol;
      const qty = stock.qty;
      const stockDataAPI = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
      const currentMarketPrice = Number(stockDataAPI.values[0].open);
      currentMarketPrices[symbol] = currentMarketPrice;
      brokerageHolding += qty * currentMarketPrice
    }
    res.json({
      brokerageHolding: Number(brokerageHolding.toFixed(2)),
      stockOwn,
      currentMarketPrices,
    });
  } catch {
    // API issue
    res.json('Network Error. Try refreshing the page later.');
  }
}

async function getBrokerageHolding(req, res) {
  console.log('getBrokerageHolding controller hits')
  // get the user's brokerage holdings
  const stockOwn = await StockOwn.find({user: req.user._id});
  let brokerageHolding = 0;
  try {
    for (let stock of stockOwn) {
      const symbol = stock.symbol;
      const qty = stock.qty;
      const stockDataAPI = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=1min&symbol=${symbol}&format=JSON&dp=2`).then(res => res.json());
      const currentMarketPrice = Number(stockDataAPI.values[0].open);
      brokerageHolding += qty * currentMarketPrice
    }
    res.json(Number(brokerageHolding.toFixed(2)));
  } catch {
    // API issue
    res.json('Unable to retrieve brokerage holdings due to a network error.');
  }
}

async function getSharesOnHold(req, res) {
  console.log('getSharesOnHold controller hits')
  // get the user's sharesOwn for the symbol
  const stockOwn = await StockOwn.findOne({user: req.user._id, symbol: req.params.symbol});
  const sharesOnHold = stockOwn ? stockOwn.sharesOnHold : 0;
  res.json(sharesOnHold);
}

async function getSharesOwn(req, res) {
  console.log('getSharesOwn controller hits')
  // get the user's sharesOwn for the symbol
  const stockOwn = await StockOwn.findOne({user: req.user._id, symbol: req.params.symbol});
  const sharesOwn = stockOwn ? stockOwn.qty : 0;
  res.json(sharesOwn);
}

async function getBalance(req, res) {
  try {
    // get the user's balance
    const user = await User.findOne({_id: req.user._id});
    const balance = user.balance;
    res.json(balance);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getBalanceOnHold(req, res) {
  try {
    // get the user's balanceOnHold (for pending orders)
    const user = await User.findOne({_id: req.user._id});
    const balanceOnHold = user.balanceOnHold;
    res.json(balanceOnHold);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function deposit(req, res) {
  try {
    // update the user's balance
    const user = await User.findOne({_id: req.user._id});
    // round the balance up to two decimal digits
    user.balance = Number((user.balance + parseFloat(req.body.amount)).toFixed(2));
    user.save();
    await History.create({
      symbol: 'User Deposit',
      type: 'stock',
      category: 'deposit',
      deposit: Number((parseFloat(req.body.amount)).toFixed(2)),
      user
    });
    await Notification.create({
      text: `Congratulations! Your deposit of ${req.body.amount} has been initiated. The funds are expected to be reflected in your MockStocks brokerage account by the end of today.`,
      read: false,
      user,
    })
    res.json(user.balance);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function create(req, res) {
  try {
    // Add the user to the db
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json('Bad Credentials');
  }
}

/*--- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}