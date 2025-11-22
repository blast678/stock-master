const Receipt = require('../models/Receipt');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate('products.product', 'name sku currentStock')
      .populate('user', 'loginId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    console.error('Get Receipts Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch receipts' });
  }
};

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
exports.getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('products.product', 'name sku currentStock')
      .populate('user', 'loginId');

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    console.error('Get Receipt Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch receipt' });
  }
};

// @desc    Create receipt
// @route   POST /api/receipts
// @access  Private
exports.createReceipt = async (req, res) => {
  try {
    const { from, to, contact, scheduleDate, products } = req.body;

    // Generate reference
    const count = await Receipt.countDocuments({ to });
    const reference = `${to}/IN/${String(count + 1).padStart(4, '0')}`;

    const receipt = await Receipt.create({
      reference,
      from,
      to,
      contact,
      scheduleDate,
      responsible: req.user.loginId,
      products,
      user: req.user._id,
      status: 'Draft'
    });

    const populated = await Receipt.findById(receipt._id)
      .populate('products.product', 'name sku currentStock');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create Receipt Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create receipt' });
  }
};

// @desc    Update receipt
// @route   PUT /api/receipts/:id
// @access  Private
exports.updateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    if (receipt.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Cannot update completed receipt' });
    }

    const updated = await Receipt.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    }).populate('products.product', 'name sku currentStock');

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Receipt Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update receipt' });
  }
};

// @desc    Validate receipt (Done & update stock)
// @route   POST /api/receipts/:id/validate
// @access  Private
exports.validateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate('products.product');

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    if (receipt.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Receipt already validated' });
    }

    // Add stock for each product and create ledger entries
    for (let item of receipt.products) {
      const product = await Product.findById(item.product._id);
      product.currentStock += item.quantity;
      await product.save();

      // Create stock ledger entry
      await StockLedger.create({
        reference: receipt.reference,
        operationType: 'receipt',
        from: receipt.from,
        to: receipt.to,
        contact: receipt.contact,
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        status: 'Ready',
        referenceDoc: receipt._id,
        user: req.user._id
      });
    }

    receipt.status = 'Done';
    await receipt.save();

    const populated = await Receipt.findById(receipt._id)
      .populate('products.product', 'name sku currentStock');

    return res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Validate Receipt Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to validate receipt' });
  }
};

// @desc    Delete receipt
// @route   DELETE /api/receipts/:id
// @access  Private
exports.deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    if (receipt.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Cannot delete completed receipt' });
    }

    await receipt.deleteOne();
    return res.status(200).json({ success: true, message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Delete Receipt Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete receipt' });
  }
};
