const express = require('express');
const router = express.Router();
const {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  validateDelivery,
  deleteDelivery
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getDeliveries);
router.get('/:id', protect, getDelivery);
router.post('/', protect, createDelivery);
router.put('/:id', protect, updateDelivery);
router.post('/:id/validate', protect, validateDelivery);
router.delete('/:id', protect, deleteDelivery);

module.exports = router;
