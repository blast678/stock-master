const mongoose = require('mongoose');

const purchaseTransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be > 0']
  },
  remarks: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseTransaction', purchaseTransactionSchema);
