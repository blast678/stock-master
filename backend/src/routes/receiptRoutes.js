    const express = require('express');
const router = express.Router();
const {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  validateReceipt,
  deleteReceipt
} = require('../controllers/receiptController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getReceipts);
router.get('/:id', protect, getReceipt);
router.post('/', protect, createReceipt);
router.put('/:id', protect, updateReceipt);
router.post('/:id/validate', protect, validateReceipt);
router.delete('/:id', protect, deleteReceipt);

module.exports = router;