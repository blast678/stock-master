import mongoose from 'mongoose';
const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String
}, { timestamps: true });
export default mongoose.model('Location', LocationSchema);
