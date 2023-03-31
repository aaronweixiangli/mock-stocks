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
// GET /api/users/stock_shares_own/:symbol
router.get('/stock_shares_own/:symbol', ensureLoggedIn, usersCtrl.getSharesOwn);

module.exports = router;