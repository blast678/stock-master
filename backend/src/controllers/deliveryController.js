const Delivery = require('../models/Delivery');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');

// @desc    Get all deliveries
// @route   GET /api/delivery
// @access  Private
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('products.product', 'name sku currentStock')
      .populate('user', 'loginId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: deliveries });
  } catch (error) {
    console.error('Get Deliveries Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch deliveries' });
  }
};

// @desc    Get single delivery
// @route   GET /api/delivery/:id
// @access  Private
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('products.product', 'name sku currentStock')
      .populate('user', 'loginId');

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    console.error('Get Delivery Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch delivery' });
  }
};

// @desc    Create delivery
// @route   POST /api/delivery
// @access  Private
exports.createDelivery = async (req, res) => {
  try {
    const { from, to, contact, scheduleDate, deliveryAddress, operationType, products } = req.body;

    // Generate reference
    const count = await Delivery.countDocuments({ from });
    const reference = `${from}/OUT/${String(count + 1).padStart(4, '0')}`;

    // Validate product stock
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found` });
      }
      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.currentStock}`
        });
      }
    }

    const delivery = await Delivery.create({
      reference,
      from,
      to,
      contact,
      scheduleDate,
      deliveryAddress,
      responsible: req.user.loginId,
      operationType,
      products,
      user: req.user._id,
      status: 'Draft'
    });

    const populated = await Delivery.findById(delivery._id)
      .populate('products.product', 'name sku currentStock');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create Delivery Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create delivery' });
  }
};

// @desc    Update delivery
// @route   PUT /api/delivery/:id
// @access  Private
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Cannot update completed delivery' });
    }

    // Validate stock if products changed
    if (req.body.products) {
      for (let item of req.body.products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ success: false, message: `Product not found` });
        }
        if (product.currentStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}`
          });
        }
      }
    }

    const updated = await Delivery.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    }).populate('products.product', 'name sku currentStock');

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Delivery Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update delivery' });
  }
};

// @desc    Validate delivery (Done & update stock)
// @route   POST /api/delivery/:id/validate
// @access  Private
exports.validateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('products.product');

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Delivery already validated' });
    }

    // Deduct stock for each product and create ledger entries
    for (let item of delivery.products) {
      const product = await Product.findById(item.product._id);

      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      product.currentStock -= item.quantity;
      await product.save();

      // Create stock ledger entry
      await StockLedger.create({
        reference: delivery.reference,
        operationType: 'delivery',
        from: delivery.from,
        to: delivery.to,
        contact: delivery.contact,
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        status: delivery.status,
        referenceDoc: delivery._id,
        user: req.user._id
      });
    }

    delivery.status = 'Done';
    await delivery.save();

    const populated = await Delivery.findById(delivery._id)
      .populate('products.product', 'name sku currentStock');

    return res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('Validate Delivery Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to validate delivery' });
  }
};

// @desc    Delete delivery
// @route   DELETE /api/delivery/:id
// @access  Private
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Cannot delete completed delivery' });
    }

    await delivery.deleteOne();
    return res.status(200).json({ success: true, message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Delete Delivery Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete delivery' });
  }
};
