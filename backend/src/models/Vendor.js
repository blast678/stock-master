const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: {
    type: String,
    match: [/^[0-9+\-\s]{7,15}$/, 'Invalid phone number']
  },
  address: String
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
