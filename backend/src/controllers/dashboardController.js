const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');

// @desc    Get KPIs
// @route   GET /api/dashboard/kpis
// @access  Private
exports.getKPIs = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalReceipts = await Receipt.countDocuments();
    const totalDeliveries = await Delivery.countDocuments();
    
    // Calculate total stock value
    const products = await Product.find();
    const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);

    // Low stock items (below reorder level)
    const lowStockItems = await Product.countDocuments({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalReceipts,
        totalDeliveries,
        totalStockValue,
        lowStockItems
      }
    });
  } catch (error) {
    console.error('Get KPIs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KPIs'
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const activities = await StockLedger.find()
      .populate('product', 'name sku')
      .populate('user', 'loginId')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get Recent Activities Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
};

// @desc    Get operations summary
// @route   GET /api/dashboard/operations
// @access  Private
exports.getOperations = async (req, res) => {
  try {
    const receipts = {
      draft: await Receipt.countDocuments({ status: 'Draft' }),
      ready: await Receipt.countDocuments({ status: 'Ready' }),
      done: await Receipt.countDocuments({ status: 'Done' })
    };

    const deliveries = {
      draft: await Delivery.countDocuments({ status: 'Draft' }),
      waiting: await Delivery.countDocuments({ status: 'Waiting' }),
      ready: await Delivery.countDocuments({ status: 'Ready' }),
      done: await Delivery.countDocuments({ status: 'Done' })
    };

    res.status(200).json({
      success: true,
      data: {
        receipts,
        deliveries
      }
    });
  } catch (error) {
    console.error('Get Operations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operations'
    });
  }
};
