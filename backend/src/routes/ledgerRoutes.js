const express = require('express');
const router = express.Router();
const {
  getLedger,
  getProductHistory
} = require('../controllers/ledgerController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getLedger);
router.get('/product/:productId', protect, getProductHistory);

module.exports = router;
