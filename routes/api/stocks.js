const express = require('express');
const router = express.Router();
const stocksCtrl = require('../../controllers/api/stocks');

// All paths start with '/api/stocks'

// POST /api/stocks/:symbol
router.post('/:symbol', stocksCtrl.getStock);

// GET /api/stocks/:symbol/info
router.get('/:symbol/info', stocksCtrl.getStockInfo);

module.exports = router;