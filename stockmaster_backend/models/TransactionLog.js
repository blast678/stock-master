import mongoose from 'mongoose';
const TransactionLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  type: { type: String, enum: ['IN','OUT'], required: true },
  quantity: { type: Number, required: true },
  reference: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('TransactionLog', TransactionLogSchema);
