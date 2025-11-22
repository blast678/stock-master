const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    unitOfMeasure: {
      type: String,
      enum: ['pcs', 'kg', 'ltr', 'box', 'unit'],
      default: 'pcs'
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
