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

module.exports = router;