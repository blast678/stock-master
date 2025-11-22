const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  unit_of_measure: { type: String, default: 'pcs' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
