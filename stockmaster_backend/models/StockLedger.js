import mongoose from 'mongoose';
const StockLedgerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  change: { type: Number, required: true },
  balance: { type: Number, required: true },
  refType: String,
  refId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('StockLedger', StockLedgerSchema);
