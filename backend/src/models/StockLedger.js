const mongoose = require('mongoose');

const StockLedgerSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  operationType: {
    type: String,
    enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
    required: true
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  contact: { type: String, default: '' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'Ready' },
  referenceDoc: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockLedger', StockLedgerSchema);
