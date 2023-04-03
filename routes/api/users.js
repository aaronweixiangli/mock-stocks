const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/api/users');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// All paths start with '/api/users'

// POST /api/users (create a user - sign up)
router.post('/', usersCtrl.create);
// POST /api/users/login
router.post('/login', usersCtrl.login);
// PUT /api/users/deposit
router.put('/deposit', ensureLoggedIn, usersCtrl.deposit);
// GET /api/users/balance
router.get('/balance', ensureLoggedIn, usersCtrl.getBalance);
// GET /api/users/balance_on_hold
router.get('/balance_on_hold', ensureLoggedIn, usersCtrl.getBalanceOnHold);
// GET /api/users/stock_shares_own/:symbol
router.get('/stock_shares_own/:symbol', ensureLoggedIn, usersCtrl.getSharesOwn);
// GET /api/users/stock_shares_own/:symbol
router.get('/stock_shares_on_hold/:symbol', ensureLoggedIn, usersCtrl.getSharesOnHold);
// GET /api/users/brokerage_holding
router.get('/brokerage_holding', ensureLoggedIn, usersCtrl.getBrokerageHolding);
// GET /api/users/stocks_holding
router.get('/stocks_holding', ensureLoggedIn, usersCtrl.getStocksHolding);
// GET /api/users/history
router.get('/history', ensureLoggedIn, usersCtrl.getHistory);
// GET /api/users/pending_order
router.get('/pending_order', ensureLoggedIn, usersCtrl.getPendingOrder);
// DELETE /api/users/cancel_order/:id
router.delete('/cancel_order/:id', ensureLoggedIn, usersCtrl.cancelOrder);
// GET /api/users/stock_watch/:symbol
router.get('/stock_watch/:symbol', ensureLoggedIn, usersCtrl.getStockWatch);
// GET /api/users/toggle_stock_watch/:symbol
router.get('/toggle_stock_watch/:symbol', ensureLoggedIn, usersCtrl.toggleStockWatch);
// GET /api/users/stock_watch_list
router.get('/stock_watch_list', ensureLoggedIn, usersCtrl.getStockWatchList);

module.exports = router;