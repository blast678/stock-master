import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  unit_of_measure: { type: String, default: 'pcs' },
  sku: String
}, { timestamps: true });
export default mongoose.model('Product', ProductSchema);
