const express = require("express");
const router = express.Router();
const newsCtrl = require("../../controllers/api/news");

// All paths start with '/api/news'

// GET /api/news
router.get("/", newsCtrl.getAllNews);

// GET /api/news/:symbol
router.get("/:symbol", newsCtrl.getStockNews);

module.exports = router;
