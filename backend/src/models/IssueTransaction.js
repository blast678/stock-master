const mongoose = require('mongoose');

const issueTransactionSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be > 0']
  },
  issued_to: {
    type: String,
    required: true,
    trim: true
  },
  remarks: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('IssueTransaction', issueTransactionSchema);
