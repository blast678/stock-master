import mongoose from 'mongoose';
const PurchaseTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  cost: Number,
  date: { type: Date, default: Date.now },
  remarks: String
}, { timestamps: true });
export default mongoose.model('PurchaseTransaction', PurchaseTransactionSchema);
