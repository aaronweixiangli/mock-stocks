const express = require('express');
const router = express.Router();
const newsCtrl = require('../../controllers/api/news');

// All paths start with '/api/news'

// GET /api/news
router.get('/', newsCtrl.getAllNews);

module.exports = router;