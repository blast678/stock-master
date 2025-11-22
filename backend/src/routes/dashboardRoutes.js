const express = require('express');
const router = express.Router();
const {
  getDashboardKPIs,
  getRecentActivities,
  getOperationsSummary,
  getStockStatistics
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/kpis', protect, getDashboardKPIs);
router.get('/activities', protect, getRecentActivities);
router.get('/operations', protect, getOperationsSummary);
router.get('/stock-stats', protect, getStockStatistics);

module.exports = router;
