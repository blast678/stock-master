import mongoose from 'mongoose';
const IssueTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  issued_to: String,
  date: { type: Date, default: Date.now },
  remarks: String
}, { timestamps: true });
export default mongoose.model('IssueTransaction', IssueTransactionSchema);
