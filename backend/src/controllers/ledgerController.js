const StockLedger = require('../models/StockLedger');

// @desc    Get all stock movements (move history)
// @route   GET /api/ledger
// @access  Private
exports.getLedger = async (req, res) => {
  try {
    const { search, operationType, startDate, endDate } = req.query;

    let query = {};

    // Search by reference or contact
    if (search) {
      query.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by operation type
    if (operationType && operationType !== 'all') {
      query.operationType = operationType;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const ledger = await StockLedger.find(query)
      .populate('product', 'name sku')
      .populate('user', 'loginId')
      .sort({ createdAt: -1 })
      .limit(500);

    res.status(200).json({ success: true, data: ledger });
  } catch (error) {
    console.error('Get Ledger Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch ledger' });
  }
};

// @desc    Get product movement history
// @route   GET /api/ledger/product/:productId
// @access  Private
exports.getProductHistory = async (req, res) => {
  try {
    const history = await StockLedger.find({ product: req.params.productId })
      .populate('product', 'name sku')
      .populate('user', 'loginId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Get Product History Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product history' });
  }
};
