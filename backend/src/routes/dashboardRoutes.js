const express = require('express');
const router = express.Router();
const {
  getKPIs,
  getRecentActivities,
  getOperations
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/kpis', protect, getKPIs);
router.get('/activities', protect, getRecentActivities);
router.get('/operations', protect, getOperations);

module.exports = router;
