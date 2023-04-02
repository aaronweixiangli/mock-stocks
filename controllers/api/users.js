const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const StockOwn = require('../../models/stockOwn');
const Twelve_Data_API_Key = process.env.Twelve_Data_API_Key;

module.exports = {
  create,
  login,
  deposit,
  getBalance,
  getBalanceOnHold,
  getSharesOwn,
  getSharesOnHold,
  getBrokerageHolding
};

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
    res.json('Unable to retrieve brokerage holdings due to a network issue.');
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