const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const Adjustment = require('../models/Adjustment');
const StockLedger = require('../models/StockLedger');

// @desc    Get Dashboard KPIs
// @route   GET /api/dashboard/kpis
// @access  Private
exports.getDashboardKPIs = async (req, res) => {
  try {
    // Total Products in Stock
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Low Stock Items (where current stock <= reorder level)
    const lowStockItems = await Product.countDocuments({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] },
      isActive: true
    });

    // Out of Stock Items
    const outOfStockItems = await Product.countDocuments({
      currentStock: 0,
      isActive: true
    });

    // Pending Receipts (status: waiting, ready)
    const pendingReceipts = await Receipt.countDocuments({
      status: { $in: ['waiting', 'ready'] }
    });

    // Pending Deliveries (status: waiting, ready)
    const pendingDeliveries = await Delivery.countDocuments({
      status: { $in: ['waiting', 'ready'] }
    });

    // Internal Transfers Scheduled (status: waiting, ready)
    const internalTransfers = await Transfer.countDocuments({
      status: { $in: ['waiting', 'ready'] }
    });

    // Recent operations count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayReceipts = await Receipt.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const todayDeliveries = await Delivery.countDocuments({
      createdAt: { $gte: todayStart }
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockItems,
        outOfStockItems,
        pendingReceipts,
        pendingDeliveries,
        internalTransfers,
        todayReceipts,
        todayDeliveries
      }
    });
  } catch (error) {
    console.error('Dashboard KPIs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// @desc    Get Recent Activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const activities = await StockLedger.find()
      .populate('product', 'name sku')
      .populate('user', 'loginId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Recent Activities Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
};

// @desc    Get Operations Summary with Filters
// @route   GET /api/dashboard/operations
// @access  Private
exports.getOperationsSummary = async (req, res) => {
  try {
    const { type, status, warehouse, category, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (warehouse) filter.warehouse = warehouse;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let operations = [];

    // Fetch based on type filter
    if (!type || type === 'receipts') {
      const receipts = await Receipt.find(filter)
        .populate('supplier', 'name')
        .populate('warehouse', 'name')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      operations.push(...receipts.map(r => ({ ...r, type: 'receipt' })));
    }

    if (!type || type === 'deliveries') {
      const deliveries = await Delivery.find(filter)
        .populate('customer', 'name')
        .populate('warehouse', 'name')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      operations.push(...deliveries.map(d => ({ ...d, type: 'delivery' })));
    }

    if (!type || type === 'transfers') {
      const transfers = await Transfer.find(filter)
        .populate('fromWarehouse', 'name')
        .populate('toWarehouse', 'name')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      operations.push(...transfers.map(t => ({ ...t, type: 'transfer' })));
    }

    if (!type || type === 'adjustments') {
      const adjustments = await Adjustment.find(filter)
        .populate('warehouse', 'name')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      operations.push(...adjustments.map(a => ({ ...a, type: 'adjustment' })));
    }

    // Sort by date
    operations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: operations.slice(0, 20)
    });
  } catch (error) {
    console.error('Operations Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operations'
    });
  }
};

// @desc    Get Stock Statistics
// @route   GET /api/dashboard/stock-stats
// @access  Private
exports.getStockStatistics = async (req, res) => {
  try {
    // Stock by category
    const stockByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$unitPrice'] } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          category: '$categoryInfo.name',
          totalProducts: 1,
          totalStock: 1,
          totalValue: 1
        }
      }
    ]);

    // Stock by warehouse
    const stockByWarehouse = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$stockByWarehouse' },
      {
        $group: {
          _id: '$stockByWarehouse.warehouse',
          totalStock: { $sum: '$stockByWarehouse.quantity' }
        }
      },
      {
        $lookup: {
          from: 'warehouses',
          localField: '_id',
          foreignField: '_id',
          as: 'warehouseInfo'
        }
      },
      { $unwind: '$warehouseInfo' },
      {
        $project: {
          warehouse: '$warehouseInfo.name',
          totalStock: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stockByCategory,
        stockByWarehouse
      }
    });
  } catch (error) {
    console.error('Stock Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock statistics'
    });
  }
};
